# DOMAIN-37-4-17: Work Toward SLSA Build Level 3

## Status

Completed - 2026-02-24

## Summary

Added release provenance workflow and documented a concrete roadmap to reach and sustain SLSA Build Level 3.

## Changes

- Added `.github/workflows/slsa-level3-provenance.yml` for provenance-oriented release checks.
- Added `docs/security/slsa-level3-roadmap.md` with baseline, remaining controls, and verification cadence.

## QA

- `pnpm validate-docs`
- `pnpm lint`
