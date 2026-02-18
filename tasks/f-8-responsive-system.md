# F.8 Responsive System

## Metadata

- **Task ID**: f-8-responsive-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.4
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Responsive system with breakpoints, media queries, and responsive utilities.

## Dependencies

- **Upstream Task**: F.4 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.4
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

- `packages/infrastructure/responsive/index` – create – (see task objective)
- `packages/infrastructure/responsive/breakpoints.ts` – create – (see task objective)
- `packages/infrastructure/responsive/media-queries.ts` – create – (see task objective)
- `packages/infrastructure/responsive/hooks.ts` – create – (see task objective)
- `packages/infrastructure/responsive/utils.ts` – create – (see task objective)

## Code Snippets / Examples

### Related Patterns
- See [R-INFRA - Research Findings](RESEARCH-INVENTORY.md#r-infra) for additional examples

## Acceptance Criteria

- [ ] Breakpoints; media queries; hooks; utilities; export.
- [ ] Builds
- [ ] responsive system functional
- [ ] breakpoints work
- [ ] media queries work.

## Technical Constraints

- No custom breakpoint engine
- standard breakpoints only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Breakpoints; media queries; hooks; utilities; export.

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

