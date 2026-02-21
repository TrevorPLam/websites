# F.24 Performance System

## Metadata

- **Task ID**: f-24-performance-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.16, F.22
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Performance system with optimization utilities, monitoring, and best practices.

## Dependencies

- **Upstream Task**: F.16 – required – prerequisite
- **Upstream Task**: F.22 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.16, F.22
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-INFRA**: Slot, Provider, Context, Theme, CVA — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-infra) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-INFRA](RESEARCH-INVENTORY.md#r-infra) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/infrastructure/performance/index` – create – (see task objective)
- `packages/infrastructure/performance/optimization.ts` – create – (see task objective)
- `packages/infrastructure/performance/monitoring.ts` – create – (see task objective)
- `packages/infrastructure/performance/metrics.ts` – create – (see task objective)
- `packages/infrastructure/performance/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

### Related Patterns

- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-INFRA - Research Findings](RESEARCH-INVENTORY.md#r-infra) for additional examples

## Acceptance Criteria

- [ ] Optimization utilities; monitoring; metrics; hooks; export.
- [ ] Builds
- [ ] performance system functional
- [ ] optimization works
- [ ] monitoring works.

## Technical Constraints

- No custom performance engine
- standard techniques only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Optimization utilities; monitoring; metrics; hooks; export.

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
