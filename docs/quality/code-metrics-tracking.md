# Code Metrics Tracking

`pnpm metrics:code` generates a metrics snapshot in `docs/quality/metrics/`.

## Collected metrics

- source file count
- total source lines
- comment line count and density
- unresolved marker count (`TODO`, `FIXME`, `HACK`)

## Usage

- Local: run `pnpm metrics:code` before/after large refactors.
- CI: `.github/workflows/code-metrics.yml` publishes snapshots as artifacts.
