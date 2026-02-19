# C.18 Add infra/edge (Edge Middleware Primitives)

## Metadata

- **Task ID**: c-18-infra-edge
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.18], edge personalization
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C.8 (experiments)
- **Downstream Tasks**: Edge personalization, tenant routing

## Context

Add packages/infra/edge/ with tenant-experiment-context.ts for edge variant selection and cache-safe keys. Enables experiment assignment and personalization at the edge.

## Dependencies

- **Upstream Task**: C.8 – experiments (optional but recommended)
- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: C.8 optional
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: docs/architecture/edge-personalization.md

## Research

- **Primary topics**: [R-EDGE](RESEARCH-INVENTORY.md#r-edge-edge-middleware-personalization). THEGOAL [C.18].
- **[2026-02] Edge primitives**: tenant-experiment-context for variant selection; cache-safe keys; Edge Runtime only; no Node APIs.
- **References**: [RESEARCH-INVENTORY.md – R-EDGE](RESEARCH-INVENTORY.md#r-edge-edge-middleware-personalization), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/infra/edge/tenant-experiment-context.ts` – create
- `packages/infra/index.client.ts` or `index.ts` – modify – Export (client-safe)
- `docs/architecture/edge-personalization.md` – create or update

## Acceptance Criteria

- [ ] tenant-experiment-context: edge variant selection logic
- [ ] Cache-safe keys for experiment assignment
- [ ] Export from @repo/infra (client-safe path if needed)
- [ ] Document edge personalization flow

## Technical Constraints

- Must run in Edge Runtime (Next.js middleware, Vercel Edge)
- No Node.js-only APIs

## Implementation Plan

- [ ] Create edge directory
- [ ] Implement tenant-experiment-context
- [ ] Add to infra exports
- [ ] Document

## Sample code / examples

- **tenant-experiment-context.ts**: getVariant(experimentId, context) with cache-safe keys; export from infra (client-safe); document edge flow.

## Testing Requirements

- Unit tests where possible; edge context may need integration tests

## Execution notes

- **Related files — current state:** infra/edge (Edge Middleware Primitives) — to be created or extended. R-EDGE; align with docs-c18-edge-personalization.
- **Potential issues / considerations:** Next.js middleware; personalization/variant selection at edge; document in docs.
- **Verification:** Build passes; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Exported from infra
- [ ] Documentation updated
- [ ] Build passes
