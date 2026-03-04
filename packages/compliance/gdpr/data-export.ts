/**
 * @file packages/compliance/gdpr/data-export.ts
 * @summary GDPR Article 20 — Right to Data Portability.
 * @description Collects all personal data held for a tenant's user and
 *   serialises it into a portable, machine-readable format (JSON or CSV).
 *
 *   Each data domain (profile, activity, billing…) is collected by a
 *   registered {@link DataCollector}. The orchestrator runs all collectors
 *   in parallel and aggregates the results into a single export bundle.
 *
 * @security
 *   - All collectors are called with the tenant-resolved `tenantId`.
 *   - The export payload is not logged; only the metadata (collector names,
 *     record counts) is written to the audit trail.
 * @requirements TASK-COMP-001
 */

import { z } from 'zod';
import { createHash } from 'node:crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Supported export formats. */
export type ExportFormat = 'json' | 'csv';

/** A single domain's contribution to the export bundle. */
export interface CollectedDomain {
  /** Logical name of the domain (e.g. `"profile"`, `"activity_logs"`). */
  domain: string;
  /** The collected records as plain JS objects. */
  records: Record<string, unknown>[];
}

/**
 * A handler that collects all personal-data records for one domain.
 * Register with {@link DataExport.register}.
 */
export interface DataCollector {
  /** Logical domain name. */
  domainName: string;
  /** Collect all records for the given user within the given tenant. */
  collect(tenantId: string, userId: string): Promise<Record<string, unknown>[]>;
}

/** Final export bundle. */
export interface ExportBundle {
  /** ISO-8601 timestamp when the export was generated. */
  exportedAt: string;
  tenantId: string;
  /** SHA-256 hash of userId — PII-safe for logging. */
  userIdHash: string;
  format: ExportFormat;
  /** Total records across all domains. */
  totalRecords: number;
  domains: CollectedDomain[];
  /** Raw serialised payload (JSON string or CSV string). */
  payload: string;
}

// ─── CSV serialisation ────────────────────────────────────────────────────────

function recordsToCsv(records: Record<string, unknown>[]): string {
  if (records.length === 0) return '';
  const headers = Object.keys(records[0]);
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = records.map((r) => headers.map((h) => escape(r[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

// ─── DataExport ───────────────────────────────────────────────────────────────

/**
 * Orchestrates GDPR data-portability exports for a user.
 *
 * @example
 * ```ts
 * const exporter = new DataExport();
 * exporter.register(profileCollector);
 * exporter.register(activityCollector);
 *
 * const bundle = await exporter.export({ tenantId, userId, format: 'json' });
 * res.setHeader('Content-Disposition', 'attachment; filename="gdpr-export.json"');
 * res.send(bundle.payload);
 * ```
 */
export class DataExport {
  private readonly collectors: DataCollector[] = [];

  /** Register a domain collector. */
  register(collector: DataCollector): void {
    this.collectors.push(collector);
  }

  /**
   * Collect and serialise all personal data for the specified user.
   * Collectors run in parallel; a failure in one domain does not block others.
   */
  async export(params: {
    tenantId: string;
    userId: string;
    format?: ExportFormat;
  }): Promise<ExportBundle> {
    const { tenantId, userId, format = 'json' } = params;
    const exportedAt = new Date().toISOString();
    const userIdHash = createHash('sha256').update(userId).digest('hex');

    const domainResults = await Promise.allSettled(
      this.collectors.map(async (c) => ({
        domain: c.domainName,
        records: await c.collect(tenantId, userId),
      }))
    );

    const domains: CollectedDomain[] = domainResults.map((result, i) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      // Domain failed — include empty records with a note
      return {
        domain: this.collectors[i].domainName,
        records: [
          {
            _error: 'Collection failed',
            _detail: String((result as PromiseRejectedResult).reason),
          },
        ],
      };
    });

    const totalRecords = domains.reduce((sum, d) => sum + d.records.length, 0);

    let payload: string;
    if (format === 'csv') {
      // Flatten all domains into a single CSV with a `_domain` column
      const allRows: Record<string, unknown>[] = domains.flatMap((d) =>
        d.records.map((r) => ({ _domain: d.domain, ...r }))
      );
      payload = recordsToCsv(allRows);
    } else {
      payload = JSON.stringify({ exportedAt, tenantId, domains }, null, 2);
    }

    return { exportedAt, tenantId, userIdHash, format, totalRecords, domains, payload };
  }
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

export const ExportRequestSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().min(1),
  format: z.enum(['json', 'csv']).default('json'),
});

export type ExportRequest = z.infer<typeof ExportRequestSchema>;

/** Factory helper. */
export function createDataExport(): DataExport {
  return new DataExport();
}
