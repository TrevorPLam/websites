# Predictive Maintenance

This document defines the baseline automation for `DOMAIN-37-5-12-enable-predictive-maintenance`.

## Inputs

- `docs/quality/metrics/service-health-trends.json` (optional)

## Output

- `docs/quality/metrics/predictive-maintenance-alerts.json`

## Command

- `pnpm ai:predictive-maintenance`

## Risk scoring

Each service receives a deterministic risk score based on CPU utilization, saturation, and error-rate trends.
