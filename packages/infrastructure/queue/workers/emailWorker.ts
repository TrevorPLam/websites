/**
 * @file packages/infrastructure/queue/workers/emailWorker.ts
 * @summary Email delivery worker — processes email jobs from the queue.
 * @description Dequeues and executes email delivery jobs using the
 *   {@link EmailPort} hexagonal adapter. On success the job is acked; on
 *   failure it is nacked so the queue can retry with exponential backoff (up to
 *   `maxAttempts`). Dead-lettered jobs can be inspected via the queue's
 *   {@link JobQueue.listByTenant} with `status: "dead_lettered"`.
 *
 *   The worker is intentionally side-effect-free beyond the email adapter call,
 *   making it safe to unit-test with a mock adapter and an
 *   {@link InMemoryJobQueue}.
 *
 * @security
 *   - `to` address is validated by the job schema before the worker runs.
 *   - PII fields are never written to logs; only the job id and tenant are logged.
 * @requirements PROD-004, TASK-012
 */

import type { JobQueue } from '../client';
import { EmailJobPayloadSchema, EMAIL_JOB_TYPE } from '../jobs/email-job';

// ─── Email adapter port (minimal surface) ────────────────────────────────────

/** Minimal email-sending contract used by the worker. */
export interface EmailAdapter {
  send(params: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
  }): Promise<void>;
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export interface EmailWorkerOptions {
  /** Queue implementation to dequeue from. */
  queue: JobQueue;
  /** Email adapter (e.g. Resend, SendGrid, Postmark). */
  emailAdapter: EmailAdapter;
  /** Optional logger; defaults to console. */
  logger?: { info: (msg: string, meta?: Record<string, unknown>) => void; error: (msg: string, meta?: Record<string, unknown>) => void };
}

/**
 * Process a single email job from the queue.
 * Designed to be called inside a polling loop or a scheduled cron handler.
 *
 * @returns `true` if a job was processed (success or failure), `false` if the
 *   queue was empty.
 */
export async function processEmailJob(options: EmailWorkerOptions): Promise<boolean> {
  const { queue, emailAdapter, logger = console } = options;

  const job = await queue.dequeue(EMAIL_JOB_TYPE);
  if (!job) return false;

  const parseResult = EmailJobPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const detail = parseResult.error.message;
    logger.error('[emailWorker] Invalid payload', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, `Invalid payload: ${detail}`);
    return true;
  }

  const { to, subject, text, html, replyTo } = parseResult.data;

  try {
    await emailAdapter.send({ to, subject, text, html, replyTo });
    logger.info('[emailWorker] Email sent', { jobId: job.id, tenantId: job.tenantId });
    await queue.ack(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[emailWorker] Send failed', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, message);
  }

  return true;
}
