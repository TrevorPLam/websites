/**
 * @file packages/infrastructure/webhooks/stripe-handler.ts
 * @summary Stripe webhook signature verification and typed event dispatch.
 * @description Provides {@link StripeWebhookHandler} which:
 *   1. Verifies the `Stripe-Signature` header using the webhook signing secret.
 *   2. Checks idempotency via {@link WebhookIdempotency} to prevent duplicate
 *      charge operations.
 *   3. Dispatches the verified event to a caller-supplied handler map.
 *
 * @security
 *   - Signature verification uses constant-time comparison (via stripe-js).
 *   - The raw request body must be passed as `Buffer` or `string` — never a
 *     parsed JSON object — to preserve the HMAC-valid byte sequence.
 *   - Event payloads are NOT logged; only `type` and `id` are traced.
 * @requirements PROD-002
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { WebhookIdempotency } from './idempotency';
import type { IdempotencyStore } from './idempotency';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Minimal Stripe event shape (avoids requiring the `stripe` npm package). */
export interface StripeEvent {
  id: string;
  type: string;
  livemode: boolean;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
}

/** Handler function for a specific Stripe event type. */
export type StripeEventHandler = (event: StripeEvent, tenantId: string) => Promise<void>;

/** Map of Stripe event types to their handler functions. */
export type StripeHandlerMap = Record<string, StripeEventHandler>;

/** Options for {@link StripeWebhookHandler}. */
export interface StripeWebhookHandlerOptions {
  /** Stripe webhook signing secret (`whsec_…`). */
  signingSecret: string;
  /** Idempotency store to use for deduplication. */
  idempotencyStore: IdempotencyStore;
  /**
   * Allowed tolerance (seconds) between Stripe's event timestamp and the
   * current server time. Stripe recommends 300 s.
   * @default 300
   */
  toleranceSeconds?: number;
  /**
   * Idempotency TTL in seconds.
   * @default 86400
   */
  idempotencyTtlSeconds?: number;
}

/** Result of {@link StripeWebhookHandler.handle}. */
export interface WebhookHandleResult {
  success: boolean;
  eventId: string;
  eventType: string;
  duplicate: boolean;
  message?: string;
}

// ─── Signature verification ───────────────────────────────────────────────────

/**
 * Verify a Stripe webhook signature.
 *
 * Stripe signs payloads as:
 * `v1=HMAC_SHA256(signingSecret, "${timestamp}.${rawBody}")`
 *
 * @throws When the signature header is malformed or the computed HMAC does not
 *         match — or when the timestamp is outside the tolerance window.
 */
export function verifyStripeSignature(params: {
  rawBody: string | Buffer;
  signatureHeader: string;
  signingSecret: string;
  toleranceSeconds: number;
}): void {
  const { rawBody, signatureHeader, signingSecret, toleranceSeconds } = params;
  const parts = signatureHeader.split(',');
  const tEntry = parts.find((p) => p.startsWith('t='));
  const v1Entry = parts.find((p) => p.startsWith('v1='));

  if (!tEntry || !v1Entry) {
    throw new Error('StripeWebhookHandler: malformed Stripe-Signature header.');
  }

  const timestamp = parseInt(tEntry.slice(2), 10);
  const signature = v1Entry.slice(3);

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    throw new Error(
      `StripeWebhookHandler: timestamp outside tolerance window (${toleranceSeconds}s).`,
    );
  }

  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const signed = `${timestamp}.${body}`;
  const expected = createHmac('sha256', signingSecret).update(signed).digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(signature, 'hex');

  if (
    expectedBuf.length !== actualBuf.length ||
    !timingSafeEqual(expectedBuf, actualBuf)
  ) {
    throw new Error('StripeWebhookHandler: signature verification failed.');
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default idempotency TTL in seconds (24 hours — covers Stripe's retry window). */
const DEFAULT_IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;

// ─── Handler ─────────────────────────────────────────────────────────────────

/**
 * Handles incoming Stripe webhook requests with signature verification and
 * idempotency deduplication.
 */
export class StripeWebhookHandler {
  private readonly idempotency: WebhookIdempotency;
  private readonly options: Required<StripeWebhookHandlerOptions>;

  constructor(options: StripeWebhookHandlerOptions) {
    this.options = {
      toleranceSeconds: 300,
      idempotencyTtlSeconds: DEFAULT_IDEMPOTENCY_TTL_SECONDS,
      ...options,
    };
    this.idempotency = new WebhookIdempotency({
      store: options.idempotencyStore,
      ttlSeconds: this.options.idempotencyTtlSeconds,
    });
  }

  /**
   * Process a raw Stripe webhook request.
   *
   * @param params.rawBody          Raw request body (Buffer or string).
   * @param params.signatureHeader  Value of the `Stripe-Signature` header.
   * @param params.tenantId         Tenant owning this webhook endpoint.
   * @param params.handlers         Map of event type → handler function.
   */
  async handle(params: {
    rawBody: string | Buffer;
    signatureHeader: string;
    tenantId: string;
    handlers: StripeHandlerMap;
  }): Promise<WebhookHandleResult> {
    const { rawBody, signatureHeader, tenantId, handlers } = params;

    // 1. Verify signature
    verifyStripeSignature({
      rawBody,
      signatureHeader,
      signingSecret: this.options.signingSecret,
      toleranceSeconds: this.options.toleranceSeconds,
    });

    // 2. Parse event (signature already verified)
    const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const event = JSON.parse(body) as StripeEvent;

    // 3. Idempotency check
    const check = await this.idempotency.check({
      source: 'stripe',
      tenantId,
      eventId: event.id,
    });

    if (check.duplicate) {
      return { success: true, eventId: event.id, eventType: event.type, duplicate: true, message: 'Already processed' };
    }

    // 4. Dispatch to handler
    const handler = handlers[event.type];
    let statusCode = 200;
    let success = true;
    let message: string | undefined;

    if (handler) {
      try {
        await handler(event, tenantId);
      } catch (err) {
        success = false;
        statusCode = 500;
        message = err instanceof Error ? err.message : 'Handler error';
      }
    }

    // 5. Record idempotency (even if handler failed, to prevent infinite retries on bad data)
    await this.idempotency.record({
      source: 'stripe',
      tenantId,
      eventId: event.id,
      statusCode,
      status: success ? 'processed' : 'failed',
    });

    return { success, eventId: event.id, eventType: event.type, duplicate: false, message };
  }
}

/** Factory helper. */
export function createStripeWebhookHandler(
  options: StripeWebhookHandlerOptions,
): StripeWebhookHandler {
  return new StripeWebhookHandler(options);
}
