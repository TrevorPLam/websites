# EVOL-9 Universal Renderer (New Clients Only)

## Metadata

- **Task ID**: evol-9-universal-renderer
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 4 (Weeks 17-19)
- **Related Epics / ADRs**: NEW.md Phase 4, evol-8
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7, evol-8
- **Downstream Tasks**: evol-11, evol-12

## Context

Create UniversalPage for clients that opt-in via site.config.renderer: 'universal'. Resolves tenant → activateCapabilities → composes sections from capabilities → renders with CapabilityProvider. Per NEW.md Weeks 17-19.

## Dependencies

- evol-7 (defineFeature, featureRegistry), evol-8 (capabilities in site.config)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Opt-in; new clients default; classic unchanged. PPR for streaming.
- **References**: NEW.md Weeks 17-19, [packages/page-templates/](../packages/page-templates/).

## Related Files

- `packages/page-templates/src/universal-renderer.tsx` – create
- `packages/page-templates/src/activate-capabilities.ts` – create
- `packages/page-templates/src/CapabilityProvider.tsx` – create
- `packages/types/src/site-config.ts` – add renderer?: 'classic' | 'universal'

## Acceptance Criteria

- [ ] UniversalPage({ tenantId, slug }) component
- [ ] activateCapabilities(siteConfig.capabilities) function
- [ ] CapabilityProvider context
- [ ] Composes sections from capability provides
- [ ] Renders with Suspense/PPR
- [ ] renderer: 'universal' in site.config opt-in
- [ ] New client can launch on universal
- [ ] Classic clients unchanged

## Technical Constraints

- Static import for tenant config initially (or dynamic)
- PPR / streaming per Next.js 16

## Implementation Plan

- [ ] Add renderer to SiteConfig
- [ ] Create activateCapabilities
- [ ] Create CapabilityProvider
- [ ] Create UniversalPage
- [ ] Wire to page route for universal clients
- [ ] Create test client with renderer: 'universal'
- [ ] Add tests
- [ ] Document

## Sample code / examples

```tsx
export async function UniversalPage({ tenantId, slug }) {
  const siteConfig = await resolveTenant(tenantId);
  const capabilities = await activateCapabilities(siteConfig.capabilities);
  const sections = capabilities
    .flatMap((c) => c.provides.sections)
    .filter((s) => pageConfig.sections.includes(s.id));
  return (
    <CapabilityProvider capabilities={capabilities}>
      {sections.map((Section) => (
        <Suspense key={Section.id}>
          <Section />
        </Suspense>
      ))}
    </CapabilityProvider>
  );
}
```

## Testing Requirements

- Integration test for UniversalPage; new client launch verification.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
- [ ] New client launched on universal (checkpoint)
