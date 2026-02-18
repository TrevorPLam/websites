# 1.10 Create Separator Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P2
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks that use visual dividers

## Context

Visual divider with horizontal/vertical orientation needed for consistent UI layouts. This is a Layer L2 component providing a clean, accessible separator.

## Dependencies

- **Package**: @radix-ui/react-separator – required – provides accessible primitive
- **Code**: packages/ui/src/components/Separator.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Any task requiring visual dividers

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Separator](https://www.radix-ui.com/primitives/docs/components/separator)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)

## Related Files

- `packages/ui/src/components/Separator.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Separator

## Code Snippets / Examples

```typescript
// Expected API
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>((props, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    orientation={props.orientation || 'horizontal'}
    decorative={props.decorative}
    {...props}
  />
));

// Usage examples
<Separator /> // horizontal by default
<Separator orientation="vertical" decorative />
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders horizontal separator by default
- [ ] Supports vertical orientation via prop
- [ ] Decorative prop respected for accessibility
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom styling variants beyond Radix defaults
- Must be a thin wrapper around Radix UI Separator primitive
- Follow existing component patterns in the repo

## Accessibility & Performance Requirements

- Accessibility: Follow Radix UI implementation for screen readers and ARIA attributes
- Performance: Minimal runtime overhead; no heavy dependencies

## Implementation Plan

- [ ] Import Separator primitive from @radix-ui/react-separator
- [ ] Create Separator component with forwarding ref
- [ ] Add TypeScript types matching Radix props
- [ ] Export component from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Visual regression tests for horizontal/vertical orientations

## Documentation Updates

- [ ] Add Separator to component library docs
- [ ] Update component index/registry

## Design References

- Radix UI Separator documentation for API reference

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
