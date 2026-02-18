# 1.44 Create Tree View Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Hierarchical tree view with expand/collapse. Layer L2.

**Files:** Create `packages/ui/src/components/TreeView.tsx`; update `index.ts`.

**API:** `Tree`, `TreeItem`, `TreeItemIndicator`, `TreeItemTrigger`, `TreeItemContent`. Props: `data` (array), `defaultExpanded` (array), `onSelect`, `selectable` (boolean), `multiSelect` (boolean).

**Checklist:** Import Tree from radix-ui or build custom; add expand/collapse; add selection; export; type-check; build.
**Done:** Builds; tree renders; expand/collapse works; selection functional; keyboard accessible.
**Anti:** No virtual scrolling; basic tree only.

---
