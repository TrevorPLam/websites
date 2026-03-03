/**
 * @file packages/infrastructure/queue/workers/webhookWorker.ts
 * @summary Outbound webhook delivery worker with HMAC-SHA256 signing.
 * @description Dequeues webhook retry jobs and delivers them to external
 *   endpoints using the Fetch API. Supports optional HMAC-SHA256 payload
 *   signing (appended as `X-Webhook-Signature`) and exponential backoff
 *   through the job queue's `nack` / `maxAttempts` mechanism.
 *
 *   The signing secret is consumed but never logged.
 *
 * @security
 *   - HMAC-SHA256 signature uses `crypto.subtle` (Web Crypto API) — no
 *     third-party crypto dependency required, Edge-compatible.
 *   - `signingSecret` is excluded from all log output.
 *   - Destination URLs are validated by the job schema before processing.
 * @requirements PROD-004, TASK-012
 */

import type { JobQueue } from '../client';
import { WebhookJobPayloadSchema, WEBHOOK_JOB_TYPE } from '../jobs/webhook-job';

// ─── HMAC helper ─────────────────────────────────────────────────────────────

/**
 * Compute an HMAC-SHA256 hex signature for a payload string.
 * Uses the Web Crypto API — compatible with Edge Runtime and Node ≥ 20.
 */
async function hmacSign(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export interface WebhookWorkerOptions {
  /** Queue implementation to dequeue from. */
  queue: JobQueue;
  /** Optional logger; defaults to console. */
  logger?: { info: (msg: string, meta?: Record<string, unknown>) => void; error: (msg: string, meta?: Record<string, unknown>) => void };
  /** Override the fetch implementation (useful for tests). */
  fetchImpl?: typeof fetch;
}

/**
 * Process a single webhook retry job from the queue.
 * Designed to be called inside a polling loop or a scheduled cron handler.
 *
 * @returns `true` if a job was processed (success or failure), `false` if the
 *   queue was empty.
 */
export async function processWebhookJob(options: WebhookWorkerOptions): Promise<boolean> {
  const { queue, logger = console, fetchImpl = fetch } = options;

  const job = await queue.dequeue(WEBHOOK_JOB_TYPE);
  if (!job) return false;

  const parseResult = WebhookJobPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const detail = parseResult.error.message;
    logger.error('[webhookWorker] Invalid payload', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, `Invalid payload: ${detail}`);
    return true;
  }

  const { url, method, headers, body, eventType, signingSecret, correlationId } = parseResult.data;

  const bodyString = JSON.stringify(body);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': eventType,
    ...headers,
  };

  if (correlationId) {
    requestHeaders['X-Correlation-Id'] = correlationId;
  }

  if (signingSecret) {
    const signature = await hmacSign(signingSecret, bodyString);
    requestHeaders['X-Webhook-Signature'] = `sha256=${signature}`;
  }

  try {
    const response = await fetchImpl(url, {
      method,
      headers: requestHeaders,
      body: bodyString,
    });

    if (!response.ok) {
      const statusText = response.statusText;
      logger.error('[webhookWorker] Delivery failed', {
        jobId: job.id,
        tenantId: job.tenantId,
        status: response.status,
      });
      await queue.nack(job.id, `HTTP ${response.status}: ${statusText}`);
      return true;
    }

    logger.info('[webhookWorker] Delivered', {
      jobId: job.id,
      tenantId: job.tenantId,
      status: response.status,
    });
    await queue.ack(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[webhookWorker] Network error', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, message);
  }

  return true;
}
