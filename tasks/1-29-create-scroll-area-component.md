# 1.29 Create Scroll Area Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Custom scrollable area with styled scrollbars. Layer L2.

**Files:** Create `packages/ui/src/components/ScrollArea.tsx`; update `index.ts`.

**API:** `ScrollArea`, `ScrollBar`. Props: `orientation` (horizontal, vertical, both), `type` (auto, always, scroll, hover), `className`.

**Checklist:** Import ScrollArea from radix-ui; add scrollbar styling; export; type-check; build.
**Done:** Builds; scrolling works; custom scrollbars render; cross-browser compatible.
**Anti:** No custom scrollbar animations; stop at Radix.

---
