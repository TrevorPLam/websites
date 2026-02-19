<!--
/**
 * @file docs/features/testimonials.md
 * @role docs
 * @summary Developer guide for the testimonials feature: components, props, site.config integration.
 *
 * @invariants
 * - Testimonial components are display-only; they accept Testimonial[] as props.
 * - features.testimonials in site.config.ts controls which variant renders.
 * - The Testimonial type accepts both `quote` and `content` for the review text (aliases).
 *
 * @verification
 * - Verified props against packages/marketing-components/src/testimonials/types.ts
 * - Components confirmed: TestimonialCarousel, TestimonialGrid, TestimonialMarquee
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Testimonials Feature

**Package:** `@repo/marketing-components/testimonials`
**Config key:** `features.testimonials`
**Last Updated:** 2026-02-19

---

## Overview

The testimonials feature renders customer reviews and social proof. All three variants share the `Testimonial` type, making it easy to switch between layouts. Components are display-only — they accept data as props.

---

## Enabling Testimonials

In `site.config.ts`:

```typescript
features: {
  testimonials: 'carousel' | 'grid' | 'marquee' | null,
}
```

Set to `null` to hide the testimonials section.

---

## `Testimonial` Type

```typescript
interface Testimonial {
  id: string;
  quote?: string;    // Review text (use quote or content, not both)
  content?: string;  // Alias for quote
  author: {
    name: string;
    role?: string;    // Job title or descriptor ('Happy Customer')
    company?: string;
    photo?: { src: string; alt: string };
    avatar?: string;  // Alternative to photo.src (URL string)
  };
  rating?: number;   // 1-5 star rating (optional)
}
```

---

## Components

### `TestimonialCarousel`

Auto-advancing carousel with navigation dots. Best for 3–8 testimonials featured prominently.

```typescript
import { TestimonialCarousel } from '@repo/marketing-components';

<TestimonialCarousel
  title="What Our Clients Say"
  testimonials={testimonials}
/>
```

### `TestimonialGrid`

Static grid layout. Best for 3–12 testimonials where all should be visible at once.

```typescript
import { TestimonialGrid } from '@repo/marketing-components';

<TestimonialGrid
  title="Client Reviews"
  testimonials={testimonials}
  columns={3}
/>
```

### `TestimonialMarquee`

Continuous horizontal scroll marquee. Best for 8+ short testimonials, social-proof wall style.

```typescript
import { TestimonialMarquee } from '@repo/marketing-components';

<TestimonialMarquee
  testimonials={testimonials}
  speed="normal"  // 'slow' | 'normal' | 'fast'
/>
```

---

## Usage Example

```typescript
// lib/testimonials-data.ts
import type { Testimonial } from '@repo/marketing-components';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'Best salon in the city! My hair has never looked better.',
    author: {
      name: 'Sarah M.',
      role: 'Regular Client',
      photo: { src: '/images/clients/sarah.jpg', alt: 'Sarah M.' },
    },
    rating: 5,
  },
  {
    id: 't2',
    quote: 'The team is incredibly professional and talented.',
    author: {
      name: 'Michael R.',
      company: 'Tech Startup',
    },
    rating: 5,
  },
];
```

```typescript
// app/page.tsx
import { TestimonialCarousel } from '@repo/marketing-components';
import { testimonials } from '@/lib/testimonials-data';

export default function HomePage() {
  return (
    <main>
      <TestimonialCarousel
        title="What Our Clients Say"
        testimonials={testimonials}
      />
    </main>
  );
}
```

---

## Rating Display

When `rating` is provided (1–5), components render star indicators. Omit the field if ratings are not applicable for the business.

---

## Industry Recommendations

| Industry | Recommended Variant |
|----------|-------------------|
| Salon / Beauty | `carousel` |
| Restaurant | `grid` |
| Law firm | `grid` (text-heavy, credibility focus) |
| SaaS / Retail | `marquee` (high volume) |
| Medical / Dental | `carousel` (controlled, curated reviews) |

---

## Sourcing Testimonial Data

The component is data-source agnostic; fetch in a server component and pass as props:

- **Google Reviews** — Fetch via Places API
- **Yelp** — Yelp Fusion API
- **HubSpot CRM** — Pull from deal notes or custom objects
- **Static JSON** — For curated, manually-selected reviews

---

## Accessibility

- Carousel components pause on hover to respect reduced-motion preferences
- Marquee respects `prefers-reduced-motion: reduce` (pauses animation)
- Star ratings include accessible `aria-label` describing the rating value

---

## See Also

- [`packages/marketing-components/src/testimonials/`](../../packages/marketing-components/src/testimonials/) — Source code and types
- [`docs/configuration/site-config-reference.md`](../configuration/site-config-reference.md) — Feature flags reference
