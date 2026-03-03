/**
 * @file packages/privacy/src/audit/trail-logger.ts
 * @summary Hash-chained audit trail logger for GDPR/CCPA compliance.
 * @description Creates an append-only, cryptographically linked chain of audit
 *   entries. Each entry contains an HMAC-SHA256 of (previousHash + payload)
 *   so that any tampering with a historical record breaks the chain and is
 *   detectable by {@link verifyAuditChain}.
 * @security
 *   - Entries are insert-only; no UPDATE/DELETE is permitted by callers.
 *   - tenantId is required on every entry to enforce multi-tenant isolation.
 *   - Sensitive field values are never stored; only field names are recorded
 *     under `affectedFields`.
 * @requirements TASK-COMP-001
 */

import { createHmac, randomUUID } from 'node:crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Categories of auditable actions. */
export type AuditAction =
  | 'data.access'
  | 'data.create'
  | 'data.update'
  | 'data.delete'
  | 'data.export'
  | 'consent.given'
  | 'consent.withdrawn'
  | 'erasure.requested'
  | 'erasure.completed'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.failed'
  | 'webhook.received'
  | 'webhook.processed'
  | 'job.enqueued'
  | 'job.completed'
  | 'job.failed';

/** An immutable audit log entry. */
export interface AuditEntry {
  /** Globally unique entry identifier. */
  id: string;
  /** Tenant that owns this entry. */
  tenantId: string;
  /** The action that was performed. */
  action: AuditAction;
  /** ID of the actor (user, service account, or system). */
  actorId: string;
  /** Resource type affected (e.g. "lead", "booking", "user"). */
  resourceType: string;
  /** Resource identifier affected. */
  resourceId: string;
  /** Field names that were changed (values are NEVER stored). */
  affectedFields?: string[];
  /** Free-form metadata (must NOT contain PII or secret values). */
  metadata?: Record<string, string | number | boolean>;
  /** ISO-8601 timestamp when the action occurred. */
  occurredAt: string;
  /** HMAC-SHA256(signingKey, previousHash + canonicalPayload). */
  hash: string;
  /** Hash of the previous entry in the chain ("GENESIS" for the first). */
  previousHash: string;
}

/** Input shape for creating a new audit entry. */
export type AuditEntryInput = Omit<AuditEntry, 'id' | 'hash' | 'previousHash' | 'occurredAt'>;

// ─── Chain computation ───────────────────────────────────────────────────────

export const GENESIS_HASH = 'GENESIS';

/**
 * Compute the canonical string representation of an entry payload.
 * Fields are sorted for deterministic serialisation.
 */
export function canonicalize(entry: Omit<AuditEntry, 'hash'>): string {
  return JSON.stringify({
    id: entry.id,
    tenantId: entry.tenantId,
    action: entry.action,
    actorId: entry.actorId,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    affectedFields: entry.affectedFields ?? [],
    metadata: entry.metadata ?? {},
    occurredAt: entry.occurredAt,
    previousHash: entry.previousHash,
  });
}

/**
 * Compute HMAC-SHA256 of `previousHash + canonicalPayload`.
 */
export function computeHash(signingKey: string, previous: string, payload: string): string {
  return createHmac('sha256', signingKey).update(previous + payload).digest('hex');
}

// ─── Logger ──────────────────────────────────────────────────────────────────

/** Options for {@link AuditTrailLogger}. */
export interface AuditTrailLoggerOptions {
  /**
   * HMAC signing key.  Must be at least 32 characters.
   * In production, source from a secret manager (never hardcode).
   */
  signingKey: string;
  /**
   * Persist an entry to durable storage.  The implementation is provided by
   * the caller so this module has zero runtime dependencies on any database.
   */
  persist(entry: AuditEntry): Promise<void>;
  /**
   * Return the hash of the most recently persisted entry for the given tenant,
   * or `undefined` if no entries exist yet.
   */
  getLastHash(tenantId: string): Promise<string | undefined>;
}

/**
 * Append-only audit trail logger with cryptographic hash chaining.
 *
 * @example
 * ```ts
 * const logger = new AuditTrailLogger({
 *   signingKey: process.env.AUDIT_SIGNING_KEY!,
 *   persist: (entry) => db.auditLogs.insert(entry),
 *   getLastHash: (tenantId) => db.auditLogs.findLastHash(tenantId),
 * });
 *
 * await logger.log({
 *   tenantId: 'tenant-abc',
 *   action: 'data.delete',
 *   actorId: 'user-123',
 *   resourceType: 'lead',
 *   resourceId: 'lead-456',
 *   affectedFields: ['email', 'phone'],
 * });
 * ```
 */
export class AuditTrailLogger {
  private readonly options: AuditTrailLoggerOptions;

  constructor(options: AuditTrailLoggerOptions) {
    if (options.signingKey.length < 32) {
      throw new Error('AuditTrailLogger: signingKey must be at least 32 characters.');
    }
    this.options = options;
  }

  /**
   * Append a new entry to the audit chain.
   * Resolves with the persisted {@link AuditEntry}.
   */
  async log(input: AuditEntryInput): Promise<AuditEntry> {
    const previousHash = (await this.options.getLastHash(input.tenantId)) ?? GENESIS_HASH;
    const id = randomUUID();
    const occurredAt = new Date().toISOString();

    const partial: Omit<AuditEntry, 'hash'> = {
      id,
      tenantId: input.tenantId,
      action: input.action,
      actorId: input.actorId,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      affectedFields: input.affectedFields,
      metadata: input.metadata,
      occurredAt,
      previousHash,
    };

    const payload = canonicalize(partial);
    const hash = computeHash(this.options.signingKey, previousHash, payload);
    const entry: AuditEntry = { ...partial, hash };

    await this.options.persist(entry);
    return entry;
  }
}

/** Factory helper — creates an {@link AuditTrailLogger} with defaults. */
export function createAuditTrailLogger(options: AuditTrailLoggerOptions): AuditTrailLogger {
  return new AuditTrailLogger(options);
}
