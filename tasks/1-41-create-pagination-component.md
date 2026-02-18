# 1.41 Create Pagination Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 5h | **Deps:** None

**Related Research:** §3.1 (React 19), pagination patterns

**Objective:** Pagination controls with page navigation. Layer L2.

**Files:** Create `packages/ui/src/components/Pagination.tsx`; update `index.ts`.

**API:** `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`. Props: `currentPage`, `totalPages`, `onPageChange`, `showFirstLast` (boolean), `showPageNumbers` (boolean).

**Checklist:** Create Pagination component; add page navigation; add ellipsis for many pages; export; type-check; build.
**Done:** Builds; pagination renders; page navigation works; ellipsis displays; keyboard accessible.
**Anti:** No custom page size selector; page navigation only.

---
