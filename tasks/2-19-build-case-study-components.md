# 2.19 Build Case Study Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 2.18 (Portfolio)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Case Study variants with metrics and downloads. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, Detail Page, With Metrics, With Testimonials, With Timeline, With Downloads, Minimal, With Images (10+ total)
- **Metrics:** Key metrics display, charts, statistics
- **Downloads:** PDF downloads, resource links

**Files:** `packages/marketing-components/src/case-study/types.ts`, `CaseStudyGrid.tsx`, `CaseStudyDetail.tsx`, `CaseStudyCard.tsx`, `case-study/metrics.tsx`, `case-study/downloads.tsx`, `index.ts`

**API:** `CaseStudyDisplay`, `CaseStudyCard`, `CaseStudyDetail`. Props: `variant`, `caseStudies` (array), `showMetrics`, `showDownloads`, `showTimeline`.

**Checklist:** Types; variants; metrics display; downloads; export.
**Done:** All 10+ variants render; metrics display; downloads work.
**Anti:** No custom chart library; basic metrics only.

---
