# api-catch-all Add api/[...routes] with Health + OG

## Metadata

- **Task ID**: api-catch-all-health-og
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1
- **Downstream Tasks**: Client deployment

## Context

Add api/[...routes] catch-all route with health and OG image handlers. THEGOAL shows health + OG under a single catch-all. Clients currently have app/api/health/route.ts; consolidate or add OG generation from siteConfig.

## Dependencies

- **Upstream Task**: 5.1 – clients exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1
- **Downstream**: Client deployment

## Research

- **Primary topics**: [R-NEXT](RESEARCH-INVENTORY.md#r-next-app-router-rsc-server-actions) (App Router API routes).
- **[2026-02] Next.js App Router**: API routes in app/api/; Route Handlers; OG with @vercel/og or ImageResponse from siteConfig (title, description, ogImage).
- **References**: [RESEARCH-INVENTORY.md – R-NEXT](RESEARCH-INVENTORY.md#r-next-app-router-rsc-server-actions), [THEGOAL.md](../THEGOAL.md), [docs/api/health.md](../docs/api/health.md).

## Related Files

- `clients/starter-template/app/api/` – modify – Add catch-all or OG route
- Health route – reference – May consolidate
- site.config.ts – reference – OG image, SEO from config

## Acceptance Criteria

- [ ] Health endpoint available (existing or under catch-all)
- [ ] OG image generation from siteConfig (title, description, ogImage)
- [ ] Catch-all structure per THEGOAL OR document why separate routes
- [ ] All clients have equivalent API structure

## Technical Constraints

- Next.js App Router API routes
- OG generation: @vercel/og or similar

## Implementation Plan

- [ ] Add api/[...routes]/route.ts or consolidate health + add opengraph-image
- [ ] OG reads from siteConfig
- [ ] Update starter-template; propagate to clients

## Sample code / examples

- **Health**: Keep or move to catch-all; GET returns 200. **OG**: Use siteConfig.seo (title, description, ogImage) in app/api/... or generate opengraph-image; @vercel/og or Next ImageResponse.

## Testing Requirements

- Verify health returns 200
- Verify OG image generates for a page

## Execution notes

- **Related files — current state:** `clients/starter-template/app/api/` — health route may exist at app/api/health/route.ts; catch-all or OG route to be added. site.config.ts — has seo (title, description, ogImage).
- **Potential issues / considerations:** Next.js App Router; use @vercel/og or ImageResponse for OG; consolidate health under catch-all per THEGOAL or document why separate; propagate to other clients.
- **Verification:** Health returns 200; OG image generates from siteConfig.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Health and OG work
- [ ] Build passes
