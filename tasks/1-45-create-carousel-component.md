# 1.45 Create Carousel Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 10h | **Deps:** None

**Related Research:** §3.1 (React 19), carousel patterns, embla-carousel

**Objective:** Carousel with navigation, autoplay, and indicators. Layer L2.

**Files:** Create `packages/ui/src/components/Carousel.tsx`; update `index.ts`.

**API:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselIndicator`. Props: `autoplay` (boolean), `interval` (number), `loop` (boolean), `orientation` (horizontal, vertical), `showIndicators` (boolean).

**Checklist:** Create Carousel component (use embla-carousel); add navigation; add autoplay; add indicators; export; type-check; build.
**Done:** Builds; carousel renders; navigation works; autoplay functional; indicators display; keyboard accessible.
**Anti:** No infinite scroll; finite carousel only.

---
