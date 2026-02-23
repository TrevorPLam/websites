---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-005
title: 'Dynamic OG images with edge runtime'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-005-dynamic-og-images
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-005 · Dynamic OG images with edge runtime

## Objective

Implement dynamic OG images system following section 8.6 specification with edge runtime, tenant branding, page type badges, logo integration, and caching for multi-tenant social media optimization.

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

**Codebase area:** SEO OG images — Dynamic social media image generation

**Related files:** OG image generation, edge runtime, tenant branding

**Dependencies**: Next.js ImageResponse, edge runtime, tenant configuration, caching

**Prior work**: Basic OG awareness exists but lacks comprehensive dynamic generation and edge runtime

**Constraints:** Must follow section 8.6 specification with proper edge runtime and tenant branding

---

## Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| OG Images | Next.js ImageResponse API            |
| Runtime   | Edge runtime for global distribution |
| Branding  | Tenant-specific colors and logos     |
| Caching   | Aggressive caching (24 hours)        |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement dynamic OG images following section 8.6 specification
- [ ] **[Agent]** Create edge runtime with global distribution
- [ ] **[Agent]** Add tenant branding with colors and logos
- [ ] **[Agent]** Implement page type badges and styling
- [ ] **[Agent]** Create caching and optimization
- [ ] **[Agent]** Test OG image generation across all types
- [ ] **[Human]** Verify system follows section 8.6 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 8.6 specification** — Extract OG image requirements
- [ ] **[Agent]** **Create edge runtime** — Implement global distribution with edge
- [ ] **[Agent]** **Add tenant branding** — Implement colors, logos, and fonts
- [ ] **[Agent]** **Implement page types** — Add badges and styling for different pages
- [ ] **[Agent]** **Add caching** — Implement aggressive caching and optimization
- [ ] **[Agent]** **Test image generation** — Verify all page types work correctly
- [ ] **[Agent]** **Add performance optimization** — Optimize for edge runtime

> ⚠️ **Agent Question**: Ask human before proceeding if any existing OG image generation needs migration to new system.

---

## Commands

