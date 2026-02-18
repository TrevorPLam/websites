# Module Boundaries — Architecture

**Last Updated:** 2026-02-14  
**Status:** Implemented (Task 0.11)  
**Related:** `ANALYSIS_ENHANCED.md`, `TASKS.md` (Part 2 Research, Part 3 Dependency Health Matrix)

---

## Overview

This document defines the **allowed dependency direction matrix** for the marketing-websites monorepo. Boundary enforcement prevents architecture drift, ensures packages expose only supported entrypoints, and blocks cross-template internal access.

### Dependency Flow Visualization

```mermaid
graph TD
    subgraph Templates[Templates Layer]
        T1[Template 1]
        T2[Template 2]
        T3[Template 3]
    end
    
    subgraph Packages[Packages Layer]
        UI[@repo/ui]
        Utils[@repo/utils]
        Infra[@repo/infra]
        Features[@repo/features]
        Types[@repo/types]
        Integrations[@repo/integrations]
    end
    
    T1 --> UI
    T2 --> UI
    T3 --> UI
    T1 --> Utils
    T2 --> Utils
    T3 --> Utils
    T1 --> Infra
    T2 --> Infra
    T3 --> Infra
    T1 --> Features
    T2 --> Features
    T3 --> Features
    T1 --> Types
    T2 --> Types
    T3 --> Types
    T1 --> Integrations
    T2 --> Integrations
    T3 --> Integrations
    
    Features --> UI
    Features --> Utils
    Features --> Types
    Features --> Infra
    
    UI --> Utils
    Integrations --> Infra
    
    T1 -.->|❌ Not Allowed| T2
    T2 -.->|❌ Not Allowed| T3
    T3 -.->|❌ Not Allowed| T1
    
    Packages -.->|❌ Not Allowed| Templates
    
    style Templates fill:#e3f2fd
    style Packages fill:#f1f8e9
```

## Dependency Direction Matrix

| From (Consumer) | To (Provider) | Allowed | Notes |
|-----------------|---------------|---------|-------|
| **templates/** | **@repo/ui** | ✅ | Via `import { Button } from '@repo/ui'` — main export only |
| **templates/** | **@repo/utils** | ✅ | Via `import { cn } from '@repo/utils'` |
| **templates/** | **@repo/infra** | ✅ | Via `.`, `./client`, `./env`, `./context/*`, `./security/*`, `./logger`, `./sentry/*`, `./middleware/*` |
| **templates/** | **@repo/types** | ✅ | Via `.`, `./types`, `./site-config`, `./industry`, `./industry-configs` |
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
| `@repo/infra/env` | ✅ | Composable env validation (schemas, validateEnv, getFeatureFlags) |
| `@repo/infra/env/validate` | ✅ | validateEnv, safeValidateEnv, createEnvSchema, getFeatureFlags, etc. |
| `@repo/infra/context/request-context` | ✅ | Universal (stub) context |
| `@repo/infra/context/request-context.server` | ✅ | Server-only AsyncLocalStorage context |
| `@repo/infra/security/request-validation` | ✅ | getValidatedClientIp, validateRequest, etc. |
| `@repo/infra/security/sanitize` | ✅ | sanitizeHtml, sanitizeForLog |
| `@repo/infra/security/rate-limit` | ✅ | checkRateLimit, hashIp, RateLimiterFactory, etc. |
| `@repo/infra/security/csp` | ✅ | buildContentSecurityPolicy, createCspNonce |
| `@repo/infra/security/security-headers` | ✅ | getSecurityHeaders |
| `@repo/infra/logger` | ✅ | Structured logging |
| `@repo/infra/sentry/sanitize` | ✅ | Sentry event sanitization |
| `@repo/infra/sentry/client` | ✅ | Client-side Sentry setup |
| `@repo/infra/sentry/server` | ✅ | Server-side Sentry setup |
| `@repo/infra/middleware/create-middleware` | ✅ | createMiddleware, getAllowedOriginsFromEnv |

### @repo/types

| Import | Allowed | Exports |
|--------|---------|---------|
| `@repo/types` | ✅ | Main barrel (SiteConfig, types) |
| `@repo/types/types` | ✅ | Shared type definitions |
| `@repo/types/site-config` | ✅ | SiteConfig types and schema |
| `@repo/types/site-config-schema` | ✅ | SiteConfig schema |
| `@repo/types/industry` | ✅ | Industry type definitions |
| `@repo/types/industry-configs` | ✅ | Industry configuration types |

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
