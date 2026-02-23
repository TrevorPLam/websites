# site-config-schema-documentation.md

## Overview

The `site.config.ts` file serves as the central configuration hub for marketing websites in this monorepo. It defines site metadata, feature flags, integration settings, theme configuration, and conversion flows. This documentation covers the complete schema reference, validation patterns, and best practices for managing site configuration in 2026.

## Core Schema Structure

### SiteConfig Interface

Based on the actual project structure in `packages/types/src/site-config.ts`:

```typescript
export interface SiteConfig {
  // Basic site information
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  industry: IndustryType;

  // Feature flags and layout variants
  features: SiteFeatures;

  // Third-party integrations
  integrations: IntegrationsConfig;

  // Navigation and layout
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  footer: FooterConfig;

  // Contact information
  contact: ContactInfo;

  // SEO defaults
  seo: SeoDefaults;

  // Theme configuration
  theme: ThemeConfig;

  // Conversion flow configuration
  conversionFlow: ConversionFlowConfig;

  // Consent management
  consent?: ConsentConfig;

  // Optional per-page section IDs
  pageSections?: Partial<Record<string, string[]>>;
}
```

## Detailed Schema Reference

### Basic Site Information

```typescript
interface SiteMetadata {
  id: string; // Machine-readable ID, e.g. "hair-salon"
  name: string; // Display name for nav, meta tags
  tagline: string; // One-liner under logo/meta descriptions
  description: string; // Longer description for SEO/about pages
  url: string; // Canonical production URL (no trailing slash)
  industry: IndustryType; // Industry classification
}

type IndustryType =
  | 'salon'
  | 'restaurant'
  | 'law-firm'
  | 'dental'
  | 'medical'
  | 'fitness'
  | 'retail'
  | 'consulting'
  | 'realestate'
  | 'construction'
  | 'automotive'
  | 'general';
```

### Feature Flags

```typescript
interface SiteFeatures {
  // Core sections
  hero: 'centered' | 'split' | 'video' | 'carousel' | null;
  services: 'grid' | 'list' | 'tabs' | 'accordion' | null;
  team: 'grid' | 'carousel' | 'detailed' | null;
  testimonials: 'carousel' | 'grid' | 'marquee' | null;
  pricing: 'table' | 'cards' | 'calculator' | null;
  contact: 'simple' | 'multi-step' | 'with-booking' | null;
  gallery: 'grid' | 'carousel' | 'lightbox' | null;

  // Boolean features
  blog: boolean;
  booking: boolean;
  faq: boolean;

  // Industry-specific features (optional)
  location?: boolean;
  menu?: boolean;
  portfolio?: boolean;
  caseStudy?: boolean;
  jobListing?: boolean;
  course?: boolean;
  resource?: boolean;
  comparison?: boolean;
  filter?: boolean;
  search?: boolean;
  socialProof?: boolean;
  video?: boolean;
  audio?: boolean;
  interactive?: boolean;
  widget?: boolean;
}
```

### Integration Configuration

```typescript
interface IntegrationsConfig {
  analytics?: {
    provider: 'google' | 'plausible' | 'none';
    trackingId?: string;
    config?: {
      eventTracking?: boolean;
      anonymizeIp?: boolean;
    };
  };

  crm?: {
    provider: 'hubspot' | 'none';
    portalId?: string;
  };

  booking?: {
    provider: 'internal' | 'calendly' | 'acuity' | 'none';
    config?: Record<string, unknown>;
  };

  email?: {
    provider: 'mailchimp' | 'sendgrid' | 'none';
    config?: Record<string, unknown>;
  };

  chat?: {
    provider: 'intercom' | 'crisp' | 'tidio' | 'none';
    config?: {
      websiteId?: string;
      theme?: string;
    };
  };

  reviews?: {
    provider: 'google' | 'yelp' | 'trustpilot' | 'none';
    config?: Record<string, unknown>;
  };

  maps?: {
    provider: 'google' | 'none';
    config?: {
      static?: boolean;
      interactive?: boolean;
      apiKey?: string;
    };
  };

  abTesting?: {
    provider: 'none'; // Future expansion
    config?: Record<string, unknown>;
  };
}
```

### Navigation and Layout

