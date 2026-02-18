# 1.8 Create Avatar Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** User avatar with image, fallback, and status indicator. Layer L2.

**Files:** Create `packages/ui/src/components/Avatar.tsx`; update `index.ts`.

**API:** `Avatar`, `AvatarImage`, `AvatarFallback`. Props: `size` (sm, md, lg, xl), `status` (online, offline, away, busy), `shape` (circle, square).

**Checklist:** Import Avatar from radix-ui; add status indicator; export; type-check; build.
**Done:** Builds; image/fallback work; status indicators display.
**Anti:** No custom status colors; stop at Radix.

---
