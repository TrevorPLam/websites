# 6.1a Audit for Stale templates/ References

## Metadata

- **Task ID**: 6-1a-audit-stale-templates-references
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Cleanup, 6-1 replacement
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-1 (obsolete; templates/ already removed)
- **Downstream Tasks**: Documentation accuracy

## Context

Task 6-1 referenced templates/hair-salon; templates/ directory no longer exists. This task audits docs and code for stale references to `templates/hair-salon`, `templates/shared`, or `templates/` and updates or removes them.

## Dependencies

- **Upstream Task**: 6-1 obsolete – this replaces it

## Cross-Task Dependencies & Sequencing

- **Upstream**: None (6-1 archived)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Documentation accuracy

## Research

- **Primary topics**: [R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration), [R-MIGRATION](RESEARCH-INVENTORY.md#r-migration-template-to-client-migration-cutover).
- **[2026-02] templates/ removed**: 6-3 removed templates/; references should point to clients/ or packages/. Exclude .kiro/specs/templates/ and verify docs/templates/ before changing.
- **References**: [RESEARCH-INVENTORY.md – R-DOCS](RESEARCH-INVENTORY.md#r-docs-adrs-config-reference-migration), [RESEARCH-INVENTORY.md – R-MIGRATION](RESEARCH-INVENTORY.md#r-migration-template-to-client-migration-cutover).

## Related Files

- Various docs, RESEARCH.md, task files – audit – Grep for templates/ refs

## Acceptance Criteria

- [x] Grep for `templates/hair-salon`, `templates/shared`, `templates/` returns 0 unintended references (or all updated)
- [x] File reference guides, RESEARCH.md, task prompts updated to cite clients/ or packages/ instead
- [x] No broken documentation links to deleted paths

## Technical Constraints

- .kiro/specs/templates/ is for spec templates, not site templates – exclude from changes
- docs/templates/ may contain test templates – verify before changing

## Implementation Plan

- [x] Run grep for templates/hair-salon, templates/shared
- [x] Update or remove each reference
- [x] Validate docs

## Sample code / examples

- **Grep**: `rg "templates/hair-salon|templates/shared|templates/"` (exclude .kiro/specs/templates/ and known test paths); update each hit to clients/ or packages/ as appropriate.

## Testing Requirements

- Run `pnpm validate-docs` if applicable

## Execution notes

- **Related files — current state:** Various docs, RESEARCH-INVENTORY.md, task files — audit with grep for `templates/hair-salon`, `templates/shared`, `templates/`. Exclude .kiro/specs/templates/ and known test paths.
- **Potential issues / considerations:** Replace refs with clients/ or packages/ as appropriate; do not change .kiro/specs/templates/ (spec templates).
- **Verification:** Grep returns no unintended references; `pnpm validate-docs` if applicable.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] No stale templates/ references
