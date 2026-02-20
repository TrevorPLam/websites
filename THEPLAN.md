# THEPLAN — Execution Plan for NEW.md Alignment

**Last Updated:** 2026-02-19  
**Purpose:** Authoritative execution plan for aligning the repository with the "Organic Evolution" strategy in [NEW.md](NEW.md).  
**Related:** [THEGOAL.md](THEGOAL.md) (target architecture), [tasks/TASKS.md](tasks/TASKS.md) (task index)

---

## Summary

[NEW.md](NEW.md) defines a **single-track evolutionary path** ("Strangler Fig") over 26 weeks toward a capability-driven, multi-tenant platform. This plan covers: (1) documentation updates, (2) task extraction from NEW.md, (3) updating existing tasks, (4) reprioritization, and (5) implementation order.

---

## 1. Checkpoints (Source of Truth)

| Week | Checkpoint                | Success Criteria                                |
| ---- | ------------------------- | ----------------------------------------------- |
| 0    | Pre-Phase                 | 0-1 (CI), 0-3 (tenant), 0-2 (BookingRepository) |
| 4    | Foundation locked         | Zero lint errors, registries hardened           |
| 10   | Data contracts seeded     | Booking uses canonical types                    |
| 16   | Capability core active    | Features self-declare capabilities              |
| 22   | Universal renderer proven | New client launched on universal                |
| 26   | Platform converged        | Legacy + modern coexist                         |

---

## 2. Documentation Updates

### 2.1 Primary Vision and Direction

| Document                               | Updates                                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [THEGOAL.md](THEGOAL.md)               | Add evolution roadmap section referencing NEW.md; update "136 tasks" framing to "end state via evolutionary phases"; add capability registry, canonical types, universal renderer, legacy bridge. |
| [TODO.md](TODO.md)                     | Reframe waves to align with NEW.md phases; Wave 1-4 maps to Phase 1; add Phase 2-5 checkpoints.                                                                                                   |
| [CLAUDE.md](CLAUDE.md)                 | Add "Evolution Path" subsection; reference NEW.md, 26-week timeline, Strangler Fig; update current phase.                                                                                         |
| [AGENTS.md](AGENTS.md)                 | Add "Read NEW.md for phase/week sequencing before major feature work."                                                                                                                            |
| [.context/RULES.md](.context/RULES.md) | Add rule: "Major changes must fit within NEW.md phase boundaries."                                                                                                                                |

### 2.2 Architecture and Reference

| Document                                                                                   | Updates                                                                                                                                |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/architecture/README.md](docs/architecture/README.md)                                 | Add "Evolution Model" section; Strangler Fig phases; checkpoint table.                                                                 |
| [docs/architecture/evolution-roadmap.md](docs/architecture/evolution-roadmap.md)           | **Create** — Single source of truth for 26-week evolution; extract from NEW.md; add current state, security parallel track, Pre-Phase. |
| [docs/architecture/module-boundaries.md](docs/architecture/module-boundaries.md)           | Add capability layer and data contracts layer.                                                                                         |
| [docs/architecture/page-templates-status.md](docs/architecture/page-templates-status.md)   | Update for capability-based composition; universal renderer path.                                                                      |
| [docs/architecture/client-config-strategy.md](docs/architecture/client-config-strategy.md) | Update for capabilities structure.                                                                                                     |
| [.context/MAP.md](.context/MAP.md)                                                         | Add: Capability Registry, Canonical Types, Universal Renderer, Legacy Bridge.                                                          |

### 2.3 Configuration and Features

| Document                                                                                                   | Updates                                                                                                         |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [docs/configuration/site-config-reference.md](docs/configuration/site-config-reference.md)                 | **Critical** — Add `capabilities`, `pages` structure, `renderer`, `storage` (when schema finalized in Phase 3). |
| [docs/features/booking/usage.md](docs/features/booking/usage.md)                                           | Update for canonical types and repository migration.                                                            |
| [docs/features/booking/ADR-001-booking-extraction.md](docs/features/booking/ADR-001-booking-extraction.md) | Add evolution note: canonical + repository migration.                                                           |
| [docs/platform/golden-path-new-client.md](docs/platform/golden-path-new-client.md)                         | Expand with classic vs universal renderer path.                                                                 |
| [docs/platform/golden-path-new-feature.md](docs/platform/golden-path-new-feature.md)                       | Add defineFeature / capability path.                                                                            |

### 2.4 ADRs and Analysis

| Document                                                                                                   | Updates                                                                                                   |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [docs/adr/0012-canonical-types-data-contracts.md](docs/adr/0012-canonical-types-data-contracts.md)         | **Create** — Canonical types in @repo/types; adapter pattern; no integration types leaking into features. |
| [docs/adr/0006-configuration-as-code-architecture.md](docs/adr/0006-configuration-as-code-architecture.md) | Add "Evolution" note: capability activation extends CaCA per NEW.md.                                      |
| [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md)       | Add evolution phase alignment; map patterns to NEW.md phases.                                             |

### 2.5 Task and Research

