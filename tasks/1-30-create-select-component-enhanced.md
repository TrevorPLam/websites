# 1.30 Create Select Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Enhanced select dropdown with search and multi-select. Layer L2.

**Files:** Create `packages/ui/src/components/Select.tsx`; update `index.ts`.

**API:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`. Props: `searchable` (boolean), `multiple` (boolean), `placeholder`.

**Checklist:** Import Select from radix-ui; add search functionality; add multi-select support; export; type-check; build.
**Done:** Builds; select works; search functional; multi-select works; keyboard accessible.
**Anti:** No virtual scrolling; basic search only.

---
