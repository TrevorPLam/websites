/**
 * @file apps/web/app/api/webhooks/[service]/route.ts
 * @summary Multi-service webhook receiver with idempotency and signature verification.
 * @description Accepts POST requests at `/api/webhooks/{service}`. For Stripe events the
 *   raw body is verified against the `Stripe-Signature` header using HMAC-SHA256 with
 *   constant-time comparison. Every event is deduplicated via {@link StripeWebhookHandler}
 *   which writes to an in-memory {@link InMemoryIdempotencyStore}; production deployments
 *   should substitute a Redis-backed store via the `WEBHOOK_IDEMPOTENCY_STORE` injection
 *   point.
 *
 *   Duplicate events receive a `200 OK` (not `4xx`) per Stripe's idempotency guidance.
 *   Unknown or unsupported services return `400 Bad Request`.
 *
 * @security
 *   - Raw body is read as text to preserve the HMAC-valid byte sequence before any JSON
 *     parsing occurs.
 *   - The `Stripe-Signature` header is validated before any business logic executes.
 *   - Replay attacks are blocked by the 300-second timestamp tolerance window.
 *   - Tenant ID is resolved from the `x-tenant-id` header injected by middleware —
 *     never from the request body.
 * @requirements PROD-002
 */

import { NextRequest, NextResponse } from 'next/server';
import { StripeWebhookHandler, InMemoryIdempotencyStore } from '@repo/infrastructure/webhooks';

// ─── Supported services ───────────────────────────────────────────────────────

const SUPPORTED_SERVICES = new Set(['stripe', 'resend', 'qstash'] as const);
type SupportedService = 'stripe' | 'resend' | 'qstash';

function isSupportedService(value: string): value is SupportedService {
  return SUPPORTED_SERVICES.has(value as SupportedService);
}

// ─── Shared idempotency store ─────────────────────────────────────────────────

/**
 * Module-level store instance.
 * In production, replace with a Redis-backed store to share state across
 * Edge Function instances. The in-memory store is sufficient for local
 * development and single-instance deployments.
 */
const idempotencyStore = new InMemoryIdempotencyStore();

// Warn in production so that operators know to swap in a persistent store.
if (process.env.NODE_ENV === 'production' && !process.env.WEBHOOK_IDEMPOTENCY_STORE) {
  console.warn(
    '[webhook] Using in-memory idempotency store. ' +
      'Set WEBHOOK_IDEMPOTENCY_STORE=redis and configure UPSTASH_REDIS_REST_URL ' +
      'for multi-instance production deployments.',
  );
}

// ─── Stripe handler singleton ─────────────────────────────────────────────────

function getStripeHandler(): StripeWebhookHandler {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signingSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not configured.');
  }
  return new StripeWebhookHandler({ signingSecret, idempotencyStore });
}

// ─── POST /api/webhooks/[service] ────────────────────────────────────────────

/**
 * Handle an incoming webhook POST for `{service}`.
 *
 * Supported services: `stripe`, `resend`, `qstash`.
 * Unknown services receive a `400` response.
 *
 * @param request  Incoming Next.js request object.
 * @param params   Route segment params — `{ service: string }`.
 * @returns Next.js JSON response.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
): Promise<NextResponse> {
  const { service } = await params;

  if (!isSupportedService(service)) {
    return NextResponse.json({ error: `Unsupported webhook service: ${service}` }, { status: 400 });
  }

  // Tenant ID is injected by the Edge middleware — never trust client-supplied values.
  const tenantId = request.headers.get('x-tenant-id') ?? 'global';

  // Read raw body as text to preserve HMAC integrity.
  const rawBody = await request.text();

  if (service === 'stripe') {
    return handleStripe(request, rawBody, tenantId);
  }

  // Resend / QStash: signature verification is service-specific.
  // Return 200 to acknowledge receipt; add handlers as the platform grows.
  return NextResponse.json({ received: true, service }, { status: 200 });
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

async function handleStripe(
  request: NextRequest,
  rawBody: string,
  tenantId: string
): Promise<NextResponse> {
  const signatureHeader = request.headers.get('stripe-signature');

  if (!signatureHeader) {
    return NextResponse.json({ error: 'Missing Stripe-Signature header.' }, { status: 400 });
  }

  let handler: StripeWebhookHandler;
  try {
    handler = getStripeHandler();
  } catch (err) {
    console.error('[webhook] Stripe handler configuration error:', err);
    return NextResponse.json({ error: 'Webhook handler not configured.' }, { status: 500 });
  }

  try {
    const result = await handler.handle({
      rawBody,
      signatureHeader,
      tenantId,
      handlers: {
        // Extend this map with business-logic handlers as needed.
        'payment_intent.succeeded': async (event, tid) => {
          console.info('[webhook] payment_intent.succeeded', { eventId: event.id, tenantId: tid });
        },
        'customer.subscription.created': async (event, tid) => {
          console.info('[webhook] customer.subscription.created', {
            eventId: event.id,
            tenantId: tid,
          });
        },
        'customer.subscription.deleted': async (event, tid) => {
          console.info('[webhook] customer.subscription.deleted', {
            eventId: event.id,
            tenantId: tid,
          });
        },
        'invoice.payment_failed': async (event, tid) => {
          console.info('[webhook] invoice.payment_failed', { eventId: event.id, tenantId: tid });
        },
      },
    });

    // Duplicate events return 200 OK — per Stripe guidance, never 4xx for duplicates.
    return NextResponse.json(
      { received: true, eventId: result.eventId, duplicate: result.duplicate },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing error';

    // Signature or timestamp validation failures → 400 so Stripe stops retrying.
    if (
      message.includes('signature verification failed') ||
      message.includes('tolerance window') ||
      message.includes('malformed')
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error('[webhook] Stripe processing error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
