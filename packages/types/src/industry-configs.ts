/**
 * @file packages/types/src/industry-configs.ts
 * [TRACE:FILE=packages.types.industry-configs]
 *
 * Purpose: Map of industry slug to IndustryConfig (schemaType, defaultFeatures,
 *          requiredFields, defaultIntegrations). Used for schema.org and optional
 *          config defaults in templates.
 *
 * Relationship: Imports Industry and IndustryConfig from industry.ts; exported from
 *               packages/types. Consumed by templates or tooling that need industry defaults.
 *
 * System role: Provides getIndustryConfig(industry) for safe lookup with fallback to
 *              "general"; industryConfigs is the single source for per-industry data.
 *
 * Assumptions: Every value in the Industry union has an entry; getIndustryConfig falls
 *              back to general for unknown or future industry values.
 */

import { Industry, IndustryConfig } from './industry';

/** Per-industry config: schemaType, default features, required fields, integration presets. */
export const industryConfigs: Record<Industry, IndustryConfig> = {
  salon: {
    schemaType: 'HairSalon',
    defaultFeatures: {
      hero: 'split',
      services: 'grid',
      team: 'grid',
      testimonials: 'carousel',
      booking: true,
    },
    requiredFields: ['services', 'hours', 'team'],
    defaultIntegrations: { booking: { provider: 'internal' }, crm: { provider: 'hubspot' } },
  },
  restaurant: {
    schemaType: 'Restaurant',
    defaultFeatures: { hero: 'centered', services: 'tabs', gallery: 'carousel', booking: true },
    requiredFields: ['menu', 'hours', 'location'],
    defaultIntegrations: { booking: { provider: 'calendly' } },
  },
  'law-firm': {
    schemaType: 'LegalService',
    defaultFeatures: {
      hero: 'centered',
      services: 'list',
      testimonials: 'grid',
      contact: 'with-booking',
    },
    requiredFields: ['services', 'team'],
    defaultIntegrations: { crm: { provider: 'hubspot' } },
  },
  dental: {
    schemaType: 'Dentist',
    defaultFeatures: { hero: 'split', services: 'tabs', testimonials: 'carousel', booking: true },
    requiredFields: ['services', 'team', 'hours'],
    defaultIntegrations: { booking: { provider: 'internal' } },
  },
  medical: {
    schemaType: 'MedicalClinic',
    defaultFeatures: { hero: 'split', services: 'tabs', testimonials: 'grid', booking: true },
    requiredFields: ['services', 'team', 'hours'],
    defaultIntegrations: { booking: { provider: 'calendly' } },
  },
  fitness: {
    schemaType: 'HealthClub',
    defaultFeatures: { hero: 'video', services: 'tabs', gallery: 'carousel', booking: true },
    requiredFields: ['services', 'hours'],
    defaultIntegrations: { booking: { provider: 'internal' } },
  },
  retail: {
    schemaType: 'Store',
    defaultFeatures: { hero: 'carousel', services: 'grid', gallery: 'grid', faq: true },
    requiredFields: ['services'],
  },
  consulting: {
    schemaType: 'ProfessionalService',
    defaultFeatures: {
      hero: 'split',
      services: 'list',
      testimonials: 'grid',
      contact: 'multi-step',
    },
    requiredFields: ['services', 'team'],
  },
  realestate: {
    schemaType: 'RealEstateAgent',
    defaultFeatures: { hero: 'carousel', gallery: 'lightbox', services: 'list', faq: true },
    requiredFields: ['services', 'contact'],
  },
  construction: {
    schemaType: 'HomeAndConstructionBusiness',
    defaultFeatures: { hero: 'split', services: 'grid', testimonials: 'carousel', faq: true },
    requiredFields: ['services'],
  },
  automotive: {
    schemaType: 'AutoRepair',
    defaultFeatures: { hero: 'centered', services: 'list', testimonials: 'grid', booking: true },
    requiredFields: ['services', 'hours'],
    defaultIntegrations: { booking: { provider: 'internal' } },
  },
  general: {
    schemaType: 'LocalBusiness',
    defaultFeatures: { hero: 'centered', services: 'grid', faq: true },
    requiredFields: [],
  },
};

/**
 * Returns the IndustryConfig for the given industry. Falls back to "general" if the
 * industry key is missing (e.g. future industry or typo).
 *
 * @param industry - Industry slug from SiteConfig.industry
 * @returns IndustryConfig for that industry, or general defaults
 */
export function getIndustryConfig(industry: Industry): IndustryConfig {
  return industryConfigs[industry] ?? industryConfigs.general;
}