```typescript
interface NavLink {
  href: string;
  label: string;
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';
  url: string;
}

interface FooterColumn {
  heading: string;
  links: NavLink[];
}

interface FooterConfig {
  columns: FooterColumn[];
  legalLinks: NavLink[];
  copyrightTemplate: string; // e.g. "© {year} Acme Inc. All rights reserved."
}
```

### Contact Information

```typescript
interface BusinessHours {
  label: string; // e.g. "Tue – Fri"
  hours: string; // e.g. "10 am – 7 pm"
}

interface ContactInfo {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  hours?: BusinessHours[];
}
```

### SEO Configuration

```typescript
interface SeoDefaults {
  titleTemplate: string; // e.g. "%s | Acme Plumbing"
  defaultDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  schemaType?: string; // JSON-LD organization type
}
```

### Theme Configuration

```typescript
interface ThemeColors {
  // HSL values as strings, e.g. "174 85% 33%" (no hsl() wrapper)
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  card: string;
  'card-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  border: string;
  input: string;
  ring: string;
}

interface ThemeFonts {
  heading: string; // e.g. "Inter, system-ui, sans-serif"
  body: string;
  accent?: string;
}

interface ThemeConfig {
  preset?: 'minimal' | 'bold' | 'professional';
  colors: Partial<ThemeColors>; // Partial overrides merged with defaults
  fonts?: ThemeFonts;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadows?: 'none' | 'small' | 'medium' | 'large';
}
```

### Conversion Flow Configuration

```typescript
// Discriminated union based on flow type
type ConversionFlowConfig =
  | BookingFlowConfig
  | ContactFlowConfig
  | QuoteFlowConfig
  | DispatchFlowConfig;

interface BookingFlowConfig {
  type: 'booking';
  serviceCategories: string[];
  timeSlots: { value: string; label: string }[];
  maxAdvanceDays: number;
}

interface ContactFlowConfig {
  type: 'contact';
  subjects?: string[];
}

interface QuoteFlowConfig {
  type: 'quote';
  serviceCategories: string[];
  allowAttachments?: boolean;
}

interface DispatchFlowConfig {
  type: 'dispatch';
  urgencyLevels: { value: string; label: string }[];
}
```

### Consent Management

```typescript
interface ConsentConfig {
  cmpProvider?: 'termly' | 'cookie-script' | 'custom';
  categories?: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  };
}
```

## Validation with Zod

### Complete Schema Validation

The project uses Zod for runtime validation:

```typescript
import { z } from 'zod';

export const siteConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  industry: z.enum([
    'salon',
    'restaurant',
    'law-firm',
    'dental',
    'medical',
    'fitness',
    'retail',
    'consulting',
    'realestate',
    'construction',
    'automotive',
    'general',
  ]),
  // ... full validation schema
});
```

### Validation Usage

```typescript
// Validate configuration at runtime
import { siteConfigSchema } from '@repo/types';
import siteConfig from './site.config';

const result = siteConfigSchema.safeParse(siteConfig);
if (!result.success) {
  console.error('Invalid site configuration:', result.error);
  process.exit(1);
}
```

## Configuration Examples

### Basic Salon Website

