# Governance (C.1–D.8) — Normalized Specs

**Batch:** I (script-heavy; policy docs)
**Scope:** Cross-cutting; mostly scripts + documentation

---

## C.1 Enforce Circular Dependency and Layering Checks

### 1️⃣ Objective Clarification
- Graph validation to block circular deps and invalid upward imports
- Layer: CI / tooling
- **Script:** scripts/architecture/check-dependency-graph.ts

### 2️⃣ Dependency Check
- **Completed:** 0.11 (if present; else None)

### 3️⃣ File System Plan
- **Create:** scripts/architecture/check-dependency-graph.ts
- **Update:** CI workflow to run script; fail on violation
- **Delete:** None

### 4️⃣ Public API (CLI)
```bash
node scripts/architecture/check-dependency-graph.js
# Exit 0: no cycles, valid layers
# Exit 1: cycle or layer violation
```

### 6️⃣ Internal
- Use madge or custom graph; layers: infra < types < utils < ui < features < marketing-components < page-templates < clients
- Block: clients → templates; features → page-templates; etc.

### 1️⃣5️⃣ Anti-Overengineering
- Layer rules from architecture; no custom DSL
- Stop at workspace packages; no file-level (unless needed)

---

## C.2 Harden pnpm Policy and Workspace Determinism

### 1️⃣ Objective Clarification
- Align package-management policy; document linker, peer, workspace rules; CI validation
- **Dependency:** 0.1, 0.2
- **Deliverable:** docs/pnpm-policy.md + CI check

### 3️⃣ File System Plan
- **Create:** docs/pnpm-policy.md
- **Update:** CI (syncpack or equivalent)

---

## C.3 Enable Turborepo Remote Cache

### 1️⃣ Objective Clarification
- Remote caching for CI + local; hit-rate tracking; fallback
- **Dependency:** 0.3, 0.13

### 3️⃣ File System Plan
- **Update:** turbo.json; Vercel Remote Cache or self-hosted
- **Document:** cache behavior, TTL

---

## C.4 Multi-Track Release Strategy (Canary + Stable)

### 1️⃣ Objective Clarification
- Pre-release channels; canary TTL; promotion checklist
- **Dependency:** 0.12 (changesets?)
- **Deliverable:** docs/release-strategy.md

---

## C.5 Three-Layer Design Token Architecture

### 1️⃣ Objective Clarification
- Option / decision / component token layers; W3C DTCG alignment
- **Dependency:** 1.8
- **Files:** packages/config/tokens/ (or packages/ui/tokens/)
- **Subtasks:** C.5a option, C.5b decision, C.5c component tokens

### 1️⃣5️⃣ Anti-Overengineering
- Builds on 0.14 ThemeInjector; don't replace, extend
- No design-token runtime in components; compile-time CSS vars

---

## C.6 Motion Primitives and Creative Interaction Standards

### 1️⃣ Objective Clarification
- Reusable entrance/emphasis/page-transition primitives; motion budget; prefers-reduced-motion alternatives
- **Dependency:** 1.1–1.6, C.5
- **Deliverable:** Motion utility module + doc

---

## C.7 Storybook + Visual Regression Testing

### 1️⃣ Objective Clarification
- Component showroom + visual regression CI; baseline snapshots
- **Dependency:** 6.4
- **Subtasks:** C.7a Storybook setup, C.7b Visual regression CI
- **Tool:** Chromatic or Playwright screenshots

---

## C.8 Experimentation Platform (A/B + Feature Flags)

### 1️⃣ Objective Clarification
- Deterministic assignment; variant selection; outcome instrumentation; kill-switch
- **Dependency:** 1.8, 3.2, 5.1
- **Scope:** Client-side flag resolution; no backend required for MVP

### 1️⃣5️⃣ Anti-Overengineering
- No ML; no multi-armed bandit; simple hash-based assignment
- Kill-switch = config flip; no real-time kill

---

## C.9 Personalization Rules Engine

