/**
 * Webhook Handler for Stripe Billing
 * Standalone webhook processing utility
 */

import { StripeBillingService } from './billing-service';

/**
 * Process webhook from raw request data
 */
export async function processWebhook(
  body: string,
  signature: string,
  config: {
    tenantId: string;
    stripeSecretKey: string;
    webhookSecret: string;
    successUrl?: string;
    cancelUrl?: string;
    currency?: string;
  }
): Promise<{ status: number; message: string }> {
  try {
    // Create billing service
    const billingService = new StripeBillingService({
      ...config,
      successUrl: config.successUrl || 'http://localhost:3000',
      cancelUrl: config.cancelUrl || 'http://localhost:3000',
      currency: config.currency || 'usd',
    });

    // Process webhook
    const event = await billingService.handleWebhook(body, signature);
    await billingService.processWebhookEvent(event);

    return { status: 200, message: 'Webhook processed successfully' };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { status: 400, message: 'Webhook processing failed' };
  }
}

/**
 * Express.js middleware for webhooks
 */
export function webhookMiddleware(config: {
  tenantId: string;
  stripeSecretKey: string;
  webhookSecret: string;
  successUrl?: string;
  cancelUrl?: string;
  currency?: string;
}) {
  return async (req: any, res: any) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const body = req.body;
      const signature = req.headers['stripe-signature'] || '';

      const result = await processWebhook(body, signature, config);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Webhook middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
