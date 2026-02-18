# 2.50 Build Portfolio Components

## Metadata

- **Task ID**: 2-50-build-portfolio-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.46 (Masonry), 2.6 (Gallery)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

12+ Portfolio variants with filtering and lightbox. L2.

**Enhanced Requirements:**

- **Variants:** Grid, Masonry, Carousel, Filterable Grid, Tagged Grid, Category Tabs, With Details, Minimal, Bold, With Case Studies, With Testimonials, With Stats (12+ total)
- **Filtering:** By category, tag, project type, client
- **Lightbox:** Image lightbox, project details modal

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.46 (Masonry) – required – prerequisite
- **Upstream Task**: 2.6 (Gallery) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.46 (Masonry), 2.6 (Gallery)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/portfolio/types.ts` – modify – (see task objective)
- `PortfolioGrid.tsx` – modify – (see task objective)
- `PortfolioMasonry.tsx` – modify – (see task objective)
- `PortfolioFilterable.tsx` – modify – (see task objective)
- `PortfolioCard.tsx` – modify – (see task objective)
- `portfolio/filters.tsx` – modify – (see task objective)
- `portfolio/lightbox.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `PortfolioDisplay`, `PortfolioCard`. Props: `variant`, `items` (array), `filterByCategory`, `showLightbox`, `showDetails`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; filtering; lightbox; export.
- [ ] All 12+ variants render
- [ ] filtering works
- [ ] lightbox functional.

## Technical Constraints

- No custom project templates
- standard cards only.

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
