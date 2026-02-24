# Security Findings Lifecycle, Severity Matrix, and Ticketing

This document defines how security findings are tracked, triaged, and remediated across repository workflows.

## Scope

Applies to findings emitted by:

- `.github/workflows/security-sast.yml` (CodeQL + Semgrep)
- `.github/workflows/dependency-integrity.yml` (pnpm audit + OSV + dependency review)
- `.github/workflows/security-container-iac.yml` (Trivy)
- `.github/workflows/security-dast.yml` (OWASP ZAP)

## Ticketing and tracking workflow

1. **Detection**: CI workflow detects a finding and publishes logs/SARIF artifacts.
2. **Intake ticket**: open a GitHub issue using the `Security Finding` template (`.github/ISSUE_TEMPLATE/security-finding.yml`).
3. **Ownership**: assign an owner from the affected area (`packages/*`, `clients/*`, or platform).
4. **Triage**: classify severity and exploitability; mark SLA due date.
5. **Remediation**: ship a fix in a PR linked to the issue.
6. **Verification**: rerun failing security workflow and attach passing evidence.
7. **Closure**: close issue with root cause, fix summary, and backport notes if needed.

## Severity matrix and remediation SLAs

| Severity | Typical examples                                                         | Maximum remediation SLA | Escalation trigger                     |
| -------- | ------------------------------------------------------------------------ | ----------------------- | -------------------------------------- |
| Critical | RCE, tenant data exfiltration, auth bypass                               | 24 hours                | Page security owner immediately        |
| High     | Privilege escalation, injectable sink, exploitable vulnerable dependency | 72 hours                | Escalate to engineering manager at 48h |
| Medium   | Defense-in-depth gap, low-complexity misconfiguration                    | 14 days                 | Weekly security review follow-up       |
| Low      | Hardening recommendation, non-exploitable finding                        | 30 days                 | Monthly backlog review                 |

## Ownership model

- **App owner**: fixes tenant and product-surface issues in `clients/*`.
- **Platform owner**: fixes shared package/workflow issues in `packages/*` and `.github/workflows/*`.
- **Security champion**: validates severity, SLA targets, and closure evidence.

## Dependency update cadence

- Renovate runs on weekdays before 6am UTC for routine updates.
- Security and vulnerability alert PRs are allowed to run at any time.
- Lockfile maintenance runs monthly and is auto-merged when green.

## Required issue fields

Every security finding issue must include:

- Finding source workflow and run URL
- Affected package(s)/path(s)
- Severity and SLA target date
- CWE/OWASP mapping (when available)
- Reproduction/evidence details
- Proposed remediation plan and owner

## References

- `docs/security/security-requirements.md`
- `docs/security/security-standards-mapping.md`
- `SECURITY.md`
