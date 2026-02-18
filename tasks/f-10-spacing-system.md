# F.10 Spacing System

## Metadata

- **Task ID**: f-10-spacing-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Spacing system with consistent spacing scale and utilities.

## Dependencies

- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §C.5 (Design tokens), spacing scales

## Related Files

- `packages/infrastructure/spacing/index` – create – (see task objective)
- `packages/infrastructure/spacing/scale.ts` – create – (see task objective)
- `packages/infrastructure/spacing/utils.ts` – create – (see task objective)
- `packages/infrastructure/spacing/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `spacing`, `useSpacing`, `SpacingScale`, `getSpacing`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Spacing scale; utilities; hooks; export.
- [ ] Builds
- [ ] spacing system functional
- [ ] scale works
- [ ] utilities work.

## Technical Constraints

- No custom spacing engine
- standard scale only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Spacing scale; utilities; hooks; export.

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

