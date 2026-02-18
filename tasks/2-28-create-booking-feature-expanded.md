# 2.28 Create Booking Feature (Expanded)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, 4.2

**Related Research:** §5.1 (Spec-driven), §4.2 (Scheduling integrations)

**Objective:** Booking feature with 5+ implementation patterns and multi-provider support.

**Implementation Patterns:** Config-Based, API-Based, Provider-Based, Calendar-Based, Hybrid (5+ total)

**Files:** `packages/features/src/booking/` (index, lib/schema, lib/adapters, lib/booking-config.ts, lib/providers.ts, lib/calendar.ts, components/BookingSection.tsx, components/BookingConfig.tsx, components/BookingAPI.tsx, components/BookingProvider.tsx, components/BookingCalendar.tsx, components/BookingHybrid.tsx)

**API:** `BookingSection`, `bookingSchema`, `createBookingConfig`, `bookAppointment`, `checkAvailability`, `syncCalendar`, `BookingConfig`, `BookingAPI`, `BookingProvider`, `BookingCalendar`, `BookingHybrid`

**Checklist:** Schema; adapters; multi-provider support; calendar integration; implementation patterns; export.
**Done:** Builds; all patterns work; multi-provider functional; calendar sync works.
**Anti:** No custom booking system; use existing providers.

---
