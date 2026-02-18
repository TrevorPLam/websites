# 2.16 Create Testimonials Feature (Enhanced)

## Metadata

- **Task ID**: 2-16-create-testimonials-feature-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.4
- **Downstream Tasks**: (Tasks that consume this output)

## Context

TestimonialsSection with 5+ implementation patterns, multi-source integration, and filtering. Uses 2.4 display variants.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Calculator-Based (5+ total)
- **Multi-Source:** Google Reviews, Yelp, Trustpilot, Facebook, custom config, API adapters
- **Filtering:** By rating, source, date, featured, category
- **Features:** Schema validation, adapter pattern, normalization, caching

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.4 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.4
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/features/src/testimonials/index` – create – (see task objective)
- `packages/features/src/testimonials/lib/schema` – create – (see task objective)
- `packages/features/src/testimonials/lib/adapters/config.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/adapters/google.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/adapters/yelp.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/adapters/trustpilot.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/adapters/cms.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/testimonials-config.ts` – create – (see task objective)
- `packages/features/src/testimonials/lib/filters.ts` – create – (see task objective)
- `packages/features/src/testimonials/components/TestimonialsSection.tsx` – create – (see task objective)
- `packages/features/src/testimonials/components/TestimonialsConfig.tsx` – create – (see task objective)
- `packages/features/src/testimonials/components/TestimonialsAPI.tsx` – create – (see task objective)
- `packages/features/src/testimonials/components/TestimonialsCMS.tsx` – create – (see task objective)
- `packages/features/src/testimonials/components/TestimonialsHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `TestimonialsSection`, `testimonialsSchema`, `createTestimonialsConfig`, `normalizeGoogleReviews`, `normalizeYelp`, `normalizeTrustpilot`, `normalizeFromConfig`, `normalizeFromCMS`, `filterTestimonials`, `TestimonialsConfig`, `TestimonialsAPI`, `TestimonialsCMS`, `TestimonialsHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Builds
- [ ] all adapters normalize
- [ ] all patterns work
- [ ] filtering functional
- [ ] section renders.

## Technical Constraints

- No live API keys
- mock data for external sources
- TanStack Query optional.

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

