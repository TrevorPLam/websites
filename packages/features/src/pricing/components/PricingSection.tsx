/**
 * @file packages/features/src/pricing/components/PricingSection.tsx
 * Purpose: Pricing section using marketing-components display
 */

import { PricingTable, PricingCards } from '@repo/marketing-components';
import type { PricingPlan } from '@repo/marketing-components';
import type { PricingFeatureConfig } from '../lib/pricing-config';

export interface PricingSectionProps extends PricingFeatureConfig {
  /** Pre-loaded plans (overrides config when provided) */
  plans?: PricingPlan[];
}

export function PricingSection({
  title,
  layout = 'cards',
  plans: propsPlans,
  ...rest
}: PricingSectionProps) {
  const config = rest as PricingFeatureConfig;
  const plans = propsPlans ?? config.plans ?? [];

  if (plans.length === 0) return null;

  if (layout === 'table') {
    return <PricingTable title={title} plans={plans} />;
  }

  return <PricingCards title={title} plans={plans} />;
}
