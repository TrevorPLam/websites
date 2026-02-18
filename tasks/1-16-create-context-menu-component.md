# 1.16 Create Context Menu Component

## Metadata

- **Task ID**: 1-16-create-context-menu-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring right-click menus

## Context

Right-click context menu with nested submenus needed for rich interactions. This is a Layer L2 component providing accessible context menus with keyboard support.

## Dependencies

- **Package**: @radix-ui/react-context-menu – required – provides accessible primitive
- **Code**: packages/ui/src/components/ContextMenu.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Table interactions, file managers, admin interfaces

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-UI**: Radix UI primitives, React 19, ComponentRef — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-ui) for full research findings.
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-RADIX**: Radix component APIs — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-radix) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-UI](RESEARCH-INVENTORY.md#r-ui) — Full research findings
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-RADIX](RESEARCH-INVENTORY.md#r-radix) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/ui/src/components/ContextMenu.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export ContextMenu components

## Code Snippets / Examples

### Related Patterns
- See [R-UI - Research Findings](RESEARCH-INVENTORY.md#r-ui) for additional examples
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-RADIX - Research Findings](RESEARCH-INVENTORY.md#r-radix) for additional examples

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders context menu on right-click
- [ ] Supports nested submenus
- [ ] Keyboard accessible (arrows, enter, escape)
- [ ] Checkbox and radio item support
- [ ] Menu separators and labels
- [ ] Keyboard shortcuts display
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom positioning beyond Radix defaults
- Must be a thin wrapper around Radix UI Context Menu primitive
- Follow existing component patterns in the repo
- Support full Radix API surface

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient menu rendering
- Keyboard: Full keyboard navigation with proper focus management

## Implementation Plan

- [ ] Import Context Menu primitive from @radix-ui/react-context-menu
- [ ] Create Context Menu component suite with forwarding refs
- [ ] Add support for nested submenus
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for menu states
- Nested submenu functionality tests
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Context Menu component
- [ ] Update packages/ui exports – ensure ContextMenu is in index

## Design References

- Radix UI Context Menu documentation for API reference
- ARIA Menu Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
