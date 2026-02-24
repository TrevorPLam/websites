# Code Quality Gates

This repository uses mandatory quality gates for pull requests and mainline merges.

## Blocking gates

- Formatting: `pnpm format:check`
- Linting: `pnpm lint`
- Type safety: `pnpm type-check`
- Unit tests: `pnpm test`
- Coverage threshold: `pnpm test:coverage` (global minimum 35%)
- Export validation: `pnpm validate-exports`
- Docs validation: `pnpm validate-docs`

## Security-adjacent gates

- Dependency audit (high/critical)
- Secret scanning workflow
- SAST workflow

## Failure policy

- Blocking gate failures must be fixed before merge.
- Temporary exceptions require maintainer approval and a follow-up task in `TODO.md`.
