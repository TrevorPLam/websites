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

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper keyboard navigation patterns - [ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)

## Related Files

- `packages/ui/src/components/ContextMenu.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export ContextMenu components

## Code Snippets / Examples

```typescript
// Expected API components (full Radix set)
export const ContextMenu = React.forwardRef<...>(...)
export const ContextMenuTrigger = React.forwardRef<...>(...)
export const ContextMenuContent = React.forwardRef<...>(...)
export const ContextMenuItem = React.forwardRef<...>(...)
export const ContextMenuSeparator = React.forwardRef<...>(...)
export const ContextMenuSub = React.forwardRef<...>(...)
export const ContextMenuSubTrigger = React.forwardRef<...>(...)
export const ContextMenuSubContent = React.forwardRef<...>(...)
export const ContextMenuCheckboxItem = React.forwardRef<...>(...)
export const ContextMenuRadioItem = React.forwardRef<...>(...)
export const ContextMenuLabel = React.forwardRef<...>(...)
export const ContextMenuShortcut = React.forwardRef<...>(...)

// Usage examples
<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => console.log('Copy')}>
      Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Option 1</ContextMenuItem>
        <ContextMenuItem>Option 2</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
```

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
