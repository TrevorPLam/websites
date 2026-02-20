# NEW.md + THEPLAN.md — Extraction Index

**Date:** 2026-02-20  
**Purpose:** Verification that all information from NEW.md and THEPLAN.md has been extracted into authoritative docs, tasks, and ADRs.  
**Status:** Complete — all items captured.

---

## NEW.md Extraction

### Philosophy and Principles

| NEW.md Content                                                                    | Extracted To                                                                                 |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 3 evolution principles (improve immediately, migration path, build toward target) | [THEGOAL.md](../../THEGOAL.md), [evolution-roadmap.md](../architecture/evolution-roadmap.md) |
| Timeline 26 weeks, Risk low-to-medium, Outcome capability platform                | THEGOAL.md, evolution-roadmap.md                                                             |
| Strangler Fig phase metaphor (Seed→Roots→Trunk→Branches→Canopy)                   | THEGOAL.md, evolution-roadmap.md                                                             |

### Phase 1 (Weeks 1-4)

| NEW.md Content                                                                | Extracted To                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Week 1: Architecture Police (ESLint, no deep imports, warn integration types) | [evol-1-architecture-police.md](../../tasks/evol-1-architecture-police.md), evolution-roadmap.md |
| Week 2: CVA + Token (CSS vars for capability theming)                         | [evol-2-cva-token-completion.md](../../tasks/evol-2-cva-token-completion.md)                     |
| Week 3-4: Registry Hardening (requiredFeatures, resolveForSite)               | [evol-3-registry-capability-metadata.md](../../tasks/evol-3-registry-capability-metadata.md)     |
| SectionDefinition interface + capability metadata                             | evol-3 task, [page-templates registry](../../packages/page-templates/src/)                       |

### Phase 2 (Weeks 5-10)

| NEW.md Content                                                   | Extracted To                                                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Week 5-6: Canonical Types (CanonicalLead, LeadAdapter, HubSpot)  | [evol-4-canonical-types.md](../../tasks/evol-4-canonical-types.md), [ADR-012](../adr/0012-canonical-types-data-contracts.md)                                       |
| Week 7-8: Booking migration (validateBooking, BookingRepository) | [evol-5-booking-canonical-migration.md](../../tasks/evol-5-booking-canonical-migration.md), [0-2](../../tasks/0-2-replace-internal-bookings-persistent-storage.md) |
| Week 9-10: IntegrationAdapter, IntegrationRegistry               | [evol-6-integration-adapter-registry.md](../../tasks/evol-6-integration-adapter-registry.md)                                                                       |

### Phase 3 (Weeks 11-16)

| NEW.md Content                                             | Extracted To                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Week 11-13: defineFeature, featureRegistry, BookingFeature | [evol-7-define-feature.md](../../tasks/evol-7-define-feature.md)                                       |
| Week 14-16: capabilities array, pages with capability refs | [evol-8-site-config-capability-activation.md](../../tasks/evol-8-site-config-capability-activation.md) |
| defineSiteConfig, capabilities schema                      | evol-8, [site-config-reference.md](../configuration/site-config-reference.md) (Phase 3 note)           |

### Phase 4 (Weeks 17-22)

| NEW.md Content                                                         | Extracted To                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Week 17-19: UniversalPage, activateCapabilities, renderer: 'universal' | [evol-9-universal-renderer.md](../../tasks/evol-9-universal-renderer.md)       |
| Week 20-22: SmartRepository, storage.edgeCache                         | [evol-10-edge-database-opt-in.md](../../tasks/evol-10-edge-database-opt-in.md) |

### Phase 5 (Weeks 23-26)

| NEW.md Content                                                      | Extracted To                                                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Week 23-24: migrateLegacyConfig, ClassicPage, ClassicSectionAdapter | [evol-11-legacy-bridge.md](../../tasks/evol-11-legacy-bridge.md)                                     |
| Week 25-26: Full platform architecture diagram                      | [evol-12-full-platform-convergence.md](../../tasks/evol-12-full-platform-convergence.md), THEGOAL.md |

### Synthesis, Risk, Checkpoints

| NEW.md Content                              | Extracted To                               |
| ------------------------------------------- | ------------------------------------------ |
| "How We Got Here" synthesis table           | THEGOAL.md § How We Get There              |
| Risk Mitigation table                       | THEGOAL.md § Risk Mitigation               |
| Final Checkpoints (weeks 4, 10, 16, 22, 26) | evolution-roadmap.md, THEGOAL.md, TASKS.md |

---

## THEPLAN.md Extraction

### Checkpoints

| THEPLAN Content            | Extracted To                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Week 0-26 checkpoint table | [evolution-roadmap.md](../architecture/evolution-roadmap.md), [THEGOAL.md](../../THEGOAL.md), [TASKS.md](../../tasks/TASKS.md) |

### Documentation Updates (Section 2)

