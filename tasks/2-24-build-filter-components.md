# 2.24 Build Filter Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.11 (Switch), 1.21 (Checkbox)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Filter variants with presets and history. L2.

**Requirements:**

- **Variants:** Sidebar, Top Bar, Accordion, Dropdown, With Presets, With History, Minimal, Advanced (8+ total)
- **Presets:** Saved filter presets, quick filters
- **History:** Recent filters, filter suggestions

**Files:** `packages/marketing-components/src/filter/types.ts`, `FilterSidebar.tsx`, `FilterTopBar.tsx`, `FilterAccordion.tsx`, `filter/presets.tsx`, `filter/history.tsx`, `index.ts`

**API:** `FilterDisplay`. Props: `variant`, `filters` (array), `showPresets`, `showHistory`, `onFilterChange`.

**Checklist:** Types; variants; presets; history; export.
**Done:** All 8+ variants render; presets work; history functional.
**Anti:** No persistence; session-only.

---
