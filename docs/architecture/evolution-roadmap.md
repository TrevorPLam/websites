<!--
/**
 * @file docs/architecture/evolution-roadmap.md
 * @role docs
 * @summary Single source of truth for 26-week organic evolution (Strangler Fig) toward capability-driven platform.
 *
 * @entrypoints
 * - Authoritative evolution spec; THEPLAN.md references this
 *
 * @depends_on
 * - NEW.md (source content)
 * - THEPLAN executed 2026-02-20; archived
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Evolution Roadmap — Organic Path to Capability Platform

**Last Updated:** 2026-02-19  
**Source:** [NEW.md](../../NEW.md). THEPLAN executed 2026-02-20; see [docs/archive/NEW-THEPLAN-EXTRACTION-INDEX.md](../archive/NEW-THEPLAN-EXTRACTION-INDEX.md).  
**Timeline:** 26 weeks (6 months)  
**Pattern:** Strangler Fig — new system grows around existing, then replaces.

---

## Philosophy

Every change must:

1. **Improve the current system immediately** — No speculative work
2. **Create a migration path** — No dead ends
3. **Build toward the target architecture** — No throwaway work

**Outcome:** Full capability-driven, multi-tenant platform. **Risk:** Low-to-medium (evolutionary, not revolutionary).

---

## Current State (Pre-Execution Audit)

Per [TODO.md](../../TODO.md) — Waves 1-4 status:

| NEW.md Phase 1 Element       | TODO.md Status                                      | Evol-\* Scope Adjustment                                                     |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| Architecture Police (evol-1) | Not implemented                                     | **Full scope** — Create ESLint rules                                         |
| CVA + Token (evol-2)         | Wave 2.3 PARTIAL — 8 components CVA, ~49 remaining  | **Partial** — Complete remaining CVA; ensure CSS vars for capability theming |
| Registry Hardening (evol-3)  | Wave 2.1-2.2 complete (SectionDefinition, registry) | **Add** — requiredFeatures, requiredData, resolveForSite, validateConfig     |
| Design Tokens (c-5)          | Wave 3.1 COMPLETE                                   | evol-2 may reference; c-5 done                                               |
| Booking Provider Registry    | Wave 3.5 COMPLETE                                   | Aligns with evol-6 / inf-10                                                  |

**Conclusion:** Phase 1 (Weeks 1-4) is **partially complete**. evol-1 (Architecture Police) is net-new. evol-2 focuses on remaining CVA migration + capability-ready CSS vars. evol-3 extends existing registry with capability metadata.

---

## Pre-Phase (Week 0)

**Must complete before Phase 1:**

| Task | Purpose                                                              |
| ---- | -------------------------------------------------------------------- |
| 0-1  | Fix Critical CI Failures — CI green                                  |
| 0-3  | Fix Tenant Context — Security foundation                             |
| 0-2  | Replace internalBookings with BookingRepository — Persistent storage |

---

## Phase 1: Foundation Invariants (Weeks 1-4)

**Goal:** Make the system stricter; create hooks for future evolution.

| Week | Task   | Deliverable                                                                                                       |
| ---- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 1    | evol-1 | Architecture Police — ESLint flat config: no deep imports, no cross-client, warn on integration types in features |
| 2    | evol-2 | CVA Completion — Remaining components; Button/variants use CSS vars                                               |
| 3-4  | evol-3 | Registry Hardening — requiredFeatures, requiredData, resolveForSite on SectionDefinition                          |

**Checkpoint Week 4:** Zero lint errors; registries hardened.

---

## Phase 2: Data Contracts Seeding (Weeks 5-10)

**Goal:** Introduce canonical types alongside existing; gradually migrate.

| Week | Task            | Deliverable                                                                                            |
| ---- | --------------- | ------------------------------------------------------------------------------------------------------ |
| 5-6  | evol-4          | Canonical Types — packages/types/src/canonical/; LeadAdapter; HubSpot getContact returns CanonicalLead |
| 7-8  | evol-5          | Booking Canonical — CanonicalBooking, validateBooking, BookingRepository; coordinate with 0-2          |
| 9-10 | evol-6 / inf-10 | Integration Adapter Registry — IntegrationAdapter, IntegrationRegistry in integrations-core            |

**Checkpoint Week 10:** Booking uses canonical types.

**Prerequisite:** ADR-012 (canonical types policy) before evol-4.

---

## Phase 3: Capability Core (Weeks 11-16)

**Goal:** Registry patterns evolve into capability system.

| Week  | Task   | Deliverable                                                                                      |
| ----- | ------ | ------------------------------------------------------------------------------------------------ |
| 11-13 | evol-7 | defineFeature — @repo/infra/features; BookingFeature declares provides, configSchema, onActivate |
| 14-16 | evol-8 | Site Config Capability Activation — capabilities array; pages.home with capability: 'booking'    |

**Checkpoint Week 16:** Features self-declare capabilities.

---

## Phase 4: Universal Renderer (Weeks 17-22)

**Goal:** New clients use universal renderer; existing unchanged.

| Week  | Task    | Deliverable                                                                                                |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------- |
| 17-19 | evol-9  | Universal Renderer — UniversalPage; activateCapabilities; CapabilityProvider; renderer: 'universal' opt-in |
| 20-22 | evol-10 | Edge Database Opt-In — SmartRepository; storage.edgeCache in site.config                                   |

**Checkpoint Week 22:** New client launched on universal renderer.

---

## Phase 5: Platform Convergence (Weeks 23-26)

**Goal:** Legacy clients become capability-compatible wrappers.

| Week  | Task    | Deliverable                                                                    |
| ----- | ------- | ------------------------------------------------------------------------------ |
| 23-24 | evol-11 | Legacy Bridge — migrateLegacyConfig; ClassicPage uses capability orchestration |
| 25-26 | evol-12 | Full Platform — Document final architecture; migration path clear              |

**Checkpoint Week 26:** Legacy + modern coexist.

---

## Security and Infrastructure (Parallel Track)

**Does NOT block Phase 1-2.** Run in parallel:

- security-1..7
- infrastructure-1..6
- compliance-1..2

---

## Checkpoint Sign-Off

| Week              | Action                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| 4, 10, 16, 22, 26 | Run `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`; update status in `tasks/updates/`. |

---

## Rollback

Each phase delivers independent value. To rollback Phase N: revert to last checkpoint; no Phase N+1 work merged.

---

## Risk Mitigation

| Risk                      | Mitigation                                           |
| ------------------------- | ---------------------------------------------------- |
| Evolution takes too long  | Each phase has independent value; can stop anytime   |
| Team resists change       | Each change improves current workflow                |
| Architecture drifts       | Phase 1 invariants (evol-1) prevent drift            |
| Migration never completes | Legacy bridge (evol-11) means "complete" is optional |
