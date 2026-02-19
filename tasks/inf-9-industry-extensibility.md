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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
