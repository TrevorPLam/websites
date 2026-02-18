# 2.2 Build ServiceShowcase Components (Expanded)

## Metadata

- **Task ID**: 2-2-build-serviceshowcase-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.3, 1.24, 1.25
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Service layout variants with filtering, sorting, and advanced composition. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Tabs, Accordion, Masonry, Card Grid, Featured + Grid, Carousel, Sidebar + Content, Comparison Table, Timeline, Stepper, Filterable Grid, Searchable List, Category Tabs, Tagged Grid, Featured Service, Service Showcase, Service Directory, Service Map (20+ total)
- **Filtering:** By category, tag, price range, rating, featured status
- **Sorting:** By name, price, rating, date added, popularity
- **Composition:** Service cards with image, title, description, price, CTA, tags, rating, badges
- **Responsive:** Mobile-first, breakpoint-specific layouts
- **Interactive:** Hover effects, expandable details, quick view modal

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.3 – required – prerequisite
- **Upstream Task**: 1.24 – required – prerequisite
- **Upstream Task**: 1.25 – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.3, 1.24, 1.25
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2. Uses Tabs, Accordion, Alert, AlertDialog from @repo/ui.

## Related Files

- `packages/marketing-components/src/services/types.ts` – modify – (see task objective)
- `ServiceGrid.tsx` – modify – (see task objective)
- `ServiceList.tsx` – modify – (see task objective)
- `ServiceTabs.tsx` – modify – (see task objective)
- `ServiceAccordion.tsx` – modify – (see task objective)
- `ServiceMasonry.tsx` – modify – (see task objective)
- `ServiceCarousel.tsx` – modify – (see task objective)
- `ServiceComparison.tsx` – modify – (see task objective)
- `ServiceTimeline.tsx` – modify – (see task objective)
- `ServiceFilterable.tsx` – modify – (see task objective)
- `ServiceSearchable.tsx` – modify – (see task objective)
- `services/filters.tsx` – modify – (see task objective)
- `services/sorting.tsx` – modify – (see task objective)
- `services/composition.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ServiceShowcase`, `ServiceCard`, `ServiceFilter`, `ServiceSort`. Props: `layout`, `services` (array), `filters`, `sortBy`, `onServiceClick`, `showPrice`, `showRating`, `showTags`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] All 20+ layouts render
- [ ] filtering works
- [ ] sorting functional
- [ ] RSC where static
- [ ] responsive breakpoints work.

## Technical Constraints

- No CMS wiring
- data from props only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

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

