# EVOL-5a Booking Canonical Types (Schema + validateBooking)

## Metadata

- **Task ID**: evol-5a-booking-canonical-types
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 7-8)
- **Related Epics / ADRs**: ROADMAP Phase 2, evol-4, evol-5
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-4 (CanonicalLead pattern)
- **Downstream Tasks**: evol-5b, 0-2 (interface alignment)

## Context

Add CanonicalBooking schema and validateBooking in @repo/types so the booking feature can validate and persist canonical booking data. Part of evol-5; must complete before evol-5b (action migration).

## Dependencies

- evol-4 — canonical type pattern established

## Research

- **Primary topics**: [R-CANONICAL](RESEARCH-INVENTORY.md#r-canonical).
- **References**: ROADMAP Phase 2, [docs/adr/0012-canonical-types-data-contracts.md](../docs/adr/0012-canonical-types-data-contracts.md).

## Related Files

- `packages/types/src/canonical/booking.ts` – create
- `packages/types/src/index.ts` – export canonical booking

## Acceptance Criteria

- [ ] CanonicalBookingSchema (Zod) in @repo/types
- [ ] validateBooking(data: unknown) returns CanonicalBooking or throws
- [ ] Exported from @repo/types
- [ ] Tests for schema and validateBooking

## Implementation Plan

- [ ] Create packages/types/src/canonical/booking.ts (or extend existing from evol-4)
- [ ] Implement CanonicalBookingSchema and validateBooking
- [ ] Export from @repo/types
- [ ] Add unit tests

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-5b and 0-2 can consume CanonicalBooking type and validateBooking
