# INF-15 Structured Data Schema Registry

## Metadata

- **Task ID**: inf-15-structured-data-schema-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 4-6 (industry-schemas)
- **Downstream Tasks**: Custom JSON-LD

## Context

Extend industry-schemas to accept custom schema types. Generate JSON-LD from config-defined types. Infinite schema.org variants.

## Dependencies

- **Upstream Task**: 4-6 – industry-schemas exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 4-6
- **Downstream**: Custom JSON-LD

## Research

- **Primary topics**: [R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry-json-ld-industry-patterns), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Schema.org, JSON-LD.
- **[2026-02] Schema registry**: schemaType custom string; custom template/override; generateOrganizationJsonLd etc. use config; fallback for unknown.
- **References**: [RESEARCH-INVENTORY.md – R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry-json-ld-industry-patterns).

## Related Files

- `packages/industry-schemas/` – modify
- `packages/types/src/site-config.ts` – modify – schemaType config
- `docs/configuration/site-config-reference.md` – update

## Acceptance Criteria

- [ ] schemaType accepts custom string beyond predefined
- [ ] Custom schema type can provide template or override
- [ ] generateOrganizationJsonLd (and others) use config schemaType
- [ ] Fallback for unknown types
- [ ] Document how to add custom schema type

## Technical Constraints

- Schema.org types
- Valid JSON-LD output

## Implementation Plan

- [ ] Extend schemaType in config
- [ ] Add schema registry or override map
- [ ] Update industry-schemas to use custom types
- [ ] Document
- [ ] Add tests

## Sample code / examples

- **schemaType**: Extend config; schema registry or override map; industry-schemas use custom types; output valid JSON-LD.

## Testing Requirements

- Unit tests; JSON-LD validation; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; structured data schema registry — JSON-LD schemas; @repo/industry-schemas or types.
- **Potential issues / considerations:** No breaking changes; validate JSON-LD output; align with industry schemas.
- **Verification:** Build passes; tests pass; docs updated; JSON-LD validates.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
- [ ] JSON-LD validates
