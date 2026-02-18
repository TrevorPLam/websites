# 6.3 Remove Templates Directory

## Metadata

- **Task ID**: 6-3-remove-templates-directory
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6.1, 5.2–5.6
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Delete templates/ after migration matrix sign-off. grep for refs = 0.

## Dependencies

- **Upstream Task**: 6.1 – required – prerequisite
- **Upstream Task**: 5.2–5.6 – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6.1, 5.2–5.6
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- (Add file paths)

## Code Snippets / Examples

```typescript
// Add code snippets and usage examples
```

## Acceptance Criteria

- [ ] (Add specific, testable criteria)

## Technical Constraints

- Do not delete until migration complete
- rollback = git revert.

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

