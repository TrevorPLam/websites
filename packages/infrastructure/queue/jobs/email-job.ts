/**
 * @file packages/infrastructure/queue/jobs/email-job.ts
 * @summary Email delivery job schema and factory.
 * @description Defines the Zod-validated payload for asynchronous email sends.
 *   Email jobs are enqueued by Server Actions and processed by
 *   {@link emailWorker} in the background, preventing HTTP timeouts on
 *   transactional email delivery.
 *
 * @security
 *   - `tenantId` is required to prevent cross-tenant email spoofing.
 *   - PII fields (`to`, `subject`) are never logged beyond this layer.
 * @requirements PROD-004, TASK-012
 */

import { z } from 'zod';
import type { EnqueueInput } from '../client';

// ─── Payload schema ───────────────────────────────────────────────────────────

export const EmailJobPayloadSchema = z.object({
  /** Recipient email address. */
  to: z.string().email(),
  /** Email subject line. */
  subject: z.string().min(1).max(998),
  /** Plaintext body fallback. */
  text: z.string().min(1),
  /** Optional HTML body. */
  html: z.string().optional(),
  /** Optional reply-to address. */
  replyTo: z.string().email().optional(),
  /** Correlation ID for distributed tracing. */
  correlationId: z.string().uuid().optional(),
});

export type EmailJobPayload = z.infer<typeof EmailJobPayloadSchema>;

// ─── Job type constant ────────────────────────────────────────────────────────

export const EMAIL_JOB_TYPE = 'email' as const;

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Build an {@link EnqueueInput} for an email delivery job.
 * The payload is validated before being handed to the queue.
 *
 * @param tenantId - Tenant that owns the outgoing email.
 * @param payload  - Validated email fields.
 * @returns Queue enqueue input ready to pass to {@link JobQueue.enqueue}.
 */
export function createEmailJob(tenantId: string, payload: EmailJobPayload): EnqueueInput {
  return {
    type: EMAIL_JOB_TYPE,
    tenantId,
    payload: EmailJobPayloadSchema.parse(payload) as Record<string, unknown>,
    maxAttempts: 5,
  };
}
