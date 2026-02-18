# 2.8 Build CTA Section Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ CTA Section variants with A/B testing support. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, With Image, With Video, With Form, Minimal, Bold, With Stats, With Testimonials, Sidebar (10+ total)
- **A/B Testing:** Variant selection, conversion tracking, analytics integration
- **Composition:** CTA sections with headline, description, primary CTA, secondary CTA, image/video, form

**Files:** `packages/marketing-components/src/cta/types.ts`, `CTACentered.tsx`, `CTASplit.tsx`, `CTAWithImage.tsx`, `CTAWithVideo.tsx`, `CTAWithForm.tsx`, `cta/ab-testing.tsx`, `index.ts`

**API:** `CTASection`. Props: `variant`, `headline`, `description`, `primaryCta`, `secondaryCta`, `image`, `video`, `form`, `abTestVariant`.

**Checklist:** Types; variants; A/B testing integration; export.
**Done:** All 10+ variants render; A/B testing functional; conversion tracking works.
**Anti:** No analytics provider integration; basic tracking only.

---
