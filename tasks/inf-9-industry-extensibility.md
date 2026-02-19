# INF-9 Industry Extensibility

## Metadata

- **Task ID**: inf-9-industry-extensibility
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 4-6 (industry-schemas)
- **Downstream Tasks**: Custom industries

## Context

Allow custom industry identifiers beyond the 12. Industry config as optional override or plugin. schemaType from config. Support industries not in the core 12.

## Dependencies

- **Upstream Task**: 4-6 – industry-schemas exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 4-6
- **Downstream**: Custom industries

## Research

- **Primary topics**: [R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry-json-ld-industry-patterns), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Custom industry beyond core 12.
- **[2026-02] Industry extensibility**: industry as string or union; custom config override; schemaType for JSON-LD; getIndustryConfig fallback.
- **References**: [RESEARCH-INVENTORY.md – R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry-json-ld-industry-patterns).

## Related Files

- `packages/types/src/industry-configs.ts` – modify
- `packages/types/src/site-config.ts` – modify – industry union
- `packages/industry-schemas/` – modify – Custom industry support

## Acceptance Criteria

- [ ] industry accepts extended union or string (custom)
- [ ] Custom industry can provide config override
- [ ] schemaType from config for JSON-LD
- [ ] getIndustryConfig falls back for custom industries
- [ ] Document how to add custom industry

## Technical Constraints

- Core 12 remain; custom extends
- Fallback to 'general' or similar for unknown

## Implementation Plan

- [ ] Extend industry type (string | predefined)
- [ ] Add custom industry config resolution
- [ ] Update industry-schemas for custom schemaType
- [ ] Document
- [ ] Add tests

## Sample code / examples

- **industry-configs**: Extend type; resolve custom industry; fallback to 'general'. schemaType from config for JSON-LD.

## Testing Requirements

- Unit tests for custom industry resolution; build pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
