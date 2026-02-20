# EVOL-5b Booking Repository Migration (Actions → validateBooking + Repository)

## Metadata

- **Task ID**: evol-5b-booking-repository-migration
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 7-8)
- **Related Epics / ADRs**: ROADMAP Phase 2, evol-5, evol-5a, 0-2
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-2 (BookingRepository), evol-5a (CanonicalBooking, validateBooking)
- **Downstream Tasks**: evol-7, evol-10

## Context

Refactor booking actions to use validateBooking and BookingRepository; remove direct Supabase usage from actions. Part of evol-5; depends on 0-2 interface and evol-5a types.

## Dependencies

- 0-2 — BookingRepository interface exists; ensure it accepts CanonicalBooking
- evol-5a — validateBooking, CanonicalBooking in @repo/types

## Related Files

- `packages/features/src/booking/lib/actions.ts` – modify
- `packages/features/src/booking/lib/repository.ts` – use (from 0-2)

## Acceptance Criteria

- [ ] createBooking uses validateBooking(data) for canonical validation
- [ ] createBooking uses BookingRepository.create(validated)
- [ ] No direct Supabase in actions (repository abstracts)
- [ ] 0-2 interface accepts CanonicalBooking
- [ ] Tests pass; backward-compatible behavior

## Implementation Plan

- [ ] Ensure 0-2 BookingRepository interface accepts CanonicalBooking (coordinate with 0-2)
- [ ] Refactor createBooking to validateBooking + repository.create
- [ ] Remove direct Supabase from actions
- [ ] Update tests
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
