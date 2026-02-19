# 6-9a Remove NotImplementedPlaceholder if Unused

## Metadata

- **Task ID**: 6-9a-remove-not-implemented-placeholder
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 6-9 dead code
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-9
- **Downstream Tasks**: 6-9 complete

## Context

NotImplementedPlaceholder exists in packages/page-templates but has no imports. Remove if confirmed unused; or document if retained for future use.

## Dependencies

- **Upstream Task**: 6-9

## Related Files

- `packages/page-templates/src/NotImplementedPlaceholder.tsx` – delete or retain
- Grep for imports – verify none

## Acceptance Criteria

- [ ] Grep confirms no imports of NotImplementedPlaceholder
- [ ] File removed OR documented as intentionally retained
- [ ] No broken references
- [ ] Build and tests pass

## Implementation Plan

- [ ] Grep for NotImplementedPlaceholder imports
- [ ] If unused: delete file, update any index exports
- [ ] If retained: add comment explaining why
- [ ] Run build and tests

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Dead code removed or documented
- [ ] Build passes
