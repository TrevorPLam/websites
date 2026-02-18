# 2.27 Create Reviews Feature

## Metadata

- **Task ID**: 2-27-create-reviews-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.4
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Reviews feature with 5+ implementation patterns, aggregation, and moderation.

**Implementation Patterns:** Config-Based, API-Based, Aggregation-Based, Moderation-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.4 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.4
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), review aggregation, moderation

## Related Files

- `packages/features/src/reviews/index` – create – (see task objective)
- `packages/features/src/reviews/lib/schema` – create – (see task objective)
- `packages/features/src/reviews/lib/adapters` – create – (see task objective)
- `packages/features/src/reviews/lib/reviews-config.ts` – create – (see task objective)
- `packages/features/src/reviews/lib/aggregation.ts` – create – (see task objective)
- `packages/features/src/reviews/lib/moderation.ts` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsSection.tsx` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsConfig.tsx` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsAPI.tsx` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsAggregation.tsx` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsModeration.tsx` – create – (see task objective)
- `packages/features/src/reviews/components/ReviewsHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ReviewsSection`, `reviewsSchema`, `createReviewsConfig`, `aggregateReviews`, `moderateReview`, `ReviewsConfig`, `ReviewsAPI`, `ReviewsAggregation`, `ReviewsModeration`, `ReviewsHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; aggregation; moderation; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] aggregation functional
- [ ] moderation works.

## Technical Constraints

- No custom moderation AI
- manual moderation only.

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

