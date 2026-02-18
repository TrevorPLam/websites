# 1.17 Create Hover Card Component

## Metadata

- **Task ID**: 1-17-create-hover-card-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
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

- `packages/ui/src/components/HoverCard.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export HoverCard components

## Code Snippets / Examples

### R-UI — React 19 component with ref (from RESEARCH-INVENTORY)
```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function MyPrimitive({ ref, className, ...props }: MyPrimitiveProps) {
  return (
    <Primitive.Root ref={ref} className={cn('base-styles', className)} {...props} />
  );
}
```
### R-RADIX — ComponentRef type
```typescript
type MyPrimitiveRef = React.ComponentRef<typeof Primitive.Root>;
```
### R-A11Y — Touch target (2.5.8) and reduced motion
```css
.touch-target { min-width: 24px; min-height: 24px; }
```
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Related Patterns
- See [R-UI - Research Findings](RESEARCH-INVENTORY.md#r-ui) for additional examples
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-RADIX - Research Findings](RESEARCH-INVENTORY.md#r-radix) for additional examples

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

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and keyboard navigation
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
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Hover Card component
- [ ] Update packages/ui exports – ensure HoverCard is in index

## Design References

- Radix UI Hover Card documentation for API reference
- NN/G research on hover timing patterns

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
