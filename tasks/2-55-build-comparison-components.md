# 2.23 Build Comparison Components

## Metadata

- **Task ID**: 2-23-build-comparison-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.32 (Table)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6+ Comparison variants for features and pricing. L2.

**Enhanced Requirements:**

- **Variants:** Table, Side-by-Side, Feature Comparison, Price Comparison, With Highlights, Minimal (6+ total)
- **Features:** Highlight differences, feature checkmarks, tooltips

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.32 (Table) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.32 (Table)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/comparison/types.ts` – modify – (see task objective)
- `ComparisonTable.tsx` – modify – (see task objective)
- `ComparisonSideBySide.tsx` – modify – (see task objective)
- `ComparisonFeature.tsx` – modify – (see task objective)
- `comparison/highlights.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ComparisonDisplay`. Props: `variant`, `items` (array), `highlightDifferences`, `showTooltips`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; highlight system; export.
- [ ] All 6+ variants render
- [ ] highlights work
- [ ] tooltips display.

## Technical Constraints

- No custom comparison logic
- manual configuration only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; highlight system; export.

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

