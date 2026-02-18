# 2.15 Build Event Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.35 (Calendar), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Event variants with calendar and registration. L2.

**Requirements:**

- **Variants:** Grid, List, Calendar View, Timeline, Featured Event, Event Card, With Registration, With Map, Upcoming Events, Past Events (10+ total)
- **Calendar Integration:** Calendar view, date filtering, recurring events
- **Registration:** Registration form, ticket selection, confirmation

**Files:** `packages/marketing-components/src/event/types.ts`, `EventGrid.tsx`, `EventCalendar.tsx`, `EventTimeline.tsx`, `EventCard.tsx`, `EventRegistration.tsx`, `event/calendar.tsx`, `event/registration.tsx`, `index.ts`

**API:** `EventDisplay`, `EventCard`, `EventCalendar`. Props: `variant`, `events` (array), `showCalendar`, `showRegistration`, `filterByDate`.

**Checklist:** Types; variants; calendar integration; registration; export.
**Done:** All 10+ variants render; calendar works; registration functional.
**Anti:** No payment processing; registration form only.

---
