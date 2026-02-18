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

Range input slider with single/multiple thumbs needed for forms and controls. This is a Layer L2 component providing keyboard-accessible slider with orientation support.

## Dependencies

- **Package**: @radix-ui/react-slider – required – provides accessible primitive
- **Code**: packages/ui/src/components/Slider.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Forms, settings panels, filters

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)

## Related Files

- `packages/ui/src/components/Slider.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Slider

## Code Snippets / Examples

```typescript
// Expected API
interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[] | number;
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  multiple?: boolean;
}

// Usage examples
<Slider min={0} max={100} step={1} value={[50]} />
<Slider min={0} max={100} value={[20, 80]} multiple />
<Slider orientation="vertical" min={0} max={10} />
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders slider with single thumb by default
- [ ] Supports multiple thumbs for range selection
- [ ] Keyboard accessible (Arrow keys, Home, End)
- [ ] Disabled state respected
- [ ] Horizontal and vertical orientations
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom track styling beyond Radix defaults
- Must be a thin wrapper around Radix UI Slider primitive
- Follow existing component patterns in the repo
- Support both single and multiple thumb modes

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; no heavy dependencies

## Implementation Plan

- [ ] Import Slider primitive from @radix-ui/react-slider
- [ ] Create Slider component with forwarding ref
- [ ] Add support for multiple thumbs when needed
- [ ] Add TypeScript types matching Radix props
- [ ] Export component from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for orientations and thumb modes
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Slider component
- [ ] Update packages/ui exports – ensure Slider is in index

## Design References

- Radix UI Slider documentation for API reference

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
