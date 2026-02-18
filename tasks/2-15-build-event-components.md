# 2.15 Build Event Components

## Metadata

- **Task ID**: 2-15-build-event-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.35 (Calendar), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Event variants with calendar and registration. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Calendar View, Timeline, Featured Event, Event Card, With Registration, With Map, Upcoming Events, Past Events (10+ total)
- **Calendar Integration:** Calendar view, date filtering, recurring events
- **Registration:** Registration form, ticket selection, confirmation

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.35 (Calendar) – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.35 (Calendar), 1.2 (Button); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/event/types.ts` – modify – (see task objective)
- `EventGrid.tsx` – modify – (see task objective)
- `EventCalendar.tsx` – modify – (see task objective)
- `EventTimeline.tsx` – modify – (see task objective)
- `EventCard.tsx` – modify – (see task objective)
- `EventRegistration.tsx` – modify – (see task objective)
- `event/calendar.tsx` – modify – (see task objective)
- `event/registration.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `EventDisplay`, `EventCard`, `EventCalendar`. Props: `variant`, `events` (array), `showCalendar`, `showRegistration`, `filterByDate`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; calendar integration; registration; export.
- [ ] All 10+ variants render
- [ ] calendar works
- [ ] registration functional.

## Technical Constraints

- No payment processing
- registration form only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; calendar integration; registration; export.

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

