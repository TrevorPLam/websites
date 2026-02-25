# Payments Integration Guide

> **Production-Ready Payment Processing & Billing — February 2026**

## Overview

Comprehensive payment processing guide covering Stripe integration, checkout sessions, customer portal, webhook handling, and multi-tenant billing management. Focus on secure patterns and production-ready implementations with 2026 compliance standards.

## Key Features

- **Stripe Integration**: Complete payment processing with Payment Intents API
- **Checkout Sessions**: Hosted payment pages with customization
- **Customer Portal**: Self-service subscription management
- **Webhook Handling**: Secure event processing with validation
- **Multi-Tenant Billing**: Per-tenant payment configurations
- **Security**: PCI compliance and fraud prevention

---

## 💳 Stripe Integration

### Core Stripe Configuration

```typescript
// lib/stripe/config.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
      maxNetworkRetries: 3,
      timeout: 30000,
      typescript: true,
    });
  }

  // Health check for Stripe connectivity
  async healthCheck(): Promise<boolean> {
    try {
      await this.stripe.accounts.retrieve();
      return true;
    } catch (error) {
      console.error('Stripe health check failed:', error);
      return false;
    }
  }
}
```

### Payment Intents Implementation

```typescript
// lib/stripe/payment-intents.ts
export class PaymentIntentService extends StripeService {
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency || 'usd',
        customer: params.customerId,
        metadata: {
          tenantId: params.tenantId,
          invoiceId: params.invoiceId || '',
          userId: params.userId || '',
        },
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic',
          },
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmationResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Process successful payment
        await this.processSuccessfulPayment(paymentIntent);
        
        return {
          success: true,
          status: 'succeeded',
          paymentIntentId: paymentIntent.id,
        };
      } else if (paymentIntent.status === 'requires_payment_method') {
        return {
          success: false,
          status: 'requires_payment_method',
          error: 'Payment method required',
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        error: `Payment status: ${paymentIntent.status}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async processSuccessfulPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const tenantId = paymentIntent.metadata.tenantId;
    const invoiceId = paymentIntent.metadata.invoiceId;

    // Update invoice status
    if (invoiceId) {
      await db.invoices.update({
        where: { id: invoiceId },
        data: {
          status: 'paid',
          paidAt: new Date(),
          stripePaymentIntentId: paymentIntent.id,
        },
      });
    }

    // Update tenant subscription if applicable
    if (tenantId) {
      await this.updateTenantSubscription(tenantId, paymentIntent);
    }

    // Send payment confirmation email
    await this.sendPaymentConfirmation(paymentIntent);
  }

  private async updateTenantSubscription(tenantId: string, paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update tenant subscription status
    await db.tenantSubscriptions.update({
      where: { tenantId },
      data: {
        status: 'active',
        currentPeriodEnd: this.calculateNextBillingDate(paymentIntent.amount),
      },
    });
  }

  private calculateNextBillingDate(amount: number): Date {
    // Calculate next billing date based on amount
    const now = new Date();
    if (amount >= 99900) { // $999+ - yearly
      return new Date(now.setFullYear(now.getFullYear() + 1));
    } else if (amount >= 9900) { // $99+ - yearly
      return new Date(now.setFullYear(now.getFullYear() + 1));
    } else { // Monthly
      return new Date(now.setMonth(now.getMonth() + 1));
    }
  }

  private async sendPaymentConfirmation(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Send payment confirmation email
    const tenantId = paymentIntent.metadata.tenantId;
    const tenant = await db.tenants.findUnique({ where: { id: tenantId } });

    if (tenant) {
      await emailService.sendEmail({
        to: tenant.billingEmail,
        subject: 'Payment Confirmation',
        templateId: 'payment-confirmation',
        templateData: {
          amount: paymentIntent.amount / 100,
          paymentIntentId: paymentIntent.id,
          tenantName: tenant.name,
        },
        tenantId,
      });
    }
  }
}
```

---

## 🛒 Checkout Sessions

### Hosted Checkout Implementation

```typescript
// lib/stripe/checkout.ts
export class CheckoutService extends StripeService {
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
    try {
      const tenantConfig = await this.getTenantConfig(params.tenantId);
      
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer_email: params.customerEmail,
        billing_address_collection: 'required',
        mode: params.mode || 'payment',
        success_url: params.successUrl || `${this.getBaseUrl()}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl || `${this.getBaseUrl()}/billing/cancel`,
        metadata: {
          tenantId: params.tenantId,
          userId: params.userId || '',
        },
        customer_creation: params.createCustomer ? 'always' : 'if_required',
      };

      // Add line items
      if (params.lineItems) {
        sessionParams.line_items = params.lineItems;
      }

      // Add subscription configuration
      if (params.mode === 'subscription') {
        sessionParams.subscription_data = {
          metadata: {
            tenantId: params.tenantId,
          },
        };
      }

      // Apply tenant branding
      if (tenantConfig.branding) {
        sessionParams.customer = {
          email: params.customerEmail,
          name: tenantConfig.branding.companyName,
          address: {
            line1: tenantConfig.branding.address?.line1 || '',
            city: tenantConfig.branding.address?.city || '',
            state: tenantConfig.branding.address?.state || '',
            postal_code: tenantConfig.branding.address?.postalCode || '',
            country: tenantConfig.branding.address?.country || 'US',
          },
        };
      }

      const session = await this.stripe.checkout.sessions.create(sessionParams);

      return {
        success: true,
        sessionId: session.id,
        url: session.url!,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<CheckoutSessionResult> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'subscription', 'line_items'],
      });

      return {
        success: true,
        session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async getTenantConfig(tenantId: string): Promise<TenantConfig> {
    const config = await db.tenantConfigs.findUnique({
      where: { tenantId },
      include: { branding: true, billing: true },
    });

    if (!config) {
      throw new Error(`Tenant configuration not found: ${tenantId}`);
    }

    return config;
  }

  private getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
}
```

### Checkout Page Components

```typescript
// components/billing/CheckoutButton.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutButtonProps {
  tenantId: string;
  planId: string;
  priceId: string;
  className?: string;
}

export function CheckoutButton({ 
  tenantId, 
  planId, 
  priceId, 
  className = '' 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          planId,
          priceId,
        }),
      });

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`
        bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? 'Loading...' : 'Subscribe Now'}
    </button>
  );
}
```

---

## 👤 Customer Portal

### Self-Service Portal Implementation

```typescript
// lib/stripe/customer-portal.ts
export class CustomerPortalService extends StripeService {
  async createPortalSession(params: CreatePortalSessionParams): Promise<PortalSessionResult> {
    try {
      const tenantConfig = await this.getTenantConfig(params.tenantId);
      
      // Get or create Stripe customer
      const customerId = await this.getOrCreateCustomer(params.tenantId, params.customerEmail);

      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: params.returnUrl || `${this.getBaseUrl()}/billing`,
        configuration: params.configurationId || undefined,
      });

