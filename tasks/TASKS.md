# Open Tasks Index

**Last Updated:** 2026-02-19  
**Total Active Tasks:** ~122  
**Completed Tasks:** 9 (archived)  
**Purpose:** Comprehensive task inventory with strategized execution game plan. Each row links to the task file. See [README.md](README.md) for task structure and [VERIFICATION.md](VERIFICATION.md) for the completion checklist.

**Note:** Tasks marked with ✅ are completed and archived. See [archive/COMPLETED_TASKS_INDEX.md](archive/COMPLETED_TASKS_INDEX.md) for details.

---

## 🎯 Execution Game Plan

**Last Updated:** 2026-02-19  
**Purpose:** Optimize task execution through batching, automation, and dependency-aware sequencing.  
**Status:** All tasks extracted from TODO.md and ANALYSIS.md. Game plan reflects current state with completed tasks archived.

**Advanced Code Patterns (2026-02-19):** See [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](../docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md) for pattern inventory and tiered recommendations. Execution waves and sequencing are in [TODO.md](../TODO.md). Individual tasks (inf-1, inf-2, inf-4, inf-8, inf-10, inf-12, c-5, f-21) include an "Advanced Code Pattern Expectations" section with updated research and acceptance criteria.

**Organic Evolution (2026-02-19):** Primary sequencing per [NEW.md](../NEW.md) and [docs/architecture/evolution-roadmap.md](../docs/architecture/evolution-roadmap.md). 26-week Strangler Fig path. evol-\* tasks define phase deliverables. Security/Phase 0 runs in parallel.

| Phase     | Weeks | Tasks                  | Checkpoint                  |
| --------- | ----- | ---------------------- | --------------------------- |
| Pre-Phase | 0     | 0-1, 0-3, 0-2          | CI green, BookingRepository |
| Phase 1   | 1-4   | evol-1, evol-2, evol-3 | Foundation locked           |
| Phase 2   | 5-10  | evol-4, evol-5, evol-6 | Data contracts seeded       |
| Phase 3   | 11-16 | evol-7, evol-8         | Capability core active      |
| Phase 4   | 17-22 | evol-9, evol-10        | Universal renderer proven   |
| Phase 5   | 23-26 | evol-11, evol-12       | Platform converged          |

**evol-\* task files:** [evol-1](evol-1-architecture-police.md) · [evol-2](evol-2-cva-token-completion.md) · [evol-3](evol-3-registry-capability-metadata.md) · [evol-4](evol-4-canonical-types.md) · [evol-5](evol-5-booking-canonical-migration.md) · [evol-6](evol-6-integration-adapter-registry.md) · [evol-7](evol-7-define-feature.md) · [evol-8](evol-8-site-config-capability-activation.md) · [evol-9](evol-9-universal-renderer.md) · [evol-10](evol-10-edge-database-opt-in.md) · [evol-11](evol-11-legacy-bridge.md) · [evol-12](evol-12-full-platform-convergence.md)

---

### Pre-Phase: Critical Blockers (Must Complete First - Unblocks All Work)

**Tasks:** `0-1`, `0-3`, `0-2`

**Strategy:** Sequential execution — CI must be green before any substantial work can be merged. These tasks fix blocking CI/build/security issues that prevent all other work.

**Execution Order:**

1. **0-1** (Fix Critical CI Failures) — P0 — Unblocks all merges
   - Run `pnpm type-check`, `pnpm build`, `pnpm test` to identify current failures
   - Fix TypeScript errors, build errors, test failures
   - CI must be green before proceeding
2. **0-3** (Fix Tenant Context) — P0 — Security fix for tenant scoping
   - Fixes tenant context implementation (JWT/RLS or production guard)
   - Required before 0-2 can implement tenant-scoped repository queries
3. **0-2** (Replace internalBookings) — P0 — Persistent storage foundation
   - Creates `BookingRepository` interface with tenant-scoped queries
   - Required before security-1 can wrap booking actions

**Estimated Timeline:** 3-5 days (Week 0)

---

### Phase 0: Security Foundation (Critical Security - Wave 1)

**Tasks:** `security-1`, `security-2`, `security-3`, `security-4`, `security-5`, `security-6`, `security-7`, `infrastructure-1`, `infrastructure-2`, `infrastructure-3`, `infrastructure-4`, `infrastructure-5`, `infrastructure-6`, `compliance-1`, `compliance-2`

