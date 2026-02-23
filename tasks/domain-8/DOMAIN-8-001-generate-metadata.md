---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-001
title: 'Complete generateMetadata system with SEO factory'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-001-generate-metadata
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-001 · Complete generateMetadata system with SEO factory

## Objective

Implement complete generateMetadata system following section 8.2 specification with SEO factory pattern, type-safe metadata generation, page-specific defaults, and tenant-aware metadata management for multi-tenant SEO optimization.

---

## Context

**Codebase area:** SEO metadata generation — Type-safe metadata factory

**Related files:** Metadata generation, SEO utilities, tenant configuration

**Dependencies:** Next.js 16 metadata API, tenant configuration system, SEO validation

**Prior work**: Basic metadata awareness exists but lacks comprehensive factory system and type safety

**Constraints:** Must follow section 8.2 specification with proper SEO patterns and tenant awareness

---

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Metadata     | Next.js 16 generateMetadata API  |
| SEO          | Type-safe metadata factory       |
| Validation   | SEO validation and testing       |
| Multi-tenant | Tenant-aware metadata generation |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement generateMetadata system following section 8.2 specification
- [ ] **[Agent]** Create SEO factory with type-safe metadata generation
- [ ] **[Agent]** Add page-specific metadata defaults and overrides
- [ ] **[Agent]** Implement tenant-aware metadata with branding
- [ ] **[Agent]** Create metadata validation and testing
- [ ] **[Agent]** Add OpenGraph and Twitter Card support
- [ ] **[Agent]** Test metadata generation across all page types
- [ ] **[Human]** Verify system follows section 8.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 8.2 specification** — Extract metadata requirements
- [ ] **[Agent]** **Create SEO factory** — Implement type-safe metadata generation
- [ ] **[Agent]** **Add page defaults** — Create page-specific metadata patterns
- [ ] **[Agent]** **Implement tenant awareness** — Add tenant branding and configuration
- [ ] **[Agent]** **Add validation** — Create metadata validation and testing
- [ ] **[Agent]** **Test metadata generation** — Verify all page types work correctly
- [ ] **[Agent]** **Add OpenGraph support** — Implement social media metadata

> ⚠️ **Agent Question**: Ask human before proceeding if any existing metadata generation needs migration to new factory system.

---

## Commands

