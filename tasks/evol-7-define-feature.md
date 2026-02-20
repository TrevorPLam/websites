# EVOL-7 Feature → Capability Refactoring (defineFeature) (Umbrella)

## Metadata

- **Task ID**: evol-7-define-feature
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 3 (Weeks 11-13)
- **Related Epics / ADRs**: ROADMAP Phase 3, inf-14
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-3, evol-5, evol-6, inf-14
- **Downstream Tasks**: evol-8, evol-9
- **Sub-tasks**: [evol-7a](evol-7a-define-feature-infra.md) (defineFeature + featureRegistry), [evol-7b](evol-7b-booking-feature-registration.md) (BookingFeature registration)

## Context

Umbrella for capability refactoring. **Execute in order:** evol-7a (defineFeature, featureRegistry in @repo/infra/features) then evol-7b (BookingFeature declaration and registration). Features declare provides (sections, integrations, dataContracts), configSchema, onActivate. Per ROADMAP Phase 3 Weeks 11-13. Evolves inf-14 (feature plugin) into capability pattern.

## Dependencies

- evol-3 (registry metadata), evol-5 (booking canonical), evol-6 (integration registry)
- inf-14 (feature plugin interface) — evolve

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability) (to add), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** defineFeature evolves from registry patterns; self-declaring features.
- **References**: ROADMAP Phase 3 Weeks 11-13, inf-14.

## Related Files

- `packages/infra/features/` – create (or packages/infra/src/features/)
- `packages/features/src/booking/capability.ts` – create (BookingFeature)
- `packages/features/src/booking/index.ts` – register BookingFeature

## Acceptance Criteria (covered by sub-tasks)

- [ ] evol-7a: defineFeature, featureRegistry, document how to add capability
- [ ] evol-7b: BookingFeature declares provides, configSchema, onActivate; registered at build time
- [ ] Update inf-14 to reference evol-7

## Technical Constraints

- Create packages/infra/features or add to @repo/infra
- provides: sections, integrations, dataContracts arrays

## Implementation Plan

- [ ] Complete [evol-7a](evol-7a-define-feature-infra.md)
- [ ] Complete [evol-7b](evol-7b-booking-feature-registration.md)
- [ ] Update inf-14 to reference evol-7

## Sample code / examples

```typescript
// packages/features/src/booking/capability.ts
export const BookingFeature = defineFeature({
  id: 'booking',
  version: '2.0.0',
  provides: {
    sections: ['booking-calendar', 'service-list'],
    integrations: ['calendly', 'acuity', 'native'],
    dataContracts: ['booking', 'service', 'availability'],
  },
  configSchema: z.object({
    provider: z.enum(['calendly', 'acuity', 'native']),
    services: z.array(ServiceSchema),
  }),
  async onActivate(config, context) {
    /* validate provider; init storage; register sections */
  },
});
featureRegistry.register(BookingFeature);
```

## Testing Requirements

- Unit tests for defineFeature, featureRegistry; BookingFeature registration.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
