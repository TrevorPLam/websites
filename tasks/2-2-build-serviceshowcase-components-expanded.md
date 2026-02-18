# 2.2 Build ServiceShowcase Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.3, 1.24, 1.25

**Related Research:** §2.1, §4.2, §2.2. Uses Tabs, Accordion, Alert, AlertDialog from @repo/ui.

**Objective:** 20+ Service layout variants with filtering, sorting, and advanced composition. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Tabs, Accordion, Masonry, Card Grid, Featured + Grid, Carousel, Sidebar + Content, Comparison Table, Timeline, Stepper, Filterable Grid, Searchable List, Category Tabs, Tagged Grid, Featured Service, Service Showcase, Service Directory, Service Map (20+ total)
- **Filtering:** By category, tag, price range, rating, featured status
- **Sorting:** By name, price, rating, date added, popularity
- **Composition:** Service cards with image, title, description, price, CTA, tags, rating, badges
- **Responsive:** Mobile-first, breakpoint-specific layouts
- **Interactive:** Hover effects, expandable details, quick view modal

**Files:** `packages/marketing-components/src/services/types.ts`, `ServiceGrid.tsx`, `ServiceList.tsx`, `ServiceTabs.tsx`, `ServiceAccordion.tsx`, `ServiceMasonry.tsx`, `ServiceCarousel.tsx`, `ServiceComparison.tsx`, `ServiceTimeline.tsx`, `ServiceFilterable.tsx`, `ServiceSearchable.tsx`, `services/filters.tsx`, `services/sorting.tsx`, `services/composition.tsx`, `index.ts`

**API:** `ServiceShowcase`, `ServiceCard`, `ServiceFilter`, `ServiceSort`. Props: `layout`, `services` (array), `filters`, `sortBy`, `onServiceClick`, `showPrice`, `showRating`, `showTags`.

**Checklist:**

- 2.2a: Create types and composition system (4h)
- 2.2b: Build core layouts (Grid, List, Tabs, Accordion) (6h)
- 2.2c: Build advanced layouts (Masonry, Carousel, Comparison, Timeline) (6h)
- 2.2d: Add filtering and sorting functionality (4h)
- 2.2e: Add responsive breakpoints and interactions (4h)
- Types; Grid; List; Tabs (uses 1.3); Accordion; barrel.

**Done:** All 20+ layouts render; filtering works; sorting functional; RSC where static; responsive breakpoints work.
**Anti:** No CMS wiring; data from props only.

---
