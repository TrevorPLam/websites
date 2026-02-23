# Stripe Webhook Handler

> **Reference Documentation — February 2026**

## Overview

Stripe webhooks notify your application of billing events (subscription created, invoice paid, payment failed). The handler must verify the Stripe signature before processing, use `stripe.webhooks.constructEvent()` with the raw request body, and return 200 immediately — long processing goes to a QStash queue. [digitalapplied](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026)

---

## Critical: Raw Body Requirement

Next.js App Router does not buffer the raw body by default. Stripe signature verification requires the **raw bytes** — not the parsed JSON. This is the most common source of webhook verification failures:

```typescript
// apps/*/src/app/api/webhooks/stripe/route.ts
export const runtime = 'nodejs'; // Must be Node.js — not Edge
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { handleStripeEvent } from '@repo/billing/webhook-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Use latest stable API version
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // ← Must use .text(), not .json()
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Return 200 immediately — process async via QStash
  await handleStripeEvent(event);

  return NextResponse.json({ received: true }, { status: 200 });
}
```

---

## Event Handler (packages/billing)

```typescript
// packages/billing/src/webhook-handler.ts
import type Stripe from 'stripe';
import { db } from '@repo/db';
import { qstash } from '@repo/jobs/client';

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    // ── Subscription lifecycle ────────────────────────────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscriptionToDb(sub);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .from('tenants')
        .update({ status: 'cancelled', plan: null })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }

    // ── Invoice events ────────────────────────────────────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      // Enqueue receipt email via QStash (async — don't block webhook response)
      await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/email/receipt`,
        body: {
          type: 'payment_receipt',
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
          periodEnd: invoice.period_end,
        },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await db
        .from('tenants')
        .update({ billing_status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string);
      // Email dunning sequence starts here
      await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/email/payment-failed`,
        body: { customerId: invoice.customer, attemptCount: invoice.attempt_count },
      });
      break;
    }

    // ── Checkout ─────────────────────────────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription') {
        await activateTenantSubscription(session);
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }
}

async function syncSubscriptionToDb(sub: Stripe.Subscription) {
  const planMap: Record<string, 'starter' | 'pro' | 'enterprise'> = {
    price_starter: 'starter',
    price_pro: 'pro',
    price_enterprise: 'enterprise',
  };

  const priceId = sub.items.data[0]?.price.id ?? '';
  const plan = planMap[priceId] ?? 'starter';
  const status = sub.status === 'active' ? 'active' : 'suspended';

  await db
    .from('tenants')
    .update({
      plan,
      status,
      billing_status: sub.status,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', sub.customer as string);
}
```

---

## Idempotency

Stripe retries webhooks for up to 72 hours if your endpoint returns non-200. Use the event `id` as an idempotency key to prevent duplicate processing: [digitalapplied](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026)

```typescript
// At the start of handleStripeEvent:
const { data: existing } = await db
  .from('processed_webhook_events')
  .select('id')
  .eq('event_id', event.id)
  .maybeSingle();

if (existing) {
  console.log(`[Stripe] Event ${event.id} already processed — skipping`);
  return;
}

await db.from('processed_webhook_events').insert({ event_id: event.id });
// Proceed with processing...
```

---

## References

- Stripe Webhook Documentation — https://stripe.com/docs/webhooks
- Stripe Webhooks with Next.js App Router — https://www.mtechzilla.com/blogs/integrate-stripe-checkout-with-nextjs
- Complete Stripe Integration Guide 2026 — https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026

---
