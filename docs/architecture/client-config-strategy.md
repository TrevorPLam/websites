<!--
/**
 * @file docs/architecture/client-config-strategy.md
 * @role docs
 * @summary Client configuration divergence strategy and standardization approach.
 *
 * @entrypoints
 * - Architecture documentation for client configuration decisions
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/architecture/README.md
 * - clients/starter-template/next.config.js
 *
 * @used_by
 * - Developers creating new clients
 * - Maintainers aligning client configurations
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: client configuration patterns
 * - outputs: standardization guidance
 *
 * @invariants
 * - starter-template is the canonical reference
 * - Non-starter clients may intentionally diverge for specific needs
 *
 * @gotchas
 * - i18n is optional for single-locale clients
 * - Docker support may not be needed for all clients
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Client Configuration Strategy

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Architecture Overview](README.md), [starter-template](../../clients/starter-template/README.md), [evolution-roadmap](evolution-roadmap.md)

---

## Evolution: Capabilities Structure

Per [NEW.md](../../NEW.md) (Phase 3+), `site.config.ts` may gain a `capabilities` structure:

- **Classic clients:** Continue with `features` flags; no change required.
- **Universal renderer clients:** May use `renderer: 'universal'` and `capabilities: { booking: true, contact: true, ... }` to drive capability-based composition.
- **Capability activation:** `activateCapabilities(siteConfig)` drives which sections and integrations are available.

See [evolution-roadmap.md](evolution-roadmap.md) for phase sequencing.

---

## Overview

The repository contains multiple client implementations with varying configuration approaches. This document explains the divergence and provides guidance for standardization.

## Current State

### starter-template (Canonical Reference)

**Purpose:** Golden-path template for new clients

**Configuration:**

- `next.config.js` (CommonJS)
- `output: 'standalone'` (Docker-ready)
- `poweredByHeader: false`
- `typescript: { ignoreBuildErrors: false }` (strict)
- `next-intl` plugin configured
- `[locale]` routing structure
- `Dockerfile` present
- `sitemap.ts` and `robots.ts` present

**Use Case:** Multi-locale, Docker-deployed, production-ready clients

### Other Clients (luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters)

**Configuration:**

- `next.config.ts` (TypeScript)
- Minimal config (only `transpilePackages`)
- No `output: 'standalone'`
- No `poweredByHeader` setting
- No `typescript` options
- No `next-intl` (flat routing, English-only)
- No `Dockerfile`
- No `sitemap.ts` or `robots.ts`

**Use Case:** Single-locale, simpler deployments, development/testing

## Strategy

### When to Use starter-template Pattern

Use the starter-template configuration when:

- Multi-locale support is required
- Docker deployment is needed
- Production-grade TypeScript strictness is required
- SEO optimization (sitemap, robots.txt) is needed
- You want the full feature set

### When Divergence is Acceptable

Divergence is acceptable when:

- Single locale is sufficient (no i18n needed)
- Deployment doesn't require Docker
- Simpler configuration reduces maintenance overhead
- Client-specific requirements justify differences

### Standardization Recommendations

**For New Clients:**

1. Start with `starter-template` as the base
2. Remove i18n if single-locale: delete `[locale]` routing, remove `next-intl`
3. Keep Docker support unless explicitly not needed
4. Always include `sitemap.ts` and `robots.ts` for SEO
5. Maintain TypeScript strictness (`ignoreBuildErrors: false`)

**For Existing Clients:**

- Document intentional divergence in client-specific README
- Consider gradual alignment with starter-template if requirements evolve
- Ensure critical features (security headers, type safety) are not compromised

## Configuration Checklist

When creating or updating a client, ensure:

- [ ] TypeScript strictness matches project standards
- [ ] Security headers configured (via middleware or next.config)
- [ ] SEO basics present (sitemap, robots.txt, JSON-LD)
- [ ] Docker support if production deployment needed
- [ ] i18n only if multi-locale required
- [ ] Configuration divergence documented if intentional

## Migration Path

To align a non-starter client with starter-template:

1. **Add i18n (if needed):**
   - Install `next-intl`
   - Restructure routes to `app/[locale]/`
   - Add `i18n/` directory with routing config
   - Update `next.config.js` with plugin

2. **Add Docker support:**
   - Copy `Dockerfile` from starter-template
   - Add `output: 'standalone'` to next.config

3. **Add SEO:**
   - Copy `app/sitemap.ts` and `app/robots.ts`
   - Add JSON-LD to root layout

4. **Enhance TypeScript:**
   - Set `typescript: { ignoreBuildErrors: false }`
   - Ensure strict mode compliance

## Related Documentation

- [starter-template README](../../clients/starter-template/README.md)
- [Architecture Overview](README.md)
- [Module Boundaries](module-boundaries.md)
