/**
 * @file packages/infrastructure/ops/observability.ts
 * @summary Queue observability: metrics collection, DLQ alerting, and job
 *   health event emission.
 * @description Provides {@link QueueObservability} which tracks job lifecycle
 *   events (enqueued → running → completed / failed → dead-lettered) and fires
 *   configurable alert callbacks when failure thresholds are exceeded.
 *
 *   The implementation is storage-agnostic: metric counters are maintained
 *   in-process and can be forwarded to any sink (Tinybird, Prometheus, Sentry)
 *   via the {@link ObservabilityOptions.onAlert} callback.
 * @requirements TASK-QUEUE-001
 */

import { z } from 'zod';

// ─── Types ───────────────────────────────────────────────────────────────────

export type JobStatus = 'enqueued' | 'running' | 'completed' | 'failed' | 'dead_lettered';

/** A single job lifecycle event. */
export interface JobEvent {
  jobId: string;
  tenantId: string;
  jobType: string;
  status: JobStatus;
  /** Attempt number (1-based). */
  attempt: number;
  /** Duration in milliseconds (for completed / failed events). */
  durationMs?: number;
  /** Error message (for failed / dead-lettered events). */
  errorMessage?: string;
  occurredAt: string;
}

/** Aggregated metrics for a job type within a rolling window. */
export interface JobTypeMetrics {
  jobType: string;
  enqueued: number;
  running: number;
  completed: number;
  failed: number;
  deadLettered: number;
  /** Average duration in ms for completed jobs. */
  avgDurationMs: number;
  /** Failure rate in the current window (0–1). */
  failureRate: number;
  /** ISO-8601 timestamp of last reset. */
  windowStart: string;
}

/** An alert emitted when a threshold is breached. */
export interface QueueAlert {
  id: string;
  kind: 'high_failure_rate' | 'dead_letter_threshold' | 'job_timeout' | 'queue_depth';
  jobType: string;
  tenantId?: string;
  detail: string;
  threshold: number;
  actualValue: number;
  occurredAt: string;
}

// ─── Options ─────────────────────────────────────────────────────────────────

const AlertThresholdsSchema = z.object({
  /** Failure rate (0–1) above which a `high_failure_rate` alert fires. Default 0.1. */
  failureRate: z.number().min(0).max(1).default(0.1),
  /** Number of dead-lettered jobs before a `dead_letter_threshold` alert fires. Default 5. */
  deadLetterCount: z.number().int().min(1).default(5),
  /** Minimum total jobs processed before failure-rate alerting activates. Default 10. */
  minJobsForRateAlert: z.number().int().min(1).default(10),
});

export type AlertThresholds = z.infer<typeof AlertThresholdsSchema>;

/** Options for {@link QueueObservability}. */
export interface ObservabilityOptions {
  /** Alert threshold overrides. */
  thresholds?: Partial<AlertThresholds>;
  /** Called whenever an alert is fired. Use to forward to Sentry / Tinybird / Slack. */
  onAlert?: (alert: QueueAlert) => void | Promise<void>;
  /** Called for every job event. Use to stream to analytics. */
  onEvent?: (event: JobEvent) => void | Promise<void>;
}

// ─── Observability class ─────────────────────────────────────────────────────

/**
 * Tracks job lifecycle metrics and emits alerts when thresholds are exceeded.
 *
 * @example
 * ```ts
 * const obs = new QueueObservability({
 *   onAlert: (alert) => sentry.captureMessage(alert.detail, 'warning'),
 *   onEvent: (event) => tinybird.ingest('queue_events', event),
 * });
 *
 * // In your job handler:
 * obs.record({ jobId, tenantId, jobType: 'email', status: 'completed', attempt: 1, durationMs: 42 });
 * ```
 */
export class QueueObservability {
  private readonly options: ObservabilityOptions;
  private readonly thresholds: AlertThresholds;
  private readonly metrics = new Map<string, JobTypeMetrics>();
  /** Tracks the last DLQ count at which a DLQ alert was fired per job type. */
  private readonly dlqAlertedAt = new Map<string, number>();

  constructor(options: ObservabilityOptions = {}) {
    this.options = options;
    this.thresholds = AlertThresholdsSchema.parse(options.thresholds ?? {});
  }

