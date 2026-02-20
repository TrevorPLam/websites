# EVOL-7a defineFeature + featureRegistry (Infra)

## Metadata

- **Task ID**: evol-7a-define-feature-infra
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 3 (Weeks 11-13)
- **Related Epics / ADRs**: ROADMAP Phase 3, evol-7, inf-14
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-3, evol-5, evol-6
- **Downstream Tasks**: evol-7b, evol-8

## Context

Create defineFeature and featureRegistry in @repo/infra/features. Provides the capability declaration and registration API; evol-7b will implement BookingFeature using it. Per ROADMAP Phase 3 Weeks 11-13.

## Dependencies

- evol-3 (registry metadata), evol-5 (booking canonical), evol-6 (integration registry)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **References**: ROADMAP Phase 3, inf-14.

## Related Files

- `packages/infra/features/` or `packages/infra/src/features/` – create
- Package exports for defineFeature, featureRegistry

## Acceptance Criteria

- [ ] defineFeature({ id, version, provides, configSchema, onActivate }) API
- [ ] featureRegistry.register(Feature)
- [ ] featureRegistry.get(id), list, resolve for site.config
- [ ] Document how to add new capability
- [ ] Unit tests for defineFeature and featureRegistry

## Implementation Plan

- [ ] Create @repo/infra/features package or module
- [ ] Implement defineFeature
- [ ] Implement featureRegistry
- [ ] Export from @repo/infra
- [ ] Add tests
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-7b can register BookingFeature
