---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-002
title: 'Per-tenant dynamic sitemap with large site support'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-002-dynamic-sitemap
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-002 · Per-tenant dynamic sitemap with large site support

## Objective

Implement per-tenant dynamic sitemap system following section 8.3 specification with static routes, dynamic content from CMS/DB, large site support with generateSitemaps(), proper priority and change frequency, and SEO validation for multi-tenant sitemap generation.

---

## Context

**Documentation Reference:**

- Sanity Documentation: `docs/guides/cms-content/sanity-documentation.md` ✅ COMPLETED
- Sanity Cms Draft Mode 2026: `docs/guides/cms-content/sanity-cms-draft-mode-2026.md` ✅ COMPLETED
- Sanity Schema Definition: `docs/guides/cms-content/sanity-schema-definition.md` ❌ MISSING (P1)
- Sanity Client Groq: `docs/guides/cms-content/sanity-client-groq.md` ❌ MISSING (P1)
- Blog Post Page Isr: `docs/guides/cms-content/blog-post-page-isr.md` ❌ MISSING (P1)
- Sanity Webhook Isr: `docs/guides/cms-content/sanity-webhook-isr.md` ❌ MISSING (P1)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** SEO sitemap generation — Dynamic sitemap with tenant isolation

**Related files:** Sitemap generation, CMS integration, SEO validation

**Dependencies:** Next.js sitemap API, tenant configuration, database access

**Prior work**: Basic sitemap awareness exists but lacks comprehensive dynamic generation and large site support

**Constraints:** Must follow section 8.3 specification with proper tenant isolation and large site handling

---

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Sitemap    | Next.js MetadataRoute.Sitemap API          |
| Dynamic    | CMS/DB content integration                 |
| Large Site | generateSitemaps() for 50k+ URLs           |
| SEO        | Priority and change frequency optimization |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement dynamic sitemap following section 8.3 specification
- [ ] **[Agent]** Create per-tenant sitemap with proper isolation
- [ ] **[Agent]** Add static routes with proper priorities
- [ ] **[Agent]** Implement dynamic content from CMS/DB
- [ ] **[Agent]** Add large site support with generateSitemaps()
- [ ] **[Agent]** Create sitemap validation and testing
- [ ] **[Agent]** Test sitemap generation across all content types
- [ ] **[Human]** Verify sitemap follows section 8.3 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 8.3 specification** — Extract sitemap requirements
- [ ] **[Agent]** **Create base sitemap** — Implement static routes and tenant isolation
- [ ] **[Agent]** **Add dynamic content** — Integrate CMS/DB for blog posts and services
- [ ] **[Agent]** **Implement large site support** — Add generateSitemaps() for 50k+ URLs
- [ ] **[Agent]** **Add validation** — Create sitemap validation and testing
- [ ] **[Agent]** **Test sitemap generation** — Verify all content types work correctly
- [ ] **[Agent]** **Add SEO optimization** — Optimize priorities and change frequencies

> ⚠️ **Agent Question**: Ask human before proceeding if any existing sitemap generation needs migration to new dynamic system.

---

## Commands

