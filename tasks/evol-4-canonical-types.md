# EVOL-4 Canonical Types (Lead, Booking)

## Metadata

- **Task ID**: evol-4-canonical-types
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 2 (Weeks 5-6)
- **Related Epics / ADRs**: ROADMAP Phase 2, ADR-012
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: ADR-012 (create first)
- **Downstream Tasks**: evol-5, evol-6

## Context

Introduce canonical types alongside existing integration-specific types. Enables integration swappability and type safety. Per ROADMAP Phase 2 Weeks 5-6: CanonicalLead, LeadAdapter, HubSpotLeadAdapter; getContact returns CanonicalLead.

## Dependencies

- ADR-012 (canonical types policy) — create before implementation

## Research

- **Primary topics**: [R-CANONICAL](RESEARCH-INVENTORY.md#r-canonical) (to add), [R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod).
- **[2026-02]** Zod schema + z.infer; adapter pattern from HubSpot to canonical.
- **References**: ROADMAP Phase 2 Weeks 5-6, [docs/adr/0012-canonical-types-data-contracts.md](../docs/adr/0012-canonical-types-data-contracts.md).

## Related Files

- `packages/types/src/canonical/lead.ts` – create
- `packages/types/src/canonical/booking.ts` – create
- `packages/types/src/index.ts` – export canonical
- `packages/integrations/hubspot/` – modify (adapter, getContact)

## Acceptance Criteria

- [ ] CanonicalLeadSchema, CanonicalBookingSchema in @repo/types
- [ ] LeadAdapter<T> interface, HubSpotLeadAdapter implementation
- [ ] getContact() returns CanonicalLead; deprecated getHubSpotContact() in HubSpot integration
- [ ] Exported from @repo/types
- [ ] Tests for schemas and adapters

## Technical Constraints

- Zod for runtime validation
- Adapter pattern: fromExternal, toExternal
- No breaking changes to features until evol-5 migrates

## Implementation Plan

- [ ] Create packages/types/src/canonical/ directory
- [ ] Implement lead.ts (schema, adapter interface, HubSpotLeadAdapter)
- [ ] Implement booking.ts (schema)
- [ ] Update HubSpot integration: getContact returns CanonicalLead
- [ ] Deprecate getHubSpotContact
- [ ] Export from @repo/types
- [ ] Add tests

## Sample code / examples

```typescript
// packages/types/src/canonical/lead.ts
export const CanonicalLeadSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string(),
  email: z.string().email(),
  source: z.string(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'archived']),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type CanonicalLead = z.infer<typeof CanonicalLeadSchema>;

export interface LeadAdapter<T> {
  fromExternal: (external: T) => CanonicalLead;
  toExternal: (canonical: CanonicalLead) => T;
}
```

## Testing Requirements

- Unit tests for schemas, adapters; integration test for getContact.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
