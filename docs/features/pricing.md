<!--
/**
 * @file docs/features/pricing.md
 * @role docs
 * @summary Developer guide for the pricing feature: components, props, site.config integration.
 *
 * @invariants
 * - Pricing components are display-only; they accept PricingPlan[] as props.
 * - features.pricing in site.config.ts controls which variant renders.
 * - PricingFeature.included can be boolean or a string override ('Unlimited', '5GB').
 *
 * @verification
 * - Verified props against packages/marketing-components/src/pricing/types.ts
 * - Components confirmed: PricingTable, PricingCards, PricingCalculator (stub)
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Pricing Feature

**Package:** `@repo/marketing-components/pricing`
**Config key:** `features.pricing`
**Last Updated:** 2026-02-19

---

## Overview

The pricing feature renders service tiers or price lists. Components are display-only and accept plan data as props. Two layout variants are implemented: cards (most common) and table (feature comparison). A calculator variant is stubbed for Wave 2.

---

## Enabling Pricing

In `site.config.ts`:

```typescript
features: {
  pricing: 'table' | 'cards' | 'calculator' | null,
}
```

Set to `null` to hide the pricing section. Use `null` for businesses where pricing is custom or quote-based.

---

## Types

```typescript
interface PricingFeature {
  name: string;
  included: boolean | string; // true/false, or a string override like 'Unlimited', '5GB'
}

interface PricingPlan {
  id: string;
  name: string;
  price: string; // Display string: '$99', 'From $200', 'Custom'
  period?: 'month' | 'year'; // Billing period label
  description?: string;
  features: PricingFeature[];
  cta?: {
    label: string;
    href: string;
  };
  popular?: boolean; // Highlights this plan (shows "Most Popular" badge)
}
```

---

## Components

### `PricingCards`

Card-based layout with one card per plan. Best for 2–4 tiers. Most common for service businesses.

```typescript
import { PricingCards } from '@repo/marketing-components';

<PricingCards
  title="Our Packages"
  plans={plans}
/>
```

### `PricingTable`

Feature comparison table with plans as columns and features as rows. Best for 3–5 tiers with many comparable features (SaaS-style).

```typescript
import { PricingTable } from '@repo/marketing-components';

<PricingTable
  title="Compare Plans"
  plans={plans}
/>
```

### `PricingCalculator`

Interactive price estimator — stub, planned for Wave 2.

---

## Usage Example

```typescript
// lib/pricing-data.ts
import type { PricingPlan } from '@repo/marketing-components';

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Cut',
    price: '$45',
    description: 'Wash, cut, and style',
    features: [
      { name: 'Shampoo & conditioning', included: true },
      { name: 'Precision cut', included: true },
      { name: 'Blow dry & style', included: true },
      { name: 'Color treatment', included: false },
    ],
    cta: { label: 'Book Now', href: '/book?service=basic' },
  },
  {
    id: 'color',
    name: 'Color & Cut',
    price: '$120',
    description: 'Full color service with cut',
    features: [
      { name: 'Shampoo & conditioning', included: true },
      { name: 'Precision cut', included: true },
      { name: 'Blow dry & style', included: true },
      { name: 'Full color treatment', included: true },
    ],
    cta: { label: 'Book Now', href: '/book?service=color' },
    popular: true,
  },
];
```

```typescript
// app/services/pricing/page.tsx
import { PricingCards } from '@repo/marketing-components';
import { pricingPlans } from '@/lib/pricing-data';

export default function PricingPage() {
  return (
    <main>
      <PricingCards title="Service Pricing" plans={pricingPlans} />
    </main>
  );
}
```

---

## The `popular` Flag

When a plan has `popular: true`, components render a visual highlight (badge, border accent, or background color) to draw attention to the recommended tier. Use for at most one plan per set.

---

## Pricing Display Strategies

### Fixed Pricing

```typescript
price: '$99',
period: 'month',  // "$99 / month"
```

### Starting Price

```typescript
price: 'From $200',  // No period field needed
```

### Custom / Quote-Based

```typescript
price: 'Custom',
cta: { label: 'Get a Quote', href: '/contact' },
```

### Free Tier

```typescript
price: 'Free',
```

### String Feature Values

Use a string `included` value to show custom quantities instead of a checkmark/X:

```typescript
{ name: 'Team members', included: 'Unlimited' },
{ name: 'Storage', included: '100GB' },
{ name: 'API calls', included: '10,000/month' },
```

---

## Industry Recommendations

| Industry       | Recommended Variant | Notes                        |
| -------------- | ------------------- | ---------------------------- |
| Salon / Beauty | `cards`             | Per-service pricing          |
| SaaS           | `table`             | Feature comparison important |
| Fitness        | `cards`             | Membership tiers             |
| Consulting     | `null`              | Use quote flow instead       |
| Law firm       | `null`              | Hourly rates via contact     |
| Dental         | `cards`             | Treatment package pricing    |

---

## See Also

- [`packages/marketing-components/src/pricing/`](../../packages/marketing-components/src/pricing/) — Source code and types
- [`docs/features/booking/usage.md`](booking/usage.md) — Linking pricing CTAs to booking flow
- [`docs/configuration/site-config-reference.md`](../configuration/site-config-reference.md) — Feature flags reference
