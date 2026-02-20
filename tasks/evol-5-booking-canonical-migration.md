# EVOL-5 Migrate Booking to Canonical Types + Repository

## Metadata

- **Task ID**: evol-5-booking-canonical-migration
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 7-8)
- **Related Epics / ADRs**: NEW.md Phase 2, evol-4, 0-2
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-2 (BookingRepository), evol-4 (CanonicalBooking)
- **Downstream Tasks**: evol-7, evol-10

## Context

Refactor booking feature to use CanonicalBooking, validateBooking, and BookingRepository. Deprecate direct Supabase usage in actions. Per NEW.md Weeks 7-8. Coordinate with 0-2 so interface accepts CanonicalBooking.

## Dependencies

- 0-2 (BookingRepository) — create first; ensure interface is adapter-friendly
- evol-4 (CanonicalBooking, validateBooking)

## Research

- **Primary topics**: [R-CANONICAL](RESEARCH-INVENTORY.md#r-canonical), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Repository pattern; canonical validation before persistence.
- **References**: NEW.md Weeks 7-8, [packages/features/src/booking/](../packages/features/src/booking/).

## Related Files

- `packages/features/src/booking/lib/actions.ts` – modify
- `packages/features/src/booking/lib/repository.ts` – create or extend from 0-2
- `packages/types/src/canonical/booking.ts` – use

## Acceptance Criteria

- [ ] createBooking uses validateBooking(data) for canonical validation
- [ ] createBooking uses BookingRepository.create(validated)
- [ ] No direct Supabase in actions (repository abstracts)
- [ ] 0-2 interface accepts CanonicalBooking
- [ ] Tests pass; backward-compatible behavior

## Technical Constraints

- Repository decides storage (Supabase today; edge tomorrow per evol-10)
- validateBooking from @repo/types/canonical

## Implementation Plan

- [ ] Ensure 0-2 BookingRepository interface accepts CanonicalBooking
- [ ] Refactor createBooking to validateBooking + repository.create
- [ ] Remove direct Supabase from actions
- [ ] Add repository implementation (Supabase)
- [ ] Update tests
- [ ] Document

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
