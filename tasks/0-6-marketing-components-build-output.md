# 0.6 Fix @repo/marketing-components Build Output

## Metadata

- **Task ID**: 0-6-marketing-components-build-output
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: TBD
- **Related Epics / ADRs**: Turbo pipeline, THEGOAL
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Build pipeline

## Context

@repo/marketing-components build script is `"build": "echo build complete"`. Turbo expects outputs `[".next/**", "dist/**", "build/**"]`. No such files are produced. Turbo warns: no output files found. Either add real build output (e.g. tsc emit, bundle) or adjust turbo.json outputs for this package.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Build pipeline

## Research

- **Primary topics**: [R-PERF](RESEARCH-INVENTORY.md#r-perf-lcp-inp-cls-bundle-budgets) (build/bundle), Turborepo outputs.
- **[2026-02] Turborepo**: Pipeline tasks declare `outputs` (e.g. `[".next/**", "dist/**"]`); if a package produces no files matching outputs, Turbo may warn. Source-only packages can use `outputs: []` or a sentinel file.
- **[2026-02] Best practice**: Either emit real output (tsc, bundle) or explicitly set package-specific `outputs` in turbo.json so the pipeline is deterministic.
- **References**: [RESEARCH-INVENTORY.md – R-PERF](RESEARCH-INVENTORY.md#r-perf-lcp-inp-cls-bundle-budgets), [turbo.json](../turbo.json), [CLAUDE.md](../CLAUDE.md).

## Related Files

- `packages/marketing-components/package.json` – modify – Build script
- `packages/marketing-components/tsconfig.json` – reference – Build config
- `turbo.json` – modify – Optionally adjust outputs for marketing-components

## Acceptance Criteria

- [ ] Package produces build output OR turbo config excludes/outputs adjusted
- [ ] No Turbo "no output files found" warning for @repo/marketing-components
- [ ] `pnpm build` completes successfully

## Technical Constraints

- Marketing-components may be source-only (no compiled output); if so, adjust Turbo config
- Other packages depend on it; ensure imports still resolve

## Implementation Plan

- [ ] Option A: Add tsc/build step that emits to dist/
- [ ] Option B: Add turbo.json override for this package (e.g. outputs: [] or different pattern)
- [ ] Verify build pipeline

## Sample code / examples

- **turbo.json package override** (if source-only): In turbo.json, add a target override for `@repo/marketing-components` so outputs match reality (e.g. empty or a single sentinel).
  ```json
  "//@repo/marketing-components": { "outputs": [] }
  ```
- **Real build**: If adding tsc emit, use `packages/marketing-components/tsconfig.json` with `"outDir": "dist"` and script `"build": "tsc"`.

## Testing Requirements

- Run `pnpm build` to verify

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Build passes
- [ ] No Turbo warnings
