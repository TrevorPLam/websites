/**
 * @file packages/infrastructure/queue/jobs/usage-rollup-job.ts
 * @summary Usage-rollup job schema and factory.
 * @description Defines the Zod-validated payload for asynchronous usage
 *   aggregation.  Usage-rollup jobs are enqueued on a scheduled cron cadence
 *   and processed by {@link usageRollupWorker} to consolidate per-event
 *   counters into billing-period summaries, keeping the metering pipeline
 *   consistent without blocking hot paths.
 *
 * @security
 *   - `tenantId` scoping prevents cross-tenant counter reads.
 *   - Raw billing credentials are resolved by the worker, never stored here.
 * @requirements TASK-012
 */

import { z } from 'zod';
import type { EnqueueInput } from '../client';

// ─── Payload schema ───────────────────────────────────────────────────────────

export const UsageRollupPeriodSchema = z.enum(['hourly', 'daily', 'monthly']);
export type UsageRollupPeriod = z.infer<typeof UsageRollupPeriodSchema>;

export const UsageRollupJobPayloadSchema = z.object({
  /**
   * Granularity of the rollup being computed.
   * `hourly` → aggregate last full hour.
   * `daily`  → aggregate yesterday (00:00–23:59 UTC).
   * `monthly`→ aggregate previous calendar month.
   */
  period: UsageRollupPeriodSchema,
  /**
   * ISO-8601 start of the rollup window (inclusive).
   * The worker derives the end from `period` when absent.
   */
  windowStart: z.string().datetime().optional(),
  /**
   * Specific metric names to roll up.  When absent, all registered metrics
   * for the tenant are included.
   */
  metrics: z.array(z.string().min(1)).optional(),
  /** Correlation ID for distributed tracing. */
  correlationId: z.string().uuid().optional(),
});

export type UsageRollupJobPayload = z.infer<typeof UsageRollupJobPayloadSchema>;

// ─── Job type constant ────────────────────────────────────────────────────────

export const USAGE_ROLLUP_JOB_TYPE = 'usage-rollup' as const;

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Build an {@link EnqueueInput} for a usage-rollup job.
 *
 * @param tenantId - Tenant whose usage counters should be aggregated.
 * @param payload  - Validated rollup configuration.
 * @returns Queue enqueue input ready to pass to {@link JobQueue.enqueue}.
 */
export function createUsageRollupJob(
  tenantId: string,
  payload: UsageRollupJobPayload,
): EnqueueInput {
  return {
    type: USAGE_ROLLUP_JOB_TYPE,
    tenantId,
    payload: UsageRollupJobPayloadSchema.parse(payload) as Record<string, unknown>,
    maxAttempts: 2,
  };
}
