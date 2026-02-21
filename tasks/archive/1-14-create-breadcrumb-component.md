# 1.14 Create Breadcrumb Component

## Metadata

- **Task ID**: 1-14-create-breadcrumb-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring navigation trails

## Context

Navigation breadcrumb trail with separator customization needed for site hierarchy. This is a Layer L2 component providing accessible navigation path with SEO benefits.

## Dependencies

- **Package**: @radix-ui/react-navigation-menu – optional – for navigation patterns
- **Code**: packages/ui/src/components/Breadcrumb.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Page templates, navigation features

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

- `packages/ui/src/components/Breadcrumb.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Breadcrumb components

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
- [ ] Renders breadcrumb trail with proper hierarchy
- [ ] Customizable separators (string or ReactNode)
- [ ] Supports maxItems for truncation
- [ ] Keyboard accessible navigation
- [ ] Proper ARIA attributes for screen readers
- [ ] SEO structured data support
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- Manual item creation only (no auto-generation from routes)
- Must follow existing component patterns in the repo
- Support custom separators and truncation
- Include structured data for SEO

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient rendering of long trails
- SEO: Include structured data for search engines

## Implementation Plan

- [ ] Create Breadcrumb component suite with forwarding refs
- [ ] Add separator customization support
- [ ] Add maxItems truncation logic
- [ ] Include ARIA attributes and structured data
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for separator variants
- SEO structured data validation
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Breadcrumb component
- [ ] Update packages/ui exports – ensure Breadcrumb is in index

## Design References

- Radix UI Navigation documentation for patterns
- Google Structured Data guidelines for breadcrumbs

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
