# 0-2 Replace internalBookings with Persistent Storage

## Metadata

- **Task ID**: 0-2-replace-internal-bookings-persistent-storage
- **Owner**: AGENT
- **Priority / Severity**: P0
- **Target Release**: Pre-Phase (Week 0); prerequisite for Phase 2 evol-5 (Weeks 7-8)
- **Related Epics / ADRs**: ROADMAP Pre-Phase, evol-5
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-1 (CI green), 0-3 (tenant context)
- **Downstream Tasks**: evol-5 (Booking Canonical migration), security-1 (Server Action Hardening)

## Context

Replace the in-memory `internalBookings` Map in `packages/features/src/booking/lib/booking-actions.ts` with a persistent storage abstraction via a `BookingRepository` interface. This is a Pre-Phase blocker: security-1 and evol-5 depend on it. The interface must be adapter-friendly for evol-5 (will accept `CanonicalBooking` once evol-4 lands).

## Dependencies

- 0-1 — CI must be green before merge
- 0-3 — Tenant context must be fixed for tenant-scoped repository queries

## Related Files

- `packages/features/src/booking/lib/booking-actions.ts` — uses internalBookings; replace with repository
- `packages/features/src/booking/lib/repository.ts` — create BookingRepository interface + implementation

## Acceptance Criteria

- [ ] `BookingRepository` interface defined with: `create`, `getById`, `update`, `getByConfirmation`
- [ ] Tenant-scoped queries (when 0-3 provides tenant context)
- [ ] Supabase implementation (or configurable storage per site.config)
- [ ] All booking actions use repository instead of `internalBookings` Map
- [ ] `internalBookings` Map removed from booking-actions.ts
- [ ] Tests pass; backward-compatible behavior
- [ ] Interface designed to accept `CanonicalBooking` in evol-5 (no breaking changes when evol-4/5 land)

## Technical Constraints

- Repository must support: create, get by ID, get by confirmation+email, update status
- Storage: Supabase (primary); interface allows future edge/alternate storage per evol-10
- Tenant scoping: use tenant from 0-3 when available; single-tenant fallback for pre-0-3

## Implementation Plan

1. Create `packages/features/src/booking/lib/repository.ts`
   - Define `BookingRepository` interface
   - Implement `SupabaseBookingRepository` (or equivalent)
2. Refactor `booking-actions.ts` to inject/use repository
3. Remove `internalBookings` Map
4. Wire tenant context when 0-3 is done (or stub for now)
5. Add unit tests for repository
6. Update documentation

## Sample Code

```typescript
// packages/features/src/booking/lib/repository.ts
export interface BookingRecord {
  id: string;
  data: BookingFormData; // evol-5: will become CanonicalBooking
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationNumber: string;
  tenantId?: string; // from 0-3
}

export interface BookingRepository {
  create(record: Omit<BookingRecord, 'id' | 'timestamp'>): Promise<BookingRecord>;
  getById(id: string, tenantId?: string): Promise<BookingRecord | null>;
  getByConfirmation(
    confirmationNumber: string,
    email: string,
    tenantId?: string
  ): Promise<BookingRecord | null>;
  update(
    id: string,
    updates: Partial<Pick<BookingRecord, 'status'>>,
    tenantId?: string
  ): Promise<BookingRecord>;
}
```

## Testing Requirements

- Unit tests for repository implementation
- Integration test for full booking flow (submit → confirm)
- Ensure evol-5 can extend interface without breaking 0-2

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
- [ ] evol-5 coordination: interface accepts future CanonicalBooking shape
