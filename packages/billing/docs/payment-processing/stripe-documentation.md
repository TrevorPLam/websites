# stripe-documentation.md

## Overview

Stripe is a comprehensive payment processing platform that provides APIs and tools for businesses to accept and manage payments online. This documentation covers Stripe's core APIs, payment processing patterns, webhook handling, and best practices for 2026 integration.

## API Fundamentals

### REST API Architecture

The Stripe API is organized around REST with predictable resource-oriented URLs:

```typescript
// API endpoint structure
https://api.stripe.com/v1/{resource}

// Examples
https://api.stripe.com/v1/charges
https://api.stripe.com/v1/customers
https://api.stripe.com/v1/payment_intents
```

### Authentication

#### API Key Authentication

```typescript
// Using API key in header
const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

// Test vs Live mode
const testKey = 'sk_test_...'; // Test mode
const liveKey = 'sk_live_...'; // Live mode
```

#### Environment Configuration

```typescript
interface StripeConfig {
  apiKey: string;
  apiVersion: string;
  maxNetworkRetries: number;
  timeout: number;
}

const stripeConfig: StripeConfig = {
  apiKey: process.env.STRIPE_SECRET_KEY,
  apiVersion: '2026-01-28',
  maxNetworkRetries: 3,
  timeout: 30000,
};

const stripe = require('stripe')(stripeConfig.apiKey);
```

## Core Payment Processing

### Payment Intents (Recommended)

Payment Intents is Stripe's modern payment processing API:

```typescript
// Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // Amount in cents ($20.00)
  currency: 'usd',
  payment_method_types: ['card'],
  confirmation_method: 'manual',
  confirm: true,

  // Metadata for tracking
  metadata: {
    order_id: 'order_123',
    customer_email: 'customer@example.com',
  },

  // Automatic payment methods
  automatic_payment_methods: {
    enabled: true,
  },
});

// Response structure
interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'canceled';
  client_secret: string;
  payment_method: string | null;
  next_action: NextAction | null;
}
```

### Payment Methods

```typescript
// Create a payment method
const paymentMethod = await stripe.paymentMethods.create({
  type: 'card',
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2026,
    cvc: '123',
  },
  billing_details: {
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94111',
      country: 'US',
    },
  },
});

// Attach to customer
await stripe.paymentMethods.attach(paymentMethod.id, { customer: 'cus_123' });
```

### Customer Management

```typescript
// Create a customer
const customer = await stripe.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  description: 'Premium customer',

  // Payment method for recurring billing
  payment_method: 'pm_123',
  invoice_settings: {
    default_payment_method: 'pm_123',
  },

  // Metadata
  metadata: {
    source: 'website',
    plan: 'premium',
  },
});

// Update customer
const updatedCustomer = await stripe.customers.update('cus_123', {
  email: 'newemail@example.com',
  metadata: {
    last_updated: new Date().toISOString(),
  },
});
```

## Subscription Management

### Creating Subscriptions

```typescript
// Create a subscription
const subscription = await stripe.subscriptions.create({
  customer: 'cus_123',
  items: [
    {
      price: 'price_123', // Price ID from product catalog
    },
  ],

  // Billing cycle
  billing_cycle_anchor: 'now',
  proration_behavior: 'create_prorations',

  // Trial period
  trial_period_days: 14,

  // Payment settings
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});

// Subscription object
interface Subscription {
  id: string;
  object: 'subscription';
  customer: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  current_period_start: number;
  current_period_end: number;
  items: SubscriptionItem[];
  latest_invoice: Invoice;
}
```

### Price and Product Management

