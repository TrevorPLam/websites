# docs-README Update README with Architecture Diagram

## Metadata

- **Task ID**: docs-readme-architecture-diagram
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [6.3]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Contributor onboarding

## Context

Update README.md with final architecture diagram per THEGOAL [6.3]. High-level view of packages, layers, clients, and config flow.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Contributor onboarding

## Research

- **Primary topics**: [R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration). THEGOAL [6.3].
- **[2026-02] Architecture diagram**: README diagram (mermaid or image); packages, layers, clients, site.config flow; align with docs/architecture/README.md.
- **References**: [RESEARCH-INVENTORY.md – R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `README.md` – modify
- `docs/architecture/README.md` – reference

## Acceptance Criteria

- [ ] README includes architecture diagram (mermaid or image)
- [ ] Shows: packages layers, clients, site.config flow
- [ ] Aligns with docs/architecture/README.md and THEGOAL

## Implementation Plan

- [ ] Add or update diagram in README
- [ ] Ensure diagram renders correctly

## Sample code / examples

- **README.md**: Insert mermaid flowchart or image; nodes for packages, clients, site.config; link to docs/architecture/README.md.

## Testing Requirements

- View README in editor or GitHub; confirm diagram renders.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] README updated with diagram
