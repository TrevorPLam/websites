# 2.18 Build Portfolio Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.46 (Masonry), 2.6 (Gallery)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 12+ Portfolio variants with filtering and lightbox. L2.

**Requirements:**

- **Variants:** Grid, Masonry, Carousel, Filterable Grid, Tagged Grid, Category Tabs, With Details, Minimal, Bold, With Case Studies, With Testimonials, With Stats (12+ total)
- **Filtering:** By category, tag, project type, client
- **Lightbox:** Image lightbox, project details modal

**Files:** `packages/marketing-components/src/portfolio/types.ts`, `PortfolioGrid.tsx`, `PortfolioMasonry.tsx`, `PortfolioFilterable.tsx`, `PortfolioCard.tsx`, `portfolio/filters.tsx`, `portfolio/lightbox.tsx`, `index.ts`

**API:** `PortfolioDisplay`, `PortfolioCard`. Props: `variant`, `items` (array), `filterByCategory`, `showLightbox`, `showDetails`.

**Checklist:** Types; variants; filtering; lightbox; export.
**Done:** All 12+ variants render; filtering works; lightbox functional.
**Anti:** No custom project templates; standard cards only.

---
