# 2.7 Build Stats Counter Component (Expanded)

## Metadata

- **Task ID**: 2-7-build-stats-counter-component-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6 Stats Counter variants with animation customization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), List, Carousel, With Icons (6 total)
- **Animation:** Count-up animation, duration control, easing functions
- **Composition:** Stat cards with number, label, icon, description, trend indicator

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/stats/types.ts` – modify – (see task objective)
- `StatsGrid.tsx` – modify – (see task objective)
- `StatsList.tsx` – modify – (see task objective)
- `StatsCarousel.tsx` – modify – (see task objective)
- `StatsCard.tsx` – modify – (see task objective)
- `stats/animations.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `StatsCounter`, `StatCard`. Props: `variant`, `stats` (array), `animate`, `duration`, `showIcons`, `showTrend`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; animations; export.
- [ ] All 6 variants render
- [ ] count-up animations work
- [ ] responsive breakpoints work.

## Technical Constraints

- No custom easing functions
- CSS animations only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; animations; export.

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

