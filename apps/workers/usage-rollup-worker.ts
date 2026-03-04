/**
 * @file apps/workers/usage-rollup-worker.ts
 * @summary Long-running usage rollup worker process.
 * @description Polls the job queue for `usage-rollup` jobs and aggregates
 *   per-tenant usage counters into billing-period summaries.  In production
 *   the process is managed by a supervisor or triggered by a cron schedule.
 *
 *   The aggregator implementation is a logged stub by default; swap it for a
 *   real Tinybird / Supabase aggregator once the analytics pipeline is live
 *   (see TASK-TINYBIRD-001).
 *
 * @security
 *   - No PII is written to log output; only job id, tenant, and period are
 *     logged.
 *   - Aggregator credentials are loaded from environment variables.
 * @requirements TASK-012
 */

import {
  InMemoryJobQueue,
  processUsageRollupJob,
} from '@repo/infrastructure/queue';
import type { UsageAggregator, RollupResult } from '@repo/infrastructure/queue';

// ─── Aggregator bootstrap ─────────────────────────────────────────────────────

/**
 * Stub aggregator — logs the rollup parameters and returns a placeholder
 * result.  Replace with a real Tinybird / Supabase implementation once
 * TASK-TINYBIRD-001 is complete.
 */
const aggregator: UsageAggregator = {
  async rollup(params): Promise<RollupResult> {
    const windowStart = params.windowStart ?? new Date().toISOString();
    // Compute a synthetic window end based on period for the stub.
    const end = new Date(windowStart);
    switch (params.period) {
      case 'hourly':
        end.setHours(end.getHours() + 1);
        break;
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
    }

    console.info('[usage-rollup-worker] Rollup (stub)', {
      tenantId: params.tenantId,
      period: params.period,
      windowStart,
      metrics: params.metrics ?? 'all',
    });

    return {
      metricCount: params.metrics?.length ?? 0,
      windowStart,
      windowEnd: end.toISOString(),
    };
  },
};

// ─── Queue bootstrap ──────────────────────────────────────────────────────────

const queue = new InMemoryJobQueue();

// ─── Poll loop ────────────────────────────────────────────────────────────────

async function poll(): Promise<void> {
  try {
    await processUsageRollupJob({ queue, aggregator, logger: console });
  } catch (err) {
    console.error('[usage-rollup-worker] Unexpected error in poll', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

const POLL_INTERVAL_MS = parseInt(process.env['WORKER_POLL_INTERVAL_MS'] ?? '10000', 10);
// Poll immediately on startup to drain any existing jobs, then continue on interval.
void poll();
let pollTimer: ReturnType<typeof setInterval> | null = setInterval(poll, POLL_INTERVAL_MS);

console.info('[usage-rollup-worker] Started', { pollIntervalMs: POLL_INTERVAL_MS });

function shutdown(): void {
  console.info('[usage-rollup-worker] Shutting down…');
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
