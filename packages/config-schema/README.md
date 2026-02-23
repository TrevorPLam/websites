# Site Configuration Schema Usage Guide

**Package:** `@repo/config-schema`  
**Version:** 0.0.0  
**Updated:** 2026-02-23

---

## Overview

The site configuration schema provides type-safe validation for `site.config.ts` files across all client sites. It implements the configuration-as-code philosophy with comprehensive validation for identity, theme, SEO, integrations, and compliance settings.

---

## Quick Start

### Installation

```bash
# Already available in workspace
pnpm add @repo/config-schema
```

### Basic Usage

```typescript
import { SiteConfigSchema, validateSiteConfig } from '@repo/config-schema';

// Your site configuration
const config = {
  identity: {
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    siteName: 'Professional Law Firm',
    legalBusinessName: 'Smith & Associates LLC',
    domain: {
      primary: 'smith-law.com',
      subdomain: 'smith-law',
    },
    contact: {
      email: 'contact@smith-law.com',
      phone: '+14155552671',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      },
    },
  },
  // ... other sections
};

// Validate configuration
const validatedConfig = validateSiteConfig(config);
```

---

## Schema Sections

### 1. Identity & Branding

Core site identification and business information.

```typescript
identity: {
  // Required: Unique tenant identifier (UUID)
  tenantId: '550e8400-e29b-41d4-a716-446655440000',

  // Required: Display name for the site
  siteName: 'Professional Law Firm',

  // Required: Legal business name
  legalBusinessName: 'Smith & Associates LLC',

  // Optional: Alternative legal name
  legalName: 'Smith Law Firm Professional Corporation',

  // Optional: Marketing tagline
  tagline: 'Experienced Legal Representation Since 2010',

  // Domain configuration
  domain: {
    primary: 'smith-law.com',           // Required
    subdomain: 'smith-law',             // Required
    customDomains: ['www.smith-law.com', 'lawfirm.smith-law.com'], // Optional
  },

  // Contact information
  contact: {
    email: 'contact@smith-law.com',     // Required
    phone: '+14155552671',              // Required (E.164 format)
    address: {                          // Required
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',                      // 2-letter state code
      zip: '94105',                     // ZIP+4 format supported
      country: 'US',                    // ISO 3166-1 alpha-2
    },
  },
}
```

### 2. Theme & Design

Visual branding and design system configuration.

```typescript
theme: {
  // Color palette (hex colors only)
  colorPalette: {
    primary: '#2563eb',      // Main brand color
    secondary: '#64748b',     // Secondary brand color
    accent: '#f59e0b',       // Accent/highlight color
    neutral: '#6b7280',      // Neutral gray
    background: '#ffffff',    // Page background
    foreground: '#111827',   // Text color
  },

  // Typography configuration
  typography: {
    headingFont: 'Inter',          // Headings font family
    bodyFont: 'Inter',              // Body text font family
    monoFont: 'JetBrains Mono',    // Optional monospace font
    fontScale: 'normal',           // 'tight' | 'normal' | 'relaxed'
  },

  // Logo assets
  logo: {
    light: 'https://cdn.example.com/logo-light.svg',    // Required
    dark: 'https://cdn.example.com/logo-dark.svg',      // Required
    favicon: 'https://cdn.example.com/favicon.ico',     // Required
    appleTouchIcon: 'https://cdn.example.com/apple-touch-icon.png', // Optional
  },

  // Optional: Custom CSS (10,000 character limit)
  customCSS: '.custom-button { border-radius: 8px; }',
}
```

### 3. Features

Enable/disable site features and functionality.

```typescript
features: {
  enableBlog: false,              // Blog functionality
  enableBooking: true,             // Appointment booking
  enableEcommerce: false,          // E-commerce capabilities
  enableChat: true,                // Live chat widget

  // Form configurations
  enableForms: {
    contactForm: true,             // Contact form
    newsletterSignup: true,        // Newsletter signup
    customForms: ['contact', 'consultation'], // Custom form IDs
  },

  // Multi-location support
  enableMultiLocation: false,

  // Internationalization
  enableI18n: {
    enabled: false,
    defaultLocale: 'en-US',
    locales: ['en-US', 'es-US'],  // BCP 47 language tags
  },
}
```

### 4. Business Info (Local SEO)

