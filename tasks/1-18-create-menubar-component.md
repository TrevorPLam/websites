# 1.18 Create Menubar Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P2
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring application menus

## Context

Application menu bar with keyboard navigation needed for desktop-style interfaces. This is a Layer L2 component providing accessible menu navigation with submenus.

## Dependencies

- **Package**: @radix-ui/react-menubar – required – provides accessible primitive
- **Code**: packages/ui/src/components/Menubar.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Application layouts, admin interfaces

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Menubar](https://www.radix-ui.com/primitives/docs/components/menubar)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper menubar keyboard patterns - [ARIA Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

## Related Files

- `packages/ui/src/components/Menubar.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Menubar components

## Code Snippets / Examples

```typescript
// Expected API components (full Radix set)
export const Menubar = React.forwardRef<...>(...)
export const MenubarMenu = React.forwardRef<...>(...)
export const MenubarTrigger = React.forwardRef<...>(...)
export const MenubarContent = React.forwardRef<...>(...)
export const MenubarItem = React.forwardRef<...>(...)
export const MenubarSeparator = React.forwardRef<...>(...)
export const MenubarSub = React.forwardRef<...>(...)
export const MenubarSubTrigger = React.forwardRef<...>(...)
export const MenubarSubContent = React.forwardRef<...>(...)
export const MenubarCheckboxItem = React.forwardRef<...>(...)
export const MenubarRadioItem = React.forwardRef<...>(...)
export const MenubarLabel = React.forwardRef<...>(...)
export const MenubarShortcut = React.forwardRef<...>(...)

// Usage examples
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onSelect={() => console.log('New')}>
        New <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem onSelect={() => console.log('Open')}>
        Open <MenubarShortcut>⌘O</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Email</MenubarItem>
          <MenubarItem>Slack</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders horizontal menu bar
- [ ] Keyboard accessible (arrows, tab, enter, escape)
- [ ] Supports nested submenus
- [ ] Checkbox and radio item support
- [ ] Menu separators and labels
- [ ] Keyboard shortcuts display
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom styling variants beyond Radix defaults
- Must be a thin wrapper around Radix UI Menubar primitive
- Follow existing component patterns in the repo
- Support full Radix API surface

## Accessibility & Performance Requirements

- Accessibility: Follow Radix UI implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient menu rendering
- Keyboard: Full keyboard navigation with proper focus management

## Implementation Plan

- [ ] Import Menubar primitive from @radix-ui/react-menubar
- [ ] Create Menubar component suite with forwarding refs
- [ ] Add keyboard navigation support
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for menu states
- Nested submenu functionality tests

## Documentation Updates

- [ ] Add Menubar to component library docs
- [ ] Update component index/registry

## Design References

- Radix UI Menubar documentation for API reference
- ARIA Menubar Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
