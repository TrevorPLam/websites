# Open Tasks Index

Open tasks for the marketing-websites monorepo. Each row links to the task file. See [README.md](README.md) for task structure and [VERIFICATION.md](VERIFICATION.md) for the completion checklist.

---

## 🎯 Execution Game Plan

**Last Updated:** 2026-02-19  
**Purpose:** Optimize task execution through batching, automation, and dependency-aware sequencing.

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

---

### Phase 1: Critical Blockers (Must Complete First)

**Tasks:** `0-4`, `0-5`, `0-6`, `0-7`

**Strategy:** Sequential execution — each fixes a blocking CI/build issue.

- **0-4** (Toast.tsx): Single file fix — type signature alignment with Sonner API
- **0-5** (Booking Actions): Add verification params — likely 1-2 files
- **0-6** (Marketing Components Build): Build output fix — check tsconfig/build config
- **0-7** (Workspaces Sync): Validate script alignment — likely config file updates

**Execution:** Run failing commands first (`pnpm type-check`, `pnpm build`, `pnpm test`) to reproduce, then fix. Can be done in parallel if different packages affected.

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

**Automation Strategy:**
1. **Create registry template generator script:**
   ```bash
   scripts/generate-registry.sh <registry-name> <registry-type> <package-path>
   ```
   - Generates: `registry.ts`, `types.ts`, `__tests__/registry.test.ts`
   - Templates based on `packages/page-templates/src/registry.ts` pattern
   - Customizes for: sections, variants, fonts, families, blocks, layouts, integrations, catalogs, schemas

2. **Batch execution order:**
   - **inf-1** (Dynamic Section Registry) — extends existing `packages/page-templates/src/registry.ts`
   - **inf-2** (Component Variant Schema) — modifies same registry + types
   - **inf-3** (Font Registry) — new registry in `packages/config/` or `packages/ui/`
   - **inf-5** (Marketing Component Family) — `packages/marketing-components/src/`
   - **inf-6** (Block/Content Type) — `packages/features/content/` or new package
   - **inf-8** (Layout Template) — `packages/page-templates/src/`
   - **inf-10** (Integration Adapter) — `packages/integrations/*/` (multiple packages)
   - **inf-11** (Component Catalog) — discovery layer
   - **inf-15** (Structured Data Schema) — `packages/industry-schemas/` or new

**Estimated Efficiency Gain:** 60-70% time reduction vs. manual implementation. Create template once, customize per task.

**Batch B: Design Token & Theme System** (Sequential Dependency)

**Tasks:** `c-5`, `inf-4`, `inf-12`, `inf-13`

**Dependencies:** `c-5` → `inf-4` → `inf-12` → `inf-13`

**Strategy:**
- **c-5** creates base token architecture (3 CSS files)
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

### Week 0: Security Foundation (Wave 1 Priority)
0. **Day 1-5:** Phase 0 (Security Foundation) — sequential with parallel work
   - **Day 1-2:** security-1 (Server Action Hardening) — foundation
   - **Day 2-3:** security-2 (RLS) — parallel with security-1 after day 1
   - **Day 3-4:** security-3 (Webhooks), security-4 (Consent) — parallel
   - **Day 4-5:** infrastructure-1 (Observability), infrastructure-2 (E2E), infrastructure-3 (Resilience) — parallel

### Week 1: Blockers + Foundation
1. **Day 1-2:** Phase 1 (Blockers) — sequential, critical path
2. **Day 3-5:** Phase 2 Batch A (Registries) — create template script, batch implement

### Week 2: Tooling + Systems
3. **Day 1-3:** Phase 3 Batch C (CLI Tools) — create CLI template, batch implement
4. **Day 4-5:** Phase 3 Batch D (Cleanup) — parallel grep/audit operations

### Week 3: Features + Architecture
5. **Day 1-3:** Phase 4 Batch E (Feature Systems) — create template, batch implement
6. **Day 4-5:** Phase 4 Batch F (Architecture Packages) — parallel package creation

