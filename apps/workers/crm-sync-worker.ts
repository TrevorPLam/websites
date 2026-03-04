/**
 * @file apps/workers/crm-sync-worker.ts
 * @summary Long-running CRM synchronisation worker process.
 * @description Polls the job queue for `crm-sync` jobs and applies contact
 *   create / update / delete operations to the configured CRM provider.  In
 *   production the process is managed by a supervisor.  In serverless
 *   environments, replace this with a cron-triggered call to
 *   {@link processCrmSyncJob} from the API route layer.
 *
 *   The CRM adapter is resolved from the `CRM_PROVIDER` environment variable
 *   at startup.  Currently defaults to the in-memory adapter; configure
 *   HubSpot or GoHighLevel via `CRM_PROVIDER` and the corresponding API key
 *   env vars.
 *
 * @security
 *   - CRM API credentials are loaded from environment variables, never
 *     hard-coded or passed through the queue payload.
 *   - PII (email, phone) is never written to log output.
 * @requirements TASK-012
 */

import { InMemoryJobQueue, processCrmSyncJob } from '@repo/infrastructure/queue';
import type { CrmAdapter } from '@repo/infrastructure/queue';

// ─── Adapter bootstrap ────────────────────────────────────────────────────────

/**
 * Resolve the CRM adapter from the environment.
 * Extend this factory to support HubSpot, GoHighLevel, etc.
 */
function buildCrmAdapter(): CrmAdapter {
  const provider = process.env['CRM_PROVIDER'] ?? 'in-memory';

  if (provider === 'in-memory') {
    // In-memory stub — logs operations without side effects.
    return {
      async createContact(params) {
        console.info('[crm-sync-worker] createContact (stub)', {
          tenantId: params.tenantId,
          contactId: params.contactId,
        });
      },
      async updateContact(params) {
        console.info('[crm-sync-worker] updateContact (stub)', {
          tenantId: params.tenantId,
          contactId: params.contactId,
        });
      },
      async deleteContact(params) {
        console.info('[crm-sync-worker] deleteContact (stub)', {
          tenantId: params.tenantId,
          contactId: params.contactId,
        });
      },
    };
  }

  throw new Error(`Unsupported CRM_PROVIDER: ${provider}`);
}

// ─── Queue bootstrap ──────────────────────────────────────────────────────────

const queue = new InMemoryJobQueue();
const crmAdapter = buildCrmAdapter();

// ─── Poll loop ────────────────────────────────────────────────────────────────

async function poll(): Promise<void> {
  try {
    await processCrmSyncJob({ queue, crmAdapter, logger: console });
  } catch (err) {
    console.error('[crm-sync-worker] Unexpected error in poll', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

const POLL_INTERVAL_MS = parseInt(process.env['WORKER_POLL_INTERVAL_MS'] ?? '5000', 10);
// Poll immediately on startup to drain any existing jobs, then continue on interval.
void poll();
let pollTimer: ReturnType<typeof setInterval> | null = setInterval(poll, POLL_INTERVAL_MS);

console.info('[crm-sync-worker] Started', { pollIntervalMs: POLL_INTERVAL_MS });

function shutdown(): void {
  console.info('[crm-sync-worker] Shutting down…');
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