| Document                                                   | Updates                                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [tasks/TASKS.md](tasks/TASKS.md)                           | **Major** — Phase-aligned game plan; Organic Evolution Phases as primary sequencing. |
| [tasks/README.md](tasks/README.md)                         | Add evolution alignment to task types.                                               |
| [tasks/RESEARCH-INVENTORY.md](tasks/RESEARCH-INVENTORY.md) | Add R-CANONICAL, R-CAPABILITY.                                                       |

### 2.6 Other Docs

| Document                                                                             | Updates                                                                             |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [docs/research/RESEARCH-INTEGRATION.md](docs/research/RESEARCH-INTEGRATION.md)       | Map research to NEW.md evolution and evol-\* tasks.                                 |
| [docs/migration/template-to-client.md](docs/migration/template-to-client.md)         | Note universal renderer and legacy bridge paths.                                    |
| [docs/design/design-token-architecture.md](docs/design/design-token-architecture.md) | Align token system with evol-2.                                                     |
| [docs/getting-started/onboarding.md](docs/getting-started/onboarding.md)             | Add evolution phases reference.                                                     |
| [docs/resources/glossary.md](docs/resources/glossary.md)                             | Add: capability, canonical type, legacy bridge, universal renderer.                 |
| [CONTRIBUTING.md](CONTRIBUTING.md)                                                   | Add: "Check evolution-roadmap.md for current phase before proposing major changes." |
| [llms.txt](llms.txt)                                                                 | Add evolution-roadmap.md, ADR-012.                                                  |
| [RESEARCH.md](RESEARCH.md)                                                           | Add evolution path reference.                                                       |
| [QWEN.md](QWEN.md)                                                                   | Add NEW.md reference.                                                               |
| [docs/README.md](docs/README.md)                                                     | Fix TASKS.md link to `tasks/TASKS.md`.                                              |

### 2.7 Agent Rules

| Document                                                                       | Updates                                            |
| ------------------------------------------------------------------------------ | -------------------------------------------------- |
| [.cursor/rules/caca-architecture.mdc](.cursor/rules/caca-architecture.mdc)     | Note CaCA evolves via capability activation.       |
| [.cursor/rules/task-execution.mdc](.cursor/rules/task-execution.mdc)           | Add evolution alignment.                           |
| [.windsurf/rules/marketing-websites.md](.windsurf/rules/marketing-websites.md) | Add NEW.md reference.                              |
| [packages/AGENTS.md](packages/AGENTS.md)                                       | Add capability layer to layer model if applicable. |

---

## 3. Tasks to Create (evol-\*)

Create task files per [tasks/README.md](tasks/README.md) canonical format.

### Phase 1 (Weeks 1-4)

| ID     | Title                                       | Notes                                                                                                                                                                                         |
| ------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| evol-1 | Architecture Police (ESLint Rules)          | Use ESLint 9 flat config; enforce no deep imports, no cross-client; warn on integration types in features (ADR-012).                                                                          |
| evol-2 | CVA Completion + Token System               | Complete TODO.md 2.3; Button/variants use CSS vars for capability-ready theming.                                                                                                              |
| evol-3 | Registry Hardening with Capability Metadata | Extend SectionDefinition with requiredFeatures, requiredData, estimatedBundleSize, validateConfig; add resolveForSite. Specify isFeatureEnabled source (site.config.features or new utility). |

### Phase 2 (Weeks 5-10)

| ID     | Title                                           | Notes                                                                                                                                                  |
| ------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| evol-4 | Canonical Types (Lead, Booking)                 | Create packages/types/src/canonical/; LeadAdapter, HubSpotLeadAdapter. Acceptance: getContact() returns CanonicalLead; deprecated getHubSpotContact(). |
| evol-5 | Migrate Booking to Canonical Types + Repository | Use CanonicalBooking, validateBooking, BookingRepository. Coordinate with 0-2 for adapter-friendly interface.                                          |
| evol-6 | Integration Adapter Registry (Formal)           | IntegrationAdapter + IntegrationRegistry in packages/integrations-core; resolve(capability). Merge with inf-10.                                        |

### Phase 3 (Weeks 11-16)

| ID     | Title                                            | Notes                                                                                                                  |
| ------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| evol-7 | Feature → Capability Refactoring (defineFeature) | Create @repo/infra/features; defineFeature; BookingFeature declares provides, configSchema, onActivate. Evolve inf-14. |
| evol-8 | Site Config → Capability Activation              | capabilities array; pages.home sections with capability: 'booking'; extend defineSiteConfig and Zod schema.            |

### Phase 4 (Weeks 17-22)

| ID      | Title                                 | Notes                                                                                                                       |
| ------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| evol-9  | Universal Renderer (New Clients Only) | UniversalPage; activateCapabilities; CapabilityProvider; renderer: 'universal' opt-in.                                      |
| evol-10 | Edge Database Opt-In                  | SmartRepository in packages/infrastructure/storage; storage.edgeCache in site.config. Distinct from c-18 (edge middleware). |

### Phase 5 (Weeks 23-26)