```typescript
const siteConfig: SiteConfig = {
  id: 'hair-salon',
  name: 'Style Studio',
  tagline: 'Premium Hair Services',
  description: 'Professional hair salon offering cutting, coloring, and styling services',
  url: 'https://stylestudio.com',
  industry: 'salon',

  features: {
    hero: 'split',
    services: 'grid',
    team: 'carousel',
    testimonials: 'carousel',
    pricing: 'cards',
    contact: 'with-booking',
    gallery: 'lightbox',
    blog: true,
    booking: true,
    faq: true,
    location: true,
    portfolio: true,
  },

  integrations: {
    analytics: { provider: 'google', trackingId: 'GA-MEASUREMENT-ID' },
    booking: { provider: 'internal' },
    email: { provider: 'mailchimp' },
  },

  navLinks: [
    { href: '/services', label: 'Services' },
    { href: '/team', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/book', label: 'Book Appointment' },
  ],

  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/stylestudio' },
    { platform: 'facebook', url: 'https://facebook.com/stylestudio' },
  ],

  footer: {
    columns: [
      {
        heading: 'Services',
        links: [
          { href: '/services/haircuts', label: 'Haircuts' },
          { href: '/services/coloring', label: 'Coloring' },
        ],
      },
    ],
    legalLinks: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
    copyrightTemplate: '© {year} Style Studio. All rights reserved.',
  },

  contact: {
    email: 'hello@stylestudio.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
    hours: [
      { label: 'Mon - Fri', hours: '9:00 AM - 7:00 PM' },
      { label: 'Sat', hours: '9:00 AM - 5:00 PM' },
    ],
  },

  conversionFlow: {
    type: 'booking',
    serviceCategories: ['Haircut', 'Coloring', 'Styling', 'Treatment'],
    timeSlots: [
      { value: '09:00', label: '9:00 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '11:00', label: '11:00 AM' },
    ],
    maxAdvanceDays: 30,
  },

  seo: {
    titleTemplate: '%s | Style Studio',
    defaultDescription: 'Professional hair salon offering cutting, coloring, and styling services',
    schemaType: 'HairSalon',
  },

  theme: {
    preset: 'professional',
    colors: {
      primary: '280 84% 60%',
      accent: '280 84% 95%',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: 'medium',
    shadows: 'medium',
  },

  consent: {
    cmpProvider: 'custom',
    categories: {
      analytics: true,
      marketing: false,
      functional: true,
    },
  },
};
```

## Environment-specific Configuration

### Environment Variables

```typescript
const siteConfig: SiteConfig = {
  // ... other config
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  integrations: {
    analytics: {
      provider: 'google',
      trackingId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
    // ... other integrations
  },
};
```

### Build-time Validation

```typescript
// scripts/validate-config.ts
import { siteConfigSchema } from '@repo/types';
import siteConfig from '../site.config';

function validateConfig() {
  const result = siteConfigSchema.safeParse(siteConfig);

  if (!result.success) {
    console.error('❌ Invalid site configuration:');
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  console.log('✅ Site configuration is valid');
}

validateConfig();
```

## Best Practices

### Configuration Management

1. **Type Safety**: Always use TypeScript interfaces for configuration
2. **Validation**: Validate configuration at build time and runtime
3. **Environment Separation**: Use environment variables for sensitive data
4. **Default Values**: Provide sensible defaults for optional fields
5. **Documentation**: Document all configuration options and their effects

### Performance Optimization

1. **Lazy Loading**: Load configuration modules only when needed
2. **Memoization**: Cache processed configuration values
3. **Bundle Size**: Tree-shake unused configuration properties
4. **Validation Caching**: Cache validation results in production

### Security Considerations

1. **Secrets Management**: Never store API keys in configuration files
2. **Environment Variables**: Use environment variables for sensitive data
3. **Validation**: Validate all external configuration inputs
4. **Type Safety**: Use strict TypeScript types to prevent runtime errors

## Integration Patterns

### Next.js Integration

```typescript
// next.config.js
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...defaultConfig,
    env: {
      SITE_URL: isDev ? 'http://localhost:3000' : 'https://yourdomain.com',
    },
    // ... other Next.js config
  };
};
```

### Component Integration

```typescript
// components/theme-provider.tsx
'use client';

import { createContext, useContext } from 'react';
import { siteConfig } from '@/site.config';

interface ThemeContextValue {
  theme: SiteConfig['theme'];
  colors: SiteConfig['theme']['colors'];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = {
    theme: siteConfig.theme,
    colors: {
      ...DEFAULT_THEME_COLORS,
      ...siteConfig.theme.colors
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Troubleshooting

### Common Issues

1. **Type Mismatches**: Ensure configuration matches the SiteConfig interface
2. **Validation Failures**: Check Zod schema validation error messages
3. **Environment Variables**: Verify all required environment variables are set
4. **Build Errors**: Ensure configuration imports are correct in build scripts

### Debug Configuration

```typescript
// Debug utility for development
if (process.env.NODE_ENV === 'development') {
  console.log('Site Configuration:', {
    id: siteConfig.id,
    industry: siteConfig.industry,
    features: Object.keys(siteConfig.features),
    integrations: Object.keys(siteConfig.integrations),
  });
}
```

## References

- [SiteConfig Type Definitions](../../packages/types/src/site-config.ts)
- [Zod Documentation](https://zod.dev/)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
  author?: string;
  keywords?: string[];
  social?: SocialLinks;
  legal?: LegalInfo;
  }

````

### Complete Configuration Example

```typescript
// site.config.ts
import { z } from 'zod';
import type { SiteConfig } from './types/site-config';

