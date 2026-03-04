/**
 * @file packages/infrastructure/queue/jobs/crm-sync-job.ts
 * @summary CRM contact-sync job schema and factory.
 * @description Defines the Zod-validated payload for asynchronous CRM
 *   synchronisation.  CRM sync jobs are enqueued after a lead is created or
 *   updated and processed by {@link crmSyncWorker} in the background, keeping
 *   CRM state consistent without blocking the HTTP response path.
 *
 * @security
 *   - `tenantId` scoping prevents cross-tenant CRM writes.
 *   - Raw API credentials are never stored in the payload; the worker
 *     resolves them from environment variables at process time.
 * @requirements TASK-012
 */

import { z } from 'zod';
import type { EnqueueInput } from '../client';

// ─── Payload schema ───────────────────────────────────────────────────────────

export const CrmSyncOperationSchema = z.enum(['create', 'update', 'delete']);
export type CrmSyncOperation = z.infer<typeof CrmSyncOperationSchema>;

export const CrmSyncJobPayloadSchema = z.object({
  /** CRM contact / lead identifier within the tenant's CRM instance. */
  contactId: z.string().min(1),
  /** The operation to perform on the remote CRM system. */
  operation: CrmSyncOperationSchema,
  /** Contact fields to sync.  Only the fields being changed need be present. */
  fields: z.object({
    email: z.string().email().optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    phone: z.string().max(30).optional(),
    company: z.string().max(200).optional(),
    /** Arbitrary key-value pairs for custom CRM fields. */
    custom: z.record(z.string()).optional(),
  }),
  /** CRM provider to target (resolved from tenant settings when absent). */
  provider: z.enum(['hubspot', 'ghl', 'in-memory']).optional(),
  /** Correlation ID for distributed tracing. */
  correlationId: z.string().uuid().optional(),
});

export type CrmSyncJobPayload = z.infer<typeof CrmSyncJobPayloadSchema>;

// ─── Job type constant ────────────────────────────────────────────────────────

export const CRM_SYNC_JOB_TYPE = 'crm-sync' as const;

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Build an {@link EnqueueInput} for a CRM sync job.
 *
 * @param tenantId - Tenant that owns the contact being synced.
 * @param payload  - Validated CRM sync fields.
 * @returns Queue enqueue input ready to pass to {@link JobQueue.enqueue}.
 */
export function createCrmSyncJob(tenantId: string, payload: CrmSyncJobPayload): EnqueueInput {
  return {
    type: CRM_SYNC_JOB_TYPE,
    tenantId,
    payload: CrmSyncJobPayloadSchema.parse(payload) as Record<string, unknown>,
    maxAttempts: 3,
  };
}
