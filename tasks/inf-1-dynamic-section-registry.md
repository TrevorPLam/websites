# INF-1 Dynamic Section Registry

## Metadata

- **Task ID**: inf-1-dynamic-section-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 3.1, 3.2
- **Downstream Tasks**: INF-2, INF-5, INF-8

## Context

Allow site.config to register custom section IDs that resolve to components at runtime. Extend getSectionsForPage to accept config-defined sections. Today sections are hardcoded in registry.ts; infinite sections require config-driven registration.

## Dependencies

- **Upstream Task**: 3.1, 3.2 – registry and sections exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 3.1, 3.2
- **Downstream**: INF-2, INF-5, INF-8

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod).
- **[2026-02] Config-driven registries**: site.config sections array overrides default getSectionsForPage; section IDs map to registry; unknown IDs fallback (skip or placeholder). No breaking change to existing flow.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [packages/page-templates/src/registry.ts](../packages/page-templates/src/registry.ts), [packages/types/src/site-config.ts](../packages/types/src/site-config.ts).

## Related Files

- `packages/page-templates/src/registry.ts` – modify
- `packages/types/src/site-config.ts` – modify – Add sections config
- `packages/page-templates/src/types.ts` – modify

## Acceptance Criteria

- [ ] site.config can define custom sections array (e.g. sections: ['hero-custom', 'cta'])
- [ ] getSectionsForPage uses config.sections when provided
- [ ] Unknown section IDs fall back gracefully (skip or placeholder)
- [ ] composePage resolves config-defined sections
- [ ] No breaking change to existing section flow

## Technical Constraints

- Section IDs must map to registered components
- Config sections override getSectionsForPage defaults when present

## Implementation Plan

- [ ] Add optional sections to SiteConfig (or page-level config)
- [ ] Update composePage to prefer config sections
- [ ] Document config-driven sections
- [ ] Add tests

## Sample code / examples

- **SiteConfig**: Add optional `sections?: string[]`. **getSectionsForPage**: When config.sections present, use it; resolve each ID via registry; skip or placeholder unknown. **composePage**: Prefer config sections over defaults.

## Testing Requirements

- Unit tests for getSectionsForPage with config.sections; test unknown ID fallback.

## Execution notes

- **Related files — current state:** See task Related Files; dynamic section registry — extend existing registries or add new one; config-driven.
- **Potential issues / considerations:** No breaking changes to current flow; align with page-templates and site.config section composition.
- **Verification:** Build passes; tests pass; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
