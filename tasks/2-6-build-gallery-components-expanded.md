# 2.6 Build Gallery Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel), 1.46 (Masonry)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 20+ Gallery variants with advanced filtering and organization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), Masonry, Carousel, Slider, Lightbox, Filterable Grid, Tagged Grid, Category Tabs, Timeline, Before/After, Portfolio Grid, Featured + Grid, With Captions, Minimal, Bold, Sidebar + Grid, Searchable, Infinite Scroll, With Filters, Custom Layout (20+ total)
- **Filtering:** By category, tag, date, featured status
- **Organization:** Categories, tags, albums, collections
- **Interactive:** Lightbox, zoom, fullscreen, slideshow, share

**Files:** `packages/marketing-components/src/gallery/types.ts`, `GalleryGrid.tsx`, `GalleryMasonry.tsx`, `GalleryCarousel.tsx`, `GalleryLightbox.tsx`, `GalleryFilterable.tsx`, `GalleryTagged.tsx`, `gallery/filters.tsx`, `gallery/lightbox.tsx`, `index.ts`

**API:** `GalleryDisplay`, `GalleryItem`. Props: `variant`, `items` (array), `filterByCategory`, `filterByTag`, `showLightbox`, `showCaptions`, `columns`.

**Checklist:** Types; variants; filtering; lightbox; export.
**Done:** All 20+ variants render; filtering works; lightbox functional; responsive breakpoints work.
**Anti:** No image optimization; use next/image.

---
