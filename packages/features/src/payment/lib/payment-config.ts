/**
 * @file packages/features/src/payment/lib/payment-config.ts
 * Purpose: Payment feature configuration stub
 */

export type PaymentProvider = 'stripe' | 'paypal' | 'custom' | 'none';

export interface PaymentFeatureConfig {
  provider?: PaymentProvider;
  enabled?: boolean;
}

export function createPaymentConfig(
  overrides: Partial<PaymentFeatureConfig> = {}
): PaymentFeatureConfig {
  return { provider: 'none', enabled: false, ...overrides };
}
