/**
 * @file packages/features/src/pricing/index.ts
 * Purpose: Pricing feature barrel export
 */

export { PricingSection } from './components/PricingSection';
export type { PricingSectionProps } from './components/PricingSection';
export * from './lib/pricing-config';
export { getPricingFromConfig } from './lib/adapters/config';
