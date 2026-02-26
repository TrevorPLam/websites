---
title: Payment Processing Guide
description: Complete Stripe payment processing implementation for multi-tenant SaaS applications
last_updated: 2026-02-26
tags: [#payments #stripe #billing #subscriptions #webhooks]
estimated_read_time: 45 minutes
difficulty: intermediate
---

# Payment Processing Guide

## Overview

Comprehensive payment processing implementation using Stripe for multi-tenant SaaS applications. This guide covers payment intents, checkout sessions, customer portal, webhook handling, and subscription management with 2026 security standards and best practices.

## Key Features

- **Stripe Payment Intents**: Modern payment processing with automatic payment methods
- **Checkout Sessions**: Hosted payment pages with customizable flows
- **Customer Portal**: Self-service subscription management
- **Webhook Handling**: Secure event processing with idempotency
- **Subscription Management**: Complete billing lifecycle automation
- **Multi-Tenant Ready**: Built for SaaS applications with proper isolation
- **2026 Security Standards**: OAuth 2.1 compliance and PCI DSS adherence

---

## 💳 Stripe Payment Intents

### Core Implementation

Payment Intents is Stripe's modern payment processing API that supports dynamic payment methods and enhanced security:

```typescript
// packages/billing/src/payment-intents.ts
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28',
});

// Payment intent creation schema
const CreatePaymentIntentSchema = z.object({
  amount: z.number().min(100), // Minimum $1.00
  currency: z.string().default('usd'),
  customerId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  tenantId: z.string().uuid(),
});

export async function createPaymentIntent(input: z.infer<typeof CreatePaymentIntentSchema>) {
  const validated = CreatePaymentIntentSchema.parse(input);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: validated.amount,
    currency: validated.currency,
    customer: validated.customerId,
    payment_method_types: ['card', 'link', 'apple_pay', 'google_pay'],
    
    // Automatic payment methods for optimal conversion
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never', // Keep user on your site
    },
    
    // Multi-tenant metadata
    metadata: {
      ...validated.metadata,
      tenant_id: validated.tenantId,
      created_at: new Date().toISOString(),
    },
    
    // Confirmation method for client-side confirmation
    confirmation_method: 'manual',
    confirm: false, // Let client confirm
  });
  
  return paymentIntent;
}
```

### Payment Method Handling

```typescript
// packages/billing/src/payment-methods.ts
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string,
  tenantId: string
) {
  // Verify tenant ownership of customer
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.metadata?.tenant_id !== tenantId) {
    throw new Error('Customer does not belong to tenant');
  }
  
  return await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
}

export async function createCustomerPaymentMethod(
  customerId: string,
  paymentMethodData: any,
  tenantId: string
) {
  const paymentMethod = await stripe.paymentMethods.create({
    ...paymentMethodData,
    metadata: {
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
    },
  });
  
  return await attachPaymentMethod(paymentMethod.id, customerId, tenantId);
}
```

---

## 🛒 Stripe Checkout Sessions

### Session Creation

```typescript
// packages/billing/src/checkout-sessions.ts
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const CreateCheckoutSessionSchema = z.object({
  priceId: z.string(),
  customerId: z.string().optional(),
  tenantId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  metadata: z.record(z.string()).optional(),
});

export async function createCheckoutSession(input: z.infer<typeof CreateCheckoutSessionSchema>) {
  const validated = CreateCheckoutSessionSchema.parse(input);
  const headersList = headers();
  const origin = headersList.get('origin');
  
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: validated.customerId,
    payment_method_types: ['card', 'link'],
    mode: 'payment', // or 'subscription'
    line_items: [
      {
        price: validated.priceId,
        quantity: 1,
      },
    ],
    
    // Multi-tenant configuration
    client_reference_id: validated.tenantId,
    metadata: {
      ...validated.metadata,
      tenant_id: validated.tenantId,
    },
    
    // URLs
    success_url: validated.successUrl,
    cancel_url: validated.cancelUrl,
    
    // Checkout customization
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_creation: validated.customerId ? 'skip' : 'always',
    
    // UI customization
    locale: 'auto',
    currency: 'usd',
  });
  
  return checkoutSession;
}
```

### Next.js API Route

```typescript
// apps/portal/src/app/api/billing/checkout/route.ts
import { createCheckoutSession } from '@repo/billing/checkout-sessions';
import { getCurrentTenant } from '@repo/auth/tenant-context';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenant = await getCurrentTenant();
    
    const session = await createCheckoutSession({
      ...body,
      tenantId: tenant.id,
      successUrl: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.APP_URL}/billing/canceled`,
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

---

## 👤 Customer Portal

### Portal Configuration

```typescript
// packages/billing/src/customer-portal.ts
export async function createCustomerPortalSession(
  customerId: string,
  tenantId: string,
  returnUrl: string
) {
  // Verify tenant ownership
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.metadata?.tenant_id !== tenantId) {
    throw new Error('Customer does not belong to tenant');
  }
  
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    
    // Portal configuration
    configuration: 'bpc_1xxxx', // Portal configuration ID from Stripe Dashboard
    
    // Features to enable
    features: {
      payment_method_update: {
        enabled: true,
        allow_redisplay: 'always',
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
        proration_behavior: 'create_prorations',
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price', 'promotion_code'],
        proration_behavior: 'create_prorations',
      },
      invoice_history: { enabled: true },
      customer_update: {
        enabled: true,
        allowed_updates: ['address', 'phone', 'metadata'],
      },
    },
  });
  
  return portalSession;
}
```

### Portal Access API

```typescript
// apps/portal/src/app/api/billing/portal/route.ts
export async function POST(request: NextRequest) {
  try {
    const { returnUrl } = await request.json();
    const tenant = await getCurrentTenant();
    
    if (!tenant.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      );
    }
    
    const portalSession = await createCustomerPortalSession(
      tenant.stripeCustomerId,
      tenant.id,
      returnUrl || `${process.env.APP_URL}/billing`
    );
    
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
```

---

## 🔗 Webhook Handler

### Critical: Raw Body Requirement

Next.js App Router does not buffer the raw body by default. Stripe signature verification requires the **raw bytes**:

```typescript
// apps/portal/src/app/api/webhooks/stripe/route.ts
export const runtime = 'nodejs'; // Must be Node.js — not Edge
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { handleStripeEvent } from '@repo/billing/webhook-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28',
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // ← Must use .text(), not .json()
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Signature verification failed' },
      { status: 400 }
    );
  }

  // Return 200 immediately — process async
  await handleStripeEvent(event);

  return NextResponse.json({ received: true }, { status: 200 });
}
```

### Event Handler with Idempotency

```typescript
// packages/billing/src/webhook-handler.ts
import type Stripe from 'stripe';
import { db } from '@repo/db';
import { qstash } from '@repo/jobs/client';

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // Idempotency check
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

  switch (event.type) {
    // ── Subscription lifecycle ────────────────────────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscriptionToDb(sub);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await cancelSubscriptionInDb(sub);
      break;
    }

    // ── Payment events ────────────────────────────────────────────────
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(paymentIntent);
      break;
    }

    // ── Invoice events ──────────────────────────────────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoiceSuccess(invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoiceFailure(invoice);
      break;
    }

    // ── Checkout completion ────────────────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompletion(session);
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }
}

async function syncSubscriptionToDb(sub: Stripe.Subscription) {
  const planMap: Record<string, 'starter' | 'pro' | 'enterprise'> = {
    'price_starter_monthly': 'starter',
    'price_pro_monthly': 'pro',
    'price_enterprise_monthly': 'enterprise',
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

## 💰 Subscription Management

### Price and Product Management

```typescript
// packages/billing/src/products.ts
export async function createProduct(data: {
  name: string;
  description: string;
  features: string[];
}) {
  return await stripe.products.create({
    name: data.name,
    description: data.description,
    type: 'service',
    metadata: {
      features: data.features.join(','),
      created_at: new Date().toISOString(),
    },
  });
}

export async function createPrice(data: {
  productId: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  trialPeriodDays?: number;
}) {
  return await stripe.prices.create({
    product: data.productId,
    unit_amount: data.amount,
    currency: data.currency,
    recurring: {
      interval: data.interval,
      trial_period_days: data.trialPeriodDays,
    },
    metadata: {
      created_at: new Date().toISOString(),
    },
  });
}
```

### Subscription Creation

```typescript
// packages/billing/src/subscriptions.ts
export async function createSubscription(data: {
  customerId: string;
  priceId: string;
  tenantId: string;
  trialPeriodDays?: number;
}) {
  return await stripe.subscriptions.create({
    customer: data.customerId,
    items: [{ price: data.priceId }],
    trial_period_days: data.trialPeriodDays,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      tenant_id: data.tenantId,
      created_at: new Date().toISOString(),
    },
  });
}
```

---

## 🔒 Security Best Practices

### API Key Management

```typescript
// packages/billing/src/config.ts
interface StripeConfig {
  apiKey: string;
  webhookSecret: string;
  publishableKey: string;
  environment: 'development' | 'production';
}

