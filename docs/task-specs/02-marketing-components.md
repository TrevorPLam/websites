# Marketing Components (1.7, 2.1–2.10) — Normalized Specs

**Optional Mode:** Marketing component → enforce variant-based architecture; shared types first.
**Package:** `@repo/marketing-components` (created in 1.7).
**Last Updated:** 2026-02-17 — Updated for React Server Components, React Compiler, WCAG 2.2 AA (current standard); WCAG 3.0 in Editor's Draft (Feb 2026).

---

## 1.7 Create @repo/marketing-components Package Scaffold

### 1️⃣ Objective Clarification

- Problem: No target package for 2.1–2.10
- Layer: L2 (new package)
- Introduces: Package scaffold, no runtime logic yet

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** pnpm workspace; react from catalog
- **Blockers:** None

### 3️⃣ File System Plan

- **Create:** `packages/marketing-components/package.json`, `tsconfig.json`, `src/index.ts`
- **Update:** None (workspace `packages/*` already includes it)
- **Delete:** None

### 4️⃣ Public API

```ts
// src/index.ts — barrel; empty or placeholder
export {};
```

### 5️⃣ Data Contracts

- No new schema

### 6️⃣ Internal

- package.json: name `@repo/marketing-components`, deps: `@repo/ui`, `@repo/utils`, `@repo/types`; peer: react, react-dom (catalog)

### 7️⃣–9️⃣

- N/A for scaffold

### 🔟 Testing

- Build succeeds; no tests for empty package

### 1️⃣1️⃣ Example

- N/A

### 1️⃣2️⃣ Failure Modes

- Missing workspace inclusion → verify `pnpm-workspace.yaml` includes `packages/*`

### 1️⃣3️⃣ Checklist

1. Create `packages/marketing-components/package.json` (template from TODO.md)
2. Create `tsconfig.json` (extend @repo/typescript-config)
3. Create `src/index.ts` with `export {}`
4. Run `pnpm install && pnpm --filter @repo/marketing-components build`
5. Confirm no circular deps

### 1️⃣4️⃣ Done Criteria

- Package exists; builds; 2.1 can add hero as first real export

### 1️⃣5️⃣ Anti-Overengineering

- No components; no Storybook; just scaffold

---

## 2.1 HeroVariants

### 1️⃣ Objective Clarification

- Problem: No reusable hero patterns; each template hand-rolls
- Layer: L2 (marketing-components)
- Introduces: 4 variants, shared HeroProps, UI

### 2️⃣ Dependency Check

- **Completed:** 1.7
- **Packages:** @repo/ui, @repo/utils, @repo/types

### 3️⃣ File System Plan

- **Create:** `packages/marketing-components/src/hero/types.ts`, `HeroCentered.tsx`, `HeroSplit.tsx`, `HeroVideo.tsx`, `HeroCarousel.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts`

### 4️⃣ Public API

```ts
// Enhanced with discriminated unions for type safety
interface BaseHeroProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

interface HeroCenteredProps extends BaseHeroProps {
  variant: 'centered';
  image: { src: string; alt: string };
}

interface HeroSplitProps extends BaseHeroProps {
  variant: 'split';
  image: { src: string; alt: string };
}

interface HeroVideoProps extends BaseHeroProps {
  variant: 'video';
  video: { src: string; poster?: string };
}

interface HeroCarouselProps extends BaseHeroProps {
  variant: 'carousel';
  carouselItems: Array<{ image: { src: string; alt: string }; title?: string }>;
}

type HeroProps = HeroCenteredProps | HeroSplitProps | HeroVideoProps | HeroCarouselProps;

export { HeroCentered, HeroSplit, HeroVideo, HeroCarousel };
export type { HeroProps, BaseHeroProps };
```

### 5️⃣ Data Contracts

- HeroProps in types.ts; no Zod (config layer validates)
- Carousel items: normalized `{ image, title? }`

### 6️⃣ Internal

- 2.1a: types.ts first with discriminated unions
- 2.1b–e: Each variant as separate component; HeroCentered = baseline (fast LCP)
- Use next/image for images; lazy video
- **RSC Boundaries:** Hero variants as Server Components (no interactivity)
- **React Compiler v1.0:** Optimize with automatic memoization; no manual useMemo needed
- **Compound Pattern:** Consider Hero.Root + Hero.Variant composition for complex cases

### 7️⃣ Performance & SEO

