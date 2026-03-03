/**
 * @file packages/infrastructure/ops/queue-policy.ts
 * @summary Queue fairness, retry budgets, and timeout rules.
 * @description Defines the per-job-type policy applied by the job scheduler
 *   and the queue observability layer. Policies include max retries, timeout
 *   durations, dead-letter thresholds, and priority weights.
 * @requirements TASK-QUEUE-001
 */

import { z } from 'zod';

// ─── Policy schema ───────────────────────────────────────────────────────────

export const QueueJobPolicySchema = z.object({
  /** Job type identifier matching {@link Job.type}. */
  jobType: z.string().min(1),
  /** Maximum number of retry attempts before the job is dead-lettered. */
  maxRetries: z.number().int().min(0).max(20).default(3),
  /** Timeout in seconds for a single job execution attempt. */
  timeoutSeconds: z.number().int().min(1).max(3600).default(30),
  /**
   * Scheduling priority (higher = processed sooner when workers are busy).
   * Range: 1 (lowest) – 10 (highest).
   */
  priority: z.number().int().min(1).max(10).default(5),
  /** How long (seconds) to wait before the first retry after failure. */
  initialBackoffSeconds: z.number().int().min(1).default(5),
  /** Backoff multiplier applied on each subsequent retry. */
  backoffMultiplier: z.number().min(1).max(10).default(2),
  /** Maximum backoff cap in seconds. */
  maxBackoffSeconds: z.number().int().min(1).default(300),
});

export type QueueJobPolicy = z.infer<typeof QueueJobPolicySchema>;

// ─── Default policies ────────────────────────────────────────────────────────

export const DEFAULT_QUEUE_POLICIES: QueueJobPolicy[] = [
  { jobType: 'email', maxRetries: 5, timeoutSeconds: 30, priority: 7, initialBackoffSeconds: 10, backoffMultiplier: 2, maxBackoffSeconds: 300 },
  { jobType: 'crm-sync', maxRetries: 3, timeoutSeconds: 60, priority: 5, initialBackoffSeconds: 15, backoffMultiplier: 2, maxBackoffSeconds: 600 },
  { jobType: 'booking-reminder', maxRetries: 3, timeoutSeconds: 30, priority: 8, initialBackoffSeconds: 5, backoffMultiplier: 2, maxBackoffSeconds: 120 },
  { jobType: 'gdpr-deletion', maxRetries: 1, timeoutSeconds: 300, priority: 9, initialBackoffSeconds: 60, backoffMultiplier: 1, maxBackoffSeconds: 60 },
  { jobType: 'analytics-flush', maxRetries: 2, timeoutSeconds: 20, priority: 3, initialBackoffSeconds: 5, backoffMultiplier: 2, maxBackoffSeconds: 60 },
  { jobType: 'webhook-retry', maxRetries: 5, timeoutSeconds: 30, priority: 6, initialBackoffSeconds: 10, backoffMultiplier: 2, maxBackoffSeconds: 600 },
];

/** Default policy applied when no specific policy is found for a job type. */
export const FALLBACK_QUEUE_POLICY: QueueJobPolicy = {
  jobType: '__default__',
  maxRetries: 3,
  timeoutSeconds: 30,
  priority: 5,
  initialBackoffSeconds: 5,
  backoffMultiplier: 2,
  maxBackoffSeconds: 300,
};

// ─── Policy registry ─────────────────────────────────────────────────────────

/** Registry for looking up job type policies. */
export class QueuePolicyRegistry {
  private readonly policies = new Map<string, QueueJobPolicy>();

  constructor(policies: QueueJobPolicy[] = DEFAULT_QUEUE_POLICIES) {
    for (const policy of policies) {
      this.policies.set(policy.jobType, QueueJobPolicySchema.parse(policy));
    }
  }

  /** Look up policy for a job type; returns the fallback if not found. */
  getPolicy(jobType: string): QueueJobPolicy {
    return this.policies.get(jobType) ?? { ...FALLBACK_QUEUE_POLICY, jobType };
  }

  /** Register or overwrite a policy. */
  register(policy: QueueJobPolicy): void {
    this.policies.set(policy.jobType, QueueJobPolicySchema.parse(policy));
  }

  /**
   * Compute the backoff delay (seconds) for a given retry attempt number.
   * Uses exponential backoff capped at `policy.maxBackoffSeconds`.
   */
  computeBackoff(policy: QueueJobPolicy, attempt: number): number {
    const delay = policy.initialBackoffSeconds * Math.pow(policy.backoffMultiplier, attempt - 1);
    return Math.min(Math.round(delay), policy.maxBackoffSeconds);
  }
}

export const queuePolicyRegistry = new QueuePolicyRegistry();

