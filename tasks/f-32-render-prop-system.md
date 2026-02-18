# F.32 Render Prop System

## Metadata

- **Task ID**: f-32-render-prop-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.1
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Render prop system for flexible component composition.

## Dependencies

- **Upstream Task**: F.1 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – Render prop patterns, composition

## Related Files

- `packages/infrastructure/render-props/index` – create – (see task objective)
- `packages/infrastructure/render-props/render-props.ts` – create – (see task objective)
- `packages/infrastructure/render-props/composition.ts` – create – (see task objective)
- `packages/infrastructure/render-props/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `RenderProp`, `useRenderProp`, `withRenderProp`, `RenderPropProvider`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Render prop component; composition; hooks; export.
- [ ] Builds
- [ ] render prop system functional
- [ ] composition works.

## Technical Constraints

- No custom render prop engine
- standard React patterns only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Render prop component; composition; hooks; export.

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

