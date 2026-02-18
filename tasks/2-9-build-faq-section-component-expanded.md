# 2.9 Build FAQ Section Component (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.27 (Accordion)

**Related Research:** §2.1, §4.2, §2.2, SEO best practices

**Objective:** 6 FAQ Section variants with search functionality. L2.

**Enhanced Requirements:**

- **Variants:** Accordion, List, Tabs, Searchable, With Categories, Minimal (6 total)
- **Search:** Full-text search, highlight matches, filter by category
- **Composition:** FAQ items with question, answer, category, tags

**Files:** `packages/marketing-components/src/faq/types.ts`, `FAQAccordion.tsx`, `FAQList.tsx`, `FAQTabs.tsx`, `FAQSearchable.tsx`, `FAQWithCategories.tsx`, `faq/search.tsx`, `index.ts`

**API:** `FAQSection`, `FAQItem`. Props: `variant`, `items` (array), `searchable`, `filterByCategory`, `showCategories`.

**Checklist:** Types; variants; search functionality; export.
**Done:** All 6 variants render; search works; filtering functional; SEO-friendly.
**Anti:** No fuzzy search; basic string matching only.

---