Business information for local search optimization.

```typescript
businessInfo: {
  // Business type for schema.org
  type: 'LegalService',            // LocalBusiness | Restaurant | MedicalBusiness | etc.
  category: 'Family Law Attorney', // Specific business category
  description: 'Experienced family law attorneys providing compassionate legal representation for divorce, custody, and adoption cases in the San Francisco Bay Area.',
  yearEstablished: 2010,           // Optional

  // Hours of operation
  hoursOfOperation: [
    {
      dayOfWeek: 'Monday',
      opens: '09:00',
      closes: '17:00',
    },
    // ... other days
  ],

  priceRange: '$$$',               // Optional: $ | $$ | $$$ | $$$$

  // Accepted payment methods
  acceptedPaymentMethods: ['Credit Card', 'Check', 'PayPal'],

  // Service area
  serviceArea: {
    type: 'Radius',
    value: '50 miles',
  },

  // Multiple locations (if enableMultiLocation is true)
  multiLocation: [
    {
      name: 'San Francisco Office',
      address: { /* address object */ },
      phone: '+14155552671',
      hours: [ /* hours array */ ],
    },
  ],
}
```

### 5. SEO Configuration

Search engine optimization and metadata.

```typescript
seo: {
  title: 'Smith & Associates | Family Law Attorneys San Francisco',
  description: 'Experienced family law attorneys in San Francisco providing compassionate legal representation for divorce, custody, and adoption cases.',

  // Optional: Keywords (deprecated but some clients want it)
  keywords: ['family law', 'divorce attorney', 'custody lawyer'],

  // Social media and OG images
  ogImage: 'https://cdn.example.com/og-image.jpg',
  twitterHandle: '@smithlaw',

  // Technical SEO
  canonical: 'https://smith-law.com',           // Optional override
  noindex: false,                                // Prevent indexing

  // Verification codes
  googleSiteVerification: 'google-verif-code',
  bingSiteVerification: 'bing-verif-code',

  // Structured data
  structuredData: {
    enableLocalBusiness: true,     // LocalBusiness schema
    enableBreadcrumbs: true,       // BreadcrumbList schema
    enableFAQPage: false,          // FAQPage schema
    enableArticle: false,           // Article schema (for blog)
  },

  // Hreflang for internationalization
  hreflang: [
    {
      locale: 'en-US',
      url: 'https://smith-law.com',
    },
    {
      locale: 'es-US',
      url: 'https://smith-law.com/es',
    },
  ],

  // AI crawler preferences
  aiControlPreferences: {
    allowCrawling: true,           // Allow GPTBot, Claude-Web, Bard
    llmsTxt: true,                 // Generate /.well-known/llms.txt
    aiContextJson: true,           // GEO optimization
  },
}
```

### 6. Integrations

Third-party service integrations.

```typescript
integrations: {
  // Analytics and tracking
  analytics: {
    googleAnalytics4: {
      enabled: true,
      measurementId: 'G-XXXXXXXXXX',
    },
    googleTagManager: {
      enabled: false,
      containerId: 'GTM-XXXXXXX',
    },
    facebookPixel: {
      enabled: true,
      pixelId: '1234567890123456',
    },
    tinybird: {
      enabled: true,               // Core Web Vitals tracking
      token: 'p-token-xxxxxxxx',
    },
  },

  // CRM integration
  crm: {
    provider: 'hubspot',           // hubspot | salesforce | pipedrive | webhook | none
    hubspot: {
      portalId: '1234567',
      formGuid: 'abcdef12-3456-7890-abcd-ef1234567890',
    },
  },

  // Booking systems
  booking: {
    provider: 'calendly',          // calendly | acuity | custom | none
    calendly: {
      username: 'smith-law',
    },
  },

  // Payment processing
  payments: {
    stripe: {
      enabled: true,
      publicKey: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },

  // Live chat
  chat: {
    provider: 'intercom',          // intercom | drift | crisp | none
    intercom: {
      appId: 'abc123def456',
    },
  },

  // Email service
  email: {
    provider: 'postmark',          // postmark | resend | sendgrid
    fromAddress: 'noreply@smith-law.com',
    replyToAddress: 'contact@smith-law.com',
  },
}
```

### 7. CMS Selection

Content management system configuration.

