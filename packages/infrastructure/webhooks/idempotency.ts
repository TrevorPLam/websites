/**
 * @file packages/infrastructure/webhooks/idempotency.ts
 * @summary Webhook idempotency layer — deduplicates incoming webhook events.
 * @description Prevents duplicate processing of webhook events (e.g. Stripe
 *   retries) by recording each processed event ID and rejecting any duplicate
 *   that arrives within the configurable TTL window.
 *
 *   Storage is abstracted behind {@link IdempotencyStore} so callers can plug
 *   in Redis, a database, or an in-memory store (for tests).
 *
 * @security
 *   - Idempotency keys are scoped to `(tenantId, source)` to prevent
 *     cross-tenant key collisions.
 *   - The stored record never contains the raw webhook payload to avoid
 *     accumulating PII in the idempotency store.
 * @requirements PROD-002
 */

import { createHash } from 'node:crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Webhook sources supported by the idempotency layer. */
export type WebhookSource = 'stripe' | 'resend' | 'qstash' | string;

/** A stored idempotency record. */
export interface IdempotencyRecord {
  /** Composite key: `{source}:{tenantId}:{eventId}` */
  key: string;
  /** Processing result stored for replay. */
  status: 'processed' | 'failed';
  /** ISO-8601 timestamp when the event was first processed. */
  processedAt: string;
  /** HTTP status code returned for the first processing attempt. */
  statusCode: number;
  /** Unix timestamp (seconds) when this record expires. */
  expiresAt: number;
}

/** Pluggable storage interface for idempotency records. */
export interface IdempotencyStore {
  get(key: string): Promise<IdempotencyRecord | null>;
  set(key: string, record: IdempotencyRecord, ttlSeconds: number): Promise<void>;
}

/** Result of {@link WebhookIdempotency.check}. */
export type IdempotencyCheckResult =
  | { duplicate: false }
  | { duplicate: true; record: IdempotencyRecord };

// ─── Idempotency manager ─────────────────────────────────────────────────────

/** Options for {@link WebhookIdempotency}. */
export interface WebhookIdempotencyOptions {
  /** Pluggable store (Redis, DB, or in-memory for tests). */
  store: IdempotencyStore;
  /**
   * How long (in seconds) to retain idempotency records.
   * Stripe recommends >= 24 hours (86 400 s) to handle their retry window.
   * @default 86400
   */
  ttlSeconds?: number;
}

/**
 * Manages webhook idempotency to prevent duplicate event processing.
 *
 * @example
 * ```ts
 * const idempotency = new WebhookIdempotency({ store: redisStore });
 *
 * // In your webhook handler:
 * const result = await idempotency.check({ source: 'stripe', tenantId, eventId });
 * if (result.duplicate) {
 *   return new Response('Already processed', { status: 200 });
 * }
 *
 * // Process the event…
 * await idempotency.record({ source: 'stripe', tenantId, eventId, statusCode: 200 });
 * ```
 */
export class WebhookIdempotency {
  private readonly store: IdempotencyStore;
  private readonly ttlSeconds: number;

  constructor(options: WebhookIdempotencyOptions) {
    this.store = options.store;
    this.ttlSeconds = options.ttlSeconds ?? 86_400;
  }

  /**
   * Build the composite idempotency key for a webhook event.
   * The key is a SHA-256 truncated hash of `{source}:{tenantId}:{eventId}` to
   * keep key lengths predictable regardless of input length.
   */
  buildKey(params: { source: WebhookSource; tenantId: string; eventId: string }): string {
    const raw = `${params.source}:${params.tenantId}:${params.eventId}`;
    return createHash('sha256').update(raw).digest('hex').slice(0, 48);
  }

  /**
   * Check whether a webhook event has already been processed.
   * Returns `{ duplicate: false }` when the event is new.
   * Returns `{ duplicate: true, record }` when a matching record exists.
   */
  async check(params: {
    source: WebhookSource;
    tenantId: string;
    eventId: string;
  }): Promise<IdempotencyCheckResult> {
    const key = this.buildKey(params);
    const record = await this.store.get(key);
    if (record) return { duplicate: true, record };
    return { duplicate: false };
  }

  /**
   * Record a successfully processed (or failed) webhook event.
   * Should be called **after** processing completes to avoid marking an event
   * as processed before it has been handled.
   */
  async record(params: {
    source: WebhookSource;
    tenantId: string;
    eventId: string;
    statusCode: number;
    status?: IdempotencyRecord['status'];
  }): Promise<void> {
    const key = this.buildKey(params);
    const now = Math.floor(Date.now() / 1000);
    const record: IdempotencyRecord = {
      key,
      status: params.status ?? 'processed',
      processedAt: new Date().toISOString(),
      statusCode: params.statusCode,
      expiresAt: now + this.ttlSeconds,
    };
    await this.store.set(key, record, this.ttlSeconds);
  }
}

// ─── In-memory store (for testing / local dev) ───────────────────────────────

/** Simple in-memory idempotency store — not suitable for production clusters. */
export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly data = new Map<string, IdempotencyRecord>();

  async get(key: string): Promise<IdempotencyRecord | null> {
    const record = this.data.get(key);
    if (!record) return null;
    if (record.expiresAt < Math.floor(Date.now() / 1000)) {
      this.data.delete(key);
      return null;
    }
    return record;
  }

  async set(key: string, record: IdempotencyRecord, _ttlSeconds: number): Promise<void> {
    this.data.set(key, record);
  }

  /** Clear all records (useful in tests). */
  clear(): void {
    this.data.clear();
  }
}

/** Factory helper. */
export function createWebhookIdempotency(
  options: WebhookIdempotencyOptions,
): WebhookIdempotency {
  return new WebhookIdempotency(options);
}
