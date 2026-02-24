# DOMAIN-37-1-12: Block PRs on Comment Quality Issues

## Status

Completed - 2026-02-24

## Summary

Added automated PR blocking for low-quality comment patterns and unresolved markers without ticket references.

## Changes

- Added `scripts/verify-comment-quality.js` with staged/CI-aware file selection.
- Added package scripts for local and CI execution.
- Added `.github/workflows/pr-comment-quality.yml` to enforce checks in pull requests.
- Added `pnpm verify:comment-quality` to `.husky/pre-commit` for local guardrails.

## QA

- `node scripts/verify-comment-quality.js --staged`
- `node scripts/verify-comment-quality.js --ci`
