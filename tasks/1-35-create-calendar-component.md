# 1.35 Create Calendar Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), date-fns or dayjs

**Objective:** Calendar view with date selection. Layer L2.

**Files:** Create `packages/ui/src/components/Calendar.tsx`; update `index.ts`.

**API:** `Calendar`. Props: `mode` (single, multiple, range), `selected`, `onSelect`, `disabled` (date | function), `locale`, `firstDayOfWeek`.

**Checklist:** Import Calendar from radix-ui or build custom; add date selection; add locale support; export; type-check; build.
**Done:** Builds; calendar renders; date selection works; locale support functional.
**Anti:** No custom date formatting; use date-fns or dayjs.

---
