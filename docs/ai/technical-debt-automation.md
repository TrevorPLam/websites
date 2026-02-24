# Technical Debt Automation

This document defines the baseline automation for `DOMAIN-37-5-13-automate-technical-debt-reduction`.

## Inputs

- `docs/quality/metrics/code-metrics-report.json` (optional)

## Output

- `docs/quality/metrics/technical-debt-backlog.json`

## Command

- `pnpm ai:technical-debt`

## Prioritization policy

Debt backlog entries are generated from complexity and churn to keep refactors measurable and continuously prioritized.
