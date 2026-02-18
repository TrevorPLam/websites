# 2.26 Build Social Proof Components

## Metadata

- **Task ID**: 2-26-build-social-proof-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.40 (Rating), 2.4 (Testimonials)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

8+ Social Proof variants with trust badges and counts. L2.

**Enhanced Requirements:**

- **Variants:** Trust Badges, Review Counts, Customer Counts, Logo Wall, Testimonial Carousel, Star Ratings, Social Shares, Minimal (8+ total)
- **Trust Badges:** Security badges, certifications, guarantees
- **Counts:** Customer counts, review counts, social media followers

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.40 (Rating) – required – prerequisite
- **Upstream Task**: 2.4 (Testimonials) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.40 (Rating), 2.4 (Testimonials)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/social-proof/types.ts` – modify – (see task objective)
- `TrustBadges.tsx` – modify – (see task objective)
- `ReviewCounts.tsx` – modify – (see task objective)
- `LogoWall.tsx` – modify – (see task objective)
- `social-proof/badges.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `SocialProofDisplay`. Props: `variant`, `badges` (array), `showCounts`, `showLogos`, `counts`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; badges; counts; export.
- [ ] All 8+ variants render
- [ ] badges display
- [ ] counts show.

## Technical Constraints

- No live API integration
- static data only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; badges; counts; export.

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

