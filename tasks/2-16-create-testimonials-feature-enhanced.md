# 2.16 Create Testimonials Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.4

**Related Research:** §5.1 (Spec-driven), §3.4 (CMS), adapter patterns

**Objective:** TestimonialsSection with 5+ implementation patterns, multi-source integration, and filtering. Uses 2.4 display variants.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Calculator-Based (5+ total)
- **Multi-Source:** Google Reviews, Yelp, Trustpilot, Facebook, custom config, API adapters
- **Filtering:** By rating, source, date, featured, category
- **Features:** Schema validation, adapter pattern, normalization, caching

**Files:** `packages/features/src/testimonials/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/google.ts, lib/adapters/yelp.ts, lib/adapters/trustpilot.ts, lib/adapters/cms.ts, lib/testimonials-config.ts, lib/filters.ts, components/TestimonialsSection.tsx, components/TestimonialsConfig.tsx, components/TestimonialsAPI.tsx, components/TestimonialsCMS.tsx, components/TestimonialsHybrid.tsx)

**API:** `TestimonialsSection`, `testimonialsSchema`, `createTestimonialsConfig`, `normalizeGoogleReviews`, `normalizeYelp`, `normalizeTrustpilot`, `normalizeFromConfig`, `normalizeFromCMS`, `filterTestimonials`, `TestimonialsConfig`, `TestimonialsAPI`, `TestimonialsCMS`, `TestimonialsHybrid`

**Checklist:**

- 2.16a: Schema and base adapters (config, Google, Yelp) (6h)
- 2.16b: Additional adapters (Trustpilot, CMS) (4h)
- 2.16c: Implementation patterns (Config, API, CMS, Hybrid) (6h)
- 2.16d: Filtering and normalization (4h)
- Schema; adapters; TestimonialsSection; createTestimonialsConfig; export; tests.

**Done:** Builds; all adapters normalize; all patterns work; filtering functional; section renders.
**Anti:** No live API keys; mock data for external sources; TanStack Query optional.

---
