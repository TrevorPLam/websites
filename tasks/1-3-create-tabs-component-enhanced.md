# 1.3 Create Tabs Component (Enhanced)

## Metadata

- **Task ID**: 1-3-create-tabs-component-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Tabbed content with accessible tablist, roving focus, and extensive customization. Layer L2 (@repo/ui).

**Enhanced Requirements:**

- **Variants:** default, underline, pills, enclosed, soft (5 total)
- **Sizes:** sm, md, lg, xl (4 total)
- **Orientations:** horizontal, vertical (2 total)
- **URL Sync:** Hash-based and query parameter sync
- **Nested Tabs:** Support for tabs within tabs
- **Scrollable:** Horizontal/vertical scrolling for many tabs
- **Icons:** Icon support in triggers
- **Animations:** Smooth transitions, indicator animations
- **Accessibility:** Full keyboard navigation, ARIA attributes, focus management

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19), §4.2 (INP)

## Related Files

- `packages/ui/src/components/Tabs.tsx` – create – (see task objective)
- `tabs/types.ts` – create – (see task objective)
- `tabs/hooks.ts` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `TabsIndicator`. Props: `orientation`, `activationMode`, `variant`, `size`, `syncWithUrl`, `scrollable`, `nested`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Builds
- [ ] all variants render
- [ ] keyboard nav works
- [ ] URL sync functional
- [ ] nested tabs work
- [ ] scrollable tabs
- [ ] controlled/uncontrolled.

## Technical Constraints

- No framer-motion animations (use CSS transitions)
- URL sync limited to hash/query params.

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

