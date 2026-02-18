# 1.37 Create Time Picker Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.30

**Related Research:** §3.1 (React 19), time picker patterns

**Objective:** Time picker with hour/minute/second selection. Layer L2.

**Files:** Create `packages/ui/src/components/TimePicker.tsx`; update `index.ts`.

**API:** `TimePicker`. Props: `value`, `onChange`, `format` (12h, 24h), `showSeconds` (boolean), `disabled`.

**Checklist:** Create TimePicker component; add hour/minute/second selection; add 12h/24h format; export; type-check; build.
**Done:** Builds; time selection works; formats switch; keyboard accessible.
**Anti:** No timezone support; local time only.

---
