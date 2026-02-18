# 6.10a validate-client

## Metadata

- **Task ID**: 6-10a-validate-client
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6.3 (6.8), 6.1+6.3 (6.9), 5.1 (6.10a)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

pnpm create-client, validate-config, generate-component; knip/depcheck; validate-client script; pnpm health; program:wave0–wave3 scripts.

## Dependencies

- **Upstream Task**: 6.3 (6.8) – required – prerequisite
- **Upstream Task**: 6.1+6.3 (6.9) – required – prerequisite
- **Upstream Task**: 5.1 (6.10a) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6.3 (6.8), 6.1+6.3 (6.9), 5.1 (6.10a)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- (Add file paths)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `pnpm validate-client [path]`, `pnpm health`, `pnpm program:wave0` etc. Exit 0/1.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] (Add specific, testable criteria)

## Technical Constraints

- (Add technical constraints per task scope)

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

