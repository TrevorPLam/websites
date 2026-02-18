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

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

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

### Related Patterns
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples
- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CMS - Research Findings](RESEARCH-INVENTORY.md#r-cms) for additional examples

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

