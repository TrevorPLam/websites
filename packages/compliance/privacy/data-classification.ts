/**
 * @file packages/compliance/privacy/data-classification.ts
 * @summary PII data classification — tag and redact sensitive fields.
 * @description Provides a set of utilities to:
 *   1. Classify object fields as PII, sensitive, or public.
 *   2. Redact classified fields before logging or storing non-sensitive copies.
 *   3. Validate that a payload doesn't leak high-classification fields
 *      into low-trust destinations (e.g. client responses, log lines).
 *
 *   Classification levels (ascending sensitivity):
 *   - `public` — safe to expose anywhere.
 *   - `internal` — safe within the platform; not for end-user display.
 *   - `pii` — personally identifiable information (GDPR-regulated).
 *   - `sensitive` — financial, health, credential data; strictest controls.
 *
 * @security Redaction removes or masks sensitive field values; no raw PII is retained in redacted output.
 * @adr none
 * @requirements TASK-COMP-001
 */

import { z } from 'zod';
import { createHash } from 'node:crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Data sensitivity level (ascending). */
export const DataClassificationSchema = z.enum(['public', 'internal', 'pii', 'sensitive']);
export type DataClassification = z.infer<typeof DataClassificationSchema>;

/** A classification rule for a named field pattern. */
export interface ClassificationRule {
  /** Glob-style field name (e.g. `"email"`, `"*_token"`, `"address.*"`). */
  fieldPattern: string;
  classification: DataClassification;
  /** Redaction strategy when this field is removed. Defaults to `"mask"`. */
  redactionStrategy?: 'remove' | 'mask' | 'hash';
}

/** Result of classifying a flat object. */
export interface ClassificationResult {
  /** Map of field name → classification. */
  fields: Record<string, DataClassification>;
  /** Fields at or above the specified minimum level. */
  flaggedFields: string[];
}

// ─── Built-in rules ───────────────────────────────────────────────────────────

/**
 * Default classification rules for common field names found in SaaS platforms.
 * Add or override rules by calling {@link DataClassifier.addRule}.
 */
const DEFAULT_RULES: ClassificationRule[] = [
  // Sensitive — credentials, financial
  { fieldPattern: 'password', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'passwordHash', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'secret', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'apiKey', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'api_key', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'token', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'accessToken', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'refreshToken', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'creditCard', classification: 'sensitive', redactionStrategy: 'mask' },
  { fieldPattern: 'cardNumber', classification: 'sensitive', redactionStrategy: 'mask' },
  { fieldPattern: 'cvv', classification: 'sensitive', redactionStrategy: 'remove' },
  { fieldPattern: 'ssn', classification: 'sensitive', redactionStrategy: 'remove' },
  // PII — personal identifiers
  { fieldPattern: 'email', classification: 'pii', redactionStrategy: 'hash' },
  { fieldPattern: 'emailAddress', classification: 'pii', redactionStrategy: 'hash' },
  { fieldPattern: 'phone', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'phoneNumber', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'firstName', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'lastName', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'fullName', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'name', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'address', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'ipAddress', classification: 'pii', redactionStrategy: 'hash' },
  { fieldPattern: 'dateOfBirth', classification: 'pii', redactionStrategy: 'mask' },
  { fieldPattern: 'dob', classification: 'pii', redactionStrategy: 'mask' },
  // Internal — safe within platform
  { fieldPattern: 'tenantId', classification: 'internal', redactionStrategy: 'mask' },
  { fieldPattern: 'userId', classification: 'internal', redactionStrategy: 'mask' },
];

// ─── Classification level ordering ───────────────────────────────────────────

const LEVEL_ORDER: Record<DataClassification, number> = {
  public: 0,
  internal: 1,
  pii: 2,
  sensitive: 3,
};

function levelAtLeast(level: DataClassification, minimum: DataClassification): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minimum];
}

// ─── DataClassifier ───────────────────────────────────────────────────────────

