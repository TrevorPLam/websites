# 0-3 Fix Tenant Context Implementation (Security)

## Metadata

- **Task ID**: 0-3-fix-tenant-context-security
- **Owner**: AGENT
- **Priority / Severity**: P0
- **Target Release**: Pre-Phase (Week 0); prerequisite for 0-2 tenant-scoped repository
- **Related Epics / ADRs**: NEW.md Pre-Phase, evolution-roadmap, security-1
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-1 (CI green)
- **Downstream Tasks**: 0-2 (tenant-scoped BookingRepository), security-1 (RLS/tenant isolation)

## Context

Tenant context must be correctly implemented so repository queries (0-2) and RLS policies (security-2) can scope data by tenant. Fixes security foundation for multi-tenant data isolation. Per [evolution-roadmap](../docs/architecture/evolution-roadmap.md) Pre-Phase — required before 0-2 can implement tenant-scoped repository queries.

## Dependencies

- 0-1 — CI must be green before merge

## Research

- **2026-02** — Multi-tenant RLS, JWT claims, request context. Tenant resolution via header, subdomain, or JWT. References: [evolution-roadmap](../docs/architecture/evolution-roadmap.md), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), security-2 (RLS).

## Related Files

- `packages/infra/context/` — request/tenant context
- JWT/RLS or production guard for tenant identification
- Client middleware or layout for tenant resolution
- `packages/features/src/booking/` — will consume tenantId from 0-2

## Acceptance Criteria

- [ ] Tenant ID (or equivalent) resolvable per request
- [ ] Tenant context available in server actions and repository layer
- [ ] Single-tenant fallback for clients without multi-tenancy
- [ ] No tenant enumeration or data leakage across tenants
- [ ] Document tenant resolution strategy (JWT, header, subdomain, etc.)

## Technical Constraints

- Must work with existing client structure (starter-template, etc.)
- 0-2 can use `tenantId?: string` — optional until 0-3 provides it
- Security: use same error as "not found" when verification fails (avoid enumeration)

## Sample Code

```typescript
// packages/infra/context/tenant.ts (example shape)
export function getTenantId(): string | undefined {
  // JWT claim, header, or subdomain
  return requestContext.tenantId;
}
```

## Implementation Plan

1. Audit current tenant/request context implementation
2. Implement or fix tenant resolution (JWT, RLS, header, etc.)
3. Expose `getTenantId()` or equivalent from @repo/infra
4. Add single-tenant fallback for pre-multi-tenant clients
5. Document tenant resolution in docs/architecture or infra README
6. Ensure 0-2 can consume tenantId when available

## Testing Requirements

- Unit test for getTenantId (or equivalent) returns expected value per request
- 0-2 can consume tenantId when present; single-tenant fallback when absent
- No tenant enumeration (same error for invalid tenant as "not found")

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Tenant context available where 0-2 needs it
- [ ] Documentation updated
- [ ] 0-2 unblocked for tenant-scoped repository queries
