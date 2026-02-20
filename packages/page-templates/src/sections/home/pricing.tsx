/**
 * @file packages/page-templates/src/sections/home/pricing.tsx
 * Purpose: Pricing section adapter and registration.
 */
import { PricingCards } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function PricingAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return <PricingCards title="Pricing" description={config.description ?? undefined} plans={[]} />;
}

registerSection('pricing', PricingAdapter);