/**
 * Classifies and redacts fields in plain JS objects based on configurable rules.
 *
 * @example
 * ```ts
 * const classifier = new DataClassifier();
 *
 * // Redact before logging
 * const safe = classifier.redact(rawPayload, 'internal');
 * logger.info('User updated', safe);
 *
 * // Validate before sending to client
 * const violations = classifier.findViolations(responsePayload, 'internal');
 * if (violations.length > 0) throw new Error('Response leaks sensitive fields');
 * ```
 */
export class DataClassifier {
  private readonly rules: ClassificationRule[];

  constructor(extraRules?: ClassificationRule[]) {
    this.rules = [...DEFAULT_RULES, ...(extraRules ?? [])];
  }

  /** Add a classification rule. Later rules override earlier ones for the same field pattern. */
  addRule(rule: ClassificationRule): void {
    this.rules.push(rule);
  }

  /** Find the classification for a field name, or `"public"` if no rule matches. */
  classify(fieldName: string): DataClassification {
    // Last matching rule wins (most-specific overrides)
    let matched: DataClassification = 'public';
    for (const rule of this.rules) {
      if (this.matchesPattern(fieldName, rule.fieldPattern)) {
        matched = rule.classification;
      }
    }
    return matched;
  }

  /**
   * Classify all fields in a flat (single-level) object.
   *
   * @param obj      Flat object to classify.
   * @param minLevel Minimum level to include in `flaggedFields`.
   */
  classifyObject(
    obj: Record<string, unknown>,
    minLevel: DataClassification = 'pii'
  ): ClassificationResult {
    const fields: Record<string, DataClassification> = {};
    const flaggedFields: string[] = [];

    for (const key of Object.keys(obj)) {
      const level = this.classify(key);
      fields[key] = level;
      if (levelAtLeast(level, minLevel)) {
        flaggedFields.push(key);
      }
    }

    return { fields, flaggedFields };
  }

  /**
   * Return a copy of `obj` with all fields at or above `minLevel` redacted.
   * Redaction strategy per field:
   * - `'remove'` → field is omitted from the output.
   * - `'mask'` → value is replaced with `"[REDACTED]"`.
   * - `'hash'` → value is replaced with a SHA-256 hex digest.
   */
  redact(
    obj: Record<string, unknown>,
    minLevel: DataClassification = 'pii'
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const level = this.classify(key);
      if (!levelAtLeast(level, minLevel)) {
        result[key] = value;
        continue;
      }

      const strategy = this.getStrategy(key);
      if (strategy === 'remove') {
        // Field omitted
      } else if (strategy === 'mask') {
        result[key] = '[REDACTED]';
      } else if (strategy === 'hash') {
        result[key] = createHash('sha256')
          .update(String(value ?? ''))
          .digest('hex');
      } else {
        result[key] = '[REDACTED]';
      }
    }

    return result;
  }

  /**
   * Return field names in `obj` that exceed `maxLevel` (potential data leaks).
   * Use before sending a response to a client or writing to a low-trust log.
   */
  findViolations(obj: Record<string, unknown>, maxLevel: DataClassification): string[] {
    return Object.keys(obj).filter((key) => {
      const level = this.classify(key);
      return LEVEL_ORDER[level] > LEVEL_ORDER[maxLevel];
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private getStrategy(fieldName: string): ClassificationRule['redactionStrategy'] {
    let strategy: ClassificationRule['redactionStrategy'] = 'mask';
    for (const rule of this.rules) {
      if (this.matchesPattern(fieldName, rule.fieldPattern)) {
        strategy = rule.redactionStrategy ?? 'mask';
      }
    }
    return strategy;
  }

  private matchesPattern(fieldName: string, pattern: string): boolean {
    // Simple exact match or wildcard-suffix match (e.g. `"*_token"`)
    if (pattern === fieldName) return true;
    if (pattern.startsWith('*')) {
      return fieldName.endsWith(pattern.slice(1));
    }
    if (pattern.endsWith('*')) {
      return fieldName.startsWith(pattern.slice(0, -1));
    }
    return false;
  }
}

/** Singleton with default rules. */
export const defaultClassifier = new DataClassifier();

/** Factory helper. */
export function createDataClassifier(extraRules?: ClassificationRule[]): DataClassifier {
  return new DataClassifier(extraRules);
}
