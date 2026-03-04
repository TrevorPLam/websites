/**
 * @file packages/infrastructure/queue/worker.ts
 * @summary Generic polling worker loop that dispatches queued jobs to
 *   registered processor functions.
 * @description {@link QueueWorkerLoop} polls a {@link JobQueue} on a
 *   configurable interval and routes each dequeued job to the matching
 *   processor registered via {@link QueueWorkerLoop.register}.  Processors
 *   return `true` on success and `false` on failure; the loop handles
 *   ack / nack transparently.
 *
 *   The design deliberately avoids long-running async generators or Node.js
 *   worker threads so the loop can run inside a serverless cron handler, a
 *   Vercel scheduled function, or a traditional Node.js process equally well.
 *
 * @example
 * ```ts
 * const loop = new QueueWorkerLoop({ queue, logger: console });
 * loop.register('email', async (job) => {
 *   await emailAdapter.send(job.payload as EmailJobPayload);
 *   return true;
 * });
 * await loop.runOnce();          // process one batch (useful in cron)
 * loop.start(5_000);             // or poll every 5 s in a long-lived process
 * ```
 *
 * @security
 *   - All jobs are scoped to a `tenantId`; no cross-tenant reads occur.
 *   - Payloads are validated by each registered processor before use.
 * @requirements PROD-004
 */

import type { Job, JobQueue } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Simple logger interface; compatible with `console` and pino. */
export interface WorkerLogger {
  info(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
}

/**
 * A job processor function registered with {@link QueueWorkerLoop}.
 * @returns `true` if the job was processed successfully, `false` on failure.
 *   Throwing an unhandled error is treated as a `false` return.
 */
export type JobProcessor = (job: Job) => Promise<boolean>;

export interface QueueWorkerLoopOptions {
  /** Queue implementation to poll. */
  queue: JobQueue;
  /** Optional logger; defaults to `console`. */
  logger?: WorkerLogger;
  /**
   * Maximum number of jobs to process per {@link QueueWorkerLoop.runOnce} call.
   * Defaults to `10`.
   */
  batchSize?: number;
}

// ─── QueueWorkerLoop ──────────────────────────────────────────────────────────

/**
 * Polls a {@link JobQueue} and dispatches jobs to registered processors.
 */
export class QueueWorkerLoop {
  private readonly queue: JobQueue;
  private readonly logger: WorkerLogger;
  private readonly batchSize: number;
  private readonly processors = new Map<string, JobProcessor>();
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  constructor(options: QueueWorkerLoopOptions) {
    this.queue = options.queue;
    this.logger = options.logger ?? console;
    this.batchSize = options.batchSize ?? 10;
  }

  // ── Registration ────────────────────────────────────────────────────────────

  /**
   * Register a processor for a job type.
   * Overwrites any previously registered processor for the same type.
   */
  register(jobType: string, processor: JobProcessor): this {
    this.processors.set(jobType, processor);
    return this;
  }

  // ── Execution ────────────────────────────────────────────────────────────────

  /**
   * Process up to {@link batchSize} queued jobs.
   * Safe to call from a cron handler — completes synchronously after the
   * batch is exhausted.
   *
   * @returns The number of jobs processed in this batch.
   */
  async runOnce(): Promise<number> {
    let processed = 0;

    for (let i = 0; i < this.batchSize; i++) {
      // Dequeue without filtering by type so any registered job type is eligible.
      const job = await this.queue.dequeue();
      if (!job) break;

      const processor = this.processors.get(job.type);
      if (!processor) {
        this.logger.error('[QueueWorkerLoop] No processor registered for job type', {
          jobId: job.id,
          jobType: job.type,
          tenantId: job.tenantId,
        });
        await this.queue.nack(job.id, `No processor registered for job type: ${job.type}`);
        processed++;
        continue;
      }

      const startMs = Date.now();
      try {
        const success = await processor(job);
        const durationMs = Date.now() - startMs;

        if (success) {
          await this.queue.ack(job.id);
          this.logger.info('[QueueWorkerLoop] Job completed', {
            jobId: job.id,
            jobType: job.type,
            tenantId: job.tenantId,
            durationMs,
          });
        } else {
          await this.queue.nack(job.id, 'Processor returned false');
          this.logger.error('[QueueWorkerLoop] Job failed (processor returned false)', {
            jobId: job.id,
            jobType: job.type,
            tenantId: job.tenantId,
            durationMs,
          });
        }
      } catch (err) {
        const durationMs = Date.now() - startMs;
        const message = err instanceof Error ? err.message : String(err);
        await this.queue.nack(job.id, message);
        this.logger.error('[QueueWorkerLoop] Job threw unhandled error', {
          jobId: job.id,
          jobType: job.type,
          tenantId: job.tenantId,
          durationMs,
          error: message,
        });
      }

      processed++;
    }

    return processed;
  }

  // ── Long-running poll loop ───────────────────────────────────────────────────

  /**
   * Start a polling loop that calls {@link runOnce} every `intervalMs`
   * milliseconds.  Safe to call once; subsequent calls are no-ops.
   *
   * @param intervalMs - Poll interval in milliseconds.  Defaults to 5000.
   */
  start(intervalMs = 5_000): void {
    if (this.running) return;
    this.running = true;
    this.scheduleNext(intervalMs);
  }

  /** Stop the polling loop.  In-flight jobs are allowed to complete. */
  stop(): void {
    this.running = false;
    if (this.pollTimer !== null) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private scheduleNext(intervalMs: number): void {
    this.pollTimer = setTimeout(async () => {
      if (!this.running) return;
      try {
        await this.runOnce();
      } catch (err) {
        this.logger.error('[QueueWorkerLoop] Unhandled error in poll tick', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      this.scheduleNext(intervalMs);
    }, intervalMs);
  }
}
