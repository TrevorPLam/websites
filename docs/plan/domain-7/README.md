# Domain 7: MULTI-TENANCY

## Overview

This domain covers multi-tenancy aspects of the marketing-first multi-client multi-site monorepo.

## Sections

- [7.1 Philosophy](7.1-philosophy.md)
- [7.2 Complete Tenant Resolution — `packages/multi-tenant/src/resolve-tenant.ts`](7.2-complete-tenant-resolution-packagesmulti-tenantsrcresolve-tenantts.md)
- [7.3 Billing Status Check — `packages/multi-tenant/src/check-billing.ts`](7.3-billing-status-check-packagesmulti-tenantsrccheck-billingts.md)
- [7.4 Tenant Suspension Pattern](7.4-tenant-suspension-pattern.md)
- [7.5 Noisy Neighbor Prevention — Complete Rate Limiting](7.5-noisy-neighbor-prevention-complete-rate-limiting.md)
- [7.6 Vercel for Platforms — Programmatic Domain Lifecycle](7.6-vercel-for-platforms-programmatic-domain-lifecycle.md)
- [7.7 Multi-Tenant Auth with SAML 2.0 Enterprise SSO](7.7-multi-tenant-auth-with-saml-20-enterprise-sso.md)
- [7.8 Complete Tenant Resolution Sequence Diagram](7.8-complete-tenant-resolution-sequence-diagram.md)
- [7.9 Routing Comparison — Subdomain vs Path vs Custom Domain](7.9-routing-comparison-subdomain-vs-path-vs-custom-domain.md)
- [7.10 Per-Tenant Dynamic Data Flow Summary](7.10-per-tenant-dynamic-data-flow-summary.md)

## Priority

**P0 (Week 1)** — Foundation for entire platform.

## Dependencies

None - this is the foundational domain that all other domains depend on.