- LCP: HeroCentered/image above fold; priority on hero image; no heavy JS above fold (target < 2.5s)
- Lazy load carousel/video; respect prefers-reduced-motion (no autoplay if reduced)
- **React Compiler v1.0:** Automatic fine-grained memoization of props and renders (no manual useMemo needed)
- **RSC Streaming:** Server-side rendering with progressive enhancement
- **Concurrent Features:** Use startTransition for non-urgent UI updates
- **INP Optimization:** Target <200ms for 75th percentile interactions

### 8️⃣ Accessibility

- Semantic h1 for title; alt on images; video captions/aria-label
- **WCAG 2.2 Current:** 24×24px minimum touch targets (AA compliance)
- **WCAG 3.0 Preparation:** Outcomes-based approach; Bronze/Silver/Gold scoring (Bronze ≈ WCAG 2.2 AA)
- **Enhanced ARIA:** Comprehensive ARIA patterns for screen readers
- **Reduced Motion:** Respect prefers-reduced-motion for all animations
- **Keyboard Navigation:** Full keyboard support for interactive elements

### 9️⃣ Analytics

- Optional: `onCtaClick` callback; CTA click event naming per C.12 when available

### 🔟 Testing

- `packages/marketing-components/src/hero/__tests__/HeroVariants.test.tsx` — render each variant, snapshot
- **Vitest + Testing Library:** Modern testing stack replacing Jest for performance
- **Accessibility Testing:** axe-core integration for automated a11y testing (WCAG 2.2 AA)
- **Visual Regression:** Storybook + Chromatic for visual testing
- **Type Safety:** TypeScript discriminated union validation in tests
- **Performance Testing:** LCP and INP metrics validation

### 1️⃣1️⃣ Example

```tsx
<HeroCentered
  title="Welcome"
  subtitle="..."
  primaryCta={{ label: 'Book', href: '/book' }}
  image={{ src: '/hero.jpg', alt: '...' }}
/>
```

### 1️⃣3️⃣ Checklist

1. 2.1a: Create types.ts with HeroProps
2. 2.1b: HeroCentered
3. 2.1c: HeroSplit
4. 2.1d: HeroVideo (with reduced-motion fallback to image)
5. 2.1e: HeroCarousel
6. Barrel export; update package index
7. Type-check; build; no circular deps

### 1️⃣5️⃣ Anti-Overengineering

- No CMS adapter; no industry-specific variants; keep 4 variants only

---

## 2.2 ServiceShowcase

### 1️⃣ Objective Clarification

- Service presentation: grid, list, tabs, accordion layouts
- Layer: L2; uses 1.3 Tabs, Accordion from @repo/ui

### 2️⃣ Dependency Check

- **Completed:** 1.7, 1.3
- **Packages:** @repo/ui (Accordion, Tabs)

### 3️⃣ File System Plan

- **Create:** `packages/marketing-components/src/services/types.ts`, `ServiceGrid.tsx`, `ServiceList.tsx`, `ServiceTabs.tsx`, `ServiceAccordion.tsx`, `index.ts`
- **Update:** marketing-components/src/index.ts

### 4️⃣ Public API

```ts
// Enhanced with discriminated unions for layout variants
interface BaseServiceShowcaseProps {
  services: ServiceItem[];
  title?: string;
}

interface ServiceGridProps extends BaseServiceShowcaseProps {
  layout: 'grid';
  columns?: number;
}

interface ServiceListProps extends BaseServiceShowcaseProps {
  layout: 'list';
}

interface ServiceTabsProps extends BaseServiceShowcaseProps {
  layout: 'tabs';
  defaultTab?: string;
}

interface ServiceAccordionProps extends BaseServiceShowcaseProps {
  layout: 'accordion';
  allowMultiple?: boolean;
}

type ServiceShowcaseProps =
  | ServiceGridProps
  | ServiceListProps
  | ServiceTabsProps
  | ServiceAccordionProps;

export { ServiceGrid, ServiceList, ServiceTabs, ServiceAccordion };
export type { ServiceItem, ServiceShowcaseProps, BaseServiceShowcaseProps };
```

### 5️⃣ Data Contracts

- ServiceItem normalized; no Zod in package (config/site validates)

### 6️⃣ Internal

- 2.2a: types first with discriminated unions
- 2.2b–e: Each layout component; ServiceTabs uses Tabs; ServiceAccordion uses Accordion
- **Compound Pattern:** ServiceShowcase.Root + ServiceShowcase.Grid/List/Tabs/Accordion
- **RSC Boundaries:** Static layouts (Grid/List) as Server Components; interactive layouts (Tabs/Accordion) as Client Components
- **React Compiler v1.0:** Optimize service list rendering and filtering (no manual useMemo needed)