const getStripeConfig = (): StripeConfig => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  
  return {
    apiKey: env === 'production' 
      ? process.env.STRIPE_LIVE_KEY! 
      : process.env.STRIPE_TEST_KEY!,
    webhookSecret: env === 'production'
      ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
      : process.env.STRIPE_TEST_WEBHOOK_SECRET!,
    publishableKey: env === 'production'
      ? process.env.STRIPE_LIVE_PUBLISHABLE_KEY!
      : process.env.STRIPE_TEST_PUBLISHABLE_KEY!,
    environment: env,
  };
};

export const stripeConfig = getStripeConfig();
```

### PCI Compliance with Stripe Elements

```typescript
// packages/ui/src/payment/StripeElements.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripePaymentForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/billing/success`,
      },
    });

    if (error) {
      console.error('Payment failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}
```

---

## 📊 Error Handling & Monitoring

### Error Types and Recovery

```typescript
// packages/billing/src/errors.ts
export class StripePaymentError extends Error {
  constructor(
    message: string,
    public type: 'card_error' | 'validation_error' | 'api_error',
    public code?: string
  ) {
    super(message);
    this.name = 'StripePaymentError';
  }
}

export function handleStripeError(error: any): StripePaymentError {
  if (error.type === 'StripeCardError') {
    return new StripePaymentError(
      'Your card was declined. Please try a different card.',
      'card_error',
      error.code
    );
  }
  
  if (error.type === 'StripeRateLimitError') {
    return new StripePaymentError(
      'Too many requests. Please try again in a moment.',
      'api_error',
      'rate_limit'
    );
  }
  
  if (error.type === 'StripeInvalidRequestError') {
    return new StripePaymentError(
      'Invalid payment information. Please check your details.',
      'validation_error'
    );
  }
  
  return new StripePaymentError(
    'Payment processing failed. Please try again.',
    'api_error'
  );
}
```

### Payment Analytics

```typescript
// packages/billing/src/analytics.ts
export interface PaymentMetrics {
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  conversionRate: number;
  paymentMethodBreakdown: Record<string, number>;
}

export class PaymentAnalytics {
  async generateMetrics(startDate: Date, endDate: Date): Promise<PaymentMetrics> {
    const paymentIntents = await stripe.paymentIntents.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000),
      },
      limit: 100,
    });

    const successful = paymentIntents.data.filter((pi) => pi.status === 'succeeded');
    const failed = paymentIntents.data.filter((pi) => pi.status === 'requires_payment_method');

    return {
      totalRevenue: successful.reduce((sum, pi) => sum + pi.amount, 0),
      successfulPayments: successful.length,
      failedPayments: failed.length,
      averageOrderValue:
        successful.length > 0
          ? successful.reduce((sum, pi) => sum + pi.amount, 0) / successful.length
          : 0,
      conversionRate:
        paymentIntents.data.length > 0 ? successful.length / paymentIntents.data.length : 0,
      paymentMethodBreakdown: this.calculatePaymentMethodBreakdown(successful),
    };
  }

  private calculatePaymentMethodBreakdown(payments: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    payments.forEach((payment) => {
      const method = payment.payment_method_types[0] || 'unknown';
      breakdown[method] = (breakdown[method] || 0) + 1;
    });

    return breakdown;
  }
}
```

---

## 🧪 Testing Strategies

### Test Cards and Mocking

```typescript
// packages/billing/src/test-utils.ts
export const testCards = {
  // Successful payments
  visa: '4242424242424242',
  mastercard: '5555555555554444',
  amex: '378282246310005',

  // Declined cards
  declineGeneric: '4000000000000002',
  declineInsufficientFunds: '4000000000009995',
  declineLostCard: '4000000000009987',

  // 3D Secure
  threeDSecure: '4000002760003184',
  threeDSecureRequired: '4000002500003155',
};

