# Feature Breadth (2.16–2.19) — Normalized Specs

**Optional Mode:** Feature → enforce adapter contract + normalized schema.
**Package:** `packages/features/src/<feature>/`
**Reference:** Existing structure in `packages/features/src/booking/`, `contact/`, `blog/`, `services/`, `search/`
**Architecture:** Hybrid Server/Client Components with TanStack Query integration

---

## 2.16 Testimonials Feature

### 1️⃣ Objective Clarification

- Problem: No reusable testimonials feature; config/CMS/API sources need normalization
- Layer: L2 (@repo/features)
- Introduces: Types, runtime logic, source adapters, UI components
- Uses marketing components 2.4 (display variants)

### 2️⃣ Dependency Check

- **Completed:** 2.11 (feature skeleton), 2.4 (TestimonialCarousel, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11, 2.4 must be done

### 3️⃣ File System Plan

- **Create:** `packages/features/src/testimonials/index.ts`, `lib/schema.ts`, `lib/adapters.ts`, `lib/testimonials-config.ts`, `components/TestimonialsSection.tsx`
- **Update:** `packages/features/src/index.ts`
- **Delete:** None

### 4️⃣ Public API Design

```ts
export { TestimonialsSection } from './components/TestimonialsSection';
export { testimonialsSchema, type Testimonial, type TestimonialsConfig } from './lib/schema';
export { createTestimonialsConfig } from './lib/testimonials-config';
export { normalizeGoogleReviews, normalizeYelp, normalizeFromConfig } from './lib/adapters';
```

### 5️⃣ Data Contracts & Schemas

```ts
// Zod schema
const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['config', 'google', 'yelp']).optional(),
});
type Testimonial = z.infer<typeof testimonialSchema>;
```

- Adapter contract: `(raw: unknown) => Testimonial[]`; each adapter normalizes external payload

### 6️⃣ Internal Architecture

- **Server Components:** Data fetching and normalization run on server (zero JS cost)
- **Client Components:** Interactive UI elements with `'use client'` directive
- **TestimonialsSection**: accepts `testimonials: Testimonial[]`, `layout: 'carousel'|'grid'|'marquee'`, renders marketing component
- **Adapters**: Google Reviews API → normalize to Testimonial[]; Yelp → same; config (static) → same
- **Data Fetching**: React Server Components by default (async Server Components); client-side caching optional (TanStack Query not currently in dependencies; add if client-side caching needed)
- **Data Flow**: Server fetch → normalize → pass to Client Component; React 19 Server Actions for mutations
- **SSR**: async Server Components by default; CSR: optional client fetch hook (consider TanStack Query if complex caching needed)

### 7️⃣ Performance & SEO

- **React Server Components**: 20%+ bundle size reduction for data-fetching components
- **Concurrent React**: `useDeferredValue` for search inputs, `useTransition` for state updates
- **Lazy Loading**: Carousel if below fold; reduced-motion → grid
- **Code Splitting**: Dynamic imports for interactive components
- **Schema.org Review markup**: Optional (4.6 or feature-level)
- **Streaming SSR**: Server Components stream to client for faster TTI

### 8️⃣ Accessibility

- **WCAG 2.2 AA Compliance**: Color contrast, keyboard navigation, screen reader support
- **Radix Primitives**: Use for carousel/dialog components (built-in accessibility)
- **Focus Management**: Proper trap focus in modals, logical tab order
- **ARIA Patterns**: `aria-label`, `aria-describedby`, `role` attributes
- **Quote semantics**: `<blockquote>` for testimonials, `<cite>` for author
- **Keyboard Navigation**: Arrow keys for carousel, Escape to close modals

### 9️⃣ Analytics

- None by default; optional `onTestimonialView` if C.12 contract exists

### 🔟 Testing Strategy

- **Unit Tests**: `packages/features/src/testimonials/__tests__/adapters.test.ts` — adapter output shape
- **Component Tests**: `packages/features/src/testimonials/__tests__/TestimonialsSection.test.tsx` — render with mock data
- **Integration Tests**: Server Component rendering with async data
- **E2E Tests**: Playwright for critical user journeys (3-5 core flows)
- **Accessibility Tests**: `@axe-core/react` for WCAG compliance
- **Performance Tests**: Bundle size monitoring, TTI measurements
- **Tools**: Vitest (Vite projects) or Jest (legacy), React Testing Library, MSW for API mocking

### 1️⃣1️⃣ Example Usage

```ts
import { TestimonialsSection, createTestimonialsConfig, normalizeFromConfig } from '@repo/features/testimonials';
const config = createTestimonialsConfig(siteConfig.testimonials);
const items = normalizeFromConfig(config);
<TestimonialsSection testimonials={items} layout="carousel" />
```

### 1️⃣2️⃣ Failure Modes & Resilience

- **Adapter Errors**: Wrap in try/catch, return empty array with error logging
- **Network Failures**: TanStack Query retry logic with exponential backoff
- **Error Boundaries**: Feature-level error boundaries with graceful fallbacks
- **Server Component Errors**: Client-side error boundaries catch hydration issues
- **Data Validation**: Zod schema validation with detailed error messages
- **Monitoring**: Integrate with error tracking (Sentry, etc.)
- **Blockers**: 2.11, 2.4

### 1️⃣3️⃣ Checklist

1. Create testimonials/ folder structure
2. Add schema + types
3. Add adapters (config, Google, Yelp stubs)
4. Add TestimonialsSection component
5. Add createTestimonialsConfig
6. Export from features index
7. Type-check; build; tests

### 1️⃣4️⃣ Done Criteria

- Builds; adapters normalize; TestimonialsSection renders with marketing variants

### 1️⃣5️⃣ Anti-Overengineering

- **No live API key handling** in feature; pass fetched data from parent
- **No moderation UI**; assume pre-moderated content
- **Limited sources**: Stop at 3 sources (config, Google, Yelp); more = separate task
- **Bundle optimization**: Use Server Components for data-heavy operations
- **State management**: TanStack Query instead of manual state for server data
- **Internationalization**: Support i18n but don't implement translation logic
- **Security**: No XSS vulnerabilities in rendered content

---

## 2.17 Team Feature

### 1️⃣ Objective Clarification

- Member profiles with layouts; configurable
- Layer: L2; uses 2.3 TeamDisplay components
- Schema: reusable profile card

### 2️⃣ Dependency Check

- **Completed:** 2.11, 2.3

### 3️⃣ File System Plan

- **Create:** `packages/features/src/team/` (index, schema, config, TeamSection)
- **Update:** features index

### 4️⃣ Public API

```ts
export { TeamSection } from './components/TeamSection';
export { teamSchema, type TeamMember, type TeamConfig } from './lib/schema';
export { createTeamConfig } from './lib/team-config';
```

### 5️⃣ Data Contracts

```ts
const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.object({ src: z.string(), alt: z.string() }),
  bio: z.string().optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
});
```

### 6️⃣ Internal Architecture

- **Server Components**: Team data fetching and normalization on server
- **Client Components**: Interactive team member cards with hover states
- **TeamSection**: receives `members`, `layout`; renders TeamGrid/TeamCarousel/TeamDetailed from 2.3
- **TanStack Query**: Caches team data, handles refresh/invalidation
- **Error Boundaries**: Graceful fallback if team data fails to load

### 1️⃣3️⃣ Checklist

- Schema → config → TeamSection → export; copy pattern from testimonials

### 1️⃣5️⃣ Anti-Overengineering

- **No CMS sync**: Config or parent-provided data only
- **Server Components**: Use for data fetching, zero JS cost
- **State Management**: TanStack Query for caching, no manual state
- **Security**: Sanitize bio content to prevent XSS
- **Performance**: Lazy load team images below fold
- **Accessibility**: Proper alt texts, keyboard navigation

---

## 2.18 Gallery Feature

### 1️⃣ Objective Clarification

- Image optimization, lightbox; transform presets by use case
- Layer: L2; uses 2.6 Gallery components, Dialog for lightbox
- Data: image items with optional transform presets

### 2️⃣ Dependency Check

- **Completed:** 2.11, 2.6

### 3️⃣ File System Plan

- **Create:** `packages/features/src/gallery/` (index, schema, GallerySection, transform presets)
- **Update:** features index

### 4️⃣ Public API

```ts
export { GallerySection } from './components/GallerySection';
export { gallerySchema, type GalleryItem, type GalleryConfig } from './lib/schema';
export type { TransformPreset } from './lib/presets';
```

### 5️⃣ Data Contracts

- GalleryItem: src, alt, caption?; preset?: 'hero'|'thumbnail'|'lightbox'

### 6️⃣ Internal Architecture

- **Server Components**: Image metadata fetching and optimization on server
- **Client Components**: Lightbox interactions, image loading states
- **GallerySection**: Renders GalleryGrid/Carousel with preset-based sizing
- **next/image**: Automatic optimization with sizes/quality per preset
- **TanStack Query**: Cache image metadata, prefetch next gallery pages
- **Lightbox**: Dialog component with keyboard navigation
- **Performance**: Progressive loading, blur placeholders

### 1️⃣5️⃣ Anti-Overengineering

- **No DAM integration**: Pass URLs from parent, no CDN logic
- **Server Components**: Use for image metadata, zero JS cost
- **State Management**: TanStack Query for image cache, no manual state
- **Security**: Validate image URLs, prevent XSS in captions
- **Performance**: WebP/AVIF format, responsive images
- **Accessibility**: Alt text support, keyboard lightbox navigation

---

## 2.19 Pricing Feature

### 1️⃣ Objective Clarification

- Data-driven pricing; currency/locale formatting centralized
- Layer: L2; uses 2.5 Pricing components
- Formatting: pass formatted strings from config/formatter; no Intl in component

### 2️⃣ Dependency Check

- **Completed:** 2.11, 2.5

### 3️⃣ File System Plan

- **Create:** `packages/features/src/pricing/` (index, schema, PricingSection, formatCurrency util)
- **Update:** features index

### 4️⃣ Public API

```ts
export { PricingSection } from './components/PricingSection';
export { pricingSchema, formatCurrency, type PricingTier, type PricingConfig } from './lib/schema';
```

### 5️⃣ Data Contracts

- PricingTier: name, price (string or number+currency), interval?, features[], cta
- formatCurrency(amount, currency, locale): string

### 6️⃣ Internal Architecture

- **Server Components**: Pricing data fetching and currency formatting on server
- **Client Components**: Interactive pricing toggles, hover states
- **PricingSection**: Renders pricing cards with tier comparison
- **formatCurrency**: Server-side utility, no client-side Intl
- **TanStack Query**: Cache pricing data, handle real-time updates
- **i18n Support**: Locale-aware formatting, currency symbols

### 1️⃣5️⃣ Anti-Overengineering

- **No payment processing**: Display only, no checkout logic
- **Server Components**: Use for pricing data, zero JS cost
- **State Management**: TanStack Query for pricing cache, no manual state
- **Calculator**: Simple client-side math, no backend validation
- **Security**: Sanitize pricing display, prevent price manipulation
- **Performance**: Static pricing where possible, cache dynamic rates