```typescript
// Create a product
const product = await stripe.products.create({
  name: 'Premium Plan',
  description: 'Access to all premium features',
  type: 'service',

  // Metadata
  metadata: {
    features: 'feature1,feature2,feature3',
    support_level: 'priority',
  },
});

// Create a price
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 2000, // $20.00
  currency: 'usd',
  recurring: {
    interval: 'month',
    interval_count: 1,
    trial_period_days: 14,
  },

  // Pricing tiers
  tiers: [
    {
      up_to: 10,
      unit_amount: 2000,
    },
    {
      up_to: 100,
      unit_amount: 1500,
    },
    {
      unit_amount: 1000,
    },
  ],
  tiers_mode: 'graduated',
});
```

## Webhook Handling

### Webhook Setup

```typescript
// Express.js webhook endpoint
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  await handleWebhookEvent(event);

  res.json({ received: true });
});
```

### Event Handling

```typescript
interface WebhookEvent {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  type: string;
  data: {
    object: any;
  };
}

async function handleWebhookEvent(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePayment(event.data.object);
      break;

    case 'invoice.payment_failed':
      await handleInvoiceFailure(event.data.object);
      break;

    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handlePaymentSuccess(paymentIntent: any): Promise<void> {
  // Update order status
  await updateOrderStatus(paymentIntent.metadata.order_id, 'paid');

  // Send confirmation email
  await sendPaymentConfirmation(paymentIntent.metadata.customer_email);

  // Update customer records
  await updateCustomerPaymentHistory(paymentIntent.customer, paymentIntent);
}
```

### Webhook Security

```typescript
// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret);
    return true;
  } catch (err) {
    return false;
  }
}

// Rate limiting for webhooks
const webhookRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many webhook requests from this IP',
});
```

## Error Handling

### Error Types

```typescript
// Stripe error handling
try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
  });
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'StripeCardError':
        // Card was declined
        console.log('Card error:', error.message);
        break;

      case 'StripeRateLimitError':
        // Too many requests made to the API
        console.log('Rate limit error:', error.message);
        break;

      case 'StripeInvalidRequestError':
        // Invalid parameters were supplied
        console.log('Invalid request:', error.message);
        break;

      case 'StripeAPIError':
        // API server error
        console.log('API error:', error.message);
        break;

      case 'StripeConnectionError':
        // Network communication error
        console.log('Connection error:', error.message);
        break;

      case 'StripeAuthenticationError':
        // Authentication with Stripe's API failed
        console.log('Authentication error:', error.message);
        break;
    }
  } else {
    // Non-Stripe error
    console.log('Unknown error:', error);
  }
}
```

### Retry Logic

```typescript
// Exponential backoff retry
async function retryStripeRequest<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Only retry on network errors or rate limits
      if (error.type === 'StripeConnectionError' || error.type === 'StripeRateLimitError') {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error; // Don't retry other errors
    }
  }

  throw new Error('Max retries exceeded');
}
```

## Advanced Features

### Connect Platform

```typescript
// Create a connected account
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: 'seller@example.com',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  business_type: 'individual',

  // Onboarding settings
  business_profile: {
    name: 'John Doe Store',
    product_description: 'Handmade goods',
  },
});

// Create a charge on behalf of connected account
const charge = await stripe.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa',
  transfer_data: {
    destination: account.id,
  },
});
```

### Radar Fraud Detection

```typescript
// Create payment intent with fraud detection
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  payment_method_types: ['card'],

  // Radar settings
  radar_options: {
    session: {
      device_fingerprint: 'fp_123456',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
    },
  },

  // Risk level assessment
  level3: {
    merchant_reference: 'order_123',
    customer_reference: 'customer_456',
  },
});

// Handle radar events
if (event.type === 'radar.early_fraud_warning.created') {
  const warning = event.data.object;
  await handleFraudWarning(warning);
}
```

### Financial Reporting

```typescript
// Generate balance reports
const balance = await stripe.balance.retrieve();
const balanceTransactions = await stripe.balanceTransactions.list({
  limit: 100,
  created: {
    gte: Math.floor(Date.now() / 1000) - 86400, // Last 24 hours
  },
});

// Create custom reports
interface FinancialReport {
  period: {
    start: Date;
    end: Date;
  };
  revenue: {
    gross: number;
    fees: number;
    net: number;
  };
  transactions: BalanceTransaction[];
}
```