const siteConfig: SiteConfig = {
  site: {
    name: 'My Application',
    description: 'A modern web application built with Next.js',
    url: 'https://myapp.com',
    logo: '/images/logo.svg',
    favicon: '/favicon.ico',
    language: 'en',
    locale: 'en-US',
    timezone: 'America/New_York',
    author: 'Development Team',
    keywords: ['nextjs', 'react', 'typescript', 'web development'],
    social: {
      twitter: '@myapp',
      github: 'myorg/myapp',
      linkedin: 'company/myapp'
    },
    legal: {
      privacyPolicy: '/privacy',
      termsOfService: '/terms',
      copyright: '© 2026 My Company. All rights reserved.'
    }
  },

  build: {
    output: 'standalone',
    trailingSlash: false,
    compress: true,
    poweredByHeader: false,
    optimizeFonts: true,
    optimizeCss: true,
    swcMinify: true,
    experimental: {
      serverComponentsExternalPackages: ['@prisma/client'],
      appDir: true,
      serverActions: true,
      incrementalCacheHandlerPath: './cache-handler.ts'
    }
  },

  features: {
    analytics: true,
    auth: true,
    i18n: false,
    darkMode: true,
    search: true,
    comments: false,
    newsletter: true,
    sitemap: true,
    robots: true,
    rss: false
  },

  environment: {
    nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    cdnBaseUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
    databaseUrl: process.env.DATABASE_URL || '',
    redisUrl: process.env.REDIS_URL || ''
  },

  analytics: {
    provider: 'google',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    vercelAnalytics: true,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  },

  auth: {
    provider: 'auth0',
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    callbackUrl: '/api/auth/callback',
    logoutUrl: '/api/auth/logout'
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
    domains: [
      {
        domain: 'myapp.com',
        defaultLocale: 'en'
      },
      {
        domain: 'myapp.es',
        defaultLocale: 'es'
      }
    ]
  },

  seo: {
    defaultTitle: 'My Application',
    titleTemplate: '%s | My Application',
    description: 'A modern web application built with Next.js',
    openGraph: {
      type: 'website',
      siteName: 'My Application',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'My Application'
        }
      ]
    },
    twitter: {
      handle: '@myapp',
      site: '@myapp',
      cardType: 'summary_large_image'
    }
  },

  performance: {
    enableBundleAnalyzer: process.env.ANALYZE === 'true',
    enableImageOptimization: true,
    enableScriptOptimization: true,
    enableFontOptimization: true,
    compressionEnabled: true,
    cacheControl: {
      maxAge: 31536000, // 1 year
      staleWhileRevalidate: 86400 // 1 day
    }
  }
};

export default siteConfig;
````

## Schema Validation

### Zod Schema Definition

```typescript
// schemas/site-config.schema.ts
import { z } from 'zod';

export const SocialLinksSchema = z.object({
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

export const LegalInfoSchema = z.object({
  privacyPolicy: z.string().url(),
  termsOfService: z.string().url(),
  copyright: z.string(),
});

export const SiteMetadataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  url: z.string().url(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  language: z.string().length(2),
  locale: z.string().min(2),
  timezone: z.string(),
  author: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  social: SocialLinksSchema.optional(),
  legal: LegalInfoSchema.optional(),
});

export const BuildConfigSchema = z.object({
  output: z.enum(['export', 'standalone', 'hybrid']),
  trailingSlash: z.boolean(),
  compress: z.boolean(),
  poweredByHeader: z.boolean(),
  optimizeFonts: z.boolean(),
  optimizeCss: z.boolean(),
  swcMinify: z.boolean(),
  experimental: z.object({
    serverComponentsExternalPackages: z.array(z.string()),
    appDir: z.boolean(),
    serverActions: z.boolean(),
    incrementalCacheHandlerPath: z.string().optional(),
  }),
});

export const FeatureFlagsSchema = z.object({
  analytics: z.boolean(),
  auth: z.boolean(),
  i18n: z.boolean(),
  darkMode: z.boolean(),
  search: z.boolean(),
  comments: z.boolean(),
  newsletter: z.boolean(),
  sitemap: z.boolean(),
  robots: z.boolean(),
  rss: z.boolean(),
});

export const SiteConfigSchema = z.object({
  site: SiteMetadataSchema,
  build: BuildConfigSchema,
  features: FeatureFlagsSchema,
  environment: z.object({
    nodeEnv: z.enum(['development', 'production', 'test']),
    isDevelopment: z.boolean(),
    isProduction: z.boolean(),
    isTest: z.boolean(),
    apiBaseUrl: z.string().url(),
    cdnBaseUrl: z.string().url().optional(),
    databaseUrl: z.string().optional(),
    redisUrl: z.string().optional(),
  }),
});

export type SiteConfigType = z.infer<typeof SiteConfigSchema>;
```

