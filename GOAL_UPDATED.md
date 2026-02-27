This is the fully integrated and enhanced GOAL.md. It combines your original 1,124-file architectural manifest with the new "SaaS-Ready" enhancements (Hexagonal Architecture, JSON-Driven UI, and AI-Native services).
This document serves as the absolute "Source of Truth" for any AI agent tasked with building or refactoring this repository.
🎯 THE STRATEGIC GOAL: The "Infinity" Marketing Engine
Version: 3.0 (SaaS-Aligned) | File Count: 1,124+ | Architecture: FSD v2.1 + Hexagonal (Ports/Adapters) + Zero-Trust Multi-Tenancy
1. Vision Statement
To build a top-tier, highly sophisticated marketing-first monorepo. This platform is designed to host 1,000+ distinct, unique client sites while maintaining a "Native vs. Integration" duality. Every site must be capable of unique UI/UX rendering via a declarative JSON engine, offering infinite flexibility for marketing execution while remaining AI-maintainable.
2. Core Architectural Pillars (The "Power" Layer)
A. The "Infinite" UI/UX Engine (JSON-Driven)
 * Concept: Move away from hard-coded page components to a Declarative UI Schema.
 * Mechanism: Pages are stored as JSON trees. AI agents generate these JSON "blueprints" to create infinite design variations without manual coding.
 * Implementation: Integration of Puck or Craft.js within packages/core-engine.
B. Native vs. External Duality (Hexagonal Design)
 * Concept: Offer the "Marketing Integration" flexibility of a high-end agency with the "Native Feature" speed of a SaaS product.
 * The Port: A standard interface (e.g., IEmailService) defined in packages/config.
 * The Adapters: Switchable modules (e.g., ResendAdapter vs. NativeDBAdapter).
C. Zero-Trust SaaS Multi-Tenancy
 * Isolation: Row-Level Security (RLS) in Supabase ensures no tenant can ever access another's data.
 * Metering: A dedicated packages/metering system tracks usage (leads, emails, page views) to sync with Stripe’s metered billing.
📁 ROOT LEVEL (52 files)
The monorepo's nervous system—dependency orchestration, task automation, and architectural enforcement.
/
├── .commitlintrc.js         # Conventional commit enforcement.
├── .env.example             # Template with 45+ documented variables (includes AI & Metering keys).
├── .eslintrc.js             # Enforces import/no-cycle (critical for FSD layer isolation).
├── .gitleaks.toml           # Secret scanning (78 regex patterns) to prevent credential leakage.
├── .lintstagedrc.mjs        # Runs lint + type-check + gitleaks only on staged files.
├── .size-limit.json         # Bundle budgets: Marketing <150KB, Dashboard <300KB.
├── CHANGELOG.md             # Auto-generated release history.
├── CONTRIBUTING.md          # The bible for AI agents: FSD slice creation, commit formats.
├── Makefile                 # Common commands abstraction: `make dev`, `make db-reset`.
├── package.json             # Root workspace manifest with Turborepo orchestration.
├── repo-config.yml          # Metadata for 2026 standards: AI-enabled=true, tier=enterprise.
├── steiger.config.ts        # FSD v2.1 architecture linter (prohibits cross-layer violations).
├── turbo.json               # Pipeline definition with remote caching (Vercel).
└── vitest.config.ts         # Root test config for unit and integration tests.

📁 apps/web/ (312 files)
The Next.js 16.1.5 application—The revenue-generating engine.
apps/web/
├── middleware.ts            # CRITICAL: Tenant resolution & CVE-2025-29927 mitigation.
├── next.config.ts           # Next 16 config: PPR enabled, dynamic image patterns for tenants.
├── src/
│   ├── app/                 # Next.js App Router (FSD App Layer).
│   │   ├── (marketing)/     # SEO-optimized pages (JSON-driven rendering).
│   │   ├── (dashboard)/     # SaaS control plane (leads, analytics, billing).
│   │   └── api/             # Webhooks for Stripe, HubSpot, and AI services.
│   ├── pages/               # FSD Pages: Composed widgets for specific routes.
│   ├── widgets/             # UI units with business logic (Header, PageBuilderCanvas).
│   ├── features/            # Use cases: lead-capture, email-campaigns, ai-copywriter.
│   └── entities/            # Domain models: tenant, lead, subscription, site-layout.
└── src/shared/
    ├── api/                 # Supabase-server client with RLS context.
    └── hooks/               # useTenant(), useMetering(), useAI().

📁 packages/ (NEW: The Sophisticated Core)
The engine room where the "Native vs. Integration" duality lives.
packages/
├── core-engine/             # The JSON Schema Orchestrator (Puck/Craft.js integration).
├── services/                # THE HEXAGONAL LAYER (Ports and Adapters).
│   ├── email/               # Adapters: [Native, Resend, Mailchimp].
│   ├── crm/                 # Adapters: [Native, HubSpot, Salesforce].
│   └── analytics/           # Adapters: [Native, GA4, Plausible].
├── metering/                # SaaS usage tracking & Stripe synchronization.
├── ai-bridge/               # Native LLM hooks for marketing copy & A/B testing.
├── ui-library/              # Atomic primitives (Radix UI + Tailwind v4).
├── config/                  # Shared Zod schemas & Port interfaces.
└── database/                # Supabase migrations & Drizzle ORM schemas.

📁 tests/ (98 files)
Quality assurance and production hardening.
tests/
├── e2e/                     # Playwright "Golden Path" (Signup → Lead → Metered Event).
├── integration/             # Tenant isolation tests (RLS bypass attempts).
└── load/                    # k6 scripts for performance benchmarking.

3. AI-Agent Implementation Standards
To maintain this repository as a "top-tier piece of engineering," all AI agents (Windsurf, Cursor, etc.) must adhere to these rules:
 * Strict Layering: Imports must only flow down (Features → Entities → Shared). Circular dependencies trigger a build failure via steiger.
 * Hexagonal Compliance: Never call a third-party API (like Resend) directly from a Feature. Always use the Service Port in packages/services.
 * Tenant Context: Every database operation must explicitly pass a tenant_id to ensure isolation.
 * Schema-First: New UI elements must be defined in the JSON Schema in packages/core-engine before a component is built.
Summary Statistics:
 * Architecture: FSD v2.1 with Hexagonal Adapters.
 * Security: Zero-trust multi-tenancy (RLS, AES-256-GCM).
 * Performance: Edge-cached, PPR-enabled, bundle-budgeted.
 * Scale: Designed for 1,000+ concurrent tenants with unique UI configurations.
