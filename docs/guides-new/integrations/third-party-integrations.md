---
title: Third-Party Integrations Guide
description: Complete integration patterns for payment processing, email services, scheduling, and external APIs
last_updated: 2026-02-26
tags: [#integrations #api #payments #email #scheduling #webhooks]
estimated_read_time: 70 minutes
difficulty: advanced
---

# Third-Party Integrations Guide

## Overview

Comprehensive integration guide covering payment processing, email services, scheduling systems, and external API integrations for multi-tenant SaaS applications. This guide consolidates integration patterns, security best practices, and implementation strategies.

## Key Features

- **Payment Processing**: Stripe integration with webhooks and subscription management
- **Email Services**: Multi-provider email delivery with template management
- **Scheduling Systems**: Cal.com and Calendly integration with booking workflows
- **API Integration**: OAuth 2.1, webhooks, and secure API patterns
- **Multi-Tenant Ready**: Tenant-aware integration with proper isolation

---

## 💳 Payment Processing Integration

### Stripe Integration Architecture

```typescript
// packages/integrations/stripe/src/index.ts
import Stripe from 'stripe';
import { z } from 'zod';

// Configuration
interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  publishableKey: string;
  environment: 'development' | 'staging' | 'production';
}

export class StripeIntegration {
  private stripe: Stripe;
  private config: StripeConfig;

  constructor(config: StripeConfig) {
    this.config = config;
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }

  // Customer Management
  async createCustomer(
    tenantId: string,
    email: string,
    name?: string
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        tenant_id: tenantId,
        source: 'marketing-websites',
      },
    });

    return customer;
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.retrieve(customerId);
  }

  // Subscription Management
  async createSubscription(
    customerId: string,
    priceId: string,
    tenantId: string
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: {
        tenant_id: tenantId,
      },
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
    });

    return subscription;
  }

  async updateSubscription(
    subscriptionId: string,
    items: Stripe.SubscriptionUpdateParams.Item[]
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, {
      items,
    });
  }

  async cancelSubscription(
    subscriptionId: string,
    immediately: boolean = false
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.cancel(subscriptionId, {
      at_period_end: !immediately,
    });
  }

  // Checkout Sessions
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    tenantId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenant_id: tenantId,
      },
      allow_promotion_codes: true,
      billing_address_collection: {
        enabled: true,
        required: 'auto',
      },
    });

    return session;
  }

  // Customer Portal
  async createCustomerPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  // Webhook Handling
  async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );
      return true;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const tenantId = session.metadata?.tenant_id;
    if (!tenantId) {
      console.error('No tenant_id in session metadata');
      return;
    }

    // Update tenant subscription status
    await updateTenantSubscription(tenantId, {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      status: 'active',
    });

    // Send confirmation email
    await sendSubscriptionConfirmationEmail(tenantId, session);
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscription = await this.stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    const tenantId = subscription.metadata?.tenant_id;

    if (tenantId) {
      // Update payment records
      await recordPayment(tenantId, invoice);
    }
  }

  private async handleSubscriptionCancelled(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenant_id;
    if (tenantId) {
      // Update tenant subscription status
      await updateTenantSubscription(tenantId, {
        status: 'cancelled',
        cancelledAt: new Date(),
      });

      // Send cancellation email
      await sendSubscriptionCancellationEmail(tenantId, subscription);
    }
  }
}

// Webhook handler for Next.js API route
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  const stripeIntegration = new StripeIntegration({
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    environment: process.env.NODE_ENV as any,
  });

  if (!await stripeIntegration.verifyWebhookSignature(body, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body) as Stripe.Event;
  await stripeIntegration.handleWebhookEvent(event);

  return Response.json({ received: true });
}
```

### Payment Component Integration

```typescript
// packages/ui/src/payments/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentFormProps {
  priceId: string;
  tenantId: string;
  onSuccess?: (session: Stripe.Checkout.Session) => void;
  onError?: (error: Error) => void;
}

export function PaymentForm({ 
  priceId, 
  tenantId, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  React.useEffect(() => {
    const loadStripeInstance = async () => {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      setStripe(stripeInstance);
    };

    loadStripeInstance();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe) {
      onError?.(new Error('Stripe not loaded'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tenantId }),
      });

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        onError?.(error);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="submit-button"
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

---

## 📧 Email Services Integration

### Multi-Provider Email Architecture

```typescript
// packages/integrations/email/src/index.ts
interface EmailConfig {
  providers: EmailProvider[];
  defaultProvider: string;
  fallbackProviders: string[];
}

interface EmailProvider {
  name: string;
  config: Record<string, any>;
  priority: number;
}

export class EmailService {
  private providers: Map<string, EmailProviderInstance> = new Map();
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    for (const providerConfig of this.config.providers) {
      switch (providerConfig.name) {
        case 'postmark':
          this.providers.set('postmark', new PostmarkProvider(providerConfig.config));
          break;
        case 'resend':
          this.providers.set('resend', new ResendProvider(providerConfig.config));
          break;
        case 'sendgrid':
          this.providers.set('sendgrid', new SendGridProvider(providerConfig.config));
          break;
      }
    }
  }

  async sendEmail(
    options: EmailOptions,
    providerName?: string
  ): Promise<EmailResult> {
    const provider = providerName 
      ? this.providers.get(providerName)
      : this.providers.get(this.config.defaultProvider);

    if (!provider) {
      throw new Error(`Email provider not found: ${providerName}`);
    }

    try {
      const result = await provider.send(options);
      
      // Log successful delivery
      await this.logEmailDelivery(options, result, providerName);
      
      return result;
    } catch (error) {
      console.error(`Email delivery failed with ${providerName}:`, error);
      
      // Try fallback providers
      if (!providerName) {
        return await this.tryFallbackProviders(options);
      }
      
      throw error;
    }
  }

  private async tryFallbackProviders(options: EmailOptions): Promise<EmailResult> {
    for (const fallbackProviderName of this.config.fallbackProviders) {
      const fallbackProvider = this.providers.get(fallbackProviderName);
      
      if (!fallbackProvider) continue;

      try {
        console.log(`Trying fallback provider: ${fallbackProviderName}`);
        const result = await fallbackProvider.send(options);
        console.log(`Fallback provider ${fallbackProviderName} succeeded`);
        return result;
      } catch (error) {
        console.error(`Fallback provider ${fallbackProviderName} failed:`, error);
        continue;
      }
    }

    throw new Error('All email providers failed');
  }

  private async logEmailDelivery(
    options: EmailOptions,
    result: EmailResult,
    providerName: string
  ): Promise<void> {
    // Log to database or monitoring system
    await recordEmailDelivery({
      provider: providerName,
      to: options.to,
      subject: options.subject,
      messageId: result.messageId,
      status: 'delivered',
      timestamp: new Date(),
    });
  }
}

