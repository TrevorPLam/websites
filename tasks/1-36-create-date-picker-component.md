# 1.36 Create Date Picker Component

## Metadata

- **Task ID**: 1-36-create-date-picker-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.35, 1.30
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Date picker combining Calendar and Popover. Layer L2.

## Dependencies

- **Upstream Task**: 1.35 – required – prerequisite
- **Upstream Task**: 1.30 – required – prerequisite
- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.35, 1.30
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19)

## Related Files

- `packages/ui/src/components/DatePicker.tsx` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `DatePicker`, `DatePickerTrigger`, `DatePickerContent`. Props: `mode` (single, multiple, range), `format`, `placeholder`, `disabled`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Combine Calendar and Popover; add date formatting; export; type-check; build.
- [ ] Builds
- [ ] date picker opens
- [ ] date selection works
- [ ] formatting functional.

## Technical Constraints

- No time selection
- date only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Combine Calendar and Popover; add date formatting; export; type-check; build.

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

