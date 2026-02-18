# 2.6 Build Gallery Components (Expanded)

## Metadata

- **Task ID**: 2-6-build-gallery-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.45 (Carousel), 1.46 (Masonry)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Gallery variants with advanced filtering and organization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), Masonry, Carousel, Slider, Lightbox, Filterable Grid, Tagged Grid, Category Tabs, Timeline, Before/After, Portfolio Grid, Featured + Grid, With Captions, Minimal, Bold, Sidebar + Grid, Searchable, Infinite Scroll, With Filters, Custom Layout (20+ total)
- **Filtering:** By category, tag, date, featured status
- **Organization:** Categories, tags, albums, collections
- **Interactive:** Lightbox, zoom, fullscreen, slideshow, share

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Upstream Task**: 1.46 (Masonry) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.45 (Carousel), 1.46 (Masonry); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/gallery/types.ts` – modify – (see task objective)
- `GalleryGrid.tsx` – modify – (see task objective)
- `GalleryMasonry.tsx` – modify – (see task objective)
- `GalleryCarousel.tsx` – modify – (see task objective)
- `GalleryLightbox.tsx` – modify – (see task objective)
- `GalleryFilterable.tsx` – modify – (see task objective)
- `GalleryTagged.tsx` – modify – (see task objective)
- `gallery/filters.tsx` – modify – (see task objective)
- `gallery/lightbox.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `GalleryDisplay`, `GalleryItem`. Props: `variant`, `items` (array), `filterByCategory`, `filterByTag`, `showLightbox`, `showCaptions`, `columns`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; filtering; lightbox; export.
- [ ] All 20+ variants render
- [ ] filtering works
- [ ] lightbox functional
- [ ] responsive breakpoints work.

## Technical Constraints

- No image optimization
- use next/image.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; filtering; lightbox; export.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

