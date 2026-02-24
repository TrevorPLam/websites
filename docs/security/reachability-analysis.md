# Reachability Analysis for Dependency Findings

This document defines how we determine whether a vulnerable package is actually reachable from runtime dependency paths.

## Why this exists

Severity alone does not represent exploitability. Reachability enrichment helps prioritize fixes based on whether vulnerable code is present on active dependency paths.

## Implementation

- Workflow: `.github/workflows/dependency-integrity.yml`
- Script: `scripts/security/reachability-analysis.mjs`
- Artifact: `artifacts/security/reachability-report.md`

The workflow runs `pnpm audit --json`, then enriches findings via `pnpm why` to capture dependency paths.

## Gating behavior

- Reachable `high` and `critical` findings fail the job.
- Non-reachable/unknown findings are recorded for triage and manual verification.

## Triage expectations

When a job fails:

1. Open or update a `Security Finding` issue.
2. Attach the generated reachability report.
3. Assign owner and SLA per `docs/security/security-findings-lifecycle.md`.
4. Patch or isolate vulnerable dependency paths.

## Limitations

- `pnpm why` is dependency-path based, not full runtime call graph.
- Dynamic imports and optional runtime branches may require manual validation.
- Use this as prioritization evidence, not sole risk acceptance rationale.
