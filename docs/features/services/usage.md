# Services Feature Usage Guide

**Package:** `@repo/features/services`  
**Version:** 1.0.0  
**Last Updated:** 2026-02-17

## Overview

The services feature provides configurable service overview and detail page components for marketing websites. It supports multiple industries (salon, restaurant, law-firm, dental, etc.) through props-driven configuration. Components render Schema.org Service and FAQPage structured data for SEO.

## Quick Start

### 1. Services Overview (Homepage)

Create a services config with your service categories:

```typescript
// lib/services-config.ts
import { Scissors, Palette, Sparkles } from 'lucide-react';
import type { ServiceOverviewItem } from '@repo/features/services';

export const servicesOverviewItems: ServiceOverviewItem[] = [
  {
    icon: Scissors,
    title: 'Haircuts & Styling',
    description: 'Precision cuts for women, men, and children.',
    href: '/services/haircuts',
  },
  {
    icon: Palette,
    title: 'Coloring Services',
    description: 'Full color, highlights, and balayage.',
    href: '/services/coloring',
  },
  {
    icon: Sparkles,
    title: 'Treatments',
    description: 'Deep conditioning and scalp treatments.',
    href: '/services/treatments',
  },
];
```

Use on the homepage:

```tsx
import { ServicesOverview } from '@repo/features/services';
import { servicesOverviewItems } from '@/lib/services-config';

export default function HomePage() {
  return (
    <ServicesOverview
      services={servicesOverviewItems}
      heading="Our Services"
      subheading="From classic cuts to modern makeovers."
    />
  );
}
```

### 2. Service Detail Page

```tsx
import { ServiceDetailLayout } from '@repo/features/services';
import siteConfig from '@/site.config';
import { getPublicBaseUrl } from '@/lib/env.public';

export default function HaircutsPage() {
  return (
    <ServiceDetailLayout
      icon={Scissors}
      title="Haircuts & Styling"
      description="Precision cuts and styling for women, men, and children."
      serviceSlug="haircuts"
      siteName={siteConfig.name}
      baseUrl={getPublicBaseUrl()}
      included={['Consultation', 'Wash', 'Cut', 'Style']}
      process={[
        { title: 'Consultation', description: 'Discuss your needs.' },
        { title: 'The Cut', description: 'Expert techniques.' },
      ]}
      whoItsFor={['Anyone looking for a fresh look', 'Maintenance trims']}
      pricing={[
        { tier: 'Women', description: 'Wash, Cut & Blow-dry', href: '/pricing#women' },
        { tier: 'Men', description: 'Wash, Cut & Style', href: '/pricing#men' },
      ]}
      faqs={[
        { question: 'How often?', answer: 'Every 6-8 weeks recommended.' },
      ]}
    />
  );
}
```

## API Reference

### `ServicesOverview`

Props-driven overview grid for service categories.

| Prop        | Type                  | Required | Default        | Description                          |
| ----------- | --------------------- | -------- | -------------- | ------------------------------------ |
| services    | ServiceOverviewItem[] | Yes      | —              | List of service categories           |
| heading     | string                | No       | `"Our Services"` | Section heading                    |
| subheading  | string                | No       | —              | Section description                  |

### `ServiceDetailLayout`

Full service detail page with hero, included, process, pricing, FAQs, and structured data.

| Prop              | Type   | Required | Default                     | Description                    |
| ----------------- | ------ | -------- | --------------------------- | ------------------------------ |
| icon              | LucideIcon | Yes  | —                           | Lucide icon component          |
| title             | string | Yes      | —                           | Service title                  |
| description       | string | Yes      | —                           | Hero description               |
| included          | string[] | Yes    | —                           | What's included list           |
| process           | ProcessStep[] | Yes | —                       | Process steps                  |
| whoItsFor         | string[] | Yes    | —                           | Target audience                |
| pricing           | ServicePricingTier[] | Yes | —                  | Pricing tiers with CTAs        |
| faqs              | AccordionItem[] | Yes   | —                        | FAQ items                      |
| siteName          | string | Yes      | —                           | Organization name (Schema.org) |
| baseUrl           | string | Yes      | —                           | Canonical base URL             |
| serviceSlug       | string | No       | —                           | Slug for structured data URL   |
| contactHref       | string | No       | `"/contact"`                | Contact CTA link               |
| ctaLabel          | string | No       | `"Get Started"`             | Hero CTA button label          |
| finalCtaHeading   | string | No       | `"Ready to Get Started?"`   | Final CTA heading              |
| finalCtaDescription | string | No     | (default consultation text) | Final CTA description          |
| finalCtaButtonLabel | string | No     | `"Schedule Free Consultation"` | Final CTA button label     |

### Types

```typescript
interface ServiceOverviewItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface ServicePricingTier {
  tier: string;
  description: string;
  href: string;
}
```

## Cross-Industry Usage

For restaurants, use menu categories; for law firms, practice areas; for dental, service categories. The same components accept industry-appropriate content:

```tsx
// Restaurant example
const services = [
  { icon: Utensils, title: 'Brunch', description: '...', href: '/menu/brunch' },
  { icon: Wine, title: 'Dinner', description: '...', href: '/menu/dinner' },
];
```

## SEO & Structured Data

`ServiceDetailLayout` emits:

- **Schema.org Service**: name, description, provider, offers
- **Schema.org FAQPage**: FAQ items for rich results

Ensure `siteName` and `baseUrl` are correct for valid structured data.
