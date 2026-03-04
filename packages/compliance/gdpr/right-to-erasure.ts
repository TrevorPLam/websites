/**
 * @file packages/compliance/gdpr/right-to-erasure.ts
 * @summary GDPR Article 17 — Right to Erasure ("Right to Be Forgotten").
 * @description Orchestrates cascading deletion of a tenant's user data across
 *   all registered data stores. Each data store is registered as an
 *   {@link ErasureHandler} that the {@link RightToErasure} orchestrator calls
 *   in sequence.
 *
 *   Guarantees:
 *   - All handlers run within a single erasure request, even if some fail
 *     (partial successes are recorded).
 *   - The audit trail records which stores completed deletion and which failed.
 *   - Erasure requests are idempotent: a second request for the same
 *     `(tenantId, userId)` pair safely reports each store as `not_found`.
 *
 * @security
 *   - `tenantId` is always resolved server-side and never accepted from client
 *     input.
 *   - No PII is included in the erasure receipt returned to the caller.
 * @requirements TASK-COMP-001
 */

import { createHash } from 'node:crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

/** The result of a single data-store erasure operation. */
export interface ErasureStoreResult {
  /** Logical name of the data store (e.g. `"supabase"`, `"redis-sessions"`). */
  store: string;
  /** Outcome for this store. */
  status: 'deleted' | 'not_found' | 'failed';
  /** ISO-8601 timestamp of when this store completed. */
  completedAt: string;
  /** Error message if `status === 'failed'`. */
  error?: string;
}

/** Summary result returned after executing all erasure handlers. */
export interface ErasureResult {
  /** Opaque receipt ID derived from a SHA-256 of `(tenantId, userId, requestedAt)`. */
  receiptId: string;
  tenantId: string;
  /** SHA-256 hash of the user ID so the receipt contains no PII. */
  userIdHash: string;
  requestedAt: string;
  completedAt: string;
  /** Whether all stores reported `deleted` or `not_found` (no failures). */
  fullyErased: boolean;
  storeResults: ErasureStoreResult[];
}

/**
 * A handler that deletes all data for a specific user from one data store.
 * Must be registered with {@link RightToErasure.register}.
 */
export interface ErasureHandler {
  /** Logical name for this store (used in the audit receipt). */
  storeName: string;
  /**
   * Delete all data for the given user within the given tenant.
   * Must resolve without throwing even if the user is not found
   * (return `'not_found'` in that case).
   */
  erase(tenantId: string, userId: string): Promise<'deleted' | 'not_found'>;
}

// ─── RightToErasure ───────────────────────────────────────────────────────────

/**
 * Orchestrates GDPR Article 17 erasure requests across all registered
 * data-store handlers.
 *
 * @example
 * ```ts
 * const erasure = new RightToErasure();
 * erasure.register(supabaseHandler);
 * erasure.register(redisHandler);
 *
 * const receipt = await erasure.execute({ tenantId, userId });
 * ```
 */
export class RightToErasure {
  private readonly handlers: ErasureHandler[] = [];

  /** Register a data-store handler to be called on every erasure request. */
  register(handler: ErasureHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Execute a full erasure for the specified user within the specified tenant.
   *
   * All registered handlers are called sequentially. A failure in one handler
   * does not prevent subsequent handlers from running.
   */
  async execute(params: { tenantId: string; userId: string }): Promise<ErasureResult> {
    const { tenantId, userId } = params;
    const requestedAt = new Date().toISOString();

    const userIdHash = createHash('sha256').update(userId).digest('hex');
    const receiptId = createHash('sha256')
      .update(`${tenantId}:${userId}:${requestedAt}`)
      .digest('hex')
      .slice(0, 32);

    const storeResults: ErasureStoreResult[] = [];

    for (const handler of this.handlers) {
      const completedAt = new Date().toISOString();
      try {
        const status = await handler.erase(tenantId, userId);
        storeResults.push({ store: handler.storeName, status, completedAt });
      } catch (err) {
        storeResults.push({
          store: handler.storeName,
          status: 'failed',
          completedAt,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const fullyErased = storeResults.every(
      (r) => r.status === 'deleted' || r.status === 'not_found'
    );

    return {
      receiptId,
      tenantId,
      userIdHash,
      requestedAt,
      completedAt: new Date().toISOString(),
      fullyErased,
      storeResults,
    };
  }
}

/** Factory helper. */
export function createRightToErasure(): RightToErasure {
  return new RightToErasure();
}
