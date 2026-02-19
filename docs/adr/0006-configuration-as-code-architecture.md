<!--
/**
 * @file docs/adr/0006-configuration-as-code-architecture.md
 * @role docs/adr
 * @summary Decision record for the Configuration-as-Code (CaCA) architecture pattern
 *          where site.config.ts is the single source of truth for all client sites.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# ADR 0006: Configuration-as-Code (CaCA) Architecture

**Status:** Accepted
**Date:** 2026-02-19
**Task:** 6.7 (ADR series)

## Context

The monorepo needs to support multiple marketing website clients (salon, restaurant, law firm, dental, etc.) from a single shared codebase. Without a clear strategy, each client would require significant duplication of Next.js layout code, routing, and component wiring. Maintenance overhead grows linearly with each client added.

Two approaches were considered:

1. **Fork-per-client**: Copy the entire template for each client, allow arbitrary code changes.
2. **Configuration-as-Code (CaCA)**: A single shared implementation driven by a typed config object; clients only edit `site.config.ts`.

## Decision

Adopt the **Configuration-as-Code architecture** for all marketing website clients.

Each client in `clients/` exports a single `SiteConfig` object from `site.config.ts`. This config is typed by `@repo/types` and validated by a Zod schema at runtime. All UI sections, integrations, theming, navigation, SEO, and conversion flows are driven by this single file. No client-specific code changes are needed for standard customization.

### Key design decisions within CaCA:

1. **`SiteConfig` as discriminated union for conversion flows** — The `conversionFlow` field uses a Zod discriminated union on `type` (`booking | contact | quote | dispatch`), ensuring each flow type has the correct shape with TypeScript compile-time guarantees.

2. **Feature flags as layout variant strings** — Section visibility uses either `null` (disabled) or a variant string (`'grid' | 'carousel' | ...`), combining enable/disable and layout selection into a single value.

3. **HSL color strings without wrapper** — Theme colors are HSL strings (`"174 85% 33%"`) without `hsl()`, injected as CSS custom properties by `ThemeInjector`. This avoids inline style specificity issues and allows CSS to compose values.

4. **Industry enum** — An `industry` field maps to schema.org types for structured data, enabling per-industry JSON-LD without conditional code in templates.

5. **Starter template as golden path** — `clients/starter-template` is the canonical reference implementation. New clients are created by copying this directory and editing only `site.config.ts`.

## Consequences

### Positive

- **Zero-code client setup**: A new site can be launched by copying `starter-template` and editing `site.config.ts` alone — no React, layout, or routing knowledge required.
- **Consistent quality**: All clients inherit the same component quality, accessibility standards, and performance optimizations automatically.
- **Centralized upgrades**: A bug fix or performance improvement in `@repo/ui` or `@repo/features` benefits all clients simultaneously.
- **TypeScript safety**: The `SiteConfig` interface and Zod schema catch misconfiguration at compile time and runtime respectively.
- **Reduced review burden**: Code reviews focus on shared packages; client-specific changes rarely require deep review.

### Negative / Trade-offs

- **Limited customization**: Clients with highly unique requirements (custom animations, non-standard layouts) require extending the template or adding to shared packages rather than direct customization.
- **Config overhead**: For very simple one-page sites, the full `SiteConfig` is more than required. The `general` industry with all features set to `null` is the workaround.
- **Learning curve**: New developers must understand the config-to-component mapping before they can diagnose rendering issues.

### Neutral

- **Cross-client sharing requires package extraction**: Functionality that starts client-specific and becomes shared must be promoted to `@repo/features` or `@repo/marketing-components`. This is intentional — premature extraction is avoided.

## Alternatives Considered

### Fork-per-client

Would allow arbitrary customization but creates N repositories to maintain, N upgrade paths, and N audit surfaces. Rejected due to maintenance scaling concerns.

### CMS-driven (no code)

Using a headless CMS for all configuration adds infrastructure complexity, latency, and a dependency on external services for something that rarely changes (business identity, theme colors). Rejected — `site.config.ts` provides all the flexibility needed at zero runtime cost.

## References

- `packages/types/src/site-config.ts` — TypeScript interface and Zod schema
- `clients/starter-template/site.config.ts` — Golden-path example
- `docs/configuration/site-config-reference.md` — Full field reference
- `docs/migration/template-to-client.md` — How to create a new client
