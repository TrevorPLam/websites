# Domain 37 — Repository Excellence & AI-Ready Practices

## Scope

This domain tracks repository-wide engineering hygiene improvements such as code metadata headers, documentation quality, secure SDLC practices, and review standards.

## Completed in this iteration

- Added IDE snippets for metadata headers and docstring templates.
- Selected and documented language-specific docstring standards.
- Added automated staged-file docstring verification in pre-commit.
- Defined standardized file header template and metadata requirements.
- Added staged-file pre-commit verification for required header fields.
- Added contributor guidance for comments, docstrings, and review conventions.

## Additional completed tasks in this iteration

- Enabled AI docstring suggestion guidance and editor instruction-file integration.
- Added PR comment-quality blocking workflow and verification script.
- Added code metrics tracking script, documentation, and CI artifact workflow.
- Added security requirements baseline and standards mapping (OWASP/NIST/GDPR).
- Added secure coding guidelines for repository-wide adoption.

- Added threat modeling methodology, stored threat model artifacts, annual review policy, and Semgrep-based security linting + pre-commit secret scanning.
- Extended CI security gates with blocking Semgrep and dependency audit checks.
- Added SCA scanning via OSV + dependency-review workflow checks.
- Added Trivy filesystem/IaC scanning workflow with SARIF upload.
- Added scheduled OWASP ZAP baseline DAST workflow.

- Added docs governance and living documentation standards.
- Added plain-text documentation format validation and static docs-site build script.
- Added docs site build/publish workflow for push/PR automation.
- Added repository label taxonomy and automated label synchronization workflow.
- Added Changesets configuration and Release Drafter for SemVer + release notes automation.

## Artifacts

- `docs/guides/best-practices/file-header-template.md`
- `docs/guides/best-practices/conventional-comments.md`
- `CONTRIBUTING.md`
- `scripts/verify-file-headers.js`

- `docs/guides/best-practices/docstring-standards.md`
- `scripts/verify-docstrings.js`
- `.vscode/repo.code-snippets`

- `docs/standards/documentation-governance.md`
- `docs/standards/living-documentation-policy.md`
- `docs/README.md`
- `scripts/docs/verify-doc-formats.js`
- `scripts/docs/build-docs-site.js`
- `.github/workflows/docs-site.yml`
- `.github/labels.yml`
- `.github/workflows/label-sync.yml`
- `.changeset/config.json`
- `.github/release-drafter.yml`
- `.github/workflows/release-drafter.yml`
- `docs/plan/domain-37/37.2-docs-and-community-practices.md`

- `scripts/verify-comment-quality.js`
- `scripts/track-code-metrics.js`
- `.github/workflows/pr-comment-quality.yml`
- `.github/workflows/code-metrics.yml`
- `.github/copilot-instructions.md`
- `.vscode/settings.json`
- `docs/quality/code-metrics-tracking.md`
- `docs/security/security-requirements.md`
- `docs/security/security-standards-mapping.md`
- `docs/security/secure-coding-guidelines.md`
- `docs/plan/domain-37/37.3-secure-software-development-lifecycle.md`

- `.semgrep/security-rules.yml`
- `scripts/verify-staged-secrets.js`
- `docs/security/threat-modeling-methodology.md`
- `docs/security/threat-model-review-policy.md`
- `docs/security/threat-models/auth-and-session-boundary.md`
- `docs/security/threat-models/tenant-data-isolation.md`
- `docs/security/threat-models/secrets-and-webhook-ingress.md`
