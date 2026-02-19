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

## Research

- **Primary topics**: [R-NEXT](RESEARCH-INVENTORY.md#r-next-app-router-rsc-server-actions) (Server Actions, IDOR prevention), [R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling).
- **[2026-02] IDOR prevention**: Actions that fetch/update by ID must require verification params so the server can reject callers who cannot prove ownership. Pattern: `confirmBooking(bookingId, { confirmationNumber, email })`; reject when mismatch.
- **[2026-02] Best practice**: Prefer adding verification to actions over removing tests; IDOR protection is a security requirement.
- **References**: [RESEARCH-INVENTORY.md – R-NEXT](RESEARCH-INVENTORY.md#r-next-app-router-rsc-server-actions), [RESEARCH-INVENTORY.md – R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling).

## Related Files

- `packages/features/src/booking/lib/booking-actions.ts` – modify – Add verification params
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

## Sample code / examples

- **Server Action with verification** (packages/features/src/booking/lib/booking-actions.ts): Accept verification and reject on mismatch.
  ```typescript
  export async function confirmBooking(
    bookingId: string,
    verification: { confirmationNumber: string; email: string }
  ) {
    const booking = await getBookingById(bookingId);
    if (!booking ||
        booking.confirmationNumber !== verification.confirmationNumber ||
        booking.email !== verification.email) {
      return { success: false, error: 'Verification failed' };
    }
    // ... perform confirm
  }
  ```
- **getBookingDetails**: Return `null` when verification does not match; **cancelBooking**: same verification shape, reject when mismatch.

## Testing Requirements

- Run `pnpm test` — booking-actions tests must pass

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
