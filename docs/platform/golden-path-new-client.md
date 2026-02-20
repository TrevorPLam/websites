# Golden Path: Creating a New Client

**Last Updated:** 2026-02-20  
**Related:** [Architecture Overview](../architecture/README.md), [evolution-roadmap](../architecture/evolution-roadmap.md)

---

## Overview

This guide describes how to create a new client from the starter-template. Two paths exist:

- **Classic path** — Uses the existing registry-based section composition; recommended for most clients today.
- **Universal renderer path** — Opt-in via `renderer: 'universal'`; uses capability-driven composition. Phase 4+ (see [evolution-roadmap](../architecture/evolution-roadmap.md)).

---

## Classic Path (Current)

1. Copy starter-template:
   ```bash
   cp -r clients/starter-template clients/my-client
   ```
2. Update `package.json` name to `@clients/my-client`.
3. Customize `site.config.ts`: theme, features, navLinks, footer, contact, SEO.
4. Copy env: `cp .env.example .env.local` and fill in variables.
5. Run on a unique port: `pnpm --filter @clients/my-client dev -- --port 3102`.

Sections are derived from `site.config.ts` features; the page templates use the section registry and `composePage()`.

---

## Universal Renderer Path (Phase 4+)

When the universal renderer is implemented (evol-9, evol-10):

1. Same copy and setup as classic.
2. Add to `site.config.ts`:
   ```ts
   renderer: 'universal',
   capabilities: { booking: true, contact: true, /* ... */ },
   ```
3. The universal renderer uses `activateCapabilities(siteConfig)` and `CapabilityProvider` to compose pages from capabilities instead of the legacy section registry.

See [evolution-roadmap](../architecture/evolution-roadmap.md) for availability.

---

## Checklist

- [ ] TypeScript strictness matches project standards
- [ ] `site.config.ts` customized for the client
- [ ] Environment variables configured (or documented as optional)
- [ ] Unique dev port assigned
- [ ] `pnpm validate-client clients/my-client` passes
