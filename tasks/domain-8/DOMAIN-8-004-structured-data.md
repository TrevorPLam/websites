---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-004
title: 'Complete JSON-LD structured data system'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-004-structured-data
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-004 · Complete JSON-LD structured data system

## Objective

Implement complete JSON-LD structured data system following section 8.5 specification with schema.org types, factory functions, tenant-aware data generation, validation, and SEO optimization for multi-tenant structured data implementation.

---

## Context

**Codebase area:** SEO structured data — JSON-LD schema.org implementation

**Related files:** Structured data generation, schema validation, SEO optimization

**Dependencies**: Schema.org types, tenant configuration, validation system

**Prior work**: Basic structured data awareness exists but lacks comprehensive schema.org implementation and factory system

**Constraints:** Must follow section 8.5 specification with proper schema.org types and validation

---

## Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Schema       | Schema.org types with validation     |
| Factory      | Type-safe structured data generation |
| SEO          | Google Rich Results optimization     |
| Multi-tenant | Tenant-aware structured data         |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement structured data system following section 8.5 specification
- [ ] **[Agent]** Create schema.org type definitions with validation
- [ ] **[Agent]** Add factory functions for common schemas
- [ ] **[Agent]** Implement tenant-aware data generation
- [ ] **[Agent]** Create structured data validation and testing
- [ ] **[Agent]** Test structured data generation across all types
- [ ] **[Human]** Verify system follows section 8.5 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 8.5 specification** — Extract structured data requirements
- [ ] **[Agent]** **Create schema types** — Implement schema.org type definitions
- [ ] **[Agent]** **Add factory functions** — Create type-safe generation functions
- [ ] **[Agent]** **Implement tenant awareness** — Add tenant-specific data generation
- [ ] **[Agent]** **Add validation** — Create structured data validation and testing
- [ ] **[Agent]** **Test data generation** — Verify all schema types work correctly
- [ ] **[Agent]** **Add SEO optimization** — Optimize for Google Rich Results

> ⚠️ **Agent Question**: Ask human before proceeding if any existing structured data needs migration to new system.

---

## Commands

