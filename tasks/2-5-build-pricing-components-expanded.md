# 2.5 Build Pricing Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.2 (Button), 1.24 (Alert)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 15+ Pricing variants with advanced customization and comparison. L2.

**Enhanced Requirements:**

- **Variants:** Three Column, Four Column, Two Column, Single Featured, Comparison Table, Tabs, Accordion, Toggle (Monthly/Yearly), With Features, Minimal, Bold, Card Grid, Side-by-Side, With Calculator, Customizable (15+ total)
- **Customization:** Feature lists, CTA buttons, badges (Popular, Best Value), tooltips, icons
- **Comparison:** Side-by-side comparison, feature comparison table, highlight differences
- **Interactive:** Toggle between pricing periods, expandable features, hover effects

**Files:** `packages/marketing-components/src/pricing/types.ts`, `PricingThreeColumn.tsx`, `PricingFourColumn.tsx`, `PricingComparison.tsx`, `PricingTabs.tsx`, `PricingToggle.tsx`, `PricingWithFeatures.tsx`, `PricingCard.tsx`, `pricing/comparison.tsx`, `pricing/customization.tsx`, `index.ts`

**API:** `PricingDisplay`, `PricingCard`, `PricingComparison`. Props: `variant`, `plans` (array), `showComparison`, `togglePeriod`, `currency`, `highlightedPlan`.

**Checklist:** Types; variants; comparison system; customization; export.
**Done:** All 15+ variants render; comparison works; customization functional; toggle period works.
**Anti:** No payment integration; display only.

---