**Strategy:** Sequential execution with parallel work where dependencies allow. These address critical security gaps identified in research (perplexity research Topics #1, #3, #7, #16, #20, #21, #22; ChatGPT/Gemini research on pnpm security, React Taint API, middleware bypass, Partytown, Pact, Scaffold MCP, CCPA 2026, EU AI Act).

**Dependencies:**

- **security-1** (Server Action Hardening) → **security-2** (RLS), **security-6** (React Taint API), **infrastructure-1** (Observability)
- **security-1** → **security-3** (Webhooks), **security-7** (Middleware Bypass)
- **security-2** → **infrastructure-2** (E2E Testing - tenant isolation tests)
- **security-3** → **infrastructure-3** (Integration Resilience - idempotency complements retry)
- **security-4** (Consent Management) → **infrastructure-4** (Partytown), **compliance-1** (CCPA 2026)
- **security-5** (pnpm Security) — Independent, quick win
- **infrastructure-5** (Contract Testing) — Independent, can work in parallel
- **infrastructure-6** (Scaffold MCP) — Independent, enables better AI-assisted development
- **compliance-2** (EU AI Act) — Relates to ai-platform packages (future work)

**Execution Order:**

1. **security-5** (pnpm Supply Chain Hardening) — Quick win (S effort)
   - Configure `allowBuilds` and `blockExoticSubdeps` in pnpm-workspace.yaml
   - Prevents supply chain attacks
2. **security-1** (Server Action Hardening) — Foundation for all security tasks
   - Creates `secureAction` wrapper pattern
   - Adds tenant-scoped queries
   - Adds security audit logging
3. **security-6** (React Taint API) — After security-1
   - Integrates with secureAction wrapper
   - Prevents sensitive data leakage
4. **security-7** (Middleware Bypass Mitigation) — After security-1
   - Uses secureAction pattern for DAL verification
   - Defense-in-depth against CVE-2025-29927
5. **security-2** (Multi-Tenant RLS) — Can start in parallel with security-1
   - RLS policies complement secureAction
   - Database-level tenant isolation
6. **security-3** (Webhook Security) — After security-1
   - Uses secureAction pattern
   - Unified verification framework
7. **security-4** (Consent Management) — Independent
   - ScriptManager component
   - GDPR/CCPA compliance
8. **infrastructure-1** (Observability) — After security-1
   - Uses audit logs from secureAction
   - OpenTelemetry integration
9. **infrastructure-2** (E2E Testing) — After security-2
   - Tests tenant isolation (requires RLS)
   - Playwright test harness
10. **infrastructure-3** (Integration Resilience) — After security-3
    - Retry/circuit breaker complements webhook idempotency
11. **infrastructure-4** (Partytown Integration) — After security-4
    - Offloads consent-gated scripts to Web Workers
    - Improves Core Web Vitals (INP)
12. **infrastructure-5** (Contract Testing with Pact) — Independent
    - Consumer-driven contract tests
    - Prevents API breakage
13. **infrastructure-6** (Scaffold MCP) — Independent
    - AI-assisted development governance
    - Enforces architectural patterns
14. **compliance-1** (CCPA 2026 Updates) — After security-4
    - DROP integration
    - Expanded lookback support
15. **compliance-2** (EU AI Act) — Future work
    - Relates to ai-platform packages
    - Governance framework and human review workflows

**Estimated Timeline:** 3-4 weeks for all security/infrastructure/compliance tasks (Wave 1 priority)

**Note:** Phase 0 (Security) must follow Pre-Phase (0-1, 0-3, 0-2) — CI must be green and tenant context fixed before security work can be merged.

---

### Phase 2: Foundation Infrastructure (Enable Downstream Work)

**Batch A: Registry Pattern Implementation** (High Automation Potential)

**Tasks:** `inf-1`, `inf-2`, `inf-3`, `inf-5`, `inf-6`, `inf-8`, `inf-10`, `inf-11`, `inf-15`

**Pattern Analysis:** All follow similar registry pattern:

- Map-based registry (`Map<string, Component>` or similar)
- Discovery/resolution functions
- Config-driven registration
- Fallback logic for unknown IDs
- Export from package index

**Automation Strategy (Phased ROI):**

1. **Phase 1: Manual baseline** — Implement **inf-1** manually using `packages/page-templates/src/registry.ts` as reference
2. **Phase 2: Extract template** — Create `scripts/generate-registry.sh` after inf-1 is complete:

   ```bash
   scripts/generate-registry.sh <registry-name> <registry-type> <package-path>
   ```

   - Generates: `registry.ts`, `types.ts`, `__tests__/registry.test.ts`
   - Templates based on `packages/page-templates/src/registry.ts` pattern
   - Customizes for: sections, variants, fonts, families, blocks, layouts, integrations, catalogs, schemas

3. **Phase 3: Validate ROI** — Apply template to inf-2, inf-3; measure time savings (target: 60-70%)
4. **Phase 4: Scale** — If validated, create `batch-create-registries.sh` and proceed with remaining registry tasks

5. **Batch execution order:**
   - **inf-1** (Dynamic Section Registry) — extends existing `packages/page-templates/src/registry.ts`
   - **inf-2** (Component Variant Schema) — modifies same registry + types
   - **inf-3** (Font Registry) — new registry in `packages/config/` or `packages/ui/`
   - **inf-5** (Marketing Component Family) — `packages/marketing-components/src/`
   - **inf-6** (Block/Content Type) — `packages/features/content/` or new package
   - **inf-8-layout-registry** (Layout Template Registry) — `packages/page-templates/src/`
   - **inf-10** (Integration Adapter) — `packages/integrations/*/` (multiple packages)
   - **inf-11** (Component Catalog) — discovery layer
   - **inf-15** (Structured Data Schema) — `packages/industry-schemas/` or new

**Note:** `inf-8-layout-registry` (P2) is distinct from `inf-8-integration-aware-csp-generation` (P1). Batch A uses the layout registry task.

**Estimated Efficiency Gain:** 60-70% time reduction vs. manual implementation. Create template once, customize per task.

**Batch B: Design Token & Theme System** (Sequential Dependency)

**Tasks:** `c-5-design-tokens`, `inf-4`, `inf-12`, `inf-13`

**Note:** `c-5-design-tokens` (P2) is distinct from `c-5-configure-turbo-remote-cache` (P1). Batch B uses the design tokens task.

**Dependencies:** `c-5-design-tokens` → `inf-4` → `inf-12` → `inf-13`

**Strategy:**

- **c-5-design-tokens** creates base token architecture (3 CSS files)
- **inf-4** adds override mechanism
- **inf-12** builds preset library on tokens
- **inf-13** adds animation presets (depends on f-6)

**Execution:** Sequential, but CSS files can be created in batch. Use template for consistent structure.

---

### Phase 3: CLI & Tooling (Script-Driven)

**Batch C: CLI Generators** (High Automation Potential)

**Tasks:** `6-8a`, `6-8b`, `6-8c`, `6-8d`, `6-8e`

**Pattern Analysis:** All involve CLI tool creation:

- **6-8a**: Plop generator (`turbo gen new-client`)
- **6-8b**: pnpm script wrapper (`pnpm create-client`)
- **6-8c**: Validation CLI (`validate-site-config`)
- **6-8d**: Component generator (`generate-component`)
- **6-8e**: Health check wiring

**Automation Strategy:**

1. **Create CLI scaffolding script:**

   ```bash
   scripts/generate-cli-tool.sh <tool-name> <package-path> <command-name>
   ```

   - Generates: CLI entry point, command handler, tests, package.json script
   - Uses `commander` or `yargs` pattern
   - Integrates with Turbo/pnpm

2. **Batch execution:**
   - Implement all CLI tools in parallel (different packages/commands)
   - Test each independently
   - Wire to package.json scripts together

**Estimated Efficiency Gain:** 50% time reduction — shared CLI infrastructure, consistent patterns.

**Batch D: Cleanup & Audit Tasks**

**Tasks:** `6-9a`, `6-9b`, `6-9c`, `6-1a`

**Strategy:** Can be done in parallel — all are audit/cleanup:

- **6-9a**: Search codebase for `NotImplementedPlaceholder`, remove if unused
- **6-9b**: Refine knip config (single config file)
- **6-9c**: Update docs (single doc file)
- **6-1a**: Audit stale references (grep-based)

**Execution:** Parallel grep/search operations, then batch edits.

---

### Phase 4: Feature Systems (Template-Based)

**Batch E: Feature System Implementations**

**Tasks:** `f-6`, `f-7`, `f-8`, `f-9`

**Pattern Analysis:** All create system packages with:

- Core utilities/functions
- Presets/configurations
- Hooks (React)
- Type definitions
- Tests

**Automation Strategy:**

1. **Create feature system template:**

   ```bash
   scripts/generate-feature-system.sh <system-name> <package-path>
   ```

   - Generates: `index.ts`, `presets.ts`, `hooks.ts`, `types.ts`, `__tests__/`
   - Based on `f-6-animation-system` structure

2. **Batch execution:**
   - Create all 4 systems in parallel (different packages)
   - Customize per system requirements
   - Test independently

**Estimated Efficiency Gain:** 40-50% time reduction — shared structure, consistent exports.

**Batch F: Architecture Packages**

**Tasks:** `c-8`, `c-9`, `c-10`, `c-17`, `c-18`, `e-7`

**Strategy:** Each creates a new package or extends `@repo/infra`:

- **c-8**: `packages/infra/experiments/` (3 files + tests)
- **c-9**: `packages/features/personalization/` (new feature module)
- **c-10**: `packages/features/content/` (CMS abstraction)
- **c-17**: `packages/features/compliance/` + `packages/types/compliance-packs/`
- **c-18**: `packages/infra/edge/` (middleware primitives)
- **e-7**: `packages/infra/ops/` (queue policy)

**Execution:** Can be done in parallel (different packages). Use feature module template for c-9, c-10, c-17.

---

### Phase 5: Documentation (Batch Creation)

**Batch G: Documentation Files**

**Tasks:** `docs-6-1`, `docs-c2`, `docs-c3`, `docs-c18`, `docs-readme-architecture-diagram`

**Pattern Analysis:** All create markdown docs with structured headers per `tasks/README.md`.

**Automation Strategy:**

1. **Create doc template generator:**

   ```bash
   scripts/generate-doc.sh <doc-path> <doc-type> <related-tasks>
   ```

   - Generates: Structured markdown with file header (@file, @role, @summary, etc.)
   - Fills in template from task metadata
   - Runs `pnpm validate-docs` after creation

2. **Batch execution:**
   - Generate all 5 docs in parallel
   - Fill content per task requirements
   - Validate together

**Estimated Efficiency Gain:** 70% time reduction — template handles structure, focus on content.

---

### Phase 6: CI & Governance (Script + Config)

**Batch H: CI & Governance Scripts**

**Tasks:** `c-1`, `c-7`, `c-13`, `d-1`, `d-6`, `d-8`, `c-12`, `c-14`

**Strategy:** Mix of scripts, CI configs, and docs:

- **c-1**: Dependency graph script (`scripts/architecture-check-dependency-graph.ts`)
- **c-7**: Storybook visual regression (CI workflow + config)
- **c-13**: Security SAST (CI workflow + config)
- **d-1**: Schema versioning policy (doc + script)
- **d-6**: a11y release gate (CI workflow + script)
- **d-8**: SBOM generation (CI workflow + script)
- **c-12**: Analytics taxonomy (types + doc)
- **c-14**: SLOs/performance budgets (config + doc)

**Execution:**

- Scripts can be created in batch (similar structure)
- CI workflows can be templated
- Docs follow Batch G pattern

---

### Phase 7: Integration & API Wiring

**Batch I: Integration Tasks**

**Tasks:** `api-catch-all-health-og`, `integration-wiring-client-pages`, `scripts-wire-package-json`

**Strategy:**

- **api-catch-all**: Single Next.js API route file
- **integration-wiring**: Wire existing integrations to client pages (config-driven)
- **scripts-wiring**: Audit `scripts/` and add to package.json (grep + batch edit)

**Execution:** Can be done in parallel — different areas of codebase.

---

### Phase 8: Remaining Infrastructure

**Tasks:** `inf-7`, `inf-9`, `inf-14`

**Strategy:**

- **inf-7**: Extends `6-8d` (generate-component) — add after CLI tools done
- **inf-9**: Industry extensibility — depends on industry-schemas, may depend on inf-15
- **inf-14**: Feature plugin interface — depends on feature modules (c-9, c-10, c-17)

**Execution:** Sequential based on dependencies.

---

## 🚀 Recommended Execution Order

### Week 0: Critical Blockers (Must Complete First)

0. **Day 1-2:** Pre-Phase — 0-1 (Fix CI) — unblocks all merges
1. **Day 3:** Pre-Phase — 0-3 (Fix Tenant Context) — security foundation
2. **Day 4-5:** Pre-Phase — 0-2 (Persistent Storage) — creates BookingRepository interface

### Week 1+: Security Foundation (Wave 1 Priority)

3. **Day 1-5:** Phase 0 (Security Foundation) — sequential with parallel work
   - **Day 1:** security-5 (pnpm Supply Chain) — quick win
   - **Day 2-3:** security-1 (Server Action Hardening) — foundation, wraps 0-2's repository
   - **Day 3-4:** security-2 (RLS) — parallel with security-1 after day 2
   - **Day 4-5:** security-3 (Webhooks), security-4 (Consent) — parallel
   - **Day 5+:** infrastructure-1 (Observability), infrastructure-2 (E2E), infrastructure-3 (Resilience) — parallel

### Week 2+: Foundation Infrastructure

4. **Day 1-3:** Phase 2 Batch A (Registries) — implement inf-1 manually, then create template script
5. **Day 4-5:** Phase 2 Batch A (Registries) — validate ROI, then batch implement remaining registries

### Week 2: Tooling + Systems

3. **Day 1:** Phase 3 Batch C (CLI Tools) — complete 6-8a (remaining CLI tool)
4. **Day 2-3:** Phase 3 Batch D (Cleanup) — parallel grep/audit operations (6-9a, 6-9c, 6-1a)
5. **Day 4-5:** Phase 2 Batch B (Design Tokens) — sequential token system

### Week 3: Features + Architecture

6. **Day 1-3:** Phase 4 Batch E (Feature Systems) — create template, batch implement (f-6, f-7, f-8, f-9, f-10, f-12, f-15..f-42)
7. **Day 4-5:** Phase 4 Batch F (Architecture Packages) — parallel package creation

### Week 4: Docs + CI

8. **Day 1-2:** Phase 5 Batch G (Documentation) — template + batch creation
9. **Day 3-5:** Phase 6 Batch H (CI & Governance) — scripts + workflows

### Week 5: Integration + Remaining

10. **Day 1-2:** Phase 7 Batch I (Integration & API) — api-_, integration-_, scripts-\*
11. **Day 3-5:** Phase 8 (Remaining Infrastructure) — sequential based on deps (inf-7, inf-9, inf-14)

### Week 6+: Additional Work

12. **Additional feature systems** (f-19..f-42), remaining infrastructure tasks, and ongoing maintenance

---

## 🛠️ Automation Scripts to Create (Phased Approach)

**Recommended Phased Rollout:**

1. **Phase 1:** Implement inf-1 manually to establish baseline
2. **Phase 2:** Create `scripts/generate-registry.sh` after inf-1 completion
3. **Phase 3:** Validate ROI by applying to inf-2, inf-3 (target: 60-70% time savings)
4. **Phase 4:** If validated, create `scripts/batch-create-registries.sh` and scale to remaining registry tasks
5. **Phase 5:** Defer `generate-cli-tool.sh`, `generate-feature-system.sh`, `generate-doc.sh` until registry automation proves value

**Estimated ROI:** 50-70% time reduction across registry tasks. Phased approach validates ROI before full investment.

---

## 📊 Task Grouping Summary

| Batch                  | Tasks                                                      | Count | Automation Potential             | Estimated Time Savings |
| ---------------------- | ---------------------------------------------------------- | ----- | -------------------------------- | ---------------------- |
| Phase 0 (Security)     | security-1..security-4, infrastructure-1..infrastructure-3 | 7     | Medium (patterns, not templates) | 20-30%                 |
| Phase 1 (Blockers)     | 0-1, 0-2, 0-3 (remaining)                                  | 3     | Low (sequential fixes)           | 0%                     |
| Batch A (Registries)   | inf-1..inf-15 (9 tasks)                                    | 9     | **Very High**                    | 60-70%                 |
| Batch B (Tokens)       | c-5-design-tokens, inf-4, inf-12, inf-13                   | 4     | Medium (CSS templates)           | 40%                    |
| Batch C (CLI)          | 6-8a (remaining)                                           | 1     | **Very High**                    | 50%                    |
| Batch D (Cleanup)      | 6-9a, 6-9c, 6-1a (6-9b completed)                          | 3     | High (grep/audit)                | 60%                    |
| Batch E (Features)     | f-6, f-7, f-8, f-9, f-10, f-12, f-15..f-42                 | 20+   | **High**                         | 40-50%                 |
| Batch F (Architecture) | c-8, c-9-personalization, c-10, c-17, c-18, e-7            | 6     | Medium (package templates)       | 30%                    |

**Note:** `c-9-personalization` (P2) is distinct from `c-9-wcag-contrast` (P1). Batch F uses the personalization task.
| Batch G (Docs) | docs-_ (5 tasks) | 5 | **Very High** | 70% |
| Batch H (CI/Gov) | c-1, c-7, c-13, d-1, d-6, d-8, c-12, c-14 | 8 | Medium (CI templates) | 40% |
| Batch I (Integration) | api-_, integration-_, scripts-_ | 3 | Low (wiring) | 20% |
| Phase 8 (Remaining) | inf-7, inf-9, inf-14 | 3 | Low (dependencies) | 0% |
| Organic Evolution (evol-\*) | evol-1..evol-12 | 12 | Medium | Phase-gated |

**Total Active Tasks:** ~134 (includes 12 evol-\*)  
**Completed Tasks:** 9 (0-4, 0-5, 0-6, 0-7, 6-8b, 6-8c, 6-8d, 6-8e, 6-9b)  
**High Automation Potential:** ~70 tasks (57%)  
**Estimated Overall Time Savings:** 40-50% with script investment

---

## ✅ Quality Assurance Strategy

1. **Template Validation:** All generated code follows existing patterns (registry.ts, CLI structure)
2. **Batch Testing:** Run `pnpm type-check`, `pnpm build`, `pnpm test` after each batch
3. **Incremental Commits:** Commit each batch separately for easier rollback
4. **Documentation:** Update docs as code is generated (Batch G can reference new code)

---

## 🔄 Iterative Refinement

- **After Batch A:** Refine registry template based on first 2-3 implementations
- **After Batch C:** Refine CLI template based on first 2 implementations
- **After Batch G:** Refine doc template based on validation feedback

This plan prioritizes **speed through automation** while maintaining **quality through templates** and **dependency awareness**.

---

## Fix / blockers (0-\*)

| Task ID                                          | Title                                                         | Priority | Link                                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| 0-1-fix-critical-ci-failures                     | Fix Critical CI Failures (Make CI Green)                      | P0       | [0-1-fix-critical-ci-failures.md](0-1-fix-critical-ci-failures.md)                                         |
| 0-2-replace-internal-bookings-persistent-storage | Replace internalBookings with Persistent Storage              | P0       | [0-2-replace-internal-bookings-persistent-storage.md](0-2-replace-internal-bookings-persistent-storage.md) |
| 0-3-fix-tenant-context-security                  | Fix Tenant Context Implementation (Security)                  | P0       | [0-3-fix-tenant-context-security.md](0-3-fix-tenant-context-security.md)                                   |
| 0-4-fix-toast-sonner-api                         | Fix Toast.tsx Sonner API Compatibility                        | P0 ✅    | [archive/0-4-fix-toast-sonner-api.md](archive/0-4-fix-toast-sonner-api.md)                                 |
| 0-5-booking-actions-verification                 | Add Verification Params to Booking Actions                    | P0 ✅    | [archive/0-5-booking-actions-verification.md](archive/0-5-booking-actions-verification.md)                 |
| 0-6-fix-integration-schemas-type-safety          | Fix Record<string, any> in Integration Schemas                | P1       | [0-6-fix-integration-schemas-type-safety.md](0-6-fix-integration-schemas-type-safety.md)                   |
| 0-7-validate-workspaces-sync                     | Resolve validate-workspaces Pass/Fail                         | P1 ✅    | [archive/0-7-validate-workspaces-sync.md](archive/0-7-validate-workspaces-sync.md)                         |
| 0-8-fix-sanitize-contact-data-type-safety        | Fix sanitizeContactData Type Safety                           | P2       | [0-8-fix-sanitize-contact-data-type-safety.md](0-8-fix-sanitize-contact-data-type-safety.md)               |
| 0-9-fix-validate-origin-server-to-server         | Fix validateOrigin Server-to-Server Calls                     | P2       | [0-9-fix-validate-origin-server-to-server.md](0-9-fix-validate-origin-server-to-server.md)                 |
| 0-10-fix-env-validation-module-load              | Fix Env Validation Module Load Time                           | P2       | [0-10-fix-env-validation-module-load.md](0-10-fix-env-validation-module-load.md)                           |
| 0-11-split-infra-extract-design-system           | Split @repo/infra – Extract Design System Parts               | P1       | [0-11-split-infra-extract-design-system.md](0-11-split-infra-extract-design-system.md)                     |
| 0-14-replace-date-fns-native-date                | Replace date-fns with Native Date Arithmetic                  | P2       | [0-14-replace-date-fns-native-date.md](0-14-replace-date-fns-native-date.md)                               |
| 0-16-standardize-logging-replace-console         | Standardize Logging – Replace console with @repo/infra/logger | P2       | [0-16-standardize-logging-replace-console.md](0-16-standardize-logging-replace-console.md)                 |
| 0-21-remove-verbose-trace-comments               | Remove Verbose TRACE Comments                                 | P2       | [0-21-remove-verbose-trace-comments.md](0-21-remove-verbose-trace-comments.md)                             |

---

## CLI / tooling / cleanup (6-\*)

| Task ID                                    | Title                                        | Priority | Link                                                                                             |
| ------------------------------------------ | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| 6-8a-turbo-gen-new-client                  | Implement turbo gen new-client (Plop)        | P2       | [6-8a-turbo-gen-new-client.md](6-8a-turbo-gen-new-client.md)                                     |
| 6-8b-implement-create-client-cli           | Implement pnpm create-client                 | P2 ✅    | [archive/6-8b-implement-create-client-cli.md](archive/6-8b-implement-create-client-cli.md)       |
| 6-8c-implement-validate-site-config        | Implement validate-site-config               | P2 ✅    | [archive/6-8c-implement-validate-site-config.md](archive/6-8c-implement-validate-site-config.md) |
| 6-8d-implement-generate-component          | Implement generate-component                 | P2 ✅    | [archive/6-8d-implement-generate-component.md](archive/6-8d-implement-generate-component.md)     |
| 6-8e-wire-pnpm-health                      | Wire pnpm health to Full Pipeline            | P2 ✅    | [archive/6-8e-wire-pnpm-health.md](archive/6-8e-wire-pnpm-health.md)                             |
| 6-9a-remove-not-implemented-placeholder    | Remove NotImplementedPlaceholder if Unused   | P2       | [6-9a-remove-not-implemented-placeholder.md](6-9a-remove-not-implemented-placeholder.md)         |
| 6-9b-refine-knip-dependency-pruning        | Refine knip.config and Dependency Pruning    | P2 ✅    | [archive/6-9b-refine-knip-dependency-pruning.md](archive/6-9b-refine-knip-dependency-pruning.md) |
| 6-9c-update-docs-page-templates-state      | Update Docs for Current page-templates State | P2       | [6-9c-update-docs-page-templates-state.md](6-9c-update-docs-page-templates-state.md)             |
| 6-10-starter-template-production-readiness | Starter Template Production Readiness        | P2       | [6-10-starter-template-production-readiness.md](6-10-starter-template-production-readiness.md)   |
| 6-1a-audit-stale-templates-references      | Audit for Stale templates/ References        | P2       | [6-1a-audit-stale-templates-references.md](6-1a-audit-stale-templates-references.md)             |

---

## API / integration

| Task ID                         | Title                                | Priority | Link                                                                     |
| ------------------------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------ |
| api-catch-all-health-og         | Add api/[...routes] with Health + OG | P2       | [api-catch-all-health-og.md](api-catch-all-health-og.md)                 |
| api-sitemap-generation          | Dynamic Sitemap Generation           | P2       | [api-sitemap-generation.md](api-sitemap-generation.md)                   |
| integration-wiring-client-pages | Wire Integrations into Client Pages  | P2       | [integration-wiring-client-pages.md](integration-wiring-client-pages.md) |
| scripts-wire-package-json       | Wire Scripts to package.json         | P2       | [scripts-wire-package-json.md](scripts-wire-package-json.md)             |

---

## Architecture / CI / governance (c-_, d-_, e-\*)

| Task ID                                     | Title                                                              | Priority | Link                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------ |
| c-1-architecture-check-dependency-graph     | Architecture check-dependency-graph                                | P2       | [c-1-architecture-check-dependency-graph.md](c-1-architecture-check-dependency-graph.md)         |
| c-5-configure-turbo-remote-cache            | Configure Turbo Remote Cache                                       | P1       | [c-5-configure-turbo-remote-cache.md](c-5-configure-turbo-remote-cache.md)                       |
| c-5-design-tokens                           | Add Design Token Architecture                                      | P2       | [c-5-design-tokens.md](c-5-design-tokens.md)                                                     |
| c-7-implement-layer-violation-detection     | Implement Layer Violation Detection Script                         | P1       | [c-7-implement-layer-violation-detection.md](c-7-implement-layer-violation-detection.md)         |
| c-7-storybook-visual-regression             | Storybook Visual Regression                                        | P2       | [c-7-storybook-visual-regression.md](c-7-storybook-visual-regression.md)                         |
| c-8-infra-experiments                       | Add infra/experiments (Feature Flags, A/B, Guardrails)             | P2       | [c-8-infra-experiments.md](c-8-infra-experiments.md)                                             |
| c-9-add-wcag-contrast-validation-ci         | Add WCAG Contrast Validation to CI                                 | P1       | [c-9-add-wcag-contrast-validation-ci.md](c-9-add-wcag-contrast-validation-ci.md)                 |
| c-9-features-personalization                | Add features/personalization                                       | P2       | [c-9-features-personalization.md](c-9-features-personalization.md)                               |
| c-10-features-content                       | Add features/content (CMS Abstraction)                             | P2       | [c-10-features-content.md](c-10-features-content.md)                                             |
| c-11-add-no-deep-import-lint-rule           | Add No-Deep-Import Lint Rule                                       | P2       | [c-11-add-no-deep-import-lint-rule.md](c-11-add-no-deep-import-lint-rule.md)                     |
| c-12-analytics-event-taxonomy               | Analytics Event Taxonomy                                           | P2       | [c-12-analytics-event-taxonomy.md](c-12-analytics-event-taxonomy.md)                             |
| c-13-remove-build-dependency-test           | Remove ^build from Test Task in turbo.json                         | P2       | [c-13-remove-build-dependency-test.md](c-13-remove-build-dependency-test.md)                     |
| c-13-security-sast-regression               | Security (SAST, Regression Tests)                                  | P2       | [c-13-security-sast-regression.md](c-13-security-sast-regression.md)                             |
| c-14-slos-performance-budgets               | SLOs and Performance Budgets                                       | P2       | [c-14-slos-performance-budgets.md](c-14-slos-performance-budgets.md)                             |
| c-15-add-bundle-size-budgets-ci             | Add Bundle Size Budgets to CI                                      | P2       | [c-15-add-bundle-size-budgets-ci.md](c-15-add-bundle-size-budgets-ci.md)                         |
| c-17-features-compliance                    | Add features/compliance + types/compliance-packs                   | P2       | [c-17-features-compliance.md](c-17-features-compliance.md)                                       |
| c-18-infra-edge                             | Add infra/edge (Edge Middleware Primitives)                        | P2       | [c-18-infra-edge.md](c-18-infra-edge.md)                                                         |
| c-22-add-pa11y-ci-e2e-accessibility-testing | Add pa11y-ci or axe-playwright to CI for E2E Accessibility Testing | P2       | [c-22-add-pa11y-ci-e2e-accessibility-testing.md](c-22-add-pa11y-ci-e2e-accessibility-testing.md) |
| c-29-add-inputs-turbo-build-task            | Add Inputs to turbo.json Build Task for Better Caching             | P2       | [c-29-add-inputs-turbo-build-task.md](c-29-add-inputs-turbo-build-task.md)                       |
| c-31-parallelize-ci-jobs-pnpm-store-caching | Parallelize CI Jobs and Add Pnpm Store Caching                     | P2       | [c-31-parallelize-ci-jobs-pnpm-store-caching.md](c-31-parallelize-ci-jobs-pnpm-store-caching.md) |
| d-1-schema-versioning-policy                | Schema Versioning Policy                                           | P2       | [d-1-schema-versioning-policy.md](d-1-schema-versioning-policy.md)                               |
| d-6-a11y-release-gate                       | a11y Release Gate                                                  | P2       | [d-6-a11y-release-gate.md](d-6-a11y-release-gate.md)                                             |
| d-8-supply-chain-sbom                       | Supply Chain (SBOM, Dependency Integrity)                          | P2       | [d-8-supply-chain-sbom.md](d-8-supply-chain-sbom.md)                                             |
| e-7-infra-ops                               | Add infra/ops (Queue Policy)                                       | P2       | [e-7-infra-ops.md](e-7-infra-ops.md)                                                             |

---

## Security / Infrastructure / Compliance

| Task ID                                      | Title                         | Priority | Link                                                                                               |
| -------------------------------------------- | ----------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| security-1-server-action-hardening           | Server Action Hardening       | P0       | [security-1-server-action-hardening.md](security-1-server-action-hardening.md)                     |
| security-2-rls-multi-tenant                  | Multi-Tenant RLS              | P0       | [security-2-rls-multi-tenant.md](security-2-rls-multi-tenant.md)                                   |
| security-3-webhook-security                  | Webhook Security              | P0       | [security-3-webhook-security.md](security-3-webhook-security.md)                                   |
| security-4-consent-management                | Consent Management            | P0       | [security-4-consent-management.md](security-4-consent-management.md)                               |
| security-5-pnpm-supply-chain-hardening       | pnpm Supply Chain Hardening   | P0       | [security-5-pnpm-supply-chain-hardening.md](security-5-pnpm-supply-chain-hardening.md)             |
| security-6-react-taint-api                   | React Taint API               | P0       | [security-6-react-taint-api.md](security-6-react-taint-api.md)                                     |
| security-7-middleware-bypass-mitigation      | Middleware Bypass Mitigation  | P0       | [security-7-middleware-bypass-mitigation.md](security-7-middleware-bypass-mitigation.md)           |
| infrastructure-1-observability-opentelemetry | Observability (OpenTelemetry) | P0       | [infrastructure-1-observability-opentelemetry.md](infrastructure-1-observability-opentelemetry.md) |
| infrastructure-2-e2e-testing                 | E2E Testing                   | P0       | [infrastructure-2-e2e-testing.md](infrastructure-2-e2e-testing.md)                                 |
| infrastructure-3-integration-resilience      | Integration Resilience        | P0       | [infrastructure-3-integration-resilience.md](infrastructure-3-integration-resilience.md)           |
| infrastructure-4-partytown-integration       | Partytown Integration         | P0       | [infrastructure-4-partytown-integration.md](infrastructure-4-partytown-integration.md)             |
| infrastructure-5-contract-testing-pact       | Contract Testing (Pact)       | P0       | [infrastructure-5-contract-testing-pact.md](infrastructure-5-contract-testing-pact.md)             |
| infrastructure-6-scaffold-mcp                | Scaffold MCP                  | P0       | [infrastructure-6-scaffold-mcp.md](infrastructure-6-scaffold-mcp.md)                               |
| compliance-1-ccpa-2026-updates               | CCPA 2026 Updates             | P0       | [compliance-1-ccpa-2026-updates.md](compliance-1-ccpa-2026-updates.md)                             |
| compliance-2-eu-ai-act                       | EU AI Act                     | P0       | [compliance-2-eu-ai-act.md](compliance-2-eu-ai-act.md)                                             |

---

## Docs

| Task ID                           | Title                                   | Priority | Link                                                                         |
| --------------------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| docs-6-1-reusability-rubric       | Add reusability-rubric.md               | P2       | [docs-6-1-reusability-rubric.md](docs-6-1-reusability-rubric.md)             |
| docs-c2-package-management-policy | Add package-management-policy.md        | P2       | [docs-c2-package-management-policy.md](docs-c2-package-management-policy.md) |
| docs-c3-turbo-remote-cache        | Add turbo-remote-cache.md               | P2       | [docs-c3-turbo-remote-cache.md](docs-c3-turbo-remote-cache.md)               |
| docs-c18-edge-personalization     | Add edge-personalization.md             | P2       | [docs-c18-edge-personalization.md](docs-c18-edge-personalization.md)         |
| docs-readme-architecture-diagram  | Update README with Architecture Diagram | P2       | [docs-readme-architecture-diagram.md](docs-readme-architecture-diagram.md)   |

---

## Organic Evolution (evol-\*)

| Task ID                                  | Title                                           | Phase      | Priority | Link                                                                                       |
| ---------------------------------------- | ----------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------ |
| evol-1-architecture-police               | Architecture Police (ESLint Rules)              | 1 (W1)     | P1       | [evol-1-architecture-police.md](evol-1-architecture-police.md)                             |
| evol-2-cva-token-completion              | CVA Completion + Token System                   | 1 (W2)     | P1       | [evol-2-cva-token-completion.md](evol-2-cva-token-completion.md)                           |
| evol-3-registry-capability-metadata      | Registry Hardening with Capability Metadata     | 1 (W3-4)   | P1       | [evol-3-registry-capability-metadata.md](evol-3-registry-capability-metadata.md)           |
| evol-4-canonical-types                   | Canonical Types (Lead, Booking)                 | 2 (W5-6)   | P1       | [evol-4-canonical-types.md](evol-4-canonical-types.md)                                     |
| evol-5-booking-canonical-migration       | Migrate Booking to Canonical Types + Repository | 2 (W7-8)   | P1       | [evol-5-booking-canonical-migration.md](evol-5-booking-canonical-migration.md)             |
| evol-6-integration-adapter-registry      | Integration Adapter Registry (Formal)           | 2 (W9-10)  | P1       | [evol-6-integration-adapter-registry.md](evol-6-integration-adapter-registry.md)           |
| evol-7-define-feature                    | Feature → Capability Refactoring                | 3 (W11-13) | P1       | [evol-7-define-feature.md](evol-7-define-feature.md)                                       |
| evol-8-site-config-capability-activation | Site Config → Capability Activation             | 3 (W14-16) | P1       | [evol-8-site-config-capability-activation.md](evol-8-site-config-capability-activation.md) |
| evol-9-universal-renderer                | Universal Renderer (New Clients Only)           | 4 (W17-19) | P2       | [evol-9-universal-renderer.md](evol-9-universal-renderer.md)                               |
| evol-10-edge-database-opt-in             | Edge Database Opt-In                            | 4 (W20-22) | P2       | [evol-10-edge-database-opt-in.md](evol-10-edge-database-opt-in.md)                         |
| evol-11-legacy-bridge                    | Legacy Bridge (Classic Config → Capability)     | 5 (W23-24) | P2       | [evol-11-legacy-bridge.md](evol-11-legacy-bridge.md)                                       |
| evol-12-full-platform-convergence        | Full Platform Convergence                       | 5 (W25-26) | P2       | [evol-12-full-platform-convergence.md](evol-12-full-platform-convergence.md)               |

---

## Infrastructure / registries (inf-\*)

| Task ID                                          | Title                                                    | Priority | Link                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| inf-1-dynamic-section-registry                   | Dynamic Section Registry                                 | P2       | [inf-1-dynamic-section-registry.md](inf-1-dynamic-section-registry.md)                                     |
| inf-2-component-variant-schema                   | Component Variant Schema                                 | P2       | [inf-2-component-variant-schema.md](inf-2-component-variant-schema.md)                                     |
| inf-3-font-registry-typography                   | Font Registry / Theme Typography                         | P2       | [inf-3-font-registry-typography.md](inf-3-font-registry-typography.md)                                     |
| inf-4-design-token-overrides                     | Design Token Overrides                                   | P2       | [inf-4-design-token-overrides.md](inf-4-design-token-overrides.md)                                         |
| inf-5-marketing-component-family-registry        | Marketing Component Family Registry                      | P2       | [inf-5-marketing-component-family-registry.md](inf-5-marketing-component-family-registry.md)               |
| inf-6-block-content-type-registry                | Block / Content Type Registry                            | P2       | [inf-6-block-content-type-registry.md](inf-6-block-content-type-registry.md)                               |
| inf-7-generate-component-family-variant          | generate-component with --family and --variant           | P2       | [inf-7-generate-component-family-variant.md](inf-7-generate-component-family-variant.md)                   |
| inf-8-integration-aware-csp-generation           | Build Integration-Aware CSP Generation                   | P1       | [inf-8-integration-aware-csp-generation.md](inf-8-integration-aware-csp-generation.md)                     |
| inf-8-layout-template-registry                   | Layout Template Registry                                 | P2       | [inf-8-layout-template-registry.md](inf-8-layout-template-registry.md)                                     |
| inf-9-industry-extensibility                     | Industry Extensibility                                   | P2       | [inf-9-industry-extensibility.md](inf-9-industry-extensibility.md)                                         |
| inf-10-integration-adapter-registry              | Integration Adapter Registry                             | P2       | [inf-10-integration-adapter-registry.md](inf-10-integration-adapter-registry.md)                           |
| inf-11-component-catalog-discovery               | Component Catalog / Discovery                            | P2       | [inf-11-component-catalog-discovery.md](inf-11-component-catalog-discovery.md)                             |
| inf-12-theme-preset-library                      | Theme Preset Library                                     | P2       | [inf-12-theme-preset-library.md](inf-12-theme-preset-library.md)                                           |
| inf-13-animation-motion-presets                  | Animation / Motion Presets                               | P2       | [inf-13-animation-motion-presets.md](inf-13-animation-motion-presets.md)                                   |
| inf-14-feature-plugin-interface                  | Feature Plugin Interface                                 | P2       | [inf-14-feature-plugin-interface.md](inf-14-feature-plugin-interface.md)                                   |
| inf-15-structured-data-schema-registry           | Structured Data Schema Registry                          | P2       | [inf-15-structured-data-schema-registry.md](inf-15-structured-data-schema-registry.md)                     |
| inf-16-fix-unexpected-coupling-infra-experiments | Fix Unexpected Coupling infra/experiments                | P2       | [inf-16-fix-unexpected-coupling-infra-experiments.md](inf-16-fix-unexpected-coupling-infra-experiments.md) |
| inf-17-add-private-flag-integration-packages     | Add Private Flag to Scaffolded Integration Packages      | P2       | [inf-17-add-private-flag-integration-packages.md](inf-17-add-private-flag-integration-packages.md)         |
| inf-18-x-tenant-id-header-trust-model            | Document and Enforce X-Tenant-Id Header Trust Model      | P2       | [inf-18-x-tenant-id-header-trust-model.md](inf-18-x-tenant-id-header-trust-model.md)                       |
| inf-19-remove-in-memory-rate-limit-fallback      | Remove In-Memory Rate Limiting Fallback                  | P2       | [inf-19-remove-in-memory-rate-limit-fallback.md](inf-19-remove-in-memory-rate-limit-fallback.md)           |
| inf-32-create-docker-compose-multiple-clients    | Create Docker Compose Configuration for Multiple Clients | P3       | [inf-32-create-docker-compose-multiple-clients.md](inf-32-create-docker-compose-multiple-clients.md)       |

---

## Feature systems (f-\*)

| Task ID                                                 | Title                                                     | Priority | Link                                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| f-6-animation-system                                    | Animation System                                          | P2       | [f-6-animation-system.md](f-6-animation-system.md)                                                                       |
| f-7-interaction-system                                  | Interaction System                                        | P2       | [f-7-interaction-system.md](f-7-interaction-system.md)                                                                   |
| f-8-responsive-system                                   | Responsive System                                         | P2       | [f-8-responsive-system.md](f-8-responsive-system.md)                                                                     |
| f-9-grid-system                                         | Grid System                                               | P2       | [f-9-grid-system.md](f-9-grid-system.md)                                                                                 |
| f-10-implement-page-templates                           | Implement Page Templates (Wave 1 Critical Path)           | P1       | [f-10-implement-page-templates.md](f-10-implement-page-templates.md)                                                     |
| f-12-replace-static-registry-lazy-loading               | Replace Static Registry with Lazy-Loaded Components       | P1       | [f-12-replace-static-registry-lazy-loading.md](f-12-replace-static-registry-lazy-loading.md)                             |
| f-15-icon-system                                        | Icon System                                               | P2       | [f-15-icon-system.md](f-15-icon-system.md)                                                                               |
| f-16-image-system                                       | Image System                                              | P2       | [f-16-image-system.md](f-16-image-system.md)                                                                             |
| f-17-media-system                                       | Media System                                              | P2       | [f-17-media-system.md](f-17-media-system.md)                                                                             |
| f-18-state-management-system                            | State Management System                                   | P2       | [f-18-state-management-system.md](f-18-state-management-system.md)                                                       |
| f-19-form-system                                        | Form System                                               | P2       | [f-19-form-system.md](f-19-form-system.md)                                                                               |
| f-20-add-a11y-requirements-carousel                     | Add A11y Requirements for Carousel/Marquee Components     | P2       | [f-20-add-a11y-requirements-carousel.md](f-20-add-a11y-requirements-carousel.md)                                         |
| f-21-error-handling-system                              | Error Handling System                                     | P2       | [f-21-error-handling-system.md](f-21-error-handling-system.md)                                                           |
| f-22-loading-system                                     | Loading System                                            | P2       | [f-22-loading-system.md](f-22-loading-system.md)                                                                         |
| f-23-lock-themeinjector-head-placement                  | Lock ThemeInjector to <head> Placement                    | P2       | [f-23-lock-themeinjector-head-placement.md](f-23-lock-themeinjector-head-placement.md)                                   |
| f-24-add-suspense-streaming-booking-flow                | Add Suspense + Streaming for Booking Flow                 | P2       | [f-24-add-suspense-streaming-booking-flow.md](f-24-add-suspense-streaming-booking-flow.md)                               |
| f-25-remove-default-styling-dialogtrigger               | Remove Default Styling from DialogTrigger                 | P2       | [f-25-remove-default-styling-dialogtrigger.md](f-25-remove-default-styling-dialogtrigger.md)                             |
| f-26-add-accessibility-tests-toast-aria-live            | Add Accessibility Tests for Toast Component (aria-live)   | P2       | [f-26-add-accessibility-tests-toast-aria-live.md](f-26-add-accessibility-tests-toast-aria-live.md)                       |
| f-27-improve-fraud-detection-reputation-api             | Improve Fraud Detection with Reputation API               | P3       | [f-27-improve-fraud-detection-reputation-api.md](f-27-improve-fraud-detection-reputation-api.md)                         |
| f-28-implement-industry-configuration-inheritance       | Implement Industry Configuration Inheritance              | P2       | [f-28-implement-industry-configuration-inheritance.md](f-28-implement-industry-configuration-inheritance.md)             |
| f-30-audit-lucide-react-imports-barrel                  | Audit lucide-react Imports for Barrel Issues              | P3       | [f-30-audit-lucide-react-imports-barrel.md](f-30-audit-lucide-react-imports-barrel.md)                                   |
| f-33-add-aria-describedby-form-fields-error-association | Add aria-describedby to Form Fields for Error Association | P2       | [f-33-add-aria-describedby-form-fields-error-association.md](f-33-add-aria-describedby-form-fields-error-association.md) |
| f-41-newsletter-signup-feature                          | Newsletter Signup Feature                                 | P2       | [f-41-newsletter-signup-feature.md](f-41-newsletter-signup-feature.md)                                                   |
| f-42-radix-ui-tree-shaking-verification                 | Radix UI Tree-Shaking Verification                        | P3       | [f-42-radix-ui-tree-shaking-verification.md](f-42-radix-ui-tree-shaking-verification.md)                                 |

---

## 📋 Task Summary by Priority

### P0 Tasks (Critical - Must Complete First)

**Count:** 18 tasks

**Security Foundation (Wave 1):**

- security-1 through security-7 (7 tasks)
- infrastructure-1 through infrastructure-6 (6 tasks)
- compliance-1, compliance-2 (2 tasks)

**Critical Blockers:**

- 0-1, 0-2, 0-3 (3 tasks)

### P1 Tasks (High Priority)

**Count:** 8 tasks

- 0-6-fix-integration-schemas-type-safety
- 0-11-split-infra-extract-design-system
- c-5-configure-turbo-remote-cache
- c-7-implement-layer-violation-detection
- c-9-add-wcag-contrast-validation-ci
- f-10-implement-page-templates
- f-12-replace-static-registry-lazy-loading
- inf-8-integration-aware-csp-generation

### P2 Tasks (Medium Priority)

**Count:** ~95 tasks

- All remaining 0-_, c-_, d-_, e-_, f-_, inf-_, api-_, integration-_, scripts-_, docs-_, 6-\* tasks

### P3 Tasks (Low Priority)

**Count:** 4 tasks

- f-27-improve-fraud-detection-reputation-api
- f-30-audit-lucide-react-imports-barrel
- f-42-radix-ui-tree-shaking-verification
- inf-32-create-docker-compose-multiple-clients

---

## 🎯 Strategic Execution Priorities

### Immediate (Week 0-1)

1. **Phase 0: Security Foundation** — 15 P0 security/infrastructure/compliance tasks
2. **Phase 1: Critical Blockers** — 0-1, 0-2, 0-3 (fix CI, storage, tenant security)

### Short-term (Week 2-4)

3. **Phase 2: Foundation Infrastructure** — Registries and design tokens (enables downstream work)
4. **Phase 3: Tooling** — Complete CLI tools and cleanup tasks
5. **Phase 4: Feature Systems** — Core feature implementations

### Medium-term (Week 5-8)

6. **Phase 5: Documentation** — Complete documentation tasks
7. **Phase 6: CI & Governance** — Automation and quality gates
8. **Phase 7: Integration & API** — Wire integrations and APIs
9. **Phase 8: Remaining Infrastructure** — Complete infrastructure tasks

### Long-term (Ongoing)

10. **Additional Feature Systems** — Remaining f-\* tasks
11. **P3 Tasks** — Low-priority enhancements

---

## 📈 Progress Tracking

- **Completed:** 9 tasks (archived)
- **In Progress:** 0 tasks
- **Pending:** ~113 active tasks
- **Total:** ~122 tasks

**Next Steps:** Use this document to create detailed sprint plans, assign tasks, and track progress. Each task file contains full implementation details, dependencies, and acceptance criteria.
