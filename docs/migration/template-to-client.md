<!--
/**
 * @file docs/migration/template-to-client.md
 * @role docs
 * @summary Step-by-step guide for creating a new marketing site client from the
 *          starter-template using the Configuration-as-Code (CaCA) architecture.
 *
 * @invariants
 * - All customization is in site.config.ts; no core template code should change.
 * - Each client must have a unique package name and dev port.
 * - Cross-client imports are forbidden.
 *
 * @gotchas
 * - starter-template uses next-intl (i18n) with app/[locale]/ routing.
 *   Other clients without i18n use a flat app/ structure.
 * - address field in ContactInfo is an object (not a string); see types.
 * - package.json workspaces must match pnpm-workspace.yaml — run validate:workspaces.
 *
 * @verification
 * - ✅ Verified against clients/starter-template/site.config.ts
 * - ✅ Verified against packages/types/src/site-config.ts (Zod schema)
 * - ✅ Verified against actual client directories (luxe-salon, bistro-central, etc.)
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Template-to-Client Migration Guide

**Last Updated:** 2026-02-19
**Status:** Active — authoritative guide for new client creation

---

## Overview

This guide walks through creating a new marketing website client from `clients/starter-template` using the **Configuration-as-Code Architecture (CaCA)**. The starter template is the golden path: a complete Next.js 15 application driven entirely by a single `site.config.ts` file.

> **Key principle:** In the CaCA model, all customization happens in `site.config.ts`. You should rarely need to touch component or layout code to spin up a new client.

### What the Template Provides

- Next.js 15 App Router with full i18n support (next-intl)
- All UI sections: Hero, Services, Team, Testimonials, Pricing, Gallery, Blog, Booking, Contact, FAQ
- Theme injection via `ThemeInjector` from `@repo/ui`
- Integration adapters: analytics (Google/Plausible), CRM (HubSpot), booking, chat
- Industry schema structured data (JSON-LD via `@repo/industry-schemas`)
- Production-ready Dockerfile, health check endpoint

---

## Step-by-Step Migration

### Step 1 — Copy the Starter Template

```bash
# From the monorepo root
cp -r clients/starter-template clients/<client-name>
```

Use kebab-case for `<client-name>` (e.g., `luxe-salon`, `bistro-central`).

### Step 2 — Update `package.json`

Edit `clients/<client-name>/package.json`:

```json
{
  "name": "@clients/<client-name>",
  "version": "1.0.0",
  "private": true,
  "description": "<Client Name> marketing website",
  "scripts": {
    "dev": "next dev --port <unique-port>",
    "build": "next build",
    "start": "next start --port <unique-port>",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

**Port assignment** (pick a unique port to avoid conflicts):

| Client | Port |
|--------|------|
| starter-template | 3101 |
| luxe-salon | 3102 |
| bistro-central | 3103 |
| chen-law | 3104 |
| sunrise-dental | 3105 |
| urban-outfitters | 3106 |
| _next client_ | 3107+ |

### Step 3 — Install Dependencies

```bash
# From monorepo root (pnpm-workspace.yaml auto-includes clients/*)
pnpm install
```

### Step 4 — Configure Environment Variables

```bash
cp .env.example clients/<client-name>/.env.local
```

Fill in the required variables:

```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://<client-domain>.com

# Optional — add as needed
NEXT_PUBLIC_SENTRY_DSN=...
HUBSPOT_PRIVATE_APP_TOKEN=...

# Supabase (must set both or neither)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Upstash Redis (must set both or neither; falls back to in-memory)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Booking provider (must set both or neither)
MINDBODY_API_KEY=...
MINDBODY_BUSINESS_ID=...
```

---

## Customizing `site.config.ts`

`site.config.ts` is the **only file you should need to edit** for basic client setup. It is typed by `SiteConfig` from `@repo/types`.

```typescript
// clients/<client-name>/site.config.ts
import type { SiteConfig } from '@repo/types';

const siteConfig: SiteConfig = {
  // ---- Identity ----
  id: '<client-name>',           // unique slug, kebab-case
  name: '<Client Name>',
  tagline: 'Short brand tagline',
  description: 'Used in meta description',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:<port>',
  industry: 'salon', // see Industry section below

  // ---- Feature Flags ----
  features: { /* see Features section */ },

  // ---- Integrations ----
  integrations: { /* see Integrations section */ },

  // ---- Navigation ----
  navLinks: [
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
    { href: '/book', label: 'Book Now' },
  ],
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/<handle>' },
    { platform: 'facebook', url: 'https://facebook.com/<page>' },
  ],

  // ---- Footer ----
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
    copyrightTemplate: '© {year} <Client Name>. All rights reserved.',
  },

  // ---- Contact / Business Info ----
  contact: {
    email: 'hello@<client-domain>.com',
    phone: '(555) 000-0000',
    address: {
      street: '123 Main St',
      city: 'City',
      state: 'ST',
      zip: '00000',
      country: 'US',
    },
    hours: [
      { label: 'Mon – Fri', hours: '9 am – 6 pm' },
      { label: 'Sat', hours: '10 am – 4 pm' },
      { label: 'Sun', hours: 'Closed' },
    ],
  },

  // ---- Theme ----
  theme: { /* see Theme section */ },

  // ---- Conversion Flow ----
  conversionFlow: { /* see Conversion Flow section */ },

  // ---- SEO ----
  seo: {
    titleTemplate: '%s | <Client Name>',
    defaultDescription: 'Your compelling meta description (120-160 chars)',
    ogImage: 'https://<client-domain>.com/og-image.jpg',
    twitterHandle: '@<handle>',
    schemaType: 'LocalBusiness',
  },
};

