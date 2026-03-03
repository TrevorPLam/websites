/**
 * @file packages/infrastructure/queue/jobs/webhook-job.ts
 * @summary Webhook retry job schema and factory.
 * @description Defines the Zod-validated payload for asynchronous outbound
 *   webhook delivery with exponential backoff. Failed webhooks are re-enqueued
 *   by the {@link webhookWorker} up to `maxAttempts` times before being
 *   dead-lettered for manual inspection.
 *
 * @security
 *   - `tenantId` scoping prevents cross-tenant webhook delivery.
 *   - `signingSecret` is excluded from all log output (see worker).
 * @requirements PROD-004, TASK-012
 */

import { z } from 'zod';
import type { EnqueueInput } from '../client';

// ─── Payload schema ───────────────────────────────────────────────────────────

export const WebhookJobPayloadSchema = z.object({
  /** Destination URL for the outbound webhook. */
  url: z.string().url(),
  /** HTTP method (POST is strongly preferred for webhooks). */
  method: z.enum(['POST', 'PUT', 'PATCH']).default('POST'),
  /** Request headers to include. */
  headers: z.record(z.string()).default({}),
  /** JSON-serialisable request body. */
  body: z.record(z.unknown()),
  /** Event type label included in the `X-Webhook-Event` header. */
  eventType: z.string().min(1),
  /** HMAC-SHA256 signing secret. Never logged. */
  signingSecret: z.string().min(1).optional(),
  /** Original webhook source event ID for idempotency tracking. */
  sourceEventId: z.string().min(1).optional(),
  /** Correlation ID for distributed tracing. */
  correlationId: z.string().uuid().optional(),
});

export type WebhookJobPayload = z.infer<typeof WebhookJobPayloadSchema>;

// ─── Job type constant ────────────────────────────────────────────────────────

export const WEBHOOK_JOB_TYPE = 'webhook-retry' as const;

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Build an {@link EnqueueInput} for an outbound webhook delivery job.
 *
 * @param tenantId - Tenant that owns the outbound webhook endpoint.
 * @param payload  - Validated webhook delivery fields.
 * @returns Queue enqueue input ready to pass to {@link JobQueue.enqueue}.
 */
export function createWebhookJob(tenantId: string, payload: WebhookJobPayload): EnqueueInput {
  return {
    type: WEBHOOK_JOB_TYPE,
    tenantId,
    payload: WebhookJobPayloadSchema.parse(payload) as Record<string, unknown>,
    maxAttempts: 5,
  };
}