```typescript
cms: {
  provider: 'sanity',              // sanity | storyblok | none
  sanity: {
    projectId: 'abc123',
    dataset: 'production',
    apiVersion: '2024-01-01',
  },
  storyblok: {
    accessToken: 'storyblok-token',
    region: 'us',                  // eu | us | ap | ca
  },
}
```

### 8. Billing & Tier

Subscription and billing configuration.

```typescript
billing: {
  tier: 'professional',            // starter | professional | enterprise
  stripeCustomerId: 'cus_xxxxxxxxxxxxxxx',
  stripeSubscriptionId: 'sub_xxxxxxxxxxxxxxx',
  status: 'active',                // active | suspended | cancelled | trial
  trialEndsAt: '2024-02-01T00:00:00Z',
  nextBillingDate: '2024-02-01T00:00:00Z',
  monthlyPageViews: 15420,          // Usage-based billing
}
```

### 9. Lead Scoring

Lead qualification and routing configuration.

```typescript
leadScoring: {
  enabled: true,
  weights: {
    formSubmission: 20,            // Points for form submission
    phoneClick: 30,                // Points for phone number click
    chatInitiated: 25,             // Points for chat initiation
    bookingScheduled: 50,          // Points for booking appointment
    pageViewsThreshold: 5,         // Pages viewed for +10 points
    timeOnSiteThreshold: 120,     // Time on site for +15 points (seconds)
  },
  qualificationThreshold: 50,     // Points needed to qualify
  routing: {
    autoAssign: false,
    ownerEmail: 'leads@smith-law.com',
    notifyOnQualified: true,
  },
}
```

### 10. Notifications

Email, Slack, and SMS notification routing.

```typescript
notifications: {
  email: {
    enabled: true,
    newLeadNotification: true,
    qualifiedLeadNotification: true,
    bookingConfirmation: true,
    recipients: ['leads@smith-law.com', 'attorney@smith-law.com'],
  },
  slack: {
    enabled: true,
    webhookUrl: 'https://hooks.slack.com/services/...',
    channels: ['#leads', '#sales'],
  },
  sms: {
    enabled: false,
    twilioPhoneNumber: '+1234567890',
    recipients: ['+14155552671'],
  },
}
```

### 11. A/B Testing

Experiment configuration and management.

```typescript
abTesting: {
  enabled: true,
  experiments: [
    {
      id: 'hero-headline-test',
      name: 'Hero Headline Test',
      variants: [
        {
          id: 'control',
          name: 'Current Headline',
          weight: 50,               // Traffic percentage
        },
        {
          id: 'variant-a',
          name: 'Benefit-Focused Headline',
          weight: 50,
        },
      ],
      active: true,
    },
  ],
}
```

### 12. Cookie Consent

GDPR and privacy compliance configuration.

```typescript
cookieConsent: {
  mode: 'native',                  // native | overlay
  enableGoogleConsentModeV2: true,
  defaultConsent: {
    analytics_storage: 'denied',   // granted | denied
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  },
}
```

### 13. Compliance Flags

Legal and accessibility compliance settings.

```typescript
compliance: {
  gdpr: {
    enabled: true,
    dataRetentionDays: 730,        // 2 years
    dpaAccepted: true,
    dpaAcceptedAt: '2024-01-01T00:00:00Z',
  },
  wcag: {
    targetLevel: 'AA',             // A | AA | AAA
    enableAccessibilityStatement: true,
  },
  pqc: {
    enablePostQuantumCrypto: false,
    migrationPhase: 'rsa',         // rsa | hybrid | pqc
  },
}
```

---

## Validation Functions

### validateSiteConfig()

Validates a configuration object against the complete schema.

```typescript
import { validateSiteConfig } from '@repo/config-schema';

try {
  const validatedConfig = validateSiteConfig(config);
  console.log('✅ Configuration is valid');
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
}
```

### validateSiteConfigSafe()

Validates without throwing - returns result object.

```typescript
import { validateSiteConfigSafe } from '@repo/config-schema';

const result = validateSiteConfigSafe(config);

if (result.success) {
  console.log('✅ Configuration is valid');
  const validatedConfig = result.data;
} else {
  console.error('❌ Configuration validation failed:');
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
}
```

---

## Common Validation Errors

