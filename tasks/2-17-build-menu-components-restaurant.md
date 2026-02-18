# 2.17 Build Menu Components (Restaurant)

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.3 (Tabs)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Menu variants with dietary information. L2.

**Requirements:**

- **Variants:** Grid, List, Tabs, Accordion, With Images, With Prices, With Descriptions, Category Tabs, Filterable, With Dietary Info (10+ total)
- **Dietary Information:** Vegetarian, vegan, gluten-free, allergen labels
- **Filtering:** By category, dietary restrictions, price range

**Files:** `packages/marketing-components/src/menu/types.ts`, `MenuGrid.tsx`, `MenuTabs.tsx`, `MenuAccordion.tsx`, `MenuItemCard.tsx`, `menu/dietary.tsx`, `menu/filters.tsx`, `index.ts`

**API:** `MenuDisplay`, `MenuItemCard`. Props: `variant`, `items` (array), `showDietaryInfo`, `filterByCategory`, `filterByDietary`.

**Checklist:** Types; variants; dietary info; filtering; export.
**Done:** All 10+ variants render; dietary info displays; filtering works.
**Anti:** No custom dietary labels; standard options only.

---
