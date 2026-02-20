# EVOL-8 Site Config → Capability Activation

## Metadata

- **Task ID**: evol-8-site-config-capability-activation
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 3 (Weeks 14-16)
- **Related Epics / ADRs**: ROADMAP Phase 3, ADR-0006 (CaCA)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7
- **Downstream Tasks**: evol-9, evol-11

## Context

Extend site.config.ts with capabilities array and pages.home sections referencing capability. Per ROADMAP Phase 3 Weeks 14-16. Extends CaCA (ADR-0006); defineSiteConfig and Zod schema updated.

## Dependencies

- evol-7 (defineFeature, featureRegistry)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod).
- **[2026-02]** capabilities: [{ id, enabled, config }]; pages.home: [{ section, capability?, config }].
- **References**: ROADMAP Phase 3 Weeks 14-16, [packages/types/src/site-config.ts](../packages/types/src/site-config.ts).

## Related Files

- `packages/types/src/site-config.ts` – modify (capabilities, pages)
- `packages/types/src/site-config.schema.ts` – modify (Zod)
- `clients/starter-template/site.config.ts` – migrate to capabilities
- `docs/configuration/site-config-reference.md` – update

## Acceptance Criteria

- [ ] SiteConfig has capabilities?: CapabilityConfig[]
- [ ] SiteConfig has pages?: { home: PageSectionConfig[] }
- [ ] PageSectionConfig: section, capability?, config?
- [ ] defineSiteConfig accepts and validates
- [ ] Zod schema updated
- [ ] starter-template migrated to capabilities structure
- [ ] site-config-reference.md updated

## Technical Constraints

- Backward compatibility: legacy features array can coexist or migrate via evol-11
- CapabilityConfig: { id, enabled, config }

## Implementation Plan

- [ ] Add capabilities and pages to SiteConfig type
- [ ] Add Zod schema for capabilities, pages
- [ ] Update defineSiteConfig (if exists)
- [ ] Migrate starter-template site.config
- [ ] Update site-config-reference.md
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
capabilities: [
  { id: 'booking', enabled: true, config: { provider: 'native', services: [...] } },
  { id: 'blog', enabled: true, config: { postsPerPage: 10 } },
],
pages: {
  home: [
    { section: 'hero', config: {...} },
    { section: 'service-list', capability: 'booking' },
    { section: 'booking-calendar', capability: 'booking', config: {...} },
  ],
},
```

## Testing Requirements

- Config validation tests; client validation script passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
