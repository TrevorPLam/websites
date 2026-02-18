# 2.13 Build Blog Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.41 (Pagination)

**Related Research:** §2.1, §4.2, §2.2, SEO best practices

**Objective:** 15+ Blog variants with pagination, filtering, and related posts. L2.

**Requirements:**

- **Variants:** Grid, List, Featured + Grid, Card Grid, Masonry, With Sidebar, Minimal, Magazine, Timeline, Category Tabs, Tagged, Searchable, With Author, With Date, Infinite Scroll (15+ total)
- **Pagination:** Page-based, infinite scroll, load more
- **Filtering:** By category, tag, author, date
- **Related Posts:** Algorithm-based, manual selection

**Files:** `packages/marketing-components/src/blog/types.ts`, `BlogGrid.tsx`, `BlogList.tsx`, `BlogMasonry.tsx`, `BlogWithSidebar.tsx`, `BlogPostCard.tsx`, `blog/pagination.tsx`, `blog/filters.tsx`, `blog/related.tsx`, `index.ts`

**API:** `BlogDisplay`, `BlogPostCard`. Props: `variant`, `posts` (array), `pagination`, `filterByCategory`, `showRelated`, `showAuthor`.

**Checklist:** Types; variants; pagination; filtering; related posts; export.
**Done:** All 15+ variants render; pagination works; filtering functional; related posts display.
**Anti:** No CMS integration; data from props only.

---
