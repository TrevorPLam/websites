/**
 * Stripe Billing Integration
 * Complete billing system with webhooks, checkout, and customer portal
 */

import { z } from 'zod';
import Stripe from 'stripe';

// Configuration schemas
export const BillingConfigSchema = z.object({
  tenantId: z.string().uuid(),
  stripeSecretKey: z.string().min(1),
  webhookSecret: z.string().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  currency: z.string().default('usd'),
});

export type BillingConfig = z.infer<typeof BillingConfigSchema>;

// Product/Price schemas
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priceId: z.string(),
  unitAmount: z.number(),
  currency: z.string(),
  recurring: z
    .object({
      interval: z.enum(['day', 'week', 'month', 'year']),
      intervalCount: z.number().default(1),
    })
    .optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Customer schemas
export const CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;

// Checkout session schemas
export const CheckoutSessionRequestSchema = z.object({
  tenantId: z.string().uuid(),
  customerId: z.string().optional(),
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  metadata: z.record(z.string()).optional(),
  customerEmail: z.string().email().optional(),
});

export type CheckoutSessionRequest = z.infer<typeof CheckoutSessionRequestSchema>;

/**
 * Stripe Billing Service
 */
export class StripeBillingService {
  private stripe: Stripe;
  private config: BillingConfig;

  constructor(config: BillingConfig) {
    this.config = config;
    this.stripe = new Stripe(config.stripeSecretKey);
  }

  /**
   * Create a checkout session for one-time payment
   */
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<Stripe.Checkout.Session> {
    const validatedRequest = CheckoutSessionRequestSchema.parse(request);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: validatedRequest.priceId,
          quantity: 1,
        },
      ],
      success_url: validatedRequest.successUrl,
      cancel_url: validatedRequest.cancelUrl,
      metadata: {
        ...validatedRequest.metadata,
        tenantId: validatedRequest.tenantId,
      },
    };

    if (validatedRequest.customerId) {
      sessionConfig.customer = validatedRequest.customerId;
    } else if (validatedRequest.customerEmail) {
      sessionConfig.customer_email = validatedRequest.customerEmail;
    }

    return this.stripe.checkout.sessions.create(sessionConfig);
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckout(
    request: CheckoutSessionRequest
  ): Promise<Stripe.Checkout.Session> {
    const validatedRequest = CheckoutSessionRequestSchema.parse(request);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: validatedRequest.priceId,
          quantity: 1,
        },
      ],
      success_url: validatedRequest.successUrl,
      cancel_url: validatedRequest.cancelUrl,
      metadata: {
        ...validatedRequest.metadata,
        tenantId: validatedRequest.tenantId,
      },
    };

    if (validatedRequest.customerId) {
      sessionConfig.customer = validatedRequest.customerId;
    } else if (validatedRequest.customerEmail) {
      sessionConfig.customer_email = validatedRequest.customerEmail;
    }

    return this.stripe.checkout.sessions.create(sessionConfig);
  }

  /**
   * Create or retrieve a customer
   */
  async createOrRetrieveCustomer(customerData: Customer): Promise<Stripe.Customer> {
    const validatedCustomer = CustomerSchema.parse(customerData);

    // Try to retrieve existing customer by email
    const existingCustomers = await this.stripe.customers.list({
      email: validatedCustomer.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0] as Stripe.Customer;
    }

    // Create new customer
    return this.stripe.customers.create({
      email: validatedCustomer.email,
      name: validatedCustomer.name,
      phone: validatedCustomer.phone,
      metadata: {
        ...validatedCustomer.metadata,
        tenantId: this.config.tenantId,
      },
    });
  }

  /**
   * Create customer portal session
   */
  async createCustomerPortalSession(customerId: string): Promise<Stripe.BillingPortal.Session> {
    return this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${this.config.successUrl}/billing`,
    });
  }

  /**
   * Retrieve a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * List customer subscriptions
   */
  async listCustomerSubscriptions(
    customerId: string
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return this.stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
  }

  /**
   * Create a product
   */
  async createProduct(product: Product): Promise<Stripe.Product> {
    const validatedProduct = ProductSchema.parse(product);

    const productConfig: Stripe.ProductCreateParams = {
      name: validatedProduct.name,
      description: validatedProduct.description,
      metadata: {
        tenantId: this.config.tenantId,
      },
    };

    const createdProduct = await this.stripe.products.create(productConfig);

    // Create price for the product
    const priceConfig: Stripe.PriceCreateParams = {
      product: createdProduct.id,
      unit_amount: validatedProduct.unitAmount,
      currency: validatedProduct.currency,
    };

    if (validatedProduct.recurring) {
      priceConfig.recurring = validatedProduct.recurring;
    }

    await this.stripe.prices.create(priceConfig);

    return createdProduct;
  }

  /**
   * Get product with prices
   */
  async getProductWithPrices(
    productId: string
  ): Promise<{ product: Stripe.Product; prices: Stripe.Price[] }> {
    const product = await this.stripe.products.retrieve(productId);
    const prices = await this.stripe.prices.list({
      product: productId,
      active: true,
    });

    return { product, prices: prices.data };
  }

  /**
   * List all products for tenant
   */
  async listTenantProducts(): Promise<Stripe.ApiList<Stripe.Product>> {
    return this.stripe.products.list({
      limit: 100,
    });
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(payload: string, signature: string): Promise<Stripe.Event> {
    if (!this.config.webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.webhookSecret
    );
    return event;
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    // Handle successful checkout
    console.log('Checkout completed:', session.id);

    // You can emit events, update database, etc.
    // Example: await this.notifyTenant(session.metadata?.tenantId, 'checkout_completed', session);
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful payment
    console.log('Payment succeeded:', invoice.id);

    // Update subscription status, send notifications, etc.
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Handle failed payment
    console.log('Payment failed:', invoice.id);

    // Notify customer, retry logic, etc.
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    // Handle subscription creation
    console.log('Subscription created:', subscription.id);

    // Update user status, grant access, etc.
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Handle subscription deletion
    console.log('Subscription deleted:', subscription.id);

    // Revoke access, update user status, etc.
  }
}

/**
 * Webhook handler utility
 */
export class StripeWebhookHandler {
  private billingService: StripeBillingService;

  constructor(billingService: StripeBillingService) {
    this.billingService = billingService;
  }

  async handleWebhook(request: Request): Promise<{ status: number; message: string }> {
    try {
      const body = await request.text();
      const signature = request.headers.get('stripe-signature') || '';

      const event = await this.billingService.handleWebhook(body, signature);
      await this.billingService.processWebhookEvent(event);

      return { status: 200, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { status: 400, message: 'Webhook processing failed' };
    }
  }
}

/**
 * Factory function to create billing service
 */
export function createBillingService(config: BillingConfig): StripeBillingService {
  return new StripeBillingService(config);
}

// Validation functions
export function validateBillingConfig(config: unknown): BillingConfig {
  return BillingConfigSchema.parse(config);
}

export function validateCheckoutRequest(request: unknown): CheckoutSessionRequest {
  return CheckoutSessionRequestSchema.parse(request);
}

export function validateProduct(product: unknown): Product {
  return ProductSchema.parse(product);
}

export function validateCustomer(customer: unknown): Customer {
  return CustomerSchema.parse(customer);
}
