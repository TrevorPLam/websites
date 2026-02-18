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

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper radio group patterns - [ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

## Related Files

- `packages/ui/src/components/RadioGroup.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export RadioGroup components

## Code Snippets / Examples

```typescript
// Expected API components
export const RadioGroup = React.forwardRef<...>(...)
export const RadioGroupItem = React.forwardRef<...>(...)

// Usage examples
<RadioGroup defaultValue="option1" onValueChange={setValue}>
  <RadioGroupItem value="option1" id="option1">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="option1" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
  </RadioGroupItem>
  <RadioGroupItem value="option2" id="option2">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="option2" />
      <Label htmlFor="option2">Option 2</Label>
    </div>
  </RadioGroupItem>
</RadioGroup>

// Card variant
<RadioGroup defaultValue="card1" variant="card">
  <RadioGroupItem value="card1" className="p-4 border rounded">
    <div className="space-y-2">
      <h4 className="font-medium">Card Option 1</h4>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
  </RadioGroupItem>
</RadioGroup>
```

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
