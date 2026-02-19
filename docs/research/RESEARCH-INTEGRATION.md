# Research Integration Master Index

_Last updated:_ 2026-02-19  
_Purpose:_ Maps research topics from perplexity research documents to tasks, THEGOAL.md references, and implementation status.

---

## Overview

This document serves as the master index for integrating research findings from multiple sources:

- **Perplexity research** (2026-02): `perplexity-security-2026.md`, `perplexity-architecture-2026.md`, `perplexity-compliance-2026.md`, `perplexity-performance-2026.md` — 25 topics
- **ChatGPT research** (2026-02): `chatgpt-comprehensive-2026.md` — 15 comprehensive topics
- **Gemini research** (2026-02): `gemini-strategic-architecture-2026.md`, `gemini-production-audit-2026.md` — Strategic architecture and production readiness audit

**Total Research Coverage:** 40+ topics across security, architecture, compliance, performance, and operations.

---

## Research-to-Task Mapping

### Critical Security Topics (P0)

| Research Topic                     | Source           | Task ID                                   | Status   | THEGOAL.md Reference                          |
| ---------------------------------- | ---------------- | ----------------------------------------- | -------- | --------------------------------------------- |
| Server Action Security & IDOR      | Perplexity #1    | `security-1-server-action-hardening`      | New      | Not explicitly covered                        |
| Multi-Tenant RLS                   | Perplexity #3    | `security-2-rls-multi-tenant`             | New      | Not explicitly covered                        |
| Webhook Security                   | Perplexity #7    | `security-3-webhook-security`             | New      | Not explicitly covered                        |
| Consent Management                 | Perplexity #16   | `security-4-consent-management`           | New      | Not explicitly covered                        |
| pnpm 10 Supply Chain Security      | Gemini1, Gemini2 | `security-5-pnpm-supply-chain-hardening`  | New      | Not explicitly covered                        |
| React Taint API                    | Gemini2          | `security-6-react-taint-api`              | New      | Not explicitly covered                        |
| Middleware Bypass (CVE-2025-29927) | Gemini2          | `security-7-middleware-bypass-mitigation` | New      | Not explicitly covered                        |
| Supply Chain Security              | Perplexity #2    | `d-8-supply-chain-sbom`                   | Existing | `.github/workflows/sbom-generation.yml` [D.8] |
| Security SAST                      | Perplexity #2    | `c-13-security-sast-regression`           | Existing | `.github/workflows/security-sast.yml` [C.13]  |

### Infrastructure Topics (P1)

| Research Topic                | Source                           | Task ID                                        | Status | THEGOAL.md Reference   |
| ----------------------------- | -------------------------------- | ---------------------------------------------- | ------ | ---------------------- |
| Observability & OpenTelemetry | Perplexity #20, ChatGPT, Gemini1 | `infrastructure-1-observability-opentelemetry` | New    | Not explicitly covered |
| E2E Testing                   | Perplexity #21, ChatGPT, Gemini2 | `infrastructure-2-e2e-testing`                 | New    | Not explicitly covered |
| Integration Resilience        | Perplexity #22                   | `infrastructure-3-integration-resilience`      | New    | Not explicitly covered |
| Partytown Integration         | Gemini2                          | `infrastructure-4-partytown-integration`       | New    | Not explicitly covered |
| Contract Testing (Pact)       | ChatGPT, Gemini1                 | `infrastructure-5-contract-testing-pact`       | New    | Not explicitly covered |
| Scaffold MCP                  | Gemini2                          | `infrastructure-6-scaffold-mcp`                | New    | Not explicitly covered |

### Architecture Topics

| Research Topic         | Topic # | Task ID                           | Status  | THEGOAL.md Reference                                     |
| ---------------------- | ------- | --------------------------------- | ------- | -------------------------------------------------------- |
| Config Versioning      | #9      | `d-1-config-schema-versioning`    | Planned | `scripts/governance/validate-schema-versioning.ts` [D.1] |
| Client Scaffolding CLI | #10     | `6-8-client-scaffolding-cli`      | Planned | `turbo/generators/config.ts` [5.1]                       |
| Module Boundaries      | #11     | `c-1-module-boundary-enforcement` | Planned | `scripts/architecture/check-dependency-graph.ts` [C.1]   |
| Data Residency         | #4      | `infrastructure-4-data-residency` | New     | Not explicitly covered                                   |
| Form Spam Prevention   | #6      | `security-5-form-spam-prevention` | New     | Not explicitly covered                                   |

### Compliance Topics

| Research Topic             | Source        | Task ID                           | Status  | THEGOAL.md Reference                                |
| -------------------------- | ------------- | --------------------------------- | ------- | --------------------------------------------------- |
| WCAG 3.0 & A11y Automation | Perplexity #5 | `d-6-accessibility-automation`    | Planned | `docs/accessibility/component-a11y-rubric.md` [D.6] |
| Data Residency & GDPR      | Perplexity #4 | `infrastructure-4-data-residency` | New     | Not explicitly covered                              |
| CCPA 2026 Updates          | Gemini2       | `compliance-1-ccpa-2026-updates`  | New     | Not explicitly covered                              |
| EU AI Act Compliance       | Gemini2       | `compliance-2-eu-ai-act`          | New     | Not explicitly covered                              |

