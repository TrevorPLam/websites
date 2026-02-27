# 🚀 MASTER DOCUMENT: AI-Native SaaS Platform Architecture
## Unified Architecture, Complete Roadmap, and AI Execution Strategy

**Version:** 5.0 Final Consolidated | **Target:** 1,000+ Tenants | **Architecture:** FSD v2.1 + Hexagonal + AI-Native  
**Last Updated:** February 28, 2026 | **Status:** Ready for P0 Critical Task Execution  
**Target File Count:** 1,124+ Files | **Focus:** Transition from Static Repository to AI-Native SaaS Platform

---

## 📋 Table of Contents

1. [Executive Summary & Strategic Vision](#executive-summary--strategic-vision)
2. [Architecture Foundation: The Matrix Approach](#architecture-foundation-the-matrix-approach)
3. [Current State Assessment & Gap Analysis](#current-state-assessment--gap-analysis)
4. [Unified Enhancement Roadmap (Waves 0-7)](#unified-enhancement-roadmap-waves-0-7)
5. [Critical Task Specifications by Priority](#critical-task-specifications-by-priority)
6. [Foundation Status & Legacy Tasks (Completed)](#foundation-status--legacy-tasks-completed)
7. [Complete File Structure Specifications](#complete-file-structure-specifications)
8. [AI Execution Strategy & Force Multipliers](#ai-execution-strategy--force-multipliers)
9. [Production Readiness & Acceptance Criteria](#production-readiness--acceptance-criteria)
10. [Known Discrepancies & Compatibility Notes](#known-discrepancies--compatibility-notes)
11. [Immediate Next Steps & Diagnostic Commands](#immediate-next-steps--diagnostic-commands)

---

## Executive Summary & Strategic Vision

### 🎯 Core Objective

Transform your marketing SaaS platform into a **top-tier, AI-native, enterprise-grade system** capable of serving 1,000+ tenants with:

- **Sub-100ms page loads** via JSON-driven rendering
- **Self-improving marketing** through AI-generated layouts + autonomous A/B testing
- **Bank-grade security**, compliance, and observability
- **5-minute developer onboarding** with AI-agent-safe architecture

### ✨ Validated Strategic Pillars

| Pillar | Technology | Business Impact |
| :--- | :--- | :--- |
| **Vertical Organization** | Feature-Sliced Design v2.1 | Clean domain boundaries, scalable team parallelization |
| **Horizontal Abstraction** | Hexagonal Architecture (Ports/Adapters) | Swap external services without touching business logic |
| **Infinite UI Engine** | Puck Editor + JSON-driven rendering | AI generates layouts by modifying JSON, not code |
| **Usage-Based Billing** | Stripe Billing Meters + Supabase sync | Real-time metering without API rate limits |
| **AI-Native Development** | Turborepo generators + Cursor rules | AI agents work safely in parallel without breaking architecture |
| **Unified Analytics** | Tinybird (ClickHouse) ingestion | 10-100x faster time-series queries for metering & experimentation |
| **Force Multipliers** | AI generators + automation | 40-60% development velocity improvement |

### 🔑 Key Insight: The "Generate, Don't Write" Philosophy

Your repository now operates on a principle where:

- **Generators > Manual Creation:** Write a generator that creates 15+ files perfectly every time
- **Constraints > Documentation:** `.cursorrules` enforce architecture better than any README
- **JSON > Code:** Puck's JSON-driven approach means AI modifies layouts without touching React
- **Hexagonal > Direct:** Adapters make it safe for AI to swap services without breaking features
- **Metering > Guessing:** Track everything from day one—you can't optimize what you don't measure

---

## Architecture Foundation: The Matrix Approach

### 🧩 FSD v2.1 + Hexagonal Architecture Matrix

```text
Vertical (FSD v2.1)    Horizontal (Hexagonal)
─────────────────────────────────────────────────
app/                   ┌────────────────────────┐
pages/                 │   UI Layer (React)     │
widgets/               ├────────────────────────┤
features/              │   Port Interfaces      │ ← contracts only
entities/              ├────────────────────────┤
shared/                │   Adapter Implementations
                       │   [External, Native, Mock]
                       └────────────────────────┘
```

### 🔄 Data Flow Architecture

```text
User Request
     ↓
Edge Middleware (Vercel) → Tenant Resolution (<10ms)
     ↓
Next.js 16 PPR → Dynamic Route Handler
     ↓
ComponentRenderer → Loads JSON from Supabase
     ↓
Puck Registry → Maps componentId → React Component
     ↓
Dynamic Imports (React.lazy) → Rendered Page
     ↓
Tinybird Ingestion → Analytics/Metering Events
```

### Key Import Rules

- **Flow:** `app → pages → widgets → features → entities → shared`
- **Constraint:** Never import from higher layers
- **Notation:** Use `@x` notation for cross-slice dependencies
- **Ports:** Hexagonal "Ports" live in `packages/config` (interfaces only)
- **Adapters:** "Adapters" live in `packages/services/[service]/adapters/`

---

## Current State Assessment & Gap Analysis

### ✅ Strengths Already Implemented

| Category | Implementation Status | Evidence |
| :--- | :--- | :--- |
| **Turborepo Infrastructure** | ✅ Complete | Remote caching, task pipelines, `@turbo/gen` installed |
| **FSD Architecture** | ✅ Complete | Steiger linting, layer separation, path mappings configured |
| **Testing Infrastructure** | ✅ Complete | Vitest, Playwright, coverage enforcement, visual regression |
| **Package Management** | ✅ Complete | pnpm workspaces, syncpack, Renovate automation |
| **Bundle Monitoring** | ✅ Complete | size-limit configuration (13 limits defined) |
| **MCP Framework** | ✅ Complete | Servers, skills, agent orchestration scaffolding (75/75 issues resolved) |
| **Documentation** | ✅ Complete | Diátaxis structure, tutorials, guides |
| **Security Scanning** | ✅ Complete | gitleaks, secret scanning, post-quantum crypto awareness |
| **Tooling** | ✅ Complete | Component generators, client scaffolding, validation scripts |

### ❌ Critical Gaps Identified (Priority Ordered)

#### 🔴 P0: Blocking Production

| Gap | Evidence | Impact | Missing Files |
| :--- | :--- | :--- | :--- |
| **Turborepo Generators Not Configured** | `@turbo/gen` installed but no `turbo/generators/config.ts` | AI agents manually copy-paste boilerplate → inconsistencies | `turbo/generators/config.ts`, `fsd-slice/generator.ts`, templates |
| **AI Coding Rules Missing** | No `.cursorrules` files in root or packages | AI violates FSD boundaries, creates circular dependencies | `.cursorrules`, layer-specific rules files |
| **Next.js 16 PPR Not Enabled** | Not visible in config files | JSON-driven renderer can't achieve sub-100ms loads | `next.config.ts` experimental config, `CacheComponent.tsx` |
| **Puck Editor Not Integrated** | No `@measured/puck` in dependencies | "Infinite UI Engine" vision blocked | `packages/core-engine/puck/config.tsx`, editor routes |

#### 🔴 P1: Enterprise Readiness

| Gap | Evidence | Impact | Missing Files |
| :--- | :--- | :--- | :--- |
| **pnpm Catalogs Not Configured** | Renovate aware but catalogs not implemented | 60% slower installs, version drift risk | `pnpm-workspace.yaml` catalog definitions |
| **Design Tokens Package Incomplete** | Path mapping exists but no Style Dictionary config | Divergent color systems across apps | `sd.config.js`, `puck-theme.ts`, Figma pipeline |
| **Contract Testing Not Implemented** | No `tests/contracts/` directories | Adapters drift from Port interfaces silently | `email-service.contract.ts`, adapter contract tests |
| **Developer Onboarding Incomplete** | Scripts exist but not unified | Hours of senior dev time per new environment | `scripts/setup-dev.ts`, `t3-env` validation |

#### 🟡 P2: SaaS Hardening

| Gap | Evidence | Impact | Missing Files |
| :--- | :--- | :--- | :--- |
| **Compliance Package Empty** | Referenced but lacks GDPR/CCPA implementation | Enterprise deals stall at legal review | `trail-logger.ts`, hash-chained audit logs |
| **Queue Observability Missing** | Inngest scripts but no monitoring | Silent job failures in production | `observability.ts`, DLQ dashboard |
| **Puck Version History Missing** | No `layout_versions` table | Tenants can't recover from bad publishes | Migration, history panel UI |
| **A/B Testing Mutex Missing** | No experiment isolation logic | Overlapping experiments invalidate statistics | `experiment-mutex.ts`, component overlap checks |
| **Tinybird Underutilized** | No unified ingestion layer | Analytics fragmentation, slower queries | `packages/analytics/ingest.ts`, Tinybird pipes |

#### 🟢 P3: AI-Native Enhancements

| Gap | Evidence | Impact | Missing Files |
| :--- | :--- | :--- | :--- |
| **AI-to-JSON Pipeline Missing** | No `packages/core-engine/ai/` directory | AI can't generate Puck layouts from prompts | `generate-layout.ts`, prompt templates |
| **Edge Middleware Incomplete** | Middleware exists but not optimized | Can't scale to 1,000+ tenants | `tenant-resolver.ts`, Edge Config integration |

---

## Unified Enhancement Roadmap (Waves 0-7)

### 🌊 WAVE 0: Foundation & Developer Experience (Prerequisites for Everything)

#### TASK-DEV-001: Developer Onboarding Automation ⭐ CRITICAL
**Status:** 🔴 Must Complete First | **Impact:** 5-minute clone-to-running vs. hours of debugging

```yaml
id: TASK-DEV-001
title: Developer Onboarding & Environment Automation
files:
  - scripts/setup-dev.ts
  - scripts/verify-env.ts
  - scripts/seed.ts
  - .env.example (45+ documented variables)
  - package.json (add "setup" script)
commands:
  - pnpm setup          # One command setup
  - pnpm verify         # Pre-flight check
```

#### TASK-DS-001: Design Tokens Package ⭐ CRITICAL
**Status:** 🔴 Must Complete Before UI Tasks | **Impact:** Prevents system-wide theming drift

```yaml
id: TASK-DS-001
title: Design Tokens Package - Single Source of Truth
files:
  - packages/design-tokens/src/tokens.ts (TypeScript HSL values)
  - packages/design-tokens/src/css-variables.css
  - packages/design-tokens/src/puck-theme.ts
  - packages/design-tokens/src/tailwind-preset.ts
  - packages/design-tokens/src/transforms/ (Style Dictionary transforms)
dependencies: []
blocks: [TASK-UI-001, TASK-UI-002, TASK-SaaS-002]
```

#### TASK-GEN-001: Turborepo Generators for FSD + Hexagonal Scaffolding ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Impact:** Reduces TASK-010 through TASK-035 from weeks to days

```yaml
id: TASK-GEN-001
title: Implement Turborepo Generators
files:
  - turbo/generators/config.ts
  - turbo/generators/fsd-slice/generator.ts + templates/
  - turbo/generators/service-port/generator.ts + templates/
  - turbo/generators/puck-component/generator.ts + templates/
commands:
  - pnpm turbo gen fsd-feature --name email-campaigns
  - pnpm turbo gen service-port --name analytics --adapters [native,ga4,mixpanel]
  - pnpm turbo gen puck-component --name HeroSplit --category marketing
acceptance_criteria:
  - Generates 15+ files per FSD slice with correct @x imports
  - Creates Hexagonal Port interface + 2 Adapter stubs
  - Outputs Puck-compatible component with JSON schema
```

#### TASK-RULES-001: Cursor Rules for Architectural Enforcement ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Impact:** Prevents AI agents from violating FSD/Hexagonal boundaries

```yaml
id: TASK-RULES-001
title: Layer-Specific AI Rules (.cursorrules)
files:
  - .cursorrules (root)
  - packages/entities/.cursorrules
  - packages/features/.cursorrules
  - packages/widgets/.cursorrules
  - packages/services/.cursorrules
rules_summary:
  entities: "Pure logic only. NO React imports. NO external APIs. Only pure TypeScript."
  features: "Can use entities. NO UI imports except @repo/ui. Use Server Actions."
  widgets: "Can use features + entities. React components only. NO app router imports."
  services: "Hexagonal adapters only. Must implement Port interface from packages/config."
```

---

### 🌊 WAVE 1: The "Infinite" UI Engine (JSON-Driven Rendering)

#### TASK-PUCK-001: Puck Editor Integration with Token Integration ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Goal:** JSON-driven page editing with multi-tenant safety

```yaml
id: TASK-PUCK-001
title: Puck Visual Editor Integration with Design Tokens
files:
  - apps/admin/app/editor/[site-id]/page.tsx
  - packages/core-engine/puck/config.tsx
  - packages/core-engine/puck/components/registry.tsx
  - packages/core-engine/puck/theme-bridge.ts
  - database/migrations/20240201000000_site_layouts.sql
dependencies: [TASK-DS-001, TASK-GEN-001, TASK-RULES-001]
validation:
  - Admin can drag/drop components in /admin/editor/site-123
  - Changes save to site_layouts table with RLS (tenant_id check)
  - Editor shows only components allowed by tenant's plan (metering integration)
```

#### TASK-UI-002: Dynamic Page Renderer with Next.js 16 PPR ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Goal:** Sub-100ms initial page loads with dynamic content streaming

```yaml
id: TASK-UI-002
title: JSON-to-React Dynamic Renderer with PPR
files:
  - apps/web/app/[site-slug]/[...path]/page.tsx
  - packages/core-engine/renderer/ComponentRenderer.tsx
  - packages/core-engine/renderer/CacheComponent.tsx
  - packages/core-engine/renderer/hydration.ts
dependencies: [TASK-PUCK-001, TASK-PPR-001]
features:
  - Server Component for data fetching (JSON from DB)
  - Client Component for interactivity (forms, animations)
  - Component lazy loading (React.lazy) for performance
  - Error boundaries for invalid JSON graceful degradation
```

#### TASK-UI-003: Puck Version History & Rollback System ⭐ CRITICAL
**Status:** 🔴 Critical for Production Safety | **Impact:** Prevents broken layouts from persisting

```yaml
id: TASK-UI-003
title: Puck Layout Versioning & Rollback System
files:
  - database/migrations/20240203000000_layout_versions.sql
  - packages/core-engine/puck/history.tsx
  - apps/admin/app/editor/[site-id]/history/page.tsx
dependencies: [TASK-PUCK-001]
```

---

### 🌊 WAVE 2: Hexagonal Services (Native vs. Integration Duality)

#### TASK-SVC-001: Service Port Interfaces
**Status:** 🟡 High Priority | **Goal:** Abstract contracts for all external services

```yaml
id: TASK-SVC-001
title: Hexagonal Port Definitions
files:
  - packages/config/ports/email.port.ts
  - packages/config/ports/crm.port.ts
  - packages/config/ports/analytics.port.ts
  - packages/config/ports/payments.port.ts
hexagonal_principle: "Dependencies point inward. Application code depends on these interfaces, not implementations."
```

#### TASK-SVC-002-REV: Adapter Implementations with Contract Testing ⭐ CRITICAL
**Status:** 🟡 High Priority | **Goal:** Concrete implementations that swap via configuration + behavioral verification

```yaml
id: TASK-SVC-002-REV
title: Adapter Implementations with Contract Testing
files:
  - packages/services/email/adapters/resend.adapter.ts
  - packages/services/email/adapters/native.adapter.ts
  - packages/services/email/factory.ts
  - packages/services/tests/contracts/email-service.contract.ts
  - packages/services/email/adapters/tests/resend.contract.spec.ts
configuration:
  EMAIL_PROVIDER: resend|native
  CRM_PROVIDER: hubspot|native
  ANALYTICS_PROVIDER: ga4|native
```

---

### 🌊 WAVE 3: SaaS Platform & Metering (Unified Analytics)

#### TASK-SaaS-001-REV: Usage Metering via Tinybird ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Goal:** Track billable events with 10-100x query performance

```yaml
id: TASK-SaaS-001-REV
title: Unified Analytics & Metering via Tinybird
files:
  - packages/analytics/ingest.ts
  - packages/metering/buffer/tinybird-buffer.ts
  - tinybird/pipes/quota_usage.pipe
dependencies: [TASK-019]
```

#### TASK-QUEUE-001: Queue Observability & Dead Letter Monitoring ⭐ CRITICAL
**Status:** 🔴 Critical for Production Reliability | **Impact:** Prevents silent job failures

```yaml
id: TASK-QUEUE-001
title: Queue Observability & DLQ Alerting
files:
  - packages/infrastructure/queue/observability.ts
  - packages/infrastructure/queue/health-check.ts
  - apps/admin/app/system/queues/page.tsx
dependencies: [TASK-012]
```

---

### 🌊 WAVE 4: AI-Native Marketing Features (Self-Improving Platform)

#### TASK-AI-004-REV: Autonomous A/B Testing with Experiment Isolation ⭐ CRITICAL
**Status:** 🟡 High Priority | **Goal:** AI generates variants, tracks conversions, auto-optimizes with statistical validity

```yaml
id: TASK-AI-004-REV
title: A/B Testing with Experiment Isolation & Mutex
files:
  - packages/ai-bridge/ab-testing/generate-variant.ts
  - packages/ai-bridge/ab-testing/allocate-traffic.ts
  - packages/ai-bridge/ab-testing/experiment-mutex.ts
  - packages/core-engine/experiments/experiment-store.ts
  - apps/web/widgets/ab-test-wrapper/ABTestWrapper.tsx
  - database/migrations/20240204000000_experiments_mutex.sql
workflow:
  1. User clicks "Optimize" on a page
  2. AI generates 2-3 JSON variants (headlines, CTAs, layouts)
  3. Traffic split 50/50 via middleware
  4. Track conversion events (lead_captured)
  5. Auto-promote winner after statistical significance (p < 0.05)
  6. Mutex prevents overlapping experiments on same components
```

#### TASK-AI-005: AI Content Generation Engine
**Status:** 🟢 Medium Priority | **Goal:** Native marketing copy generation within editor

```yaml
id: TASK-AI-005
title: Marketing Copy AI Assistant
files:
  - packages/ai-bridge/copywriting/generate-headline.ts
  - packages/ai-bridge/copywriting/generate-seo-meta.ts
  - packages/ai-bridge/copywriting/generate-email.ts
  - apps/admin/widgets/ai-writer/ui/AIWriterModal.tsx
  - apps/admin/app/api/ai/copy/route.ts
dependencies: [TASK-PUCK-001, TASK-SaaS-002]
```

---

### 🌊 WAVE 5: Compliance & Security ⭐ NEW ENTERPRISE WAVE

#### TASK-COMP-001: GDPR/CCPA Compliance Package ⭐ CRITICAL FOR ENTERPRISE
**Status:** 🔴 Critical for Enterprise Sales | **Impact:** Enables EU market entry and enterprise deals

```yaml
id: TASK-COMP-001
title: GDPR/CCPA Compliance & Data Sovereignty
files:
  - packages/compliance/gdpr/right-to-erasure.ts
  - packages/compliance/gdpr/data-export.ts
  - packages/compliance/gdpr/consent-manager.ts
  - packages/compliance/audit/trail-logger.ts
  - packages/compliance/audit/trail-verifier.ts
  - packages/compliance/audit/tamper-detection.ts
  - packages/compliance/privacy/cookie-manager.ts
  - packages/compliance/privacy/data-classification.ts
database:
  - migrations/20240205000000_audit_logs.sql
```

---

### 🌊 WAVE 6: Production Hardening & Edge Optimization

#### TASK-EDGE-001: Global Edge Middleware with Vercel Platforms ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Goal:** Sub-10ms tenant resolution at the edge with custom domain support

```yaml
id: TASK-EDGE-001
title: Vercel Edge Middleware & Tenant Resolution
files:
  - apps/web/middleware.ts (280 lines as specified in GOAL.md)
  - packages/infrastructure/edge/tenant-resolver.ts
  - packages/infrastructure/edge/config.ts
technologies:
  - Vercel Edge Config (sub-millisecond KV store)
  - Vercel for Platforms (wildcard domains + custom domains)
  - Next.js 16 Middleware (Edge Runtime)
architecture:
  - Wildcard: *.marketing-platform.com → automatic tenant resolution
  - Custom: client-site.com → Edge Config lookup → tenant context
  - Fallback: Path-based /t/client-site → tenant resolution
```

#### TASK-PERF-001: Next.js 16 Cache Components & PPR Optimization
**Status:** 🟡 High Priority | **Goal:** Sub-100ms initial page loads with dynamic content streaming

```yaml
id: TASK-PERF-001
title: Partial Pre-Rendering & Cache Components
files:
  - apps/web/app/[site-slug]/[...path]/page.tsx (PPR enabled)
  - packages/core-engine/renderer/CacheComponent.tsx
  - apps/web/next.config.ts (PPR configuration)
nextjs_16_features:
  - "use cache" directive for component-level caching
  - Suspense boundaries for streaming
  - CacheTag for granular revalidation
```

#### TASK-CATALOG-001: pnpm Catalogs Configuration ⭐ CRITICAL
**Status:** 🟡 High Priority | **Impact:** 60% faster installs, prevent version drift

```yaml
id: TASK-CATALOG-001
title: pnpm Workspace Catalogs Implementation
files:
  - pnpm-workspace.yaml (catalog definitions)
  - package.json (catalog references)
  - scripts/verify-catalogs.ts (validation script)
dependencies: []
validation:
  - All packages reference catalog versions
  - No version drift across 50+ packages
  - Install time reduced by 60%
```

#### PROD-002: Webhook Idempotency Layer ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Impact:** Prevent duplicate charges and operations

```yaml
id: PROD-002
title: Webhook Idempotency & Deduplication System
files:
  - packages/infrastructure/webhooks/idempotency.ts
  - packages/infrastructure/webhooks/stripe-handler.ts
  - apps/web/api/webhooks/stripe/route.ts
dependencies: [TASK-003]
validation:
  - No duplicate charges from Stripe webhook retries
  - Idempotency keys stored with TTL
  - Webhook failures handled gracefully
```

#### PROD-004: Background Job Queue System ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Impact:** Prevent request timeouts, enable retries

```yaml
id: PROD-004
title: Background Job Queue Infrastructure
files:
  - packages/infrastructure/queue/client.ts (Inngest/BullMQ)
  - packages/infrastructure/queue/jobs/email-job.ts
  - packages/infrastructure/queue/monitoring/dashboard.tsx
dependencies: [TASK-003, TASK-008]
validation:
  - Email sends happen in background
  - Webhook retries automated
  - Queue monitoring dashboard working
```

#### PROD-006: Admin Dashboard Application ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Impact:** Safe data operations without raw SQL

```yaml
id: PROD-006
title: Complete Admin Dashboard for Data Management
files:
  - apps/admin/app/layout.tsx
  - apps/admin/app/dashboard/page.tsx
  - apps/admin/app/tenants/page.tsx
  - packages/admin/components/DataEditor.tsx
dependencies: [TASK-009, TASK-010]
validation:
  - Manual data fixes possible without raw SQL
  - Tenant data isolation maintained
  - All operations audited
```

#### TASK-011: Feature Flags & Edge Configuration System
**Status:** 🟡 High Priority | **Goal:** Runtime feature toggling for gradual rollout

```yaml
id: TASK-011
title: Feature Flags with Vercel Edge Config
files:
  - packages/flags/config.ts (Edge Config client)
  - packages/flags/server.ts (Server-side evaluation)
  - packages/flags/client.ts (Client-side hooks)
  - apps/web/middleware.ts (Flag injection)
dependencies: [TASK-003, TASK-009]
validation:
  - Runtime feature toggling working
  - Tenant-aware targeting functional
  - Canary deployments supported
```

#### TASK-012: Queue System & Background Job Infrastructure
**Status:** 🟡 High Priority | **Goal:** Async processing for heavy operations

```yaml
id: TASK-012
title: Advanced Queue System with Workers
files:
  - packages/infrastructure/queue/workers/emailWorker.ts
  - packages/infrastructure/queue/workers/webhookWorker.ts
  - apps/web/api/inngest/route.ts
dependencies: [TASK-003, TASK-008]
validation:
  - Background processing working
  - Retry logic implemented
  - Dead-letter queue functional
```

#### TASK-020: Page Builder Core & CMS Foundation
**Status:** 🟡 High Priority | **Goal:** Foundational Page Builder data model

```yaml
id: TASK-020
title: Page Builder Core Entities & Rendering
files:
  - packages/core/entities/page/Page.ts
  - packages/core/entities/site/Site.ts
  - apps/web/app/[...slug]/page.tsx (Dynamic renderer)
  - apps/web/widgets/page-builder-canvas/ui/Canvas.tsx
dependencies: [TASK-005, TASK-004, TASK-011]
validation:
  - Page structure persisted
  - Blocks render correctly
  - Preview mode functional
```

#### PERF-001: Core Web Vitals Optimization
**Status:** 🔴 Critical Priority | **Goal:** LCP < 2.5s, INP < 200ms, CLS < 0.1

```yaml
id: PERF-001
title: Core Web Vitals Performance Optimization
files:
  - scripts/performance/optimize-images.ts
  - scripts/performance/bundle-analysis.ts
  - apps/web/app/layout.tsx (Performance optimizations)
dependencies: [TASK-005]
validation:
  - LCP optimization implemented
  - INP interaction response optimized
  - CLS layout stability ensured
```

#### TASK-017: Advanced Security, Audit Logging & Compliance
**Status:** 🟡 High Priority | **Goal:** SOC 2 readiness with comprehensive security

```yaml
id: TASK-017
title: Advanced Security & SOC 2 Compliance
files:
  - packages/infrastructure/security/audit-logger.ts
  - packages/infrastructure/security/encryption.ts
  - database/migrations/20240112000000_audit_logs.sql
  - apps/web/middleware.ts (Security headers)
dependencies: [TASK-003, TASK-009]
validation:
  - Immutable audit trail
  - PII protection ensured
  - SOC 2 readiness achieved
```

---

### 🌊 WAVE 7: Final Integration & 1,124 File Achievement

#### TASK-FINAL-001: Complete FSD Structure for Remaining Apps
**Status:** 🟡 High Priority | **Goal:** Achieve 1,124 files with full architectural compliance

```yaml
id: TASK-FINAL-001
title: Complete apps/admin & apps/portal FSD Structure
files:
  - apps/admin/src/ (148 files - admin dashboard governance)
  - apps/portal/src/ (200 files - client portal enhancements)
generator_command: pnpm turbo gen fsd-app --name admin --type dashboard
automation:
  - Use TASK-GEN-001 generators to scaffold remaining files
  - Ensure @x notation compliance
  - Verify no cross-layer violations with steiger
```

#### TASK-FINAL-002: Integration Testing & Production Validation ⭐ CRITICAL
**Status:** 🔴 Critical Priority | **Goal:** Production-ready with comprehensive testing

```yaml
id: TASK-FINAL-002
title: End-to-End Integration & Load Testing
files:
  - tests/integration/tenant-isolation.spec.ts
  - tests/e2e/golden-path.spec.ts
  - tests/load/k6/tenant-concurrency.js
testing:
  - Integration: RLS bypass attempts, multi-tenant security
  - E2E: Signup → Lead → Booking → Payment flow
  - Load: 1000 concurrent tenants, 10k RPM
```

---

## Critical Task Specifications by Priority

### 🔴 P0: Critical (Blocking Production) - Execute First

| Task ID | Title | Files | AI Execution Summary |
| :--- | :--- | :--- | :--- |
| **TASK-DEV-001** | Developer Onboarding Automation | `scripts/setup-dev.ts`, `.env.example` | ✅ COMPLETED - One-command setup with t3-env validation, Supabase start, database seed |
| **TASK-DS-001** | Design Tokens Package | `packages/design-tokens/` with Style Dictionary | ✅ COMPLETED - Single source of truth feeding Tailwind v4 (HSL), Puck (hex), CSS variables |
| **TASK-GEN-001** | Turborepo Generators | `turbo/generators/` with FSD/Hexagonal/Puck templates | Generate 15+ files per command with correct @x imports and tests |
| **TASK-RULES-001** | AI Coding Rules (.cursorrules) | Layer-specific `.cursorrules` files | Enforce FSD import flow, prevent circular dependencies, guide AI agents |
| **TASK-PUCK-001** | Puck Editor Integration | `packages/core-engine/puck/`, editor routes | JSON-driven editing with token integration, tenant isolation, RLS |
| **TASK-PPR-001** | Next.js 16 PPR Enablement | `next.config.ts`, `CacheComponent.tsx` | Sub-100ms loads via "use cache" directive and streaming hydration |

### 🔴 P1: High Priority (Enterprise Readiness) - Execute Week 2

| Task ID | Title | Files | AI Execution Summary |
| :--- | :--- | :--- | :--- |
| **TASK-CATALOG-001** | pnpm Catalogs | `pnpm-workspace.yaml` catalog definitions | 60% faster installs, prevent version drift across 50+ packages |
| **TASK-SVC-002-REV** | Adapters + Contract Testing | `tests/contracts/`, adapter contract specs | Behavioral verification ensures Resend↔Native interchangeability |
| **TASK-SaaS-001-REV** | Tinybird Metering | `packages/analytics/ingest.ts`, Tinybird pipes | Unified event routing, 10-100x faster time-series queries |
| **TASK-QUEUE-001** | Queue Observability | `observability.ts`, DLQ dashboard | Sentry alerts, Slack/PagerDuty integration, silent failure prevention |
| **PROD-002** | Webhook Idempotency Layer | `packages/infrastructure/webhooks/idempotency.ts` | Prevent duplicate charges from Stripe webhook retries |
| **PROD-004** | Background Job Queue System | `packages/infrastructure/queue/client.ts` | Email sends in background, webhook retries automated |
| **PROD-006** | Admin Dashboard Application | `apps/admin/app/dashboard/page.tsx` | Safe data operations without raw SQL, audit logging |
| **TASK-011** | Feature Flags & Edge Configuration | `packages/flags/config.ts` | Runtime feature toggling, Canary deployments per tenant |
| **TASK-012** | Queue System & Background Jobs | `packages/infrastructure/queue/workers/emailWorker.ts` | Async job processing, retry logic, dead-letter queue |
| **TASK-020** | Page Builder Core & CMS Foundation | `packages/core/entities/page/Page.ts` | Foundational Page Builder data model, key differentiator |
| **PERF-001** | Core Web Vitals Optimization | Performance optimization scripts | LCP < 2.5s, INP < 200ms, CLS < 0.1 targets |
| **TASK-017** | Advanced Security & Compliance | `packages/infrastructure/security/audit-logger.ts` | SOC 2 readiness, field-level encryption, audit logging |

### 🟡 P2: Medium Priority (SaaS Hardening) - Execute Week 3

| Task ID | Title | Files | AI Execution Summary |
| :--- | :--- | :--- | :--- |
| **TASK-COMP-001** | GDPR Compliance Package | `packages/compliance/`, hash-chained audit logs | Cryptographic audit integrity, right-to-erasure, enterprise sales enabler |
| **TASK-UI-003** | Puck Version History | `layout_versions` table, history panel UI | Safety net for tenant layout changes, rollback in <30 seconds |
| **TASK-AI-004-REV** | A/B Testing Mutex | `experiment-mutex.ts`, component overlap checks | Prevent interaction effects that invalidate statistical significance |
| **TASK-EDGE-001** | Edge Middleware Optimization | `tenant-resolver.ts`, Edge Config integration | Sub-10ms tenant resolution at scale, custom domain SSL automation |

### 🟢 P3: Enhancement (AI-Native Features) - Execute Week 4+

| Task ID | Title | Files | AI Execution Summary |
| :--- | :--- | :--- | :--- |
| **TASK-AI-003** | AI-to-JSON Generation Pipeline | `packages/core-engine/ai/`, prompt templates | LLM generates valid Puck JSON from text prompts with Zod validation |
| **TASK-AI-005** | AI Content Generation | `copywriting/` module, AIWriterModal | In-editor headline, SEO meta, and email campaign generation |
| **TASK-FINAL-001** | Complete FSD Structure | `apps/admin/`, `apps/portal/` via generators | Achieve 1,124 files with full architectural compliance |
| **TASK-FINAL-002** | Production Validation | Integration/E2E/load tests | Comprehensive testing suite for tenant isolation, E2E flows, load handling |

---

## Foundation Status & Legacy Tasks (Completed)

*Note: The following tasks originate from OLDTODO.md and represent foundational work completed prior to the Enhancement Roadmap above. Task IDs differ from the Active Roadmap.*

### 🟢 Priority 2: Core Infrastructure Foundation (Wave 0) - COMPLETED

- **TASK-001:** Monorepo Harness & Build Orchestration (Turborepo, pnpm)
- **TASK-002:** Database Foundation with Tenant Isolation (RLS policies)
- **TASK-003:** Infrastructure Context & Security (AsyncLocalStorage, AES-256-GCM)
- **TASK-004:** Domain Entity Foundation (Result/Option patterns)
- **TASK-005:** UI Primitive Design System (CVA architecture, WCAG 2.2 AA)

### 🟢 Priority 3: Production Operations & Survival - COMPLETED

- **PROD-001:** Production Readiness Runbook (5 guides, ≤3 min rollback)
- **PROD-005:** Live Database Migration Strategy (Expand/contract patterns)
- **PROD-007:** Production Monitoring & Alerting (13 alert rules)
- **PROD-003:** UI Error Boundaries (Reusable components, Sentry)

### 🟢 Priority 4: MVP Features & Authentication - COMPLETED

- **TASK-006:** Lead Management Feature & Server Actions (100+ test cases)
- **TASK-007:** Lead Capture Widget & Marketing Page (Core Web Vitals optimized)

### 🟢 Priority 5: FSD Architecture & TheGoal Completion - PARTIAL

| Task ID | Title | Status | Notes |
| :--- | :--- | :--- | :--- |
| **TASK-033** | Complete apps/web FSD Structure | ✅ Completed - 593 files | Exceeded target (312 files) |
| **TASK-040** | Complete Testing Infrastructure | ✅ Done - Integration, E2E, k6 | 9 major capability areas |
| **TASK-034** | Complete apps/admin FSD Structure | 🟡 To Do | 148 files target |
| **TASK-035** | Complete apps/portal FSD Structure | 🟡 To Do | 200 files target |
| **TASK-036** | Complete FSD v2.1 Architecture Compliance | 🟡 To Do | @x notation enforcement |
| **TASK-037** | Zero-Trust Multi-Tenant Security Architecture | 🟡 To Do | CVE-2025-29927 mitigation |
| **TASK-038** | Edge Middleware & Performance Optimization | 🟡 To Do | 280-line middleware.ts |
| **TASK-039** | Complete Package Architecture (25+ packages) | 🟡 To Do | FSD compliance across packages |
| **TASK-041** | Complete CI/CD Pipeline (38 files target) | 🟡 To Do | GitHub Actions workflows |
| **TASK-042** | Complete Documentation & Knowledge Management | 🟡 To Do | 200+ guides target |
| **TASK-043** | Complete Scripts & Automation (25 files target) | 🟡 To Do | Environment, database, release |
| **TASK-044** | Final Integration & 1,124 File Target Achievement | 🟡 To Do | Production readiness validation |

### 🧠 Knowledge Graph: Completed Tasks Archive (Legacy)

#### Layer 1: Critical Decisions (Immediate AI Agent Context)

- **Foundation Infrastructure Node:** Node 20.11.0 enforced (not 22.x), Vitest adoption (161 tests)
- **Multi-Tenant Security Node:** RLS policies, OAuth 2.1 with PKCE
- **Documentation Standards Node:** Ground truth freeze policy for AI agents
- **Admin Dashboard Node:** FSD v2.1 architecture for enterprise scale (35+ features)
- **Testing Infrastructure Excellence Node:** 9 major capability areas (Contract, Performance, AI Test Generation)
- **MCP Infrastructure Production Readiness Node:** 75/75 issues resolved, Zero critical vulnerabilities
- **Skills Layer Implementation Node:** 25/25 issues resolved (Marketing Agency, Core Operations)

#### Layer 2: Temporal Flow (Development Context)

- **Week 1 (2026-02-24):** Foundation Stabilization (Node → Test Framework → Build → Documentation Freeze)
- **Week 2 (2026-02-25):** Production Readiness (Security → Monitoring → Admin Dashboard → Deployment)
- **Week 3 (2026-02-26):** Infrastructure Excellence (Testing → MCP Hardening → Skills Implementation)

#### Layer 3: Implementation Patterns (Reference Context)

- **Technical Standards:** FSD v2.1, TypeScript strict mode, Vitest, Core Web Vitals <200ms INP
- **Multi-Tenant Patterns:** Tenant Resolution (Subdomain → Custom Domain → Path), RLS with tenant_id claims
- **Enterprise Capabilities:** Admin Dashboard, Analytics (Tinybird), Security (Audit trails, RBAC)

---

## Complete File Structure Specifications

### 📁 Total File Count Target: 1,124 Files

| Category | File Count | Description |
| :--- | :--- | :--- |
| **Root Level** | 52 files | Orchestration, CI/CD, configuration |
| **Apps** | 660 files | `web`: 312, `admin`: 148, `portal`: 200 |
| **Packages** | 412 files | 25+ packages with full implementations |
| **AI-Native** | 45 files | Generators, rules, scaffolding |
| **Infrastructure** | 105 files | Edge, metering, SaaS, services |
| **TOTAL** | **1,124+ files** | Across 6 architectural pillars |

### 📁 tooling/ai-native/ (45 files - Force Multipliers)

```text
├── turbo/generators/
│   ├── fsd-slice/ (config.ts, generator.ts, templates/)
│   ├── service-port/ (config.ts, generator.ts, templates/)
│   └── puck-component/ (config.ts, generator.ts, templates/)
├── cursor-rules/ (entities, features, widgets, services, shared)
└── scaffolding/ (site-from-template.ts, test-generation/)
```

### 📁 packages/core-engine/ (65 files - The "Infinity" Engine)

```text
├── schema/ (page.schema.ts, component-registry.ts, theme.schema.ts)
├── puck/ (config.tsx, plugins/, fields/, theme-bridge.ts, history.tsx)
├── renderer/ (ComponentRenderer.tsx, CacheComponent.tsx, hydration.ts, error-boundary.tsx)
├── ai/ (generate-layout.ts, prompts/, validators/)
└── experiments/ (ab-test-engine.ts, experiment-mutex.ts, traffic-split.ts, analytics.ts)
```

### 📁 packages/services/ (85 files - Hexagonal Layer)

```text
├── config/ports/ (email.port.ts, crm.port.ts, analytics.port.ts, payments.port.ts)
├── email/ (adapters/, factory.ts, types.ts)
├── crm/ (adapters/, mapper.ts, factory.ts)
├── analytics/ (adapters/, event-queue.ts)
├── payments/ (adapters/, subscription-manager.ts)
└── tests/contracts/ (email-service.contract.ts, contract-runner.ts)
```

### 📁 packages/metering/ (35 files - SaaS Infrastructure)

```text
├── buffer/ (tinybird-buffer.ts, redis-buffer.ts, memory-buffer.ts, flush-strategy.ts)
├── aggregator/ (usage-aggregator.ts, rollup-job.ts, alerts.ts)
├── sync/ (stripe-sync.ts, quota-check.ts, overage-handler.ts)
└── dashboard/ (usage-chart.tsx, quota-settings.tsx, billing-portal.tsx)
```

### 📁 packages/saas/ (40 files - Platform Operations)

```text
├── provisioning/ (onboard.ts, schema-init.ts, welcome-flow.ts, domain-setup.ts)
├── plans/ (definitions.ts, entitlement-check.ts, feature-gates.tsx, upgrade-paths.ts)
├── tenant-management/ (suspend.ts, impersonate.ts, transfer-ownership.ts)
└── webhooks/ (tenant-events.ts, usage-alerts.ts)
```

### 📁 packages/infrastructure/edge/ (25 files - Edge Optimization)

```text
├── tenant-resolver.ts, config.ts, security-headers.ts, csp-generator.ts, rate-limiter.ts
```

### 📁 packages/ai-bridge/ (55 files - AI Native Features)

```text
├── copywriting/ (generate-headline.ts, generate-seo-meta.ts, generate-email.ts, improve-text.ts)
├── ab-testing/ (generate-variant.ts, allocate-traffic.ts, experiment-mutex.ts, analyze-results.ts)
├── prompts/ (marketing/, system/)
├── llm/ (anthropic-client.ts, openai-client.ts, fallback-router.ts)
└── safety/ (content-moderation.ts, pii-redaction.ts, rate-limit.ts)
```

### 📁 packages/compliance/ (25 files - Enterprise Enablement)

```text
├── gdpr/ (right-to-erasure.ts, data-export.ts, consent-manager.ts)
├── audit/ (trail-logger.ts, trail-verifier.ts, tamper-detection.ts)
└── privacy/ (cookie-manager.ts, data-classification.ts)
```

### 📁 apps/web/ (312 files - Primary Application)

- **Structure:** FSD v2.1 (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`)
- **Key Files:** `middleware.ts` (280 lines), `next.config.ts`, `layout.tsx`, `page.tsx`
- **Features:** Auth, Marketing, Dashboard, Content, Campaigns, Settings, API Routes

### 📁 apps/admin/ (148 files - Internal Governance)

- **Structure:** Mirror `apps/web` FSD structure
- **Key Features:** Tenant management, User search, Billing analytics, System health, Queue monitoring

### 📁 apps/portal/ (200 files - Client Portal)

- **Structure:** FSD v2.1
- **Key Features:** Client dashboard, Analytics, Settings, Leads, White-label customization

### 📁 apps/storybook/ (65 files - Component Documentation)

- **Structure:** `.storybook/`, `src/stories/`
- **Key Features:** Visual regression testing, Component documentation, Accessibility validation

### 📁 clients/ (45 files - Enterprise Client Overrides)

- **Structure:** `_template/`, `[client-name]/`
- **Key Features:** White-label customization, Brand overrides, Custom components

### 📁 database/ (55 files - Supabase-Native Schema)

- **Migrations:** 25 SQL files (Immutable history)
- **Functions:** Supabase Edge Functions (Deno/TypeScript)
- **Policies:** RLS documentation and testing
- **Triggers:** Audit triggers
- **Seed:** Golden path test data

### 📁 docs/ (85 files - Documentation)

- **Guides:** Getting started, Architecture, Development, Deployment
- **ADRs:** Architecture Decision Records (Immutable history)
- **Tasks:** AI context files
- **Runbooks:** SOC-2 operations documentation
- **Research:** Auth providers, CMS options, Performance benchmarks

### 📁 scripts/ (25 files - Automation)

- **Setup:** `setup-env.sh`, `setup-env.ps1`
- **Database:** `seed.ts`, `db-migrate.sh`, `db-backup.sh`
- **Testing:** `load-test/` (k6), `verify-locks.sh`, `check-circular.sh`
- **Analysis:** `bundle-analyze.js`, `dependency-graph.js`

### 📁 .github/ (38 files - DevOps)

- **Workflows:** CI gates, Security audit, Tenant isolation, Lighthouse, E2E, Production deploy, Release
- **Actions:** Setup node/pnpm, Vercel deploy
- **Templates:** PR, Issues, Security vulnerability

### 📁 Additional Packages (From GOAL.md)

| Package | Files | Purpose |
| :--- | :--- | :--- |
| **packages/i18n/** | 18 files | Internationalization (next-intl configuration) |
| **packages/email/** | 42 files | React Email Templates |
| **packages/seo/** | 24 files | Search Engine Optimization |
| **packages/types/** | 20 files | Shared TypeScript Definitions |
| **packages/utils/** | 22 files | Shared Utilities (Isomorphic functions) |
| **packages/config/** | 28 files | Tooling Configurations (ESLint, TypeScript, Tailwind) |
| **packages/integrations/** | 65 files | Plugin System + Core Adapters |
| **packages/infrastructure/** | 78 files | External Concerns (Auth, DB, Cache, Monitoring) |
| **packages/ui-primitives/** | 90 files | Radix UI + Tailwind Base Components |
| **packages/ui-marketing/** | 60 files | Marketing Section Components |
| **packages/ui-dashboard/** | 45 files | Data-Dense Dashboard Components |
| **packages/core/** | 85 files | Domain Logic (Zero External Dependencies) |
| **packages/features/** | 95 files | Use Case Orchestration |

---

## AI Execution Strategy & Force Multipliers

### 🤖 The "AI-Agent-Safe" Development Model

```text
Human Architect
     ↓
Defines: Architecture Rules (.cursorrules) + Generators (TASK-GEN-001)
     ↓
AI Agent (Cursor/Windsurf)
     ↓
Receives: Clear constraints + scaffolding templates
     ↓
Executes: TASK-AI-XXX blocks with architectural guardrails
     ↓
Output: Consistent, boundary-respecting, tested code
```

### 🔧 Force Multiplier Tooling Stack

| Category | Tools | Purpose |
| :--- | :--- | :--- |
| **Core Infrastructure** | `@turbo/gen`, `@measured/puck`, `stripe`, `@vercel/edge-config`, `@anthropic-ai/sdk` | Foundation tools |
| **Development Excellence** | `@changesets/cli`, `steiger`, `style-dictionary`, `@t3-oss/env-nextjs` | Quality & consistency |
| **Testing & Observability** | `vitest`, `@playwright/test`, `@sentry/nextjs`, `@tinybirdco/client` | Validation & monitoring |

### 🧠 AI Execution Block Pattern (Copy-Paste Template)

```typescript
// AI Execution Block for [TASK-ID]
// Purpose: [One-line goal]
// Files to create/modify: [List]
// Dependencies: [TASK-XXX references]
// Key constraints: [Architectural rules]
// Validation criteria: [Acceptance tests]

// [Implementation code with comments]
// • Follow FSD import flow: app → pages → widgets → features → entities → shared
// • Use @x notation for cross-slice imports
// • Return Result<T, Error> types from @repo/shared
// • Implement Hexagonal Port interfaces in packages/config
// • Validate all JSON against Zod schemas before persistence
// • Inject tenant context via middleware headers
// • Use "use cache" directive for static components (Next.js 16)
// • Lazy load interactive components with React.lazy
// • Track all billable events via packages/analytics/ingest.ts
// • Respect ai_credits quota before LLM calls
```

---

## Production Readiness & Acceptance Criteria

### ✅ Technical Validation Checklist

- [ ] **Design Tokens:** Change primary color in `tokens.ts`, all apps update without code changes
- [ ] **Contract Tests:** Swap Resend → Native adapter, all tests pass without modification
- [ ] **Audit Logs:** Delete a user, verify hash chain remains intact via `verifyAuditChain()`
- [ ] **Queue Health:** Kill a worker mid-job, verify DLQ alert fires within 30 seconds
- [ ] **Puck Rollback:** Publish broken layout, restore previous version in <30 seconds
- [ ] **Experiment Mutex:** Try to activate overlapping experiments, system prevents with clear error
- [ ] **Edge Resolution:** Tenant lookup completes in <10ms at 99th percentile
- [ ] **PPR Performance:** Marketing page LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **Bundle Budgets:** Marketing app <150KB, dashboard <300KB (verified by size-limit)
- [ ] **Tenant Isolation:** Tenant A cannot access Tenant B's data via any API/UI path

### 💼 Business Validation Checklist

- [ ] **GDPR Export:** Generate complete data dump for tenant in <2 minutes
- [ ] **Onboarding:** New developer runs `pnpm setup`, has running app in <5 minutes
- [ ] **A/B Testing:** Run 3 concurrent experiments with zero interaction effects
- [ ] **Analytics:** Query 30 days of usage data in Tinybird in <100ms
- [ ] **Billing Accuracy:** Stripe meter events match actual usage within 0.1% tolerance
- [ ] **Compliance Audit:** Pass SOC 2 Type I review with hash-chained audit logs
- [ ] **Enterprise Sales:** Close first $10k/month deal with GDPR/CCPA compliance as differentiator
- [ ] **AI Efficiency:** 80% of new features generated via TASK-GEN-001 + AI Execution Blocks

### 📊 File Count Achievement Validation

- **Target:** 1,124+ files across 6 architectural pillars
- **Breakdown:** `apps/web`: 312, `apps/admin`: 148, `apps/portal`: 200, `packages/`: 464
- **Validation Command:** `pnpm tsx scripts/verify-file-count.ts`

---

## Known Discrepancies & Compatibility Notes

| Area | Source A (`GOAL.md`/`TODO.md`/`1.md`) | Source B (`OLDTODO.md`) | Resolution/Note |
| :--- | :--- | :--- | :--- |
| **Node Version** | `.nvmrc` specifies **Node v20.11.0 (LTS)** | Claims **Node 22.x Standardization** completed | **Conflict:** `.nvmrc` is the enforced standard. Node 22.x claim in `OLDTODO.md` may be aspirational or local dev variance. Stick to 20.11.0 for build stability. |
| **Task IDs** | Uses descriptive IDs (e.g., `TASK-DEV-001`, `TASK-PUCK-001`) | Uses sequential IDs (e.g., `TASK-001`, `TASK-033`, `PROD-002`) | **Mapping:** `OLDTODO.md` tasks represent **Foundation/Legacy** work. `TODO.md` tasks represent **Active Enhancement** work. Both sets preserved. |
| **File Count** | Target **1,124 files** total | `TASK-033` claims **593 files** for `apps/web` alone (190% of target 312) | **Note:** `OLDTODO.md` file counts may include generated/test files differently. The 1,124 target remains the architectural goal for the *enhanced* structure. |
| **Waves** | Waves 0-7 (Enhancement Plan) | Waves 0-3 Vertical Slicing (Foundation Plan) | **Integration:** Foundation Waves (0-3) are largely **Completed**. Enhancement Waves (0-7) are **Active**. |
| **Status** | Many tasks marked "To Do" / "Critical" | Many tasks marked "Completed" (2026-02-24) | **Temporal:** `OLDTODO.md` reflects state *prior* to the Enhancement Plan. Use `OLDTODO.md` for completed foundation, `TODO.md` for next steps. |
| **Knowledge Graph** | Not explicitly mentioned | Detailed "Knowledge Graph" architecture for tasks | **Integration:** Knowledge Graph layers preserved in "Foundation Status" section for AI context management. |
| **MCP Implementation** | Referenced briefly | 75/75 issues resolved, detailed security framework | **Integration:** MCP details preserved in Foundation Status section |
| **Package Structures** | Some packages not detailed | Detailed package breakdown (25+ packages) | **Integration:** All package structures from GOAL.md preserved in File Structure Specifications |

---

## Immediate Next Steps & Diagnostic Commands

### 🚀 This Week (High Impact) - Execute in Order

```bash
# 1. Verify current state gaps
ls -la turbo/generators/ 2 >/dev/null || echo "🔴 MISSING: Turborepo generators"
ls -la .cursorrules 2 >/dev/null || echo "🔴 MISSING: AI coding rules"
grep -q "@measured/puck" package.json && echo "✅ Puck installed" || echo "🔴 MISSING: Puck editor"
grep -q "ppr: true" apps/web/next.config.ts 2 >/dev/null && echo "✅ PPR enabled" || echo "🔴 MISSING: PPR config"
grep -q "catalog:" pnpm-workspace.yaml 2 >/dev/null && echo "✅ Catalogs configured" || echo "🔴 MISSING: pnpm catalogs"

# 2. Execute P0 tasks sequentially
pnpm setup  # TASK-DEV-001: Developer onboarding
pnpm turbo gen fsd-slice --name design-system  # TASK-GEN-001: Create first generator
# Create .cursorrules files per TASK-RULES-001 specification
pnpm add @measured/puck @measured/puck-plugin-heading-analyzer  # TASK-PUCK-001
# Update next.config.ts with experimental.ppr: true  # TASK-PPR-001
# Configure pnpm catalogs for dependency management  # TASK-CATALOG-001

# 3. Execute critical production tasks
# Implement webhook idempotency layer  # PROD-002
# Set up background job queue system  # PROD-004
# Build admin dashboard application  # PROD-006
# Configure feature flags system  # TASK-011
# Implement queue workers  # TASK-012
# Build page builder core  # TASK-020
# Optimize Core Web Vitals  # PERF-001
# Implement security compliance  # TASK-017

# 4. Install critical dependencies
pnpm add -D @turbo/gen style-dictionary @t3-oss/env-nextjs
pnpm add @tinybirdco/client @vercel/edge-config @anthropic-ai/sdk
pnpm add inngest bullmq @vercel/kv  # Queue system dependencies
pnpm add @vercel/flags  # Feature flags

# 5. Run verification
pnpm verify  # TASK-DEV-001 env validation
npx steiger ./packages  # FSD boundary linting
pnpm test:contracts  # TASK-SVC-002-REV contract tests (once implemented)
pnpm test:webhooks  # PROD-002 webhook idempotency tests
pnpm test:queues  # PROD-004 background job tests
```

### 📅 Next Week (Enterprise Readiness)

- **P1 Tasks:** Configure pnpm catalogs, Complete Style Dictionary setup, Implement first contract test suite, Enhance setup script
- **P2 Tasks (Parallel):** Queue observability + Tinybird metering, Puck version history + A/B testing mutex, GDPR compliance package + edge middleware optimization

### 🔧 Tools to Install Today

```bash
# Core infrastructure
pnpm add -D @turbo/gen
pnpm add @measured/puck @measured/puck-plugin-heading-analyzer
pnpm add stripe @stripe/stripe-js
pnpm add @vercel/edge-config
pnpm add @anthropic-ai/sdk

# Development excellence
pnpm add -D @changesets/cli
pnpm add -D steiger
pnpm add -D style-dictionary
pnpm add -D @t3-oss/env-nextjs

# Testing & observability
pnpm add -D vitest @vitest/coverage-v8
pnpm add -D @playwright/test
pnpm add @sentry/nextjs
pnpm add @tinybirdco/client
```

---

## 🔗 Critical Dependency Graph

```text
TASK-DEV-001 (Setup) ✅
  ↓
TASK-DS-001 (Tokens) ✅ → TASK-GEN-001 (Generators) → TASK-RULES-001 (Cursor Rules)
  ↓                              ↓
TASK-PUCK-001 (Editor) ←─────────┘
  ↓
TASK-UI-002 (Renderer) + TASK-PPR-001 (Performance) + TASK-UI-003 (Rollback)
  ↓
TASK-SVC-001 (Ports) → TASK-SVC-002-REV (Adapters + Contracts)
  ↓
TASK-SaaS-001-REV (Metering) + TASK-QUEUE-001 (Observability)
  ↓
TASK-AI-004-REV (A/B Testing) + TASK-COMP-001 (Compliance)
  ↓
TASK-EDGE-001 (Middleware) + TASK-FINAL-001 (FSD Completion) + TASK-FINAL-002 (Validation)
```

---

> **Final Note:** This master document represents a **bank-grade, enterprise-ready SaaS architecture** where AI agents can work safely in parallel without breaking each other's code. The combination of **FSD structure + Hexagonal abstraction + JSON-driven UI + cryptographic compliance** creates a system that scales to 1,000+ tenants while maintaining visual consistency, regulatory compliance, and statistical validity in experimentation.
>
> **You now have a "Generate, Don't Write" philosophy** that aligns perfectly with AI-native development. Execute the **P0 tasks first** to unlock parallel AI execution, then proceed through the waves to achieve production readiness.

---

**Document Version:** 5.0 Final Consolidated  
**Last Updated:** February 28, 2026  
**Source Files:** GOAL.md, GOAL_UPDATED.md, TODO.md, OLDTODO.md, 1.md  
**Information Preservation:** 100% (All content from all 5 files preserved with compatibility notes)  
**Status:** P0 Tasks 2/6 Completed (33% Progress)