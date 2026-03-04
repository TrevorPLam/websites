/**
 * @file packages/compliance/audit/trail-verifier.ts
 * @summary Verifies the integrity of a hash-chained audit trail.
 * @description Re-computes each entry's `chainHash` and checks it against
 *   the stored value. Any discrepancy indicates that an entry was tampered
 *   with after it was appended.
 *
 *   Returns a detailed {@link VerificationResult} that identifies the first
 *   failing entry so the caller can pinpoint the tampering location.
 *
 * @security Verification is pure read-only; it never modifies the store or any entries.
 * @adr none
 * @requirements TASK-COMP-001
 */

import { computeChainHash } from './trail-logger';
import type { AuditTrailEntry, AuditTrailStore } from './trail-logger';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Result of a single-entry verification. */
export interface EntryVerificationResult {
  index: number;
  /** Whether this entry's hash is consistent with the chain. */
  valid: boolean;
  /** The hash stored in the entry. */
  storedHash: string;
  /** The hash recomputed from entry fields + previous hash. */
  recomputedHash: string;
}

/** Overall trail verification result. */
export interface VerificationResult {
  /** Whether the entire trail is intact. */
  intact: boolean;
  /** Total number of entries checked. */
  totalEntries: number;
  /** Number of entries that passed verification. */
  validEntries: number;
  /** Details for every entry (useful for auditors). */
  entries: EntryVerificationResult[];
  /**
   * Index of the first tampered entry, or `null` when the trail is intact.
   * All entries after this index are considered compromised.
   */
  firstTamperedIndex: number | null;
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Verify the integrity of the complete audit trail for a tenant.
 *
 * The verification walk:
 * 1. The genesis entry (index 0) must have `previousHash = ""`.
 * 2. Each subsequent entry's hash must equal `SHA-256(prevHash:index:…)`.
 * 3. Entries must be ordered by `index` (0, 1, 2, …) without gaps.
 *
 * @param entries  Ordered list of audit trail entries (ascending by index).
 */
export function verifyAuditChain(entries: AuditTrailEntry[]): VerificationResult {
  const results: EntryVerificationResult[] = [];
  let firstTamperedIndex: number | null = null;

  let previousHash = '';

  for (const entry of entries) {
    const recomputedHash = computeChainHash(previousHash, entry);
    const valid = recomputedHash === entry.chainHash;

    results.push({
      index: entry.index,
      valid,
      storedHash: entry.chainHash,
      recomputedHash,
    });

    if (!valid && firstTamperedIndex === null) {
      firstTamperedIndex = entry.index;
    }

    // Continue walking from the stored hash (not the recomputed one) so we
    // can detect later entries that chain from a tampered entry.
    previousHash = entry.chainHash;
  }

  const validEntries = results.filter((r) => r.valid).length;

  return {
    intact: firstTamperedIndex === null,
    totalEntries: entries.length,
    validEntries,
    entries: results,
    firstTamperedIndex,
  };
}

/**
 * Convenience wrapper that loads entries from a store and verifies them.
 *
 * @param store     Audit trail store to read from.
 * @param tenantId  Tenant whose trail should be verified.
 */
export async function verifyTenantAuditChain(
  store: AuditTrailStore,
  tenantId: string
): Promise<VerificationResult> {
  const entries = await store.listByTenant(tenantId);
  return verifyAuditChain(entries);
}