export function createMockStripeEvent(type: string, data: any): Stripe.Event {
  return {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2026-01-28',
    created: Math.floor(Date.now() / 1000),
    type,
    data: { object: data },
    livemode: false,
    pending_webhooks: 0,
    request: null,
  };
}
```

### Integration Tests

```typescript
// packages/billing/src/__tests__/payment-intents.test.ts
import { createPaymentIntent } from '../payment-intents';
import { stripe } from '../config';

describe('Payment Intents', () => {
  it('should create a payment intent with valid data', async () => {
    const result = await createPaymentIntent({
      amount: 2000,
      currency: 'usd',
      tenantId: '123e4567-e89b-12d3-a456-426614174000',
    });

    expect(result.id).toBeDefined();
    expect(result.amount).toBe(2000);
    expect(result.currency).toBe('usd');
    expect(result.metadata.tenant_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should reject invalid amounts', async () => {
    await expect(
      createPaymentIntent({
        amount: 50, // Below minimum
        currency: 'usd',
        tenantId: '123e4567-e89b-12d3-a456-426614174000',
      })
    ).rejects.toThrow();
  });
});
```

---

## 📈 Performance Optimization

### Caching Strategy

```typescript
// packages/billing/src/cache.ts
import { Redis } from '@upstash/redis';

export class StripeCache {
  private redis: Redis;
  private ttl: number = 300; // 5 minutes

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getCustomer(customerId: string): Promise<any> {
    const cacheKey = `stripe:customer:${customerId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached as string);
    }

    const customer = await stripe.customers.retrieve(customerId);
    await this.redis.setex(cacheKey, this.ttl, JSON.stringify(customer));

    return customer;
  }

  async invalidateCustomer(customerId: string): Promise<void> {
    const cacheKey = `stripe:customer:${customerId}`;
    await this.redis.del(cacheKey);
  }
}
```

### Batch Operations

```typescript
// packages/billing/src/batch.ts
export async function processBatchPayments(paymentIntents: string[]): Promise<void> {
  const batchSize = 10;

  for (let i = 0; i < paymentIntents.length; i += batchSize) {
    const batch = paymentIntents.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map((id) =>
        stripe.paymentIntents
          .retrieve(id)
          .catch((error) => console.error(`Failed to retrieve ${id}:`, error))
      )
    );

    // Rate limiting
    if (i + batchSize < paymentIntents.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
```

---

## 📚 References

### Authoritative Sources
- [Stripe API Documentation](https://docs.stripe.com/api) — Official API reference
- [Stripe Payment Intents Guide](https://docs.stripe.com/payments/payment-intents) — Payment processing patterns
- [Stripe Checkout Documentation](https://docs.stripe.com/checkout) — Hosted payment pages
- [Stripe Customer Portal](https://docs.stripe.com/billing/subscriptions/customer-portal) — Self-service management
- [Stripe Webhooks Guide](https://docs.stripe.com/webhooks) — Event handling
- [Stripe Security Best Practices](https://docs.stripe.com/security) — PCI compliance

### Internal Documentation
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns
- [Multi-Tenant Architecture](../architecture/system-architecture-guide.md) — Tenant isolation
- [Security Patterns](../security/security-patterns-guide.md) — Security standards
- [Testing Strategies](../development/testing-guide.md) — Testing approaches

---

## 🚀 Implementation Checklist

### Setup Requirements
- [ ] Stripe account with API keys configured
- [ ] Webhook endpoints configured in Stripe Dashboard
- [ ] Customer portal configuration created
- [ ] Products and prices set up in Stripe Dashboard
- [ ] Environment variables configured for all environments

### Security Configuration
- [ ] API key rotation strategy implemented
- [ ] Webhook signature verification enabled
- [ ] PCI compliance with Stripe Elements
- [ ] Rate limiting on payment endpoints
- [ ] Audit logging for all payment operations

### Multi-Tenant Setup
- [ ] Tenant metadata tracking in Stripe objects
- [ ] Customer-tenant association validation
- [ ] Per-tenant payment analytics
- [ ] Tenant-specific billing configurations
- [ ] Cross-tenant access prevention

### Testing & Monitoring
- [ ] Unit tests for all payment operations
- [ ] Integration tests with Stripe test mode
- [ ] Webhook event testing utilities
- [ ] Payment analytics and monitoring
- [ ] Error tracking and alerting

### Production Deployment
- [ ] Environment-specific configurations
- [ ] Database migrations for billing tables
- [ ] Performance optimization and caching
- [ ] Backup and disaster recovery procedures
- [ ] Compliance documentation and audits

---

*This guide consolidates and replaces the following documentation files:*
- *stripe-documentation.md*
- *stripe-checkout-sessions.md*  
- *stripe-customer-portal.md*
- *stripe-webhook-handler.md*