## Security Best Practices

### PCI Compliance

```typescript
// Use Stripe Elements for secure card collection
const elements = stripe.elements({
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
    },
  ],
  locale: 'auto',
});

// Create card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
});

cardElement.mount('#card-element');

// Handle payment submission
async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault();

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      name: cardHolderName,
      email: customerEmail,
    },
  });

  if (error) {
    showError(error.message);
  } else {
    // Send payment method ID to server
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method_id: paymentMethod.id }),
    });

    const { client_secret } = await response.json();
    await stripe.confirmCardPayment(client_secret);
  }
}
```

### API Key Management

```typescript
// Environment-specific configuration
interface StripeEnvironment {
  apiKey: string;
  webhookSecret: string;
  publishableKey: string;
  connectClientId?: string;
}

const environments: Record<string, StripeEnvironment> = {
  development: {
    apiKey: process.env.STRIPE_TEST_KEY,
    webhookSecret: process.env.STRIPE_TEST_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_TEST_PUBLISHABLE_KEY,
  },
  production: {
    apiKey: process.env.STRIPE_LIVE_KEY,
    webhookSecret: process.env.STRIPE_LIVE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_LIVE_PUBLISHABLE_KEY,
  },
};

// Key rotation strategy
class StripeKeyManager {
  private currentKeyIndex = 0;
  private keys: string[] = [];

  constructor(keys: string[]) {
    this.keys = keys;
  }

  getCurrentKey(): string {
    return this.keys[this.currentKeyIndex];
  }

  rotateKey(): void {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
  }

  async testKey(key: string): Promise<boolean> {
    try {
      const stripe = require('stripe')(key);
      await stripe.accounts.retrieve();
      return true;
    } catch {
      return false;
    }
  }
}
```

## Testing and Development

### Test Cards

```typescript
// Test card numbers for development
const testCards = {
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

  // International cards
  international: '4000000000000036',

  // High-risk
  highRisk: '4000000000009256',
};
```

### Mock Webhooks

```typescript
// Webhook testing utilities
class WebhookTestHelper {
  static createMockEvent(type: string, data: any): WebhookEvent {
    return {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2026-01-28',
      created: Math.floor(Date.now() / 1000),
      type,
      data: { object: data },
    };
  }

  static async triggerWebhook(event: WebhookEvent): Promise<void> {
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateSignature(payload, process.env.STRIPE_WEBHOOK_SECRET);

    await fetch('http://localhost:3000/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature,
      },
      body: payload,
    });
  }
}
```

## Performance Optimization

### Caching Strategy

```typescript
// Redis caching for Stripe data
class StripeCache {
  private redis: Redis;
  private ttl: number = 300; // 5 minutes

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getCustomer(customerId: string): Promise<any> {
    const cacheKey = `stripe:customer:${customerId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
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
// Efficient batch processing
async function processBatchPayments(paymentIntents: string[]): Promise<void> {
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

## Monitoring and Analytics

### Payment Analytics

```typescript
interface PaymentMetrics {
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  conversionRate: number;
  paymentMethodBreakdown: Record<string, number>;
}

class StripeAnalytics {
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

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Stripe API Reference](https://docs.stripe.com/api)
- [Stripe Webhooks Documentation](https://docs.stripe.com/webhooks)
- [Stripe Payment Intents Guide](https://docs.stripe.com/payments/payment-intents)
- [Stripe Subscriptions Documentation](https://docs.stripe.com/billing/subscriptions)
- [Stripe Connect Platform Guide](https://docs.stripe.com/connect)
- [Stripe Radar Fraud Detection](https://docs.stripe.com/radar)
- [Stripe Testing Guide](https://docs.stripe.com/testing)
- [Stripe Security Best Practices](https://docs.stripe.com/security)

## Implementation

[Add content here]

## Best Practices

[Add content here]