// Postmark Provider
class PostmarkProvider implements EmailProviderInstance {
  constructor(private config: { apiKey: string }) {}

  async send(options: EmailOptions): Promise<EmailResult> {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': this.config.apiKey,
      },
      body: JSON.stringify({
        From: options.from,
        To: options.to,
        Subject: options.subject,
        HtmlBody: options.html,
        TextBody: options.text,
        MessageStream: options.messageStream || 'outbound',
      }),
    });

    if (!response.ok) {
      throw new Error(`Postmark API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      messageId: data.MessageID,
      provider: 'postmark',
      status: 'sent',
    };
  }
}

// Resend Provider
class ResendProvider implements EmailProviderInstance {
  constructor(private config: { apiKey: string }) {}

  async send(options: EmailOptions): Promise<EmailResult> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      messageId: data.id,
      provider: 'resend',
      status: 'sent',
    };
  }
}

// Email template system
export class EmailTemplateService {
  private templates = new Map<string, EmailTemplate>();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    // Load templates from database or file system
    this.templates.set('welcome', {
      subject: 'Welcome to Marketing Websites',
      html: this.getWelcomeTemplate(),
      text: this.getWelcomeTextTemplate(),
    });

    this.templates.set('subscription-confirmation', {
      subject: 'Subscription Confirmation',
      html: this.getSubscriptionConfirmationTemplate(),
      text: this.getSubscriptionConfirmationTextTemplate(),
    });

    this.templates.set('subscription-cancellation', {
      subject: 'Subscription Cancelled',
      html: this.getSubscriptionCancellationTemplate(),
      text: this.getSubscriptionCancellationTextTemplate(),
    });
  }

  renderTemplate(
    templateName: string,
    data: Record<string, any>
  ): { subject: string; html: string; text: string } {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    return {
      subject: this.interpolate(template.subject, data),
      html: this.interpolate(template.html, data),
      text: this.interpolate(template.text, data),
    };
  }

  private interpolate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private getWelcomeTemplate(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Welcome to Marketing Websites!</h1>
        <p>Hi {{name}},</p>
        <p>Thank you for signing up for Marketing Websites. We're excited to help you create amazing marketing experiences.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Next Steps:</h3>
          <ol>
            <li>Complete your profile setup</li>
            <li>Create your first marketing site</li>
            <li>Explore our features and templates</li>
          </ol>
        </div>
        <p>If you have any questions, don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br>The Marketing Websites Team</p>
      </div>
    `;
  }

  private getWelcomeTextTemplate(): string {
    return `Welcome to Marketing Websites!

Hi {{name}},

Thank you for signing up for Marketing Websites. We're excited to help you create amazing marketing experiences.

Next Steps:
1. Complete your profile setup
2. Create your first marketing site
3. Explore our features and templates

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
The Marketing Websites Team`;
  }

  // ... other template methods
}

