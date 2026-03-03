/**
 * @file packages/infrastructure/queue/client.ts
 * @summary Library-agnostic job queue abstraction with in-memory implementation.
 * @description Defines the {@link JobQueue} port interface and an
 *   {@link InMemoryJobQueue} adapter for local development and tests. Production
 *   deployments swap the adapter (e.g. BullMQ, Inngest, Upstash QStash) via
 *   the hexagonal ports pattern without touching business logic.
 *
 *   The client is intentionally thin — it delegates retry policy, observability,
 *   and health checking to the existing ops modules
 *   ({@link QueuePolicyRegistry}, {@link QueueObservability}).
 *
 * @security
 *   - Jobs are always scoped to a `tenantId`; no cross-tenant reads are possible.
 *   - Payloads are validated with Zod before enqueue to prevent injection.
 * @requirements PROD-004, TASK-012
 */

import { z } from 'zod';

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const JobStatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'dead_lettered']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobSchema = z.object({
  /** Unique job identifier. */
  id: z.string().min(1),
  /** Job type used to route to the correct worker. */
  type: z.string().min(1),
  /** Tenant that owns this job — enforces isolation. */
  tenantId: z.string().uuid(),
  /** Arbitrary job payload; validated by the worker's own schema. */
  payload: z.record(z.unknown()),
  /** Current lifecycle status. */
  status: JobStatusSchema.default('pending'),
  /** 1-based attempt counter, incremented on each retry. */
  attempt: z.number().int().min(1).default(1),
  /** Maximum number of delivery attempts before dead-lettering. */
  maxAttempts: z.number().int().min(1).default(3),
  /** ISO-8601 creation timestamp. */
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  /** ISO-8601 timestamp when the job becomes eligible for processing. */
  runAt: z.string().datetime().default(() => new Date().toISOString()),
  /** ISO-8601 timestamp of last status change. */
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
  /** Error message captured on the last failed attempt. */
  lastError: z.string().optional(),
});

export type Job = z.infer<typeof JobSchema>;

/** Input accepted by {@link JobQueue.enqueue}; id and timestamps are generated automatically. */
export type EnqueueInput = Pick<Job, 'type' | 'tenantId' | 'payload'> &
  Partial<Pick<Job, 'maxAttempts' | 'runAt'>>;

// ─── Port interface ───────────────────────────────────────────────────────────

/**
 * Hexagonal port for a durable job queue.
 * Implementations must be safe to call from Server Actions and route handlers.
 */
export interface JobQueue {
  /**
   * Add a job to the queue.
   * @returns The persisted {@link Job} with generated id and timestamps.
   */
  enqueue(input: EnqueueInput): Promise<Job>;

  /**
   * Claim the next pending job ready for processing.
   * @param jobType - Optionally filter by job type.
   * @returns The claimed job, or `null` if the queue is empty.
   */
  dequeue(jobType?: string): Promise<Job | null>;

  /**
   * Mark a job as successfully completed.
   */
  ack(jobId: string): Promise<void>;

  /**
   * Mark a job as failed for this attempt.
   * The queue increments `attempt`; when `maxAttempts` is reached the job is
   * moved to the dead-letter state instead of back to `pending`.
   */
  nack(jobId: string, error: string): Promise<void>;

  /**
   * Return all jobs for a tenant, optionally filtered by status.
   * Tenant isolation is enforced — only jobs owned by `tenantId` are returned.
   */
  listByTenant(tenantId: string, status?: JobStatus): Promise<Job[]>;

  /**
   * Return the queue depth (pending + running) per job type.
   * Used by the health-check endpoint.
   */
  getDepths(): Map<string, number>;
}

// ─── InMemoryJobQueue ─────────────────────────────────────────────────────────

/**
 * In-memory {@link JobQueue} adapter for tests and local development.
 * Not suitable for multi-process or serverless deployments.
 */
export class InMemoryJobQueue implements JobQueue {
  private readonly jobs = new Map<string, Job>();
  private idCounter = 0;

  private generateId(): string {
    return `job_${Date.now()}_${++this.idCounter}`;
  }

  async enqueue(input: EnqueueInput): Promise<Job> {
    const job = JobSchema.parse({
      id: this.generateId(),
      type: input.type,
      tenantId: input.tenantId,
      payload: input.payload,
      maxAttempts: input.maxAttempts ?? 3,
      runAt: input.runAt ?? new Date().toISOString(),
    });
    this.jobs.set(job.id, job);
    return job;
  }

  async dequeue(jobType?: string): Promise<Job | null> {
    const now = new Date().toISOString();
    for (const job of this.jobs.values()) {
      if (job.status !== 'pending') continue;
      if (job.runAt > now) continue;
      if (jobType && job.type !== jobType) continue;
      const running: Job = { ...job, status: 'running', updatedAt: new Date().toISOString() };
      this.jobs.set(running.id, running);
      return running;
    }
    return null;
  }

  async ack(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    this.jobs.set(jobId, { ...job, status: 'completed', updatedAt: new Date().toISOString() });
  }

  async nack(jobId: string, error: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    const nextAttempt = job.attempt + 1;
    const isDead = nextAttempt > job.maxAttempts;
    this.jobs.set(jobId, {
      ...job,
      status: isDead ? 'dead_lettered' : 'pending',
      attempt: nextAttempt,
      lastError: error,
      updatedAt: new Date().toISOString(),
    });
  }

  async listByTenant(tenantId: string, status?: JobStatus): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (j) => j.tenantId === tenantId && (status === undefined || j.status === status),
    );
  }

  getDepths(): Map<string, number> {
    const depths = new Map<string, number>();
    for (const job of this.jobs.values()) {
      if (job.status !== 'pending' && job.status !== 'running') continue;
      depths.set(job.type, (depths.get(job.type) ?? 0) + 1);
    }
    return depths;
  }

  /** Utility for tests — clear all jobs. */
  clear(): void {
    this.jobs.clear();
    this.idCounter = 0;
  }
}