### Tenant ID Format

```typescript
// ❌ Invalid
tenantId: 'smith-law-123';

// ✅ Valid (UUID)
tenantId: '550e8400-e29b-41d4-a716-446655440000';
```

### Phone Number Format

```typescript
// ❌ Invalid
phone: '(415) 555-2671';
phone: '415-555-2671';

// ✅ Valid (E.164 format)
phone: '+14155552671';
```

### Color Format

```typescript
// ❌ Invalid
primary: 'blue';
primary: '#2563ebff';

// ✅ Valid (6-digit hex)
primary: '#2563eb';
```

### Domain Format

```typescript
// ❌ Invalid
primary: 'https://smith-law.com';
primary: 'smith-law.com/path';

// ✅ Valid
primary: 'smith-law.com';
```

---

## Migration Guide

### From Legacy Config

If you have an existing `site.config.ts` without the new schema structure:

```typescript
// Before (legacy)
export default {
  siteName: 'Smith Law Firm',
  domain: 'smith-law.com',
  contact: {
    email: 'contact@smith-law.com',
    phone: '(415) 555-2671',
  },
};

// After (new schema)
export default {
  identity: {
    tenantId: '550e8400-e29b-41d4-a716-446655440000', // Add UUID
    siteName: 'Smith Law Firm',
    legalBusinessName: 'Smith & Associates LLC', // Add legal name
    domain: {
      // Convert to object
      primary: 'smith-law.com',
      subdomain: 'smith-law', // Add subdomain
    },
    contact: {
      email: 'contact@smith-law.com',
      phone: '+14155552671', // Fix phone format
      address: {
        // Add full address
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      },
    },
  },
  // ... add other required sections
};
```

---

## Best Practices

### 1. Use UUID for tenantId

Generate a unique UUID for each site:

```typescript
import { randomUUID } from 'crypto';

const tenantId = randomUUID(); // e.g., '550e8400-e29b-41d4-a716-446655440000'
```

### 2. Secure Sensitive Data

Use environment variables for sensitive configuration:

```typescript
integrations: {
  payments: {
    stripe: {
      enabled: true,
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    },
  },
}
```

### 3. Validate Early

Validate configuration at build time:

```typescript
// In your site.config.ts
import { validateSiteConfig } from '@repo/config-schema';

const config = {
  // ... your configuration
};

export default validateSiteConfig(config);
```

### 4. Use Optional Fields Wisely

Only include sections you actually use:

```typescript
// ✅ Good - only include what you need
integrations: {
  analytics: {
    googleAnalytics4: {
      enabled: true,
      measurementId: 'G-XXXXXXXXXX',
    },
  },
  // Don't include CRM, payments, etc. if not used
}

// ❌ Avoid - empty sections
integrations: {
  analytics: { /* empty */ },
  crm: { /* empty */ },
  booking: { /* empty */ },
}
```

---

## TypeScript Types

### SiteConfig Type

Use the exported type for type safety:

```typescript
import type { SiteConfig } from '@repo/config-schema';

const config: SiteConfig = {
  // ... your configuration
};
```

### Section Types

Import individual section types:

```typescript
import type {
  IdentitySchema,
  ThemeSchema,
  SEOSchema,
  IntegrationsSchema,
} from '@repo/config-schema';

const identity: IdentitySchema = {
  // ... identity configuration
};
```

---

## Troubleshooting

### Common Issues

1. **"Invalid tenantId format"**
   - Ensure tenantId is a valid UUID
   - Use `randomUUID()` to generate new ones

2. **"Invalid phone number"**
   - Use E.164 format: `+[country code][number]`
   - Example: `+14155552671`

3. **"Invalid domain format"**
   - Use plain domain without protocol
   - Example: `example.com` not `https://example.com`

4. **"Invalid color format"**
   - Use 6-digit hex colors only
   - Example: `#2563eb` not `blue` or `#2563ebff`

### Getting Help

- Check the validation error messages for specific issues
- Reference this guide for correct formats
- Use `validateSiteConfigSafe()` for detailed error reporting
- Contact the development team for schema questions

---

## Updates and Versioning

This schema follows semantic versioning. Major versions may include breaking changes, while minor versions add new optional fields.

Stay updated with the latest schema features and best practices by checking the package documentation and release notes.
