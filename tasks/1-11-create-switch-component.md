# 1.11 Create Switch Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P2
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring toggle controls

## Context

Toggle switch with accessible states needed for settings and preferences. This is a Layer L2 component providing keyboard-accessible on/off toggle with size variants.

## Dependencies

- **Package**: @radix-ui/react-switch – required – provides accessible primitive
- **Code**: packages/ui/src/components/Switch.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Settings pages, preference panels

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)

## Related Files

- `packages/ui/src/components/Switch.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Switch

## Code Snippets / Examples

```typescript
// Expected API with CVA variants
const switchVariants = cva("", {
  variants: {
    size: {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-13"
    },
    variant: {
      default: "",
      destructive: ""
    }
  }
});

// Usage examples
<Switch />
<Switch size="sm" disabled />
<Switch checked={isChecked} onCheckedChange={setIsChecked} />
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders toggle switch with proper visual states
- [ ] Supports size variants (sm, md, lg)
- [ ] Keyboard accessible (Tab, Space, Enter)
- [ ] Disabled state respected
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom icons within the switch
- Use CVA for styling variants
- Must be a thin wrapper around Radix UI Switch primitive
- Follow existing component patterns in the repo

## Accessibility & Performance Requirements

- Accessibility: Follow Radix UI implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; no heavy dependencies

## Implementation Plan

- [ ] Import Switch primitive from @radix-ui/react-switch
- [ ] Create CVA variants for size and appearance
- [ ] Create Switch component with forwarding ref
- [ ] Add TypeScript types matching Radix props
- [ ] Export component from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for all variants

## Documentation Updates

- [ ] Add Switch to component library docs
- [ ] Update component index/registry

## Design References

- Radix UI Switch documentation for API reference

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
