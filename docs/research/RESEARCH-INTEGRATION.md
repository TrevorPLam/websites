# Research Integration Master Index

_Last updated:_ 2026-02-19  
_Purpose:_ Maps research topics from perplexity research documents to tasks, THEGOAL.md references, and implementation status.

---

## Overview

This document serves as the master index for integrating research findings from `perplexity-security-2026.md`, `perplexity-architecture-2026.md`, `perplexity-compliance-2026.md`, and `perplexity-performance-2026.md` into the repository's task system and architecture.

**Research Source:** Perplexity research conducted 2026-02, covering 25 topics on security, architecture, compliance, and performance best practices for 2026.

---

## Research-to-Task Mapping

### Critical Security Topics (P0)

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| Server Action Security & IDOR | #1 | `security-1-server-action-hardening` | New | Not explicitly covered |
| Multi-Tenant RLS | #3 | `security-2-rls-multi-tenant` | New | Not explicitly covered |
| Webhook Security | #7 | `security-3-webhook-security` | New | Not explicitly covered |
| Consent Management | #16 | `security-4-consent-management` | New | Not explicitly covered |
| Supply Chain Security | #2 | `d-8-supply-chain-sbom` | Existing | `.github/workflows/sbom-generation.yml` [D.8] |
| Security SAST | #2 | `c-13-security-sast-regression` | Existing | `.github/workflows/security-sast.yml` [C.13] |

### Infrastructure Topics (P1)

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| Observability & OpenTelemetry | #20 | `infrastructure-1-observability-opentelemetry` | New | Not explicitly covered |
| E2E Testing | #21 | `infrastructure-2-e2e-testing` | New | Not explicitly covered |
| Integration Resilience | #22 | `infrastructure-3-integration-resilience` | New | Not explicitly covered |

### Architecture Topics

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| Config Versioning | #9 | `d-1-config-schema-versioning` | Planned | `scripts/governance/validate-schema-versioning.ts` [D.1] |
| Client Scaffolding CLI | #10 | `6-8-client-scaffolding-cli` | Planned | `turbo/generators/config.ts` [5.1] |
| Module Boundaries | #11 | `c-1-module-boundary-enforcement` | Planned | `scripts/architecture/check-dependency-graph.ts` [C.1] |
| Data Residency | #4 | `infrastructure-4-data-residency` | New | Not explicitly covered |
| Form Spam Prevention | #6 | `security-5-form-spam-prevention` | New | Not explicitly covered |

### Compliance Topics

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| WCAG 3.0 & A11y Automation | #5 | `d-6-accessibility-automation` | Planned | `docs/accessibility/component-a11y-rubric.md` [D.6] |
| Data Residency & GDPR | #4 | `infrastructure-4-data-residency` | New | Not explicitly covered |

### Performance Topics

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| Bundle Optimization | #12 | Performance tasks | Existing | Various performance tasks |
| Cache Strategy | #13 | Cache tasks | Existing | Various cache tasks |
| Core Web Vitals | #17 | Performance tasks | Existing | Various performance tasks |

### AI Platform Topics

| Research Topic | Topic # | Task ID | Status | THEGOAL.md Reference |
|----------------|---------|---------|--------|---------------------|
| AI Governance & Cost Control | #25 | `ai-platform-governance` | Future | `packages/ai-platform/` [7.1-7.3] |

---

## Research Document Structure

### Consolidated Research Files

- **`perplexity-security-2026.md`** — Topics: #1, #2, #3, #7, #16, #22, #25
- **`perplexity-architecture-2026.md`** — Topics: #4, #9, #10, #11, #12, #13, #14, #18, #19, #24
- **`perplexity-compliance-2026.md`** — Topics: #4, #5, #16, #17
- **`perplexity-performance-2026.md`** — Topics: #12, #13, #17, #20

### Original Research Files

- **`perplexity1.md`** — Original JSON-structured research (1530+ lines)
- **`perplexity2.md`** — Duplicate markdown content (consolidated into above)

---

## Wave 1 Prioritization (12-Week Horizon)

Based on research Wave 1 summary, prioritize:

### Security/Critical (P0)
1. **Topic #1** — Server Action Security & IDOR → `security-1-server-action-hardening`
2. **Topic #3** — Multi-Tenant RLS → `security-2-rls-multi-tenant`
3. **Topic #2** — Supply Chain Hardening → `d-8-supply-chain-sbom` (enhance)
4. **Topic #7** — Webhook Security → `security-3-webhook-security`
5. **Topic #20** — Observability → `infrastructure-1-observability-opentelemetry` (supports security)
6. **Topic #21** — E2E Foundation → `infrastructure-2-e2e-testing`
7. **Topic #23** — SEO Baseline → Existing SEO tasks
8. **Topic #24** — Config vs Code Boundaries → `c-1-module-boundary-enforcement` (enhance)
9. **Topic #25** — AI Governance (MVP) → Future AI platform tasks
10. **Topic #16** — Consent Management → `security-4-consent-management`
11. **Topic #9** — Config Versioning → `d-1-config-schema-versioning`

### High Priority (P1)
- **Topic #4 & #14** — Data Residency & Multi-Region → `infrastructure-4-data-residency` (design in Wave 1, implement partially)
- **Topic #6** — Form Spam → `security-5-form-spam-prevention`
- **Topic #11** — Module Boundaries → `c-1-module-boundary-enforcement` (enhance)

---

## Integration Status

### Phase 1: Document Organization ✅
- [x] Consolidated research files created
- [x] RESEARCH-INTEGRATION.md created (this file)
- [x] RESEARCH-GAPS.md created

### Phase 2: Task Creation ✅
- [x] `security-1-server-action-hardening.md` created
- [x] `security-2-rls-multi-tenant.md` created
- [x] `security-3-webhook-security.md` created
- [x] `security-4-consent-management.md` created
- [x] `infrastructure-1-observability-opentelemetry.md` created
- [x] `infrastructure-2-e2e-testing.md` created
- [x] `infrastructure-3-integration-resilience.md` created
- [ ] Existing tasks enhanced with research findings (future work: enhance c-13, d-8, d-1)

### Phase 3: Documentation Updates ✅
- [x] `THEGOAL.md` reviewed (no updates needed — gaps documented in RESEARCH-GAPS.md)
- [ ] Architecture docs created (`docs/architecture/security/server-actions.md`, etc.) — future work
- [x] `RESEARCH-INVENTORY.md` updated

### Phase 4: Prioritization & Wave Planning ✅
- [x] Wave 1 Security Sprint Plan created (Phase 0 in TASKS.md)
- [x] `TASKS.md` updated

---

## References

- **Research Files:** `docs/research/perplexity-*.md`
- **Gap Analysis:** `docs/research/RESEARCH-GAPS.md`
- **Task Inventory:** `tasks/RESEARCH-INVENTORY.md`
- **Architecture:** `THEGOAL.md`
- **Execution Plan:** `tasks/TASKS.md`

---

## Notes

- Research findings are integrated incrementally, prioritizing P0 security gaps first.
- New tasks follow the repository's task naming convention (`security-*`, `infrastructure-*`).
- Existing tasks are enhanced rather than duplicated where research aligns with planned work.
- Wave 1 prioritization aligns with research recommendations for 12-week horizon.
