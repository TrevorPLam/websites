# DOMAIN-37-4-14: Require Signed Commits and Tags

## Status

Completed - 2026-02-24

## Summary

Implemented CI enforcement for commit signature verification and documented branch protection requirements for signed commits.

## Changes

- Added `.github/workflows/commit-signature-verification.yml` to fail when commits are not verified.
- Updated `.github/branch-protection/main-branch-protection.md` to require signed commits and include the signature check status.

## QA

- `pnpm validate-docs`
- `pnpm lint`
