<!--
/**
 * @file docs/adr/0012-canonical-types-data-contracts.md
 * @role docs/adr
 * @summary Decision record for canonical types and data contracts in @repo/types.
 *          Integration-specific types must not leak into features; use adapters.
 *
 * @depends_on
 * - NEW.md (Phase 2)
 * - evol-4, evol-5
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# ADR 0012: Canonical Types and Data Contracts

**Status:** Accepted
**Date:** 2026-02-19
**Task:** evol-4 (Canonical Types)

## Context

Integrations (HubSpot, Supabase, Calendly, etc.) expose provider-specific types. When features (e.g. contact, booking) consume these directly, they become coupled to a single integration. Swapping HubSpot for another CRM requires code changes across features. Type safety is also undermined when `any` or provider types leak across package boundaries.

## Decision

Adopt **canonical types** in `@repo/types` with an **adapter pattern** for integrations.

1. **Canonical types** — Define domain-neutral types (e.g. `CanonicalLead`, `CanonicalBooking`) in `packages/types/src/canonical/` with Zod schemas for runtime validation.
2. **Adapter interface** — Each integration implements `XAdapter<T>` with `fromExternal(external: T) => Canonical` and `toExternal(canonical: Canonical) => T`.
3. **No integration types in features** — Features import from `@repo/types` only. Integration packages provide adapters; features never import `HubSpotContact`, `SupabaseRow`, etc.
4. **ESLint enforcement** — evol-1 (Architecture Police) warns when integration types are imported into features packages.

## Consequences

### Positive

- **Integration swappability**: Replace HubSpot with another CRM by implementing a new adapter; features unchanged.
- **Type safety**: Canonical types are validated at boundaries; no `any` propagation.
- **Testability**: Features can be tested with mock canonical data; no integration mocks required.
- **Single source of truth**: Domain concepts defined once in @repo/types.

### Negative / Trade-offs

- **Adapter maintenance**: Each integration change may require adapter updates.
- **Mapping overhead**: Adapters add a translation layer; minor performance cost at boundaries.
- **Migration effort**: Existing features using integration types must migrate (evol-5 for booking).

### Neutral

- **Gradual migration**: Canonical types are introduced alongside existing types; deprecated functions retained until migration complete.

## Implementation

- **Location**: `packages/types/src/canonical/` — lead.ts, booking.ts, etc.
- **Adapter example**: `HubSpotLeadAdapter: LeadAdapter<HubSpotContact>`
- **Integration API**: `getContact()` returns `CanonicalLead`; `getHubSpotContact()` deprecated.
- **Enforcement**: evol-1 ESLint rule warns on `@repo/integrations-hubspot` import of `HubSpotContact` in `@repo/features`.

## References

- NEW.md (Phase 2, Weeks 5-6)
- evol-4-canonical-types, evol-5-booking-canonical-migration
- packages/types/src/canonical/
- packages/integrations/hubspot/
