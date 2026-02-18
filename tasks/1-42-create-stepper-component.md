# 1.42 Create Stepper Component

## Metadata

- **Task ID**: 1-42-create-stepper-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Multi-step progress indicator with navigation. Layer L2.

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/ui/src/components/Stepper.tsx` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Stepper`, `StepperStep`, `StepperContent`, `StepperTrigger`. Props: `currentStep`, `orientation` (horizontal, vertical), `clickable` (boolean), `variant` (default, numbered, dots).

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Create Stepper component; add step navigation; add variants; export; type-check; build.
- [ ] Builds
- [ ] stepper renders
- [ ] step navigation works
- [ ] variants display
- [ ] keyboard accessible.

## Technical Constraints

- No custom step validation
- visual indicator only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Create Stepper component; add step navigation; add variants; export; type-check; build.

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