```bash
# Test sitemap generation
pnpm test --filter="@repo/seo"

# Test base sitemap
node -e "
import { generateSitemap } from '@repo/seo/sitemap';
const sitemap = await generateSitemap();
console.log('Generated sitemap:', sitemap);
"

# Test dynamic content
node -e "
import { generateSitemap } from '@repo/seo/sitemap';
const sitemap = await generateSitemap();
const blogUrls = sitemap.filter(url => url.url.includes('/blog/'));
console.log('Blog URLs:', blogUrls);
"

# Test large site sitemap
node -e "
import { generateSitemaps } from '@repo/seo/sitemap';
const sitemaps = await generateSitemaps();
console.log('Large site sitemaps:', sitemaps);
"

# Test sitemap validation
node -e "
import { validateSitemap } from '@repo/seo/validation';
const result = validateSitemap([
  { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 }
]);
console.log('Validation result:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Dynamic sitemap following section 8.3
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { db } from '@repo/db';
import config from '../../../../site.config';

// Google's limit: 50,000 URLs per sitemap file
// Use generateSitemaps() for sites with >50k pages
export const revalidate = 3600; // Rebuild hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.deployment.canonicalUrl;
  const tenantId = config.identity.tenantId;

  // -------------------------------------------------------------------------
  // Static routes (always present)
  // -------------------------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // -------------------------------------------------------------------------
  // Dynamic blog posts (from CMS/DB)
  // -------------------------------------------------------------------------
  const { data: posts } = await db
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // -------------------------------------------------------------------------
  // Dynamic service detail pages
  // -------------------------------------------------------------------------
  const { data: services } = await db
    .from('service_pages')
    .select('slug, updated_at')
    .eq('tenant_id', tenantId)
    .eq('status', 'published');

  const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes];
}

// ============================================================================
// LARGE SITE SUPPORT — generateSitemaps()
// For sites with > 50,000 URLs (e.g., directory-style legal/medical platforms)
// ============================================================================

export async function generateSitemaps(): Promise<MetadataRoute.Sitemap[]> {
  const baseUrl = config.deployment.canonicalUrl;
  const tenantId = config.identity.tenantId;

  // Get total content count to determine if we need multiple sitemaps
  const [{ count: postCount }] = await db
    .from('blog_posts')
    .select('count')
    .eq('tenant_id', tenantId)
    .eq('status', 'published');

  const [{ count: serviceCount }] = await db
    .from('service_pages')
    .select('count')
    .eq('tenant_id', tenantId)
    .eq('status', 'published');

  const totalDynamicContent = (postCount || 0) + (serviceCount || 0);
  const staticRouteCount = 5; // home, about, services, contact, blog

  // If total URLs < 50k, return single sitemap
  if (totalDynamicContent + staticRouteCount < 50000) {
    return [await sitemap()];
  }

  // Generate multiple sitemaps for large sites
  const sitemaps: MetadataRoute.Sitemap[] = [];
  const pageSize = 45000; // Leave buffer for static routes

  // Generate sitemap index for blog posts
  if (postCount && postCount > 0) {
    const blogSitemaps = Math.ceil(postCount / pageSize);

    for (let i = 0; i < blogSitemaps; i++) {
      const offset = i * pageSize;
      const { data: posts } = await db
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('tenant_id', tenantId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at ?? post.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

      sitemaps.push(blogRoutes);
    }
  }

  // Generate sitemap for services (usually fewer than 50k)
  if (serviceCount && serviceCount > 0) {
    const { data: services } = await db
      .from('service_pages')
      .select('slug, updated_at')
      .eq('tenant_id', tenantId)
      .eq('status', 'published');

    const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    sitemaps.push(serviceRoutes);
  }

  // Add static routes to first sitemap
  if (sitemaps.length > 0) {
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ];

    sitemaps[0] = [...staticRoutes, ...sitemaps[0]];
  }

  return sitemaps;
}

// ============================================================================
// SITEMAP VALIDATION
// ============================================================================

export function validateSitemap(sitemap: MetadataRoute.Sitemap): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for duplicate URLs
  const urls = sitemap.map((entry) => entry.url);
  const uniqueUrls = new Set(urls);
  if (urls.length !== uniqueUrls.size) {
    errors.push('Duplicate URLs found in sitemap');
  }

  // Validate URL format
  sitemap.forEach((entry, index) => {
    if (!entry.url.startsWith('https://')) {
      errors.push(`URL ${index + 1} must start with https://: ${entry.url}`);
    }

    if (entry.url.length > 2048) {
      warnings.push(`URL ${index + 1} exceeds 2048 characters: ${entry.url}`);
    }

    // Validate priority
    if (entry.priority && (entry.priority < 0 || entry.priority > 1)) {
      errors.push(
        `Invalid priority for URL ${index + 1}: ${entry.priority}. Must be between 0 and 1.`
      );
    }

    // Validate changeFrequency
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (entry.changeFrequency && !validFrequencies.includes(entry.changeFrequency)) {
      errors.push(`Invalid changeFrequency for URL ${index + 1}: ${entry.changeFrequency}`);
    }

    // Validate lastModified
    if (entry.lastModified && isNaN(entry.lastModified.getTime())) {
      errors.push(`Invalid lastModified for URL ${index + 1}: ${entry.lastModified}`);
    }
  });

  // Check sitemap size limit
  if (sitemap.length > 50000) {
    errors.push(`Sitemap exceeds 50,000 URL limit: ${sitemap.length} URLs`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SITEMAP UTILITIES
// ============================================================================

export function createSitemapEntry(
  url: string,
  options: {
    lastModified?: Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[0] {
  return {
    url,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? 'weekly',
    priority: options.priority ?? 0.5,
  };
}

export function createBlogSitemapEntries(
  posts: Array<{
    slug: string;
    published_at: string;
    updated_at?: string;
  }>,
  baseUrl: string
): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

export function createServiceSitemapEntries(
  services: Array<{
    slug: string;
    updated_at: string;
  }>,
  baseUrl: string
): MetadataRoute.Sitemap {
  return services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
}

export function getSitemapStats(sitemap: MetadataRoute.Sitemap): {
  totalUrls: number;
  staticUrls: number;
  blogUrls: number;
  serviceUrls: number;
  lastModified: Date | null;
} {
  const staticUrls = sitemap.filter(
    (url) => !url.url.includes('/blog/') && !url.url.includes('/services/')
  ).length;

  const blogUrls = sitemap.filter((url) => url.url.includes('/blog/')).length;
  const serviceUrls = sitemap.filter((url) => url.url.includes('/services/')).length;

  const lastModifiedDates = sitemap
    .map((entry) => entry.lastModified)
    .filter((date): date is Date => date instanceof Date && !isNaN(date.getTime()));

  const lastModified =
    lastModifiedDates.length > 0
      ? new Date(Math.max(...lastModifiedDates.map((date) => date.getTime())))
      : null;

  return {
    totalUrls: sitemap.length,
    staticUrls,
    blogUrls,
    serviceUrls,
    lastModified,
  };
}

// ============================================================================
// SITEMAP TESTING UTILITIES
// ============================================================================

export function createTestSitemapConfig(overrides?: {
  postCount?: number;
  serviceCount?: number;
}): {
  posts: Array<{ slug: string; published_at: string; updated_at?: string }>;
  services: Array<{ slug: string; updated_at: string }>;
} {
  const postCount = overrides?.postCount ?? 10;
  const serviceCount = overrides?.serviceCount ?? 5;

  const posts = Array.from({ length: postCount }, (_, i) => ({
    slug: `blog-post-${i + 1}`,
    published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  }));

  const services = Array.from({ length: serviceCount }, (_, i) => ({
    slug: `service-${i + 1}`,
    updated_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  return { posts, services };
}

export function expectValidSitemap(sitemap: MetadataRoute.Sitemap) {
  expect(sitemap).toBeDefined();
  expect(Array.isArray(sitemap)).toBe(true);
  expect(sitemap.length).toBeGreaterThan(0);

  // Check first entry structure
  const firstEntry = sitemap[0];
  expect(firstEntry.url).toBeTruthy();
  expect(firstEntry.url).toMatch(/^https:\/\//);
  expect(firstEntry.lastModified).toBeInstanceOf(Date);
  expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).toContain(
    firstEntry.changeFrequency
  );
  expect(firstEntry.priority).toBeGreaterThanOrEqual(0);
  expect(firstEntry.priority).toBeLessThanOrEqual(1);
}

export function expectNoDuplicateUrls(sitemap: MetadataRoute.Sitemap) {
  const urls = sitemap.map((entry) => entry.url);
  const uniqueUrls = new Set(urls);
  expect(urls.length).toBe(uniqueUrls.size);
}
```

**Sitemap generation principles:**

- **Per-tenant isolation**: Each tenant gets their own sitemap with their content
- **Dynamic content**: Automatically includes blog posts and service pages from CMS/DB
- **Large site support**: Uses generateSitemaps() for sites with 50k+ URLs
- **SEO optimization**: Proper priorities and change frequencies
- **Validation**: Comprehensive sitemap validation and testing
- **Performance**: Hourly revalidation and efficient database queries
- **Standards compliance**: Follows Google sitemap standards and limits
- **Error handling**: Graceful handling of missing or invalid data

---

## Boundaries

| Tier             | Scope                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Follow section 8.3 specification; implement per-tenant isolation; add dynamic content; support large sites; include validation |
| ⚠️ **Ask first** | Changing existing sitemap patterns; modifying database queries; updating large site handling                                   |
| 🚫 **Never**     | Skip tenant isolation; ignore Google limits; bypass validation; omit dynamic content                                           |

---

## Success Verification

- [ ] **[Agent]** Test base sitemap — Static routes generated correctly
- [ ] **[Agent]** Verify dynamic content — Blog posts and services included
- [ ] **[Agent]** Test tenant isolation — Each tenant gets their own sitemap
- [ ] **[Agent]** Verify large site support — generateSitemaps() works correctly
- [ ] **[Agent]** Test validation — Invalid sitemaps caught correctly
- [ ] **[Agent]** Test SEO optimization — Priorities and frequencies correct
- [ ] **[Agent]** Test edge cases — Missing data handled gracefully
- [ ] **[Human]** Test with real tenant data — Production sitemap works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Missing tenant data**: Handle missing tenant configuration gracefully
- **Empty content**: Handle sites with no blog posts or services
- **Large sites**: Properly split sitemaps when approaching 50k URL limit
- **Database errors**: Handle database connection issues gracefully
- **URL validation**: Ensure all URLs are properly formatted and absolute
- **Performance**: Optimize database queries for large content sets
- **Caching**: Balance revalidation frequency with performance needs

---

## Out of Scope

- Metadata generation system (handled in separate task)
- Robots.txt generation (handled in separate task)
- Structured data system (handled in separate task)
- Dynamic OG images (handled in separate task)
- CMS adapter integration (handled in separate task)
- GEO optimization layer (handled in separate task)
- A/B testing system (handled in separate task)

---

## References

- [Section 8.3 Per-Tenant Dynamic Sitemap](docs/plan/domain-8/8.3-per-tenant-dynamic-sitemap.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps)
- [Sitemap XML Protocol](https://www.sitemaps.org/protocol.html)