```bash
# Test structured data generation
pnpm test --filter="@repo/seo"

# Test local business schema
node -e "
import { buildLocalBusinessSchema } from '@repo/seo/structured-data';
const schema = buildLocalBusinessSchema({
  identity: { siteName: 'Test Law Firm' },
  address: { addressLocality: 'Test City', addressRegion: 'TX' }
});
console.log('Local business schema:', schema);
"

# Test FAQ schema
node -e "
import { buildFAQSchema } from '@repo/seo/structured-data';
const faqs = [
  { question: 'Do you offer free consultations?', answer: 'Yes, call us.' },
  { question: 'What areas do you serve?', answer: 'DFW metroplex.' }
];
const schema = buildFAQSchema(faqs);
console.log('FAQ schema:', schema);
"

# Test article schema
node -e "
import { buildArticleSchema } from '@repo/seo/structured-data';
const schema = buildArticleSchema({
  title: 'Test Article',
  description: 'Test description',
  author: { name: 'Test Author' },
  publishedAt: '2026-02-23',
  url: 'https://example.com/test'
});
console.log('Article schema:', schema);
"

# Test structured data validation
node -e "
import { validateStructuredData } from '@repo/seo/validation';
const result = validateStructuredData({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Test Business'
});
console.log('Validation result:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Complete JSON-LD structured data following section 8.5
// ============================================================================
// JSON-LD STRUCTURED DATA LIBRARY
// All types derived from schema.org (validated via Google Rich Results Test)
// GEO note: schema.org provides 3× likelihood of AI Overview citation [web:243]
// ============================================================================

export type LocalBusinessSchema = {
  '@context': 'https://schema.org';
  '@type': string | string[];
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  image?: string[];
  priceRange?: string;
  servesCuisine?: string; // Restaurant only
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: Array<{
      '@type': 'Offer';
      itemOffered: { '@type': 'Service'; name: string };
    }>;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
  sameAs?: string[]; // Social profiles
};

export type FAQSchema = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

export type BreadcrumbSchema = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export type ArticleSchema = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  author: { '@type': 'Person' | 'Organization'; name: string; url?: string };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: { '@type': 'ImageObject'; url: string };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
};

export type ServiceSchema = {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  areaServed?: string;
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: Array<{
      '@type': 'Offer';
      itemOffered: { '@type': 'Service'; name: string };
    }>;
  };
  review?: {
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: number;
    };
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewBody: string;
    datePublished: string;
  };
};

export type ReviewSchema = {
  '@context': 'https://schema.org';
  '@type': 'Review';
  itemReviewed: {
    '@type': 'Organization';
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
  };
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewBody: string;
  datePublished: string;
};

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

import type { SiteConfig } from '@repo/config-schema';

export function buildLocalBusinessSchema(config: SiteConfig): LocalBusinessSchema {
  const {
    identity: { siteName, tagline, contact, address, reviewSummary },
    seo: seoConfig,
    assets: { logo },
  } = config;

  const baseUrl = config.deployment.canonicalUrl;

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': determineBusinessType(config.identity.industry ?? 'professional-services'),
    name: siteName,
    description: seoConfig?.metaDescription ?? tagline,
    url: baseUrl,
    ...(contact?.phone && { telephone: contact.phone }),
    ...(contact?.email && { email: contact.email }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        postalCode: address.postalCode,
        addressCountry: address.addressCountry,
      },
    }),
    ...(address?.latitude &&
      address?.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: address.latitude,
          longitude: address.longitude,
        },
      }),
    ...(logo && { image: [logo] }),
    priceRange: determinePriceRange(config.identity.industry),
    ...(reviewSummary && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewSummary.average.toString(),
        reviewCount: reviewSummary.count.toString(),
      },
    }),
    sameAs: config.seo?.socialProfiles ?? [],
  };

  return schema;
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

export function buildArticleSchema(
  article: {
    title: string;
    description: string;
    slug: string;
    author?: string;
    publishedAt: string;
    updatedAt?: string;
    image?: string;
  },
  config: SiteConfig
): ArticleSchema {
  const baseUrl = config.deployment.canonicalUrl;
  const { identity } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ?? config.assets.ogImage,
    author: {
      '@type': 'Person',
      name: article.author ?? identity.siteName,
      ...(article.author && {
        url: `${baseUrl}/author/${article.author.toLowerCase().replace(/\s+/g, '-')}`,
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: identity.siteName,
      logo: {
        '@type': 'ImageObject',
        url: config.assets.logo ?? `${baseUrl}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.slug}`,
    },
  };
}

export function buildServiceSchema(
  service: {
    name: string;
    description: string;
    slug: string;
    price?: string;
    reviewCount?: number;
    averageRating?: number;
  },
  config: SiteConfig
): ServiceSchema {
  const baseUrl = config.deployment.canonicalUrl;
  const { identity } = config;

  const schema: ServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: identity.siteName,
      url: baseUrl,
    },
    areaServed: `${config.identity.address?.addressLocality}, ${config.identity.address?.addressRegion}`,
    ...(service.price && { priceRange: service.price }),
    ...(service.reviewCount &&
      service.averageRating && {
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: service.averageRating,
            bestRating: 5,
          },
          author: {
            '@type': 'Person',
            name: identity.siteName,
          },
          reviewBody: `${service.reviewCount} reviews with an average rating of ${service.averageRating} stars`,
          datePublished: new Date().toISOString(),
        },
      }),
  };

  return schema;
}

export function buildReviewSchema(
  review: {
    rating: number;
    body: string;
    author: string;
    date: string;
  },
  config: SiteConfig
): ReviewSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: config.identity.siteName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: stripHtml(review.body),
    datePublished: review.date,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function determineBusinessType(industry?: string): string | string[] {
  const businessTypes: Record<string, string | string[]> = {
    legal: 'LegalService',
    medical: 'MedicalClinic',
    dental: 'Dentist',
    restaurant: 'Restaurant',
    'home-services': 'HomeAndConstructionBusinessService',
    consulting: 'ProfessionalService',
    'real-estate': 'RealEstateAgent',
    automotive: 'AutoRepair',
    beauty: 'HairSalon',
    fitness: 'HealthClub',
    education: 'EducationalOrganization',
    technology: 'ComputerStore',
  };

  return businessTypes[industry?.toLowerCase()] ?? 'ProfessionalService';
}

function determinePriceRange(industry?: string): string {
  const priceRanges: Record<string, string> = {
    legal: '$$$',
    medical: '$$$',
    dental: '$$$',
    restaurant: '$$',
    'home-services': '$$',
    consulting: '$$$',
    'real-estate': '$$$',
    automotive: '$$',
    beauty: '$',
    fitness: '$$',
    education: '$$',
    technology: '$$',
  };

  return priceRanges[industry?.toLowerCase()] ?? '$$';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// ============================================================================
// STRUCTURED DATA VALIDATION
// ============================================================================

export function validateStructuredData(schema: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!schema['@context']) {
    errors.push('@context is required');
  } else if (schema['@context'] !== 'https://schema.org') {
    errors.push('@context must be "https://schema.org"');
  }

  if (!schema['@type']) {
    errors.push('@type is required');
  }

  // Validate specific schema types
  if (schema['@type'] === 'LocalBusiness') {
    const localBusiness = schema as LocalBusinessSchema;

    if (!localBusiness.name) {
      errors.push('LocalBusiness: name is required');
    }

    if (!localBusiness.url) {
      errors.push('LocalBusiness: url is required');
    }

    if (localBusiness.address && !localBusiness.address.addressLocality) {
      errors.push('LocalBusiness: address.addressLocality is required');
    }

    if (localBusiness.aggregateRating) {
      const rating = parseFloat(localBusiness.aggregateRating.ratingValue);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        errors.push('LocalBusiness: aggregateRating.ratingValue must be between 0 and 5');
      }

      const count = parseInt(localBusiness.aggregateRating.reviewCount);
      if (isNaN(count) || count < 0) {
        errors.push('LocalBusiness: aggregateRating.reviewCount must be a positive integer');
      }
    }
  }

  if (schema['@type'] === 'FAQPage') {
    const faq = schema as FAQSchema;

    if (!faq.mainEntity || !Array.isArray(faq.mainEntity)) {
      errors.push('FAQPage: mainEntity array is required');
    } else {
      faq.mainEntity.forEach((item, index) => {
        if (!item.name) {
          errors.push(`FAQPage: Question ${index + 1}: name is required`);
        }
        if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
          errors.push(`FAQPage: Question ${index + 1}: acceptedAnswer.text is required`);
        }
      });
    }
  }

  // Check for HTML in text fields (Google strips HTML)
  const textFields = ['description', 'reviewBody'];
  textFields.forEach((field) => {
    if (schema[field] && typeof schema[field] === 'string' && schema[field].includes('<')) {
      warnings.push(`${field} contains HTML - Google will strip it`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// STRUCTURED DATA GENERATION HELPERS
// ============================================================================

export function generateStructuredDataForPage(
  pageType: 'home' | 'about' | 'services' | 'contact' | 'blog' | 'blog-post' | 'service-detail',
  config: SiteConfig,
  data?: any
): any {
  switch (pageType) {
    case 'home':
    case 'about':
    case 'contact':
      return buildLocalBusinessSchema(config);

    case 'services':
      return buildLocalBusinessSchema(config);

    case 'blog':
      return buildLocalBusinessSchema(config);

    case 'blog-post':
      if (!data) return null;
      return buildArticleSchema(data, config);

    case 'service-detail':
      if (!data) return null;
      return buildServiceSchema(data, config);

    default:
      return null;
  }
}

export function generateStructuredDataForCollection(
  collectionType: 'faqs' | 'reviews' | 'breadcrumbs',
  items: any[],
  config?: SiteConfig
): any {
  switch (collectionType) {
    case 'faqs':
      return buildFAQSchema(items);

    case 'reviews':
      if (!config) return null;
      return items.map((review: any) => buildReviewSchema(review, config));

    case 'breadcrumbs':
      return buildBreadcrumbSchema(items);

    default:
      return null;
  }
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

export function createTestStructuredDataConfig(overrides?: Partial<SiteConfig>): SiteConfig {
  return {
    identity: {
      siteName: 'Test Law Firm',
      tagline: 'Expert Legal Services',
      contact: {
        phone: '(555) 123-4567',
        email: 'info@testlaw.com',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'Test City',
          addressRegion: 'TX',
          postalCode: '75001',
          addressCountry: 'US',
        },
      },
      reviewSummary: {
        average: 4.8,
        count: 127,
      },
      industry: 'legal',
    },
    seo: {
      metaDescription: 'Test law firm providing expert legal services',
      keywords: ['law firm', 'legal services', 'attorney'],
      socialProfiles: [
        'https://facebook.com/testlaw',
        'https://twitter.com/testlaw',
        'https://linkedin.com/company/testlaw',
      ],
    },
    theme: {
      colors: {
        primary: '#1a1a2e',
        accent: '#16213e',
      },
      fontFamily: 'Inter',
    },
    assets: {
      favicon: '/favicon.ico',
      logo: '/logo.png',
      ogImage: '/og-default.jpg',
    },
    deployment: {
      canonicalUrl: 'https://testlaw.com',
    },
    ...overrides,
  };
}

export function expectValidStructuredData(schema: any) {
  expect(schema).toBeDefined();
  expect(schema['@context']).toBe('https://schema.org');
  expect(schema['@type']).toBeTruthy();

  const validation = validateStructuredData(schema);
  expect(validation.valid).toBe(true);
  expect(validation.errors).toHaveLength(0);
}

export function expectValidLocalBusinessSchema(schema: LocalBusinessSchema) {
  expect(schema['@context']).toBe('https://schema.org');
  expect(schema['@type']).toBe('LegalService');
  expect(schema.name).toBeTruthy();
  expect(schema.url).toBeTruthy();
  expect(schema.address?.addressLocality).toBeTruthy();
}

export function expectValidFAQSchema(schema: FAQSchema) {
  expect(schema['@context']).toBe('https://schema.org');
  expect(schema['@type']).toBe('FAQPage');
  expect(schema.mainEntity).toBeInstanceOf(Array);
  expect(schema.mainEntity.length).toBeGreaterThan(0);

  const firstItem = schema.mainEntity[0];
  expect(firstItem['@type']).toBe('Question');
  expect(firstItem.name).toBeTruthy();
  expect(firstItem.acceptedAnswer['@type']).toBe('Answer');
  expect(firstItem.acceptedAnswer.text).toBeTruthy();
}
```

