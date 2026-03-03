/**
 * @file packages/privacy/src/audit/trail-verifier.ts
 * @summary Verifies the cryptographic integrity of a hash-chained audit trail.
 * @description Replays the HMAC chain over a sequence of {@link AuditEntry}
 *   records and returns a detailed verification report. Any gap, reorder, or
 *   modification in the chain is surfaced as a failing assertion.
 * @requirements TASK-COMP-001
 */

import { canonicalize, computeHash, GENESIS_HASH } from './trail-logger';
import type { AuditEntry } from './trail-logger';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Per-entry result produced during chain verification. */
export interface EntryVerification {
  index: number;
  entryId: string;
  valid: boolean;
  /** Human-readable reason when `valid` is false. */
  reason?: string;
}

/** Aggregate report returned by {@link verifyAuditChain}. */
export interface AuditChainReport {
  /** `true` only when every entry in the chain is valid. */
  intact: boolean;
  /** Number of entries checked. */
  totalEntries: number;
  /** Number of entries that failed verification. */
  failedEntries: number;
  /** Per-entry details (only entries with `valid: false` are included when `verboseOk` is false). */
  results: EntryVerification[];
}

// ─── Verifier ────────────────────────────────────────────────────────────────

/**
 * Verify the integrity of an ordered sequence of audit entries.
 *
 * The entries **must** be provided in chronological order (ascending by
 * `occurredAt`) and belong to a single tenant.
 *
 * @param signingKey  The same HMAC key used when the entries were created.
 * @param entries     Ordered list of {@link AuditEntry} records to verify.
 * @param verboseOk   When `true`, include passing entries in `results`.
 *                    Default `false` — only failures are reported.
 */
export function verifyAuditChain(
  signingKey: string,
  entries: readonly AuditEntry[],
  verboseOk = false,
): AuditChainReport {
  const results: EntryVerification[] = [];
  let failedEntries = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const expectedPreviousHash = i === 0 ? GENESIS_HASH : (entries[i - 1]?.hash ?? GENESIS_HASH);

    // Verify previousHash pointer
    if (entry.previousHash !== expectedPreviousHash) {
      failedEntries++;
      results.push({
        index: i,
        entryId: entry.id,
        valid: false,
        reason: `previousHash mismatch: expected "${expectedPreviousHash}", got "${entry.previousHash}"`,
      });
      continue;
    }

    // Recompute hash from entry payload
    const { hash: _h, ...partial } = entry;
    const payload = canonicalize(partial);
    const expectedHash = computeHash(signingKey, expectedPreviousHash, payload);

    if (entry.hash !== expectedHash) {
      failedEntries++;
      results.push({
        index: i,
        entryId: entry.id,
        valid: false,
        reason: `hash mismatch: entry may have been tampered with`,
      });
      continue;
    }

    if (verboseOk) {
      results.push({ index: i, entryId: entry.id, valid: true });
    }
  }

  return {
    intact: failedEntries === 0,
    totalEntries: entries.length,
    failedEntries,
    results,
  };
}
