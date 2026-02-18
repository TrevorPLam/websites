# 2.23 Build Comparison Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.32 (Table)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6+ Comparison variants for features and pricing. L2.

**Requirements:**

- **Variants:** Table, Side-by-Side, Feature Comparison, Price Comparison, With Highlights, Minimal (6+ total)
- **Features:** Highlight differences, feature checkmarks, tooltips

**Files:** `packages/marketing-components/src/comparison/types.ts`, `ComparisonTable.tsx`, `ComparisonSideBySide.tsx`, `ComparisonFeature.tsx`, `comparison/highlights.tsx`, `index.ts`

**API:** `ComparisonDisplay`. Props: `variant`, `items` (array), `highlightDifferences`, `showTooltips`.

**Checklist:** Types; variants; highlight system; export.
**Done:** All 6+ variants render; highlights work; tooltips display.
**Anti:** No custom comparison logic; manual configuration only.

---
