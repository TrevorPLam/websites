# Module Boundaries — Architecture

**Last Updated:** 2026-02-14  
**Status:** Implemented (Task 0.11)  
**Related:** `ANALYSIS_ENHANCED.md`, `RESEARCH_ENHANCED.md`, Dependency Health Matrix in `TODO.md`

---

## Overview

This document defines the **allowed dependency direction matrix** for the marketing-websites monorepo. Boundary enforcement prevents architecture drift, ensures packages expose only supported entrypoints, and blocks cross-template internal access.

## Dependency Direction Matrix

| From (Consumer) | To (Provider) | Allowed | Notes |
|-----------------|---------------|---------|-------|
| **templates/** | **@repo/ui** | ✅ | Via `import { Button } from '@repo/ui'` — main export only |
| **templates/** | **@repo/utils** | ✅ | Via `import { cn } from '@repo/utils'` |
| **templates/** | **@repo/infra** | ✅ | Via `.`, `./client`, `./env`, `./context/*`, `./security/*`, `./logger`, `./sentry/*`, `./middleware/*` |
| **templates/** | **@repo/shared** | ✅ | Via `./types`, `./site-config` |
| **templates/** | **@repo/integrations-*** | ✅ | Via each package's public exports |
| **templates/** | **templates/other/** | ❌ | Template internals are isolated; no cross-template imports |
| **templates/** | **@repo/*/src/** | ❌ | Deep internal paths; use package public API |
| **packages/** | **@repo/*** (siblings) | ✅ | Via declared dependencies and public exports |
| **packages/** | **templates/** | ❌ | Packages never depend on templates |
| **packages/** | **@repo/*/src/** | ❌ | Deep internal paths blocked |
| **External** | **@repo/*/src/** | ❌ | Only supported entrypoints (see package.json exports) |

## Supported Entrypoints

Consumers **must** import only from paths explicitly listed in each package's `package.json` `exports` field.

### @repo/ui

| Import | Allowed | Exports |
|--------|---------|---------|
| `@repo/ui` | ✅ | `"."` → main barrel |

### @repo/utils

| Import | Allowed | Exports |
|--------|---------|---------|
| `@repo/utils` | ✅ | `"."` → main barrel |

### @repo/infra

| Import | Allowed | Exports |
|--------|---------|---------|
| `@repo/infra` | ✅ | Main entry (security, middleware, logging) |
| `@repo/infra/client` | ✅ | Client-safe logger, Sentry, request context |
| `@repo/infra/env` | ✅ | Composable env validation |
| `@repo/infra/context/request-context` | ✅ | Universal (stub) context |
| `@repo/infra/context/request-context.server` | ✅ | Server-only AsyncLocalStorage context |
| `@repo/infra/security/*` | ✅ | request-validation, sanitize, rate-limit, csp, security-headers |
| `@repo/infra/logger` | ✅ | Structured logging |
| `@repo/infra/sentry/*` | ✅ | sanitize, client, server |
| `@repo/infra/middleware/create-middleware` | ✅ | Middleware factory |

### @repo/shared

| Import | Allowed | Exports |
|--------|---------|---------|
| `@repo/shared/types` | ✅ | Shared type definitions |
| `@repo/shared/site-config` | ✅ | SiteConfig types |

### @repo/integrations-*

Each integration exposes its own exports; consult `packages/integrations/<name>/package.json`.

## Blocked Patterns

The following are **explicitly forbidden** and enforced by ESLint `no-restricted-imports`:

1. **Deep internal imports**: `@repo/*/src/*` — bypasses public API; use package root or documented subpath.
2. **Cross-template imports**: When multiple templates exist, `templates/<other>` must not be imported from `templates/<current>`.
3. **Relative escape**: Relative imports that cross package boundaries (e.g. `../../packages/ui/...` from a template) — use `@repo/ui` instead.
4. **Package-to-template**: No package under `packages/` may import from `templates/` or `clients/`.

## Enforcement

- **ESLint**: `no-restricted-imports` rules in `@repo/eslint-config` (next.js and library.js) enforce blocked patterns.
- **Export validation**: `pnpm validate-exports` ensures all `exports` entries resolve to existing files.
- **CI**: `pnpm lint` runs ESLint and fails on boundary violations.

## Adding New Exports

When adding a new public entrypoint:

1. Add the path to `package.json` `exports`.
2. Run `pnpm validate-exports` to ensure the target file exists.
3. Update this document's Supported Entrypoints table.
4. Document usage in the package's metaheader or README.

## Workspace Policy

- **Workspace changes** must update both `package.json` workspaces and `pnpm-workspace.yaml` in the same PR.
- **New packages** must declare dependencies only on `@repo/*` siblings; no template dependencies.
- **New templates** must depend on `@repo/*` packages via workspace protocol; no peer dependency on other templates.

---

_Related: `docs/tooling/validate-exports.md`, `docs/tooling/pnpm.md`_
