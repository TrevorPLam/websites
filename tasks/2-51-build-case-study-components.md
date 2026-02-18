# 2.51 Build Case Study Components

## Metadata

- **Task ID**: 2-51-build-case-study-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 2.18 (Portfolio)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Case Study variants with metrics and downloads. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured, Detail Page, With Metrics, With Testimonials, With Timeline, With Downloads, Minimal, With Images (10+ total)
- **Metrics:** Key metrics display, charts, statistics
- **Downloads:** PDF downloads, resource links

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 2.18 (Portfolio) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 2.18 (Portfolio)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/case-study/types.ts` – modify – (see task objective)
- `CaseStudyGrid.tsx` – modify – (see task objective)
- `CaseStudyDetail.tsx` – modify – (see task objective)
- `CaseStudyCard.tsx` – modify – (see task objective)
- `case-study/metrics.tsx` – modify – (see task objective)
- `case-study/downloads.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `CaseStudyDisplay`, `CaseStudyCard`, `CaseStudyDetail`. Props: `variant`, `caseStudies` (array), `showMetrics`, `showDownloads`, `showTimeline`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; metrics display; downloads; export.
- [ ] All 10+ variants render
- [ ] metrics display
- [ ] downloads work.

## Technical Constraints

- No custom chart library
- basic metrics only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; metrics display; downloads; export.

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