      return {
        success: true,
        url: session.url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createPortalConfiguration(tenantId: string): Promise<PortalConfigResult> {
    try {
      const tenantConfig = await this.getTenantConfig(tenantId);

      const configuration = await this.stripe.billingPortal.configurations.create({
        business_profile: {
          headline: `${tenantConfig.branding?.companyName} Billing Portal`,
          privacy_policy_url: `${this.getBaseUrl()}/privacy`,
          terms_of_service_url: `${this.getBaseUrl()}/terms`,
        },
        features: {
          customer_update: {
            enabled: true,
            allowed_updates: ['address', 'phone', 'tax_id'],
          },
          invoice_history: { enabled: true },
          payment_method_update: { enabled: true },
          subscription_cancel: {
            enabled: true,
            mode: 'at_period_end',
            proration_behavior: 'none',
          },
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['quantity', 'price'],
            proration_behavior: 'create_prorations',
          },
        },
      });

      // Save configuration ID to tenant config
      await db.tenantConfigs.update({
        where: { tenantId },
        data: {
          stripePortalConfigId: configuration.id,
        },
      });

      return {
        success: true,
        configurationId: configuration.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async getOrCreateCustomer(tenantId: string, email: string): Promise<string> {
    // Check if customer already exists
    const tenant = await db.tenants.findUnique({
      where: { id: tenantId },
      include: { billing: true },
    });

    if (tenant?.billing?.stripeCustomerId) {
      return tenant.billing.stripeCustomerId;
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        tenantId,
      },
    });

    // Save customer ID
    await db.tenantBilling.upsert({
      where: { tenantId },
      create: {
        tenantId,
        stripeCustomerId: customer.id,
      },
      update: {
        stripeCustomerId: customer.id,
      },
    });

    return customer.id;
  }
}
```

### Portal Access Component

```typescript
// components/billing/CustomerPortalButton.tsx
'use client';

import { useState } from 'react';

interface CustomerPortalButtonProps {
  tenantId: string;
  className?: string;
}

export function CustomerPortalButton({ tenantId, className = '' }: CustomerPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePortalAccess = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Portal access error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortalAccess}
      disabled={isLoading}
      className={`
        bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? 'Loading...' : 'Manage Billing'}
    </button>
  );
}
```

---

## 🔗 Webhook Handling

### Secure Webhook Processing

```typescript
// app/api/billing/webhooks/route.ts
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import { WebhookService } from '@/lib/stripe/webhooks';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookService = new WebhookService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process webhook event
    await webhookService.processEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

### Webhook Event Processing

```typescript
// lib/stripe/webhooks.ts
export class WebhookService {
  async processEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const tenantId = session.metadata?.tenantId;
    
    if (!tenantId) {
      console.error('No tenant ID in checkout session metadata');
      return;
    }

    // Update tenant subscription status
    if (session.mode === 'subscription' && session.subscription) {
      await db.tenantSubscriptions.update({
        where: { tenantId },
        data: {
          status: 'active',
          stripeSubscriptionId: session.subscription as string,
          currentPeriodEnd: new Date((session.subscription as Stripe.Subscription).current_period_end * 1000),
        },
      });
    }

    // Send welcome email
    await this.sendSubscriptionConfirmation(tenantId, session);
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscription = invoice.subscription;
    
    if (typeof subscription === 'string') {
      const sub = await stripe.subscriptions.retrieve(subscription);
      const tenantId = sub.metadata?.tenantId;
      
      if (tenantId) {
        // Update subscription period
        await db.tenantSubscriptions.update({
          where: { tenantId },
          data: {
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            status: 'active',
          },
        });

        // Send payment receipt
        await this.sendPaymentReceipt(tenantId, invoice);
      }
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscription = invoice.subscription;
    
    if (typeof subscription === 'string') {
      const sub = await stripe.subscriptions.retrieve(subscription);
      const tenantId = sub.metadata?.tenantId;
      
      if (tenantId) {
        // Update subscription status
        await db.tenantSubscriptions.update({
          where: { tenantId },
          data: {
            status: 'past_due',
          },
        });

        // Send payment failure notification
        await this.sendPaymentFailureNotification(tenantId, invoice);
      }
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    
    if (tenantId) {
      // Update tenant subscription status
      await db.tenantSubscriptions.update({
        where: { tenantId },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
          stripeSubscriptionId: null,
        },
      });

      // Send cancellation confirmation
      await this.sendCancellationConfirmation(tenantId, subscription);
    }
  }

  private async sendSubscriptionConfirmation(tenantId: string, session: Stripe.Checkout.Session): Promise<void> {
    const tenant = await db.tenants.findUnique({ where: { id: tenantId } });
    
    if (tenant) {
      await emailService.sendEmail({
        to: tenant.billingEmail,
        subject: 'Subscription Confirmed',
        templateId: 'subscription-confirmation',
        templateData: {
          tenantName: tenant.name,
          planName: 'Premium Plan', // Get from session metadata
        },
        tenantId,
      });
    }
  }

  private async sendPaymentReceipt(tenantId: string, invoice: Stripe.Invoice): Promise<void> {
    const tenant = await db.tenants.findUnique({ where: { id: tenantId } });
    
    if (tenant) {
      await emailService.sendEmail({
        to: tenant.billingEmail,
        subject: 'Payment Receipt',
        templateId: 'payment-receipt',
        templateData: {
          amount: invoice.amount_paid / 100,
          invoiceNumber: invoice.number,
          date: new Date(invoice.created * 1000).toLocaleDateString(),
        },
        tenantId,
      });
    }
  }

  private async sendPaymentFailureNotification(tenantId: string, invoice: Stripe.Invoice): Promise<void> {
    const tenant = await db.tenants.findUnique({ where: { id: tenantId } });
    
    if (tenant) {
      await emailService.sendEmail({
        to: tenant.billingEmail,
        subject: 'Payment Failed',
        templateId: 'payment-failed',
        templateData: {
          amount: invoice.amount_due / 100,
          attemptCount: invoice.attempt_count,
        },
        tenantId,
      });
    }
  }

  private async sendCancellationConfirmation(tenantId: string, subscription: Stripe.Subscription): Promise<void> {
    const tenant = await db.tenants.findUnique({ where: { id: tenantId } });
    
    if (tenant) {
      await emailService.sendEmail({
        to: tenant.billingEmail,
        subject: 'Subscription Canceled',
        templateId: 'subscription-canceled',
        templateData: {
          tenantName: tenant.name,
          endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
        },
        tenantId,
      });
    }
  }
}
```

---

## 📊 Billing Analytics

### Revenue Tracking

```typescript
// lib/billing/analytics.ts
export class BillingAnalytics {
  async getRevenueMetrics(tenantId?: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RevenueMetrics> {
    const startDate = this.getStartDate(period);
    
    const whereClause = tenantId 
      ? { tenantId, createdAt: { gte: startDate } }
      : { createdAt: { gte: startDate } };

    const [totalRevenue, activeSubscriptions, churnRate, mrr] = await Promise.all([
      this.getTotalRevenue(whereClause),
      this.getActiveSubscriptions(whereClause),
      this.getChurnRate(whereClause),
      this.getMonthlyRecurringRevenue(whereClause),
    ]);

    return {
      totalRevenue,
      activeSubscriptions,
      churnRate,
      monthlyRecurringRevenue: mrr,
    };
  }

  private async getTotalRevenue(whereClause: any): Promise<number> {
    const result = await db.payments.aggregate({
      where: whereClause,
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  private async getActiveSubscriptions(whereClause: any): Promise<number> {
    return await db.tenantSubscriptions.count({
      where: {
        ...whereClause,
        status: 'active',
      },
    });
  }

  private async getChurnRate(whereClause: any): Promise<number> {
    const total = await db.tenantSubscriptions.count({
      where: whereClause,
    });

    const canceled = await db.tenantSubscriptions.count({
      where: {
        ...whereClause,
        status: 'canceled',
      },
    });

    return total > 0 ? (canceled / total) * 100 : 0;
  }

  private async getMonthlyRecurringRevenue(whereClause: any): Promise<number> {
    const subscriptions = await db.tenantSubscriptions.findMany({
      where: {
        ...whereClause,
        status: 'active',
      },
      include: { plan: true },
    });

    return subscriptions.reduce((total, sub) => total + (sub.plan?.price || 0), 0);
  }

  private getStartDate(period: 'day' | 'week' | 'month' | 'year'): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
  }
}
```

---

## 📋 Implementation Checklist

### Setup Configuration

- [ ] **Stripe Account**: Create Stripe account and verify business
- [ ] **API Keys**: Configure test and live API keys
- [ ] **Webhook Endpoints**: Set up webhook handlers and secrets
- [ ] **Products & Prices**: Create products and pricing tiers
- [ ] **Customer Portal**: Configure portal settings and branding

### Security & Compliance

- [ ] **PCI Compliance**: Ensure PCI DSS compliance
- [ ] **Webhook Security**: Verify webhook signatures
- [ ] **Data Protection**: Implement GDPR/CCPA compliance
- [ ] **Fraud Detection**: Set up Stripe Radar
- [ ] **Audit Logging**: Log all payment events

### Testing & Deployment

- [ ] **Test Mode**: Test all flows in Stripe test mode
- [ ] **Webhook Testing**: Test webhook event processing
- [ ] **Error Handling**: Handle payment failures gracefully
- [ ] **Monitoring**: Set up payment success/failure monitoring
- [ ] **Documentation**: Document billing processes for customers

---

## 🔗 References & Resources

### Documentation

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

### Best Practices

- **Security**: Never expose secret keys on client side
- **Error Handling**: Implement comprehensive error handling
- **Testing**: Test all payment flows thoroughly
- **Monitoring**: Monitor payment success rates and failures

### Compliance Standards

- **PCI DSS**: Payment card industry compliance
- **GDPR/CCPA**: Data protection compliance
- **SOX**: Financial reporting compliance for public companies

---

This consolidated guide provides production-ready payment processing patterns while eliminating redundant documentation and focusing on secure multi-tenant billing implementations.
