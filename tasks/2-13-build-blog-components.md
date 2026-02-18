# 2.13 Build Blog Components

## Metadata

- **Task ID**: 2-13-build-blog-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.41 (Pagination)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Blog variants with pagination, filtering, and related posts. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured + Grid, Card Grid, Masonry, With Sidebar, Minimal, Magazine, Timeline, Category Tabs, Tagged, Searchable, With Author, With Date, Infinite Scroll (15+ total)
- **Pagination:** Page-based, infinite scroll, load more
- **Filtering:** By category, tag, author, date
- **Related Posts:** Algorithm-based, manual selection

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.41 (Pagination) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.41 (Pagination)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2, SEO best practices

## Related Files

- `packages/marketing-components/src/blog/types.ts` – modify – (see task objective)
- `BlogGrid.tsx` – modify – (see task objective)
- `BlogList.tsx` – modify – (see task objective)
- `BlogMasonry.tsx` – modify – (see task objective)
- `BlogWithSidebar.tsx` – modify – (see task objective)
- `BlogPostCard.tsx` – modify – (see task objective)
- `blog/pagination.tsx` – modify – (see task objective)
- `blog/filters.tsx` – modify – (see task objective)
- `blog/related.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `BlogDisplay`, `BlogPostCard`. Props: `variant`, `posts` (array), `pagination`, `filterByCategory`, `showRelated`, `showAuthor`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; pagination; filtering; related posts; export.
- [ ] All 15+ variants render
- [ ] pagination works
- [ ] filtering functional
- [ ] related posts display.

## Technical Constraints

- No CMS integration
- data from props only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; pagination; filtering; related posts; export.

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

