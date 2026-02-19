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

## Related Files

- Various docs, RESEARCH.md, task files – audit – Grep for templates/ refs

## Acceptance Criteria

- [ ] Grep for `templates/hair-salon`, `templates/shared`, `templates/` returns 0 unintended references (or all updated)
- [ ] File reference guides, RESEARCH.md, task prompts updated to cite clients/ or packages/ instead
- [ ] No broken documentation links to deleted paths

## Technical Constraints

- .kiro/specs/templates/ is for spec templates, not site templates – exclude from changes
- docs/templates/ may contain test templates – verify before changing

## Implementation Plan

- [ ] Run grep for templates/hair-salon, templates/shared
- [ ] Update or remove each reference
- [ ] Validate docs

## Testing Requirements

- Run `pnpm validate-docs` if applicable

## Definition of Done

- [ ] Code reviewed and approved
- [ ] No stale templates/ references
