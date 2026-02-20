# EVOL-6 Integration Adapter Registry (Formal)

## Metadata

- **Task ID**: evol-6-integration-adapter-registry
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 9-10)
- **Related Epics / ADRs**: NEW.md Phase 2, inf-10
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-4, inf-10 (align)
- **Downstream Tasks**: evol-7

## Context

Formalize IntegrationAdapter interface and IntegrationRegistry in packages/integrations-core. Enables capability-based resolution. Per NEW.md Weeks 9-10. Merge intent with inf-10; inf-10 implementation satisfies this spec.

## Dependencies

- packages/integrations-core exists (retry, circuit-breaker); add adapter-registry
- evol-4 (canonical types) — adapters may use

## Research

- **Primary topics**: [R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-scheduling-oauth-tcf), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Pattern from booking-providers.ts; capability resolution.
- **References**: NEW.md Weeks 9-10, [packages/features/src/booking/lib/booking-providers.ts](../packages/features/src/booking/lib/booking-providers.ts), inf-10.

## Related Files

- `packages/integrations-core/src/adapter-registry.ts` – create
- `packages/integrations-core/src/index.ts` – export
- `packages/integrations/hubspot/` – register HubSpotAdapter
- `packages/integrations/scheduling/` – register Calendly, Acuity, Cal.com

## Acceptance Criteria

- [ ] IntegrationAdapter interface: id, capabilities[], connect, healthCheck
- [ ] IntegrationRegistry: register, resolve(capability)
- [ ] globalIntegrationRegistry or equivalent
- [ ] HubSpotAdapter registered at startup
- [ ] resolve('crm') returns CRM adapter; resolve('scheduling') returns scheduling
- [ ] Document how to add new integration

## Technical Constraints

- packages/integrations-core (add adapter-registry to existing package)
- Capability resolution: resolve(capability: string)

## Implementation Plan

- [ ] Create adapter-registry.ts in integrations-core
- [ ] Define IntegrationAdapter interface
- [ ] Implement IntegrationRegistry
- [ ] Register HubSpot, Calendly, Acuity (or equivalents)
- [ ] Export from integrations-core
- [ ] Update inf-10 to reference evol-6
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
interface IntegrationAdapter {
  id: string;
  capabilities: string[];
  connect: (config: unknown) => Promise<void>;
  healthCheck: () => Promise<'healthy' | 'degraded' | 'unhealthy'>;
}

class IntegrationRegistry {
  resolve(capability: string): IntegrationAdapter | undefined {
    return Array.from(this.adapters.values()).find((a) => a.capabilities.includes(capability));
  }
}
```

## Testing Requirements

- Unit tests for registry resolution; build pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
