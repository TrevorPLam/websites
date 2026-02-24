/**
 * SEO Metadata Factory System
 * Type-safe metadata generation following Next.js 16 patterns
 */

import { Metadata } from 'next';
import { z } from 'zod';

// Tenant configuration schema
export const TenantConfigSchema = z.object({
  identity: z.object({
    siteName: z.string(),
    siteUrl: z.string().url(),
    logo: z.string().url().optional(),
    description: z.string(),
    contact: z.object({
      email: z.string().email(),
      phone: z.string().optional(),
      address: z
        .object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.string(),
        })
        .optional(),
    }),
  }),
  branding: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    theme: z.enum(['light', 'dark', 'auto']),
  }),
  seo: z.object({
    titleTemplate: z.string().optional(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional(),
    twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
    favicon: z.string().url().optional(),
  }),
});

export type TenantConfig = z.infer<typeof TenantConfigSchema>;

// Page type definitions
export type PageType =
  | 'home'
  | 'about'
  | 'services'
  | 'contact'
  | 'blog'
  | 'blog-post'
  | 'service-area'
  | 'privacy'
  | 'terms';

// Page-specific metadata defaults
const pageDefaults: Record<PageType, Partial<Metadata>> = {
  home: {
    title: 'Home',
    description: 'Welcome to our website',
  },
  about: {
    title: 'About Us',
    description: 'Learn more about our company and team',
  },
  services: {
    title: 'Our Services',
    description: 'Discover our comprehensive range of services',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with our team',
  },
  blog: {
    title: 'Blog',
    description: 'Read our latest articles and insights',
  },
  'blog-post': {
    title: 'Blog Post',
    description: 'Read this article',
  },
  'service-area': {
    title: 'Service Area',
    description: 'Services available in your area',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Our privacy policy and data protection practices',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Our terms of service and usage policies',
  },
};

/**
 * Generate tenant-aware metadata
 */
export function generateTenantMetadata(options: {
  tenantConfig: TenantConfig;
  page: PageType;
  overrides?: Partial<Metadata>;
}): Metadata {
  const { tenantConfig, page, overrides = {} } = options;

  // Base metadata from tenant config
  const baseMetadata: Metadata = {
    title: tenantConfig.identity.siteName,
    description: tenantConfig.seo.description,
    metadataBase: new URL(tenantConfig.identity.siteUrl),
    icons: {
      icon: tenantConfig.seo.favicon || '/favicon.ico',
    },
  };

  // Page-specific defaults
  const pageMetadata = pageDefaults[page] || {};

  // Open Graph metadata
  const openGraph: Metadata['openGraph'] = {
    type: 'website',
    locale: 'en_US',
    url: tenantConfig.identity.siteUrl,
    siteName: tenantConfig.identity.siteName,
    title: tenantConfig.seo.titleTemplate
      ? tenantConfig.seo.titleTemplate.replace(/%s/g, (pageMetadata.title || 'Home') as string)
      : pageMetadata.title || tenantConfig.identity.siteName,
    description: pageMetadata.description || tenantConfig.seo.description,
    images: tenantConfig.seo.ogImage
      ? [
          {
            url: tenantConfig.seo.ogImage,
            width: 1200,
            height: 630,
            alt: `${tenantConfig.identity.siteName} - ${pageMetadata.title || 'Home'}`,
          },
        ]
      : [],
  };

  // Twitter Card metadata
  const twitter: Metadata['twitter'] = {
    card: tenantConfig.seo.twitterCard || 'summary',
    title: pageMetadata.title || tenantConfig.identity.siteName,
    description: pageMetadata.description || tenantConfig.seo.description,
    images: tenantConfig.seo.ogImage ? [tenantConfig.seo.ogImage] : [],
  };

  // Robots metadata
  const robots: Metadata['robots'] = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  // Verification metadata
  const verification: Metadata['verification'] = {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  };

  // Combine all metadata
  return {
    ...baseMetadata,
    ...pageMetadata,
    ...overrides,
    openGraph: {
      ...openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...twitter,
      ...overrides.twitter,
    },
    robots: {
      ...robots,
      ...(overrides.robots && typeof overrides.robots === 'object' ? overrides.robots : {}),
    },
    verification: {
      ...verification,
      ...overrides.verification,
    },
  };
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogPostMetadata(options: {
  tenantConfig: TenantConfig;
  post: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author?: string;
    image?: string;
    slug: string;
  };
  overrides?: Partial<Metadata>;
}): Metadata {
  const { tenantConfig, post, overrides = {} } = options;

  const baseMetadata = generateTenantMetadata({
    tenantConfig,
    page: 'blog-post',
    overrides: {
      title: post.title,
      description: post.description,
    },
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: post.author ? [post.author] : [],
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : baseMetadata.openGraph?.images || [],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : baseMetadata.twitter?.images || [],
    },
    ...overrides,
  };
}

/**
 * Generate metadata for service area pages
 */
export function generateServiceAreaMetadata(options: {
  tenantConfig: TenantConfig;
  serviceArea: {
    name: string;
    description: string;
    location: string;
    services: string[];
  };
  overrides?: Partial<Metadata>;
}): Metadata {
  const { tenantConfig, serviceArea, overrides = {} } = options;

  const locationKeywords = serviceArea.services
    .map((service) => `${service} in ${serviceArea.location}`)
    .join(', ');

  return generateTenantMetadata({
    tenantConfig,
    page: 'service-area',
    overrides: {
      title: `${serviceArea.name} - ${serviceArea.location}`,
      description: `${serviceArea.description}. Serving ${serviceArea.location} with ${serviceArea.services.join(', ')}.`,
      keywords: locationKeywords,
    },
    ...overrides,
  });
}

/**
 * Validate metadata configuration
 */
export function validateTenantMetadata(config: unknown): TenantConfig {
  return TenantConfigSchema.parse(config);
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(options: {
  tenantConfig: TenantConfig;
  page: PageType;
  data?: Record<string, unknown>;
}): string {
  const { tenantConfig, page, data = {} } = options;

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': page === 'home' ? 'Organization' : 'WebPage',
    name: tenantConfig.identity.siteName,
    url: tenantConfig.identity.siteUrl,
    description: tenantConfig.seo.description,
    logo: tenantConfig.identity.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: tenantConfig.identity.contact.phone,
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    ...data,
  };

  return JSON.stringify(baseStructuredData, null, 2);
}
