# EVOL-10 Edge Database Opt-In

## Metadata

- **Task ID**: evol-10-edge-database-opt-in
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 4 (Weeks 20-22)
- **Related Epics / ADRs**: NEW.md Phase 4, evol-5
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-5 (BookingRepository)
- **Downstream Tasks**: evol-12

## Context

Implement SmartRepository that chooses storage based on tenant config. storage.edgeCache: true → edge reads (e.g. Turso); writes to Supabase + async cache invalidation. Per NEW.md Weeks 20-22. Distinct from c-18 (edge middleware).

## Dependencies

- evol-5 (BookingRepository abstracts storage)
- packages/infrastructure/ or new packages/infrastructure/storage/

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Turso or similar for sub-10ms reads; Supabase source of truth for writes.
- **References**: NEW.md Weeks 20-22.

## Related Files

- `packages/infrastructure/storage/src/strategy.ts` – create (or infra package)
- `packages/types/src/site-config.ts` – add storage?: { primary?, edgeCache? }
- `packages/features/src/booking/lib/repository.ts` – use SmartRepository when configured

## Acceptance Criteria

- [ ] SmartRepository<T> with read/write
- [ ] read: edgeDb when edgeCache && isEdgeAvailable; else Supabase
- [ ] write: always Supabase; async invalidate edge cache if edgeCache
- [ ] storage.edgeCache in site.config
- [ ] Tenant config drives behavior
- [ ] Document opt-in and setup

## Technical Constraints

- Writes always to source of truth (Supabase)
- Edge for reads only (cache layer)
- isEdgeAvailable(tenantId) check

## Implementation Plan

- [ ] Create storage package or module
- [ ] Implement SmartRepository
- [ ] Add storage config to SiteConfig
- [ ] Wire BookingRepository to SmartRepository when configured
- [ ] Implement edge cache invalidation
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
export class SmartRepository<T> {
  async read(query: Query): Promise<T[]> {
    if (this.config.edgeReads && isEdgeAvailable(this.tenantId)) return edgeDb.query(query);
    return supabase.from(this.table).select('*').match(query);
  }
  async write(data: T): Promise<void> {
    await supabase.from(this.table).insert(data);
    if (this.config.edgeReads) await invalidateEdgeCache(this.tenantId, this.table);
  }
}
```

## Testing Requirements

- Unit tests for SmartRepository; mock Supabase/edge.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
