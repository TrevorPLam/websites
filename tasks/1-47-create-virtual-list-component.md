# 1.47 Create Virtual List Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 10h | **Deps:** None

**Related Research:** §3.1 (React 19), react-window or react-virtual

**Objective:** Virtualized list for large datasets. Layer L2.

**Files:** Create `packages/ui/src/components/VirtualList.tsx`; update `index.ts`.

**API:** `VirtualList`. Props: `items` (array), `itemHeight` (number | function), `overscan` (number), `orientation` (horizontal, vertical), `renderItem` (function).

**Checklist:** Create VirtualList component (use react-window or react-virtual); add virtualization; add dynamic heights; export; type-check; build.
**Done:** Builds; virtual list renders; scrolling smooth; large datasets performant.
**Anti:** No custom virtualization algorithm; use existing library.

---