### Runtime Validation

```typescript
// utils/config-validator.ts
import { SiteConfigSchema } from '../schemas/site-config.schema';
import siteConfig from '../site.config';

export function validateSiteConfig(config: unknown): SiteConfigType {
  try {
    return SiteConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Site configuration validation failed:', error.errors);
      throw new Error(`Invalid site configuration: ${error.message}`);
    }
    throw error;
  }
}

// Validate configuration at startup
export const validatedConfig = validateSiteConfig(siteConfig);

// Environment-specific validation
export function validateEnvironmentConfig(): void {
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL', 'DATABASE_URL'];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}
```

## Environment-Specific Configuration

### Development Configuration

```typescript
// site.config.dev.ts
import { SiteConfig } from './types/site-config';
import baseConfig from './site.config';

const devConfig: Partial<SiteConfig> = {
  environment: {
    ...baseConfig.environment,
    nodeEnv: 'development',
    isDevelopment: true,
    isProduction: false,
    isTest: false,
    apiBaseUrl: 'http://localhost:3000',
    cdnBaseUrl: '',
  },

  analytics: {
    ...baseConfig.analytics,
    googleAnalyticsId: undefined, // Disable in development
    vercelAnalytics: false,
  },

  performance: {
    ...baseConfig.performance,
    enableBundleAnalyzer: true,
    compressionEnabled: false,
  },

  features: {
    ...baseConfig.features,
    analytics: false, // Disable analytics in development
  },
};

export default { ...baseConfig, ...devConfig };
```

### Production Configuration

```typescript
// site.config.prod.ts
import { SiteConfig } from './types/site-config';
import baseConfig from './site.config';

const prodConfig: Partial<SiteConfig> = {
  environment: {
    ...baseConfig.environment,
    nodeEnv: 'production',
    isDevelopment: false,
    isProduction: true,
    isTest: false,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
    cdnBaseUrl: process.env.NEXT_PUBLIC_CDN_URL,
  },

  build: {
    ...baseConfig.build,
    compress: true,
    swcMinify: true,
    optimizeFonts: true,
    optimizeCss: true,
  },

  performance: {
    ...baseConfig.performance,
    enableBundleAnalyzer: false,
    compressionEnabled: true,
    cacheControl: {
      maxAge: 31536000,
      staleWhileRevalidate: 86400,
    },
  },
};

export default { ...baseConfig, ...prodConfig };
```

### Configuration Selector

```typescript
// utils/config-selector.ts
import devConfig from '../site.config.dev';
import prodConfig from '../site.config.prod';
import baseConfig from '../site.config';

export function getSiteConfig(): SiteConfig {
  const nodeEnv = process.env.NODE_ENV;

  switch (nodeEnv) {
    case 'development':
      return devConfig;
    case 'production':
      return prodConfig;
    default:
      return baseConfig;
  }
}

export const siteConfig = getSiteConfig();
```

## Advanced Configuration Patterns

### Multi-Tenant Configuration

