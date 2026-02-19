# 0.7 Resolve validate-workspaces Pass/Fail

## Metadata

- **Task ID**: 0-7-validate-workspaces-sync
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: TBD
- **Related Epics / ADRs**: Monorepo integrity
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: CI quality gates

## Context

`pnpm validate:workspaces` exits 1 when package.json workspaces and pnpm-workspace.yaml are out of sync. package.json may omit packages/ai-platform/*, packages/content-platform/*, packages/marketing-ops/*, packages/infrastructure/*, tooling/*. Ensure both files list the same workspace globs.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: CI

## Related Files

- `package.json` – modify – workspaces array
- `pnpm-workspace.yaml` – modify – packages array
- `scripts/validate-workspaces.js` – reference – Validation logic

## Acceptance Criteria

- [ ] package.json workspaces and pnpm-workspace.yaml packages are consistent
- [ ] All workspace packages (packages/*, packages/config/*, packages/integrations/*, packages/features/*, packages/ai-platform/*, packages/content-platform/*, packages/marketing-ops/*, packages/infrastructure/*, clients/*, tooling/*) are represented
- [ ] `pnpm validate:workspaces` passes

## Technical Constraints

- pnpm-workspace.yaml uses globs; package.json workspaces must match
- Adding new workspace roots requires updating both

## Implementation Plan

- [ ] Compare package.json workspaces vs pnpm-workspace.yaml
- [ ] Add any missing globs to package.json (or remove from pnpm-workspace if not desired)
- [ ] Run validate:workspaces and fix until pass

## Testing Requirements

- Run `pnpm validate:workspaces` to verify

## Definition of Done

- [ ] Code reviewed and approved
- [ ] validate:workspaces passes
