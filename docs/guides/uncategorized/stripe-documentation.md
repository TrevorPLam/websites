# stripe-documentation.md

> **2026 Standards Compliance** | Stripe API 2025-11-20 · Payment Intents v2 ·
> SCA/3DS2 · Idempotency · Webhook Best Practices · Radar Fraud Rules

## Table of Contents

1. [Overview](#overview)
2. [API Versioning & 2026 Changes](#api-versioning--2026-changes)
3. [Payment Intents — Complete Implementation](#payment-intents--complete-implementation)
4. [Stripe Elements (React)](#stripe-elements-react)
5. [Webhook Handling — Production Patterns](#webhook-handling--production-patterns)
6. [Idempotency Keys — Complete Guide](#idempotency-keys--complete-guide)
7. [Stripe Checkout Sessions](#stripe-checkout-sessions)
8. [Customer Portal](#customer-portal)
9. [Subscription Management](#subscription-management)
10. [Radar Fraud Prevention](#radar-fraud-prevention)
11. [SCA / 3D Secure 2](#sca--3d-secure-2)
12. [Testing Patterns](#testing-patterns)
13. [Security Checklist](#security-checklist)
14. [References](#references)

---

## Overview

Stripe is the payments backbone for subscription billing, one-time charges, and
customer portal management. In 2026, the core patterns center on:

- **Payment Intents API** for all charge flows (not Charges API)
- **Idempotency keys** on every write operation
- **Webhook-driven state machine** for subscription lifecycle
- **Radar** for ML-based fraud prevention
- **SAQ A compliance** via Stripe-hosted Elements (no card data touches your servers)

---

## API Versioning & 2026 Changes

Always pin the Stripe API version in your client initialization:

```typescript
// packages/billing/src/stripe-client.ts
import Stripe from 'stripe';

// Pin to the version your integration was tested against
// Stripe issues changelogs for each version at stripe.com/docs/upgrades
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-20', // Latest stable as of Feb 2026
  typescript: true,
  appInfo: {
    name: 'YourSaaS',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Automatic retry on network failures (3 retries with exponential backoff)
  maxNetworkRetries: 3,
});

export const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
```

---

## Payment Intents — Complete Implementation

The Payment Intents API is the **only** recommended way to accept payments in 2026.
The legacy Charges API does not support SCA/3DS2 and will be deprecated. [web:35]

### Server: Create PaymentIntent

```typescript
// apps/portal/src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@repo/billing/stripe-client';
import { verifyTenantSession } from '@repo/auth';
import { getTenantSubscription } from '@repo/db/subscriptions';

export async function POST(req: NextRequest) {
  const session = await verifyTenantSession();
  const { amount, currency = 'usd', priceId, metadata = {} } = await req.json();

  // Validate amount server-side — NEVER trust client-provided amounts for subscriptions
  if (!Number.isInteger(amount) || amount < 50 || amount > 99_999_99) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Generate idempotency key tied to the specific cart/session
  // Using session.cartId ensures the same cart won't create 2 PaymentIntents
  const idempotencyKey = `pi_${session.tenantId}_${session.cartId ?? Date.now()}`;

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount, // Amount in smallest currency unit (cents for USD)
      currency,
      customer: session.stripeCustomerId,
      automatic_payment_methods: {
        enabled: true, // Enables cards, Apple Pay, Google Pay, Link, etc.
        allow_redirects: 'never', // Keep user on your page (no bank redirects)
      },
      metadata: {
        tenant_id: session.tenantId,
        user_id: session.userId,
        price_id: priceId,
        ...metadata,
      },
      // SCA: capture method determines when the charge is captured
      capture_method: 'automatic',
      // Statement descriptor: what appears on customer's bank statement
      statement_descriptor_suffix: 'YOURSAAS',
    },
    {
      idempotencyKey,
    }
  );

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}
```

### Client: Stripe Elements

```typescript
// features/checkout/ui/CheckoutForm.tsx
'use client'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutWrapper({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#2563eb',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
        loader: 'auto',
      }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  )
}

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Form validation failed')
      setIsProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',  // Avoid redirect when not needed (e.g., card payments)
    })

    if (confirmError) {
      // Show user-friendly error message
      setError(
        confirmError.type === 'card_error' || confirmError.type === 'validation_error'
          ? (confirmError.message ?? 'Payment failed')
          : 'An unexpected error occurred. Please try again.',
      )
    }
    // If no error + no redirect: payment succeeded, handle success state here

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'accordion',   // Clean accordion layout for multiple methods
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'link'],
        }}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        aria-disabled={!stripe || isProcessing}
        aria-busy={isProcessing}
        className="w-full rounded-md bg-blue-600 py-3 text-white font-medium
                   hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  )
}
```

---

## Webhook Handling — Production Patterns

Webhooks are the **authoritative source of truth** for payment state. Never rely
solely on redirect URLs — they can be bypassed or lost on network failure. [web:38]

```typescript
// apps/portal/src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@repo/billing/stripe-client';
import { redis } from '@repo/cache';

// Disable body parsing — Stripe needs raw body for signature verification
export const dynamic = 'force-dynamic';

const WEBHOOK_HANDLERS: Partial<Record<Stripe.Event.Type, (event: Stripe.Event) => Promise<void>>> =
  {
    'payment_intent.succeeded': handlePaymentSucceeded,
    'payment_intent.payment_failed': handlePaymentFailed,
    'customer.subscription.created': handleSubscriptionCreated,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
    'invoice.payment_succeeded': handleInvoiceSucceeded,
    'invoice.payment_failed': handleInvoiceFailed,
    'customer.subscription.trial_will_end': handleTrialEnding,
  };

export async function POST(req: NextRequest) {
  const body = await req.text(); // Raw body for signature verification
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // IDEMPOTENCY: Track processed events to prevent duplicate processing
  const eventKey = `stripe:event:${event.id}`;
  const alreadyProcessed = await redis.get(eventKey);
  if (alreadyProcessed) {
    console.log(`Skipping duplicate webhook event: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Mark as processing before handling (prevents race condition)
  await redis.set(eventKey, '1', { ex: 86400 }); // 24h dedup window

  const handler = WEBHOOK_HANDLERS[event.type];
  if (handler) {
    try {
      await handler(event);
    } catch (err) {
      console.error(`Failed to handle webhook ${event.type}:`, err);
      // Delete the processed flag so Stripe retries
      await redis.del(eventKey);
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;
  const tenantId = intent.metadata.tenant_id;
  const orderId = intent.metadata.order_id;

  if (!tenantId) {
    console.warn('PaymentIntent missing tenant_id metadata', intent.id);
    return;
  }

  await Promise.all([
    updateOrderStatus(orderId, 'paid'),
    updateTenantBillingStatus(tenantId, 'active'),
    sendReceiptEmail(tenantId, intent),
  ]);
}
```

---

## Idempotency Keys — Complete Guide

Idempotency keys prevent duplicate charges when network timeouts cause retries. [web:35][web:36][web:37]

```typescript
// packages/billing/src/idempotency.ts

/**
 * Generate a stable idempotency key for Stripe API calls.
 *
 * Rules:
 * 1. Same key = same logical operation (safe to retry)
 * 2. Different key = different operation (creates new charge)
 * 3. Keys expire after 24 hours in Stripe
 * 4. Keys must be unique per operation type
 */
export function generateIdempotencyKey(operation: string, ...identifiers: string[]): string {
  // Stable, deterministic key from operation + identifiers
  // Do NOT include timestamps — that defeats idempotency
  return [operation, ...identifiers].join(':');
}

// Usage patterns:

// ✅ PaymentIntent creation: key = operation + cart ID (stable per cart)
const piKey = generateIdempotencyKey('create_pi', tenantId, cartId);
await stripe.paymentIntents.create(params, { idempotencyKey: piKey });

// ✅ Subscription creation: key = operation + tenant + price
const subKey = generateIdempotencyKey('create_sub', tenantId, priceId);
await stripe.subscriptions.create(params, { idempotencyKey: subKey });

// ✅ Refund: key = operation + payment intent ID (one refund per PI)
const refundKey = generateIdempotencyKey('refund', paymentIntentId);
await stripe.refunds.create({ payment_intent: paymentIntentId }, { idempotencyKey: refundKey });

// ❌ WRONG — timestamp in key defeats idempotency
const badKey = `create_pi_${tenantId}_${Date.now()}`; // Never do this
```

---

## Stripe Checkout Sessions

For simpler integrations (no custom UI needed), Stripe Checkout handles the full
payment flow with a hosted page:

```typescript
// Server Action: create checkout session
// apps/portal/src/app/billing/upgrade/actions.ts
'use server';
import { redirect } from 'next/navigation';
import { stripe } from '@repo/billing/stripe-client';

export async function createCheckoutSession(priceId: string) {
  const session = await verifyTenantSession();
  const tenant = await getTenant(session.tenantId);

  const checkoutSession = await stripe.checkout.sessions.create(
    {
      customer: tenant.stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/billing/upgrade`,
      subscription_data: {
        metadata: {
          tenant_id: session.tenantId,
          tenant_slug: tenant.slug,
        },
        trial_period_days: tenant.isEligibleForTrial ? 14 : 0,
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    },
    {
      idempotencyKey: generateIdempotencyKey('checkout', session.tenantId, priceId),
    }
  );

  redirect(checkoutSession.url!);
}
```

---

## Customer Portal

```typescript
// Server Action: create billing portal session
export async function createBillingPortalSession() {
  const session = await verifyTenantSession();
  const tenant = await getTenant(session.tenantId);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: `${process.env.APP_URL}/settings/billing`,
    // Optional: customize which features are visible
    // configuration: portalConfigId,
  });

  redirect(portalSession.url);
}
```

---

## Radar Fraud Prevention

```typescript
// Enable Radar rules in PaymentIntent
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency,
  metadata: {
    tenant_id: tenantId,
    // Radar uses metadata for rule matching
    plan: tenant.plan,
    account_age_days: String(daysSinceSignup),
    is_verified: String(tenant.isVerified),
  },
  radar_options: {
    // Associate with your user's session for velocity checks
    session: stripeRadarSessionId,
  },
});
```

---

## Testing Patterns

```typescript
// packages/billing/src/stripe.test.ts — use Stripe test mode
const TEST_CARDS = {
  success: '4242424242424242',
  decline: '4000000000000002',
  sca_required: '4000002500003155', // Triggers 3DS2
  insufficient: '4000000000009995',
};

describe('Stripe Integration', () => {
  it('creates PaymentIntent with idempotency', async () => {
    const key = generateIdempotencyKey('test_pi', 'tenant_001', 'cart_001');
    const pi1 = await stripe.paymentIntents.create(
      { amount: 2000, currency: 'usd' },
      { idempotencyKey: key }
    );
    const pi2 = await stripe.paymentIntents.create(
      { amount: 2000, currency: 'usd' },
      { idempotencyKey: key }
    );
    // Same key = same PaymentIntent returned
    expect(pi1.id).toBe(pi2.id);
  });
});
```

---

## Security Checklist

```
□ Never log or store raw card data — SAQ A requirement
□ Verify webhook signature on EVERY incoming webhook
□ Use idempotency keys on ALL write operations
□ Store Stripe secret key in environment variables only
□ Never expose secret key to client-side code
□ Pin API version in stripe client initialization
□ Set statement_descriptor to identify charges to customers
□ Enable Radar for ML-based fraud prevention
□ Restrict Stripe dashboard access to need-to-know
□ Use restricted keys for read-only webhook endpoints
□ Enable email notifications for failed payments
□ Test with Stripe test mode before live deployment
```

---

## References

- [Stripe Payment Intents API](https://docs.stripe.com/payments/payment-intents) [web:35]
- [Stripe Idempotent Requests](https://docs.stripe.com/api/idempotent_requests) [web:37]
- [Building Solid Stripe Integrations](https://stripe.dev/blog/building-solid-stripe-integrations-developers-guide-success) [web:38]
- [Stripe 2026 Developer Guide](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026) [web:36]
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks Best Practices](https://www.stigg.io/blog-posts/best-practices-i-wish-we-knew-when-integrating-stripe-webhooks)
