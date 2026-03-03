/**
 * @file packages/infrastructure/ops/health-check.ts
 * @summary Queue health-check endpoint helpers.
 * @description Provides {@link QueueHealthChecker} which aggregates metrics
 *   from {@link QueueObservability} into a standardised health status response
 *   suitable for use in `/api/health` or admin dashboard endpoints.
 *
 *   Health status follows the HTTP health-check conventions:
 *   - `healthy`:  All job types within normal bounds.
 *   - `degraded`: At least one job type exceeds failure-rate or DLQ thresholds.
 *   - `unhealthy`: Critical failure — queue is non-functional.
 * @requirements TASK-QUEUE-001
 */

import type { QueueObservability, JobTypeMetrics } from './observability';

// ─── Types ───────────────────────────────────────────────────────────────────

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

/** Per job-type health summary. */
export interface JobTypeHealth {
  jobType: string;
  status: HealthStatus;
  metrics: JobTypeMetrics;
  /** Human-readable reason when status is not `healthy`. */
  reason?: string;
}

/** Aggregate queue health report. */
export interface QueueHealthReport {
  status: HealthStatus;
  checkedAt: string;
  jobTypes: JobTypeHealth[];
  summary: {
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

/** Thresholds used by {@link QueueHealthChecker}. */
export interface HealthCheckThresholds {
  /** Failure rate above which a job type is `degraded`. Default 0.1 (10%). */
  degradedFailureRate: number;
  /** Failure rate above which a job type is `unhealthy`. Default 0.5 (50%). */
  unhealthyFailureRate: number;
  /** DLQ count above which a job type is `degraded`. Default 5. */
  degradedDlqCount: number;
  /** DLQ count above which a job type is `unhealthy`. Default 20. */
  unhealthyDlqCount: number;
}

const DEFAULT_THRESHOLDS: HealthCheckThresholds = {
  degradedFailureRate: 0.1,
  unhealthyFailureRate: 0.5,
  degradedDlqCount: 5,
  unhealthyDlqCount: 20,
};

// ─── Health checker ───────────────────────────────────────────────────────────

/**
 * Produces health reports from queue observability metrics.
 *
 * @example
 * ```ts
 * // In your health API route:
 * const report = checker.check();
 * return Response.json(report, { status: report.status === 'unhealthy' ? 503 : 200 });
 * ```
 */
export class QueueHealthChecker {
  private readonly obs: QueueObservability;
  private readonly thresholds: HealthCheckThresholds;

  constructor(obs: QueueObservability, thresholds?: Partial<HealthCheckThresholds>) {
    this.obs = obs;
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  /** Produce a health report from current observability metrics. */
  check(): QueueHealthReport {
    const metrics = this.obs.getMetrics();
    const jobTypes: JobTypeHealth[] = metrics.map((m) => this.evaluateJobType(m));

    const summary = { healthy: 0, degraded: 0, unhealthy: 0 };
    for (const jt of jobTypes) {
      summary[jt.status]++;
    }

    const overallStatus: HealthStatus =
      summary.unhealthy > 0 ? 'unhealthy' : summary.degraded > 0 ? 'degraded' : 'healthy';

    return {
      status: overallStatus,
      checkedAt: new Date().toISOString(),
      jobTypes,
      summary,
    };
  }

  /** Convert the health report to an HTTP response body with status code. */
  toHttpResponse(): { statusCode: number; body: QueueHealthReport } {
    const report = this.check();
    return {
      statusCode: report.status === 'unhealthy' ? 503 : 200,
      body: report,
    };
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private evaluateJobType(m: JobTypeMetrics): JobTypeHealth {
    if (
      m.failureRate >= this.thresholds.unhealthyFailureRate ||
      m.deadLettered >= this.thresholds.unhealthyDlqCount
    ) {
      return {
        jobType: m.jobType,
        status: 'unhealthy',
        metrics: m,
        reason: m.deadLettered >= this.thresholds.unhealthyDlqCount
          ? `Dead-letter count ${m.deadLettered} ≥ threshold ${this.thresholds.unhealthyDlqCount}`
          : `Failure rate ${(m.failureRate * 100).toFixed(1)}% ≥ unhealthy threshold ${(this.thresholds.unhealthyFailureRate * 100).toFixed(1)}%`,
      };
    }

    if (
      m.failureRate >= this.thresholds.degradedFailureRate ||
      m.deadLettered >= this.thresholds.degradedDlqCount
    ) {
      return {
        jobType: m.jobType,
        status: 'degraded',
        metrics: m,
        reason: m.deadLettered >= this.thresholds.degradedDlqCount
          ? `Dead-letter count ${m.deadLettered} ≥ threshold ${this.thresholds.degradedDlqCount}`
          : `Failure rate ${(m.failureRate * 100).toFixed(1)}% ≥ degraded threshold ${(this.thresholds.degradedFailureRate * 100).toFixed(1)}%`,
      };
    }

    return { jobType: m.jobType, status: 'healthy', metrics: m };
  }
}

/** Factory helper. */
export function createQueueHealthChecker(
  obs: QueueObservability,
  thresholds?: Partial<HealthCheckThresholds>,
): QueueHealthChecker {
  return new QueueHealthChecker(obs, thresholds);
}
