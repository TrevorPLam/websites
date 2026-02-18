# 2.7 Build Stats Counter Component (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6 Stats Counter variants with animation customization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), List, Carousel, With Icons (6 total)
- **Animation:** Count-up animation, duration control, easing functions
- **Composition:** Stat cards with number, label, icon, description, trend indicator

**Files:** `packages/marketing-components/src/stats/types.ts`, `StatsGrid.tsx`, `StatsList.tsx`, `StatsCarousel.tsx`, `StatsCard.tsx`, `stats/animations.tsx`, `index.ts`

**API:** `StatsCounter`, `StatCard`. Props: `variant`, `stats` (array), `animate`, `duration`, `showIcons`, `showTrend`.

**Checklist:** Types; variants; animations; export.
**Done:** All 6 variants render; count-up animations work; responsive breakpoints work.
**Anti:** No custom easing functions; CSS animations only.

---