### Week 4: Docs + CI
7. **Day 1-2:** Phase 5 Batch G (Documentation) — template + batch creation
8. **Day 3-5:** Phase 6 Batch H (CI & Governance) — scripts + workflows

### Week 5: Integration + Remaining
9. **Day 1-2:** Phase 7 Batch I (Integration & API)
10. **Day 3-5:** Phase 8 (Remaining Infrastructure) — sequential based on deps

---

## 🛠️ Automation Scripts to Create

1. **`scripts/generate-registry.sh`** — Registry pattern generator
2. **`scripts/generate-cli-tool.sh`** — CLI tool scaffolder
3. **`scripts/generate-feature-system.sh`** — Feature system template
4. **`scripts/generate-doc.sh`** — Documentation generator
5. **`scripts/batch-create-registries.sh`** — Batch registry creation wrapper

**Estimated ROI:** 50-70% time reduction across all tasks. Invest 1-2 days in script creation, save 2-3 weeks of manual work.

---

## 📊 Task Grouping Summary

| Batch | Tasks | Count | Automation Potential | Estimated Time Savings |
|-------|-------|-------|---------------------|----------------------|
| Phase 0 (Security) | security-1..security-4, infrastructure-1..infrastructure-3 | 7 | Medium (patterns, not templates) | 20-30% |
| Phase 1 (Blockers) | 0-4, 0-5, 0-6, 0-7 | 4 | Low (sequential fixes) | 0% |
| Batch A (Registries) | inf-1..inf-15 (9 tasks) | 9 | **Very High** | 60-70% |
| Batch B (Tokens) | c-5, inf-4, inf-12, inf-13 | 4 | Medium (CSS templates) | 40% |
| Batch C (CLI) | 6-8a..6-8e | 5 | **Very High** | 50% |
| Batch D (Cleanup) | 6-9a, 6-9b, 6-9c, 6-1a | 4 | High (grep/audit) | 60% |
| Batch E (Features) | f-6, f-7, f-8, f-9 | 4 | **High** | 40-50% |
| Batch F (Architecture) | c-8, c-9, c-10, c-17, c-18, e-7 | 6 | Medium (package templates) | 30% |
| Batch G (Docs) | docs-* (5 tasks) | 5 | **Very High** | 70% |
| Batch H (CI/Gov) | c-1, c-7, c-13, d-1, d-6, d-8, c-12, c-14 | 8 | Medium (CI templates) | 40% |
| Batch I (Integration) | api-*, integration-*, scripts-* | 3 | Low (wiring) | 20% |
| Phase 8 (Remaining) | inf-7, inf-9, inf-14 | 3 | Low (dependencies) | 0% |

**Total Tasks:** 60  
**High Automation Potential:** ~35 tasks (58%)  
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

## Fix / blockers (0-*)

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| 0-4-fix-toast-sonner-api | Fix Toast.tsx Sonner API Compatibility | P0 | [0-4-fix-toast-sonner-api.md](0-4-fix-toast-sonner-api.md) |
| 0-5-booking-actions-verification | Add Verification Params to Booking Actions | P0 | [0-5-booking-actions-verification.md](0-5-booking-actions-verification.md) |
| 0-6-marketing-components-build-output | Fix @repo/marketing-components Build Output | P1 | [0-6-marketing-components-build-output.md](0-6-marketing-components-build-output.md) |
| 0-7-validate-workspaces-sync | Resolve validate-workspaces Pass/Fail | P1 | [0-7-validate-workspaces-sync.md](0-7-validate-workspaces-sync.md) |

---