// Usage in Server Action
export async function sendWelcomeEmail(tenantId: string, userEmail: string, userName: string) {
  const emailService = new EmailService({
    providers: [
      { name: 'postmark', config: { apiKey: process.env.POSTMARK_API_KEY! }, priority: 1 },
      { name: 'resend', config: { apiKey: process.env.RESEND_API_KEY! }, priority: 2 },
    ],
    defaultProvider: 'postmark',
    fallbackProviders: ['resend'],
  });

  const templateService = new EmailTemplateService();
  const template = templateService.renderTemplate('welcome', {
    name: userName,
  });

  await emailService.sendEmail({
    from: 'noreply@marketing-websites.com',
    to: userEmail,
    ...template,
    messageStream: 'welcome',
  });
}
```

---

## 📅 Scheduling Integration

### Cal.com Integration

```typescript
// packages/integrations/calcom/src/index.ts
interface CalComConfig {
  apiKey: string;
  webhookSecret: string;
  baseUrl: string;
}

export class CalComIntegration {
  private config: CalComConfig;
  private webhookSecret: string;

  constructor(config: CalComConfig) {
    this.config = config;
    this.webhookSecret = config.webhookSecret;
  }

  // Event Type Management
  async createEventType(
    tenantId: string,
    eventTypeData: Partial<CalComEventType>
  ): Promise<CalComEventType> {
    const response = await fetch(`${this.config.baseUrl}/v1/event-types`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventTypeData,
        metadata: {
          tenant_id: tenantId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event type: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventTypes(tenantId: string): Promise<CalComEventType[]> {
    const response = await fetch(`${this.config.baseUrl}/v1/event-types`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get event types: ${response.statusText}`);
    }

    const eventTypes = await response.json();
    
    // Filter by tenant
    return eventTypes.filter((eventType: CalComEventType) => 
      eventType.metadata?.tenant_id === tenantId
    );
  }

  // Booking Management
  async createBooking(
    tenantId: string,
    bookingData: CalComBookingData
  ): Promise<CalComBooking> {
    const response = await fetch(`${this.config.baseUrl}/v1/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bookingData,
        metadata: {
          tenant_id: tenantId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create booking: ${response.statusText}`);
    }

    const booking = await response.json();
    
    // Send confirmation email
    await this.sendBookingConfirmationEmail(booking, tenantId);
    
    return booking;
  }

  async getBooking(bookingId: string): Promise<CalComBooking> {
    const response = await fetch(`${this.config.baseUrl}/v1/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get booking: ${response.statusText}`);
    }

    return response.json();
  }

  // Webhook Handling
  async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      hmac.update(payload);
      const expectedSignature = `sha256=${hmac.digest('hex')}`;
      
      return crypto.timingSafeEqual(expectedSignature, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  async handleWebhookEvent(event: CalComWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'booking.created':
        await this.handleBookingCreated(event);
        break;
      case 'booking.rescheduled':
        await this.handleBookingRescheduled(event);
        break;
      case 'booking.cancelled':
        await this.handleBookingCancelled(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleBookingCreated(event: CalComWebhookEvent): Promise<void> {
    const booking = event.payload as CalComBooking;
    const tenantId = booking.metadata?.tenant_id;

    if (tenantId) {
      // Record booking in database
      await recordBooking(tenantId, booking);

      // Send confirmation email
      await this.sendBookingConfirmationEmail(booking, tenantId);

      // Trigger lead scoring
      await updateLeadScore(booking.email, 'booking_created');
    }
  }

  private async handleBookingRescheduled(event: CalComWebhookEvent): Promise<void> {
    const booking = event.payload as CalComBooking;
    const tenantId = booking.metadata?.tenant_id;

    if (tenantId) {
      // Update booking in database
      await updateBooking(tenantId, booking);

      // Send reschedule notification
      await this.sendRescheduleNotificationEmail(booking, tenantId);
    }
  }

  private async handleBookingCancelled(event: CalComWebhookEvent): Promise<void> {
    const booking = event.payload as CalComBooking;
    const tenantId = booking.metadata?.tenant_id;

    if (tenantId) {
      // Update booking status
      await updateBookingStatus(tenantId, booking.id, 'cancelled');

      // Send cancellation notification
      await this.sendCancellationNotificationEmail(booking, tenantId);
    }
  }

  private async sendBookingConfirmationEmail(
    booking: CalComBooking,
    tenantId: string
  ): Promise<void> {
    const templateService = new EmailTemplateService();
    const template = templateService.renderTemplate('booking-confirmation', {
      customerName: booking.name,
      eventName: booking.event.title,
      startTime: booking.startTime,
      endTime: booking.endTime,
      location: booking.location || 'Online',
    });

    await sendEmail(tenantId, booking.email, template);
  }

  // Embed Widget Configuration
  getEmbedConfig(tenantId: string, eventTypeSlug: string): CalComEmbedConfig {
    return {
      calLink: `${this.config.baseUrl}/booking/${eventTypeSlug}`,
      config: {
        theme: {
          branding: {
            brandColor: '#3b82f6',
            darkBrandColor: '#1e40af',
          },
        },
        layout: {
          showEventTypeDescription: false,
          hideEventTypeDetails: false,
        },
      },
      metadata: {
        tenant_id: tenantId,
      },
    };
  }
}

// Webhook handler for Next.js API route
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('cal-signature-256') || '';

  const calComIntegration = new CalComIntegration({
    apiKey: process.env.CALCOM_API_KEY!,
    webhookSecret: process.env.CALCOM_WEBHOOK_SECRET!,
    baseUrl: 'https://api.cal.com',
  });

  if (!await calComIntegration.verifyWebhookSignature(body, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body) as CalComWebhookEvent;
  await calComIntegration.handleWebhookEvent(event);

  return Response.json({ received: true });
}
```

### Embed Widget Components

```typescript
// packages/ui/src/scheduling/CalComEmbed.tsx
'use client';

import { useEffect, useState } from 'react';
import { Cal } from '@calcom/embed-react';

interface CalComEmbedProps {
  tenantId: string;
  eventTypeSlug: string;
  className?: string;
  height?: number;
}

export function CalComEmbed({
  tenantId,
  eventTypeSlug,
  className = '',
  height = 600,
}: CalComEmbedProps) {
  const [embedConfig, setEmbedConfig] = useState<CalComEmbedConfig | null>(null);

  useEffect(() => {
    // Fetch embed configuration from API
    const fetchEmbedConfig = async () => {
      try {
        const response = await fetch(`/api/cal/embed-config?tenantId=${tenantId}&eventType=${eventTypeSlug}`);
        const config = await response.json();
        setEmbedConfig(config);
      } catch (error) {
        console.error('Failed to fetch embed config:', error);
      }
    };

    fetchEmbedConfig();
  }, [tenantId, eventTypeSlug]);

  if (!embedConfig) {
    return <div>Loading booking widget...</div>;
  }

  return (
    <div className={`calcom-embed ${className}`}>
      <Cal
        calLink={embedConfig.calLink}
        config={embedConfig.config}
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
```

---

## 🔗 API Integration Patterns

### OAuth 2.1 with PKCE

```typescript
// packages/integrations/oauth/src/index.ts
export class OAuth2Provider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];

  constructor(config: OAuth2Config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = config.scopes;
  }

  // PKCE Flow
  async initiateAuthorization(): Promise<{
    authUrl: string;
    codeVerifier: string;
    codeChallenge: string;
  }> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${this.authorizationUrl}?${params.toString()}`;

    return { authUrl, codeVerifier, codeChallenge };
  }

  async exchangeCodeForToken(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code: code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return response.json();
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...digest));
  }
}

// HubSpot Integration Example
export class HubSpotIntegration extends OAuth2Provider {
  constructor() {
    super({
      clientId: process.env.HUBSPOT_CLIENT_ID!,
      clientSecret: process.env.HUBSPOT_CLIENT_SECRET!,
      redirectUri: process.env.HUBSPOT_REDIRECT_URI!,
      scopes: ['crm.objects.contacts.read', 'crm.objects.deals.read'],
      authorizationUrl: 'https://app.hubspot.com/oauth/authorize',
      tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    });
  }

  async getContacts(): Promise<HubSpotContact[]> {
    const token = await this.getValidToken();
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: {
        'Authorization': `Bearer ${token.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  }

  async createContact(contact: HubSpotContactData): Promise<HubSpotContact> {
    const token = await this.getValidToken();
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: contact.properties,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create contact: ${response.statusText}`);
    }

    return response.json();
  }

  private async getValidToken(): Promise<OAuthTokenResponse> {
    // Check if we have a valid token
    const storedToken = await this.getStoredToken();
    
    if (storedToken && !this.isTokenExpired(storedToken)) {
      return storedToken;
    }

    // Refresh token or throw error
    if (storedToken?.refreshToken) {
      return await this.refreshToken(storedToken.refreshToken);
    }

    throw new Error('No valid OAuth token available');
  }

  private async getStoredToken(): Promise<OAuthTokenResponse | null> {
    // Implementation depends on your storage system
    return null; // Simplified
  }

  private isTokenExpired(token: OAuthTokenResponse): boolean {
    return token.expires_at * 1000 < Date.now();
  }
}
```

---

## 📋 Integration Checklist

### Pre-Integration Checklist

- [ ] **API Keys**: Securely stored and accessible
- [ ] **OAuth Setup**: OAuth 2.1 with PKCE configured
- [ ] **Webhook Endpoints**: Created and secured
- [ ] **Rate Limiting**: Implemented per provider
- [ ] **Error Handling**: Comprehensive error handling
- [ ] **Logging**: Integration-specific logging
- [ ] **Testing**: Integration tests written
- [ ] **Documentation**: Integration documented

### Security Checklist

- [ ] **API Key Security**: Keys stored in secure vault
- [ ] **Webhook Verification**: Signature validation implemented
- [ ] **Data Encryption**: Sensitive data encrypted
- [ ] **Access Control**: Proper authorization checks
- [ ] **Audit Logging**: All actions logged
- [ ] **Rate Limiting**: Abuse prevention
- [ ] **Input Validation**: All inputs validated
- [ ] **HTTPS**: All API calls use HTTPS

### Operational Checklist

- [ ] **Monitoring**: Integration metrics tracked
- [ ] **Alerting**: Failure alerts configured
- [ ] **Fallback**: Backup providers configured
- [ ] **Health Checks**: Integration health monitored
- [ ] **Documentation**: Integration docs up to date
- [ ] **Testing**: Regular integration tests
- [ ] **Backup**: Data backup procedures
- [ ] **Disaster Recovery**: Recovery plans tested

---

## Related Resources

- [System Architecture Guide](../architecture/system-architecture-guide.md)
- [Security Implementation](../security/security-implementation-guide.md)
- [Development Stack Guide](../development/modern-development-stack.md)
- [Infrastructure Guide](../infrastructure/infrastructure-devops-guide.md)