```bash
# Test OG image generation
pnpm test --filter="@repo/seo"

# Test basic OG image
curl "http://localhost:3000/og?title=Test%20Title"

# Test tenant-branded OG image
curl "http://localhost:3000/og?title=Test%20Title&tenant=tenant-123"

# Test page type badges
curl "http://localhost:3000/og?title=Test%20Title&type=blog"

# Test subtitle and branding
curl "http://localhost:3000/og?title=Test%20Title&subtitle=Test%20Subtitle&tenant=tenant-123"

# Test OG image validation
node -e "
import { validateOGImageParams } from '@repo/seo/og-images';
const result = validateOGImageParams({
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  tenant: 'tenant-123',
  type: 'blog'
});
console.log('Validation result:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Dynamic OG images following section 8.6
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { db } from '@repo/db';

// Edge Runtime: ~0ms cold start, globally distributed
export const runtime = 'edge';

// Cache OG images aggressively (they change rarely)
export const revalidate = 86400; // 24 hours

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const title = searchParams.get('title') ?? 'Welcome';
    const subtitle = searchParams.get('subtitle') ?? '';
    const tenantId = searchParams.get('tenant') ?? '';
    const pageType = searchParams.get('type') ?? 'page';

    // Fetch tenant branding (colors, logo, font) from Redis-cached config
    // Falls back to defaults if tenant not found
    let brandConfig = {
      primaryColor: '#1a1a2e',
      accentColor: '#16213e',
      logoUrl: null as string | null,
      fontFamily: 'Inter',
      siteName: '',
    };

    if (tenantId) {
      const { data: tenant } = await db
        .from('tenants')
        .select('config')
        .eq('id', tenantId)
        .single();

      if (tenant?.config) {
        const cfg = tenant.config as any;
        brandConfig = {
          primaryColor: cfg.theme?.colors?.primary ?? '#1a1a2e',
          accentColor: cfg.theme?.colors?.accent ?? '#16213e',
          logoUrl: cfg.assets?.logo ?? null,
          fontFamily: cfg.theme?.fontFamily ?? 'Inter',
          siteName: cfg.identity?.siteName ?? '',
        };
      }
    }

    // Page type badge configuration
    const badges: Record<string, { label: string; emoji: string }> = {
      home: { label: 'HOME', emoji: '🏠' },
      service: { label: 'SERVICE', emoji: '⚙️' },
      blog: { label: 'BLOG', emoji: '📝' },
      'blog-post': { label: 'ARTICLE', emoji: '📖' },
      about: { label: 'ABOUT US', emoji: '👋' },
      contact: { label: 'CONTACT', emoji: '📞' },
      page: { label: 'PAGE', emoji: '📄' },
    };

    const badge = badges[pageType] ?? badges.page;
    const truncatedTitle = title.length > 60 ? title.substring(0, 60) + '…' : title;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: brandConfig.primaryColor,
            padding: '64px',
            position: 'relative',
          }}
        >
          {/* Subtle geometric background decoration */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              backgroundColor: brandConfig.accentColor,
              opacity: 0.3,
              transform: 'translate(150px, -150px)',
            }}
          />

          {/* Top: logo + badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {brandConfig.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.siteName}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  backgroundColor: brandConfig.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                {brandConfig.siteName?.charAt(0) ?? 'S'}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              <div
                style={{
                  backgroundColor: brandConfig.accentColor,
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{badge.emoji}</span>
                {badge.label}
              </div>
              {brandConfig.siteName && (
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    opacity: 0.8,
                  }}
                >
                  {brandConfig.siteName}
                </div>
              )}
            </div>
          </div>

          {/* Middle: title + subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
                lineHeight: '1.1',
                maxWidth: '800px',
              }}
            >
              {truncatedTitle}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#ffffff',
                  margin: 0,
                  opacity: 0.9,
                  maxWidth: '600px',
                  lineHeight: '1.4',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom: decorative elements */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                width: '200px',
                height: '4px',
                backgroundColor: brandConfig.accentColor,
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                color: '#ffffff',
                fontSize: '14px',
                opacity: 0.6,
              }}
            >
              {new Date().toLocaleDateString()}
            </div>
            <div
              style={{
                width: '200px',
                height: '4px',
                backgroundColor: brandConfig.accentColor,
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            weight: 400,
            style: 'normal',
            source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
          },
          {
            name: 'Inter',
            weight: 600,
            style: 'normal',
            source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZ9hiA.woff2',
          },
          {
            name: 'Inter',
            weight: 700,
            style: 'normal',
            source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMY9hiA.woff2',
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a2e',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          Error generating image
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

// ============================================================================
// ADVANCED OG IMAGE GENERATION
// ============================================================================

export async function generateAdvancedOGImage(params: {
  title: string;
  subtitle?: string;
  tenantId?: string;
  pageType?: string;
  customTheme?: {
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
  customLogo?: string;
}): Promise<ImageResponse> {
  const {
    title,
    subtitle = '',
    tenantId = '',
    pageType = 'page',
    customTheme = {},
    customLogo,
  } = params;

  // Fetch tenant branding
  let brandConfig = {
    primaryColor: customTheme.primaryColor ?? '#1a1a2e',
    accentColor: customTheme.accentColor ?? '#16213e',
    logoUrl: customLogo ?? null,
    fontFamily: customTheme.fontFamily ?? 'Inter',
    siteName: '',
  };

  if (tenantId && !customLogo) {
    const { data: tenant } = await db
      .from('tenants')
      .select('config')
      .eq('id', tenantId)
      .single();

    if (tenant?.config) {
      const cfg = tenant.config as any;
      brandConfig = {
        primaryColor: cfg.theme?.colors?.primary ?? brandConfig.primaryColor,
        accentColor: cfg.theme?.colors?.accent ?? brandConfig.accentColor,
        logoUrl: cfg.assets?.logo ?? null,
        fontFamily: cfg.theme?.fontFamily ?? brandConfig.fontFamily,
        siteName: cfg.identity?.siteName ?? '',
      };
    }
  }

  const badges: Record<string, { label: string; emoji: string }> = {
    home: { label: 'HOME', emoji: '🏠' },
    service: { label: 'SERVICE', emoji: '⚙️' },
    blog: { label: 'BLOG', emoji: '📝' },
    'blog-post': { label: 'ARTICLE', emoji: '📖' },
    about: { label: 'ABOUT US', emoji: '👋' },
    contact: { label: 'CONTACT', emoji: '📞' },
    portfolio: { label: 'PORTFOLIO', emoji: '💼' },
    testimonial: { label: 'TESTIMONIAL', emoji: '⭐' },
    page: { label: 'PAGE', emoji: '📄' },
  };

  const badge = badges[pageType] ?? badges.page;
  const truncatedTitle = title.length > 60 ? title.substring(0, 60) + '…' : title;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: brandConfig.primaryColor,
          padding: '64px',
          position: 'relative',
          fontFamily: brandConfig.fontFamily,
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            backgroundColor: brandConfig.accentColor,
            opacity: 0.2,
            transform: 'translate(200px, -200px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: brandConfig.accentColor,
            opacity: 0.15,
            transform: 'translate(-200px, 200px)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {brandConfig.logoUrl ? (
            <img
              src={brandConfig.logoUrl}
              alt={brandConfig.siteName}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                backgroundColor: brandConfig.accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              {brandConfig.siteName?.charAt(0) ?? 'S'}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: brandConfig.accentColor,
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{badge.emoji}</span>
              {badge.label}
            </div>
            {brandConfig.siteName && (
              <div
                style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  opacity: 0.8,
                }}
              >
                {brandConfig.siteName}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              lineHeight: '1.1',
              maxWidth: '800px',
            }}
          >
            {truncatedTitle}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: '24px',
                color: '#ffffff',
                margin: 0,
                opacity: 0.9,
                maxWidth: '600px',
                lineHeight: '1.4',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '4px',
              backgroundColor: brandConfig.accentColor,
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              color: '#ffffff',
              fontSize: '14px',
              opacity: 0.6,
            }}
          >
            {new Date().toLocaleDateString()}
          </div>
          <div
            style={{
              width: '200px',
              height: '4px',
              backgroundColor: brandConfig.accentColor,
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: brandConfig.fontFamily,
          weight: 400,
          style: 'normal',
          source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
        },
        {
          name: brandConfig.fontFamily,
          weight: 600,
          style: 'normal',
          source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZ9hiA.woff2',
        },
        {
          name: brandConfig.fontFamily,
          weight: 700,
          style: 'normal',
          source: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMY9hiA.woff2',
        },
      ],
    }
  );
}

// ============================================================================
// OG IMAGE VALIDATION
// ============================================================================

export function validateOGImageParams(params: {
  title?: string;
  subtitle?: string;
  tenant?: string;
  type?: string;
}): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!params.title) {
    errors.push('Title is required');
  } else if (params.title.length > 100) {
    warnings.push('Title should be 100 characters or less for optimal display');
  }

  // Subtitle validation
  if (params.subtitle && params.subtitle.length > 200) {
    warnings.push('Subtitle should be 200 characters or less for optimal display');
  }

  // Page type validation
  const validTypes = ['home', 'service', 'blog', 'blog-post', 'about', 'contact', 'portfolio', 'testimonial', 'page'];
  if (params.type && !validTypes.includes(params.type)) {
    errors.push(`Invalid page type: ${params.type}. Valid types: ${validTypes.join(', ')}`);
  }

  // Tenant ID validation
  if (params.tenant && !/^[a-f0-9-]{36}$/.test(params.tenant)) {
    warnings.push('Tenant ID should be a valid UUID');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// OG IMAGE UTILITIES
// ============================================================================

export function createOGImageUrl(
  baseUrl: string,
  params: {
    title: string;
    subtitle?: string;
    tenant?: string;
    type?: string;
  }
): string {
  const url = new URL('/og', baseUrl);

  url.searchParams.set('title', params.title);

  if (params.subtitle) {
    url.searchParams.set('subtitle', params.subtitle);
  }

  if (params.tenant) {
    url.searchParams.set('tenant', params.tenant);
  }

  if (params.type) {
    url.searchParams.set('type', params.type);
  }

  return url.toString();
}

export function getOGImageStats(imageUrl: string): {
  width: number;
  height: number;
  format: string;
  size: string;
} {
  // This would typically involve fetching the image and extracting metadata
  // For now, return standard OG image dimensions
  return {
    width: 1200,
    height: 630,
    format: 'png',
    size: '~200KB',
  };
}

export function optimizeOGImageForSocial(
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram'
): {
  width: number;
  height: number;
  recommendations: string[];
} {
  const specs = {
    facebook: {
      width: 1200,
      height: 630,
      recommendations: [
        'Use 1200x630 for optimal display',
        'Keep text under 20% of image area',
        'Use high-contrast colors for readability',
      ],
    },
    twitter: {
      width: 1200,
      height: 675,
      recommendations: [
        'Use 1200x675 for optimal display',
        'Ensure text is readable at small sizes',
        'Avoid important information in bottom 20%',
      ],
    },
    linkedin: {
      width: 1200,
      height: 627,
      recommendations: [
        'Use 1200x627 for optimal display',
        'Professional tone recommended',
        'Include company logo for brand recognition',
      ],
    },
    instagram: {
      width: 1080,
      height: 1080,
      recommendations: [
        'Use 1080x1080 square format',
        'Focus on visual appeal',
        'Minimal text recommended',
      ],
    },
  };

  return specs[platform];
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

export function createTestOGImageConfig(overrides?: {
  title?: string;
  subtitle?: string;
  tenant?: string;
  type?: string;
}): {
  title: string;
  subtitle: string;
  tenant: string;
  type: string;
} {
  return {
    title: overrides?.title ?? 'Test Title for OG Image',
    subtitle: overrides?.subtitle ?? 'Test subtitle with additional context',
    tenant: overrides?.tenant ?? 'test-tenant-123',
    type: overrides?.type ?? 'blog',
  };
}

export function expectValidOGImageParams(params: {
  title?: string;
  subtitle?: string;
  tenant?: string;
  type?: string;
}) {
  const validation = validateOGImageParams(params);
  expect(validation.valid).toBe(true);
  expect(validation.errors).toHaveLength(0);
}

export function expectValidOGImageUrl(url: string) {
  expect(url).toMatch(/^https?:\/\/.*\/og\?/);
  expect(url).toContain('title=');

  const urlObj = new URL(url);
  expect(urlObj.searchParams.has('title')).toBe(true);
}
```

