# INF-5 Marketing Component Family Registry

## Metadata

- **Task ID**: inf-5-marketing-component-family-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.x (marketing components)
- **Downstream Tasks**: INF-7, INF-8

## Context

Pluggable families: register new families (e.g. events, careers, partners) via config or package discovery. Section adapters resolve families by ID. Add new component families without modifying registry.

## Dependencies

- **Upstream Task**: 2.x – marketing-components exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.x
- **Downstream**: INF-7, INF-8

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-MARKETING](RESEARCH-INVENTORY.md#r-marketing-hero-menu-pricing-testimonials-faq-sections). Pluggable families.
- **[2026-02] Family registry**: Discoverable by ID; config or convention; section adapters resolve with fallback; document how to add families.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).

## Related Files

- `packages/marketing-components/src/` – modify – Family registry
- `packages/page-templates/src/sections/` – modify – Resolve by family ID
- `packages/types/src/site-config.ts` – modify – Family config

## Acceptance Criteria

- [ ] Component families discoverable by ID (e.g. hero, services, events)
- [ ] New family can be added without editing section adapter switch
- [ ] Config or convention defines family → component mapping
- [ ] Section registry can resolve custom family IDs with fallback
- [ ] Document how to add new families

## Technical Constraints

- Convention over configuration: package structure defines families
- Optional: explicit family registry in config

## Implementation Plan

- [ ] Define family registry interface
- [ ] Implement discovery (file-system or config)
- [ ] Update section adapters to use registry
- [ ] Document family addition workflow
- [ ] Add tests

## Sample code / examples

- **Family registry**: Map family ID to component module; discovery via package structure or config; section adapter calls registry.resolve(familyId).

## Testing Requirements

- Unit tests for registry resolution; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; marketing component family registry — @repo/marketing-components; align with validate-marketing-exports.
- **Potential issues / considerations:** Config-driven; no breaking changes; family/variant discovery.
- **Verification:** Build passes; tests pass; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
