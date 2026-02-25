# SEO Optimization Guide

> **Comprehensive SEO & Metadata Optimization — February 2026**

## Overview

Complete SEO optimization guide covering metadata generation, dynamic sitemaps, structured data, OG images, generative engine optimization, and modern SEO patterns for multi-tenant SaaS applications. Focus on 2026 SEO standards and AI-powered search optimization.

## Key Features

- **Metadata Generation**: Dynamic metadata with tenant branding
- **Structured Data**: Schema.org implementation for rich snippets
- **Dynamic Sitemaps**: Multi-tenant sitemap generation
- **OG Images**: Dynamic social media image generation
- **GEO Optimization**: Generative Engine Optimization for AI search
- **Performance**: Core Web Vitals optimized SEO patterns

---

## 📊 Metadata Generation System

### Dynamic Metadata Factory

```typescript
// lib/seo/metadata-factory.ts
import { Metadata } from 'next';

export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
  canonical?: string;
  alternateUrls?: Array<{ lang: string; url: string }>;
}

export class MetadataFactory {
  private tenantId: string;
  private tenantConfig: TenantConfig;

  constructor(tenantId: string, tenantConfig: TenantConfig) {
    this.tenantId = tenantId;
    this.tenantConfig = tenantConfig;
  }

  generateMetadata(config: Partial<MetadataConfig>): Metadata {
    const baseConfig = this.getBaseMetadata();
    const mergedConfig = { ...baseConfig, ...config };

    return {
      title: mergedConfig.title,
      description: mergedConfig.description,
      keywords: mergedConfig.keywords?.join(', '),
      openGraph: {
        title: mergedConfig.title,
        description: mergedConfig.description,
        url: mergedConfig.url,
        siteName: this.tenantConfig.branding?.companyName || 'Marketing Platform',
        images: mergedConfig.image ? [
          {
            url: mergedConfig.image,
            width: 1200,
            height: 630,
            alt: mergedConfig.title,
          },
        ] : [],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: mergedConfig.title,
        description: mergedConfig.description,
        images: mergedConfig.image ? [mergedConfig.image] : [],
      },
      alternates: {
        canonical: mergedConfig.canonical,
        languages: mergedConfig.alternateUrls?.reduce((acc, alt) => {
          acc[alt.lang] = alt.url;
          return acc;
        }, {} as Record<string, string>),
      },
      robots: {
        index: !mergedConfig.noIndex,
        follow: !mergedConfig.noIndex,
        googleBot: {
          index: !mergedConfig.noIndex,
          follow: !mergedConfig.noIndex,
        },
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    };
  }

  private getBaseMetadata(): MetadataConfig {
    return {
      title: this.tenantConfig.branding?.companyName || 'Marketing Platform',
      description: this.tenantConfig.branding?.description || 'Professional marketing solutions',
      keywords: this.tenantConfig.seo?.defaultKeywords || [],
      noIndex: this.tenantConfig.seo?.noIndex || false,
    };
  }

  // Generate page-specific metadata
  generatePageMetadata(pageType: string, pageData: any): Metadata {
    switch (pageType) {
      case 'home':
        return this.generateMetadata({
          title: `${this.tenantConfig.branding?.companyName} | Home`,
          description: this.tenantConfig.branding?.tagline || 'Welcome to our platform',
          keywords: ['home', 'landing', this.tenantConfig.branding?.companyName?.toLowerCase()],
        });

      case 'service':
        return this.generateMetadata({
          title: `${pageData.name} | ${this.tenantConfig.branding?.companyName}`,
          description: pageData.description || `Professional ${pageData.name} services`,
          keywords: [pageData.name, 'service', ...this.tenantConfig.seo?.defaultKeywords || []],
        });

      case 'blog':
        return this.generateMetadata({
          title: `${pageData.title} | Blog`,
          description: pageData.excerpt || 'Latest insights and updates',
          keywords: [...pageData.tags || [], 'blog', 'article'],
          image: pageData.featuredImage,
        });

      case 'contact':
        return this.generateMetadata({
          title: `Contact Us | ${this.tenantConfig.branding?.companyName}`,
          description: 'Get in touch with our team',
          keywords: ['contact', 'support', 'help'],
        });

      default:
        return this.generateMetadata({});
    }
  }
}
```

### Tenant-Aware Metadata

