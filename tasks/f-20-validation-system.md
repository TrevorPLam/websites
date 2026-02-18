# F.20 Validation System

## Metadata

- **Task ID**: f-20-validation-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.19
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Validation system with schema validation and custom validators.

## Dependencies

- **Upstream Task**: F.19 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.19
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-FORM**: React Hook Form, Zod, validation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-form) for full research findings.
- **[2026-02-18] R-INFRA**: Slot, Provider, Context, Theme, CVA — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-infra) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-FORM](RESEARCH-INVENTORY.md#r-form) — Full research findings
- [RESEARCH-INVENTORY.md - R-INFRA](RESEARCH-INVENTORY.md#r-infra) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/infrastructure/validation/index` – create – (see task objective)
- `packages/infrastructure/validation/schema.ts` – create – (see task objective)
- `packages/infrastructure/validation/validators.ts` – create – (see task objective)
- `packages/infrastructure/validation/errors.ts` – create – (see task objective)
- `packages/infrastructure/validation/utils.ts` – create – (see task objective)

## Code Snippets / Examples

### Related Patterns
- See [R-FORM - Research Findings](RESEARCH-INVENTORY.md#r-form) for additional examples
- See [R-INFRA - Research Findings](RESEARCH-INVENTORY.md#r-infra) for additional examples

## Acceptance Criteria

- [ ] Schema validation; custom validators; error handling; utilities; export.
- [ ] Builds
- [ ] validation system functional
- [ ] schemas work
- [ ] validators work.

## Technical Constraints

- No custom validation engine
- Zod only.

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

