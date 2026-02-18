# 1.31 Create Sheet Component (Sidebar)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 5h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Slide-out panel (sidebar) with multiple positions. Layer L2.

**Files:** Create `packages/ui/src/components/Sheet.tsx`; update `index.ts`.

**API:** `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`. Props: `side` (top, right, bottom, left), `size` (sm, md, lg, xl, full), `modal` (boolean).

**Checklist:** Import Sheet from radix-ui; add all side positions; add size variants; export; type-check; build.
**Done:** Builds; sheet opens from all sides; sizes work; focus trap functional.
**Anti:** No custom animations; stop at Radix.

---
