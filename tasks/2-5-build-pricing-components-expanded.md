# 2.5 Build Pricing Components (Expanded)

## Metadata

- **Task ID**: 2-5-build-pricing-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.2 (Button), 1.24 (Alert)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Pricing variants with advanced customization and comparison. L2.

**Enhanced Requirements:**

- **Variants:** Three Column, Four Column, Two Column, Single Featured, Comparison Table, Tabs, Accordion, Toggle (Monthly/Yearly), With Features, Minimal, Bold, Card Grid, Side-by-Side, With Calculator, Customizable (15+ total)
- **Customization:** Feature lists, CTA buttons, badges (Popular, Best Value), tooltips, icons
- **Comparison:** Side-by-side comparison, feature comparison table, highlight differences
- **Interactive:** Toggle between pricing periods, expandable features, hover effects

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Upstream Task**: 1.24 (Alert) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.2 (Button), 1.24 (Alert)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/pricing/types.ts` – modify – (see task objective)
- `PricingThreeColumn.tsx` – modify – (see task objective)
- `PricingFourColumn.tsx` – modify – (see task objective)
- `PricingComparison.tsx` – modify – (see task objective)
- `PricingTabs.tsx` – modify – (see task objective)
- `PricingToggle.tsx` – modify – (see task objective)
- `PricingWithFeatures.tsx` – modify – (see task objective)
- `PricingCard.tsx` – modify – (see task objective)
- `pricing/comparison.tsx` – modify – (see task objective)
- `pricing/customization.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `PricingDisplay`, `PricingCard`, `PricingComparison`. Props: `variant`, `plans` (array), `showComparison`, `togglePeriod`, `currency`, `highlightedPlan`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; comparison system; customization; export.
- [ ] All 15+ variants render
- [ ] comparison works
- [ ] customization functional
- [ ] toggle period works.

## Technical Constraints

- No payment integration
- display only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; comparison system; customization; export.

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

