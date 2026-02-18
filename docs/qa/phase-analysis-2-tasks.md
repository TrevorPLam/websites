# Phase Analysis: 2- Tasks Implementation

**Created:** 2026-02-18  
**Purpose:** Identify potential issues before implementing each phase of 2- tasks.

---

## Phase 1: Foundation Components (2-3 through 2-10)

### Current State

| Task | Component Family | Exists | Status | Key Dependencies |
|------|------------------|--------|--------|------------------|
| 2-3 | TeamDisplay | Yes | Scaffolded | TeamGrid, TeamCarousel, TeamDetailed; 1.8 Avatar |
| 2-4 | Testimonials | Yes | Scaffolded | TestimonialCarousel, TestimonialGrid, TestimonialMarquee; 1.45 Carousel, 1.40 Rating |
| 2-5 | Pricing | Yes | Scaffolded | PricingTable, PricingCards, PricingCalculator |
| 2-6 | Gallery | No | Empty export | — |
| 2-7 | Stats | No | Empty export | — |
| 2-8 | CTA | No | Empty export | — |
| 2-9 | FAQ | No | Empty export | Accordion from @repo/ui |
| 2-10 | Contact | No | Empty export | 1.23 Form, 1.2 Button; features/contact has ContactForm |

### Potential Issues

1. **Type consolidation:** TeamGrid exports `TeamMember`; TeamCarousel imports from `./TeamGrid`. Task 2-3 requires `team/types.ts` — consolidate types there (like services).

2. **Testimonial type mismatch:** TestimonialCarousel uses `quote`, `author.name`; HeroWithTestimonials uses `content`, `author`. Align types or create adapter.

3. **PricingPlan location:** PricingTable defines `PricingPlan`; PricingCards imports from PricingTable. Move to `pricing/types.ts`.

4. **Contact overlap:** `@repo/features/contact` has full ContactForm. Task 2-10 is marketing-components contact *variants* (Standard, Minimal, With Map, etc.) — these wrap or compose the features ContactForm.

5. **Empty exports:** gallery, stats, cta, faq, contact have `export {}` — main index.ts does `export * from './gallery'` etc. Valid but yields no exports until we add components.

6. **Avatar/photo naming:** TeamMember uses `photo`; HeroTestimonial uses `avatar`. Task 2-3 says "avatar" — standardize or support both.

---

## Phase 2: Navigation & Layout (2-11, 2-12)

### Current State

- **2-11 Navigation:** No `navigation/` directory in marketing-components. Task requires creating it.
- **2-12 Footer:** No footer directory. Likely create `footer/`.

### Potential Issues

1. **NavigationMenu API:** @repo/ui NavigationMenu uses Radix `NavigationMenu.Root`, `NavigationMenu.List`, `NavigationMenuItem`, etc. Marketing navigation components must compose these — not replace them.

2. **radix-ui package:** UI uses `import { X } from 'radix-ui'` — radix-ui is a meta-package. Verify export paths (NavigationMenu, Dialog, etc.) work.

3. **Mobile Drawer:** Task 2-11 requires "Mobile Drawer" — use Sheet from @repo/ui for slide-out mobile nav.

4. **Footer Nav:** May reuse NavigationMenu with different styling or simpler structure.

---

## Phase 3: Content Components (2-13, 2-14, 2-15)

### Current State

- Blog, Product, Event — no directories. Need to create.
- @repo/features has blog (MDX, content source), booking, services.

### Potential Issues

1. **Blog vs features/blog:** features/blog provides content retrieval; marketing-components blog is *display* components (BlogCard, BlogGrid, BlogPostLayout, etc.).

2. **Product:** E-commerce product display. No existing product primitives. May need Card, Badge, Button patterns.

3. **Event:** Event cards, calendar teasers. Date display — use date-fns (in features).

---

## Phase 4: Core Features (2-16 through 2-28)

### Current State

- features/team: empty
- features/testimonials: empty
- features/gallery: exists (index only)
- features/pricing: exists (index only)
- features/booking: full implementation
- features/contact: full implementation
- features/blog: full implementation
- features/search: full implementation

### Potential Issues

1. **Task 2-17 Team Feature:** Depends on 2-11 (Navigation) and 2-3 (TeamDisplay). Uses "2.3 display components" — TeamGrid, TeamCarousel etc. from marketing-components.

2. **Adapter pattern:** Team feature requires config, API, CMS, hybrid adapters. Copy structure from contact/booking (lib/schema, lib/actions, lib/adapters).

3. **Testimonials feature (2-16):** Uses 2-4 components. Similar adapter pattern.

4. **Booking expanded (2-28):** Enhance existing booking feature — don't duplicate. Add variants, config options.

5. **Newsletter (2-21), Chat (2-26), etc.:** New feature modules. Most have integration dependencies (4.1-4.6). Start with config-based adapters; API/CMS stubs.

---

## Phase 5: Advanced Features (2-29 through 2-47)

### Potential Issues

1. **Heavy external deps:** E-commerce (Shopify), Payment (Stripe), Auth (NextAuth) — stub interfaces first.
2. **4.xx integrations:** Tasks 2-45, 2-48 depend on 4.5 Maps. Verify integration packages exist.
3. **C.14, C.xx references:** Infrastructure tasks may not exist. Treat as "future" — implement minimal viable.

---

## Phase 6: Industry & Advanced Components (2-48 through 2-62)

### Potential Issues

1. **2-48 Location:** Depends on 4.5 Maps. Check @repo/integrations-google-maps.
2. **2-49 Menu (Restaurant):** Depends on 1.3 Tabs. Tabs exist.
3. **Masonry:** @repo/ui has Masonry. Use for TeamMasonry, Gallery variants.

---

## Cross-Cutting Issues

### 1. Button asChild pattern
- **Fixed:** Created HeroCTAButton; avoid `Button asChild` (not supported).
- **Apply to:** All new components using links styled as buttons.

### 2. Type consolidation
- **Pattern:** `{component-family}/types.ts` for shared types; components import from types.
- **Apply to:** team, testimonials, pricing (like services, hero).

### 3. @repo/ui type errors
- Form, ToggleGroup, VirtualList have TS errors. marketing-components type-check fails when resolving @repo/ui.
- **Workaround:** Exclude __tests__ from marketing-components tsconfig (done). Full fix requires fixing @repo/ui.

### 4. Empty index exports
- gallery, stats, cta, faq, contact: `export {}` — valid. Add components and export as we implement.

---

## Recommended Implementation Order

1. **Phase 1 (2-3 → 2-10):** Team, Testimonials, Pricing (enhance scaffolds), Gallery, Stats, CTA, FAQ, Contact (from scratch for empty ones).
2. **Phase 2 (2-11, 2-12):** Create navigation/, footer/.
3. **Phase 3 (2-13 → 2-15):** Blog, Product, Event components.
4. **Phase 4 (2-16 → 2-28):** Features — start with Team (2-17), Testimonials (2-16); expand booking (2-28).
5. **Phase 5 & 6:** After core phases; stub-heavy for integrations.

---

## Verification Checklist Per Phase

- [ ] Types in types.ts; no circular imports
- [ ] Use HeroCTAButton or anchor for links (not Button asChild)
- [ ] Export from family index.ts and main marketing-components index
- [ ] Match existing patterns (Container, Section, Card, cn())
- [ ] Add __tests__ for key components (excluded from tsconfig type-check)
