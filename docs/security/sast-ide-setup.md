# SAST in IDE Setup Guide

Use local IDE scanning to catch issues before commit.

## VS Code extensions

Recommended extensions are declared in `.vscode/extensions.json`:

- `github.vscode-codeql`
- `semgrep.semgrep`

## Local workflow

1. Open the repository in VS Code.
2. Install recommended extensions when prompted.
3. Enable scan-on-save for Semgrep and run a workspace scan before opening a PR.
4. For code paths touching auth, tenant boundaries, or secrets, run both local Semgrep and CI-equivalent checks.

## Severity handling

Use the severity matrix in `docs/security/security-findings-lifecycle.md` to prioritize remediation and set due dates.

## CI alignment

Local scans are fast feedback only; merge gates are enforced by `.github/workflows/security-sast.yml` and `.github/workflows/ci.yml`.
