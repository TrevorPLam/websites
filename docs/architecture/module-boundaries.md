# Module Boundaries — Architecture

**Last Updated:** 2026-02-18  
**Status:** Implemented (Task 0.11)  
**Related:** [Architecture Overview](README.md)

---

## Overview

This document defines the **allowed dependency direction matrix** for the marketing-websites monorepo. Boundary enforcement prevents architecture drift, ensures packages expose only supported entrypoints, and blocks cross-template internal access.

### Dependency Flow Visualization

```mermaid
graph TD
    subgraph Clients[Clients Layer]
        C1[starter-template]
        C2[luxe-salon]
        C3[Other clients]
    end
    
    subgraph Packages[Packages Layer]
        UI[@repo/ui]
        Utils[@repo/utils]
        Infra[@repo/infra]
        Features[@repo/features]
        Types[@repo/types]
        Marketing[@repo/marketing-components]
        PageTemplates[@repo/page-templates]
        Integrations[@repo/integrations-*]
    end
    
    C1 --> UI
    C2 --> UI
    C3 --> UI
    C1 --> Utils
    C2 --> Utils
    C3 --> Utils
    C1 --> Infra
    C2 --> Infra
    C3 --> Infra
    C1 --> Features
    C2 --> Features
    C3 --> Features
    C1 --> Marketing
    C2 --> Marketing
    C3 --> PageTemplates
    
    Features --> UI
    Features --> Utils
    Features --> Types
    Features --> Infra
    PageTemplates --> Marketing
    PageTemplates --> Types
    Marketing --> UI
    Integrations --> Infra
    
    C1 -.->|❌ Not Allowed| C2
    Packages -.->|❌ Not Allowed| Clients
    
    style Clients fill:#e3f2fd
    style Packages fill:#f1f8e9
```

## Dependency Direction Matrix

| From (Consumer) | To (Provider) | Allowed | Notes |
|-----------------|---------------|---------|-------|
| **clients/** | **@repo/ui** | ✅ | Via `import { Button } from '@repo/ui'` — main export only |
| **clients/** | **@repo/utils** | ✅ | Via `import { cn } from '@repo/utils'` |
| **clients/** | **@repo/infra** | ✅ | Via `.`, `./client`, `./env`, `./context/*`, `./security/*`, `./logger`, `./sentry/*`, `./middleware/*` |
| **clients/** | **@repo/types** | ✅ | Via `.`, `./types`, `./site-config`, `./industry`, `./industry-configs` |
| **clients/** | **@repo/features** | ✅ | Via main and subpath exports |
| **clients/** | **@repo/page-templates** | ✅ | Via main barrel |
| **clients/** | **@repo/marketing-components** | ✅ | Via main barrel |
| **clients/** | **@repo/integrations-*** | ✅ | Via each package's public exports (when wired) |
| **clients/A** | **clients/B** | ❌ | Cross-client imports forbidden |
| **clients/** | **@repo/*/src/** | ❌ | Deep internal paths; use package public API |
| **packages/** | **@repo/*** (siblings) | ✅ | Via declared dependencies and public exports |
| **packages/** | **clients/** | ❌ | Packages never depend on clients |
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
2. **Cross-client imports**: No client may import from another client (e.g. `clients/luxe-salon` cannot import from `clients/starter-template`).
3. **Relative escape**: Relative imports that cross package boundaries (e.g. `../../packages/ui/...` from a client) — use `@repo/ui` instead.
4. **Package-to-client**: No package under `packages/` may import from `clients/`.

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
- **New packages** must declare dependencies only on `@repo/*` siblings; no client dependencies.
- **New clients** must depend on `@repo/*` packages via workspace protocol; no peer dependency on other clients. Copy from `clients/starter-template`.

---

_Related: `docs/tooling/validate-exports.md`, `docs/tooling/pnpm.md`_
