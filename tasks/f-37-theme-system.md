# F.37 Theme System

## Metadata

- **Task ID**: f-37-theme-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.5, F.36
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Theme system with theme switching, dark mode, and theme persistence.

## Dependencies

- **Upstream Task**: F.5 – required – prerequisite
- **Upstream Task**: F.36 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.5, F.36
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – Theme patterns, dark mode, theme switching

## Related Files

- `packages/infrastructure/theme-system/index` – create – (see task objective)
- `packages/infrastructure/theme-system/switching.ts` – create – (see task objective)
- `packages/infrastructure/theme-system/dark-mode.ts` – create – (see task objective)
- `packages/infrastructure/theme-system/persistence.ts` – create – (see task objective)
- `packages/infrastructure/theme-system/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `useTheme`, `ThemeProvider`, `switchTheme`, `toggleDarkMode`, `ThemeUtils`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Theme switching; dark mode; persistence; hooks; export.
- [ ] Builds
- [ ] theme system functional
- [ ] switching works
- [ ] dark mode works.

## Technical Constraints

- No custom theme engine
- CSS variables only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Theme switching; dark mode; persistence; hooks; export.

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