## CLI / tooling (6-8*, 6-9*, 6-1a)

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| 6-8a-turbo-gen-new-client | Implement turbo gen new-client (Plop) | P2 | [6-8a-turbo-gen-new-client.md](6-8a-turbo-gen-new-client.md) |
| 6-8b-implement-create-client-cli | Implement pnpm create-client | P2 | [6-8b-implement-create-client-cli.md](6-8b-implement-create-client-cli.md) |
| 6-8c-implement-validate-site-config | Implement validate-site-config | P2 | [6-8c-implement-validate-site-config.md](6-8c-implement-validate-site-config.md) |
| 6-8d-implement-generate-component | Implement generate-component | P2 | [6-8d-implement-generate-component.md](6-8d-implement-generate-component.md) |
| 6-8e-wire-pnpm-health | Wire pnpm health to Full Pipeline | P2 | [6-8e-wire-pnpm-health.md](6-8e-wire-pnpm-health.md) |
| 6-9a-remove-not-implemented-placeholder | Remove NotImplementedPlaceholder if Unused | P2 | [6-9a-remove-not-implemented-placeholder.md](6-9a-remove-not-implemented-placeholder.md) |
| 6-9b-refine-knip-dependency-pruning | Refine knip.config and Dependency Pruning | P2 | [6-9b-refine-knip-dependency-pruning.md](6-9b-refine-knip-dependency-pruning.md) |
| 6-9c-update-docs-page-templates-state | Update Docs for Current page-templates State | P2 | [6-9c-update-docs-page-templates-state.md](6-9c-update-docs-page-templates-state.md) |
| 6-1a-audit-stale-templates-references | Audit for Stale templates/ References | P2 | [6-1a-audit-stale-templates-references.md](6-1a-audit-stale-templates-references.md) |

---

## API / integration

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| api-catch-all-health-og | Add api/[...routes] with Health + OG | P2 | [api-catch-all-health-og.md](api-catch-all-health-og.md) |
| integration-wiring-client-pages | Wire Integrations into Client Pages | P2 | [integration-wiring-client-pages.md](integration-wiring-client-pages.md) |
| scripts-wire-package-json | Wire Scripts to package.json | P2 | [scripts-wire-package-json.md](scripts-wire-package-json.md) |

---

## Architecture / CI / governance (c-*, d-*, e-*)

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| c-1-architecture-check-dependency-graph | Architecture check-dependency-graph | P2 | [c-1-architecture-check-dependency-graph.md](c-1-architecture-check-dependency-graph.md) |
| c-5-design-tokens | Add Design Token Architecture | P2 | [c-5-design-tokens.md](c-5-design-tokens.md) |
| c-7-storybook-visual-regression | Storybook Visual Regression | P2 | [c-7-storybook-visual-regression.md](c-7-storybook-visual-regression.md) |
| c-8-infra-experiments | Add infra/experiments (Feature Flags, A/B, Guardrails) | P2 | [c-8-infra-experiments.md](c-8-infra-experiments.md) |
| c-9-features-personalization | Add features/personalization | P2 | [c-9-features-personalization.md](c-9-features-personalization.md) |
| c-10-features-content | Add features/content (CMS Abstraction) | P2 | [c-10-features-content.md](c-10-features-content.md) |
| c-12-analytics-event-taxonomy | Analytics Event Taxonomy | P2 | [c-12-analytics-event-taxonomy.md](c-12-analytics-event-taxonomy.md) |
| c-13-security-sast-regression | Security (SAST, Regression Tests) | P2 | [c-13-security-sast-regression.md](c-13-security-sast-regression.md) |
| c-14-slos-performance-budgets | SLOs and Performance Budgets | P2 | [c-14-slos-performance-budgets.md](c-14-slos-performance-budgets.md) |
| c-17-features-compliance | Add features/compliance + types/compliance-packs | P2 | [c-17-features-compliance.md](c-17-features-compliance.md) |
| c-18-infra-edge | Add infra/edge (Edge Middleware Primitives) | P2 | [c-18-infra-edge.md](c-18-infra-edge.md) |
| d-1-schema-versioning-policy | Schema Versioning Policy | P2 | [d-1-schema-versioning-policy.md](d-1-schema-versioning-policy.md) |
| d-6-a11y-release-gate | a11y Release Gate | P2 | [d-6-a11y-release-gate.md](d-6-a11y-release-gate.md) |
| d-8-supply-chain-sbom | Supply Chain (SBOM, Dependency Integrity) | P2 | [d-8-supply-chain-sbom.md](d-8-supply-chain-sbom.md) |
| e-7-infra-ops | Add infra/ops (Queue Policy) | P2 | [e-7-infra-ops.md](e-7-infra-ops.md) |

