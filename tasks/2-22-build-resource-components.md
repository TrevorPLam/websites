# 2.22 Build Resource Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.39 (File Upload)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Resource variants with download tracking. L2.

**Requirements:**

- **Variants:** Grid, List, With Downloads, Category Tabs, Searchable, With Previews, Minimal, Featured (8+ total)
- **Download Tracking:** Download counts, analytics, file types

**Files:** `packages/marketing-components/src/resource/types.ts`, `ResourceGrid.tsx`, `ResourceList.tsx`, `ResourceCard.tsx`, `resource/downloads.tsx`, `index.ts`

**API:** `ResourceDisplay`, `ResourceCard`. Props: `variant`, `resources` (array), `showDownloads`, `trackDownloads`, `filterByType`.

**Checklist:** Types; variants; download tracking; export.
**Done:** All 8+ variants render; downloads work; tracking functional.
**Anti:** No custom analytics; basic tracking only.

---
