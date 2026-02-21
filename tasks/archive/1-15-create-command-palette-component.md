# 1.15 Create Command Palette Component

## Metadata

- **Task ID**: 1-15-create-command-palette-component
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
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

- `packages/ui/src/components/Command.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Command components

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

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; follow ARIA patterns for menu navigation and screen readers
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
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Command component
- [ ] Update packages/ui exports – ensure Command is in index

## Design References

- cmdk documentation for API reference
- ARIA Authoring Practices for keyboard navigation

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
