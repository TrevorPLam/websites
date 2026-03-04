/**
 * @file packages/compliance/audit/trail-logger.ts
 * @summary Hash-chained, tamper-evident audit trail logger.
 * @description Records compliance audit entries in an append-only log where
 *   each entry's `chainHash` is derived from the previous entry's hash and
 *   the current entry's payload. This creates a verifiable chain that
 *   makes any retroactive tampering detectable via {@link trail-verifier}.
 *
 *   Storage is abstracted behind {@link AuditTrailStore} so callers can
 *   plug in a database, file system, or in-memory store (for tests).
 *
 *   The chain uses SHA-256 (NIST-approved, widely supported in Node.js
 *   built-ins without additional dependencies).
 *
 * @security
 *   - The `chainHash` field makes tampering detectable but not impossible
 *     for an attacker with write access to the store. For stronger guarantees
 *     combine with a write-once database or external witness service.
 *   - `metadata` fields must never contain passwords, tokens, or raw PII;
 *     hash PII before storing.
 * @adr none
 * @requirements TASK-COMP-001
 */

import { createHash } from 'node:crypto';

/** A single entry in the audit trail. */
export interface AuditTrailEntry {
  /** Auto-generated sequential index (0-based within this store). */
  index: number;
  /** ISO-8601 timestamp. */
  timestamp: string;
  /** Tenant that produced the event. */
  tenantId: string;
  /** Authenticated user that triggered the action. */
  userId: string;
  /** Name of the action performed (e.g. `"user.deleted"`, `"billing.updated"`). */
  action: string;
  /** Outcome of the action. */
  outcome: 'success' | 'failure' | 'unauthorized';
  /** Additional structured metadata (must not contain raw secrets or PII). */
  metadata?: Record<string, unknown>;
  /**
   * SHA-256 hash of `{previousHash}:{index}:{timestamp}:{tenantId}:{userId}:{action}:{outcome}`.
   * The genesis entry uses an empty string as `previousHash`.
   */
  chainHash: string;
}

/** Input to {@link AuditTrailLogger.append}. */
export type AuditTrailInput = Omit<AuditTrailEntry, 'index' | 'chainHash'>;

/** Pluggable storage backend for audit trail entries. */
export interface AuditTrailStore {
  /** Append a fully-formed entry (index + chainHash already set). */
  append(entry: AuditTrailEntry): Promise<void>;
  /** Return all entries for a tenant, ordered by index ascending. */
  listByTenant(tenantId: string): Promise<AuditTrailEntry[]>;
  /** Return the latest entry (for chaining). `null` when the log is empty. */
  getLatest(tenantId: string): Promise<AuditTrailEntry | null>;
}

// ─── InMemoryAuditTrailStore ──────────────────────────────────────────────────

/** In-memory audit trail store for tests and local development. */
export class InMemoryAuditTrailStore implements AuditTrailStore {
  private readonly entries = new Map<string, AuditTrailEntry[]>();

  async append(entry: AuditTrailEntry): Promise<void> {
    const tenantEntries = this.entries.get(entry.tenantId) ?? [];
    tenantEntries.push(entry);
    this.entries.set(entry.tenantId, tenantEntries);
  }

  async listByTenant(tenantId: string): Promise<AuditTrailEntry[]> {
    return [...(this.entries.get(tenantId) ?? [])];
  }

  async getLatest(tenantId: string): Promise<AuditTrailEntry | null> {
    const tenantEntries = this.entries.get(tenantId) ?? [];
    return tenantEntries[tenantEntries.length - 1] ?? null;
  }
}

// ─── Hash computation ─────────────────────────────────────────────────────────

/** Compute the chain hash for an entry given the previous hash. */
export function computeChainHash(
  previousHash: string,
  entry: Pick<AuditTrailEntry, 'index' | 'timestamp' | 'tenantId' | 'userId' | 'action' | 'outcome'>
): string {
  const payload = [
    previousHash,
    String(entry.index),
    entry.timestamp,
    entry.tenantId,
    entry.userId,
    entry.action,
    entry.outcome,
  ].join(':');
  return createHash('sha256').update(payload).digest('hex');
}

// ─── AuditTrailLogger ─────────────────────────────────────────────────────────

/**
 * Hash-chained audit trail logger.
 *
 * @example
 * ```ts
 * const logger = new AuditTrailLogger({ store: new InMemoryAuditTrailStore() });
 * await logger.append({
 *   timestamp: new Date().toISOString(),
 *   tenantId,
 *   userId,
 *   action: 'user.deleted',
 *   outcome: 'success',
 * });
 * ```
 */
export class AuditTrailLogger {
  constructor(private readonly store: AuditTrailStore) {}

  /**
   * Append a new audit entry to the trail.
   * The `chainHash` is computed automatically from the previous entry.
   */
  async append(input: AuditTrailInput): Promise<AuditTrailEntry> {
    const previous = await this.store.getLatest(input.tenantId);
    const previousHash = previous?.chainHash ?? '';
    const index = previous ? previous.index + 1 : 0;

    const entry: AuditTrailEntry = {
      ...input,
      index,
      chainHash: computeChainHash(previousHash, { ...input, index }),
    };

    await this.store.append(entry);
    return entry;
  }

  /** Return all entries for a tenant ordered by index ascending. */
  async list(tenantId: string): Promise<AuditTrailEntry[]> {
    return this.store.listByTenant(tenantId);
  }
}

/** Factory helper. */
export function createAuditTrailLogger(store: AuditTrailStore): AuditTrailLogger {
  return new AuditTrailLogger(store);
}
