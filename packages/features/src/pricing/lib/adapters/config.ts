/**
 * @file packages/features/src/pricing/lib/adapters/config.ts
 * Purpose: Config-based pricing adapter
 */

import type { PricingPlan } from '@repo/marketing-components';
import type { PricingFeatureConfig } from '../pricing-config';

export async function getPricingFromConfig(
  config: PricingFeatureConfig
): Promise<PricingPlan[]> {
  return config.plans ?? [];
}
