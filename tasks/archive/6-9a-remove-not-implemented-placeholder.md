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

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-9
- **Downstream**: 6-9 complete

## Research

- **Primary topics**: [R-CLEANUP](RESEARCH-INVENTORY.md#r-cleanup-dead-code-removal-dependency-pruning).
- **[2026-02] Dead code**: Remove unused components; grep for imports before delete; update index exports.
- **References**: [RESEARCH-INVENTORY.md – R-CLEANUP](RESEARCH-INVENTORY.md#r-cleanup-dead-code-removal-dependency-pruning).

## Related Files

- `packages/page-templates/src/NotImplementedPlaceholder.tsx` – delete or retain
- Grep for imports – verify none

## Acceptance Criteria

- [x] Grep confirms no imports of NotImplementedPlaceholder
- [x] File removed OR documented as intentionally retained
- [x] No broken references
- [x] Build and tests pass

## Implementation Plan

- [x] Grep for NotImplementedPlaceholder imports
- [x] If unused: delete file, update any index exports
- [x] If retained: add comment explaining why (N/A — file already removed)
- [x] Run build and tests

## Sample code / examples

- **Verify no imports**: `rg "NotImplementedPlaceholder" --type-add 'ts:*.ts' -t ts -t tsx` (or grep); remove from packages/page-templates index if exported.

## Testing Requirements

- Run `pnpm build`, `pnpm test` after removal.

## Execution notes

- **Related files — current state:** `packages/page-templates/src/NotImplementedPlaceholder.tsx` — exists; verify with grep that no imports reference it. Package index — check if exported.
- **Potential issues / considerations:** Grep for "NotImplementedPlaceholder" across repo before delete; if retained, add comment explaining why; update index exports if removed.
- **Verification:** `pnpm build`, `pnpm test` after removal.

## Definition of Done

- [x] Code reviewed and approved
- [x] Dead code removed or documented
- [x] Build passes
