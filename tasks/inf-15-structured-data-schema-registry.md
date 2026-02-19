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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
- [ ] JSON-LD validates
