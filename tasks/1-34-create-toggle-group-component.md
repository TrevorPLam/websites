# 1.34 Create Toggle Group Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** 1.33

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Group of toggle buttons with single/multiple selection. Layer L2.

**Files:** Create `packages/ui/src/components/ToggleGroup.tsx`; update `index.ts`.

**API:** `ToggleGroup`, `ToggleGroupItem`. Props: `type` (single, multiple), `value`, `onValueChange`, `disabled`, `orientation` (horizontal, vertical).

**Checklist:** Import ToggleGroup from radix-ui; add single/multiple modes; export; type-check; build.
**Done:** Builds; toggle group works; single/multiple selection functional; keyboard accessible.
**Anti:** No custom styling variants; stop at Radix.

---
