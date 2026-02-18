# 1.12 Create Slider Component

## Metadata

- **Task ID**: 1-12-create-slider-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring range inputs

## Context

Range input slider with single/multiple thumbs needed for forms and controls.
This is a Layer L2 component providing keyboard-accessible slider with orientation support.

## Dependencies

- **Package**: @radix-ui/react-slider – required – provides accessible primitive
- **Code**: packages/ui/src/components/Slider.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Forms, settings panels, filters

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

- `packages/ui/src/components/Slider.tsx` – **NOT IMPLEMENTED** – Component needs to be created
- `packages/ui/src/index.ts` – **NEEDS UPDATE** – Must export Slider component
- `packages/ui/package.json` – **VERIFIED** – radix-ui catalog dependency available
- `pnpm-workspace.yaml` – **VERIFIED** – React 19.0.0 catalog entry available

## Code Snippets / Examples

### R-UI — React 19 component with ref
```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Slider({ ref, className, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root ref={ref} className={cn('slider-root', className)} {...props}>
      <SliderPrimitive.Track><SliderPrimitive.Range /></SliderPrimitive.Track>
      <SliderPrimitive.Thumb />
    </SliderPrimitive.Root>
  );
}
```

### R-RADIX — ComponentRef type
```typescript
type SliderRef = React.ComponentRef<typeof SliderPrimitive.Root>;
```

### R-A11Y — Touch target (2.5.8) and reduced motion
```css
.slider-thumb { min-width: 24px; min-height: 24px; }
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
- [ ] Renders slider with single thumb by default
- [ ] Supports multiple thumbs for range selection (value array)
- [ ] Keyboard accessible (Arrow keys, Home, End, PageUp, PageDown)
- [ ] Disabled state respected with proper ARIA attributes
- [ ] Horizontal and vertical orientations supported
- [ ] TypeScript types correct with React.ComponentRef pattern
- [ ] WCAG 2.2 AA compliant (24×24px thumb targets, dragging alternatives)
- [ ] Build passes without errors
- [x] React 19 compatible (uses React.ComponentRef – updated)

## Technical Constraints

- No custom track styling beyond design system CSS custom properties
- Must be a thin wrapper around Radix UI Slider primitive v1.3.6
- Follow existing component patterns in the repo (forwardRef, cn utility)
- Support both single and multiple thumb modes via value array
- Use React.ComponentRef for React 19 compatibility
- Thumb size must meet WCAG 2.2 24×24 CSS pixel minimum

## Accessibility & Performance Requirements

- **WCAG 2.2 AA Compliance**: 24×24 CSS pixel thumb targets, keyboard navigation, ARIA live regions
- **Dragging Movements (2.5.7)**: Keyboard alternative to dragging operations
- **Target Size (2.5.8)**: Thumb targets meet minimum 24×24 pixel requirement
- **Screen Reader Support**: Proper ARIA labels, value announcements, state communication
- **Focus Management**: Visible focus indicators, logical tab order, focus trapping
- **Performance**: Minimal runtime overhead, tree-shakeable, < 1KB component size
- **React 19**: Server Component compatible, automatic memoization ready

## Implementation Plan

- [ ] Add @radix-ui/react-slider to @repo/ui dependencies
- [ ] Create Slider.tsx with React.ComponentRef pattern for React 19
- [ ] Implement thumb sizing to meet WCAG 2.2 24×24 pixel requirement
- [ ] Add design system integration via CSS custom properties
- [ ] Export Slider component from packages/ui/src/index.ts
- [ ] Add TypeScript types extending Radix props
- [ ] Run typecheck and build to verify React 19 compatibility
- [ ] Test keyboard navigation and screen reader compatibility

## Testing Requirements

- **Unit Tests**: Component rendering with different props, value changes, orientation switches
- **Accessibility Tests**: axe-core integration, WCAG 2.2 AA compliance verification
- **Keyboard Navigation Tests**: Arrow keys, Home/End, PageUp/PageDown, Tab navigation
- **Visual Regression Tests**: Horizontal/vertical orientations, disabled states, thumb positioning
- **React 19 Compatibility**: ComponentRef usage, no ElementRef warnings
- **Performance Tests**: Bundle size impact, interaction latency (< 100ms)
- **Cross-browser Tests**: Modern browser compatibility, assistive technology support
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Slider component
- [ ] Update packages/ui exports – ensure Slider is in index

## Design References

- Radix UI Slider documentation for API reference

## Definition of Done

- [ ] Code reviewed and approved (follows Radix UI patterns)
- [ ] All tests passing (unit, accessibility, keyboard, visual regression)
- [ ] Documentation updated (UI library docs, API examples)
- [ ] Component builds successfully (no TypeScript errors)
- [ ] Export available in packages/ui with proper types
- [ ] WCAG 2.2 AA compliant (verified with axe-core)
- [ ] React 19 compatible (no console warnings)
- [ ] Performance compliant (bundle size, interaction latency)
- [ ] Design system integrated (CSS custom properties)
