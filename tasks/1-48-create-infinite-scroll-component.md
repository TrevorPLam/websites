# 1.48 Create Infinite Scroll Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.47

**Related Research:** §3.1 (React 19), infinite scroll patterns

**Objective:** Infinite scroll with loading states. Layer L2.

**Files:** Create `packages/ui/src/components/InfiniteScroll.tsx`; update `index.ts`.

**API:** `InfiniteScroll`. Props: `hasMore` (boolean), `onLoadMore`, `loader` (ReactNode), `threshold` (number), `reverse` (boolean).

**Checklist:** Create InfiniteScroll component; add intersection observer; add loading state; export; type-check; build.
**Done:** Builds; infinite scroll works; loading triggers; loading state displays.
**Anti:** No custom loading logic; intersection observer only.

---
