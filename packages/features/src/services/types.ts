// File: packages/features/src/services/types.ts  [TRACE:FILE=packages.features.services.types]
// Purpose: Shared type definitions for the services feature. Enables cross-industry
//          configurability and structured data generation for service pages.
//
// Relationship: Imports AccordionItem from @repo/ui. Used by ServicesOverview, ServiceDetailLayout, template config.
// System role: Type-only; ProcessStep, ServicePricingTier align with Schema.org and UI components.
// Assumptions: Template builds arrays matching ServiceOverviewItem and ServiceDetailProps.
//
// Exports / Entry: ServiceOverviewItem, ProcessStep, ServiceDetailProps, ServicePricingTier
// Used by: ServicesOverview, ServiceDetailLayout, template service pages
//
// Invariants:
// - All types must support multiple industries (salon, restaurant, law-firm, etc.)
// - AccordionItem compatibility with @repo/ui Accordion component
// - Structured data fields aligned with Schema.org Service type
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Type-safe service configuration
// - [FEAT:SEO] Structured data schema alignment
// - [FEAT:CONFIGURATION] Cross-industry service taxonomy

import type { LucideIcon } from 'lucide-react';
import type { AccordionItem } from '@repo/ui';

/**
 * Process step displayed in the "Our Process" section of a service detail page.
 */
export interface ProcessStep {
  /** Step title (e.g. "Consultation") */
  title: string;
  /** Step description */
  description: string;
}

/**
 * Pricing tier for a service, linking to pricing page or booking.
 */
export interface ServicePricingTier {
  /** Tier name (e.g. "Women", "Men", "Root Touch-up") */
  tier: string;
  /** Short description of what's included */
  description: string;
  /** Route or full URL for "Learn More" CTA */
  href: string;
}

/**
 * Service overview card item for the homepage or services landing grid.
 * Icon is a Lucide component reference for render-time usage.
 */
export interface ServiceOverviewItem {
  /** Lucide icon component for the service category */
  icon: LucideIcon;
  /** Display title */
  title: string;
  /** Short description for the card */
  description: string;
  /** Route to service detail page (e.g. /services/haircuts) */
  href: string;
}

/**
 * Props for the ServicesOverview component.
 * Services data is provided by the template from site config or services config.
 */
export interface ServicesOverviewProps {
  /** List of service categories to display */
  services: ServiceOverviewItem[];
  /** Section heading (default: "Our Services") */
  heading?: string;
  /** Section subheading/description */
  subheading?: string;
}

/**
 * Props for ServiceDetailLayout.
 * All content is passed in; no direct site config or env imports.
 */
export interface ServiceDetailProps {
  /** Lucide icon component for the service */
  icon: LucideIcon;
  /** Service title (h1 and structured data) */
  title: string;
  /** Hero description */
  description: string;
  /** What's included list */
  included: string[];
  /** Process steps */
  process: ProcessStep[];
  /** Target audience / who it's for */
  whoItsFor: string[];
  /** Pricing tiers with CTAs */
  pricing: ServicePricingTier[];
  /** FAQ items (compatible with Accordion) */
  faqs: AccordionItem[];
  /** Service slug for structured data URL (e.g. "haircuts") */
  serviceSlug?: string;
  /** Site/organization name for Schema.org provider */
  siteName: string;
  /** Base URL (no trailing slash) for structured data URLs */
  baseUrl: string;
  /** Contact route for CTAs (default: "/contact") */
  contactHref?: string;
  /** CTA button label (default: "Get Started") */
  ctaLabel?: string;
  /** Final CTA section heading (default: "Ready to Get Started?") */
  finalCtaHeading?: string;
  /** Final CTA description */
  finalCtaDescription?: string;
  /** Final CTA button label (default: "Schedule Free Consultation") */
  finalCtaButtonLabel?: string;
}
