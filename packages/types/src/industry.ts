/**
 * @file packages/types/src/industry.ts
 * [TRACE:FILE=packages.types.industry]
 *
 * Purpose: Industry discriminant and IndustryConfig interface for schema.org and
 *          industry-specific default features/integrations.
 *
 * Relationship: Used by industry-configs.ts to build the config map; exported from
 *               packages/types. Templates set siteConfig.industry to one of these values.
 *
 * System role: Enables multi-industry templates (salon, restaurant, law-firm, etc.) with
 *              typed defaults; IndustryConfig drives optional merging in templates.
 *
 * Assumptions: Industry union is closed; new industries require adding here and in
 *               industry-configs.ts and site-config schema enum.
 */

/** Supported industry slugs for site classification and schema.org schemaType. */
export type Industry =
  | 'salon'
  | 'restaurant'
  | 'law-firm'
  | 'dental'
  | 'medical'
  | 'fitness'
  | 'retail'
  | 'consulting'
  | 'realestate'
  | 'construction'
  | 'automotive'
  | 'general';

/** All feature layout variants used across industries (hero, services, team, etc.). */
export type FeatureVariant =
  | 'centered'
  | 'split'
  | 'video'
  | 'carousel'
  | 'grid'
  | 'list'
  | 'tabs'
  | 'accordion'
  | 'detailed'
  | 'marquee'
  | 'table'
  | 'cards'
  | 'calculator'
  | 'simple'
  | 'multi-step'
  | 'with-booking'
  | 'lightbox';

/**
 * Per-industry defaults: schema.org type, feature variants, and integration presets.
 * Used to suggest or merge defaults when building site config for a given industry.
 */
export interface IndustryConfig {
  /** JSON-LD / schema.org organization type (e.g. "HairSalon", "Restaurant"). */
  schemaType: string;
  /** Default feature flags and layout variants for this industry. */
  defaultFeatures: Partial<{
    hero: 'centered' | 'split' | 'video' | 'carousel' | null;
    services: 'grid' | 'list' | 'tabs' | 'accordion' | null;
    team: 'grid' | 'carousel' | 'detailed' | null;
    testimonials: 'carousel' | 'grid' | 'marquee' | null;
    pricing: 'table' | 'cards' | 'calculator' | null;
    contact: 'simple' | 'multi-step' | 'with-booking' | null;
    gallery: 'grid' | 'carousel' | 'lightbox' | null;
    blog: boolean;
    booking: boolean;
    faq: boolean;
  }>;
  requiredFields?: string[];
  defaultIntegrations?: Partial<{
    analytics: { provider: 'google' | 'plausible' | 'none'; trackingId?: string };
    crm: { provider: 'hubspot' | 'none'; portalId?: string };
    booking: { provider: 'internal' | 'calendly' | 'acuity' | 'none' };
    email: { provider: 'mailchimp' | 'sendgrid' | 'none' };
    chat: { provider: 'intercom' | 'crisp' | 'tidio' | 'none' };
    reviews: { provider: 'google' | 'yelp' | 'trustpilot' | 'none' };
    maps: { provider: 'google' | 'none' };
  }>;
}
