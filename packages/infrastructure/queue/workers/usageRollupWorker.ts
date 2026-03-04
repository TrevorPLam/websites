/**
 * @file packages/infrastructure/queue/workers/usageRollupWorker.ts
 * @summary Usage rollup worker — processes usage-rollup jobs from the queue.
 * @description Dequeues and executes usage aggregation for the requested
 *   billing period, consolidating per-event counters into period summaries
 *   via the {@link UsageAggregator} port.  On success the job is acked; on
 *   failure it is nacked so the queue can retry (up to `maxAttempts`).
 *
 *   The worker is intentionally side-effect-free beyond the aggregator call,
 *   making it safe to unit-test with a mock aggregator and an
 *   {@link InMemoryJobQueue}.
 *
 * @security
 *   - `tenantId` is validated by the job schema before the worker runs.
 *   - No PII is written to log output; only job id, tenant, and period are
 *     logged.
 * @requirements TASK-012
 */

import type { JobQueue } from '../client';
import {
  UsageRollupJobPayloadSchema,
  USAGE_ROLLUP_JOB_TYPE,
  type UsageRollupPeriod,
} from '../jobs/usage-rollup-job';

// ─── Aggregator port (minimal surface) ───────────────────────────────────────

/** Result returned by the aggregator for a completed rollup. */
export interface RollupResult {
  /** Number of distinct metric series aggregated. */
  metricCount: number;
  /** ISO-8601 start of the rolled-up window. */
  windowStart: string;
  /** ISO-8601 end of the rolled-up window. */
  windowEnd: string;
}

/** Minimal usage-aggregation contract used by this worker. */
export interface UsageAggregator {
  rollup(params: {
    tenantId: string;
    period: UsageRollupPeriod;
    windowStart?: string;
    metrics?: string[];
  }): Promise<RollupResult>;
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export interface UsageRollupWorkerOptions {
  /** Queue implementation to dequeue from. */
  queue: JobQueue;
  /** Usage aggregator implementation. */
  aggregator: UsageAggregator;
  /** Optional logger; defaults to console. */
  logger?: {
    info(msg: string, meta?: Record<string, unknown>): void;
    error(msg: string, meta?: Record<string, unknown>): void;
  };
}

/**
 * Process a single usage-rollup job from the queue.
 * Designed to be called inside a polling loop or a scheduled cron handler.
 *
 * @returns `true` if a job was processed (success or failure), `false` if the
 *   queue was empty.
 */
export async function processUsageRollupJob(options: UsageRollupWorkerOptions): Promise<boolean> {
  const { queue, aggregator, logger = console } = options;

  const job = await queue.dequeue(USAGE_ROLLUP_JOB_TYPE);
  if (!job) return false;

  const parseResult = UsageRollupJobPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    logger.error('[usageRollupWorker] Invalid payload', { jobId: job.id, tenantId: job.tenantId });
    await queue.nack(job.id, `Invalid payload: ${parseResult.error.message}`);
    return true;
  }

  const { period, windowStart, metrics } = parseResult.data;

  try {
    const result = await aggregator.rollup({
      tenantId: job.tenantId,
      period,
      windowStart,
      metrics,
    });

    logger.info('[usageRollupWorker] Rollup completed', {
      jobId: job.id,
      tenantId: job.tenantId,
      period,
      metricCount: result.metricCount,
      windowStart: result.windowStart,
      windowEnd: result.windowEnd,
    });
    await queue.ack(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[usageRollupWorker] Rollup failed', {
      jobId: job.id,
      tenantId: job.tenantId,
      period,
    });
    await queue.nack(job.id, message);
  }

  return true;
}
