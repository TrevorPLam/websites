/**
 * @file packages/infrastructure/queue/workers/crmSyncWorker.ts
 * @summary CRM synchronisation worker — processes crm-sync jobs from the queue.
 * @description Dequeues and executes CRM contact create / update / delete
 *   operations using the {@link CrmPort} hexagonal adapter.  On success the
 *   job is acked; on failure it is nacked so the queue can retry with
 *   exponential backoff (up to `maxAttempts`).
 *
 *   The worker is intentionally side-effect-free beyond the CRM adapter call,
 *   making it safe to unit-test with a mock adapter and an
 *   {@link InMemoryJobQueue}.
 *
 * @security
 *   - `tenantId` is validated by the job schema before the worker runs.
 *   - Raw API credentials are never passed through the queue payload; they are
 *     resolved by the CRM adapter from environment variables.
 *   - PII fields (email, phone) are never written to log output; only the job
 *     id, tenant, and operation are logged.
 * @requirements TASK-012
 */

import type { JobQueue } from '../client';
import { CrmSyncJobPayloadSchema, CRM_SYNC_JOB_TYPE } from '../jobs/crm-sync-job';

// ─── CRM adapter port (minimal surface) ─────────────────────────────────────

/** Minimal CRM-management contract used by this worker. */
export interface CrmAdapter {
  createContact(params: {
    tenantId: string;
    contactId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    custom?: Record<string, string>;
  }): Promise<void>;
  updateContact(params: {
    tenantId: string;
    contactId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    custom?: Record<string, string>;
  }): Promise<void>;
  deleteContact(params: { tenantId: string; contactId: string }): Promise<void>;
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export interface CrmSyncWorkerOptions {
  /** Queue implementation to dequeue from. */
  queue: JobQueue;
  /** CRM adapter (e.g. HubSpot, GoHighLevel, in-memory). */
  crmAdapter: CrmAdapter;
  /** Optional logger; defaults to console. */
  logger?: {
    info(msg: string, meta?: Record<string, unknown>): void;
    error(msg: string, meta?: Record<string, unknown>): void;
  };
}

/**
 * Process a single CRM sync job from the queue.
 * Designed to be called inside a polling loop or a scheduled cron handler.
 *
 * @returns `true` if a job was processed (success or failure), `false` if the
 *   queue was empty.
 */
export async function processCrmSyncJob(options: CrmSyncWorkerOptions): Promise<boolean> {
  const { queue, crmAdapter, logger = console } = options;

  const job = await queue.dequeue(CRM_SYNC_JOB_TYPE);
  if (!job) return false;

  const parseResult = CrmSyncJobPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    logger.error('[crmSyncWorker] Invalid payload', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, `Invalid payload: ${parseResult.error.message}`);
    return true;
  }

  const { contactId, operation, fields } = parseResult.data;

  try {
    switch (operation) {
      case 'create':
        await crmAdapter.createContact({
          tenantId: job.tenantId,
          contactId,
          ...fields,
        });
        break;
      case 'update':
        await crmAdapter.updateContact({
          tenantId: job.tenantId,
          contactId,
          ...fields,
        });
        break;
      case 'delete':
        await crmAdapter.deleteContact({ tenantId: job.tenantId, contactId });
        break;
    }

    logger.info('[crmSyncWorker] CRM synced', {
      jobId: job.id,
      tenantId: job.tenantId,
      operation,
    });
    await queue.ack(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[crmSyncWorker] CRM sync failed', {
      jobId: job.id,
      tenantId: job.tenantId,
      operation,
    });
    await queue.nack(job.id, message);
  }

  return true;
}
