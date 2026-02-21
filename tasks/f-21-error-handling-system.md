# F.21 Error Handling System

## Metadata

- **Task ID**: f-21-error-handling-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Error handling system with error boundaries, error logging, and user-friendly errors.

## Dependencies

- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
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

## Advanced Code Pattern Expectations (2026-02-19)

From [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](../docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md) and [TASKS.md](TASKS.md):

- **Wave 1 withErrorBoundary**: Add `withErrorBoundary(Component, fallback?)` HOC wrapping class-based Error Boundary; fallback optional.
- **Error Boundary**: Use class component (required by React API); call `logError` from `@repo/infra/client` in `componentDidCatch` for Sentry integration.

## Related Files

- `packages/infrastructure/error/index` – create – (see task objective)
- `packages/infrastructure/error/boundary.ts` – create – (see task objective)
- `packages/infrastructure/error/logging.ts` – create – (see task objective)
- `packages/infrastructure/error/display.ts` – create – (see task objective)
- `packages/infrastructure/error/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

### Related Patterns

- See [R-INFRA - Research Findings](RESEARCH-INVENTORY.md#r-infra) for additional examples

## Acceptance Criteria

- [ ] Error boundary; logging; display; hooks; export.
- [ ] Builds
- [ ] error system functional
- [ ] boundaries work
- [ ] logging works.

## Technical Constraints

- No custom error engine
- React error boundaries only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Error boundary; logging; display; hooks; export.

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
