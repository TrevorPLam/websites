# 1.22 Create Label Component

## Metadata

- **Task ID**: 1-22-create-label-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring form labels

## Context

Accessible form label with required indicator needed for form accessibility. This is a Layer L2 component providing proper label association with visual indicators.

## Dependencies

- **Package**: @radix-ui/react-label – required – provides accessible primitive
- **Code**: packages/ui/src/components/Label.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Forms, input components, validation displays

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Label](https://www.radix-ui.com/primitives/docs/components/label)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper label patterns - [ARIA Label Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/label/)

## Related Files

- `packages/ui/src/components/Label.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Label

## Code Snippets / Examples

```typescript
// Expected API
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
    variant?: 'default' | 'error';
  }
>(({ className, required, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  >
    {props.children}
    {required && <span className="text-destructive">*</span>}
  </LabelPrimitive.Root>
));

// Usage examples
<Label htmlFor="email">Email Address</Label>
<Label htmlFor="password" required>Password</Label>
<Label htmlFor="confirm" variant="error" required>Confirm Password</Label>

// With form control
<div className="space-y-2">
  <Label htmlFor="name">Full Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders label with proper htmlFor association
- [ ] Required indicator displays when required prop is true
- [ ] Error variant for validation states
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- No custom styling variants beyond Radix defaults
- Must be a thin wrapper around Radix UI Label primitive
- Follow existing component patterns in the repo
- Support required indicator and error states

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; Radix UI provides base implementation for screen readers and proper label association
- Performance: Minimal runtime overhead; efficient rendering
- Semantic: Proper htmlFor association with form controls

## Implementation Plan

- [ ] Import Label primitive from @radix-ui/react-label
- [ ] Create Label component with forwarding ref
- [ ] Add required indicator support
- [ ] Add error variant support
- [ ] Add TypeScript types matching Radix props
- [ ] Export component from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Label association tests
- Visual regression tests for variants
- Required indicator functionality tests
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Label component
- [ ] Update packages/ui exports – ensure Label is in index

## Design References

- Radix UI Label documentation for API reference
- ARIA Label Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
