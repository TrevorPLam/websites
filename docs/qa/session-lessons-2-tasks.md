# Session Lessons: 2- Tasks Implementation

**Date:** 2026-02-18  
**Purpose:** Extract lessons from session work for future 2- task implementation.

---

## Architecture Lessons

### 1. Avoid Circular Dependencies

**Problem:** marketing-components imported ContactForm from features; features imported display components from marketing-components → cycle.

**Solution:** Keep dependency direction strict: `marketing-components` → `@repo/ui` only. Feature orchestration (wrappers that compose display + logic) lives in `@repo/features`. If a component wraps a feature (e.g. ContactFormStandard wrapping ContactForm), it belongs in features, not marketing-components.

**Rule:** marketing-components must NOT depend on @repo/features. Only features → marketing-components.

### 2. Button asChild Not Supported

**Problem:** @repo/ui Button does not support `asChild` prop. Using `<Button asChild><a href="...">` caused runtime/type issues.

**Solution:** Use styled anchors or `HeroCTAButton` for link-style CTAs. Pattern used in PricingCards, CTASection, ServiceGrid.

### 3. Type Consolidation

**Pattern:** Put shared types in `{family}/types.ts`. Components import from `./types` not from sibling components. Applied to: hero, services, team, testimonials, pricing, blog, product, event, navigation, footer.

### 4. Contact Form Variants

**Clarification:** Task 2-10 "Contact Form Variants" — the full ContactForm with validation lives in @repo/features/contact. Marketing-components had ContactFormStandard as a layout wrapper. That wrapper correctly belongs in features (ContactFormStandard in features/contact) since it wraps the feature's ContactForm.

---

## TypeScript Lessons

### 1. Transitive Type Declarations

**Problem:** When package A (features/marketing-components) imports from package B (ui), tsc compiles B's source. If B uses a module without types (e.g. react-window), A's type-check fails.

**Solution:** Add B's declaration shims to A's tsconfig `include`:

```json
"include": ["src/**/*", "../ui/src/shims/**/*.d.ts"]
```

### 2. Upstream Fixes Applied

- **Form.tsx:** `defaultValues as DefaultValues<T>`, `schema as unknown as ...` for zodResolver (Zod version mismatch).
- **ToggleGroup.tsx:** `rootProps as any` for Radix discriminated union (single vs multiple props).
- **VirtualList.tsx:** `packages/ui/src/shims/react-window.d.ts` + include from dependents.

### 3. package.json search_replace

**Gotcha:** Minified package.json can cause search_replace to fail. Use `read_file` to get exact content; prefer `write` for full file replacement when structure is simple.

---

## Implementation Patterns

### Feature Module Structure (Config-Based)

```
packages/features/src/{feature}/
├── index.ts
├── lib/
│   ├── {feature}-config.ts    # Config types, createConfig()
│   └── adapters/
│       └── config.ts         # getXFromConfig()
└── components/
    └── {Feature}Section.tsx  # Uses marketing-components display
```

### Section Component Pattern

- Accept `items`/`members`/`plans` etc. as props (or from config).
- Map to layout: `layout?: 'grid' | 'carousel' | ...`.
- Delegate to marketing-components: TeamGrid, TestimonialCarousel, etc.
- Empty data → return null.

### Unused Imports

Run type-check after adding components; remove unused `cn` and other imports to satisfy `noUnusedLocals`.

---

## Remaining Phase 4 Priorities

| Task | Status | Notes                                      |
| ---- | ------ | ------------------------------------------ |
| 2-16 | Done   | TestimonialsSection                        |
| 2-17 | Done   | TeamSection                                |
| 2-18 | Done   | GallerySection                             |
| 2-19 | Done   | PricingSection                             |
| 2-20 | Exists | Search has SearchPage, SearchDialog        |
| 2-21 | Done   | NewsletterSection                          |
| 2-22 | Done   | SocialMediaSection                         |
| 2-23 | TODO   | Analytics (config, track helpers)          |
| 2-24 | TODO   | A/B testing (stub)                         |
| 2-25 | Exists | Personalization has rules-engine, segments |
| 2-26 | TODO   | Chat (config, widget hook)                 |
| 2-27 | Done   | ReviewsSection                             |
| 2-28 | Exists | Booking - enhance existing                 |

---

## Verification Checklist

Before considering a phase complete:

- [ ] Types in types.ts; no circular imports
- [ ] Use HeroCTAButton or styled anchor for links (not Button asChild)
- [ ] Export from family index.ts and main package index
- [ ] Match patterns: Container, Section, Card, cn()
- [ ] Dependent packages type-check (add shim includes if needed)
