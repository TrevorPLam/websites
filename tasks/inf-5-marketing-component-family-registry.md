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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
