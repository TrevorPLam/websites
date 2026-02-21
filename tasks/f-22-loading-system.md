# F.22 Loading System

## Metadata

- **Task ID**: f-22-loading-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.9
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Loading system with loading states, skeletons, and suspense integration.

## Dependencies

- **Upstream Task**: 1.9 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.9
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-INFRA**: Slot, Provider, Context, Theme, CVA — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-infra) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-INFRA](RESEARCH-INVENTORY.md#r-infra) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/infrastructure/loading/index` – create – (see task objective)
- `packages/infrastructure/loading/states.ts` – create – (see task objective)
- `packages/infrastructure/loading/skeletons.ts` – create – (see task objective)
- `packages/infrastructure/loading/suspense.ts` – create – (see task objective)
- `packages/infrastructure/loading/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

### Related Patterns

- See [R-INFRA - Research Findings](RESEARCH-INVENTORY.md#r-infra) for additional examples

## Acceptance Criteria

- [ ] Loading states; skeletons; suspense; hooks; export.
- [ ] Builds
- [ ] loading system functional
- [ ] states work
- [ ] skeletons work.

## Technical Constraints

- No custom loading engine
- React Suspense only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Loading states; skeletons; suspense; hooks; export.

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
