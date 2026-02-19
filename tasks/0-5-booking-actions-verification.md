# 0.5 Add Verification Params to Booking Actions

## Metadata

- **Task ID**: 0-5-booking-actions-verification
- **Owner**: AGENT
- **Priority / Severity**: P0 (blocking CI/tests)
- **Target Release**: TBD
- **Related Epics / ADRs**: IDOR protection, booking feature
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Build pipeline

## Context

Four booking-actions tests fail: `confirmBooking`, `cancelBooking`, and `getBookingDetails` expect verification params (`{ confirmationNumber, email }`) for IDOR prevention. Current implementation ignores verification. Either add verification to the actions or align tests with current design.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Build pipeline

## Related Files

- `packages/features/src/booking/lib/actions.ts` – modify – Add verification params
- `packages/features/src/booking/lib/__tests__/booking-actions.test.ts` – reference – Failing tests

## Acceptance Criteria

- [ ] Design decision: add verification to actions OR update tests to match current behavior
- [ ] If verification: confirmBooking(bookingId, { confirmationNumber, email }) rejects when mismatch
- [ ] If verification: cancelBooking(bookingId, verification) rejects when mismatch
- [ ] If verification: getBookingDetails(bookingId, config, verification) returns null when mismatch
- [ ] All 4 currently failing tests pass

## Technical Constraints

- IDOR protection is a security requirement; prefer adding verification over removing tests

## Implementation Plan

- [ ] Decide: implement verification vs. update tests
- [ ] Implement chosen approach
- [ ] Verify `pnpm test` passes

## Testing Requirements

- Run `pnpm test` — booking-actions tests must pass

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
