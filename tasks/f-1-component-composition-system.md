# F.1 Component Composition System

## Metadata

- **Task ID**: f-1-component-composition-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Foundation system for component composition with slots, render props, and HOCs.

## Dependencies

- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/infrastructure/composition/index` – create – (see task objective)
- `packages/infrastructure/composition/slots.ts` – create – (see task objective)
- `packages/infrastructure/composition/render-props.ts` – create – (see task objective)
- `packages/infrastructure/composition/hocs.ts` – create – (see task objective)
- `packages/infrastructure/composition/context.ts` – create – (see task objective)
- `packages/infrastructure/composition/provider.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `useSlots`, `useRenderProps`, `withComposition`, `CompositionProvider`, `Slot`, `RenderProp`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Slots system; render props; HOCs; context; provider; export.
- [ ] Builds
- [ ] composition system functional
- [ ] all patterns work.

## Technical Constraints

- No custom composition
- standard React patterns only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Slots system; render props; HOCs; context; provider; export.

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

