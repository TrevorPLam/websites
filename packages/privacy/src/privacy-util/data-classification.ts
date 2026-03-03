/**
 * @file packages/privacy/src/privacy-util/data-classification.ts
 * @summary Data classification registry for GDPR/CCPA compliance.
 * @description Defines sensitivity levels for data fields and provides helpers
 *   to classify, redact, and audit field-level access. Used by server actions
 *   and API handlers to ensure that high-sensitivity data is handled
 *   appropriately (encrypted at rest, excluded from logs, etc.).
 * @requirements TASK-COMP-001
 */

// ─── Sensitivity levels ──────────────────────────────────────────────────────

/**
 * Data sensitivity classification levels (ascending severity).
 *
 * - `public`:      Safe to expose externally (e.g. tenant name, page slug).
 * - `internal`:    Internal use only; not for external APIs (e.g. tenant config).
 * - `confidential`: Business-sensitive; access-logged (e.g. billing amounts).
 * - `restricted`:  Personal data under GDPR / CCPA; field-level encryption
 *                  recommended (e.g. email, phone, IP address).
 * - `sensitive`:   Special-category data (Art. 9 GDPR); highest protection
 *                  required (e.g. health data, biometrics).
 */
export type SensitivityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | 'sensitive';

/** GDPR legal basis for processing personal data. */
export type LegalBasis =
  | 'consent'
  | 'contract'
  | 'legal_obligation'
  | 'vital_interests'
  | 'public_task'
  | 'legitimate_interests';

/** Classification metadata for a single data field. */
export interface FieldClassification {
  /** Human-readable field name (e.g. "email", "ip_address"). */
  field: string;
  /** Sensitivity level. */
  sensitivity: SensitivityLevel;
  /** Whether this field constitutes personal data under GDPR Art. 4. */
  isPersonalData: boolean;
  /** GDPR legal basis for processing this field. */
  legalBasis?: LegalBasis;
  /** Whether this field must be encrypted at rest. */
  encryptAtRest: boolean;
  /** Whether this field must be excluded from application logs. */
  excludeFromLogs: boolean;
  /** Retention period in days (0 = retain indefinitely). */
  retentionDays: number;
}

// ─── Default registry ────────────────────────────────────────────────────────

// ─── Retention period constants ──────────────────────────────────────────────

/** 7-year financial data retention (EU/US tax requirements). */
const FINANCIAL_RETENTION_DAYS = 2555;

/**
 * Default field classifications for the marketing SaaS platform.
 * Callers can extend this registry with domain-specific fields.
 */
export const DEFAULT_FIELD_CLASSIFICATIONS: FieldClassification[] = [
  // Public fields
  { field: 'tenant_name', sensitivity: 'public', isPersonalData: false, encryptAtRest: false, excludeFromLogs: false, retentionDays: 0 },
  { field: 'site_slug', sensitivity: 'public', isPersonalData: false, encryptAtRest: false, excludeFromLogs: false, retentionDays: 0 },
  // Internal
  { field: 'tenant_id', sensitivity: 'internal', isPersonalData: false, encryptAtRest: false, excludeFromLogs: false, retentionDays: 0 },
  { field: 'plan_id', sensitivity: 'internal', isPersonalData: false, encryptAtRest: false, excludeFromLogs: false, retentionDays: 0 },
  // Confidential
  { field: 'stripe_customer_id', sensitivity: 'confidential', isPersonalData: false, encryptAtRest: false, excludeFromLogs: true, retentionDays: FINANCIAL_RETENTION_DAYS },
  { field: 'billing_amount', sensitivity: 'confidential', isPersonalData: false, encryptAtRest: false, excludeFromLogs: true, retentionDays: FINANCIAL_RETENTION_DAYS },
  // Restricted – personal data
  { field: 'email', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'consent', encryptAtRest: true, excludeFromLogs: true, retentionDays: 730 },
  { field: 'first_name', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'consent', encryptAtRest: false, excludeFromLogs: true, retentionDays: 730 },
  { field: 'last_name', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'consent', encryptAtRest: false, excludeFromLogs: true, retentionDays: 730 },
  { field: 'phone', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'consent', encryptAtRest: true, excludeFromLogs: true, retentionDays: 730 },
  { field: 'ip_address', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'legitimate_interests', encryptAtRest: true, excludeFromLogs: true, retentionDays: 90 },
  { field: 'user_agent', sensitivity: 'restricted', isPersonalData: true, legalBasis: 'legitimate_interests', encryptAtRest: false, excludeFromLogs: true, retentionDays: 90 },
];

// ─── Registry class ──────────────────────────────────────────────────────────

/**
 * Manages field classifications and provides lookup / redaction helpers.
 */
export class DataClassificationRegistry {
  private readonly registry = new Map<string, FieldClassification>();

  constructor(classifications: FieldClassification[] = DEFAULT_FIELD_CLASSIFICATIONS) {
    for (const c of classifications) {
      this.registry.set(c.field, c);
    }
  }

  /** Register or overwrite a field classification. */
  register(classification: FieldClassification): void {
    this.registry.set(classification.field, classification);
  }

  /** Return the classification for a field, or `undefined` if unknown. */
  getClassification(field: string): FieldClassification | undefined {
    return this.registry.get(field);
  }

  /** Return the sensitivity level for a field (defaults to `'internal'` for unknown fields). */
  getSensitivity(field: string): SensitivityLevel {
    return this.registry.get(field)?.sensitivity ?? 'internal';
  }

  /** Return `true` if the field should be excluded from application logs. */
  shouldExcludeFromLogs(field: string): boolean {
    return this.registry.get(field)?.excludeFromLogs ?? false;
  }

  /**
   * Redact all fields in an object whose classification has `excludeFromLogs: true`.
   * Returns a new object; does not mutate the input.
   */
  redactForLogging(record: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      result[key] = this.shouldExcludeFromLogs(key) ? '[REDACTED]' : value;
    }
    return result;
  }

  /** Return all fields classified as personal data. */
  getPersonalDataFields(): FieldClassification[] {
    return Array.from(this.registry.values()).filter((c) => c.isPersonalData);
  }

  /** Return all fields at or above the given sensitivity level. */
  getFieldsBySensitivity(minLevel: SensitivityLevel): FieldClassification[] {
    const order: SensitivityLevel[] = ['public', 'internal', 'confidential', 'restricted', 'sensitive'];
    const minIndex = order.indexOf(minLevel);
    return Array.from(this.registry.values()).filter(
      (c) => order.indexOf(c.sensitivity) >= minIndex,
    );
  }
}

/** Singleton registry initialised with platform defaults. */
export const dataClassificationRegistry = new DataClassificationRegistry();
