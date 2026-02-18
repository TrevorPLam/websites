/**
 * @file packages/marketing-components/src/pricing/types.ts
 * @role types
 * @summary Shared types for pricing components
 */

export interface PricingFeature {
  name: string;
  included: boolean | string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: 'month' | 'year';
  features: PricingFeature[];
  cta?: { label: string; href: string };
  popular?: boolean;
  description?: string;
}
