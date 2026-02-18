# 1.32 Create Table Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), Table patterns

**Objective:** Data table with sorting, filtering, and pagination. Layer L2.

**Files:** Create `packages/ui/src/components/Table.tsx`; update `index.ts`.

**API:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. Props: `sortable` (boolean), `filterable` (boolean), `pagination` (boolean).

**Checklist:** Create Table component; add sorting functionality; add filtering; add pagination; export; type-check; build.
**Done:** Builds; table renders; sorting works; filtering works; pagination functional; accessible.
**Anti:** No virtual scrolling; basic table only.

---
