# 1.50 Create Resizable Panel Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.28

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Resizable panel system with multiple panels. Layer L2.

**Files:** Create `packages/ui/src/components/ResizablePanel.tsx`; update `index.ts`.

**API:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`. Props: `direction` (horizontal, vertical), `defaultSizes`, `minSize`, `maxSize`, `collapsible` (boolean), `onResize`.

**Checklist:** Enhance Resizable component; add panel group; add resize callbacks; export; type-check; build.
**Done:** Builds; resizable panels work; group functional; resize callbacks fire; keyboard accessible.
**Anti:** No custom handle styling; stop at Radix.

---

### Marketing Components (1.7, 2.1–2.10)
