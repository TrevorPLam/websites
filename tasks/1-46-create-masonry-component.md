# 1.46 Create Masonry Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), masonry layouts, CSS Grid

**Objective:** Masonry layout for variable-height items. Layer L2.

**Files:** Create `packages/ui/src/components/Masonry.tsx`; update `index.ts`.

**API:** `Masonry`, `MasonryItem`. Props: `columns` (number | responsive object), `gap`, `items` (array), `renderItem` (function).

**Checklist:** Create Masonry component; add column layout; add responsive columns; export; type-check; build.
**Done:** Builds; masonry renders; columns work; responsive layout functional.
**Anti:** No virtual scrolling; all items rendered.

---