| THEPLAN Doc                                     | Status                 | Primary Location                                |
| ----------------------------------------------- | ---------------------- | ----------------------------------------------- |
| THEGOAL.md                                      | ✅ Done                | THEGOAL.md                                      |
| TODO.md                                         | ✅ Done                | TODO.md                                         |
| CLAUDE.md                                       | ✅ Done                | CLAUDE.md                                       |
| AGENTS.md                                       | ✅ Done                | AGENTS.md                                       |
| .context/RULES.md                               | ✅ Done                | .context/RULES.md                               |
| docs/architecture/\*                            | ✅ Done                | evolution-roadmap, module-boundaries, etc.      |
| site-config-reference                           | ✅ Done (Phase 3 note) | docs/configuration/site-config-reference.md     |
| docs/features/booking/\*                        | ✅ Done                | usage.md, ADR-001                               |
| docs/platform/golden-path-\*                    | ✅ Done                | golden-path-new-client, golden-path-new-feature |
| docs/adr/0012                                   | ✅ Done                | docs/adr/0012-canonical-types-data-contracts.md |
| docs/adr/0006                                   | ✅ Done                | Evolution note added                            |
| tasks/TASKS.md, README, RESEARCH-INVENTORY      | ✅ Done                | tasks/                                          |
| CONTRIBUTING, llms, docs/README, RESEARCH, QWEN | ✅ Done                | Root and docs                                   |
| .cursor/rules, .windsurf, packages/AGENTS       | ✅ Done                | Respective files                                |

### Tasks Created (Section 3)

| THEPLAN Task           | Task File           | Status          |
| ---------------------- | ------------------- | --------------- |
| evol-1 through evol-12 | tasks/evol-\*.md    | ✅ All 12 exist |
| 0-1, 0-3, 0-2          | tasks/0-1, 0-3, 0-2 | ✅ All exist    |

### Existing Tasks Updated (Section 4)

| THEPLAN Task             | Status                    |
| ------------------------ | ------------------------- |
| inf-1 (Phase 1, evol-3)  | ✅ Phase tags in task     |
| inf-2 (Phase 1)          | ✅ Phase tags             |
| inf-10 (Phase 2, evol-6) | ✅ Phase tags, evol-6 ref |
| inf-14 (Phase 3, evol-7) | ✅ Phase tags, evol-7 ref |
| c-5 (Phase 1, Week 2)    | ✅ Phase tags             |
| 0-2 (Phase 2, evol-5)    | ✅ Phase tags             |

### Reprioritization (Section 5)

| THEPLAN Content                 | Extracted To                   |
| ------------------------------- | ------------------------------ |
| Pre-Phase, Phase 1-5 sequencing | TASKS.md, evolution-roadmap.md |
| Security parallel track         | evolution-roadmap.md, TASKS.md |

### Implementation Order (Section 6)

| Step                                                   | Status                                  |
| ------------------------------------------------------ | --------------------------------------- |
| 1. Current state audit                                 | ✅ evolution-roadmap.md § Current State |
| 2. Create evolution-roadmap                            | ✅ Done                                 |
| 3. Update THEGOAL, CLAUDE, AGENTS                      | ✅ Done                                 |
| 4. Update .context                                     | ✅ Done                                 |
| 5. Create evol-\* tasks                                | ✅ All 12                               |
| 6. Update TASKS.md                                     | ✅ Done                                 |
| 7. Update tasks/README, RESEARCH-INVENTORY             | ✅ Done                                 |
| 8. Update existing tasks                               | ✅ Done                                 |
| 9. Create ADR-012                                      | ✅ Done                                 |
| 10. site-config-reference (Phase 3)                    | ✅ Forward note                         |
| 11–15. Remaining docs, integrations audit, evol-1 spec | ✅ Done                                 |

### Gaps and Resolutions (Section 8)

| THEPLAN Gap             | Resolution Location                  |
| ----------------------- | ------------------------------------ |
| Current state vs Week 0 | evolution-roadmap.md § Current State |
| Security sequencing     | evolution-roadmap.md                 |
| Pre-Phase blockers      | TASKS.md, evolution-roadmap.md       |
| ESLint format           | evol-1 uses flat config              |
| integrations-core       | evol-6, THEPLAN §8                   |
| 0-2 vs evol-5           | evol-5, 0-2 task files               |
| inf-10 vs evol-6        | evol-6, inf-10                       |

---

## Authoritative Sources (Post-Extraction)

| Topic                                     | Primary Source                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| Evolution phases, checkpoints, philosophy | [docs/architecture/evolution-roadmap.md](../architecture/evolution-roadmap.md) |
| Target architecture, end state            | [THEGOAL.md](../../THEGOAL.md)                                                 |
| Task index, execution order               | [tasks/TASKS.md](../../tasks/TASKS.md)                                         |
| Source content (reference)                | [NEW.md](../../NEW.md)                                                         |
| Executed plan (historical)                | [docs/archive/THEPLAN-2026-02-19-executed.md](THEPLAN-2026-02-19-executed.md)  |
