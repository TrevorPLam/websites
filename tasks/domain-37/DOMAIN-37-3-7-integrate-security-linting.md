# DOMAIN-37-3-7: Integrate Security Linting

## Status

Completed - 2026-02-24

## Summary

Integrated Semgrep security linting into SAST CI workflow.

## Changes

- Added `.semgrep/security-rules.yml`.
- Updated `.github/workflows/security-sast.yml` to run Semgrep and CodeQL.

## QA

- `pnpm validate-docs`