export default siteConfig;
```

---

## Industry Field

The `industry` field activates industry-specific schema markup and can affect component defaults:

```typescript
industry: 'salon' | 'restaurant' | 'law-firm' | 'dental' | 'medical'
        | 'fitness' | 'retail' | 'consulting' | 'realestate'
        | 'construction' | 'automotive' | 'general'
```

---

## Feature Flags

Feature flags control which sections appear on the site:

```typescript
features: {
  // Section layout variants (null = section disabled)
  hero: 'centered' | 'split' | 'video' | 'carousel' | null,
  services: 'grid' | 'list' | 'tabs' | 'accordion' | null,
  team: 'grid' | 'carousel' | 'detailed' | null,
  testimonials: 'carousel' | 'grid' | 'marquee' | null,
  pricing: 'table' | 'cards' | 'calculator' | null,
  contact: 'simple' | 'multi-step' | 'with-booking' | null,
  gallery: 'grid' | 'carousel' | 'lightbox' | null,

  // Boolean sections
  blog: true | false,
  booking: true | false,
  faq: true | false,

  // Optional sections (enable as needed)
  location: true | false,       // Google Maps embed
  menu: true | false,           // Restaurant menu
  portfolio: true | false,      // Work portfolio
  search: true | false,         // Site search
  socialProof: true | false,    // Social proof widget
}
```

**Common configurations by industry:**

```typescript
// Salon
features: {
  hero: 'split', services: 'grid', team: 'grid',
  testimonials: 'carousel', pricing: 'cards',
  contact: 'simple', gallery: 'grid',
  blog: true, booking: true, faq: false,
}

// Restaurant
features: {
  hero: 'centered', services: 'grid', team: null,
  testimonials: 'grid', pricing: null,
  contact: 'simple', gallery: 'carousel',
  blog: false, booking: false, faq: false,
  menu: true, location: true,
}

