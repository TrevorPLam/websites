# Application Security Posture Management (ASPM) Consolidation Plan

This plan consolidates repository security signals into a single posture model while retaining existing best-of-breed scanners.

## Objective

Unify SAST, SCA, DAST, secret scanning, and container/IaC findings into one normalized risk view.

## Current signal sources

- SAST: `.github/workflows/security-sast.yml`
- SCA + dependency review: `.github/workflows/dependency-integrity.yml`
- CNAPP export bridge: `.github/workflows/security-cnapp-export.yml`
- Container/IaC: `.github/workflows/security-container-iac.yml`
- DAST: `.github/workflows/security-dast.yml`
- Secrets: `.github/workflows/secret-scan.yml`

## Consolidation approach

1. Treat SARIF as the canonical interchange format where available.
2. Preserve scanner-native severity and map into a shared risk taxonomy.
3. Route normalized findings into a single triage queue (security finding issue template).
4. Track remediation SLA via `docs/security/security-findings-lifecycle.md`.

## Normalized fields

- `finding_id`
- `tool`
- `component_path`
- `severity`
- `exploitability`
- `reachable` (true/false/unknown)
- `owner`
- `sla_due_at`

## Rollout

- **Stage 1**: document data contract and ownership.
- **Stage 2**: add reachability enrichment for dependency findings.
- **Stage 3**: publish weekly posture snapshot in security review.

## Exit criteria

- All security workflows emit artifacts mappable to normalized fields.
- Every high/critical finding has owner + SLA metadata.
- Weekly posture report includes open-by-severity and MTTR trends.
