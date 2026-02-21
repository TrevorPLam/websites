# 6-9c Update Docs for Current page-templates State

## Metadata

- **Task ID**: 6-9c-update-docs-page-templates-state
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 6-9, documentation accuracy
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-9
- **Downstream Tasks**: Documentation accuracy

## Context

Update README, docs/architecture/README.md, and any docs that claim "all page templates render NotImplementedPlaceholder". Registry and sections now wire real components; docs may be stale.

## Dependencies

- **Upstream Task**: 6-9

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-9
- **Downstream**: Documentation accuracy

## Research

- **Primary topics**: [R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration).
- **[2026-02] Doc accuracy**: README and docs/architecture must match current registry/sections; remove claims about NotImplementedPlaceholder for page-templates.
- **References**: [RESEARCH-INVENTORY.md – R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration), [docs/DOCUMENTATION_STANDARDS.md](../docs/DOCUMENTATION_STANDARDS.md).

## Related Files

- `README.md` – modify
- `docs/architecture/README.md` – modify
- Any docs referencing NotImplementedPlaceholder or "scaffolded only" for page-templates

## Acceptance Criteria

- [x] README accurately describes page-templates (registry + sections)
- [x] docs/architecture/README.md layer table updated
- [x] No false claims about NotImplementedPlaceholder for page-templates
- [x] validate-docs passes

## Implementation Plan

- [x] Grep for NotImplementedPlaceholder, "scaffolded", page-templates claims
- [x] Update each reference to reflect current state
- [x] Run validate-docs

## Sample code / examples

- **Grep**: `rg "NotImplementedPlaceholder|scaffolded only" docs/ README.md`; update each to reflect current page-templates state (registry + real sections).

## Testing Requirements

- Run `pnpm validate-docs`.

## Execution notes

- **Related files — current state:** `README.md`, `docs/architecture/README.md` — exist; may still say "scaffolded only" or reference NotImplementedPlaceholder. Grep docs for outdated page-templates claims.
- **Potential issues / considerations:** Align wording with current page-templates (registry + real sections); avoid breaking doc links.
- **Verification:** `pnpm validate-docs`.

## Definition of Done

- [x] Code reviewed and approved
- [x] Documentation updated
- [x] validate-docs passes
