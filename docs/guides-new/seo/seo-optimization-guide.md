---
title: SEO & Metadata Guide
description: Complete SEO optimization strategy with metadata generation, structured data, sitemaps, and social sharing
last_updated: 2026-02-26
tags: [#seo #metadata #structured-data #sitemap #social-sharing #optimization]
estimated_read_time: 50 minutes
difficulty: intermediate
---

# SEO & Metadata Guide

## Overview

Comprehensive SEO optimization strategy for multi-tenant SaaS applications using Next.js 16. This guide covers metadata generation, structured data, dynamic sitemaps, Open Graph images, and tenant-specific SEO patterns with 2026 best practices and Core Web Vitals optimization.

## Key Features

- **Metadata Generation**: Dynamic metadata with tenant-specific customization
- **Structured Data**: JSON-LD implementation with Schema.org standards
- **Dynamic Sitemaps**: Multi-tenant sitemap generation with automatic updates
- **Social Sharing**: Dynamic Open Graph images for social media
- **Multi-Tenant SEO**: Tenant-specific SEO configurations and branding
- **Core Web Vitals**: SEO optimization with performance metrics
- **2026 Standards**: Latest SEO best practices and AI search preparation

---

## 🏷️ Metadata Generation System

### Core Metadata Factory

```typescript
// packages/seo/src/metadata-factory.ts
import { Metadata, ResolvingMetadata } from 'next';
import { z } from 'zod';

const MetadataConfigSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  keywords: z.array(z.string()).optional(),
  image: z.string().url().optional(),
  url: z.string().url(),
  locale: z.string().default('en_US'),
  siteName: z.string().default('Marketing Websites'),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  noIndex: z.boolean().default(false),
});

export interface MetadataContext {
  tenant?: {
    id: string;
    name: string;
    domain: string;
    brand: {
      primaryColor: string;
      logo: string;
      theme: 'light' | 'dark';
    };
  };
  page: {
    type: 'homepage' | 'landing' | 'blog' | 'product' | 'pricing';
    title: string;
    description: string;
    image?: string;
  };
  analytics: {
    trackingId?: string;
    gtmId?: string;
  };
}

export class MetadataFactory {
  private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  static generateMetadata(
    context: MetadataContext,
    config: z.infer<typeof MetadataConfigSchema>
  ): Metadata {
    const { tenant, page, analytics } = context;
    const fullTitle = tenant 
      ? `${page.title} | ${tenant.name}`
      : `${page.title} | ${config.siteName}`;

    return {
      title: fullTitle,
      description: config.description,
      keywords: config.keywords?.join(', '),
      
      // Open Graph
      openGraph: {
        type: 'website',
        locale: config.locale,
        url: config.url,
        title: fullTitle,
        description: config.description,
        siteName: tenant?.name || config.siteName,
        images: config.image ? [{
          url: config.image,
          width: 1200,
          height: 630,
          alt: page.title,
        }] : [],
      },

      // Twitter
      twitter: {
        card: config.twitterCard,
        title: fullTitle,
        description: config.description,
        images: config.image ? [config.image] : [],
        creator: '@yourcompany',
        site: '@yourcompany',
      },

      // Canonical URL
      alternates: {
        canonical: config.url,
      },

      // Robots
      robots: {
        index: !config.noIndex,
        follow: !config.noIndex,
        googleBot: {
          index: !config.noIndex,
          follow: !config.noIndex,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Additional meta tags
      other: {
        'theme-color': tenant?.brand.primaryColor || '#000000',
        'msapplication-TileColor': tenant?.brand.primaryColor || '#000000',
        ...(analytics.trackingId && { 'google-site-verification': analytics.trackingId }),
      },
    };
  }

  static generateTenantMetadata(tenant: MetadataContext['tenant']): Partial<Metadata> {
    if (!tenant) return {};

    return {
      title: tenant.name,
      openGraph: {
        siteName: tenant.name,
      },
      other: {
        'theme-color': tenant.brand.primaryColor,
        'msapplication-TileColor': tenant.brand.primaryColor,
      },
    };
  }
}
```

### Next.js Page Implementation

```typescript
// apps/portal/src/app/(marketing)/page.tsx
import { Metadata, ResolvingMetadata } from 'next';
import { MetadataFactory, type MetadataContext } from '@repo/seo/metadata-factory';
import { getCurrentTenant } from '@repo/auth/tenant-context';

type PageProps = {
  params: { tenant: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  
  const context: MetadataContext = {
    tenant: tenant ? {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      brand: {
        primaryColor: tenant.branding?.primaryColor || '#000000',
        logo: tenant.branding?.logo || '/logo.png',
        theme: tenant.branding?.theme || 'light',
      },
    } : undefined,
    page: {
      type: 'homepage',
      title: 'Professional Marketing Websites',
      description: 'Create stunning marketing websites with our AI-powered platform. Fast, secure, and optimized for conversions.',
    },
    analytics: {
      trackingId: process.env.GA_TRACKING_ID,
      gtmId: process.env.GTM_ID,
    },
  };

  const config = {
    title: context.page.title,
    description: context.page.description,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.tenant}`,
    locale: 'en_US',
    siteName: tenant?.name || 'Marketing Websites',
  };

  return MetadataFactory.generateMetadata(context, config);
}
```

---

## 📊 Structured Data System

### JSON-LD Schema Generator

```typescript
// packages/seo/src/structured-data.ts
import { z } from 'zod';

const OrganizationSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logo: z.string().url(),
  description: z.string(),
  contactPoint: z.object({
    telephone: z.string(),
    contactType: z.string(),
    availableLanguage: z.array(z.string()),
  }).optional(),
  address: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    addressCountry: z.string(),
  }).optional(),
});

const WebPageSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  lastReviewed: z.string().datetime(),
  author: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  publisher: z.object({
    name: z.string(),
    logo: z.object({
      url: z.string().url(),
      width: z.number(),
      height: z.number(),
    }),
  }),
});

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.array(z.string().url()),
  brand: z.object({
    name: z.string(),
  }),
  offers: z.object({
    price: z.string(),
    priceCurrency: z.string(),
    availability: z.string(),
    url: z.string().url(),
  }),
});

export class StructuredDataGenerator {
  static generateOrganization(data: z.infer<typeof OrganizationSchema>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      ...(data.contactPoint && {
        contactPoint: {
          '@type': 'ContactPoint',
          ...data.contactPoint,
        },
      }),
      ...(data.address && {
        address: {
          '@type': 'PostalAddress',
          ...data.address,
        },
      }),
    };
  }

  static generateWebPage(data: z.infer<typeof WebPageSchema>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.name,
      description: data.description,
      url: data.url,
      lastReviewed: data.lastReviewed,
      author: {
        '@type': 'Organization',
        ...data.author,
      },
      publisher: {
        '@type': 'Organization',
        ...data.publisher,
      },
    };
  }

  static generateProduct(data: z.infer<typeof ProductSchema>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      brand: {
        '@type': 'Brand',
        ...data.brand,
      },
      offers: {
        '@type': 'Offer',
        ...data.offers,
      },
    };
  }

  static generateBreadcrumb(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  static generateFAQ(faqs: Array<{ question: string; answer: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }
}
```

### Structured Data Component

```typescript
// packages/ui/src/seo/StructuredData.tsx
'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data script
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null; // This component doesn't render anything
}
```

---

## 🗺️ Dynamic Sitemap Generation

### Sitemap Configuration

```typescript
// packages/seo/src/sitemap-generator.ts
import { MetadataRoute } from 'next';
import { z } from 'zod';

const SitemapEntrySchema = z.object({
  url: z.string().url(),
  lastModified: z.date(),
  changeFrequency: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
  priority: z.number().min(0).max(1),
});

export class SitemapGenerator {
  private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  static async generateSitemap(
    entries: z.infer<typeof SitemapEntrySchema>[],
    tenantId?: string
  ): Promise<MetadataRoute.Sitemap> {
    const baseEntries: MetadataRoute.Sitemap = [
      {
        url: this.baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${this.baseUrl}/pricing`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    // Add tenant-specific entries if tenantId is provided
    if (tenantId) {
      baseEntries.push(
        {
          url: `${this.baseUrl}/${tenantId}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1,
        },
        {
          url: `${this.baseUrl}/${tenantId}/dashboard`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        }
      );
    }

