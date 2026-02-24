# Self-Healing Test Strategy

Self-healing tests retry known flaky tests with bounded retries and mandatory trace output.

## Constraints

- Maximum retries: 2
- Flaky tests must be tagged with `@flaky` and linked to a tracking task.
- Passing retry does not close the defect automatically.

## Command

- `pnpm test:self-healing`
