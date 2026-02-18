# 1.15 Create Command Palette Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P1
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring command interfaces

## Context

Command palette with search, keyboard navigation, and actions needed for power user workflows. This is a Layer L2 component providing fast, keyboard-driven command execution.

## Dependencies

- **Package**: cmdk – required – provides command palette primitive
- **Code**: packages/ui/src/components/Command.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Admin interfaces, developer tools, search features

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use cmdk for robust command palette implementation - [cmdk Documentation](https://cmdk.paco.me/)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement keyboard navigation best practices - [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)

## Related Files

- `packages/ui/src/components/Command.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Command components

## Code Snippets / Examples

```typescript
// Expected API components
export const Command = React.forwardRef<...>(...)
export const CommandInput = React.forwardRef<...>(...)
export const CommandList = React.forwardRef<...>(...)
export const CommandEmpty = React.forwardRef<...>(...)
export const CommandGroup = React.forwardRef<...>(...)
export const CommandItem = React.forwardRef<...>(...)
export const CommandSeparator = React.forwardRef<...>(...)
export const CommandShortcut = React.forwardRef<...>(...)

// Usage examples
<Command shouldFilter={false}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => console.log('Calendar')}>
        <Calendar />
        <span>Calendar</span>
        <CommandShortcut>⌘K</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders command palette with search input
- [ ] Supports keyboard navigation (arrows, enter, escape)
- [ ] Basic string matching search (no fuzzy search)
- [ ] Command groups and separators
- [ ] Keyboard shortcuts display
- [ ] Loop navigation support
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- Basic string matching only (no fuzzy search)
- Use cmdk as the foundation
- Must follow existing component patterns in the repo
- Support custom filtering when needed

## Accessibility & Performance Requirements

- Accessibility: Follow ARIA patterns for menu navigation and screen readers
- Performance: Efficient search and filtering; minimal re-renders
- Keyboard: Full keyboard navigation with proper focus management

## Implementation Plan

- [ ] Install and import cmdk package
- [ ] Create Command component suite with forwarding refs
- [ ] Add search functionality with basic string matching
- [ ] Implement keyboard navigation
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for all states
- Performance tests for large command lists

## Documentation Updates

- [ ] Add Command to component library docs
- [ ] Update component index/registry

## Design References

- cmdk documentation for API reference
- ARIA Authoring Practices for keyboard navigation

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
