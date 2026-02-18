# 2.21 Build Course Components (Education)

## Metadata

- **Task ID**: 2-21-build-course-components-education
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.2 (Button), 1.40 (Rating)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Course variants with enrollment and progress. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured, With Enrollment, With Progress, Category Tabs, With Reviews, With Curriculum, Minimal, Detailed (10+ total)
- **Enrollment:** Enrollment form, payment integration, confirmation
- **Progress:** Progress tracking, completion status, certificates

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Upstream Task**: 1.40 (Rating) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.2 (Button), 1.40 (Rating)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/course/types.ts` – modify – (see task objective)
- `CourseGrid.tsx` – modify – (see task objective)
- `CourseCard.tsx` – modify – (see task objective)
- `CourseDetail.tsx` – modify – (see task objective)
- `CourseEnrollment.tsx` – modify – (see task objective)
- `course/progress.tsx` – modify – (see task objective)
- `course/enrollment.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `CourseDisplay`, `CourseCard`, `CourseEnrollment`. Props: `variant`, `courses` (array), `showEnrollment`, `showProgress`, `showReviews`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; enrollment; progress tracking; export.
- [ ] All 10+ variants render
- [ ] enrollment works
- [ ] progress displays.

## Technical Constraints

- No LMS integration
- basic tracking only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; enrollment; progress tracking; export.

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

