# 2.19 Create Pricing Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.5

**Related Research:** §2.1, §3.1 (RSC), §6 (Industry), §3.4 (CMS)

**Objective:** PricingSection with 5+ implementation patterns, calculator integration, and comparison. Uses 2.5 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Calculator-Based, Hybrid (5+ total)
- **Calculator Integration:** Price calculator, feature calculator, usage-based calculator
- **Comparison:** Feature comparison, price comparison, plan recommendations
- **Features:** Schema validation, currency formatting, localization, plan recommendations

**Files:** `packages/features/src/pricing/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/api.ts, lib/adapters/cms.ts, lib/pricing-config.ts, lib/calculator.ts, lib/comparison.ts, lib/formatting.ts, components/PricingSection.tsx, components/PricingConfig.tsx, components/PricingAPI.tsx, components/PricingCMS.tsx, components/PricingCalculator.tsx, components/PricingHybrid.tsx)

**API:** `PricingSection`, `pricingSchema`, `createPricingConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `calculatePrice`, `comparePlans`, `formatCurrency`, `recommendPlan`, `PricingConfig`, `PricingAPI`, `PricingCMS`, `PricingCalculator`, `PricingHybrid`

**Checklist:** Schema → adapters → implementation patterns → calculator → comparison → Section components → export.
**Done:** Builds; all patterns work; calculator functional; comparison works; currency formatting works.
**Anti:** No payment processing; display and calculation only.

---

### Feature Breadth (New Features 2.20–2.50)