```bash
# Test metadata generation
pnpm test --filter="@repo/seo"

# Test SEO factory
node -e "
import { generateTenantMetadata } from '@repo/seo/generate-metadata';
const metadata = generateTenantMetadata({
  tenantConfig: { identity: { siteName: 'Test Site' } },
  page: 'home',
});
console.log('Generated metadata:', metadata);
"

# Test page-specific overrides
node -e "
import { generateTenantMetadata } from '@repo/seo/generate-metadata';
const metadata = generateTenantMetadata({
  tenantConfig: { identity: { siteName: 'Test Site' } },
  page: 'blog-post',
  override: { title: 'Custom Title', description: 'Custom Description' },
});
console.log('Override metadata:', metadata);
"

# Test tenant branding
node -e "
import { generateTenantMetadata } from '@repo/seo/generate-metadata';
const metadata = generateTenantMetadata({
  tenantConfig: {
    identity: { siteName: 'Test Site', tagline: 'Test Tagline' },
    theme: { colors: { primary: '#1a1a2e' } },
    assets: { ogImage: '/og-image.jpg' }
  },
  page: 'home',
});
console.log('Branded metadata:', metadata);
"

# Test metadata validation
node -e "
import { validateMetadata } from '@repo/seo/validation';
const result = validateMetadata({
  title: 'Test Title',
  description: 'Test Description',
});
console.log('Validation result:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Complete generateMetadata system following section 8.2
import type { Metadata } from 'next';
import type { SiteConfig } from '@repo/config-schema';

// ============================================================================
// METADATA FACTORY
// Generates type-safe Next.js 16 Metadata for every page type.
// Usage: import { generateTenantMetadata } from '@repo/seo';
// ============================================================================

export type PageMetadataInput = {
  tenantConfig: SiteConfig;
  page: 'home' | 'about' | 'services' | 'contact' | 'blog' | 'blog-post' | 'service-detail';
  override?: Partial<{
    title: string;
    description: string;
    image: string;
    canonical: string;
    noIndex: boolean;
    publishedAt: string;
    updatedAt: string;
    author: string;
    keywords: string[];
  }>;
};

export function generateTenantMetadata(input: PageMetadataInput): Metadata {
  const { tenantConfig, page, override = {} } = input;

  const {
    identity: { siteName, tagline, contact, address },
    seo: seoConfig,
    assets: { favicon, ogImage },
  } = tenantConfig;

  const baseUrl = tenantConfig.deployment.canonicalUrl;

  // -------------------------------------------------------------------------
  // Page-level defaults
  // -------------------------------------------------------------------------
  const defaults: Record<typeof page, { title: string; description: string; path: string }> = {
    home: {
      title: `${siteName} — ${tagline}`,
      description:
        seoConfig?.metaDescription ??
        `${siteName}. ${tagline}. Serving ${address?.city}, ${address?.state}.`,
      path: '/',
    },
    about: {
      title: `About Us — ${siteName}`,
      description: `Learn about ${siteName}, our team, and our mission serving ${address?.city}.`,
      path: '/about',
    },
    services: {
      title: `Services — ${siteName}`,
      description: `Explore the full range of services offered by ${siteName} in ${address?.city}, ${address?.state}.`,
      path: '/services',
    },
    contact: {
      title: `Contact ${siteName} — ${address?.city}, ${address?.state}`,
      description: `Get in touch with ${siteName}. Call ${contact?.phone ?? ''} or fill out our contact form.`,
      path: '/contact',
    },
    blog: {
      title: `Blog & Resources — ${siteName}`,
      description: `Expert tips and insights from ${siteName} in ${address?.city}.`,
      path: '/blog',
    },
    'blog-post': {
      title: override.title ?? siteName,
      description: override.description ?? tagline,
      path: override.canonical ?? '/blog',
    },
    'service-detail': {
      title: override.title ?? `Services — ${siteName}`,
      description: override.description ?? `Professional services from ${siteName}.`,
      path: override.canonical ?? '/services',
    },
  };

  const pageDefaults = defaults[page];
  const title = override.title ?? pageDefaults.title;
  const description = override.description ?? pageDefaults.description;
  const canonicalUrl = override.canonical ?? `${baseUrl}${pageDefaults.path}`;
  const ogImageUrl =
    override.image ?? ogImage ?? `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    // -------------------------------------------------------------------------
    // Core
    // -------------------------------------------------------------------------
    title,
    description,

    // Template: appended to all child pages automatically
    // Only set at root layout level; override.title replaces entirely on specific pages
    ...(page === 'blog-post' && {
      authors: [{ name: override.author ?? siteName }],
      publishedTime: override.publishedAt ? new Date(override.publishedAt) : undefined,
      modifiedTime: override.updatedAt ? new Date(override.updatedAt) : undefined,
    }),

    // -------------------------------------------------------------------------
    // SEO
    // -------------------------------------------------------------------------
    metadataBase: {
      title,
      description,
      keywords: override.keywords ?? seoConfig?.keywords ?? [],
      authors: [{ name: siteName }],
      creator: siteName,
      publisher: siteName,
      formatDetection: {
        email: true,
        address: true,
        telephone: true,
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: canonicalUrl,
        title,
        description,
        siteName,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
        creator: siteName,
        site: siteName,
      },
      robots: {
        index: !override.noIndex,
        follow: true,
        googleBot: {
          index: !override.noIndex,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
    },

    // -------------------------------------------------------------------------
    // Verification & Business Info
    // -------------------------------------------------------------------------
    verification: {
      google: 'site-verification-code',
      yandex: 'yandex-verification-code',
    },
    ...(address && {
      other: {
        'business:contact_data:street_address': `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}`,
        'business:contact_data:locality': address.addressLocality,
        'business:contact_data:region': address.addressRegion,
        'business:contact_data:postal_code': address.postalCode,
        'business:contact_data:country_name': address.addressCountry,
      },
    }),
    ...(contact?.phone && {
      other: {
        'business:contact_data:phone_number': contact.phone,
      },
    }),
    ...(contact?.email && {
      other: {
        'business:contact_data:email': contact.email,
      },
    }),

    // -------------------------------------------------------------------------
    // Icons
    // -------------------------------------------------------------------------
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
}

// ============================================================================
// METADATA VALIDATION
// ============================================================================

export function validateMetadata(metadata: Partial<Metadata>): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!metadata.title) {
    errors.push('Title is required');
  } else if (metadata.title.length > 60) {
    warnings.push('Title should be 60 characters or less for optimal SEO');
  }

  // Description validation
  if (!metadata.description) {
    errors.push('Description is required');
  } else if (metadata.description.length > 160) {
    warnings.push('Description should be 160 characters or less for optimal SEO');
  }

  // Canonical URL validation
  if (metadata.metadataBase?.canonical && !metadata.metadataBase.canonical.startsWith('https://')) {
    errors.push('Canonical URL must start with https://');
  }

  // OpenGraph validation
  const og = metadata.metadataBase?.openGraph;
  if (og) {
    if (!og.type) warnings.push('OpenGraph type should be specified');
    if (!og.url) warnings.push('OpenGraph URL should be specified');
    if (!og.title) warnings.push('OpenGraph title should be specified');
    if (!og.description) warnings.push('OpenGraph description should be specified');
    if (!og.images || og.images.length === 0) {
      warnings.push('OpenGraph images should be specified for better social sharing');
    }
  }

  // Twitter Card validation
  const twitter = metadata.metadataBase?.twitter;
  if (twitter) {
    if (!twitter.card) warnings.push('Twitter card type should be specified');
    if (!twitter.title) warnings.push('Twitter title should be specified');
    if (!twitter.description) warnings.push('Twitter description should be specified');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// METADATA UTILITIES
// ============================================================================

export function createPageMetadata(
  tenantConfig: SiteConfig,
  page: PageMetadataInput['page'],
  options?: PageMetadataInput['override']
): Metadata {
  return generateTenantMetadata({
    tenantConfig,
    page,
    override: options,
  });
}

export function createBlogPostMetadata(
  tenantConfig: SiteConfig,
  options: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    updatedAt?: string;
    author?: string;
    keywords?: string[];
    image?: string;
  }
): Metadata {
  return generateTenantMetadata({
    tenantConfig,
    page: 'blog-post',
    override: {
      title: options.title,
      description: options.description,
      canonical: `${tenantConfig.deployment.canonicalUrl}/blog/${options.slug}`,
      publishedAt: options.publishedAt,
      updatedAt: options.updatedAt,
      author: options.author,
      keywords: options.keywords,
      image: options.image,
    },
  });
}

