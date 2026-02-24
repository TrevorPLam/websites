# DOMAIN-37-2-8: Add CI Link + Spelling Checks

## Status

Completed - 2026-02-24

## Summary

Added documentation quality commands and CI automation for markdown links and spelling.

## Changes

- Added scripts in `package.json`: `docs:links`, `docs:spelling`, `docs:quality`.
- Added Node-based docs validation scripts in `scripts/docs/` for link and spelling checks.
- Added workflow `.github/workflows/docs-link-spell-check.yml`.

## QA

- `pnpm docs:quality`