**Structured data principles:**

- **Schema.org compliance**: All types derived from schema.org with validation
- **Type safety**: Full TypeScript support with proper typing
- **Factory functions**: Type-safe generation functions for common schemas
- **Tenant awareness**: Tenant-specific data generation with branding
- **Validation**: Comprehensive validation with error and warning reporting
- **SEO optimization**: Optimized for Google Rich Results
- **GEO support**: Enhanced for AI engine optimization
- **Industry detection**: Automatic business type detection based on industry

---

## Boundaries

| Tier             | Scope                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 8.5 specification; implement schema.org types; add factory functions; include validation; support tenant awareness |
| ⚠️ **Ask first** | Changing existing structured data patterns; modifying schema types; updating validation                                           |
| 🚫 **Never**     | Skip schema.org compliance; ignore validation; bypass type safety; omit tenant awareness                                          |

---

## Success Verification

- [ ] **[Agent]** Test local business schema — Local business data generated correctly
- [ ] **[Agent]** Verify FAQ schema — FAQ data structured properly
- [ ] **[Agent]** Test article schema — Article metadata works correctly
- [ ] **[Agent]** Verify tenant awareness — Tenant branding applied correctly
- [ ] **[Agent]** Test validation — Invalid data caught correctly
- [ ] **[Agent]** Test utility functions — Helper functions work correctly
- [ ] **[Agent]** Test edge cases — Missing data handled gracefully
- [ ] **[Human]** Test with real tenant data — Production structured data works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Missing tenant data**: Handle missing tenant configuration gracefully
- **Invalid addresses**: Handle incomplete address information
- **HTML in text**: Strip HTML from text fields (Google strips it anyway)
- **Invalid ratings**: Handle invalid rating values gracefully
- **Empty collections**: Handle empty FAQ or review arrays
- **Missing URLs**: Handle missing canonical URLs gracefully
- **Industry detection**: Default to ProfessionalService for unknown industries
- **Social profiles**: Handle missing social profile arrays gracefully

---

## Out of Scope

- Metadata generation system (handled in separate task)
- Dynamic sitemap generation (handled in separate task)
- Robots.txt generation (handled in separate task)
- Dynamic OG images (handled in separate task)
- CMS adapter integration (handled in separate task)
- GEO optimization layer (handled in separate task)
- A/B testing system (handled in separate task)

---

## References

- [Section 8.5 Complete JSON-LD Structured Data System](docs/plan/domain-8/8.5-complete-json-ld-structured-data-system.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/search/rich-results-test/)
- [JSON-LD Specification](https://json-ld.org/)
- [Structured Data Best Practices](https://developers.google.com/search/docs/guides/introduction/structured-data)