| ID      | Title                                       | Notes                                                                                            |
| ------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| evol-11 | Legacy Bridge (Classic Config → Capability) | migrateLegacyConfig; ClassicPage uses capability orchestration; renders with classic components. |
| evol-12 | Full Platform Convergence                   | Document final architecture; validation; migration path clear.                                   |

---

## 4. Existing Tasks to Update

| Task ID | Update                                                                       |
| ------- | ---------------------------------------------------------------------------- |
| inf-1   | Add "NEW.md Phase 1 (Week 3-4)"; align with evol-3.                          |
| inf-2   | Add "NEW.md Phase 1"; registry hardening.                                    |
| inf-10  | Add "NEW.md Phase 2 (Week 9-10)"; merge with evol-6; reference evol-6.       |
| inf-14  | Add "NEW.md Phase 3 (Week 11-13)"; evolve into capability; reference evol-7. |
| c-5     | Add "NEW.md Phase 1 (Week 2)"; CVA/token completion.                         |
| 0-2     | Add "NEW.md Phase 2 (Week 7-8)"; prerequisite for evol-5.                    |

---

## 5. Reprioritization

**Pre-Phase (Week 0):** 0-1, 0-3, 0-2 — must complete before Phase 1.

**Phase 1 (Weeks 1-4):** evol-1, evol-2, evol-3 (P1); inf-1, inf-2, c-5 (P2).

**Phase 2 (Weeks 5-10):** evol-4, evol-5, evol-6/inf-10 (P1). evol-4 blocked by ADR-012; evol-5 blocked by 0-2, evol-4.

**Phase 3 (Weeks 11-16):** evol-7, evol-8 (P1).

**Phase 4 (Weeks 17-22):** evol-9, evol-10 (P2).

**Phase 5 (Weeks 23-26):** evol-11, evol-12 (P2).

**Security (Parallel):** security-1..7, infrastructure-1..6, compliance-1..2 — run in parallel with Phase 1-2.

---

## 6. Implementation Order

Execute in this sequence:

1. **Current state audit** — Compare TODO.md Waves 1-4 with Phase 1; identify what's done (CVA, tokens, booking providers); adjust evol-1–3 scope.
2. **Create docs/architecture/evolution-roadmap.md** — Single source of truth; current state, Pre-Phase, security parallel track.
3. **Update THEGOAL.md, CLAUDE.md, AGENTS.md** — Direction and evolution references.
4. **Update .context/RULES.md, .context/MAP.md** — Agent rules and concept mappings.
5. **Create evol-\* task files** (evol-1 through evol-12) — Canonical format from tasks/README.md.
6. **Update tasks/TASKS.md** — Phase-aligned game plan; link evol-\* tasks.
7. **Update tasks/README.md, tasks/RESEARCH-INVENTORY.md** — Evolution alignment; R-CANONICAL, R-CAPABILITY.
8. **Update existing tasks** (inf-1, inf-2, inf-10, inf-14, c-5, 0-2) — Phase/week tags.
9. **Create ADR-012** — Before Phase 2 (Week 5).
10. **Update docs/configuration/site-config-reference.md** — When capabilities schema finalized (Phase 3).
11. **Update docs/architecture/_, docs/adr/0006, docs/analysis/_** — Architecture and ADR evolution.
12. **Update docs/features/booking/_, docs/platform/_** — Feature and platform docs.
13. **Update CONTRIBUTING.md, llms.txt, docs/README.md** — Contributing, index, TASKS link fix.
14. **Audit integrations structure** — Confirm packages/integrations-core location for evol-6.
15. **Fix evol-1 spec** — Use flat config (eslint.config.mjs), not .eslintrc.

---

## 7. Risk Mitigation (from NEW.md)

| Risk                      | Mitigation                                            |
| ------------------------- | ----------------------------------------------------- |
| Evolution takes too long  | Each phase has independent value; can stop anytime.   |
| Team resists change       | Each change improves current workflow.                |
| Architecture drifts       | Phase 1 invariants (evol-1) prevent drift.            |
| Migration never completes | Legacy bridge (evol-11) means "complete" is optional. |

---

## 8. Key Gaps and Resolutions

| Gap                     | Resolution                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| Current state vs Week 0 | Audit TODO.md; evolution-roadmap documents "Weeks 1-4 partially complete; adjust evol-1–3." |
| Security sequencing     | Security runs in parallel; does not block Phase 1-2.                                        |
| Pre-Phase blockers      | Week 0 explicitly includes 0-1, 0-3, 0-2.                                                   |
| ESLint format           | evol-1 uses flat config, not .eslintrc.                                                     |
| integrations-core       | Exists; contains retry/circuit-breaker; add adapter-registry. evol-6 specifies package.     |
| 0-2 vs evol-5           | evol-5 extends 0-2; ensure interface accepts CanonicalBooking.                              |
| inf-10 vs evol-6        | evol-6 is formal spec; inf-10 implementation; update inf-10 to reference evol-6.            |

---

## Appendix: Document Counts

| Action                   | Count                          |
| ------------------------ | ------------------------------ |
| Documents to update      | 25+                            |
| New documents            | 2 (evolution-roadmap, ADR-012) |
| New tasks (evol-\*)      | 12                             |
| Existing tasks to update | 6                              |
