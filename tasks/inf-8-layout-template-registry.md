# INF-8 Layout Template Registry

## Metadata

- **Task ID**: inf-8-layout-template-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 3.x (page templates)
- **Downstream Tasks**: Custom layouts

## Context

Beyond 7 fixed templates: register custom page layouts by ID. Page route maps to layout ID from config. Infinite page layout types.

## Dependencies

- **Upstream Task**: 3.x – page templates exist

## Related Files

- `packages/page-templates/src/registry.ts` – modify – Layout registry
- `packages/page-templates/src/templates/` – reference
- `packages/types/src/site-config.ts` – modify – Layout config
- `clients/*/app/` – modify – Route → layout mapping

## Acceptance Criteria

- [ ] Layout registry: map layout ID → template component
- [ ] site.config or route config can specify layout per page
- [ ] Custom layout can be registered (e.g. landing, checkout)
- [ ] Default layout for unknown routes
- [ ] Document how to add custom layouts

## Technical Constraints

- Layout = page template component
- Route config: page path → layout ID

## Implementation Plan

- [ ] Add layout registry to page-templates
- [ ] Define layout config schema
- [ ] Update client routes to use layout resolution
- [ ] Document
- [ ] Add tests

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