### 1️⃣ Objective Clarification
- Privacy-safe personalization; geo, returning visitor, campaign source
- **Dependency:** C.8
- **Scope:** Rules-first; consent-aware; no PII in rules

---

## C.10 CMS Abstraction Layer

### 1️⃣ Objective Clarification
- Adapter pattern for MDX, Sanity, Storyblok
- **Dependency:** 2.14, 3.6, 3.7
- **Subtasks:** C.10a contract, C.10b MDX, C.10c Sanity, C.10d Storyblok
- **Contract:** `fetchContent(id): Promise<Content>`; fallback priority

---

## C.11 Localization and RTL Foundation

### 1️⃣ Objective Clarification
- i18n routing; locale dictionaries; RTL compatibility; pseudo-locale testing
- **Dependency:** 5.1, 3.2–3.8
- **Scope:** next-intl or similar; no server-side locale detection (config-driven)

---

## C.12 Standardize Conversion Event Taxonomy

### 1️⃣ Objective Clarification
- Single analytics event contract; naming, payload, PII policy; automated drift tests
- **Dependency:** 4.1–4.5, C.8
- **Deliverable:** docs/analytics/event-taxonomy.md + schema
- **Naming:** e.g. `conversion.booking.submitted`, `conversion.contact.submitted`
- **PII:** No PII in event payload; hash if needed

---

## C.13 Continuous Security Program

### 1️⃣ Objective Clarification
- SAST, dependency scanning, SSRF/XSS regression tests
- **Dependency:** 0.9, 0.10
- **Tools:** Snyk, Dependabot, or similar; OWASP Top 10 checklist

---

## C.14 Performance and Reliability SLO Framework

### 1️⃣ Objective Clarification
- SLOs with CI gates; alert thresholds; per-client reporting
- **Dependency:** 0.6, 0.13
- **Deliverable:** docs/slos.md + CI threshold config

---

## C.15 Spec-Driven Development Workflow

### 1️⃣ Objective Clarification
- Feature specs before implementation; templates in .kiro/specs/
- **Dependency:** 6.7
- **Deliverable:** .kiro/specs/ template + process doc

---

## C.16 AI-Assisted Delivery Playbooks

### 1️⃣ Objective Clarification
- Repeatable AI workflows for implementation, test generation, review
- **Dependency:** C.15
- **Deliverable:** docs/playbooks/

---

## C.17 Industry Compliance Feature Pack Framework

### 1️⃣ Objective Clarification
- Medical privacy, legal disclaimers, secure upload; composable; jurisdiction-aware
- **Dependency:** 1.9, 4.6
- **Scope:** Packs = optional modules; enable per industry

---

## C.18 Edge Personalization and Experiment Routing

### 1️⃣ Objective Clarification
- Edge middleware for variant selection; deterministic hashing; cache-aware keys
- **Dependency:** C.8, C.9
- **Scope:** Next.js middleware; no edge DB

---

## D.1–D.8 (Condensed)

- **D.1** Schema Governance: Versioning, compatibility, deprecation; validation tooling. Dep: C.12
- **D.2** Experimentation Statistics: SRM checks, min run windows, guardrails. Dep: C.8
- **D.3** Editorial Workflow: Content lifecycle, preview, rollback. Dep: C.10
- **D.4** Tenant Operations: Onboarding/offboarding runbooks, quotas. Dep: 5.1, C.17
- **D.5** Incident Management: Severity matrix, postmortem template, error budget gating. Dep: C.14
- **D.6** Continuous Accessibility Gates: PR/release a11y gates; automated checks. Dep: 0.7, 6.4
- **D.7** Ownership Matrix: DRIs, escalation paths. Dep: None
- **D.8** Supply Chain Security: SBOM, provenance, dependency integrity. Dep: C.13

---

### Shared Governance Checklist
1. Create script or doc per task
2. Add CI integration where applicable
3. Document in RUNBOOK.md or docs/
4. No scope creep: policy + automation only; no feature implementation
