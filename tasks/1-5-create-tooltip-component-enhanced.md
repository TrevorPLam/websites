# 1.5 Create Tooltip Component (Enhanced)

## Metadata

- **Task ID**: 1-5-create-tooltip-component-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Small popup on hover/focus with extensive positioning and customization. Layer L2. WCAG 2.2 1.4.13 compliance.

**Enhanced Requirements:**

- **Positions:** top, top-start, top-end, bottom, bottom-start, bottom-end, left, left-start, left-end, right, right-start, right-end (12 total)
- **Trigger Modes:** hover, focus, click, manual (4 total)
- **Rich Content:** Icons, formatted text, links (accessible)
- **Delays:** Show delay, hide delay (configurable)
- **Collision Detection:** Auto-adjust position when near viewport edge
- **Animations:** Fade, slide, scale (3 animation types)
- **Arrow:** Optional arrow pointing to trigger
- **Accessibility:** WCAG 1.4.13 compliance (hoverable, dismissible), ARIA attributes, keyboard support

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19), WCAG 1.4.13

## Related Files

- `packages/ui/src/components/Tooltip.tsx` – create – (see task objective)
- `tooltip/types.ts` – create – (see task objective)
- `tooltip/hooks.ts` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipArrow`. Props: `side`, `align`, `sideOffset`, `alignOffset`, `delayDuration`, `disableHoverableContent`, `collisionPadding`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Builds
- [ ] all positions work
- [ ] hover/focus/click triggers
- [ ] rich content displays
- [ ] escape dismissal
- [ ] collision detection
- [ ] animations smooth.

## Technical Constraints

- Rich HTML limited to accessible patterns
- text-only fallback for screen readers.

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

