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
- **References**: ROADMAP Phase 2, [ADR-012](../docs/adr/0012-canonical-types-data-contracts.md).

### Deep research (online)

- **Zod fundamentals:** TypeScript-first schema library; validate at trust boundaries (APIs, forms, external services). Use `z.infer<typeof Schema>` for canonical types so validation and types stay in sync and type drift is avoided. (Zod docs, practical Zod guides 2024.)
- **Parsing methods:** `.parse()` throws `ZodError` (use when valid data expected); `.safeParse()` returns `{ success, data }` for graceful handling. For server actions a single `validateBooking(unknown): CanonicalBooking` that throws is simpler; surface structured errors (field paths, codes) for APIs. (Zod basics.)
- **Schema design:** Compose from small pieces; use `z.coerce.date()` for ISO strings; strings (email, min/max, regex), enums, optional/nullable, defaults. Strict TypeScript recommended. (Zod best practices.)
- **Canonical alignment:** Match existing [booking-schema.ts](../packages/features/src/booking/lib/booking-schema.ts) form fields (firstName, lastName, email, phone, serviceType, preferredDate, timeSlot, notes); add system fields id, tenantId, status, confirmationNumber, createdAt for persistence.

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

## Sample code / examples

```typescript
// packages/types/src/canonical/booking.ts — align with BookingFormData + system fields
import { z } from 'zod';

export const CanonicalBookingSchema = z.object({
  id: z.string().uuid().optional(),
  tenantId: z.string().optional(),
  firstName: z.string().min(2).max(50).trim(),
  lastName: z.string().min(2).max(50).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(10).max(20).trim(),
  serviceType: z.string(),
  preferredDate: z.string(),
  timeSlot: z.string(),
  notes: z.string().max(500).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
  confirmationNumber: z.string().optional(),
  createdAt: z.coerce.date().optional(),
});
export type CanonicalBooking = z.infer<typeof CanonicalBookingSchema>;

export function validateBooking(data: unknown): CanonicalBooking {
  const result = CanonicalBookingSchema.safeParse(data);
  if (!result.success) throw result.error;
  return result.data;
}
```

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-5b and 0-2 can consume CanonicalBooking type and validateBooking
