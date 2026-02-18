# 2.4 Build Testimonial Components (Expanded)

## Metadata

- **Task ID**: 2-4-build-testimonial-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.45 (Carousel), 1.40 (Rating)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Testimonial variants with multi-source integration. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col), Carousel, Slider, List, Featured + Grid, Card Grid, Quote Cards, Minimal, Bold, With Images, With Videos, Filterable, Searchable, Star Ratings, Review Cards, Trust Badges, Social Proof, Testimonial Wall, Rotating Quotes, Side-by-Side (20+ total)
- **Multi-Source Integration:** Google Reviews, Yelp, Trustpilot, custom config, API adapters
- **Composition:** Testimonial cards with quote, author, role, company, image, rating, date, source badge
- **Filtering:** By rating, source, date, featured
- **Animations:** Fade, slide, rotate, typewriter

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Upstream Task**: 1.40 (Rating) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.45 (Carousel), 1.40 (Rating); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/testimonials/types.ts` – modify – (see task objective)
- `TestimonialGrid.tsx` – modify – (see task objective)
- `TestimonialCarousel.tsx` – modify – (see task objective)
- `TestimonialSlider.tsx` – modify – (see task objective)
- `TestimonialList.tsx` – modify – (see task objective)
- `TestimonialCard.tsx` – modify – (see task objective)
- `TestimonialFilterable.tsx` – modify – (see task objective)
- `testimonials/sources.tsx` – modify – (see task objective)
- `testimonials/filters.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `TestimonialDisplay`, `TestimonialCard`. Props: `variant`, `testimonials` (array), `source`, `filterByRating`, `showRating`, `showImage`, `showSource`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; multi-source adapters; filtering; export.
- [ ] All 20+ variants render
- [ ] multi-source integration works
- [ ] filtering functional
- [ ] animations smooth.

## Technical Constraints

- No live API keys
- mock data for external sources.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; multi-source adapters; filtering; export.

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

