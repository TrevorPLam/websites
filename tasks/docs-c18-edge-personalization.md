# docs-C18 Add edge-personalization.md

## Metadata

- **Task ID**: docs-c18-edge-personalization
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.18]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C.18 (infra/edge)
- **Downstream Tasks**: Edge adoption

## Context

Add docs/architecture/edge-personalization.md per THEGOAL [C.18]. Documents edge variant selection, tenant-experiment-context, cache-safe keys, integration with middleware.

## Dependencies

- **Upstream Task**: C.18 – optional (can document planned design)

## Cross-Task Dependencies & Sequencing

- **Upstream**: C.18
- **Downstream**: Edge adoption

## Research

- **Primary topics**: [R-EDGE](RESEARCH-INVENTORY.md#r-edge-edge-middleware-personalization), [R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration). THEGOAL [C.18].
- **[2026-02] Edge personalization**: Edge context, variant selection, tenant-experiment-context, cache-safe keys, middleware.
- **References**: [RESEARCH-INVENTORY.md – R-EDGE](RESEARCH-INVENTORY.md#r-edge-edge-middleware-personalization), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `docs/architecture/edge-personalization.md` – create
- `packages/infra/edge/` – reference

## Acceptance Criteria

- [ ] Document covers: edge context, variant selection, middleware integration
- [ ] References tenant-experiment-context
- [ ] validate-docs passes

## Implementation Plan

- [ ] Create edge-personalization.md
- [ ] Run pnpm validate-docs

## Sample code / examples

- **edge-personalization.md**: Sections for edge context, variant selection, middleware integration, tenant-experiment-context, cache-safe keys.

## Testing Requirements

- Run `pnpm validate-docs`.

## Execution notes

- **Related files — current state:** docs/edge-personalization.md or similar — to be created. Edge personalization; align with c-18, R-EDGE.
- **Potential issues / considerations:** Cross-reference c-18 task; run validate-docs.
- **Verification:** Doc created; `pnpm validate-docs` passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Documentation created
- [ ] validate-docs passes
