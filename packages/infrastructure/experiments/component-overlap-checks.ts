/**
 * @file packages/infrastructure/experiments/component-overlap-checks.ts
 * @summary Validates that no two experiments target the same component slot.
 * @description Overlapping experiments — where two A/B tests modify the same
 *   component on the same page — produce interaction effects that invalidate
 *   statistical significance. This module exposes a set of pure functions that
 *   detect slot conflicts before an experiment is activated, using the
 *   {@link ExperimentMutex} as the authoritative lock registry.
 *
 *   All checks are tenant-scoped: a tenant can never see or affect another
 *   tenant's experiment locks.
 *
 *   Intended usage:
 *   ```ts
 *   // Before activating an experiment:
 *   const conflicts = await checkComponentOverlaps(proposedExperiment, activeLocks);
 *   if (conflicts.hasConflict) {
 *     throw new OverlapConflictError(conflicts);
 *   }
 *   await mutex.acquire({ componentKey, experimentId, tenantId });
 *   ```
 *
 * @security All operations are scoped to `tenantId`.
 * @requirements TASK-AI-004-REV
 */

import type { ExperimentLock, ExperimentMutex } from './experiment-mutex';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Describes a single slot conflict between a candidate and an active experiment. */
export interface SlotConflict {
  /** The component slot both experiments want to modify. */
  componentKey: string;
  /** ID of the already-active experiment holding this slot. */
  holdingExperimentId: string;
  /** ISO-8601 timestamp when the active experiment acquired the slot. */
  acquiredAt: string;
  /** ISO-8601 expiry of the active experiment's lock. */
  expiresAt: string;
}

/** Result returned by {@link checkComponentOverlaps}. */
export interface OverlapCheckResult {
  /** `true` if at least one component slot is already held by another experiment. */
  hasConflict: boolean;
  /** All detected conflicts (empty array when `hasConflict` is `false`). */
  conflicts: SlotConflict[];
  /** Component keys that are free to be claimed. */
  freeSlots: string[];
}

/**
 * Input describing the experiment candidate to validate.
 */
export interface ExperimentCandidate {
  /** ID of the experiment being considered for activation. */
  experimentId: string;
  /** Tenant that owns the experiment. */
  tenantId: string;
  /** List of component keys (e.g. `"hero:homepage"`) this experiment needs. */
  componentKeys: string[];
}

// ─── OverlapConflictError ─────────────────────────────────────────────────────

/**
 * Thrown when a candidate experiment conflicts with one or more active experiments.
 */
export class OverlapConflictError extends Error {
  constructor(public readonly result: OverlapCheckResult) {
    const slotList = result.conflicts.map((c) => c.componentKey).join(', ');
    super(
      `Cannot activate experiment: ${result.conflicts.length} component slot(s) already held — [${slotList}].`
    );
    this.name = 'OverlapConflictError';
  }
}

// ─── Overlap check ────────────────────────────────────────────────────────────

/**
 * Check whether the proposed experiment conflicts with any currently active
 * experiment locks. Uses the {@link ExperimentMutex} as the lock registry.
 *
 * Does **not** acquire any locks — that is the caller's responsibility after a
 * successful (conflict-free) check.
 *
 * @param candidate  The experiment about to be activated.
 * @param mutex      Live mutex instance to query for held locks.
 */
export async function checkComponentOverlaps(
  candidate: ExperimentCandidate,
  mutex: ExperimentMutex
): Promise<OverlapCheckResult> {
  const conflicts: SlotConflict[] = [];
  const freeSlots: string[] = [];

  for (const componentKey of candidate.componentKeys) {
    const existing: ExperimentLock | null = await mutex.check(componentKey, candidate.tenantId);

    if (existing && existing.experimentId !== candidate.experimentId) {
      conflicts.push({
        componentKey,
        holdingExperimentId: existing.experimentId,
        acquiredAt: existing.acquiredAt,
        expiresAt: existing.expiresAt,
      });
    } else {
      freeSlots.push(componentKey);
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts, freeSlots };
}

/**
 * Convenience wrapper: check for overlaps and throw {@link OverlapConflictError}
 * if any are found.
 *
 * @throws {OverlapConflictError} When at least one component slot is held.
 */
export async function assertNoComponentOverlaps(
  candidate: ExperimentCandidate,
  mutex: ExperimentMutex
): Promise<void> {
  const result = await checkComponentOverlaps(candidate, mutex);
  if (result.hasConflict) {
    throw new OverlapConflictError(result);
  }
}

/**
 * Acquire all component slots for an experiment atomically.
 * Rolls back already-acquired locks if any acquisition fails, ensuring no
 * partial lock state is left behind.
 *
 * @returns `true` when all slots were acquired, `false` when the check found
 *   conflicts (no locks are modified in that case).
 * @throws {OverlapConflictError} When conflicts are detected.
 */
export async function acquireAllSlots(
  candidate: ExperimentCandidate,
  mutex: ExperimentMutex
): Promise<boolean> {
  // Pre-flight overlap check
  await assertNoComponentOverlaps(candidate, mutex);

  const acquired: string[] = [];

  for (const componentKey of candidate.componentKeys) {
    const success = await mutex.acquire({
      componentKey,
      experimentId: candidate.experimentId,
      tenantId: candidate.tenantId,
    });

    if (!success) {
      // Another experiment raced us — roll back already-acquired slots
      for (const key of acquired) {
        await mutex.release({
          componentKey: key,
          experimentId: candidate.experimentId,
          tenantId: candidate.tenantId,
        });
      }
      return false;
    }

    acquired.push(componentKey);
  }

  return true;
}

/**
 * Release all component slots held by an experiment (e.g. when concluding).
 */
export async function releaseAllSlots(
  candidate: ExperimentCandidate,
  mutex: ExperimentMutex,
): Promise<void> {
  await Promise.all(
    candidate.componentKeys.map((componentKey) =>
      mutex.release({
        componentKey,
        experimentId: candidate.experimentId,
        tenantId: candidate.tenantId,
      }),
    ),
  );
}
