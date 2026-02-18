# 1.35 Create Calendar Component

## Metadata

- **Task ID**: 1-35-create-calendar-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Calendar view with date selection. Layer L2.

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19), date-fns or dayjs

## Related Files

- `packages/ui/src/components/Calendar.tsx` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Calendar`. Props: `mode` (single, multiple, range), `selected`, `onSelect`, `disabled` (date | function), `locale`, `firstDayOfWeek`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Import Calendar from radix-ui or build custom; add date selection; add locale support; export; type-check; build.
- [ ] Builds
- [ ] calendar renders
- [ ] date selection works
- [ ] locale support functional.

## Technical Constraints

- No custom date formatting
- use date-fns or dayjs.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Import Calendar from radix-ui or build custom; add date selection; add locale support; export; type-check; build.

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

