# EVOL-5 Migrate Booking to Canonical Types + Repository (Umbrella)

## Metadata

- **Task ID**: evol-5-booking-canonical-migration
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 7-8)
- **Related Epics / ADRs**: ROADMAP Phase 2, evol-4, 0-2
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-2 (BookingRepository), evol-4 (CanonicalBooking)
- **Downstream Tasks**: evol-7, evol-10
- **Sub-tasks**: [evol-5a](evol-5a-booking-canonical-types.md) (canonical types), [evol-5b](evol-5b-booking-repository-migration.md) (action migration)

## Context

Umbrella for migrating booking to canonical types and repository. **Execute in order:** evol-5a (CanonicalBooking, validateBooking) then evol-5b (refactor actions to use validateBooking + BookingRepository). Deprecate direct Supabase in actions. Per ROADMAP Phase 2 Weeks 7-8. Coordinate with 0-2 so interface accepts CanonicalBooking.

## Dependencies

- 0-2 (BookingRepository) — create first; ensure interface is adapter-friendly
- evol-4 (CanonicalBooking, validateBooking)

## Research

- **Primary topics**: [R-CANONICAL](RESEARCH-INVENTORY.md#r-canonical), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Repository pattern; canonical validation before persistence.
- **References**: ROADMAP Phase 2 Weeks 7-8, [packages/features/src/booking/](../packages/features/src/booking/).

## Related Files

- `packages/features/src/booking/lib/actions.ts` – modify
- `packages/features/src/booking/lib/repository.ts` – create or extend from 0-2
- `packages/types/src/canonical/booking.ts` – use

## Acceptance Criteria (covered by sub-tasks)

- [ ] evol-5a: CanonicalBooking schema, validateBooking in @repo/types
- [ ] evol-5b: createBooking uses validateBooking + BookingRepository; no direct Supabase
- [ ] 0-2 interface accepts CanonicalBooking
- [ ] Tests pass; backward-compatible behavior

## Technical Constraints

- Repository decides storage (Supabase today; edge tomorrow per evol-10)
- validateBooking from @repo/types/canonical

## Implementation Plan

- [ ] Complete [evol-5a](evol-5a-booking-canonical-types.md)
- [ ] Complete [evol-5b](evol-5b-booking-repository-migration.md)
- [ ] Document coordination with 0-2

## Sample code / examples

```typescript
// packages/features/src/booking/lib/actions.ts
import { CanonicalBooking, validateBooking } from '@repo/types/canonical';
import { BookingRepository } from './repository';

export async function createBooking(data: unknown) {
  const validated = validateBooking(data);
  const repository = new BookingRepository();
  return repository.create(validated);
}
```

## Testing Requirements

- Unit tests for createBooking; integration test for full flow.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
