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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Documentation created
- [ ] validate-docs passes
