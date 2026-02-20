# EVOL-7b BookingFeature Registration

## Metadata

- **Task ID**: evol-7b-booking-feature-registration
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 3 (Weeks 11-13)
- **Related Epics / ADRs**: ROADMAP Phase 3, evol-7, evol-7a
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7a (defineFeature, featureRegistry)
- **Downstream Tasks**: evol-8, evol-9

## Context

Declare BookingFeature via defineFeature and register it with featureRegistry. Completes evol-7 capability refactoring for booking. Depends on evol-7a.

## Dependencies

- evol-7a — defineFeature, featureRegistry available

## Related Files

- `packages/features/src/booking/capability.ts` – create
- `packages/features/src/booking/index.ts` – register BookingFeature

## Acceptance Criteria

- [ ] BookingFeature declares provides: { sections, integrations, dataContracts }
- [ ] configSchema for validation
- [ ] onActivate lifecycle
- [ ] featureRegistry.register(BookingFeature) at build/load time
- [ ] Update inf-14 to reference evol-7
- [ ] Unit tests for BookingFeature registration

## Implementation Plan

- [ ] Create booking/capability.ts with BookingFeature = defineFeature({ ... })
- [ ] Register in booking index or app bootstrap
- [ ] Add tests
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-8 can reference 'booking' capability from site.config
