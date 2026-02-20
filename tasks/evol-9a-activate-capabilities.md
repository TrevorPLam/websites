# EVOL-9a activateCapabilities + CapabilityProvider

## Metadata

- **Task ID**: evol-9a-activate-capabilities
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 4 (Weeks 17-19)
- **Related Epics / ADRs**: ROADMAP Phase 4, evol-9, evol-8
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7, evol-8
- **Downstream Tasks**: evol-9b

## Context

Implement activateCapabilities(siteConfig.capabilities) and CapabilityProvider context. Resolves capability IDs to feature instances and provides them to the tree. Part of evol-9; evol-9b will consume these for UniversalPage. Per ROADMAP Phase 4 Weeks 17-19.

## Dependencies

- evol-7 (featureRegistry), evol-8 (capabilities in site.config)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **References**: ROADMAP Phase 4, [packages/page-templates/](../packages/page-templates/).

## Related Files

- `packages/page-templates/src/activate-capabilities.ts` – create
- `packages/page-templates/src/CapabilityProvider.tsx` – create
- `packages/types/src/site-config.ts` – add renderer?: 'classic' | 'universal'

## Acceptance Criteria

- [ ] activateCapabilities(capabilityConfigs) returns resolved capability instances
- [ ] CapabilityProvider provides capabilities to React tree
- [ ] renderer: 'universal' in SiteConfig (opt-in)
- [ ] Tests for activation and provider

## Implementation Plan

- [ ] Add renderer to SiteConfig type
- [ ] Create activateCapabilities (async resolve from featureRegistry)
- [ ] Create CapabilityProvider (React context)
- [ ] Add tests
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-9b can use activateCapabilities + CapabilityProvider in UniversalPage
