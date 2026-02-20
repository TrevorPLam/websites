# EVOL-11 Legacy Bridge (Classic Config → Capability)

## Metadata

- **Task ID**: evol-11-legacy-bridge
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 5 (Weeks 23-24)
- **Related Epics / ADRs**: ROADMAP Phase 5, evol-8, evol-9
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7, evol-8, evol-9
- **Downstream Tasks**: evol-12

## Context

Create migrateLegacyConfig and ClassicPage so existing clients use capability orchestration internally but render with classic components. No rewrites required. Per ROADMAP Phase 5 Weeks 23-24.

## Dependencies

- evol-7, evol-8 (capability system)
- evol-9 (universal renderer — ClassicPage contrasts)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability).
- **[2026-02]** Auto-convert features → capabilities; ClassicPage uses useCapabilities().resolveSections().
- **References**: ROADMAP Phase 5 Weeks 23-24.

## Related Files

- `packages/infra/features/src/legacy-bridge.ts` – create
- `packages/page-templates/` – add ClassicPage
- `clients/starter-template/` – may use ClassicPage or migrate gradually

## Acceptance Criteria

- [ ] migrateLegacyConfig(legacy: LegacySiteConfig): SiteConfig
- [ ] Auto-converts features array to capabilities
- [ ] Auto-converts pages
- [ ] ClassicPage(siteConfig) uses capability orchestration for section resolution
- [ ] Renders with ClassicLayout, ClassicSectionAdapter
- [ ] Existing clients work unchanged (or opt-in to ClassicPage)
- [ ] Document migration path

## Technical Constraints

- LegacySiteConfig = current site.config shape (features, etc.)
- renderer: 'classic' preserved

## Implementation Plan

- [ ] Create legacy-bridge.ts
- [ ] Implement migrateLegacyConfig
- [ ] Implement ClassicPage
- [ ] Implement ClassicSectionAdapter
- [ ] Wire classic clients to ClassicPage (or keep current flow)
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
export function migrateLegacyConfig(legacy: LegacySiteConfig): SiteConfig {
  return {
    tenantId: legacy.tenantId,
    renderer: 'classic',
    capabilities: legacy.features.map((f) => ({ id: f, enabled: true, config: legacy[f] || {} })),
    pages: legacy.pages,
  };
}
```

## Testing Requirements

- Unit tests for migrateLegacyConfig; ClassicPage renders correctly.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
- [ ] Legacy + modern coexist (checkpoint)
