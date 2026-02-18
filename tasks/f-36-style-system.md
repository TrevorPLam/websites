# F.36 Style System

## Metadata

- **Task ID**: f-36-style-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.5
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Style system with CSS-in-JS support, Tailwind integration, and style utilities.

## Dependencies

- **Upstream Task**: F.5 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.5
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – Styling patterns, CSS-in-JS, Tailwind

## Related Files

- `packages/infrastructure/style/index` – create – (see task objective)
- `packages/infrastructure/style/css-in-js.ts` – create – (see task objective)
- `packages/infrastructure/style/tailwind.ts` – create – (see task objective)
- `packages/infrastructure/style/utilities.ts` – create – (see task objective)
- `packages/infrastructure/style/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `useStyle`, `StyleProvider`, `css`, `styled`, `StyleUtils`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] CSS-in-JS; Tailwind integration; utilities; hooks; export.
- [ ] Builds
- [ ] style system functional
- [ ] CSS-in-JS works
- [ ] Tailwind works.

## Technical Constraints

- No custom style engine
- Tailwind + CSS-in-JS only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] CSS-in-JS; Tailwind integration; utilities; hooks; export.

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