```typescript
// lib/seo/tenant-metadata.ts
export class TenantMetadataService {
  async getTenantMetadata(tenantId: string): Promise<TenantMetadataConfig> {
    const tenant = await db.tenants.findUnique({
      where: { id: tenantId },
      include: {
        branding: true,
        seo: true,
        locations: true,
      },
    });

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    return {
      companyName: tenant.branding?.companyName || '',
      tagline: tenant.branding?.tagline || '',
      description: tenant.branding?.description || '',
      logo: tenant.branding?.logoUrl || '',
      primaryColor: tenant.branding?.primaryColor || '#000000',
      websiteUrl: tenant.websiteUrl,
      defaultKeywords: tenant.seo?.defaultKeywords || [],
      noIndex: tenant.seo?.noIndex || false,
      googleAnalytics: tenant.seo?.googleAnalytics,
      googleSearchConsole: tenant.seo?.googleSearchConsole,
      locations: tenant.locations || [],
    };
  }

  async generateLocationMetadata(location: TenantLocation): Promise<LocationMetadata> {
    return {
      title: `${location.city}, ${location.state} Services`,
      description: `Professional services in ${location.city}, ${location.state}. Serving ${location.serviceAreas?.join(', ') || 'all areas'}.`,
      keywords: [
        location.city.toLowerCase(),
        location.state.toLowerCase(),
        ...location.serviceAreas || [],
      ],
      geo: {
        latitude: location.latitude,
        longitude: location.longitude,
        placeName: `${location.city}, ${location.state}`,
        region: location.state,
        country: location.country || 'US',
        postalCode: location.postalCode,
      },
    };
  }
}
```

---

## 🗺️ Dynamic Sitemap Generation

### Multi-Tenant Sitemap System

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { SitemapService } from '@/lib/seo/sitemap';

