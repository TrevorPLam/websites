# 1.20 Create Radio Group Component

## Metadata

- **Task ID**: 1-20-create-radio-group-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring radio selections

## Context

Radio button group with accessible selection needed for form inputs. This is a Layer L2 component providing keyboard-accessible radio selection with variants.

## Dependencies

- **Package**: @radix-ui/react-radio-group – required – provides accessible primitive
- **Code**: packages/ui/src/components/RadioGroup.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Forms, settings panels, surveys

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

- `packages/ui/src/components/RadioGroup.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export RadioGroup components

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
.touch-target {
  min-width: 24px;
  min-height: 24px;
}
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
- [ ] Renders radio group with proper selection
- [ ] Keyboard accessible (arrows, tab)
- [ ] Supports horizontal and vertical orientation
- [ ] Card variant for rich content
- [ ] Disabled state respected
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom styling beyond variants
- Must be a thin wrapper around Radix UI Radio Group primitive
- Follow existing component patterns in the repo
- Support card variant with rich content

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient selection handling
- Keyboard: Full keyboard navigation with proper focus management

## Implementation Plan

- [ ] Import Radio Group primitive from @radix-ui/react-radio-group
- [ ] Create Radio Group component suite with forwarding refs
- [ ] Add card variant support
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for variants
- Card variant functionality tests
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Radio Group component
- [ ] Update packages/ui exports – ensure RadioGroup is in index

## Design References

- Radix UI Radio Group documentation for API reference
- ARIA Radio Group Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
