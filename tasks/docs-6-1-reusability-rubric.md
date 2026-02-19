# docs-6-1 Add reusability-rubric.md

## Metadata

- **Task ID**: docs-6-1-reusability-rubric
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 6-1 referenced
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Component migration decisions

## Context

Add docs/reusability-rubric.md. Task 6-1 referenced this; defines when a component is config-driven, has no industry logic, and is suitable for @repo/marketing-components.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Component migration decisions

## Research

- **Primary topics**: [R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration), [docs/6-1-reusability-rubric](docs/6-1-reusability-rubric).
- **[2026-02] Reusability rubric**: Config-driven, no industry logic, marketing-components API; guides migration decisions.
- **References**: [RESEARCH-INVENTORY.md – R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration).

## Related Files

- `docs/reusability-rubric.md` – create

## Acceptance Criteria

- [ ] Rubric defines: config-driven, no industry logic, marketing-components API
- [ ] Usable for component migration decisions
- [ ] validate-docs passes

## Implementation Plan

- [ ] Create reusability-rubric.md
- [ ] Run pnpm validate-docs

## Sample code / examples

- **docs/reusability-rubric.md**: Criteria for config-driven, no industry logic, marketing-components suitability; checklist for migration.

## Testing Requirements

- Run `pnpm validate-docs`.

## Execution notes

- **Related files — current state:** docs/reusability-rubric.md or similar — to be created. Reusability criteria for components/features.
- **Potential issues / considerations:** Run `pnpm validate-docs` after creating doc; follow doc standards (file header, etc.).
- **Verification:** Documentation created; `pnpm validate-docs` passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Documentation created
- [ ] validate-docs passes
