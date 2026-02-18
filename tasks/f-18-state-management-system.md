# F.18 State Management System

## Metadata

- **Task ID**: f-18-state-management-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

State management system with global state, local state, and persistence.

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

- `packages/infrastructure/state/index` – create – (see task objective)
- `packages/infrastructure/state/global.ts` – create – (see task objective)
- `packages/infrastructure/state/local.ts` – create – (see task objective)
- `packages/infrastructure/state/persistence.ts` – create – (see task objective)
- `packages/infrastructure/state/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `useGlobalState`, `useLocalState`, `usePersistedState`, `StateProvider`, `createStore`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Global state; local state; persistence; hooks; export.
- [ ] Builds
- [ ] state system functional
- [ ] global state works
- [ ] persistence works.

## Technical Constraints

- No custom state engine
- Zustand/Jotai only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Global state; local state; persistence; hooks; export.

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