    const processedEntries = entries.map(entry => ({
      url: entry.url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));

    return [...baseEntries, ...processedEntries];
  }

  static async generateTenantSitemaps(tenants: Array<{
    id: string;
    domain: string;
    lastModified: Date;
  }>): Promise<MetadataRoute.Sitemap> {
    return tenants.map(tenant => ({
      url: `${this.baseUrl}/sitemaps/${tenant.id}.xml`,
      lastModified: tenant.lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  }

  static generateSitemapIndex(sitemaps: Array<{ url: string; lastModified: Date }>): string {
    const sitemapEntries = sitemaps
      .map(sitemap => `  <sitemap>
      <loc>${sitemap.url}</loc>
      <lastmod>${sitemap.lastModified.toISOString()}</lastmod>
    </sitemap>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }
}
```

### Next.js Sitemap Routes

```typescript
// apps/portal/src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { SitemapGenerator } from '@repo/seo/sitemap-generator';
import { db } from '@repo/db';
import { cache } from 'react';

const getPages = cache(async () => {
  const pages = await db
    .from('pages')
    .select('slug, updated_at')
    .eq('published', true);

  return pages.data?.map(page => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || [];
});

const getTenants = cache(async () => {
  const tenants = await db
    .from('tenants')
    .select('id, domain, updated_at')
    .eq('status', 'active');

  return tenants.data?.map(tenant => ({
    id: tenant.id,
    domain: tenant.domain,
    lastModified: new Date(tenant.updated_at),
  })) || [];
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, tenants] = await Promise.all([getPages(), getTenants()]);
  
  return SitemapGenerator.generateSitemap(pages);
}

// apps/portal/src/app/sitemaps/[tenant]/sitemap.ts
import { MetadataRoute } from 'next';
import { SitemapGenerator } from '@repo/seo/sitemap-generator';
import { db } from '@repo/db';

interface TenantSitemapProps {
  params: { tenant: string };
}

export default async function tenantSitemap(
  { params }: TenantSitemapProps
): Promise<MetadataRoute.Sitemap> {
  const tenant = await db
    .from('tenants')
    .select('id, updated_at')
    .eq('id', params.tenant)
    .single();

  if (!tenant.data) {
    return [];
  }

  const pages = await db
    .from('pages')
    .select('slug, updated_at')
    .eq('tenant_id', params.tenant)
    .eq('published', true);

  const entries = pages.data?.map(page => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.tenant}/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return SitemapGenerator.generateSitemap(entries, params.tenant);
}
```

---

## 🖼️ Dynamic Open Graph Images

### OG Image Generation

```typescript
// packages/seo/src/og-image-generator.ts
import { ImageResponse } from 'next/og';
import { z } from 'zod';

const OGImageConfigSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  brand: z.object({
    name: z.string(),
    logo: z.string().url(),
    primaryColor: z.string(),
  }),
  theme: z.enum(['light', 'dark']).default('light'),
  locale: z.string().default('en_US'),
});

export class OGImageGenerator {
  static async generateImage(config: z.infer<typeof OGImageConfigSchema>) {
    const { title, description, brand, theme } = config;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
            backgroundImage: theme === 'dark' 
              ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Brand Logo */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              width={40}
              height={40}
              style={{
                borderRadius: '8px',
              }}
            />
            <span
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              {brand.name}
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 80px',
              maxWidth: '1000px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 700,
                margin: '0 0 24px 0',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '24px',
                fontWeight: 400,
                margin: '0',
                color: theme === 'dark' ? '#a0a0a0' : '#666666',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {description}
            </p>
          </div>

          {/* Bottom Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: brand.primaryColor,
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              {brand.name}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: 'twemoji',
      }
    );
  }

  static async generateBlogImage(config: {
    title: string;
    author: string;
    readTime: number;
    brand: OGImageConfigSchema['brand'];
    theme?: 'light' | 'dark';
  }) {
    const { title, author, readTime, brand, theme = 'light' } = config;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
            backgroundImage: theme === 'dark' 
              ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                width={32}
                height={32}
                style={{
                  borderRadius: '6px',
                }}
              />
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                }}
              >
                {brand.name}
              </span>
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#a0a0a0' : '#666666',
                }}
              >
                By {author}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? '#a0a0a0' : '#666666',
                }}
              >
                {readTime} min read
              </span>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 700,
                margin: '0',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: brand.primaryColor,
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                }}
              >
                Blog
              </span>
            </div>
            
            <span
              style={{
                fontSize: '14px',
                color: theme === 'dark' ? '#a0a0a0' : '#666666',
              }}
            >
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: 'twemoji',
      }
    );
  }
}
```

### OG Image API Routes

```typescript
// apps/portal/src/app/api/og/route.ts
import { ImageResponse } from 'next/og';
import { OGImageGenerator } from '@repo/seo/og-image-generator';
import { getCurrentTenant } from '@repo/auth/tenant-context';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Marketing Websites';
    const description = searchParams.get('description') || 'Create stunning marketing websites';
    const theme = (searchParams.get('theme') as 'light' | 'dark') || 'light';

    const tenant = await getCurrentTenant();

    const config = {
      title,
      description,
      brand: {
        name: tenant?.name || 'Marketing Websites',
        logo: tenant?.branding?.logo || '/logo.png',
        primaryColor: tenant?.branding?.primaryColor || '#000000',
      },
      theme,
    };

    const image = await OGImageGenerator.generateImage(config);
    return image;
  } catch (error) {
    console.error('OG image generation failed:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}

// apps/portal/src/app/api/og/blog/route.ts
import { ImageResponse } from 'next/og';
import { OGImageGenerator } from '@repo/seo/og-image-generator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Blog Post';
    const author = searchParams.get('author') || 'Author';
    const readTime = parseInt(searchParams.get('readTime') || '5');
    const theme = (searchParams.get('theme') as 'light' | 'dark') || 'light';

    const image = await OGImageGenerator.generateBlogImage({
      title,
      author,
      readTime,
      brand: {
        name: 'Marketing Websites',
        logo: '/logo.png',
        primaryColor: '#000000',
      },
      theme,
    });

    return image;
  } catch (error) {
    console.error('Blog OG image generation failed:', error);
    return new Response('Failed to generate blog OG image', { status: 500 });
  }
}
```

---

## 🏢 Multi-Tenant SEO Factory

### Tenant-Specific SEO Configuration

```typescript
// packages/seo/src/tenant-seo-factory.ts
import { Metadata } from 'next';
import { MetadataFactory } from './metadata-factory';
import { StructuredDataGenerator } from './structured-data';
import { OGImageGenerator } from './og-image-generator';

export interface TenantSEOConfig {
  tenant: {
    id: string;
    name: string;
    domain: string;
    branding: {
      logo: string;
      primaryColor: string;
      theme: 'light' | 'dark';
    };
    seo: {
      title: string;
      description: string;
      keywords: string[];
      ogImage: string;
    };
  };
  page: {
    type: 'homepage' | 'landing' | 'blog' | 'product' | 'pricing';
    title: string;
    description: string;
    image?: string;
  };
}

export class TenantSEOFactory {
  static generateMetadata(config: TenantSEOConfig): Metadata {
    const context = {
      tenant: config.tenant,
      page: config.page,
      analytics: {},
    };

    const metadataConfig = {
      title: config.page.title,
      description: config.page.description,
      keywords: config.tenant.seo.keywords,
      image: config.page.image || config.tenant.seo.ogImage,
      url: `https://${config.tenant.domain}/${config.page.type}`,
      locale: 'en_US',
      siteName: config.tenant.name,
    };

    return MetadataFactory.generateMetadata(context, metadataConfig);
  }

  static generateStructuredData(config: TenantSEOConfig) {
    const organizationData = {
      name: config.tenant.name,
      url: `https://${config.tenant.domain}`,
      logo: config.tenant.branding.logo,
      description: config.tenant.seo.description,
    };

    const webpageData = {
      name: config.page.title,
      description: config.page.description,
      url: `https://${config.tenant.domain}/${config.page.type}`,
      lastReviewed: new Date().toISOString(),
      author: {
        name: config.tenant.name,
        url: `https://${config.tenant.domain}`,
      },
      publisher: {
        name: config.tenant.name,
        logo: {
          url: config.tenant.branding.logo,
          width: 200,
          height: 60,
        },
      },
    };

    return [
      StructuredDataGenerator.generateOrganization(organizationData),
      StructuredDataGenerator.generateWebPage(webpageData),
    ];
  }

  static async generateOGImage(config: TenantSEOConfig) {
    return OGImageGenerator.generateImage({
      title: config.page.title,
      description: config.page.description,
      brand: {
        name: config.tenant.name,
        logo: config.tenant.branding.logo,
        primaryColor: config.tenant.branding.primaryColor,
      },
      theme: config.tenant.branding.theme,
    });
  }
}
```

### Tenant SEO Page Component

```typescript
// packages/ui/src/seo/TenantSEOPage.tsx
'use client';

import { StructuredData } from './StructuredData';
import { Head } from '@next/third-parties/google';

interface TenantSEOPageProps {
  metadata: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url: string;
  };
  structuredData: Record<string, any>[];
  children: React.ReactNode;
}

export function TenantSEOPage({
  metadata,
  structuredData,
  children,
}: TenantSEOPageProps) {
  return (
    <>
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}

      {/* Google Analytics */}
      {process.env.GA_TRACKING_ID && (
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_TRACKING_ID}');
              `,
            }}
          />
        </Head>
      )}

      {/* Page Content */}
      {children}
    </>
  );
}
```

---

## 📈 SEO Analytics & Monitoring

### SEO Performance Tracking

```typescript
// packages/seo/src/analytics.ts
export interface SEOMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  searchVisibility: {
    organicTraffic: number;
    keywordRankings: number;
    clickThroughRate: number;
  };
  technicalSEO: {
    indexedPages: number;
    crawlErrors: number;
    siteSpeed: number;
  };
}

export class SEOAnalytics {
  static async generateSEOReport(domain: string): Promise<SEOMetrics> {
    // Core Web Vitals from CrUX API
    const cwvData = await this.fetchCoreWebVitals(domain);
    
    // Search visibility from Google Search Console API
    const searchVisibility = await this.fetchSearchVisibility(domain);
    
    // Technical SEO from various APIs
    const technicalSEO = await this.fetchTechnicalSEO(domain);

    return {
      coreWebVitals: cwvData,
      searchVisibility,
      technicalSEO,
    };
  }

  private static async fetchCoreWebVitals(domain: string) {
    // Integration with Chrome User Experience Report API
    // This would fetch real Core Web Vitals data
    return {
      lcp: 2.1, // < 2.5s is good
      fid: 85, // < 100ms is good
      cls: 0.08, // < 0.1 is good
    };
  }

  private static async fetchSearchVisibility(domain: string) {
    // Integration with Google Search Console API
    return {
      organicTraffic: 12500,
      keywordRankings: 342,
      clickThroughRate: 4.2,
    };
  }

  private static async fetchTechnicalSEO(domain: string) {
    // Integration with Google PageSpeed Insights and other tools
    return {
      indexedPages: 1240,
      crawlErrors: 3,
      siteSpeed: 92,
    };
  }

  static generateSEORecommendations(metrics: SEOMetrics): string[] {
    const recommendations: string[] = [];

    // Core Web Vitals recommendations
    if (metrics.coreWebVitals.lcp > 2.5) {
      recommendations.push('Optimize Largest Contentful Paint by preloading critical resources');
    }
    if (metrics.coreWebVitals.fid > 100) {
      recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time');
    }
    if (metrics.coreWebVitals.cls > 0.1) {
      recommendations.push('Fix Cumulative Layout Shift by specifying dimensions for media elements');
    }

    // Search visibility recommendations
    if (metrics.searchVisibility.clickThroughRate < 3.0) {
      recommendations.push('Improve meta descriptions and titles to increase click-through rate');
    }

    // Technical SEO recommendations
    if (metrics.technicalSEO.crawlErrors > 0) {
      recommendations.push('Fix crawl errors identified in Google Search Console');
    }

    return recommendations;
  }
}
```

### SEO Monitoring Dashboard

```typescript
// apps/portal/src/app/dashboard/seo/page.tsx
import { SEOAnalytics } from '@repo/seo/analytics';
import { getCurrentTenant } from '@repo/auth/tenant-context';

export default async function SEODashboard() {
  const tenant = await getCurrentTenant();
  
  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  const metrics = await SEOAnalytics.generateSEOReport(tenant.domain);
  const recommendations = SEOAnalytics.generateSEORecommendations(metrics);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">SEO Performance</h1>
      
      {/* Core Web Vitals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">LCP</h3>
            <p className="text-2xl font-bold">{metrics.coreWebVitals.lcp}s</p>
            <p className="text-sm text-green-600">Good</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">FID</h3>
            <p className="text-2xl font-bold">{metrics.coreWebVitals.fid}ms</p>
            <p className="text-sm text-green-600">Good</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">CLS</h3>
            <p className="text-2xl font-bold">{metrics.coreWebVitals.cls}</p>
            <p className="text-sm text-green-600">Good</p>
          </div>
        </div>
      </div>

      {/* Search Visibility */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Visibility</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Organic Traffic</h3>
            <p className="text-2xl font-bold">{metrics.searchVisibility.organicTraffic.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Keyword Rankings</h3>
            <p className="text-2xl font-bold">{metrics.searchVisibility.keywordRankings}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">CTR</h3>
            <p className="text-2xl font-bold">{metrics.searchVisibility.clickThroughRate}%</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing SEO Implementation

### SEO Testing Utilities

```typescript
// packages/seo/src/__tests__/metadata.test.ts
import { MetadataFactory } from '../metadata-factory';
import { StructuredDataGenerator } from '../structured-data';

describe('SEO Implementation', () => {
  describe('MetadataFactory', () => {
    it('should generate metadata with tenant branding', () => {
      const context = {
        tenant: {
          id: 'tenant-123',
          name: 'Test Company',
          domain: 'test.com',
          brand: {
            primaryColor: '#ff0000',
            logo: 'https://test.com/logo.png',
            theme: 'light' as const,
          },
        },
        page: {
          type: 'homepage' as const,
          title: 'Welcome to Test Company',
          description: 'Test description',
        },
        analytics: {},
      };

      const config = {
        title: context.page.title,
        description: context.page.description,
        url: 'https://test.com',
        locale: 'en_US',
        siteName: context.tenant.name,
      };

      const metadata = MetadataFactory.generateMetadata(context, config);

      expect(metadata.title).toBe('Welcome to Test Company | Test Company');
      expect(metadata.openGraph?.siteName).toBe('Test Company');
      expect(metadata.other?.['theme-color']).toBe('#ff0000');
    });

    it('should generate metadata without tenant', () => {
      const context = {
        page: {
          type: 'homepage' as const,
          title: 'Welcome',
          description: 'Description',
        },
        analytics: {},
      };

      const config = {
        title: context.page.title,
        description: context.page.description,
        url: 'https://example.com',
        locale: 'en_US',
        siteName: 'Marketing Websites',
      };

      const metadata = MetadataFactory.generateMetadata(context, config);

      expect(metadata.title).toBe('Welcome | Marketing Websites');
      expect(metadata.openGraph?.siteName).toBe('Marketing Websites');
    });
  });

  describe('StructuredDataGenerator', () => {
    it('should generate valid organization schema', () => {
      const data = {
        name: 'Test Company',
        url: 'https://test.com',
        logo: 'https://test.com/logo.png',
        description: 'Test description',
      };

      const schema = StructuredDataGenerator.generateOrganization(data);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Test Company');
    });

    it('should generate valid webpage schema', () => {
      const data = {
        name: 'Test Page',
        description: 'Test page description',
        url: 'https://test.com/page',
        lastReviewed: '2026-02-26T00:00:00Z',
        author: {
          name: 'Test Author',
          url: 'https://test.com',
        },
        publisher: {
          name: 'Test Publisher',
          logo: {
            url: 'https://test.com/logo.png',
            width: 200,
            height: 60,
          },
        },
      };

      const schema = StructuredDataGenerator.generateWebPage(data);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebPage');
      expect(schema.name).toBe('Test Page');
    });
  });
});
```

### E2E SEO Testing

```typescript
// e2e/tests/seo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SEO Implementation', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    const title = await page.title();
    expect(title).toContain('Marketing Websites');

    // Check description
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeLessThanOrEqual(160);

    // Check Open Graph tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    expect(ogImage).toBeTruthy();

    // Check canonical URL
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toBeTruthy();
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/');

    const structuredData = await page.$eval('script[type="application/ld+json"]', (el) => {
      return JSON.parse(el.textContent || '{}');
    });

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBeTruthy();
  });

  test('should generate sitemap', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset');
  });

