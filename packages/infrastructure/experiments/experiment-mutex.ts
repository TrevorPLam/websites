/**
 * @file packages/infrastructure/experiments/experiment-mutex.ts
 * @summary Experiment component mutex — prevents two A/B experiments from
 *   targeting the same component slot simultaneously.
 * @description Overlapping experiments (e.g. two experiments both modifying
 *   the hero section) produce interaction effects that invalidate statistical
 *   significance. This module provides an in-process mutex backed by an
 *   {@link ExperimentLockStore} so that acquiring a component slot for one
 *   experiment automatically blocks others.
 *
 *   Two implementations are provided:
 *   - {@link InMemoryLockStore} for unit tests and local development.
 *   - The {@link ExperimentMutex} class, which is the public API callers use.
 *
 * @security Component keys are scoped to `tenantId` — a tenant can never
 *   read or release another tenant's locks.
 * @requirements TASK-AI-004-REV
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** A stored lock record. */
export interface ExperimentLock {
  componentKey: string;
  experimentId: string;
  tenantId: string;
  acquiredAt: string;
  /** ISO-8601 expiry; the mutex treats expired locks as released. */
  expiresAt: string;
}

/** Pluggable storage backend for experiment locks. */
export interface ExperimentLockStore {
  /** Attempt to acquire the lock atomically. Returns `false` if the slot is already held. */
  acquire(lock: ExperimentLock): Promise<boolean>;
  /** Release the lock held by this experiment. No-op if not held. */
  release(componentKey: string, experimentId: string, tenantId: string): Promise<void>;
  /** Return the active lock for a given component slot, or `null` if free. */
  get(componentKey: string, tenantId: string): Promise<ExperimentLock | null>;
  /** Return all active locks for a tenant. */
  listByTenant(tenantId: string): Promise<ExperimentLock[]>;
}

// ─── InMemoryLockStore ───────────────────────────────────────────────────────

/**
 * In-memory lock store for tests and local development.
 * Not suitable for multi-process deployments.
 */
export class InMemoryLockStore implements ExperimentLockStore {
  private readonly store = new Map<string, ExperimentLock>();

  private static slotKey(componentKey: string, tenantId: string): string {
    return `${tenantId}:${componentKey}`;
  }

  async acquire(lock: ExperimentLock): Promise<boolean> {
    const key = InMemoryLockStore.slotKey(lock.componentKey, lock.tenantId);
    const existing = this.store.get(key);

    if (existing) {
      // Treat expired locks as released
      if (new Date(existing.expiresAt) > new Date()) {
        return false;
      }
    }

    this.store.set(key, lock);
    return true;
  }

  async release(componentKey: string, experimentId: string, tenantId: string): Promise<void> {
    const key = InMemoryLockStore.slotKey(componentKey, tenantId);
    const existing = this.store.get(key);

    if (existing?.experimentId === experimentId) {
      this.store.delete(key);
    }
  }

  async get(componentKey: string, tenantId: string): Promise<ExperimentLock | null> {
    const key = InMemoryLockStore.slotKey(componentKey, tenantId);
    const lock = this.store.get(key);

    if (!lock) return null;

    // Auto-expire
    if (new Date(lock.expiresAt) <= new Date()) {
      this.store.delete(key);
      return null;
    }

    return lock;
  }

  async listByTenant(tenantId: string): Promise<ExperimentLock[]> {
    const now = new Date();
    const results: ExperimentLock[] = [];

    for (const lock of this.store.values()) {
      if (lock.tenantId === tenantId && new Date(lock.expiresAt) > now) {
        results.push(lock);
      }
    }

    return results;
  }
}

// ─── ExperimentMutex ─────────────────────────────────────────────────────────

export interface ExperimentMutexOptions {
  store: ExperimentLockStore;
  /** Lock TTL in seconds. Defaults to 30 days. */
  ttlSeconds?: number;
}

/**
 * Experiment component mutex.
 *
 * Prevents two experiments from running on the same component slot
 * simultaneously. Each slot is identified by a `componentKey` string scoped
 * to a `tenantId`.
 *
 * @example
 * ```ts
 * const mutex = createExperimentMutex({ store: new InMemoryLockStore() });
 *
 * const acquired = await mutex.acquire({
 *   componentKey: 'hero:homepage',
 *   experimentId: 'exp_abc',
 *   tenantId: 'tenant_xyz',
 * });
 *
 * if (!acquired) {
 *   throw new Error('Another experiment already owns this component slot.');
 * }
 * ```
 */
export class ExperimentMutex {
  private readonly store: ExperimentLockStore;
  private readonly ttlSeconds: number;

  constructor(options: ExperimentMutexOptions) {
    this.store = options.store;
    this.ttlSeconds = options.ttlSeconds ?? 60 * 60 * 24 * 30; // 30 days
  }

  /**
   * Attempt to acquire a component slot for an experiment.
   *
   * @returns `true` if the lock was acquired, `false` if another active
   *   experiment already owns the slot.
   */
  async acquire(params: {
    componentKey: string;
    experimentId: string;
    tenantId: string;
  }): Promise<boolean> {
    const { componentKey, experimentId, tenantId } = params;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.ttlSeconds * 1_000);

    return this.store.acquire({
      componentKey,
      experimentId,
      tenantId,
      acquiredAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  }

  /**
   * Release a component slot held by an experiment.
   * Safe to call even if the lock is not held (no-op).
   */
  async release(params: {
    componentKey: string;
    experimentId: string;
    tenantId: string;
  }): Promise<void> {
    return this.store.release(params.componentKey, params.experimentId, params.tenantId);
  }

  /**
   * Check whether a component slot is currently locked.
   * Returns the lock record if held, or `null` if free.
   */
  async check(componentKey: string, tenantId: string): Promise<ExperimentLock | null> {
    return this.store.get(componentKey, tenantId);
  }

  /**
   * Return all active component locks for a tenant.
   * Useful for showing which experiments are running and on which slots.
   */
  async listActiveLocks(tenantId: string): Promise<ExperimentLock[]> {
    return this.store.listByTenant(tenantId);
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createExperimentMutex(options: ExperimentMutexOptions): ExperimentMutex {
  return new ExperimentMutex(options);
}
