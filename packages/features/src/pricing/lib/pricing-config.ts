/**
 * @file packages/features/src/pricing/lib/pricing-config.ts
 * Purpose: Pricing feature configuration
 */

import type { PricingPlan } from '@repo/marketing-components';

export interface PricingFeatureConfig {
  /** Section title */
  title?: string;
  /** Layout variant */
  layout?: 'table' | 'cards';
  /** Pricing plans (config-based source) */
  plans?: PricingPlan[];
}

export function createPricingConfig(
  overrides: Partial<PricingFeatureConfig> = {}
): PricingFeatureConfig {
  return {
    layout: 'cards',
    ...overrides,
  };
}