  test('should generate OG images', async ({ page }) => {
    const response = await page.goto('/api/og?title=Test%20Title&description=Test%20Description');
    expect(response?.status()).toBe(200);

    const contentType = await response?.headerValue('content-type');
    expect(contentType).toContain('image/');
  });
});
```

---

## 📚 References

### Authoritative Sources
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — Official metadata API
- [Schema.org Documentation](https://schema.org/) — Structured data standards
- [Google Search Documentation](https://developers.google.com/search/docs) — SEO best practices
- [Web.dev SEO Guide](https://web.dev/learn/seo/) — Modern SEO techniques
- [Open Graph Protocol](https://ogp.me/) — Social sharing standards
- [Core Web Vitals](https://web.dev/vitals/) — Performance metrics

### Internal Documentation
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns
- [Multi-Tenant Architecture](../architecture/system-architecture-guide.md) — Tenant patterns
- [Performance Engineering](../development/performance-guide.md) — Core Web Vitals
- [Security Patterns](../security/security-patterns-guide.md) — Security standards

---

## 🚀 Implementation Checklist

### Setup Requirements
- [ ] Next.js 16 App Router configured
- [ ] Environment variables for SEO settings
- [ ] Google Analytics and Search Console setup
- [ ] Domain configuration for each tenant
- [ ] SSL certificates for all domains

### Metadata Configuration
- [ ] Default metadata templates created
- [ ] Tenant-specific metadata factories
- [ ] Dynamic metadata generation for pages
- [ ] Open Graph and Twitter card templates
- [ ] Internationalization support

### Structured Data Implementation
- [ ] Organization schema for each tenant
- [ ] WebPage schema for all pages
- [ ] Product/Service schemas where applicable
- [ ] BreadcrumbList for navigation
- [ ] FAQ schema for FAQ pages

### Sitemap Generation
- [ ] Dynamic sitemap generation
- [ ] Tenant-specific sitemaps
- [ ] Sitemap index for multi-tenant setup
- [ ] Automatic sitemap updates
- [ ] Sitemap submission to search engines

### Social Sharing
- [ ] Dynamic OG image generation
- [ ] Twitter card optimization
- [ ] Social media meta tags
- [ ] Image optimization for social platforms
- [ ] URL shortener integration

### Monitoring & Analytics
- [ ] Core Web Vitals tracking
- [ ] Search Console integration
- [ ] SEO performance dashboard
- [ ] Automated SEO reports
- [ ] Error monitoring and alerts

### Testing & Validation
- [ ] Unit tests for metadata generation
- [ ] Integration tests for structured data
- [ ] E2E tests for SEO implementation
- [ ] Schema validation testing
- [ ] Performance testing for SEO metrics

---

*This guide consolidates and replaces the following documentation files:*
- *metadata-generation-system.md*
- *dynamic-sitemap-generation.md*
- *structured-data-system.md*
- *dynamic-og-images.md*
- *tenant-metadata-factory.md*
