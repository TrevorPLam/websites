<!--
@file docs/migration/reusability-rubric.md
@role Architecture reference — component reusability criteria for @repo/marketing-components
@summary Defines the rubric for deciding which components belong in @repo/marketing-components
         versus remaining client-local. Governs the config-driven, industry-agnostic design rule.
@invariants
  - Marketing components must accept SiteConfig sub-trees, not industry-specific props
  - No industry business logic in shared components; all variance driven by props/config
  - Component API must be stable across all industries (salon, dental, legal, restaurant, retail)
@gotchas
  - A component that checks `if (industry === 'salon')` is NEVER reusable — extract to config
  - Slight design differences between clients are fine if they're controlled by a prop, not if-else
  - Performance budget: shared components must not import heavy industry-specific assets
@verification
  - pnpm validate-marketing-exports
  - pnpm type-check
  - Visual review across at least 2 industry clients
@status active — last reviewed 2026-02-19
-->

# Component Reusability Rubric

**Purpose:** Decide whether a UI component belongs in `@repo/marketing-components` (shared) or in a `clients/<name>/components/` directory (client-local).

**Last Updated:** 2026-02-19

---

## The Core Rule

> A component is reusable if — and only if — **all industry-specific behavior is driven by props or `site.config.ts` values, with zero hard-coded industry logic inside the component body.**

---

## Decision Checklist

Run through all questions. A single **No** disqualifies the component from `@repo/marketing-components`.

### 1. Config-Driven API

| Check | Question | Pass |
|-------|----------|------|
| 1a | Does the component accept its content/data via props (not fetch its own industry data)? | ☐ |
| 1b | Are layout variations controlled by a prop (`variant`, `layout`, `size`)? | ☐ |
| 1c | Are theme values (colors, fonts, radius) consumed from CSS variables — not hard-coded? | ☐ |
| 1d | Are CTA labels, headings, and body copy passed as props — never hardcoded? | ☐ |

### 2. Industry Neutrality

| Check | Question | Pass |
|-------|----------|------|
| 2a | Does the component contain zero `if (industry === '...')` or industry-name strings? | ☐ |
| 2b | Does it work correctly when rendered for at least 3 different industry types (salon, dental, legal)? | ☐ |
| 2c | Are industry-specific icons/images injected via props — not imported directly? | ☐ |

### 3. Stable Public API

| Check | Question | Pass |
|-------|----------|------|
| 3a | Does the component export a TypeScript interface for all props? | ☐ |
| 3b | Are optional props safe to omit without breaking the render? | ☐ |
| 3c | Has the API been stable (or intentionally versioned) for at least one full client iteration? | ☐ |

### 4. Accessibility & Performance

| Check | Question | Pass |
|-------|----------|------|
| 4a | Does the component meet WCAG 2.1 AA? (See `docs/accessibility/component-a11y-rubric.md`) | ☐ |
| 4b | Is the bundle contribution < 10 kB gzipped (excluding peer deps)? | ☐ |
| 4c | Does it use `next/image` for any images (never raw `<img>`)? | ☐ |

### 5. Test Coverage

| Check | Question | Pass |
|-------|----------|------|
| 5a | Does the component have a unit test covering each variant? | ☐ |
| 5b | Does it have an accessibility test via `jest-axe`? | ☐ |

---

## Scoring

- **All checks pass** → Component belongs in `@repo/marketing-components`
- **1a, 2a, or 2b fail** → Client-local only. Refactor to pass before promoting.
- **4a fails** → Fix accessibility before promoting. No exceptions.
- **5a or 5b fail** → Write tests before promoting.

---

## Component Family Structure

Components in `@repo/marketing-components` are organized into **families**. Each family is a directory with an `index.ts` barrel export:

```
packages/marketing-components/src/
  hero/
    index.ts          # exports HeroSplit, HeroCentered, HeroVideo, …
    HeroSplit.tsx
    HeroCentered.tsx
  services/
    index.ts          # exports ServicesGrid, ServicesList, ServicesCards
    ServicesGrid.tsx
  testimonials/
    index.ts
    TestimonialsCarousel.tsx
  cta/
    index.ts
    CtaBanner.tsx
  # … more families
```

Each family exports components whose **variant prop** selects the layout. For example:

```typescript
// packages/marketing-components/src/hero/index.ts
export type HeroVariant = 'split' | 'centered' | 'video' | 'minimal';

export interface HeroProps {
  variant?: HeroVariant;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}
```

The variant is driven by `site.config.ts`:

```typescript
// clients/my-client/app/page.tsx
import { Hero } from '@repo/marketing-components';
import siteConfig from '@/site.config';

export default function HomePage() {
  return <Hero variant={siteConfig.features.hero} heading={siteConfig.name} />;
}
```

---

## Migration Workflow

When promoting a client-local component to `@repo/marketing-components`:

1. **Audit against rubric** — run checklist above, fix any failures
2. **Move to correct family directory** — or create a new family if needed
3. **Update barrel export** — add to `src/<family>/index.ts` and `src/index.ts`
4. **Update client imports** — replace `@/components/Hero` with `@repo/marketing-components`
5. **Run validation** — `pnpm validate-marketing-exports && pnpm type-check`
6. **Add/update tests** — ensure unit + axe tests exist
7. **Run across clients** — verify the component renders correctly for at least 2 industry clients

---

## Anti-Patterns (Never Do These)

```typescript
// ❌ Industry-specific logic inside shared component
function ServicesGrid({ industry }: { industry: string }) {
  if (industry === 'salon') {
    return <SalonServicesGrid />;
  }
  return <DefaultServicesGrid />;
}

// ✅ Config-driven variant
function ServicesGrid({ variant = 'grid', services }: ServicesGridProps) {
  if (variant === 'list') return <ServicesGridList services={services} />;
  return <ServicesGridCards services={services} />;
}
```

```typescript
// ❌ Hard-coded industry content
function HeroSection() {
  return <h1>Welcome to Our Salon</h1>;
}

// ✅ Prop-driven content
function HeroSection({ heading, subheading }: HeroSectionProps) {
  return <h1>{heading}</h1>;
}
```

```typescript
// ❌ Deep import that bypasses the public API
import { HeroSplit } from '@repo/marketing-components/src/hero/HeroSplit';

// ✅ Public export only
import { HeroSplit } from '@repo/marketing-components';
```

---

## Related Documents

- `docs/architecture/module-boundaries.md` — dependency direction rules
- `docs/accessibility/component-a11y-rubric.md` — accessibility requirements
- `docs/migration/template-to-client.md` — full client migration guide
- `CLAUDE.md` — Architecture & Dependency Rules section
