# 1.49 Create Drag and Drop Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 12h | **Deps:** None

**Related Research:** §3.1 (React 19), @dnd-kit or react-beautiful-dnd

**Objective:** Drag and drop with sortable lists and reordering. Layer L2.

**Files:** Create `packages/ui/src/components/DragAndDrop.tsx`; update `index.ts`.

**API:** `DragAndDrop`, `Draggable`, `Droppable`, `DragHandle`. Props: `items` (array), `onReorder`, `disabled` (boolean), `axis` (x, y, both).

**Checklist:** Create DragAndDrop component (use @dnd-kit); add drag handles; add drop zones; add reordering; export; type-check; build.
**Done:** Builds; drag and drop works; reordering functional; keyboard accessible; touch support.
**Anti:** No custom drag preview; default preview only.

---
