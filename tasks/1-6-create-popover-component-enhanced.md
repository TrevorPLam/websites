# 1.6 Create Popover Component (Enhanced)

## Metadata

- **Task ID**: 1-6-create-popover-component-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Rich interactive overlay with advanced positioning and composition. Click-outside dismissal, focus management. Layer L2. WCAG 2.2 Dialog pattern.

**Enhanced Requirements:**

- **Modes:** Modal, non-modal (2 total)
- **Positions:** All 12 positions (same as Tooltip)
- **Collision Detection:** Auto-adjust when near viewport edges
- **Slots:** Header, body, footer slots for composition
- **Nested Popovers:** Support for popovers within popovers
- **Animations:** Fade, slide, scale, zoom (4 animation types)
- **Arrow:** Optional arrow with positioning
- **Focus Management:** Focus trap in modal mode, return focus on close
- **Accessibility:** Full ARIA support, keyboard navigation, escape to close

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19)

## Related Files

- `packages/ui/src/components/Popover.tsx` – create – (see task objective)
- `popover/types.ts` – create – (see task objective)
- `popover/hooks.ts` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverArrow`, `PopoverClose`, `PopoverHeader`, `PopoverBody`, `PopoverFooter`. Props: `side`, `align`, `modal`, `collisionPadding`, `animation`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Builds
- [ ] trigger works
- [ ] modal focus trap
- [ ] collision detection
- [ ] slots functional
- [ ] nested popovers
- [ ] animations smooth.

## Technical Constraints

- No complex forms (use Dialog)
- stop at Radix foundation.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

