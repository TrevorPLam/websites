# 1.28 Create Resizable Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Resizable panels with drag handles. Layer L2.

**Files:** Create `packages/ui/src/components/Resizable.tsx`; update `index.ts`.

**API:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`. Props: `direction` (horizontal, vertical), `defaultSizes`, `minSize`, `maxSize`, `collapsible` (boolean).

**Checklist:** Import Resizable from radix-ui; add panel group support; export; type-check; build.
**Done:** Builds; resizing works; handles functional; keyboard accessible.
**Anti:** No custom handle styling; stop at Radix.

---