const sitemapService = new SitemapService();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Get all active tenants
  const tenants = await db.tenants.findMany({
    where: { 
      status: 'active',
      seo: { noIndex: false },
    },
    include: {
      branding: true,
      pages: {
        where: { published: true },
      },
      locations: true,
      services: true,
      blogPosts: {
        where: { published: true },
      },
    },
  });

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add tenant homepages
  for (const tenant of tenants) {
    sitemapEntries.push({
      url: `${baseUrl}/${tenant.subdomain}`,
      lastModified: tenant.updatedAt,
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Add tenant pages
    for (const page of tenant.pages) {
      sitemapEntries.push({
        url: `${baseUrl}/${tenant.subdomain}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Add service pages
    for (const service of tenant.services) {
      sitemapEntries.push({
        url: `${baseUrl}/${tenant.subdomain}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Add location pages
    for (const location of tenant.locations) {
      sitemapEntries.push({
        url: `${baseUrl}/${tenant.subdomain}/locations/${location.slug}`,
        lastModified: location.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Add blog posts
    for (const post of tenant.blogPosts) {
      sitemapEntries.push({
        url: `${baseUrl}/${tenant.subdomain}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  return sitemapEntries;
}
```

### Sitemap Service Implementation

```typescript
// lib/seo/sitemap.ts
export class SitemapService {
  async generateTenantSitemap(tenantId: string): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const tenant = await this.getTenantWithContent(tenantId);

    const sitemapEntries = [
      this.createSitemapEntry(`${baseUrl}/${tenant.subdomain}`, tenant.updatedAt, 'daily', 1.0),
    ];

    // Add all tenant content
    sitemapEntries.push(...await this.generatePageEntries(tenant));
    sitemapEntries.push(...await this.generateServiceEntries(tenant));
    sitemapEntries.push(...await this.generateLocationEntries(tenant));
    sitemapEntries.push(...await this.generateBlogEntries(tenant));

    return this.generateSitemapXml(sitemapEntries);
  }

  private async getTenantWithContent(tenantId: string) {
    return await db.tenants.findUnique({
      where: { id: tenantId },
      include: {
        pages: { where: { published: true } },
        services: true,
        locations: true,
        blogPosts: { where: { published: true } },
      },
    });
  }

  private createSitemapEntry(
    url: string,
    lastModified: Date,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: number
  ): SitemapEntry {
    return {
      url,
      lastModified: lastModified.toISOString(),
      changeFrequency,
      priority: priority.toString(),
    };
  }

  private async generatePageEntries(tenant: any): Promise<SitemapEntry[]> {
    return tenant.pages.map((page: any) =>
      this.createSitemapEntry(
        `${process.env.NEXT_PUBLIC_APP_URL}/${tenant.subdomain}/${page.slug}`,
        page.updatedAt,
        'weekly',
        0.8
      )
    );
  }

  private async generateServiceEntries(tenant: any): Promise<SitemapEntry[]> {
    return tenant.services.map((service: any) =>
      this.createSitemapEntry(
        `${process.env.NEXT_PUBLIC_APP_URL}/${tenant.subdomain}/services/${service.slug}`,
        service.updatedAt,
        'monthly',
        0.7
      )
    );
  }

  private async generateLocationEntries(tenant: any): Promise<SitemapEntry[]> {
    return tenant.locations.map((location: any) =>
      this.createSitemapEntry(
        `${process.env.NEXT_PUBLIC_APP_URL}/${tenant.subdomain}/locations/${location.slug}`,
        location.updatedAt,
        'monthly',
        0.6
      )
    );
  }

  private async generateBlogEntries(tenant: any): Promise<SitemapEntry[]> {
    return tenant.blogPosts.map((post: any) =>
      this.createSitemapEntry(
        `${process.env.NEXT_PUBLIC_APP_URL}/${tenant.subdomain}/blog/${post.slug}`,
        post.updatedAt,
        'weekly',
        0.5
      )
    );
  }

  private generateSitemapXml(entries: SitemapEntry[]): string {
    const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
  }
}
```

---

## 🖼️ Dynamic OG Image Generation

### Social Media Image Generator

```typescript
// lib/seo/og-images.ts
import { ImageResponse } from 'next/og';

export class OGImageService {
  async generateOGImage(params: OGImageParams): Promise<ImageResponse> {
    const { title, description, tenantConfig, type = 'default' } = params;

    switch (type) {
      case 'blog':
        return this.generateBlogOGImage(title, description, tenantConfig);
      case 'service':
        return this.generateServiceOGImage(title, description, tenantConfig);
      case 'location':
        return this.generateLocationOGImage(title, description, tenantConfig);
      default:
        return this.generateDefaultOGImage(title, description, tenantConfig);
    }
  }

  private async generateDefaultOGImage(
    title: string,
    description: string,
    tenantConfig: TenantConfig
  ): Promise<ImageResponse> {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            backgroundColor: tenantConfig.branding?.primaryColor || '#000000',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            position: 'relative',
          }}
        >
          {tenantConfig.branding?.logoUrl && (
            <img
              src={tenantConfig.branding.logoUrl}
              alt={tenantConfig.branding.companyName}
              style={{
                position: 'absolute',
                top: '40px',
                left: '60px',
                height: '60px',
                width: 'auto',
              }}
            />
          )}
          
          <div style={{ textAlign: 'center', maxWidth: '900px' }}>
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                marginBottom: '30px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '32px',
                opacity: 0.9,
                marginBottom: '40px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
            
            <div
              style={{
                fontSize: '24px',
                opacity: 0.7,
                fontWeight: '500',
              }}
            >
              {tenantConfig.branding?.companyName}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  private async generateBlogOGImage(
    title: string,
    description: string,
    tenantConfig: TenantConfig
  ): Promise<ImageResponse> {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '8px',
              backgroundColor: tenantConfig.branding?.primaryColor || '#000000',
            }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            {tenantConfig.branding?.logoUrl && (
              <img
                src={tenantConfig.branding.logoUrl}
                alt={tenantConfig.branding.companyName}
                style={{
                  height: '50px',
                  width: 'auto',
                  marginRight: '20px',
                }}
              />
            )}
            <div style={{ fontSize: '18px', fontWeight: '600', opacity: 0.7 }}>
              BLOG
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                marginBottom: '20px',
                lineHeight: 1.2,
                color: tenantConfig.branding?.primaryColor || '#000000',
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '24px',
                opacity: 0.8,
                lineHeight: 1.4,
                marginBottom: '30px',
              }}
            >
              {description}
            </p>
            
            <div
              style={{
                fontSize: '18px',
                opacity: 0.6,
                fontStyle: 'italic',
              }}
            >
              {tenantConfig.branding?.companyName}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
```

### OG Image API Route

```typescript
// app/api/og/image/route.ts
import { NextRequest } from 'next/server';
import { OGImageService } from '@/lib/seo/og-images';

const ogImageService = new OGImageService();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const tenantId = searchParams.get('tenantId') || '';
  const type = searchParams.get('type') || 'default';

  if (!title || !tenantId) {
    return new Response('Missing required parameters', { status: 400 });
  }

  try {
    const tenantConfig = await getTenantConfig(tenantId);
    const image = await ogImageService.generateOGImage({
      title,
      description,
      tenantConfig,
      type: type as any,
    });

    return image;
  } catch (error) {
    console.error('OG image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

async function getTenantConfig(tenantId: string): Promise<TenantConfig> {
  const tenant = await db.tenants.findUnique({
    where: { id: tenantId },
    include: { branding: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }

  return {
    branding: tenant.branding,
  } as TenantConfig;
}
```

---

## 🔍 Structured Data System

### Schema.org Implementation

```typescript
// lib/seo/structured-data.ts
export class StructuredDataService {
  generateOrganizationSchema(tenantConfig: TenantConfig): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: tenantConfig.branding?.companyName,
      description: tenantConfig.branding?.description,
      url: tenantConfig.websiteUrl,
      logo: tenantConfig.branding?.logoUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: tenantConfig.contact?.phone,
        contactType: 'customer service',
        availableLanguage: ['en'],
      },
      address: tenantConfig.locations?.[0] ? {
        '@type': 'PostalAddress',
        streetAddress: tenantConfig.locations[0].address,
        addressLocality: tenantConfig.locations[0].city,
        addressRegion: tenantConfig.locations[0].state,
        postalCode: tenantConfig.locations[0].postalCode,
        addressCountry: tenantConfig.locations[0].country || 'US',
      } : undefined,
      sameAs: tenantConfig.social?.filter(Boolean) || [],
    };
  }

  generateServiceSchema(service: Service, tenantConfig: TenantConfig): ServiceSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: tenantConfig.branding?.companyName,
        url: tenantConfig.websiteUrl,
      },
      areaServed: service.locations?.map(location => ({
        '@type': 'City',
        name: `${location.city}, ${location.state}`,
      })) || [],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: service.plans?.map(plan => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: plan.name,
            description: plan.description,
          },
          price: plan.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        })) || [],
      },
    };
  }

  generateLocalBusinessSchema(tenantConfig: TenantConfig, location: TenantLocation): LocalBusinessSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: tenantConfig.branding?.companyName,
      description: tenantConfig.branding?.description,
      url: `${tenantConfig.websiteUrl}/locations/${location.slug}`,
      telephone: tenantConfig.contact?.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: location.city,
        addressRegion: location.state,
        postalCode: location.postalCode,
        addressCountry: location.country || 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.latitude,
        longitude: location.longitude,
      },
      openingHours: location.hours || 'Mo-Fr 09:00-17:00',
      servesCuisine: location.serviceAreas || [],
      priceRange: '$$',
    };
  }

  generateArticleSchema(article: BlogPost, tenantConfig: TenantConfig): ArticleSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImage,
      author: {
        '@type': 'Organization',
        name: tenantConfig.branding?.companyName,
        url: tenantConfig.websiteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: tenantConfig.branding?.companyName,
        logo: tenantConfig.branding?.logoUrl,
      },
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt.toISOString(),
      mainEntityOfPage: `${tenantConfig.websiteUrl}/blog/${article.slug}`,
    };
  }

  generateBreadcrumbSchema(breadcrumbs: Breadcrumb[]): BreadcrumbListSchema {
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

  generateFAQSchema(faqs: FAQ[]): FAQPageSchema {
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
// components/seo/StructuredData.tsx
interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}
```

---

## 🤖 Generative Engine Optimization (GEO)

### AI Search Optimization

```typescript
// lib/seo/geo.ts
export class GEOService {
  async generateLLMsTxt(tenantId: string): Promise<string> {
    const tenant = await this.getTenantWithContent(tenantId);
    
    const llmsTxt = `# LLMs.txt for ${tenant.branding?.companyName}

## Company Information
${tenant.branding?.companyName} is a professional services provider specializing in ${tenant.services?.map(s => s.name).join(', ')}.

## Services Offered
${tenant.services?.map(service => `
### ${service.name}
${service.description}
Areas served: ${service.locations?.map(l => `${l.city}, ${l.state}`).join(', ') || 'Nationwide'}
`).join('\n')}

## Service Areas
${tenant.locations?.map(location => `
### ${location.city}, ${location.state}
Address: ${location.address}
Services: ${location.serviceAreas?.join(', ') || 'All services'}
Phone: ${tenant.contact?.phone}
`).join('\n')}

## Contact Information
Website: ${tenant.websiteUrl}
Phone: ${tenant.contact?.phone}
Email: ${tenant.contact?.email}

## Frequently Asked Questions
${tenant.faqs?.map(faq => `
Q: ${faq.question}
A: ${faq.answer}
`).join('\n')}

## Content Summary
This document provides comprehensive information about ${tenant.branding?.companyName}'s services, locations, and contact details. We specialize in ${tenant.services?.map(s => s.name).join(', ')} and serve clients across ${tenant.locations?.map(l => l.city).join(', ') || 'multiple locations'}.

Generated: ${new Date().toISOString()}
Last Updated: ${tenant.updatedAt.toISOString()}
`;

    return llmsTxt;
  }

  async generateAIContextJSON(tenantId: string): Promise<AIContextJSON> {
    const tenant = await this.getTenantWithContent(tenantId);
    
    return {
      version: '1.0',
      company: {
        name: tenant.branding?.companyName,
        description: tenant.branding?.description,
        website: tenant.websiteUrl,
        founded: tenant.foundedYear,
        employees: tenant.employeeCount,
      },
      services: tenant.services?.map(service => ({
        name: service.name,
        description: service.description,
        category: service.category,
        features: service.features || [],
        pricing: service.plans?.map(plan => ({
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          features: plan.features || [],
        })) || [],
      })) || [],
      locations: tenant.locations?.map(location => ({
        city: location.city,
        state: location.state,
        address: location.address,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        serviceAreas: location.serviceAreas || [],
        hours: location.hours,
      })) || [],
      contact: {
        phone: tenant.contact?.phone,
        email: tenant.contact?.email,
        address: tenant.locations?.[0]?.address,
      },
      content: {
        blogPosts: tenant.blogPosts?.map(post => ({
          title: post.title,
          excerpt: post.excerpt,
          tags: post.tags,
          publishedAt: post.publishedAt,
        })) || [],
        pages: tenant.pages?.map(page => ({
          title: page.title,
          slug: page.slug,
          content: page.excerpt,
        })) || [],
      },
      seo: {
        keywords: tenant.seo?.defaultKeywords || [],
        targetAudience: tenant.seo?.targetAudience || [],
        valueProposition: tenant.branding?.tagline || '',
      },
    };
  }

  private async getTenantWithContent(tenantId: string) {
    return await db.tenants.findUnique({
      where: { id: tenantId },
      include: {
        branding: true,
        contact: true,
        services: {
          include: {
            plans: true,
            locations: true,
          },
        },
        locations: true,
        blogPosts: true,
        pages: true,
        seo: true,
        faqs: true,
      },
    });
  }
}
```

### LLMs.txt API Route

```typescript
// app/api/llms.txt/route.ts
import { NextResponse } from 'next/server';
import { GEOService } from '@/lib/seo/geo';

const geoService = new GEOService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant');

  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
  }

  try {
    const llmsTxt = await geoService.generateLLMsTxt(tenantId);
    
    return new NextResponse(llmsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate llms.txt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 📊 SEO Validation & Analytics

### SEO Validation Pipeline

```typescript
// lib/seo/validation.ts
export class SEOValidationService {
  async validatePageSEO(pageUrl: string, tenantId: string): Promise<SEOValidationResult> {
    const issues: SEOIssue[] = [];
    const score = await this.calculateSEOScore(pageUrl, tenantId);

    // Validate title
    const titleValidation = await this.validateTitle(pageUrl);
    issues.push(...titleValidation.issues);

    // Validate meta description
    const descValidation = await this.validateMetaDescription(pageUrl);
    issues.push(...descValidation.issues);

    // Validate headings
    const headingValidation = await this.validateHeadings(pageUrl);
    issues.push(...headingValidation.issues);

    // Validate images
    const imageValidation = await this.validateImages(pageUrl);
    issues.push(...imageValidation.issues);

    // Validate structured data
    const structuredDataValidation = await this.validateStructuredData(pageUrl);
    issues.push(...structuredDataValidation.issues);

    return {
      score,
      issues,
      recommendations: this.generateRecommendations(issues),
    };
  }

  private async validateTitle(pageUrl: string): Promise<{ issues: SEOIssue[] }> {
    const issues: SEOIssue[] = [];
    
    // Fetch page and analyze title
    const response = await fetch(pageUrl);
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    
    if (!titleMatch) {
      issues.push({
        type: 'error',
        message: 'Missing page title',
        impact: 'high',
      });
    } else {
      const title = titleMatch[1];
      
      if (title.length < 30) {
        issues.push({
          type: 'warning',
          message: 'Title too short (minimum 30 characters recommended)',
          impact: 'medium',
        });
      }
      
      if (title.length > 60) {
        issues.push({
          type: 'warning',
          message: 'Title too long (may be truncated in search results)',
          impact: 'medium',
        });
      }
    }

    return { issues };
  }

  private async validateMetaDescription(pageUrl: string): Promise<{ issues: SEOIssue[] }> {
    const issues: SEOIssue[] = [];
    
    const response = await fetch(pageUrl);
    const html = await response.text();
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
    
    if (!descMatch) {
      issues.push({
        type: 'error',
        message: 'Missing meta description',
        impact: 'high',
      });
    } else {
      const description = descMatch[1];
      
      if (description.length < 120) {
        issues.push({
          type: 'warning',
          message: 'Meta description too short (minimum 120 characters recommended)',
          impact: 'medium',
        });
      }
      
      if (description.length > 160) {
        issues.push({
          type: 'warning',
          message: 'Meta description too long (may be truncated in search results)',
          impact: 'medium',
        });
      }
    }

    return { issues };
  }

  private async calculateSEOScore(pageUrl: string, tenantId: string): Promise<number> {
    // Implement SEO scoring algorithm
    const factors = await this.getSEOFactors(pageUrl, tenantId);
    
    let score = 0;
    let totalWeight = 0;

    // Title factors
    if (factors.hasTitle) score += 20;
    if (factors.titleLength >= 30 && factors.titleLength <= 60) score += 10;
    totalWeight += 30;

    // Meta description factors
    if (factors.hasMetaDescription) score += 20;
    if (factors.descriptionLength >= 120 && factors.descriptionLength <= 160) score += 10;
    totalWeight += 30;

    // Heading factors
    if (factors.hasH1) score += 15;
    if (factors.properHeadingHierarchy) score += 10;
    totalWeight += 25;

    // Image factors
    if (factors.imagesHaveAlt) score += 10;
    totalWeight += 10;

    // Structured data factors
    if (factors.hasStructuredData) score += 5;
    totalWeight += 5;

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  }

  private generateRecommendations(issues: SEOIssue[]): string[] {
    return issues.map(issue => {
      switch (issue.type) {
        case 'error':
          return `Fix: ${issue.message}`;
        case 'warning':
          return `Consider: ${issue.message}`;
        case 'info':
          return `Suggestion: ${issue.message}`;
        default:
          return issue.message;
      }
    });
  }
}
```

---

## 📋 Implementation Checklist

### Setup Configuration

- [ ] **Metadata Factory**: Implement dynamic metadata generation
- [ ] **Sitemap Generation**: Set up multi-tenant sitemap system
- [ ] **OG Images**: Configure dynamic image generation
- [ ] **Structured Data**: Implement Schema.org markup
- [ ] **GEO Optimization**: Set up AI search optimization

### Content Optimization

- [ ] **Title Tags**: Optimize page titles (30-60 characters)
- [ ] **Meta Descriptions**: Write compelling descriptions (120-160 characters)
- [ ] **Heading Structure**: Use proper H1-H6 hierarchy
- [ ] **Image Optimization**: Add alt text and optimize file sizes
- [ ] **Internal Linking**: Implement strategic internal linking

### Technical SEO

- [ ] **Core Web Vitals**: Optimize LCP, FID, CLS
- [ ] **Mobile Optimization**: Ensure responsive design
- [ ] **Page Speed**: Optimize loading performance
- [ ] **SSL Certificate**: Implement HTTPS
- [ ] **XML Sitemaps**: Generate and submit sitemaps

### Monitoring & Analytics

- [ ] **Google Analytics**: Set up tracking
- [ ] **Search Console**: Configure and monitor
- [ ] **SEO Validation**: Implement automated checks
- [ ] **Performance Monitoring**: Track Core Web Vitals
- [ ] **Rank Tracking**: Monitor keyword rankings

---

## 🔗 References & Resources

### Documentation

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js SEO Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Best Practices

- **Content Quality**: Focus on valuable, original content
- **User Experience**: Prioritize user experience over search engines
- **Mobile-First**: Design for mobile users first
- **Page Speed**: Optimize for fast loading times

### 2026 SEO Standards

- **AI Search**: Optimize for generative AI search engines
- **Voice Search**: Optimize for voice search queries
- **E-A-T**: Demonstrate expertise, authoritativeness, trustworthiness
- **Core Web Vitals**: Meet Google's performance standards

---

This consolidated guide provides comprehensive SEO optimization patterns while eliminating redundant documentation and focusing on 2026 SEO standards and AI-powered search optimization.
