# F.13 Shadow System

## Metadata

- **Task ID**: f-13-shadow-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.5
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Shadow system with elevation levels and shadow presets.

## Dependencies

- **Upstream Task**: F.5 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.5
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §C.5 (Design tokens), shadow scales

## Related Files

- `packages/infrastructure/shadow/index` – create – (see task objective)
- `packages/infrastructure/shadow/scale.ts` – create – (see task objective)
- `packages/infrastructure/shadow/presets.ts` – create – (see task objective)
- `packages/infrastructure/shadow/utils.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ShadowScale`, `useShadow`, `getShadow`, `ShadowPreset`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Shadow scale; presets; utilities; export.
- [ ] Builds
- [ ] shadow system functional
- [ ] scale works
- [ ] presets work.

## Technical Constraints

- No custom shadow engine
- CSS shadows only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Shadow scale; presets; utilities; export.

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

