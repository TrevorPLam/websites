# Security Policy

## Supported Versions

The current `main` and `develop` branches are supported for security updates.

## Reporting a Vulnerability

Please do **not** open public issues for potential vulnerabilities.

Report security concerns to: **security@marketing-monorepo.local**

Include:

- Affected package/app and version or commit SHA
- Steps to reproduce
- Impact assessment (confidentiality, integrity, availability)
- Suggested remediation (if known)

## Response Targets (SLA)

- **Acknowledgement**: within 1 business day
- **Initial triage**: within 3 business days
- **Remediation plan**: within 7 business days

## Disclosure Process

1. Reporter submits private vulnerability details.
2. Security maintainers validate and assess severity.
3. Patch is prepared and tested in private.
4. Coordinated disclosure is published after fix rollout.

## Security Controls in This Repository

- CI security scans (dependency audit, secret scanning, SAST workflow)
- SBOM generation workflow
- Secure coding and review requirements in `CONTRIBUTING.md`
