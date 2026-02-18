# 1.41 Create Pagination Component

## Metadata

- **Task ID**: 1-41-create-pagination-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Pagination controls with page navigation. Layer L2.

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §3.1 (React 19), pagination patterns

## Related Files

- `packages/ui/src/components/Pagination.tsx` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`. Props: `currentPage`, `totalPages`, `onPageChange`, `showFirstLast` (boolean), `showPageNumbers` (boolean).

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Create Pagination component; add page navigation; add ellipsis for many pages; export; type-check; build.
- [ ] Builds
- [ ] pagination renders
- [ ] page navigation works
- [ ] ellipsis displays
- [ ] keyboard accessible.

## Technical Constraints

- No custom page size selector
- page navigation only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Create Pagination component; add page navigation; add ellipsis for many pages; export; type-check; build.

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

