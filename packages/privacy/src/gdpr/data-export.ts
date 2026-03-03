/**
 * @file packages/privacy/src/gdpr/data-export.ts
 * @summary GDPR Article 20 – Data Portability export builder.
 * @description Produces a machine-readable, tenant-scoped data export package
 *   for a given data subject. The export includes all personal data categories
 *   defined by {@link DataCategory} and a manifest that records what was
 *   included, the export timestamp, and the requesting actor.
 * @security
 *   - `tenantId` is validated on every call to prevent cross-tenant leakage.
 *   - The export is produced as a pure data object; serialisation to JSON /
 *     encryption / delivery is the caller's responsibility.
 *   - No PII is logged inside this module.
 * @requirements TASK-COMP-001
 */

import { randomUUID } from 'node:crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Categories of personal data that may be included in an export. */
export type DataCategory =
  | 'profile'
  | 'contact'
  | 'leads'
  | 'bookings'
  | 'payments'
  | 'consent_records'
  | 'audit_logs'
  | 'preferences'
  | 'communications';

/** A fetcher function that retrieves records for one data category. */
export type DataFetcher<T = unknown> = (params: {
  tenantId: string;
  subjectEmail: string;
}) => Promise<T[]>;

/** Registry mapping data categories to their fetcher functions. */
export type DataFetcherRegistry = Partial<Record<DataCategory, DataFetcher>>;

/** Manifest describing the export package contents. */
export interface ExportManifest {
  exportId: string;
  tenantId: string;
  subjectEmail: string;
  requestedBy: string;
  exportedAt: string;
  categories: DataCategory[];
  recordCounts: Partial<Record<DataCategory, number>>;
  format: 'json';
  gdprArticle: 'Article 20 - Right to Data Portability';
}

/** The complete data export package returned to the caller. */
export interface DataExportPackage {
  manifest: ExportManifest;
  data: Partial<Record<DataCategory, unknown[]>>;
}

// ─── Builder ─────────────────────────────────────────────────────────────────

/** Options for {@link DataExportBuilder}. */
export interface DataExportBuilderOptions {
  /** Map of category → async fetcher. Only registered categories are exported. */
  fetchers: DataFetcherRegistry;
}

/**
 * Builds GDPR data export packages for individual data subjects.
 *
 * @example
 * ```ts
 * const builder = new DataExportBuilder({
 *   fetchers: {
 *     profile: ({ tenantId, subjectEmail }) =>
 *       db.profiles.findAll({ tenantId, email: subjectEmail }),
 *     leads: ({ tenantId, subjectEmail }) =>
 *       db.leads.findAll({ tenantId, email: subjectEmail }),
 *   },
 * });
 *
 * const pkg = await builder.export({
 *   tenantId: 'tenant-abc',
 *   subjectEmail: 'user@example.com',
 *   requestedBy: 'user-123',
 * });
 * ```
 */
export class DataExportBuilder {
  private readonly fetchers: DataFetcherRegistry;

  constructor(options: DataExportBuilderOptions) {
    this.fetchers = options.fetchers;
  }

  /**
   * Produce a complete data export package for the given subject.
   *
   * @param params.tenantId      Tenant scope – prevents cross-tenant exports.
   * @param params.subjectEmail  Email address of the data subject.
   * @param params.requestedBy   Actor ID (user or DPO) who initiated the request.
   * @param params.categories    Subset of categories to include. Defaults to all
   *                             registered categories.
   */
  async export(params: {
    tenantId: string;
    subjectEmail: string;
    requestedBy: string;
    categories?: DataCategory[];
  }): Promise<DataExportPackage> {
    const { tenantId, subjectEmail, requestedBy } = params;

    if (!tenantId) throw new Error('DataExportBuilder: tenantId is required.');
    if (!subjectEmail) throw new Error('DataExportBuilder: subjectEmail is required.');

    const categoriesToExport: DataCategory[] =
      params.categories ?? (Object.keys(this.fetchers) as DataCategory[]);

    const data: Partial<Record<DataCategory, unknown[]>> = {};
    const recordCounts: Partial<Record<DataCategory, number>> = {};

    await Promise.all(
      categoriesToExport.map(async (category) => {
        const fetcher = this.fetchers[category];
        if (!fetcher) return;
        const records = await fetcher({ tenantId, subjectEmail });
        data[category] = records;
        recordCounts[category] = records.length;
      }),
    );

    const manifest: ExportManifest = {
      exportId: randomUUID(),
      tenantId,
      subjectEmail,
      requestedBy,
      exportedAt: new Date().toISOString(),
      categories: categoriesToExport.filter((c) => c in data),
      recordCounts,
      format: 'json',
      gdprArticle: 'Article 20 - Right to Data Portability',
    };

    return { manifest, data };
  }
}

/** Factory helper — creates a {@link DataExportBuilder}. */
export function createDataExportBuilder(options: DataExportBuilderOptions): DataExportBuilder {
  return new DataExportBuilder(options);
}