### 7️⃣ Performance

- LCP: prioritize visible services; lazy below-fold images (target < 2.5s)
- **React Compiler v1.0:** Automatic fine-grained memoization of props and renders
- **RSC Benefits:** 63% bundle size reduction, streaming HTML, eliminated client-server waterfalls
- **INP Optimization:** Target <200ms for 75th percentile interactions

### 8️⃣ Accessibility

- Semantic structure; Tabs/Accordion use Radix/Accordion a11y
- **WCAG 2.2 Current:** 24×24px minimum touch targets (AA compliance)
- **WCAG 3.0 Preparation:** Outcomes-based approach; Bronze/Silver/Gold scoring (Bronze ≈ WCAG 2.2 AA)
- **Enhanced ARIA:** Comprehensive ARIA patterns for screen readers
- **Reduced Motion:** Respect prefers-reduced-motion for all animations

### 9️⃣ Analytics

- Optional CTA click hooks

### 1️⃣3️⃣ Checklist

- Types → Grid → List → Tabs → Accordion → export

### 1️⃣5️⃣ Anti-Overengineering

- No filtering logic (belongs in page template); no CMS wiring

---

**2.3–2.10 (Condensed)**

**2.3 TeamDisplay:** TeamGrid, TeamCarousel, TeamDetailed. Profile: `{ name, role, image, bio?, socialLinks?, credentials?, department? }`. Person schema.org markup for SEO. TeamGrid as Server Component; TeamCarousel/Detailed as Client Components. Accessibility: role="region" for carousel, WCAG 2.2 AA compliance.

**2.4 Testimonials:** TestimonialCarousel, TestimonialGrid, TestimonialMarquee. Item: `{ quote, author, role?, image?, rating? }`. Motion respects prefers-reduced-motion.

**2.5 Pricing:** PricingTable, PricingCards, PricingCalculator. Tiers: `{ name, price, interval?, features[], cta }`. Uses 1.3 Tabs. No currency logic in component; pass formatted strings.

**2.6 Gallery:** ImageGrid, ImageCarousel, LightboxGallery. Uses 1.1 Dialog for lightbox. Items: `{ src, alt, caption? }`. Progressive loading; lightbox keyboard (Escape, arrows).

**2.7 Stats Counter:** Animated number on scroll; IntersectionObserver; SSR-safe (no window); reduced-motion → static number.

**2.8 CTA Section:** CTABanner, CTASplit. Props: title, description, primaryCta, secondaryCta?, image?. Analytics hooks for CTA clicks.

**2.9 FAQ:** Accordion-style; Schema.org FAQPage JSON-LD output. Items: `{ question, answer }`. Optional search/filter (simple string match).

**2.10 Contact Form Variants:** SimpleContactForm, MultiStepContactForm, BookingContactForm. Normalized submission contract: `onSubmit(data)`. Configurable consent field; no server logic in component.

---

## 2026 Modern Standards Integration

### **React Server Components (RSC) Strategy**

- **Server Components:** Static content, data fetching, SEO-critical components
- **Client Components:** Interactive elements (tabs, accordions, forms)
- **Boundary Definition:** Marketing content (hero, services) as Server Components; UI interactions as Client Components

### **React Compiler Optimization**

- **Automatic Memoization:** No manual `useMemo`/`useCallback` needed
- **Fine-grained Reactivity:** Compiler optimizes prop passing and re-renders
- **Performance Monitoring:** Track Core Web Vitals improvements

### **WCAG 3.0 Readiness**

- **Outcomes-Based Approach:** Focus on user needs over technical compliance
- **Bronze/Silver/Gold Scoring:** Prepare for graded accessibility assessment
- **Enhanced Testing:** Automated a11y testing with axe-core integration

### **Modern Testing Stack**

- **Vitest + Testing Library:** Fast, modern unit testing
- **Visual Regression:** Storybook + Chromatic for component testing
- **Accessibility Testing:** axe-core integration in test suite

### **Advanced TypeScript Patterns**

- **Discriminated Unions:** Type-safe variant selection
- **Branded Types:** Enhanced type safety for IDs and special values
- **Utility Types:** Leverage TypeScript's built-in utility types

---

### Shared 2.x Checklist

1. Create types in `types.ts`
2. Implement variants
3. Barrel in domain folder
4. Re-export from package index
5. Type-check; build; no circular deps
