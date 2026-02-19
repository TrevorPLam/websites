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

## Cross-Task Dependencies & Sequencing

- **Upstream**: 3.x
- **Downstream**: Custom layouts

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Layout registry.
- **[2026-02] Layout registry**: Map layout ID to template; site.config or route config; custom layouts; default for unknown.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).

## Advanced Code Pattern Expectations (2026-02-19)

From [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](../docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md) and [TODO.md](../TODO.md):

- **SlotProvider**: Use `@repo/infrastructure-ui` SlotProvider for slot-based composition; page-templates should add this dependency.
- **Root vs [locale] layout**: Root layout has ConsentProvider; [locale] layout has NextIntlClientProvider; provider composition applies to [locale] only.

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

## Sample code / examples

- **Registry**: layoutRegistry.get(id) returns template component; route or config supplies layout ID; fallback to default layout.

## Testing Requirements

- Unit tests for layout resolution; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; layout template registry — @repo/page-templates or similar; align with existing composePage/getSectionsForPage.
- **Potential issues / considerations:** No breaking changes; config-driven layout selection.
- **Verification:** Build passes; tests pass; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
