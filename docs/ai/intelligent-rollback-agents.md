# Intelligent Rollback Agents

This document defines the baseline automation for `DOMAIN-37-5-11-deploy-intelligent-rollback`.

## Inputs

- `docs/quality/metrics/release-health.json` (optional)

## Output

- `docs/quality/metrics/intelligent-rollback-report.json`

## Command

- `pnpm ai:intelligent-rollback`

## Decision policy

Rollback is recommended when either release error-rate or p95 latency exceeds the configured budget values.
