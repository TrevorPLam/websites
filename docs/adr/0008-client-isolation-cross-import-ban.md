<!--
/**
 * @file docs/adr/0008-client-isolation-cross-import-ban.md
 * @role docs/adr
 * @summary Decision record for the rule that clients/ packages may never import
 *          from each other, enforced by ESLint and madge circular dependency detection.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# ADR 0008: Client Isolation — Cross-Client Import Ban

**Status:** Accepted
**Date:** 2026-02-19
**Task:** 6.7 (ADR series)

## Context

The monorepo hosts multiple client sites in `clients/`. Early in development, there is a natural temptation to share code between clients by importing directly: `import { SomeComponent } from '@clients/starter-template'`. This seems convenient but creates hidden coupling.

## Problem

Direct cross-client imports create:

1. **Deployment coupling**: A change to `clients/A` that breaks `clients/B` causes B's build to fail even though B's developer didn't touch A. This makes independent client deployments unreliable.
2. **Version lock**: Both clients must always be at compatible versions of shared code. Updating A requires validating B.
3. **Architectural confusion**: The boundary between "shared platform code" and "client-specific code" collapses. It becomes unclear what is safe to change.
4. **Scaling failure**: With 10+ clients, cross-import graphs become unmanageable. Circular dependencies become likely.

## Decision

**Strictly forbid all imports between `clients/` packages.**

The rule: `clients/A` must never import from `clients/B`. This applies to component imports, utility imports, config imports, and type imports.

### Enforcement

1. **ESLint**: The `@repo/eslint-config` includes a `no-restricted-imports` rule that blocks imports from other `@clients/*` packages.

2. **madge circular dependency detection**: `pnpm madge:circular` (runs in CI) detects import cycles. Any cycle involving two different clients will be caught.

3. **Module boundaries documentation**: `docs/architecture/module-boundaries.md` documents the allowed dependency graph.

### When code wants to be shared

If component or utility code in `clients/A` would be useful in `clients/B`, the correct action is to promote it to a shared package:

- Display-only marketing components → `@repo/marketing-components`
- Feature-level logic (forms, integrations) → `@repo/features`
- UI primitives → `@repo/ui`
- Utilities → `@repo/utils`
- Types → `@repo/types`

This extraction process is intentional — it forces evaluation of whether the code is truly reusable and ensures it meets the quality bar for shared packages (tests, types, documentation).

### Exception: configuration patterns

Clients may share a _pattern_ (copy the `site.config.ts` structure) without importing from each other. Each client owns its own copy of its configuration.

## Consequences

### Positive

- **Independent deployability**: Each client can be built, tested, and deployed without knowledge of other clients.
- **Clear boundaries**: Developers know immediately where shared code lives (`packages/`) and where client-specific code lives (`clients/`).
- **Forced quality bar**: Code that wants to be shared must go through the package extraction process, which includes tests and documentation.
- **CI isolation**: The `--filter="...[origin/main]"` Turbo filter in CI correctly scopes to affected packages without false positives from cross-client coupling.

### Negative / Trade-offs

- **Extraction overhead**: Promoting code from a client to a shared package requires creating package boilerplate. For one-off reuse, this overhead is higher than a direct import.
- **Duplication for genuinely client-specific patterns**: If two clients have very similar but not identical layouts, they must duplicate the code rather than sharing. This is intentional — premature abstraction is worse than duplication.

### Neutral

- The rule applies symmetrically: `packages/` also must never import from `clients/`. This is already the case by convention.

## References

- `docs/architecture/module-boundaries.md` — Visual dependency graph and rules
- `ADR 0002` — Module boundaries ESLint enforcement
- `ADR 0006` — CaCA architecture (explains why sharing happens through `packages/`, not `clients/`)
- `pnpm madge:circular` — Circular dependency detection command
