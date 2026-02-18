# Marketing Components (1.7, 2.1–2.10) — Normalized Specs

**Optional Mode:** Marketing component → enforce variant-based architecture; shared types first.
**Package:** `@repo/marketing-components` (created in 1.7).

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
interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: string; alt: string };
  video?: { src: string; poster?: string };
  carouselItems?: Array<{ image: { src: string; alt: string }; title?: string }>;
  variant?: 'centered' | 'split' | 'video' | 'carousel';
}
export { HeroCentered, HeroSplit, HeroVideo, HeroCarousel };
export type { HeroProps };
```

### 5️⃣ Data Contracts
- HeroProps in types.ts; no Zod (config layer validates)
- Carousel items: normalized `{ image, title? }`

### 6️⃣ Internal
- 2.1a: types.ts first
- 2.1b–e: Each variant as separate component; HeroCentered = baseline (fast LCP)
- Use next/image for images; lazy video

### 7️⃣ Performance & SEO
- LCP: HeroCentered/image above fold; priority on hero image; no heavy JS above fold
- Lazy load carousel/video; respect prefers-reduced-motion (no autoplay if reduced)

### 8️⃣ Accessibility
- Semantic h1 for title; alt on images; video captions/aria-label

### 9️⃣ Analytics
- Optional: `onCtaClick` callback; CTA click event naming per C.12 when available

### 🔟 Testing
- `packages/marketing-components/src/hero/__tests__/HeroVariants.test.tsx` — render each variant, snapshot

### 1️⃣1️⃣ Example
```tsx
<HeroCentered title="Welcome" subtitle="..." primaryCta={{ label: 'Book', href: '/book' }} image={{ src: '/hero.jpg', alt: '...' }} />
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
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  price?: string;
  href?: string;
}
interface ServiceShowcaseProps {
  services: ServiceItem[];
  layout: 'grid' | 'list' | 'tabs' | 'accordion';
  title?: string;
}
export { ServiceGrid, ServiceList, ServiceTabs, ServiceAccordion };
export type { ServiceItem, ServiceShowcaseProps };
```

### 5️⃣ Data Contracts
- ServiceItem normalized; no Zod in package (config/site validates)

### 6️⃣ Internal
- 2.2a: types first
- 2.2b–e: Each layout component; ServiceTabs uses Tabs; ServiceAccordion uses Accordion

### 7️⃣ Performance
- LCP: prioritize visible services; lazy below-fold images

### 8️⃣ Accessibility
- Semantic structure; Tabs/Accordion use Radix/Accordion a11y

### 9️⃣ Analytics
- Optional CTA click hooks

### 1️⃣3️⃣ Checklist
- Types → Grid → List → Tabs → Accordion → export

### 1️⃣5️⃣ Anti-Overengineering
- No filtering logic (belongs in page template); no CMS wiring

---

## 2.3–2.10 (Condensed)

**2.3 TeamDisplay:** TeamGrid, TeamCarousel, TeamDetailed. Profile: `{ name, role, image, bio?, socialLinks? }`. Same pattern: types → variants → export.

**2.4 Testimonials:** TestimonialCarousel, TestimonialGrid, TestimonialMarquee. Item: `{ quote, author, role?, image?, rating? }`. Motion respects prefers-reduced-motion.

**2.5 Pricing:** PricingTable, PricingCards, PricingCalculator. Tiers: `{ name, price, interval?, features[], cta }`. Uses 1.3 Tabs. No currency logic in component; pass formatted strings.

**2.6 Gallery:** ImageGrid, ImageCarousel, LightboxGallery. Uses 1.1 Dialog for lightbox. Items: `{ src, alt, caption? }`. Progressive loading; lightbox keyboard (Escape, arrows).

**2.7 Stats Counter:** Animated number on scroll; IntersectionObserver; SSR-safe (no window); reduced-motion → static number.

**2.8 CTA Section:** CTABanner, CTASplit. Props: title, description, primaryCta, secondaryCta?, image?. Analytics hooks for CTA clicks.

**2.9 FAQ:** Accordion-style; Schema.org FAQPage JSON-LD output. Items: `{ question, answer }`. Optional search/filter (simple string match).

**2.10 Contact Form Variants:** SimpleContactForm, MultiStepContactForm, BookingContactForm. Normalized submission contract: `onSubmit(data)`. Configurable consent field; no server logic in component.

---

### Shared 2.x Checklist
1. Create types in `types.ts`
2. Implement variants
3. Barrel in domain folder
4. Re-export from package index
5. Type-check; build; no circular deps
