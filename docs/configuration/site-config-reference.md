<!--
/**
 * @file docs/configuration/site-config-reference.md
 * @role docs
 * @summary Complete field-by-field reference for the SiteConfig interface.
 *          Authoritative source is packages/types/src/site-config.ts.
 *
 * @invariants
 * - All field types here must match packages/types/src/site-config.ts exactly.
 * - Colors must be HSL strings without hsl() wrapper.
 * - conversionFlow is a discriminated union on the `type` field.
 *
 * @gotchas
 * - `address` is an object (street/city/state/zip/country), not a string.
 * - `fonts` is optional; omitting it uses system defaults.
 * - `borderRadius` and `shadows` are optional scale tokens, not raw CSS values.
 *
 * @verification
 * - ✅ All fields cross-checked against packages/types/src/site-config.ts; integrations include chat (tidio), reviews, maps.
 * - ✅ Zod schema constraints documented where relevant
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# `site.config.ts` — Configuration Reference

**Last Updated:** 2026-02-19
**Source of Truth:** [`packages/types/src/site-config.ts`](../../packages/types/src/site-config.ts)

**Evolution (Phase 3):** Future fields `capabilities`, `pages`, `renderer`, `storage` will extend SiteConfig per [evolution-roadmap.md](../architecture/evolution-roadmap.md). Schema will be updated when capability activation is implemented (evol-8).
**Zod Schema:** `siteConfigSchema` (exported from `@repo/types`)

---

## Overview

Every client in `clients/` has a `site.config.ts` that exports a `SiteConfig` object. This single file drives all site behavior — theming, page sections, integrations, SEO, and conversion flows — without requiring changes to shared component or layout code.

```typescript
import type { SiteConfig } from '@repo/types';
const siteConfig: SiteConfig = { ... };
export default siteConfig;
```

---

## Top-Level Identity Fields

| Field         | Type           | Required | Description                                                                                   |
| ------------- | -------------- | -------- | --------------------------------------------------------------------------------------------- |
| `id`          | `string`       | Yes      | Machine-readable slug. Kebab-case, unique across all clients.                                 |
| `name`        | `string`       | Yes      | Display name shown in nav, footer, and meta tags.                                             |
| `tagline`     | `string`       | Yes      | One-liner tagline (used under logos, in hero text).                                           |
| `description` | `string`       | Yes      | Longer description for SEO and about pages.                                                   |
| `url`         | `string`       | Yes      | Canonical production URL, no trailing slash. Should read from `NEXT_PUBLIC_SITE_URL` env var. |
| `industry`    | `IndustryType` | Yes      | Industry classification — activates schema.org markup. See Industry Types below.              |

### Industry Types

```typescript
type IndustryType =
  | 'salon' // Hair/beauty salons
  | 'restaurant' // Food and beverage
  | 'law-firm' // Legal services
  | 'dental' // Dental practices
  | 'medical' // Healthcare / clinics
  | 'fitness' // Gyms, studios
  | 'retail' // Retail / e-commerce
  | 'consulting' // Consulting / advisory
  | 'realestate' // Real estate agencies
  | 'construction' // Construction / trades
  | 'automotive' // Auto services / dealerships
  | 'general'; // Catch-all for other industries
```

---

## `features` — Section Flags

Controls which sections render and which layout variant they use. Set a variant string to enable, or `null` to disable a section.

### Layout Variant Fields

| Field          | Type             | Variants                                 | Description             |
| -------------- | ---------------- | ---------------------------------------- | ----------------------- |
| `hero`         | `string \| null` | `centered`, `split`, `video`, `carousel` | Hero section layout     |
| `services`     | `string \| null` | `grid`, `list`, `tabs`, `accordion`      | Services section layout |
| `team`         | `string \| null` | `grid`, `carousel`, `detailed`           | Team section layout     |
| `testimonials` | `string \| null` | `carousel`, `grid`, `marquee`            | Testimonials layout     |
| `pricing`      | `string \| null` | `table`, `cards`, `calculator`           | Pricing section layout  |
| `contact`      | `string \| null` | `simple`, `multi-step`, `with-booking`   | Contact form style      |
| `gallery`      | `string \| null` | `grid`, `carousel`, `lightbox`           | Gallery layout          |

### Boolean Section Fields

| Field     | Type      | Default | Description                          |
| --------- | --------- | ------- | ------------------------------------ |
| `blog`    | `boolean` | —       | Enable blog listing and detail pages |
| `booking` | `boolean` | —       | Enable booking page and flow         |
| `faq`     | `boolean` | —       | Enable FAQ section                   |

### Optional Industry Feature Fields

| Field         | Type       | Industry Use                              |
| ------------- | ---------- | ----------------------------------------- |
| `location`    | `boolean?` | Restaurant, retail — Google Maps embed    |
| `menu`        | `boolean?` | Restaurant — menu section                 |
| `portfolio`   | `boolean?` | Law firm, design — portfolio/case studies |
| `caseStudy`   | `boolean?` | Consulting — detailed case study pages    |
| `jobListing`  | `boolean?` | Any — careers page                        |
| `course`      | `boolean?` | Education, fitness — course listings      |
| `resource`    | `boolean?` | Consulting, law — downloadable resources  |
| `comparison`  | `boolean?` | SaaS, retail — feature comparison table   |
| `filter`      | `boolean?` | Retail, services — filterable listings    |
| `search`      | `boolean?` | Any — site search                         |
| `socialProof` | `boolean?` | Any — social proof widget                 |
| `video`       | `boolean?` | Any — video section                       |
| `audio`       | `boolean?` | Any — audio/podcast section               |
| `interactive` | `boolean?` | Any — interactive calculator or tool      |
| `widget`      | `boolean?` | Any — embedded third-party widget         |

---

## `integrations` — Third-Party Services

All integration fields are optional. Omit or set provider to `'none'` to disable.

### Analytics

```typescript
integrations: {
  analytics: {
    provider: 'google' | 'plausible' | 'none',
    trackingId?: string,   // GA4: 'G-XXXXXXXX', Plausible: domain
    config?: {
      eventTracking?: boolean,   // Track custom events (default: false)
      anonymizeIp?: boolean,     // GA4 IP anonymization (default: true)
    }
  }
}
```

### CRM

```typescript
integrations: {
  crm: {
    provider: 'hubspot' | 'none',
    portalId?: string,  // HubSpot portal ID (numeric string)
  }
}
```

Requires `HUBSPOT_PRIVATE_APP_TOKEN` environment variable.

### Booking

```typescript
integrations: {
  booking: {
    provider: 'internal' | 'calendly' | 'acuity' | 'none',
    config?: Record<string, unknown>,  // Provider-specific config
  }
}
```

### Email

```typescript
integrations: {
  email: {
    provider: 'mailchimp' | 'sendgrid' | 'none',
    config?: Record<string, unknown>,
  }
}
```

### Chat

```typescript
integrations: {
  chat: {
    provider: 'intercom' | 'crisp' | 'tidio' | 'none',
    config?: {
      websiteId?: string,   // Crisp website ID, Intercom app ID, or Tidio public key
      theme?: string,       // 'light' | 'dark'
    }
  }
}
```

Chat widget scripts are loaded only after user consent (see `@repo/integrations-chat` consent helpers).

### Reviews

```typescript
integrations: {
  reviews: {
    provider: 'google' | 'yelp' | 'trustpilot' | 'none',
    config?: Record<string, unknown>,  // Provider-specific (e.g. placeId, businessId)
  }
}
```

Read-only aggregation for display; no review response. Adapters in `@repo/integrations-reviews`.

### Maps

```typescript
integrations: {
  maps: {
    provider: 'google' | 'none',
    config?: {
      static?: boolean,      // Use static map image (no JS)
      interactive?: boolean, // Load Maps JS when consent granted
      apiKey?: string,      // Google Maps API key (or use env)
    }
  }
}
```

Static map via image URL; interactive map script loaded only after consent (see `@repo/integrations-maps`).

---

## `navLinks` — Primary Navigation

Array of link objects rendered in the site header:

```typescript
navLinks: Array<{
  href: string; // Absolute path ('/services') or external URL
  label: string; // Display text
}>;
```

---

## `socialLinks` — Social Media Profiles

```typescript
socialLinks: Array<{
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';
  url: string; // Full URL (validated as URL by Zod)
}>;
```

---

## `footer` — Footer Layout

```typescript
footer: {
  columns: Array<{
    heading: string; // Column heading text
    links: Array<{
      href: string;
      label: string;
    }>;
  }>;
  legalLinks: Array<{
    // Privacy, Terms links in footer bar
    href: string;
    label: string;
  }>;
  copyrightTemplate: string; // '{year}' is replaced at render time
  // e.g. '© {year} Acme Inc.'
}
```

---

## `contact` — Business Information

```typescript
contact: {
  email: string;          // Validated as email by Zod
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  hours?: Array<{
    label: string;        // e.g. 'Mon – Fri'
    hours: string;        // e.g. '9 am – 6 pm'
  }>;
}
```

**JSON-LD mapping:** `contact.hours` is converted to `openingHoursSpecification` (OpeningHoursSpecification) in `@repo/industry-schemas` JSON-LD output.

> **Gotcha:** `address` is an object, not a string. Passing a string will fail TypeScript type-checking.

---

## `seo` — SEO Defaults

```typescript
seo: {
  titleTemplate: string;       // '%s | Brand Name' — %s is the page title
  defaultDescription: string;  // Default meta description (120-160 chars)
  ogImage?: string;            // Absolute URL to OG/social share image
  twitterHandle?: string;      // '@handle' for Twitter/X card
  schemaType?: string;         // JSON-LD type e.g. 'HairSalon', 'LegalService'
}
```

**JSON-LD mapping:** `ogImage` and `schemaType` feed into `@repo/industry-schemas` — `ogImage` becomes the Organization `image` in schema.org JSON-LD; `schemaType` overrides the industry default.

Common `schemaType` values by industry:

| Industry     | schemaType                    |
| ------------ | ----------------------------- |
| salon        | `HairSalon`                   |
| restaurant   | `Restaurant`                  |
| law-firm     | `LegalService`                |
| dental       | `Dentist`                     |
| medical      | `MedicalClinic`               |
| fitness      | `HealthClub`                  |
| retail       | `Store`                       |
| consulting   | `ProfessionalService`         |
| realestate   | `RealEstateAgent`             |
| construction | `HomeAndConstructionBusiness` |
| automotive   | `AutoRepair`                  |
| general      | `LocalBusiness`               |

---

## `theme` — Visual Design

### Colors

All color values are HSL strings **without** the `hsl()` wrapper. Format: `"H S% L%"`.

```typescript
theme: {
  colors: {
    // Primary brand color (buttons, links, focus rings)
    primary: string;
    'primary-foreground': string;  // Text on primary backgrounds

    // Secondary accent (dark backgrounds, secondary buttons)
    secondary: string;
    'secondary-foreground': string;

    // Accent (highlight chips, badges, hover states)
    accent: string;
    'accent-foreground': string;

    // Page background and default text
    background: string;
    foreground: string;

    // Muted areas (section backgrounds, disabled states)
    muted: string;
    'muted-foreground': string;

    // Card/panel surfaces
    card: string;
    'card-foreground': string;

    // Error / destructive actions
    destructive: string;
    'destructive-foreground': string;

    // Form inputs
    border: string;
    input: string;
    ring: string;  // Focus ring — usually matches primary
  }
}
```

**HSL format example:** `"174 85% 33%"` represents `hsl(174, 85%, 33%)`.

### Fonts

```typescript
theme: {
  fonts?: {
    heading: string;   // CSS font-family stack for headings
    body: string;      // CSS font-family stack for body text
    accent?: string;   // Optional third font for callouts/highlights
  }
}
```

Fonts are loaded separately via `next/font` or `<link>` tags in the root layout. The config value is the CSS `font-family` string (comma-separated list of font names).

### Border Radius & Shadows

```typescript
theme: {
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full',
  shadows?: 'none' | 'small' | 'medium' | 'large',
}
```

These are design system tokens mapped to CSS custom properties by `ThemeInjector`. They affect all components consistently.

---

## `conversionFlow` — Primary CTA Flow

Discriminated union on the `type` field. Controls the booking/contact form behavior.

### `type: 'booking'` — Appointment Booking

```typescript
conversionFlow: {
  type: 'booking';
  serviceCategories: string[];          // Service category options
  timeSlots: Array<{
    value: string;                      // Internal value
    label: string;                      // Display label
  }>;
  maxAdvanceDays: number;               // Integer > 0; how far ahead bookings open
}
```

**Use for:** Salons, dental/medical practices, fitness studios.

### `type: 'contact'` — Contact Form

```typescript
conversionFlow: {
  type: 'contact';
  subjects?: string[];  // Optional pre-filled subject dropdown options
}
```

**Use for:** Law firms, consulting, general businesses.

### `type: 'quote'` — Quote Request

```typescript
conversionFlow: {
  type: 'quote';
  serviceCategories: string[];   // Services to quote for
  allowAttachments?: boolean;    // Allow file uploads (photos, docs)
}
```

**Use for:** Construction, real estate, home services.

### `type: 'dispatch'` — Emergency Dispatch

```typescript
conversionFlow: {
  type: 'dispatch';
  urgencyLevels: Array<{
    value: string;
    label: string;
  }>;
}
```

**Use for:** Medical clinics, automotive emergency, plumbing/HVAC.

---

## Validation

The entire config is validated at runtime by `siteConfigSchema` (Zod). To validate programmatically:

```typescript
import { siteConfigSchema } from '@repo/types';
import siteConfig from './site.config';

// Throws ZodError with field-level messages if invalid
const validated = siteConfigSchema.parse(siteConfig);
```

TypeScript catches most errors at compile time via the `SiteConfig` interface. Run `pnpm type-check` to catch type errors before building.

---

## Complete Example

See `clients/starter-template/site.config.ts` for a complete, working example covering all required fields.

---

## See Also

- [`docs/migration/template-to-client.md`](../migration/template-to-client.md) — Step-by-step client setup guide
- [`docs/configuration/industry-configs.md`](industry-configs.md) — Industry-specific config examples
- [`packages/types/src/site-config.ts`](../../packages/types/src/site-config.ts) — TypeScript interfaces and Zod schema
