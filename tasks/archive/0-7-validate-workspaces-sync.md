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

`pnpm validate:workspaces` exits 1 when package.json workspaces and pnpm-workspace.yaml are out of sync. package.json may omit packages/ai-platform/_, packages/content-platform/_, packages/marketing-ops/_, packages/infrastructure/_, tooling/\*. Ensure both files list the same workspace globs.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: CI

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), pnpm workspace contract.
- **[2026-02] pnpm workspaces**: `pnpm-workspace.yaml` defines `packages:` globs; root `package.json` may have a `workspaces` field. Both must list the same roots so install and scripts see all packages.
- **[2026-02] CLAUDE.md**: "Workspace sync: package.json workspaces must match pnpm-workspace.yaml (run pnpm validate:workspaces). Currently out of sync."
- **References**: [pnpm workspaces](https://pnpm.io/workspaces), [CLAUDE.md](../CLAUDE.md), [scripts/validate-workspaces.js](../scripts/validate-workspaces.js) (or .ts).

## Related Files

- `package.json` – modify – workspaces array
- `pnpm-workspace.yaml` – modify – packages array
- `scripts/validate-workspaces.js` – reference – Validation logic

## Acceptance Criteria

- [ ] package.json workspaces and pnpm-workspace.yaml packages are consistent
- [ ] All workspace packages (packages/_, packages/config/_, packages/integrations/_, packages/features/_, packages/ai-platform/_, packages/content-platform/_, packages/marketing-ops/_, packages/infrastructure/_, clients/_, tooling/_) are represented
- [ ] `pnpm validate:workspaces` passes

## Technical Constraints

- pnpm-workspace.yaml uses globs; package.json workspaces must match
- Adding new workspace roots requires updating both

## Implementation Plan

- [ ] Compare package.json workspaces vs pnpm-workspace.yaml
- [ ] Add any missing globs to package.json (or remove from pnpm-workspace if not desired)
- [ ] Run validate:workspaces and fix until pass

## Sample code / examples

- **package.json workspaces** must mirror pnpm-workspace.yaml globs (e.g. `packages/*`, `clients/*`, `tooling/*`). Check scripts/validate-workspaces for exact comparison logic.
  ```json
  "workspaces": ["packages/*", "packages/integrations/*", "clients/*", "tooling/*"]
  ```
- Run `pnpm validate:workspaces` after edits to confirm pass.

## Testing Requirements

- Run `pnpm validate:workspaces` to verify

## Execution notes

- **Related files — current state:** `package.json` — workspaces array present; `pnpm-workspace.yaml` — packages list present; `scripts/validate-workspaces.js` — exists and compares both. Current repo lists match (packages/_, clients/_, tooling/\*, etc.). If script fails, check for glob or quoting differences.
- **Potential issues / considerations:** CLAUDE.md says "currently out of sync" — confirm whether script passes now or if missing/extra globs cause failure; adding new workspace roots requires updating both files.
- **Verification:** `pnpm validate:workspaces`.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] validate:workspaces passes