**OG image generation principles:**

- **Edge runtime**: Global distribution with ~0ms cold start
- **Tenant branding**: Dynamic colors, logos, and fonts per tenant
- **Page type badges**: Visual indicators for different content types
- **Aggressive caching**: 24-hour cache for performance
- **Error handling**: Graceful fallbacks for missing data
- **Responsive design**: Proper sizing for different social platforms
- **Performance optimization**: Optimized for edge runtime constraints
- **Visual hierarchy**: Clear typography and layout structure

---

## Boundaries

| Tier             | Scope                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 8.6 specification; implement edge runtime; add tenant branding; include page type badges; optimize for performance |
| ⚠️ **Ask first** | Changing existing OG image patterns; modifying edge runtime; updating tenant branding                                             |
| 🚫 **Never**     | Skip edge runtime; ignore tenant branding; bypass caching; omit page type badges                                                  |

---

## Success Verification

- [ ] **[Agent]** Test basic OG image — Default image generates correctly
- [ ] **[Agent]** Verify tenant branding — Tenant colors and logos applied
- [ ] **[Agent]** Test page type badges — Different page types show correct badges
- [ ] **[Agent]** Test edge runtime — Images generated at edge locations
- [ ] **[Agent]** Verify caching — Images cached for 24 hours
- [ ] **[Agent]** Test error handling — Missing data handled gracefully
- [ ] **[Agent]** Test performance — Images generate quickly
- [ ] **[Human]** Test with real tenant data — Production images work correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Missing tenant data**: Handle missing tenant configuration gracefully
- **Invalid parameters**: Validate and handle invalid query parameters
- **Font loading**: Ensure fonts load correctly in edge runtime
- **Image optimization**: Optimize for different social media platforms
- **Cache invalidation**: Handle cache invalidation when tenant branding changes
- **Edge runtime limits**: Respect edge runtime memory and time limits
- **Logo loading**: Handle logo loading errors gracefully
- **Text overflow**: Handle long titles and subtitles properly

---

## Out of Scope

- Metadata generation system (handled in separate task)
- Dynamic sitemap generation (handled in separate task)
- Robots.txt generation (handled in separate task)
- Structured data system (handled in separate task)
- CMS adapter integration (handled in separate task)
- GEO optimization layer (handled in separate task)
- A/B testing system (handled in separate task)

---

## References

- [Section 8.6 Dynamic OG Images — Edge Runtime](docs/plan/domain-8/8.6-dynamic-og-images-edge-runtime.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Next.js ImageResponse Documentation](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Edge Runtime Documentation](https://nextjs.org/docs/pages/api-reference/edge)
- [OG Image Best Practices](https://ogp.me/)
- [Social Media Image Guidelines](https://developers.facebook.com/docs/sharing/best-practices)
