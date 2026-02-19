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

## Testing Requirements

- Verify health returns 200
- Verify OG image generates for a page

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Health and OG work
- [ ] Build passes
