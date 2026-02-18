# F.23 Accessibility System

## Metadata

- **Task ID**: f-23-accessibility-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Accessibility system with ARIA utilities, keyboard navigation, and screen reader support.

## Dependencies

- **Package**: @repo/infra – modify – target package (L0 infra; packages/infra)

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolvable via RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md R-A11Y**: WCAG 2.2 AA (24×24px touch targets, focus ≥2px 3:1 contrast, keyboard alternatives, ARIA live regions, prefers-reduced-motion). Directs ARIA utilities, keyboard.ts, screen-reader.ts, hooks.
- **[2026-02-18] WAI-ARIA Authoring Practices**: Use for roving tabindex, roles, and screen reader patterns in packages/infra/accessibility.

## Related Files

- `packages/infra/accessibility/index.ts` – create – barrel export
- `packages/infra/accessibility/aria.ts` – create – ARIA utilities
- `packages/infra/accessibility/keyboard.ts` – create – keyboard navigation helpers
- `packages/infra/accessibility/screen-reader.ts` – create – screen reader utilities
- `packages/infra/accessibility/hooks.ts` – create – useAria, useKeyboard, useScreenReader

## Code Snippets / Examples

```typescript
// API surface (from task)
// `useAria`, `useKeyboard`, `useScreenReader`, `AriaProvider`, `AccessibilityUtils`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] ARIA utilities; keyboard navigation; screen reader; hooks; export.
- [ ] Builds
- [ ] accessibility system functional
- [ ] ARIA works
- [ ] keyboard works.

## Technical Constraints

- No custom accessibility engine
- standard ARIA only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] ARIA utilities; keyboard navigation; screen reader; hooks; export.

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