---

## Docs

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| docs-6-1-reusability-rubric | Add reusability-rubric.md | P2 | [docs-6-1-reusability-rubric.md](docs-6-1-reusability-rubric.md) |
| docs-c2-package-management-policy | Add package-management-policy.md | P2 | [docs-c2-package-management-policy.md](docs-c2-package-management-policy.md) |
| docs-c3-turbo-remote-cache | Add turbo-remote-cache.md | P2 | [docs-c3-turbo-remote-cache.md](docs-c3-turbo-remote-cache.md) |
| docs-c18-edge-personalization | Add edge-personalization.md | P2 | [docs-c18-edge-personalization.md](docs-c18-edge-personalization.md) |
| docs-readme-architecture-diagram | Update README with Architecture Diagram | P2 | [docs-readme-architecture-diagram.md](docs-readme-architecture-diagram.md) |

---

## Infrastructure / registries (inf-*)

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| inf-1-dynamic-section-registry | Dynamic Section Registry | P2 | [inf-1-dynamic-section-registry.md](inf-1-dynamic-section-registry.md) |
| inf-2-component-variant-schema | Component Variant Schema | P2 | [inf-2-component-variant-schema.md](inf-2-component-variant-schema.md) |
| inf-3-font-registry-typography | Font Registry / Theme Typography | P2 | [inf-3-font-registry-typography.md](inf-3-font-registry-typography.md) |
| inf-4-design-token-overrides | Design Token Overrides | P2 | [inf-4-design-token-overrides.md](inf-4-design-token-overrides.md) |
| inf-5-marketing-component-family-registry | Marketing Component Family Registry | P2 | [inf-5-marketing-component-family-registry.md](inf-5-marketing-component-family-registry.md) |
| inf-6-block-content-type-registry | Block / Content Type Registry | P2 | [inf-6-block-content-type-registry.md](inf-6-block-content-type-registry.md) |
| inf-7-generate-component-family-variant | generate-component with --family and --variant | P2 | [inf-7-generate-component-family-variant.md](inf-7-generate-component-family-variant.md) |
| inf-8-layout-template-registry | Layout Template Registry | P2 | [inf-8-layout-template-registry.md](inf-8-layout-template-registry.md) |
| inf-9-industry-extensibility | Industry Extensibility | P2 | [inf-9-industry-extensibility.md](inf-9-industry-extensibility.md) |
| inf-10-integration-adapter-registry | Integration Adapter Registry | P2 | [inf-10-integration-adapter-registry.md](inf-10-integration-adapter-registry.md) |
| inf-11-component-catalog-discovery | Component Catalog / Discovery | P2 | [inf-11-component-catalog-discovery.md](inf-11-component-catalog-discovery.md) |
| inf-12-theme-preset-library | Theme Preset Library | P2 | [inf-12-theme-preset-library.md](inf-12-theme-preset-library.md) |
| inf-13-animation-motion-presets | Animation / Motion Presets | P2 | [inf-13-animation-motion-presets.md](inf-13-animation-motion-presets.md) |
| inf-14-feature-plugin-interface | Feature Plugin Interface | P2 | [inf-14-feature-plugin-interface.md](inf-14-feature-plugin-interface.md) |
| inf-15-structured-data-schema-registry | Structured Data Schema Registry | P2 | [inf-15-structured-data-schema-registry.md](inf-15-structured-data-schema-registry.md) |

---

## Feature systems (f-*)

| Task ID | Title | Priority | Link |
|---------|-------|----------|------|
| f-6-animation-system | Animation System | P2 | [f-6-animation-system.md](f-6-animation-system.md) |
| f-7-interaction-system | Interaction System | P2 | [f-7-interaction-system.md](f-7-interaction-system.md) |
| f-8-responsive-system | Responsive System | P2 | [f-8-responsive-system.md](f-8-responsive-system.md) |
| f-9-grid-system | Grid System | P2 | [f-9-grid-system.md](f-9-grid-system.md) |
