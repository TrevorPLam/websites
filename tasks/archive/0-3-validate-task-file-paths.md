# 0.3 Validate Task File Paths (Script)

## Metadata

- **Task ID**: 0-3-validate-task-file-paths
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related**: Task Research Audit Phase 6
- **Upstream Tasks**: None

## Context

Tasks list "Related Files" with paths; some may be incomplete or reference non-existent paths. A script can parse task markdown and verify that file paths under "Related Files" exist (or are explicitly create/modify so missing is OK for create). Improves task accuracy and catches typos.

## Research & Evidence (Date-Stamped)

- **[2026-02-18] tasks/prompt.md**: Related Files should use full paths relative to repo root; purpose per file.
- **[2026-02-18] Phase 4**: Multiple tasks had incomplete paths (e.g. MenuGrid.tsx without package prefix); script would flag such patterns.

## Related Files

- `scripts/validate-task-paths.js` – create – parse tasks/*.md, extract Related Files, check existence or create/modify intent

## Acceptance Criteria

- [ ] Script runs (e.g. `node scripts/validate-task-paths.js` or `pnpm validate-task-paths`).
- [ ] Reports missing paths and optionally suggests fixes (e.g. add packages/marketing-components/ prefix).
- [ ] Does not require existing paths for lines marked "create".

## Definition of Done

- [ ] Script implemented and documented
- [ ] Optional: add to CI or pre-commit
