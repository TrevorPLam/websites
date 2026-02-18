# 1.40 Create Rating Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 4h | **Deps:** None

**Related Research:** §3.1 (React 19), rating patterns

**Objective:** Star rating with read-only and interactive modes. Layer L2.

**Files:** Create `packages/ui/src/components/Rating.tsx`; update `index.ts`.

**API:** `Rating`. Props: `value`, `onChange`, `max` (number, default 5), `readOnly` (boolean), `size` (sm, md, lg), `allowHalf` (boolean), `showValue` (boolean).

**Checklist:** Create Rating component; add interactive mode; add half-star support; add read-only mode; export; type-check; build.
**Done:** Builds; rating displays; interactive selection works; half-stars functional; keyboard accessible.
**Anti:** No custom icons; stars only.

---
