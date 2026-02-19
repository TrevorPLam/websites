/**
 * @file packages/industry-schemas/src/index.ts
 * Task: [4.6] Industry JSON-LD generators
 *
 * Purpose: Generate valid schema.org JSON-LD from SiteConfig and industry config.
 * Limit 12 industries (per task); uses existing Industry and getIndustryConfig from @repo/types.
 */

import type { SiteConfig, IndustryConfig } from '@repo/types';
import { getIndustryConfig } from '@repo/types';

/**
 * Generates Organization/LocalBusiness JSON-LD string from site config and industry.
 * Uses industry's schemaType (e.g. HairSalon, Restaurant); falls back to general when unknown.
 *
 * @param siteConfig - Template site config
 * @param industryConfig - Optional; if omitted, uses getIndustryConfig(siteConfig.industry)
 * @returns JSON-LD string (pretty-printed)
 */
export function generateOrganizationJsonLd(
  siteConfig: SiteConfig,
  industryConfig?: IndustryConfig
): string {
  const config = industryConfig ?? getIndustryConfig(siteConfig.industry);
  const schemaType = siteConfig.seo?.schemaType ?? config.schemaType;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  };

  if (siteConfig.seo?.ogImage) {
    schema.image = siteConfig.seo.ogImage;
  }

  if (siteConfig.contact?.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: siteConfig.contact.address.country,
    };
  }

  if (siteConfig.contact?.email || siteConfig.contact?.phone) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...(siteConfig.contact.email && { email: siteConfig.contact.email }),
      ...(siteConfig.contact.phone && { telephone: siteConfig.contact.phone }),
    };
  }

  if (siteConfig.contact?.hours?.length) {
    schema.openingHoursSpecification = siteConfig.contact.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.label,
      opens: '00:00',
      closes: '23:59',
    }));
  }

  return JSON.stringify(schema, null, 2);
}

export { getIndustryConfig };
