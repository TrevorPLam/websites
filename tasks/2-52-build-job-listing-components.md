# 2.52 Build Job Listing Components

## Metadata

- **Task ID**: 2-52-build-job-listing-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.2 (Button), 1.23 (Form)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Job Listing variants with search and application. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured, With Filters, Searchable, Category Tabs, With Application Form, Minimal, Detailed, With Company Info (10+ total)
- **Search:** Full-text search, filter by location, department, type
- **Application:** Application form, file upload, integration

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Upstream Task**: 1.23 (Form) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.2 (Button), 1.23 (Form)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/job-listing/types.ts` – modify – (see task objective)
- `JobListingGrid.tsx` – modify – (see task objective)
- `JobListingList.tsx` – modify – (see task objective)
- `JobListingCard.tsx` – modify – (see task objective)
- `JobApplication.tsx` – modify – (see task objective)
- `job-listing/search.tsx` – modify – (see task objective)
- `job-listing/filters.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `JobListingDisplay`, `JobListingCard`, `JobApplication`. Props: `variant`, `jobs` (array), `searchable`, `filterByLocation`, `showApplication`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; search; filters; application form; export.
- [ ] All 10+ variants render
- [ ] search works
- [ ] filters functional
- [ ] application form works.

## Technical Constraints

- No ATS integration
- basic form only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; search; filters; application form; export.

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