### Performance Topics

| Research Topic      | Topic # | Task ID           | Status   | THEGOAL.md Reference      |
| ------------------- | ------- | ----------------- | -------- | ------------------------- |
| Bundle Optimization | #12     | Performance tasks | Existing | Various performance tasks |
| Cache Strategy      | #13     | Cache tasks       | Existing | Various cache tasks       |
| Core Web Vitals     | #17     | Performance tasks | Existing | Various performance tasks |

### AI Platform Topics

| Research Topic               | Topic # | Task ID                  | Status | THEGOAL.md Reference              |
| ---------------------------- | ------- | ------------------------ | ------ | --------------------------------- |
| AI Governance & Cost Control | #25     | `ai-platform-governance` | Future | `packages/ai-platform/` [7.1-7.3] |

---

## Research Document Structure

### Consolidated Research Files

**Perplexity Research (2026-02):**

- **`perplexity-security-2026.md`** — Topics: #1, #2, #3, #7, #16, #22, #25
- **`perplexity-architecture-2026.md`** — Topics: #4, #9, #10, #11, #12, #13, #14, #18, #19, #24
- **`perplexity-compliance-2026.md`** — Topics: #4, #5, #16, #17
- **`perplexity-performance-2026.md`** — Topics: #12, #13, #17, #20

**ChatGPT Research (2026-02):**

- **`chatgpt-comprehensive-2026.md`** — 15 comprehensive topics covering monorepo, Next.js 16, TypeScript, Tailwind v4, API integration, security, testing, CI/CD, observability, performance, accessibility, infrastructure, DX, templates

**Gemini Research (2026-02):**

- **`gemini-strategic-architecture-2026.md`** — Strategic architecture specification: pnpm 10 security, Next.js 16/React 19, CaCA, Tailwind v4, Supabase, integrations, testing, observability, compliance
- **`gemini-production-audit-2026.md`** — Production readiness audit: 25 topics covering security hardening, Tailwind v4, monorepo management, AI governance, CCPA 2026, observability, E2E, webhook reliability

### Original Research Files (archived)

These files have been moved to `docs/archive/research/` to reduce documentation sprawl:

- **`perplexity1.md`** — Original JSON-structured research (1530+ lines)
- **`perplexity2.md`** — Duplicate markdown content (consolidated into above)
- **`chatgpt.md`** — Original JSON-structured research (consolidated into `chatgpt-comprehensive-2026.md`)
- **`gemini1.md`** — Original research (consolidated into `gemini-strategic-architecture-2026.md`)
- **`gemini2.md`** — Original research (consolidated into `gemini-production-audit-2026.md`)
- **`qwen.md`, `qwen1.md`** — Empty/incomplete (skipped)
- **`gemini-strategic-architecture-2026.md`, `gemini-production-audit-2026.md`** — Gemini consolidated (also in archive)

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
- [x] `security-5-pnpm-supply-chain-hardening.md` created (ChatGPT/Gemini)
- [x] `security-6-react-taint-api.md` created (Gemini)
- [x] `security-7-middleware-bypass-mitigation.md` created (Gemini)
- [x] `infrastructure-1-observability-opentelemetry.md` created
- [x] `infrastructure-2-e2e-testing.md` created
- [x] `infrastructure-3-integration-resilience.md` created
- [x] `infrastructure-4-partytown-integration.md` created (Gemini)
- [x] `infrastructure-5-contract-testing-pact.md` created (ChatGPT/Gemini)
- [x] `infrastructure-6-scaffold-mcp.md` created (Gemini)
- [x] `compliance-1-ccpa-2026-updates.md` created (Gemini)
- [x] `compliance-2-eu-ai-act.md` created (Gemini)
- [ ] Existing tasks enhanced with research findings (future work: enhance c-13, d-8, d-1, security-1, security-2, infrastructure-1)

### Phase 3: Documentation Updates ✅

- [x] `THEGOAL.md` reviewed (no updates needed — gaps documented in RESEARCH-GAPS.md)
- [ ] Architecture docs created (`docs/architecture/security/server-actions.md`, etc.) — future work
- [x] `RESEARCH-INVENTORY.md` updated

### Phase 4: Prioritization & Wave Planning ✅

- [x] Wave 1 Security Sprint Plan created (Phase 0 in TASKS.md)
- [x] `TASKS.md` updated

---

## References

- **Research Files:**
  - `docs/archive/research/` — LLM research outputs (perplexity1/2, qwen, gemini1/2, chatgpt, gemini-strategic-architecture-2026, gemini-production-audit-2026)
  - `docs/research/RESEARCH-GAPS.md` — Gap analysis
  - `docs/research/RESEARCH-INTEGRATION.md` — This index
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
