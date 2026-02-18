# 2.20 Build Job Listing Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.2 (Button), 1.23 (Form)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Job Listing variants with search and application. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, With Filters, Searchable, Category Tabs, With Application Form, Minimal, Detailed, With Company Info (10+ total)
- **Search:** Full-text search, filter by location, department, type
- **Application:** Application form, file upload, integration

**Files:** `packages/marketing-components/src/job-listing/types.ts`, `JobListingGrid.tsx`, `JobListingList.tsx`, `JobListingCard.tsx`, `JobApplication.tsx`, `job-listing/search.tsx`, `job-listing/filters.tsx`, `index.ts`

**API:** `JobListingDisplay`, `JobListingCard`, `JobApplication`. Props: `variant`, `jobs` (array), `searchable`, `filterByLocation`, `showApplication`.

**Checklist:** Types; variants; search; filters; application form; export.
**Done:** All 10+ variants render; search works; filters functional; application form works.
**Anti:** No ATS integration; basic form only.

---
