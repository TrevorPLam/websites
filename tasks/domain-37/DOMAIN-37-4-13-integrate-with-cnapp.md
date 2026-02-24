# DOMAIN-37-4-13: Integrate with CNAPP

## Status

Completed - 2026-02-24

## Summary

Added a CNAPP export bridge workflow to forward security scan artifacts and metadata to an external CNAPP ingestion endpoint.

## Changes

- Added `.github/workflows/security-cnapp-export.yml` to package and export SARIF-oriented artifacts.
- Added `docs/security/cnapp-integration.md` with ingestion contract, required secrets, and operations checks.
- Updated `docs/security/aspm-consolidation-plan.md` to reference CNAPP export bridge.

## QA

- `pnpm validate-docs`
- `pnpm lint`
