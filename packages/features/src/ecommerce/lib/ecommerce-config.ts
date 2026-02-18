/**
 * @file packages/features/src/ecommerce/lib/ecommerce-config.ts
 * Purpose: E-commerce feature configuration stub
 */

export type CommerceProvider = 'headless' | 'shopify' | 'custom' | 'none';

export interface EcommerceFeatureConfig {
  provider?: CommerceProvider;
  enabled?: boolean;
}

export function createEcommerceConfig(overrides: Partial<EcommerceFeatureConfig> = {}): EcommerceFeatureConfig {
  return { provider: 'none', enabled: false, ...overrides };
}
