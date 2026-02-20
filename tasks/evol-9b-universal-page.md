# EVOL-9b UniversalPage Component + Renderer Wiring

## Metadata

- **Task ID**: evol-9b-universal-page
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 4 (Weeks 17-19)
- **Related Epics / ADRs**: ROADMAP Phase 4, evol-9, evol-9a
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-9a (activateCapabilities, CapabilityProvider)
- **Downstream Tasks**: evol-11, evol-12

## Context

Create UniversalPage component that composes sections from activated capabilities and wires the universal renderer path for clients with renderer: 'universal'. Part of evol-9; depends on evol-9a. Per ROADMAP Phase 4 Weeks 17-19.

## Dependencies

- evol-9a — activateCapabilities, CapabilityProvider available

## Research

### Deep research (online)

- **RSC and Suspense:** Wrap async Server Components in Suspense so multiple data sources can load in parallel; show fallback UI while loading. Next.js 16 PPR supports streaming. Pass server components as children to minimize client payload. (React Server Components, Next.js fetching, RSC payload optimization.)
- **Composition:** UniversalPage should await activateCapabilities in the server component, then render CapabilityProvider with resolved capabilities and map sections to components inside Suspense boundaries for progressive rendering.

## Related Files

- `packages/page-templates/src/universal-renderer.tsx` or `UniversalPage.tsx` – create
- Page route in client – wire for universal clients
- Test client with renderer: 'universal'

## Acceptance Criteria

- [ ] UniversalPage({ tenantId, slug }) component
- [ ] Composes sections from capability provides
- [ ] Renders with CapabilityProvider + Suspense/PPR
- [ ] Wire to page route when site.config.renderer === 'universal'
- [ ] New client can launch on universal (checkpoint)
- [ ] Classic clients unchanged

## Implementation Plan

- [ ] Create UniversalPage component (uses activateCapabilities, CapabilityProvider)
- [ ] Wire to page route for universal clients
- [ ] Create test client with renderer: 'universal'
- [ ] Add integration tests
- [ ] Document

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] New client launched on universal (checkpoint)
- [ ] Documentation updated