```typescript
// types/multi-tenant-config.ts
export interface TenantConfig {
  tenantId: string;
  site: SiteMetadata;
  features: FeatureFlags;
  branding: BrandingConfig;
  domains: string[];
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  favicon: string;
  customCSS?: string;
}

// multi-tenant.config.ts
export const tenantConfigs: Record<string, TenantConfig> = {
  'tenant-a': {
    tenantId: 'tenant-a',
    site: {
      name: 'Tenant A Application',
      description: 'Customized application for Tenant A',
      url: 'https://tenant-a.myapp.com',
      logo: '/logos/tenant-a.svg',
      language: 'en',
      locale: 'en-US',
      timezone: 'America/New_York',
    },
    features: {
      analytics: true,
      auth: true,
      i18n: false,
      darkMode: true,
      search: true,
      comments: false,
      newsletter: true,
      sitemap: true,
      robots: true,
      rss: false,
    },
    branding: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      logo: '/logos/tenant-a.svg',
      favicon: '/favicons/tenant-a.ico',
    },
    domains: ['tenant-a.myapp.com', 'www.tenant-a.com'],
  },
  'tenant-b': {
    tenantId: 'tenant-b',
    site: {
      name: 'Tenant B Application',
      description: 'Customized application for Tenant B',
      url: 'https://tenant-b.myapp.com',
      logo: '/logos/tenant-b.svg',
      language: 'es',
      locale: 'es-ES',
      timezone: 'Europe/Madrid',
    },
    features: {
      analytics: true,
      auth: true,
      i18n: true,
      darkMode: true,
      search: true,
      comments: true,
      newsletter: false,
      sitemap: true,
      robots: true,
      rss: true,
    },
    branding: {
      primaryColor: '#28a745',
      secondaryColor: '#6f42c1',
      logo: '/logos/tenant-b.svg',
      favicon: '/favicons/tenant-b.ico',
    },
    domains: ['tenant-b.myapp.com', 'www.tenant-b.es'],
  },
};
```

### Feature Flag Integration

```typescript
// utils/feature-flags.ts
import { siteConfig } from '../site.config';

export class FeatureFlags {
  static isEnabled(feature: keyof FeatureFlags): boolean {
    return siteConfig.features[feature];
  }

  static isAnalyticsEnabled(): boolean {
    return this.isEnabled('analytics') && siteConfig.environment.isProduction;
  }

  static isAuthEnabled(): boolean {
    return this.isEnabled('auth');
  }

  static isI18nEnabled(): boolean {
    return this.isEnabled('i18n');
  }

  static isDarkModeEnabled(): boolean {
    return this.isEnabled('darkMode');
  }

  static isSearchEnabled(): boolean {
    return this.isEnabled('search');
  }

  static areCommentsEnabled(): boolean {
    return this.isEnabled('comments');
  }

  static isNewsletterEnabled(): boolean {
    return this.isEnabled('newsletter');
  }

  static isSitemapEnabled(): boolean {
    return this.isEnabled('sitemap');
  }

  static areRobotsEnabled(): boolean {
    return this.isEnabled('robots');
  }

  static isRSSEnabled(): boolean {
    return this.isEnabled('rss');
  }
}

// React hook for feature flags
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  return FeatureFlags.isEnabled(feature);
}
```

### Dynamic Configuration

```typescript
// utils/dynamic-config.ts
export class DynamicConfig {
  private static cache = new Map<string, any>();

  static async getConfig(key: string): Promise<any> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const response = await fetch(`/api/config/${key}`);
      const config = await response.json();

      this.cache.set(key, config);
      return config;
    } catch (error) {
      console.error(`Failed to fetch config for ${key}:`, error);
      return null;
    }
  }

  static async updateConfig(key: string, value: any): Promise<void> {
    try {
      const response = await fetch(`/api/config/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });

      if (response.ok) {
        this.cache.set(key, value);
      }
    } catch (error) {
      console.error(`Failed to update config for ${key}:`, error);
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
```

## Usage Patterns

### Accessing Configuration in Components

```typescript
// components/SEOHead.tsx
import Head from 'next/head';
import { siteConfig } from '../site.config';

export function SEOHead(): JSX.Element {
  return (
    <Head>
      <title>{siteConfig.seo.defaultTitle}</title>
      <meta name="description" content={siteConfig.seo.description} />
      <meta name="keywords" content={siteConfig.site.keywords?.join(', ')} />

      <meta property="og:title" content={siteConfig.seo.defaultTitle} />
      <meta property="og:description" content={siteConfig.seo.description} />
      <meta property="og:url" content={siteConfig.site.url} />
      <meta property="og:site_name" content={siteConfig.site.name} />

      <meta name="twitter:card" content={siteConfig.seo.twitter.cardType} />
      <meta name="twitter:site" content={siteConfig.seo.twitter.site} />

      <link rel="icon" href={siteConfig.site.favicon} />
      <link rel="canonical" href={siteConfig.site.url} />
    </Head>
  );
}
```

### Configuration in API Routes

```typescript
// pages/api/config/[key].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { siteConfig } from '../../../site.config';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  const { key } = req.query;

  if (!key || typeof key !== 'string') {
    res.status(400).json({ error: 'Invalid key parameter' });
    return;
  }

  const keys = key.split('.');
  let value: any = siteConfig;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      res.status(404).json({ error: 'Configuration key not found' });
      return;
    }
  }

  res.status(200).json({ [key]: value });
}
```

### Configuration in Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { siteConfig } from './site.config';

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Add security headers
  if (siteConfig.environment.isProduction) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  // Add feature flag headers
  response.headers.set('X-Feature-Flags', JSON.stringify(siteConfig.features));

  return response;
}
```