export function createServiceDetailMetadata(
  tenantConfig: SiteConfig,
  options: {
    title: string;
    description: string;
    slug: string;
    keywords?: string[];
    image?: string;
  }
): Metadata {
  return generateTenantMetadata({
    tenantConfig,
    page: 'service-detail',
    override: {
      title: options.title,
      description: options.description,
      canonical: `${tenantConfig.deployment.canonicalUrl}/services/${options.slug}`,
      keywords: options.keywords,
      image: options.image,
    },
  });
}

export function generateSocialMetadata(
  tenantConfig: SiteConfig,
  options: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }
): {
  openGraph: Record<string, any>;
  twitter: Record<string, any>;
} {
  const baseUrl = tenantConfig.deployment.canonicalUrl;
  const { assets, identity } = tenantConfig;

  return {
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: options.url ?? baseUrl,
      title: options.title,
      description: options.description,
      siteName: identity.siteName,
      images: [
        {
          url:
            options.image ??
            assets.ogImage ??
            `${baseUrl}/og?title=${encodeURIComponent(options.title)}`,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [
        options.image ??
          assets.ogImage ??
          `${baseUrl}/og?title=${encodeURIComponent(options.title)}`,
      ],
      creator: identity.siteName,
      site: identity.siteName,
    },
  };
}

// ============================================================================
// METADATA HOOKS
// ============================================================================

export function usePageMetadata(page: PageMetadataInput['page']) {
  // Client-side hook for page metadata
  return null; // Implementation depends on client-side context
}

export function useBlogPostMetadata(options: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
  image?: string;
}) {
  // Client-side hook for blog post metadata
  return null; // Implementation depends on client-side context
}

