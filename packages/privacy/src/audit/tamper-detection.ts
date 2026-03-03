/**
 * @file packages/privacy/src/audit/tamper-detection.ts
 * @summary Detects tampering in a stored audit trail by comparing a live chain
 *   report against expected invariants.
 * @description Provides {@link detectTampering} which wraps
 *   {@link verifyAuditChain} with additional heuristics:
 *   - Detects missing entries (sequence gaps) by comparing `totalEntries`
 *     against an expected count.
 *   - Raises an alert when an entry's `occurredAt` is out of chronological
 *     order.
 *   - Surfaces the first tampered entry with actionable context.
 * @requirements TASK-COMP-001
 */

import { verifyAuditChain } from './trail-verifier';
import type { AuditChainReport } from './trail-verifier';
import type { AuditEntry } from './trail-logger';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Result returned by {@link detectTampering}. */
export interface TamperDetectionResult {
  /** `true` when no tampering was detected. */
  clean: boolean;
  /** Specific issues found; empty array when `clean` is true. */
  issues: TamperIssue[];
  /** Underlying chain verification report. */
  chainReport: AuditChainReport;
}

export type TamperIssueKind =
  | 'hash_mismatch'
  | 'previous_hash_mismatch'
  | 'chronological_order_violation'
  | 'entry_count_mismatch';

export interface TamperIssue {
  kind: TamperIssueKind;
  entryId?: string;
  index?: number;
  detail: string;
}

// ─── Detection ───────────────────────────────────────────────────────────────

/**
 * Detect tampering in an ordered sequence of audit entries.
 *
 * @param signingKey     HMAC signing key used when entries were created.
 * @param entries        Entries to inspect, in chronological order.
 * @param expectedCount  When provided, flags an issue if `entries.length`
 *                       does not match (e.g. entries were deleted from storage).
 */
export function detectTampering(
  signingKey: string,
  entries: readonly AuditEntry[],
  expectedCount?: number,
): TamperDetectionResult {
  const issues: TamperIssue[] = [];

  // 1. Entry count check
  if (expectedCount !== undefined && entries.length !== expectedCount) {
    issues.push({
      kind: 'entry_count_mismatch',
      detail: `Expected ${expectedCount} entries but found ${entries.length}. Entries may have been deleted.`,
    });
  }

  // 2. Chronological order check
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]!;
    const curr = entries[i]!;
    if (curr.occurredAt < prev.occurredAt) {
      issues.push({
        kind: 'chronological_order_violation',
        entryId: curr.id,
        index: i,
        detail: `Entry at index ${i} (id=${curr.id}) has occurredAt="${curr.occurredAt}" which is before the previous entry "${prev.occurredAt}".`,
      });
    }
  }

  // 3. Cryptographic chain verification
  const chainReport = verifyAuditChain(signingKey, entries, false);

  for (const result of chainReport.results) {
    if (!result.valid) {
      const kind: TamperIssueKind = result.reason?.startsWith('previousHash')
        ? 'previous_hash_mismatch'
        : 'hash_mismatch';
      issues.push({
        kind,
        entryId: result.entryId,
        index: result.index,
        detail: result.reason ?? 'Hash verification failed',
      });
    }
  }

  return {
    clean: issues.length === 0,
    issues,
    chainReport,
  };
}
