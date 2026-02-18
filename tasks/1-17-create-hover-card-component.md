# 1.17 Create Hover Card Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P2
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring hover tooltips

## Context

Card that appears on hover with rich content needed for enhanced interactions. This is a Layer L2 component providing accessible hover cards with configurable delays.

## Dependencies

- **Package**: @radix-ui/react-hover-card – required – provides accessible primitive
- **Code**: packages/ui/src/components/HoverCard.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: User profiles, product previews, help tooltips

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Hover Card](https://www.radix-ui.com/primitives/docs/components/hover-card)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper hover timing patterns - [Hover Timing Best Practices](https://www.nngroup.com/articles/timing-displays/)

## Related Files

- `packages/ui/src/components/HoverCard.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export HoverCard components

## Code Snippets / Examples

```typescript
// Expected API components
export const HoverCard = React.forwardRef<...>(...)
export const HoverCardTrigger = React.forwardRef<...>(...)
export const HoverCardContent = React.forwardRef<...>(...)

// Usage examples
<HoverCard openDelay={300} closeDelay={200}>
  <HoverCardTrigger asChild>
    <Button variant="ghost">Hover me</Button>
  </HoverCardTrigger>
  <HoverCardContent side="right" align="center">
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">User Profile</h4>
      <p className="text-sm text-muted-foreground">
        Rich content with images and links
      </p>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  </HoverCardContent>
</HoverCard>
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders hover card on trigger hover
- [ ] Configurable open and close delays
- [ ] Supports positioning (side, align)
- [ ] Rich content support in card
- [ ] Keyboard accessible
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom animations beyond Radix defaults
- Must be a thin wrapper around Radix UI Hover Card primitive
- Follow existing component patterns in the repo
- Support flexible positioning options

## Accessibility & Performance Requirements

- Accessibility: Follow Radix UI implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient hover detection
- Timing: Appropriate delays to prevent accidental triggers

## Implementation Plan

- [ ] Import Hover Card primitive from @radix-ui/react-hover-card
- [ ] Create Hover Card component suite with forwarding refs
- [ ] Add delay configuration support
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for positioning
- Hover timing behavior tests

## Documentation Updates

- [ ] Add Hover Card to component library docs
- [ ] Update component index/registry

## Design References

- Radix UI Hover Card documentation for API reference
- NN/G research on hover timing patterns

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
