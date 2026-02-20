# EVOL-3 Registry Hardening with Capability Metadata

## Metadata

- **Task ID**: evol-3-registry-capability-metadata
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 1 (Weeks 3-4)
- **Related Epics / ADRs**: NEW.md Phase 1, inf-1
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: inf-1, evol-1
- **Downstream Tasks**: evol-7, evol-8

## Context

Extend SectionDefinition in page-templates registry with capability-like metadata. Enables feature-aware section composition and prepares for capability registry (Phase 3). Per NEW.md Weeks 3-4.

## Dependencies

- inf-1 (dynamic section registry) — SectionDefinition, registry exist
- site.config.features — used for isFeatureEnabled (or new utility)

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Optional metadata; no breaking changes. isFeatureEnabled derives from site.config.features or explicit feature check.
- **References**: [packages/page-templates/src/registry.ts](../packages/page-templates/src/registry.ts), NEW.md Week 3-4.

## Related Files

- `packages/page-templates/src/registry.ts` – modify
- `packages/page-templates/src/types.ts` – modify (SectionDefinition)
- `packages/types/src/site-config.ts` – reference (features)

## Acceptance Criteria

- [ ] SectionDefinition has optional requiredFeatures?, requiredData?, estimatedBundleSize?, validateConfig?
- [ ] register() validates requiredFeatures against isFeatureEnabled; console.warn if disabled
- [ ] resolveForSite(siteConfig) returns sections filtered by enabled features
- [ ] isFeatureEnabled source documented (site.config.features or utility)
- [ ] No breaking change to existing flow

## Technical Constraints

- Forward-compatible; all new fields optional
- isFeatureEnabled: derive from siteConfig.features or add minimal helper

## Implementation Plan

- [ ] Extend SectionDefinition in types.ts
- [ ] Add isFeatureEnabled helper (check siteConfig.features)
- [ ] Update register() with validation
- [ ] Add resolveForSite() method
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
interface SectionDefinition {
  id: string;
  component: React.ComponentType;
  variants: string[];
  requiredFeatures?: string[];
  requiredData?: string[];
  estimatedBundleSize?: number;
  validateConfig?: (config: unknown) => boolean;
}

resolveForSite(siteConfig: SiteConfig): SectionDefinition[] {
  return Array.from(this.sections.values())
    .filter(s => !s.requiredFeatures || s.requiredFeatures.every(f => isFeatureEnabled(f, siteConfig)));
}
```

## Testing Requirements

- Unit tests for resolveForSite; test requiredFeatures filtering.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