// Law Firm
features: {
  hero: 'split', services: 'list', team: 'detailed',
  testimonials: 'grid', pricing: null,
  contact: 'multi-step', gallery: null,
  blog: true, booking: false, faq: true,
  portfolio: true,
}
```

---

## Theme Configuration

All colors use HSL format **without** the `hsl()` wrapper:

```typescript
theme: {
  colors: {
    // Brand colors
    primary: '174 85% 33%',           // HSL: "H S% L%"
    'primary-foreground': '0 0% 100%',
    secondary: '220 20% 14%',
    'secondary-foreground': '0 0% 100%',
    accent: '174 85% 93%',
    'accent-foreground': '174 85% 20%',

    // Surface colors
    background: '220 14% 96%',
    foreground: '220 20% 8%',
    muted: '220 14% 92%',
    'muted-foreground': '220 10% 40%',
    card: '0 0% 100%',
    'card-foreground': '220 20% 8%',

    // Semantic colors
    destructive: '0 72% 38%',
    'destructive-foreground': '0 0% 100%',

    // Form colors
    border: '220 14% 88%',
    input: '220 14% 88%',
    ring: '174 85% 33%',  // focus ring -- usually matches primary
  },
  fonts: {
    heading: 'Playfair Display, Georgia, serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Cormorant Garamond, serif',  // optional
  },
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full',
  shadows: 'none' | 'small' | 'medium' | 'large',
}
```

**Converting a hex color to HSL:** Use any HSL converter and enter the result as `"H S% L%"` (no `hsl()` wrapper, no commas).

---

## Integrations

```typescript
integrations: {
  analytics: {
    provider: 'google' | 'plausible' | 'none',
    trackingId: 'G-XXXXXXXX',   // Google Analytics 4 measurement ID
    config: {
      eventTracking: true,
      anonymizeIp: true,
    },
  },

  crm: {
    provider: 'hubspot' | 'none',
    portalId: '12345678',
  },

  booking: {
    provider: 'internal' | 'calendly' | 'acuity' | 'none',
    // provider-specific config via 'config' key
  },

  email: {
    provider: 'mailchimp' | 'sendgrid' | 'none',
  },

  chat: {
    provider: 'intercom' | 'crisp' | 'none',
    config: { websiteId: 'xxx', theme: 'light' },
  },
}
```

---

## Conversion Flow

Choose the flow that matches the business model:

```typescript
// Appointment booking (salons, dental, fitness)
conversionFlow: {
  type: 'booking',
  serviceCategories: ['Haircuts', 'Color Services', 'Treatments'],
  timeSlots: [
    { value: 'morning', label: 'Morning (9am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
    { value: 'evening', label: 'Evening (5pm - 8pm)' },
  ],
  maxAdvanceDays: 90,
}

// Simple contact form (law firm, consulting)
conversionFlow: {
  type: 'contact',
  subjects: ['General Inquiry', 'Consultation Request', 'Case Evaluation'],
}

// Quote request (construction, realestate)
conversionFlow: {
  type: 'quote',
  serviceCategories: ['Renovation', 'New Build', 'Repair'],
  allowAttachments: true,
}

// Emergency dispatch (medical, automotive)
conversionFlow: {
  type: 'dispatch',
  urgencyLevels: [
    { value: 'routine', label: 'Routine' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'emergency', label: 'Emergency' },
  ],
}
```

---

## Verifying the Migration

After customizing `site.config.ts`, run these checks:

```bash
# Type-check the config against the SiteConfig schema
pnpm --filter @clients/<client-name> type-check

# Build the client
pnpm --filter @clients/<client-name> build

# Start dev server
pnpm --filter @clients/<client-name> dev
```

Open `http://localhost:<port>` and verify:
- [ ] Brand colors applied correctly (ThemeInjector loads CSS custom properties)
- [ ] Correct sections shown per feature flags
- [ ] Nav links match configured `navLinks`
- [ ] Contact info displays correctly
- [ ] Booking/contact form reflects the `conversionFlow.type`
- [ ] Page title template shows correctly in browser tab

---

## Reusability Rubric

When creating client-specific components, evaluate whether they belong in shared packages:

### Component belongs in `@repo/marketing-components` if:
- Display-only (no CMS or API calls)
- Industry-agnostic (works for any business type with different data)
- Reused across 2+ client types
- Accepts data via props (no direct config access)

### Component belongs in `@repo/features` if:
- Contains business logic (form handling, API integration)
- Wraps `@repo/marketing-components` with `@repo/infra` adapters
- Used by multiple clients but may have integration-specific code

### Component belongs in the client's `components/` directory if:
- Client-specific (unique to one business)
- Tightly coupled to client's domain model
- One-off requirement unlikely to recur

---

## Common Pitfalls

| Issue | Resolution |
|-------|-----------|
| Dev server port conflict | Assign a unique port in `package.json` |
| `address` field type error | Use object `{ street, city, state, zip, country }` not a string |
| Theme colors do not apply | Ensure `ThemeInjector` is in the root layout |
| `noUncheckedIndexedAccess` error | Handle `array[i]` as `T \| undefined` |
| Cross-client import | Never import from another client; use `@repo/*` packages |
| `catalog:` version drift | Always use `catalog:` entries from `pnpm-workspace.yaml` |

---

## See Also

- [`docs/configuration/site-config-reference.md`](../configuration/site-config-reference.md) — Full SiteConfig field reference
- [`clients/README.md`](../../clients/README.md) — Deployment and multi-client workflow
- [`docs/migration/rollback-plan.md`](rollback-plan.md) — Rollback procedures
- [`packages/types/src/site-config.ts`](../../packages/types/src/site-config.ts) — Authoritative TypeScript types and Zod schema
