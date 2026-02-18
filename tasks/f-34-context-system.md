# F.34 Context System

## Metadata

- **Task ID**: f-34-context-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.1
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Context system for shared state and component communication.

## Dependencies

- **Upstream Task**: F.1 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/infrastructure/context/index` – create – (see task objective)
- `packages/infrastructure/context/context.ts` – create – (see task objective)
- `packages/infrastructure/context/providers.ts` – create – (see task objective)
- `packages/infrastructure/context/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `createContext`, `useContext`, `ContextProvider`, `withContext`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Context utilities; providers; hooks; export.
- [ ] Builds
- [ ] context system functional
- [ ] providers work
- [ ] hooks work.

## Technical Constraints

- No custom context engine
- React Context only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Context utilities; providers; hooks; export.

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