  /**
   * Record a job lifecycle event, update metrics, and check alert thresholds.
   */
  async record(params: Omit<JobEvent, 'occurredAt'>): Promise<void> {
    const event: JobEvent = { ...params, occurredAt: new Date().toISOString() };

    // Forward to event sink
    if (this.options.onEvent) {
      await Promise.resolve(this.options.onEvent(event));
    }

    // Update metrics
    const m = this.getOrCreateMetrics(params.jobType);

    switch (params.status) {
      case 'enqueued':
        m.enqueued++;
        break;
      case 'running':
        m.running++;
        break;
      case 'completed':
        m.running = Math.max(0, m.running - 1);
        m.completed++;
        if (params.durationMs !== undefined) {
          const total = m.avgDurationMs * (m.completed - 1) + params.durationMs;
          m.avgDurationMs = Math.round(total / m.completed);
        }
        break;
      case 'failed':
        m.running = Math.max(0, m.running - 1);
        m.failed++;
        break;
      case 'dead_lettered':
        m.failed++;
        m.deadLettered++;
        break;
    }

    // Compute failure rate
    const processed = m.completed + m.failed;
    m.failureRate = processed > 0 ? m.failed / processed : 0;

    // Check thresholds
    await this.checkThresholds(m, event);
  }

  /** Return current metrics for all tracked job types. */
  getMetrics(): JobTypeMetrics[] {
    return Array.from(this.metrics.values());
  }

  /** Return metrics for a specific job type, or `undefined` if not tracked yet. */
  getMetricsForType(jobType: string): JobTypeMetrics | undefined {
    return this.metrics.get(jobType);
  }

  /** Reset metrics for all job types (e.g. at the start of a new time window). */
  resetMetrics(): void {
    for (const m of this.metrics.values()) {
      m.enqueued = 0;
      m.running = 0;
      m.completed = 0;
      m.failed = 0;
      m.deadLettered = 0;
      m.avgDurationMs = 0;
      m.failureRate = 0;
      m.windowStart = new Date().toISOString();
    }
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private getOrCreateMetrics(jobType: string): JobTypeMetrics {
    if (!this.metrics.has(jobType)) {
      this.metrics.set(jobType, {
        jobType,
        enqueued: 0,
        running: 0,
        completed: 0,
        failed: 0,
        deadLettered: 0,
        avgDurationMs: 0,
        failureRate: 0,
        windowStart: new Date().toISOString(),
      });
    }
    return this.metrics.get(jobType)!;
  }

  private async checkThresholds(m: JobTypeMetrics, event: JobEvent): Promise<void> {
    const alerts: QueueAlert[] = [];
    const processed = m.completed + m.failed;

    if (
      processed >= this.thresholds.minJobsForRateAlert &&
      m.failureRate > this.thresholds.failureRate
    ) {
      alerts.push(this.buildAlert('high_failure_rate', m.jobType, event.tenantId, {
        detail: `Job type "${m.jobType}" failure rate ${(m.failureRate * 100).toFixed(1)}% exceeds threshold ${(this.thresholds.failureRate * 100).toFixed(1)}%.`,
        threshold: this.thresholds.failureRate,
        actualValue: m.failureRate,
      }));
    }

    // Fire DLQ alert only when crossing a new multiple of the threshold
    // (prevents alert fatigue as deadLettered keeps incrementing).
    if (m.deadLettered > 0) {
      const prevAlerted = this.dlqAlertedAt.get(m.jobType) ?? 0;
      const newMultiple = Math.floor(m.deadLettered / this.thresholds.deadLetterCount);
      const prevMultiple = Math.floor(prevAlerted / this.thresholds.deadLetterCount);
      if (newMultiple > prevMultiple) {
        this.dlqAlertedAt.set(m.jobType, m.deadLettered);
        alerts.push(this.buildAlert('dead_letter_threshold', m.jobType, event.tenantId, {
          detail: `Job type "${m.jobType}" has ${m.deadLettered} dead-lettered jobs (threshold: ${this.thresholds.deadLetterCount}).`,
          threshold: this.thresholds.deadLetterCount,
          actualValue: m.deadLettered,
        }));
      }
    }

    if (this.options.onAlert) {
      for (const alert of alerts) {
        await Promise.resolve(this.options.onAlert(alert));
      }
    }
  }

  private buildAlert(
    kind: QueueAlert['kind'],
    jobType: string,
    tenantId: string | undefined,
    params: { detail: string; threshold: number; actualValue: number },
  ): QueueAlert {
    return {
      id: `${kind}-${jobType}-${Date.now()}`,
      kind,
      jobType,
      tenantId,
      ...params,
      occurredAt: new Date().toISOString(),
    };
  }
}

/** Factory helper. */
export function createQueueObservability(options?: ObservabilityOptions): QueueObservability {
  return new QueueObservability(options);
}
