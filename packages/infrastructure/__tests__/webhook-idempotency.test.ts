import { describe, expect, it, beforeEach } from 'vitest';
import {
  WebhookIdempotency,
  InMemoryIdempotencyStore,
  createWebhookIdempotency,
} from '../webhooks/idempotency';
import {
  verifyStripeSignature,
  StripeWebhookHandler,
} from '../webhooks/stripe-handler';
import { createHmac } from 'node:crypto';

// ─── Idempotency tests ────────────────────────────────────────────────────────

describe('WebhookIdempotency', () => {
  let store: InMemoryIdempotencyStore;
  let idempotency: WebhookIdempotency;

  beforeEach(() => {
    store = new InMemoryIdempotencyStore();
    idempotency = createWebhookIdempotency({ store, ttlSeconds: 300 });
  });

  it('returns duplicate:false for new events', async () => {
    const result = await idempotency.check({ source: 'stripe', tenantId: 't1', eventId: 'evt_1' });
    expect(result.duplicate).toBe(false);
  });

  it('returns duplicate:true after recording', async () => {
    await idempotency.record({ source: 'stripe', tenantId: 't1', eventId: 'evt_1', statusCode: 200 });
    const result = await idempotency.check({ source: 'stripe', tenantId: 't1', eventId: 'evt_1' });
    expect(result.duplicate).toBe(true);
  });

  it('isolates keys by tenantId', async () => {
    await idempotency.record({ source: 'stripe', tenantId: 't1', eventId: 'evt_1', statusCode: 200 });
    const result = await idempotency.check({ source: 'stripe', tenantId: 't2', eventId: 'evt_1' });
    expect(result.duplicate).toBe(false);
  });

  it('buildKey is deterministic', () => {
    const k1 = idempotency.buildKey({ source: 'stripe', tenantId: 't1', eventId: 'evt_1' });
    const k2 = idempotency.buildKey({ source: 'stripe', tenantId: 't1', eventId: 'evt_1' });
    expect(k1).toBe(k2);
    expect(k1).toHaveLength(48);
  });
});

// ─── Stripe signature verification tests ─────────────────────────────────────

function buildStripeSignature(secret: string, body: string, timestamp: number): string {
  const signed = `${timestamp}.${body}`;
  const sig = createHmac('sha256', secret).update(signed).digest('hex');
  return `t=${timestamp},v1=${sig}`;
}

describe('verifyStripeSignature', () => {
  const SECRET = 'whsec_test_secret_key';
  const BODY = JSON.stringify({ id: 'evt_123', type: 'payment_intent.succeeded' });

  it('passes for a valid signature', () => {
    const ts = Math.floor(Date.now() / 1000);
    const header = buildStripeSignature(SECRET, BODY, ts);
    expect(() =>
      verifyStripeSignature({ rawBody: BODY, signatureHeader: header, signingSecret: SECRET, toleranceSeconds: 300 })
    ).not.toThrow();
  });

  it('throws for an invalid signature', () => {
    const ts = Math.floor(Date.now() / 1000);
    const header = buildStripeSignature('wrong-secret', BODY, ts);
    expect(() =>
      verifyStripeSignature({ rawBody: BODY, signatureHeader: header, signingSecret: SECRET, toleranceSeconds: 300 })
    ).toThrow('signature verification failed');
  });

  it('throws when timestamp is outside tolerance', () => {
    const ts = Math.floor(Date.now() / 1000) - 400;
    const header = buildStripeSignature(SECRET, BODY, ts);
    expect(() =>
      verifyStripeSignature({ rawBody: BODY, signatureHeader: header, signingSecret: SECRET, toleranceSeconds: 300 })
    ).toThrow('tolerance window');
  });

  it('throws for a malformed header', () => {
    expect(() =>
      verifyStripeSignature({ rawBody: BODY, signatureHeader: 'bad-header', signingSecret: SECRET, toleranceSeconds: 300 })
    ).toThrow('malformed');
  });
});

describe('StripeWebhookHandler', () => {
  const SECRET = 'whsec_test_handler_secret_key';
  const BODY_OBJ = { id: 'evt_456', type: 'payment_intent.succeeded', livemode: false, data: { object: {} }, created: 1234567890 };
  const BODY = JSON.stringify(BODY_OBJ);

  it('processes a new event', async () => {
    const store = new InMemoryIdempotencyStore();
    const handler = new StripeWebhookHandler({ signingSecret: SECRET, idempotencyStore: store });
    const ts = Math.floor(Date.now() / 1000);
    const header = buildStripeSignature(SECRET, BODY, ts);
    let called = false;
    const result = await handler.handle({
      rawBody: BODY,
      signatureHeader: header,
      tenantId: 't1',
      handlers: { 'payment_intent.succeeded': async () => { called = true; } },
    });
    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(called).toBe(true);
  });

  it('deduplicates a repeated event', async () => {
    const store = new InMemoryIdempotencyStore();
    const handler = new StripeWebhookHandler({ signingSecret: SECRET, idempotencyStore: store });
    let callCount = 0;
    const ts = Math.floor(Date.now() / 1000);
    const header = buildStripeSignature(SECRET, BODY, ts);
    const opts = { rawBody: BODY, signatureHeader: header, tenantId: 't1', handlers: { 'payment_intent.succeeded': async () => { callCount++; } } };
    await handler.handle(opts);
    const r2 = await handler.handle(opts);
    expect(r2.duplicate).toBe(true);
    expect(callCount).toBe(1);
  });
});
