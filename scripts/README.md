# scripts/README.md — Local Tools (Optional)

Last Updated: 2026-01-07

These scripts are **optional helpers**. They exist to reduce manual work, but they must not become a dependency for progress.

## Activation (opt-in)
- **Default**: run scripts manually as needed.
- **Opt-in hooks**: set `ENABLE_GITHOOKS=1` when running `scripts/bootstrap.sh`.
- **Opt-in GitHub Actions**: see `githubactions/README.md`.

## Key scripts
- `scripts/check-client-secrets.mjs` — postbuild helper to scan for leaked server-only tokens in client bundles.
- `scripts/ensure-vitest-coverage.mjs` — enforces coverage dependency expectations for tests.
- `scripts/npm-registry-check.mjs` — lightweight registry diagnostics for blocked environments.
- `scripts/check.sh` (if added later) — best-effort local verification (lint/test/build if available).
- `scripts/security-scan.sh` (if added later) — lightweight checks (no paid tools required).
- `scripts/ai-audit.sh` (if added later) — validates required governance files exist and basic invariants hold.
- `scripts/sync-todo.sh` (if added later) — generates `TODO.generated.md` from `specs/project-tasks.md (non-binding notes)` (non-binding).

## Non-binding rule
- `TODO.md` is the task truth source.
- `TODO.generated.md` is informational only and may be discarded.
