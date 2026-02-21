/**
 * @file packages/infra/security/audit-logger.ts
 * Task: security-1-server-action-hardening
 *
 * Purpose: Structured security audit logger for server-side actions.
 * Writes JSON-structured log entries to stdout in production;
 * stores entries in memory for testing/development inspection.
 *
 * Exports: auditLogger, AuditLogEntry, AuditLogger
 * Used by: packages/infra/security/secure-action.ts, booking actions
 *
 * Invariants:
 * - All entries include timestamp and correlationId
 * - Sensitive fields (passwords, tokens) must never appear in metadata
 * - Memory store is bounded (max 1000 entries) to prevent unbounded growth
 * - Production writes to stdout as newline-delimited JSON (NDJSON)
 *
 * Status: @public
 */

import 'server-only';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  /** ISO timestamp of the event. */
  timestamp: string;
  /** Unique correlation ID for the action invocation. */
  correlationId: string;
  /** Log level: info for success paths, warn for auth events, error for failures. */
  level: 'info' | 'warn' | 'error';
  /** Name of the Server Action or operation being audited. */
  action: string;
  /** Resolved tenant ID for the request (never client-supplied). */
  tenantId?: string;
  /** Authenticated user ID or 'anonymous'. */
  userId?: string;
  /** Outcome of the action. */
  status: 'started' | 'success' | 'error' | 'validation_error' | 'unauthorized' | 'rate_limited';
  /** Additional structured metadata (must not contain PII or secrets). */
  metadata?: Record<string, unknown>;
}

export interface AuditLogger {
  log(entry: Omit<AuditLogEntry, 'timestamp'>): void;
  getEntries(): AuditLogEntry[];
  clear(): void;
}

// ─── Implementation ───────────────────────────────────────────────────────────

const MAX_MEMORY_ENTRIES = 1000;

function createAuditLogger(): AuditLogger {
  const entries: AuditLogEntry[] = [];

  return {
    log(entry: Omit<AuditLogEntry, 'timestamp'>): void {
      const full: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      };

      // Bounded in-memory store (dev + test inspection)
      if (entries.length >= MAX_MEMORY_ENTRIES) {
        entries.shift();
      }
      entries.push(full);

      // Structured stdout for production log aggregation (Datadog, CloudWatch, etc.)
      if (process.env.NODE_ENV === 'production' || process.env.AUDIT_LOG_STDOUT === 'true') {
        process.stdout.write(JSON.stringify(full) + '\n');
      } else if (process.env.NODE_ENV !== 'test') {
        // Development: human-readable console output
        const prefix = `[AUDIT:${full.level.toUpperCase()}]`;
        const ctx = [full.action, full.status, full.tenantId, full.correlationId]
          .filter(Boolean)
          .join(' | ');
        console[full.level === 'error' ? 'error' : full.level === 'warn' ? 'warn' : 'info'](
          `${prefix} ${ctx}`
        );
      }
    },

    getEntries(): AuditLogEntry[] {
      return [...entries];
    },

    clear(): void {
      entries.length = 0;
    },
  };
}

/** Singleton audit logger instance. */
export const auditLogger = createAuditLogger();