## Best Practices

### Configuration Organization

```typescript
// config/index.ts - Central configuration export
export { default as siteConfig } from '../site.config';
export { validateSiteConfig } from '../utils/config-validator';
export { getSiteConfig } from '../utils/config-selector';
export { FeatureFlags } from '../utils/feature-flags';

// Types
export type { SiteConfig, SiteMetadata, FeatureFlags } from '../types/site-config';
export type { SiteConfigType } from '../schemas/site-config.schema';
```

### Environment Variable Management

```typescript
// config/env-vars.ts
export const requiredEnvVars = {
  // Public
  NEXT_PUBLIC_API_URL: 'string',
  NEXT_PUBLIC_CDN_URL: 'string',
  NEXT_PUBLIC_GA_ID: 'string',

  // Private
  DATABASE_URL: 'string',
  REDIS_URL: 'string',
  SESSION_SECRET: 'string',
  AUTH0_CLIENT_SECRET: 'string',
} as const;

export const optionalEnvVars = {
  NEXT_PUBLIC_HOTJAR_ID: 'string',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'string',
  ANALYZE: 'boolean',
} as const;

export function validateEnvironment(): void {
  const missing = Object.entries(requiredEnvVars)
    .filter(([key]) => !process.env[key])
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### Type Safety

```typescript
// utils/config-helpers.ts
import { siteConfig } from '../site.config';
import type { SiteConfig } from '../types/site-config';

export function getConfigValue<K extends keyof SiteConfig>(key: K): SiteConfig[K] {
  return siteConfig[key];
}

export function getNestedValue<T>(obj: any, path: string): T | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Usage examples
const siteName = getConfigValue('site').name;
const apiBaseUrl = getNestedValue<string>(siteConfig, 'environment.apiBaseUrl');
```

## Testing Configuration

### Unit Tests

```typescript
// __tests__/site-config.test.ts
import { validateSiteConfig } from '../utils/config-validator';
import siteConfig from '../site.config';

describe('Site Configuration', () => {
  it('should validate the configuration', () => {
    expect(() => validateSiteConfig(siteConfig)).not.toThrow();
  });

  it('should have required site metadata', () => {
    expect(siteConfig.site.name).toBeDefined();
    expect(siteConfig.site.description).toBeDefined();
    expect(siteConfig.site.url).toBeDefined();
  });

  it('should have valid feature flags', () => {
    expect(typeof siteConfig.features.analytics).toBe('boolean');
    expect(typeof siteConfig.features.auth).toBe('boolean');
  });

  it('should have valid environment configuration', () => {
    expect(['development', 'production', 'test']).toContain(siteConfig.environment.nodeEnv);
  });
});
```

### Integration Tests

```typescript
// __tests__/config-api.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/config/[key]';

describe('Configuration API', () => {
  it('should return configuration values', async () => {
    const { req, res } = createMocks({
      query: { key: 'site.name' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('site.name');
  });

  it('should handle invalid keys', async () => {
    const { req, res } = createMocks({
      query: { key: 'invalid.key' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
```

## References

- [Next.js Configuration Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js)
- [Next.js TypeScript Configuration](https://nextjs.org/docs/app/api-reference/config/typescript)
- [Zod Schema Validation](https://zod.dev/)
- [Environment Variables Best Practices](https://nextjs.org/docs/basic-features/environment-variables)
