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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
