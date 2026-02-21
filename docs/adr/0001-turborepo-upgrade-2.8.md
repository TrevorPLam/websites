# ADR 0001: Turborepo Upgrade to 2.8.9

**Status:** Accepted  
**Date:** 2026-02-14  
**Task:** 0.3

## Context

The monorepo used Turborepo 2.2.3. A 6-minor-version gap existed with significant improvements in affected package detection, composable configuration, devtools, TUI, and performance (Turborepo 2.8 release, Jan 2026).

## Decision

Upgrade Turborepo from 2.2.3 to 2.8.9 (latest stable) via `pnpm up turbo@latest -D -w`.

## Consequences

### Positive

- Improved affected package detection for CI (Task 0.13)
- Task descriptions support in turbo.json for better TUI
- Git worktree cache sharing (no config)
- `turbo docs` command for documentation search
- Performance improvements in task orchestration

### Neutral

- No breaking config changes; `tasks` key was already in use
- `globalEnv` / `globalPassThroughEnv` already present (per Verified Findings fix)

### Risks

- None identified; 2.8.x is backward compatible with existing turbo.json

## References

- [Turborepo 2.8 Release](https://turborepo.dev/blog/2-8)
- [Upgrade Guide](https://turbo.build/repo/docs/crafting-your-repository/upgrading)
- `docs/tooling/turborepo.md`
