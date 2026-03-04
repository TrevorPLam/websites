/**
 * @file packages/compliance/gdpr/consent-manager.ts
 * @summary GDPR/CCPA Consent Management — records and evaluates user consent preferences.
 * @description Tracks per-user, per-purpose consent decisions (e.g. `analytics`,
 *   `marketing`, `functional`) via a pluggable {@link ConsentStore}. Evaluates
 *   whether a given processing purpose is permitted for a user based on their
 *   most recent consent record.
 *
 *   Consent records are immutable — each change appends a new record. The
 *   most-recent record for a given `(tenantId, userId, purpose)` triple is
 *   the authoritative state.
 *
 * @security
 *   - `tenantId` is always resolved server-side.
 *   - Consent state must be re-checked on every request that triggers
 *     processing — do not cache indefinitely.
 * @requirements TASK-COMP-001
 */

import { z } from 'zod';
import { randomUUID } from 'node:crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Supported consent purposes. Extend as needed. */
export const ConsentPurposeSchema = z.enum([
  'analytics',
  'marketing',
  'functional',
  'personalization',
  'third_party_sharing',
]);
export type ConsentPurpose = z.infer<typeof ConsentPurposeSchema>;

/** An immutable consent decision record. */
export interface ConsentRecord {
  /** Auto-generated unique ID for this record. */
  id: string;
  tenantId: string;
  userId: string;
  purpose: ConsentPurpose;
  /** Whether the user granted consent. */
  granted: boolean;
  /** ISO-8601 timestamp of this consent decision. */
  recordedAt: string;
  /** User agent string (for audit evidence). */
  userAgent?: string;
  /** IP address (store hashed in production to avoid storing PII). */
  ipAddressHash?: string;
  /** The legal basis for processing (GDPR Art. 6). */
  legalBasis?: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
}

/** Schema for creating a new consent record. */
export const ConsentRecordInputSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().min(1),
  purpose: ConsentPurposeSchema,
  granted: z.boolean(),
  userAgent: z.string().optional(),
  ipAddressHash: z.string().optional(),
  legalBasis: z.enum(['consent', 'legitimate_interest', 'contract', 'legal_obligation']).optional(),
});
export type ConsentRecordInput = z.infer<typeof ConsentRecordInputSchema>;

/** Pluggable storage interface for consent records. */
export interface ConsentStore {
  /** Append a new consent record (records are immutable — never update). */
  append(record: ConsentRecord): Promise<void>;
  /** Return the most-recent record for each purpose for a given user. */
  getLatest(
    tenantId: string,
    userId: string
  ): Promise<Record<ConsentPurpose, ConsentRecord | null>>;
  /** Return the full consent history for a user (for GDPR audit). */
  getHistory(tenantId: string, userId: string): Promise<ConsentRecord[]>;
}

// ─── InMemoryConsentStore ─────────────────────────────────────────────────────

/** In-memory consent store for tests and local development. */
export class InMemoryConsentStore implements ConsentStore {
  private readonly records = new Map<string, ConsentRecord[]>();

  private static key(tenantId: string, userId: string): string {
    return `${tenantId}:${userId}`;
  }

  async append(record: ConsentRecord): Promise<void> {
    const k = InMemoryConsentStore.key(record.tenantId, record.userId);
    const existing = this.records.get(k) ?? [];
    this.records.set(k, [...existing, record]);
  }

  async getLatest(
    tenantId: string,
    userId: string
  ): Promise<Record<ConsentPurpose, ConsentRecord | null>> {
    const k = InMemoryConsentStore.key(tenantId, userId);
    const all = this.records.get(k) ?? [];

    const latest: Partial<Record<ConsentPurpose, ConsentRecord | null>> = {};
    for (const record of all) {
      const existing = latest[record.purpose];
      if (!existing || record.recordedAt >= existing.recordedAt) {
        latest[record.purpose] = record;
      }
    }

    const purposes = ConsentPurposeSchema.options;
    return Object.fromEntries(purposes.map((p) => [p, latest[p] ?? null])) as Record<
      ConsentPurpose,
      ConsentRecord | null
    >;
  }

  async getHistory(tenantId: string, userId: string): Promise<ConsentRecord[]> {
    const k = InMemoryConsentStore.key(tenantId, userId);
    return [...(this.records.get(k) ?? [])];
  }
}

// ─── ConsentManager ───────────────────────────────────────────────────────────

/**
 * Manages GDPR/CCPA consent preferences for platform users.
 *
 * @example
 * ```ts
 * const manager = new ConsentManager({ store: new InMemoryConsentStore() });
 *
 * // Record consent during cookie banner interaction:
 * await manager.record({ tenantId, userId, purpose: 'analytics', granted: true });
 *
 * // Check before firing analytics event:
 * const allowed = await manager.isPermitted(tenantId, userId, 'analytics');
 * ```
 */
export class ConsentManager {
  constructor(private readonly store: ConsentStore) {}

  /**
   * Record a new consent decision. Each call appends an immutable record.
   * @throws {ZodError} When input fails schema validation.
   */
  async record(input: ConsentRecordInput): Promise<ConsentRecord> {
    const validated = ConsentRecordInputSchema.parse(input);
    const record: ConsentRecord = {
      id: randomUUID(),
      ...validated,
      recordedAt: new Date().toISOString(),
    };

    await this.store.append(record);
    return record;
  }

  /**
   * Check whether a specific processing purpose is currently permitted for a user.
   * Returns `false` when no consent record exists (opt-in model).
   */
  async isPermitted(tenantId: string, userId: string, purpose: ConsentPurpose): Promise<boolean> {
    const latest = await this.store.getLatest(tenantId, userId);
    return latest[purpose]?.granted ?? false;
  }

  /**
   * Return the full consent snapshot (all purposes) for a user.
   * Useful for rendering the consent management UI.
   */
  async getSnapshot(tenantId: string, userId: string): Promise<Record<ConsentPurpose, boolean>> {
    const latest = await this.store.getLatest(tenantId, userId);
    return Object.fromEntries(
      Object.entries(latest).map(([p, r]) => [p, r?.granted ?? false])
    ) as Record<ConsentPurpose, boolean>;
  }

  /** Return full consent history for a user (for GDPR audit export). */
  async getHistory(tenantId: string, userId: string): Promise<ConsentRecord[]> {
    return this.store.getHistory(tenantId, userId);
  }
}

/** Factory helper. */
export function createConsentManager(store: ConsentStore): ConsentManager {
  return new ConsentManager(store);
}
