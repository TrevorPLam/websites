# Turborepo Configuration

**Last Updated:** 2026-02-14  
**Related Tasks:** 0.3, 0.13  
**See also:** `docs/ci/required-checks.md`

## Version

- **Current:** 2.8.9 (stable)
- **Upgraded from:** 2.2.3 (Task 0.3, 2026-02-14)

## Configuration File

`turbo.json` at repository root defines the task pipeline:

- **`tasks`** — Modern key (replaces deprecated `pipeline`)
- **`globalEnv`** — Environment variables that invalidate cache when changed
- **`globalPassThroughEnv`** — Env vars passed through to tasks without cache invalidation

### Task Definitions

| Task | Depends On | Outputs | Notes |
|------|------------|---------|-------|
| `build` | `^build` (deps first) | `.next/**`, `dist/**`, `build/**` | Excludes `.next/cache/**` |
| `dev` | — | — | Non-cached, persistent |
| `lint` | `^lint` | — | Package-level ESLint |
| `type-check` | `^type-check` | — | TypeScript `tsc --noEmit` |
| `test` | `^build` | `coverage/**` | Jest tests |
| `format` / `format:check` | — | — | Prettier, non-cached |

## Upgrade History

### 2.2.3 → 2.8.9 (Task 0.3)

- **Improvements:** Affected package detection, composable configuration, devtools, task search in TUI, sidecar tasks, performance
- **2.8.x features:** Task descriptions, `turbo docs` command, git worktree cache sharing
- **Migration:** No config changes required; `tasks` key was already in use

## Usage

```bash
# Full pipeline (lint, type-check, build, test)
pnpm turbo lint type-check build test

# Single task across all packages
pnpm turbo build

# Filter to affected packages (Task 0.13)
pnpm turbo build --filter="...[origin/main]"
```

## Cache Behavior

- **Local cache:** `.turbo/` (gitignored)
- **Remote cache:** Disabled by default; set `TURBO_TOKEN` and `TURBO_TEAM` for Vercel remote cache
- **globalEnv** ensures `NODE_ENV`, `NEXT_PUBLIC_*` changes produce fresh builds

## Compatibility

- Compatible with pnpm 10+ workspaces
- Next.js 15.x build output patterns supported
- Node.js >=22.0.0 (per package.json engines)
