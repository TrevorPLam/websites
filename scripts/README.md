# scripts/README.md — Local Tools (Optional)

Last Updated: 2026-01-05

These scripts are **optional helpers**. They exist to reduce manual work, but they must not become a dependency for progress.

## Activation (opt-in)
- **Default**: run scripts manually as needed.
- **Opt-in hooks**: set `ENABLE_GITHOOKS=1` when running `scripts/bootstrap.sh`.
- **Opt-in GitHub Actions**: see `githubactions/README.md`.

## Key scripts
- `scripts/check.sh` — best-effort local verification (lint/test/build if available)
- `scripts/security-scan.sh` — lightweight checks (no paid tools required)
- `scripts/ai-audit.sh` — validates required governance files exist and basic invariants hold
- `scripts/check-bundle-size.mjs` — verifies Next.js bundle chunks stay within the performance budget
- `scripts/a11y-audit.mjs` — runs axe-core audits against core pages (requires running dev/server)
- `scripts/lighthouse-audit.mjs` — captures mobile Lighthouse baselines (requires running dev/server + Lighthouse CLI)
- `scripts/sync-todo.sh` — generates `TODO.generated.md` from `specs/project-tasks.md (non-binding notes)` (non-binding)

## Non-binding rule
- `TODO.md` is the task truth source.
- `TODO.generated.md` is informational only and may be discarded.