// ============================================================================
// METADATA TESTING UTILITIES
// ============================================================================

export function createTestMetadataConfig(overrides?: Partial<SiteConfig>): SiteConfig {
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
    },
    seo: {
      metaDescription: 'Test law firm providing expert legal services',
      keywords: ['law firm', 'legal services', 'attorney'],
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
      ogImage: '/og-default.jpg',
    },
    deployment: {
      canonicalUrl: 'https://testlaw.com',
    },
    ...overrides,
  };
}

export function expectValidMetadata(metadata: Metadata) {
  expect(metadata).toBeDefined();
  expect(metadata.title).toBeTruthy();
  expect(metadata.description).toBeTruthy();
  expect(metadata.metadataBase?.canonical).toBeTruthy();
  expect(metadata.metadataBase?.openGraph).toBeDefined();
  expect(metadata.metadataBase?.twitter).toBeDefined();
}
```

**Metadata generation principles:**

- **Type safety**: Full TypeScript support with proper typing
- **SEO factory**: Centralized metadata generation with consistent patterns
- **Page defaults**: Smart defaults for each page type
- **Tenant awareness**: Tenant branding and configuration integration
- **Validation**: Comprehensive metadata validation and testing
- **Social media**: OpenGraph and Twitter Card support
- **Verification**: Business verification and contact data
- **Utilities**: Helper functions for common metadata patterns

---

## Boundaries

| Tier             | Scope                                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 8.2 specification; implement type-safe generation; add page defaults; support tenant branding; include validation |
| ⚠️ **Ask first** | Changing existing metadata patterns; modifying SEO validation; updating tenant configuration                                     |
| 🚫 **Never**     | Skip type safety; ignore validation; break tenant awareness; omit social media metadata                                          |

---

## Success Verification

- [ ] **[Agent]** Test metadata factory — All page types generate correctly
- [ ] **[Agent]** Verify tenant awareness — Branding applied correctly
- [ ] **[Agent]** Test page overrides — Custom metadata works properly
- [ ] **[Agent]** Verify validation — Invalid metadata caught correctly
- [ ] **[Agent]** Test social media — OpenGraph and Twitter cards work
- [ ] **[Agent]** Test utilities — Helper functions work correctly
- [ ] **[Agent]** Test edge cases — Missing data handled gracefully
- [ ] **[Human]** Test with real tenant configs — Production metadata works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Missing tenant data**: Handle missing tenant configuration gracefully
- **Invalid URLs**: Ensure canonical URLs are properly formatted
- **Length limits**: Warn about title/description length limits
- **Image URLs**: Handle missing or invalid image URLs gracefully
- **Social media**: Ensure OpenGraph and Twitter cards have required fields
- **Validation**: Balance validation warnings vs errors appropriately
- **Type safety**: Ensure all metadata properties are properly typed

---

## Out of Scope

- Dynamic sitemap generation (handled in separate task)
- Robots.txt generation (handled in separate task)
- Structured data system (handled in separate task)
- Dynamic OG images (handled in separate task)
- CMS adapter integration (handled in separate task)
- GEO optimization layer (handled in separate task)
- A/B testing system (handled in separate task)

---

## References

- [Section 8.2 Complete generateMetadata System](docs/plan/domain-8/8.2-complete-generatemetadata-system.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [SEO Best Practices 2026](https://developers.google.com/search/docs/fundamentals/seo/)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview)
