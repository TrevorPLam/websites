/**
 * Webhook Handler for Stripe Billing
 * Standalone webhook processing utility
 */

import { StripeBillingService } from './billing-service';

// Singleton instance for webhook processing
let billingServiceInstance: StripeBillingService | null = null;

/**
 * Get or create singleton billing service instance
 */
function getBillingServiceInstance(config: {
  tenantId: string;
  webhookSecret: string;
  successUrl?: string;
  cancelUrl?: string;
  currency?: string;
}): StripeBillingService {
  if (!billingServiceInstance) {
    billingServiceInstance = new StripeBillingService({
      ...config,
      successUrl: config.successUrl || 'http://localhost:3000',
      cancelUrl: config.cancelUrl || 'http://localhost:3000',
      currency: config.currency || 'usd',
    });
  }
  return billingServiceInstance;
}

/**
 * Process webhook from raw request data
 */
export async function processWebhook(
  body: string,
  signature: string,
  config: {
    tenantId: string;
    webhookSecret: string;
    successUrl?: string;
    cancelUrl?: string;
    currency?: string;
  }
): Promise<{ status: number; message: string }> {
  try {
    // Use singleton billing service instance
    const billingService = getBillingServiceInstance(config);

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
 * IMPORTANT: Use with express.raw({ type: 'application/json' }) to get raw request body
 */
export function webhookMiddleware(config: {
  tenantId: string;
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
      // Use raw request body for Stripe signature verification
      const body = req.body; // This should be raw string, not parsed object
      const signature = req.headers['stripe-signature'] || '';

      const result = await processWebhook(body, signature, config);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Webhook middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
