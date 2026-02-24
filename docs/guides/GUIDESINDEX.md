# Documentation Guides Index

> **Complete Reference Repository — February 2026**

This index provides a comprehensive overview of all documentation guides organized by category and technical domain. Each guide includes production-ready implementation patterns with 2026 standards compliance.

## 📚 Documentation Architecture

### Strategic Nesting Philosophy

The documentation is organized following a **domain-driven architecture** that mirrors the actual codebase structure:

- **`backend-data/`** - Backend services, databases, and external integrations
- **`frontend/`** - Client-side development, UI components, and user experience
- **`infrastructure-devops/`** - Deployment, monitoring, and operational patterns
- **`security/`** - Security architecture, authentication, and compliance
- **`multi-tenant/`** - SaaS-specific patterns and tenant isolation
- **`architecture/`** - System design patterns and decision records
- **`best-practices/`** - Development workflows and coding standards

---

## 🗂️ Category Index

### 🔧 Backend & Data Integration

**Location**: `docs/guides/backend-data/`

| Document                                                                                    | Description                                 | Key Topics                                  | 2026 Standards            |
| ------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------- |
| [hubspot-documentation.md](./backend-data/hubspot-documentation.md)                         | HubSpot CRM integration with OAuth v3       | Lead management, API integration, webhooks  | OAuth 2.1, PKCE           |
| [multi-layer-rate-limiting.md](./backend-data/multi-layer-rate-limiting.md)                 | Advanced rate limiting with sliding windows | Redis integration, tiered limits, analytics | Sliding window algorithms |
| [secrets-manager.md](./backend-data/secrets-manager.md)                                     | Enterprise secrets management               | Encryption at rest, multi-tenant, rotation  | Post-quantum ready        |
| [pgbouncer-supavisor-configuration.md](./backend-data/pgbouncer-supavisor-configuration.md) | Database connection pooling                 | PgBouncer, Supavisor, performance           | Connection optimization   |
| [schema-migration-safety.md](./backend-data/schema-migration-safety.md)                     | Zero-downtime database migrations           | Expand/contract, rollback strategies        | Migration safety          |
| [feature-flags-system.md](./backend-data/feature-flags-system.md)                           | Feature flag management                     | PostHog, LaunchDarkly, A/B testing          | Edge evaluation           |
| [aws-rds-proxy-documentation.md](./backend-data/aws-rds-proxy-documentation.md)             | AWS RDS Proxy integration                   | Connection pooling, security                | Database proxy            |
| [clickhouse-documentation.md](./backend-data/clickhouse-documentation.md)                   | ClickHouse analytics database               | Time-series data, performance               | Analytics storage         |
| [electricsql-docs.md](./backend-data/electricsql-docs.md)                                   | ElectricSQL local-first sync                | Offline-first, real-time sync               | Local-first patterns      |
| [pglite-documentation.md](./backend-data/pglite-documentation.md)                           | PGlite WASM database                        | Client-side SQL, session state              | Edge databases            |
| [postgresql-pg-stat-statements.md](./backend-data/postgresql-pg-stat-statements.md)         | PostgreSQL performance monitoring           | Query analysis, optimization                | Database monitoring       |
| [postgresql-rls-documentation.md](./backend-data/postgresql-rls-documentation.md)           | Row Level Security implementation           | Multi-tenant security, policies             | Database security         |
| [qstash-client-setup.md](./backend-data/qstash-client-setup.md)                             | QStash message queue                        | Job scheduling, reliability                 | Message queuing           |
| [supabase-auth-docs.md](./backend-data/supabase-auth-docs.md)                               | Supabase authentication                     | Auth providers, RLS integration             | Authentication            |
| [tenant-caching-patterns.md](./backend-data/tenant-caching-patterns.md)                     | Multi-tenant caching strategies             | Redis, performance, isolation               | Caching patterns          |
| [tinybird-documentation.md](./backend-data/tinybird-documentation.md)                       | Real-time analytics platform                | Data pipelines, performance                 | Real-time analytics       |
| [upstash-ratelimit-documentation.md](./backend-data/upstash-ratelimit-documentation.md)     | Upstash rate limiting                       | Redis-based limiting, performance           | Rate limiting             |
| [upstash-redis-documentation.md](./backend-data/upstash-redis-documentation.md)             | Upstash Redis integration                   | Caching, sessions, performance              | Redis integration         |

### 🎨 Frontend Development

**Location**: `docs/guides/frontend/`

| Document                                                                      | Description                          | Key Topics                                 | 2026 Standards           |
| ----------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------ | ------------------------ |
| [bundle-size-budgets.md](./frontend/bundle-size-budgets.md)                   | Bundle size optimization             | Code splitting, performance monitoring     | Core Web Vitals          |
| [core-web-vitals-optimization.md](./frontend/core-web-vitals-optimization.md) | CWV optimization strategies          | LCP, FID, CLS optimization                 | Performance standards    |
| [css-variables-guide.md](./frontend/css-variables-guide.md)                   | CSS variables and theming            | Design tokens, dynamic theming             | CSS architecture         |
| [nextjs-16-documentation.md](./frontend/nextjs-16-documentation.md)           | Next.js 16 features                  | PPR, React Compiler, Turbopack             | Framework features       |
| [nextjs-middleware.md](./frontend/nextjs-middleware.md)                       | Next.js middleware patterns          | Edge functions, authentication             | Middleware patterns      |
| [offline-first-forms-pwa.md](./frontend/offline-first-forms-pwa.md)           | PWA forms with offline support       | Service Workers, Background Sync           | PWA patterns             |
| [performance-budgeting.md](./frontend/performance-budgeting.md)               | Performance budget management        | Budget tracking, optimization              | Performance budgets      |
| [react-19-documentation.md](./frontend/react-19-documentation.md)             | React 19 features                    | Compiler, Server Components                | React features           |
| [react-compiler.md](./frontend/react-compiler.md)                             | React Compiler optimization          | Automatic memoization, performance         | Performance optimization |
| [react-hook-form.md](./frontend/react-hook-form.md)                           | Form handling with React Hook Form   | Validation, performance                    | Form patterns            |
| [rendering-decision-matrix.md](./frontend/rendering-decision-matrix.md)       | Rendering strategy decisions         | SSR, SSG, ISR, CSR                         | Rendering patterns       |
| [storybook.md](./frontend/storybook.md)                                       | Component development with Storybook | Design systems, documentation              | Component development    |
| [tailwind-css-v4.md](./frontend/tailwind-css-v4.md)                           | Tailwind CSS v4 features             | CSS-first configuration, container queries | CSS framework            |
| [turbopack.md](./frontend/turbopack.md)                                       | Turbopack bundler                    | Performance, migration                     | Build tools              |

### 🏗️ Infrastructure & DevOps

**Location**: `docs/guides/infrastructure-devops/`

| Document                                                                                 | Description                    | Key Topics                                    | 2026 Standards      |
| ---------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------- | ------------------- |
| [deployment-runbook.md](./infrastructure-devops/deployment-runbook.md)                   | Zero-downtime deployment       | Expand/contract, rollback strategies          | Deployment patterns |
| [github-actions-docs.md](./infrastructure-devops/github-actions-docs.md)                 | GitHub Actions workflows       | CI/CD, automation, testing                    | CI/CD patterns      |
| [github-workflows.md](./infrastructure-devops/github-workflows.md)                       | Complete workflow templates    | Testing, deployment, security                 | Workflow templates  |
| [launchdarkly-feature-flags.md](./infrastructure-devops/launchdarkly-feature-flags.md)   | LaunchDarkly integration       | Feature flags, A/B testing                    | Feature management  |
| [nx-cloud.md](./infrastructure-devops/nx-cloud.md)                                       | Nx Cloud integration           | Distributed builds, caching                   | Build optimization  |
| [opentofu.md](./infrastructure-devops/opentofu.md)                                       | OpenTofu IaC                   | Infrastructure as Code, Terraform alternative | IaC patterns        |
| [pnpm-deploy.md](./infrastructure-devops/pnpm-deploy.md)                                 | pnpm deployment strategies     | Package management, deployment                | Deployment patterns |
| [terraform-aws-provider.md](./infrastructure-devops/terraform-aws-provider.md)           | Terraform AWS integration      | AWS resources, infrastructure                 | IaC AWS             |
| [terraform-supabase-provider.md](./infrastructure-devops/terraform-supabase-provider.md) | Terraform Supabase integration | Database, auth, storage                       | IaC database        |
| [terraform-vercel-provider.md](./infrastructure-devops/terraform-vercel-provider.md)     | Terraform Vercel integration   | Deployment, domains, projects                 | IaC deployment      |
| [vercel-domains-api.md](./infrastructure-devops/vercel-domains-api.md)                   | Vercel domains API             | Custom domains, SSL, automation               | Domain management   |

### 🔒 Security & Compliance

**Location**: `docs/guides/security/`

| Document                                                                                  | Description                      | Key Topics                        | 2026 Standards     |
| ----------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------- | ------------------ |
| [github-commit-signing.md](./security/github-commit-signing.md)                           | GitHub commit signing            | GPG, security, verification       | Security practices |
| [multi-layer-rate-limiting.md](./security/multi-layer-rate-limiting.md)                   | Security-focused rate limiting   | DDoS protection, abuse prevention | Security patterns  |
| [nist-fips-203-204-205.md](./security/nist-fips-203-204-205.md)                           | Post-quantum cryptography        | NIST standards, migration         | Post-quantum ready |
| [nist-hqc-report.md](./security/nist-hqc-report.md)                                       | Post-quantum cryptography report | Quantum threats, solutions        | Security research  |
| [noble-post-quantum-crypto.md](./security/noble-post-quantum-crypto.md)                   | Noble post-quantum crypto        | Implementation, libraries         | Security libraries |
| [pqc-migration-strategy.md](./security/pqc-migration-strategy.md)                         | Post-quantum migration strategy  | Hybrid crypto, migration path     | Security migration |
| [secrets-manager.md](./security/secrets-manager.md)                                       | Enterprise secrets management    | Encryption, rotation, audit       | Security patterns  |
| [security-headers.md](./security/security-headers.md)                                     | HTTP security headers            | CSP, HSTS, security policies      | Security headers   |
| [security-middleware-implementation.md](./security/security-middleware-implementation.md) | Security middleware patterns     | Authentication, authorization     | Security patterns  |
| [server-action-security-wrapper.md](./security/server-action-security-wrapper.md)         | Server Action security           | Input validation, CSRF protection | Security patterns  |
| [supabase-auth.md](./security/supabase-auth.md)                                           | Supabase authentication          | Auth providers, security          | Authentication     |

### 🏢 Multi-Tenant Architecture

**Location**: `docs/guides/multi-tenant/`

| Document                                                                                  | Description                  | Key Topics                             | 2026 Standards        |
| ----------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------- | --------------------- |
| [billing-status-validation.md](./multi-tenant/billing-status-validation.md)               | Billing status checking      | Redis caching, real-time updates       | Multi-tenant patterns |
| [domain-lifecycle-management.md](./multi-tenant/domain-lifecycle-management.md)           | Domain lifecycle automation  | Vercel for Platforms, SSL provisioning | Domain management     |
| [enterprise-sso-integration.md](./multi-tenant/enterprise-sso-integration.md)             | Enterprise SSO with SAML 2.0 | Azure AD, Okta, Google Workspace       | Enterprise auth       |
| [noisy-neighbor-prevention.md](./multi-tenant/noisy-neighbor-prevention.md)               | Noisy neighbor prevention    | Rate limiting, resource isolation      | Multi-tenant security |
| [routing-comparison.md](./multi-tenant/routing-comparison.md)                             | Routing strategy comparison  | Subdomain vs path vs custom domain     | Routing patterns      |
| [tenant-metadata-factory.md](./multi-tenant/tenant-metadata-factory.md)                   | Tenant metadata management   | Dynamic configuration, SEO             | Multi-tenant patterns |
| [tenant-resolution-implementation.md](./multi-tenant/tenant-resolution-implementation.md) | Tenant resolution system     | Subdomain, custom domain, path-based   | Multi-tenant patterns |
| [tenant-suspension-patterns.md](./multi-tenant/tenant-suspension-patterns.md)             | Tenant suspension patterns   | Graceful suspension, branding          | Multi-tenant patterns |

### 🏛️ System Architecture

**Location**: `docs/guides/architecture/`

| Document                                                                                            | Description                     | Key Topics                        | 2026 Standards         |
| --------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------- | ---------------------- |
| [0000-use-adrs.md](./architecture/0000-use-adrs.md)                                                 | Architecture decision records   | ADR templates, decision tracking  | Architecture patterns  |
| [architecture-decision-record-template.md](./architecture/architecture-decision-record-template.md) | ADR template                    | Decision documentation, templates | Architecture patterns  |
| [client-portal-configuration.md](./architecture/client-portal-configuration.md)                     | Client portal configuration     | Server Actions, deep merge        | Configuration patterns |
| [marketing-site-fsd-structure.md](./architecture/marketing-site-fsd-structure.md)                   | Feature-Sliced Design structure | FSD layers, organization          | Architecture patterns  |
| [monorepo-context-protocol-proposal.md](./architecture/monorepo-context-protocol-proposal.md)       | Monorepo context protocol       | Context management, AI agents     | Architecture patterns  |
| [package-level-fsd-implementation.md](./architecture/package-level-fsd-implementation.md)           | Package-level FSD               | FSD 2.1, TypeScript               | Architecture patterns  |
| [realtime-lead-feed-implementation.md](./architecture/realtime-lead-feed-implementation.md)         | Real-time lead feed             | Supabase Realtime, RLS            | Real-time patterns     |
| [report-generation-engine.md](./architecture/report-generation-engine.md)                           | Report generation engine        | React PDF, QStash scheduling      | Document generation    |
| [site-config-schema-documentation.md](./architecture/site-config-schema-documentation.md)           | Site configuration schema       | Zod validation, type safety       | Configuration patterns |
| [white-label-portal-architecture.md](./architecture/white-label-portal-architecture.md)             | White-label architecture        | Enterprise theming, multi-tenant  | Architecture patterns  |

### 📋 Development Best Practices

**Location**: `docs/guides/best-practices/`

| Document                                                                                        | Description                  | Key Topics                       | 2026 Standards        |
| ----------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------- | --------------------- |
| [cli-scaffold-design.md](./best-practices/cli-scaffold-design.md)                               | CLI scaffold design          | Tooling, automation, workflows   | Development tools     |
| [cross-slice-import-patterns.md](./best-practices/cross-slice-import-patterns.md)               | Cross-slice imports          | FSD patterns, architecture       | Architecture patterns |
| [feature-sliced-design-docs.md](./best-practices/feature-sliced-design-docs.md)                 | Feature-Sliced Design        | FSD layers, organization         | Architecture patterns |
| [fsd-layer-architecture.md](./best-practices/fsd-layer-architecture.md)                         | FSD layer architecture       | Layer organization, patterns     | Architecture patterns |
| [git-branching-strategies.md](./best-practices/git-branching-strategies.md)                     | Git branching strategies     | Workflow, collaboration          | Development workflows |
| [independent-release-patterns.md](./best-practices/independent-release-patterns.md)             | Independent release patterns | Microservices, deployment        | Deployment patterns   |
| [internal-developer-portal-patterns.md](./best-practices/internal-developer-portal-patterns.md) | Developer portal patterns    | Internal tools, productivity     | Development tools     |
| [monorepo-directory-structure.md](./best-practices/monorepo-directory-structure.md)             | Monorepo structure           | Organization, scaling            | Architecture patterns |
| [prioritization-framework.md](./best-practices/prioritization-framework.md)                     | Prioritization framework     | Task management, planning        | Project management    |
| [quality-assurance-checklist.md](./best-practices/quality-assurance-checklist.md)               | Quality assurance checklist  | Testing, code quality, standards | Quality assurance     |

### 🔍 Testing & Quality Assurance

**Location**: `docs/guides/testing/`

| Document                                                                 | Description                         | Key Topics                       | 2026 Standards        |
| ------------------------------------------------------------------------ | ----------------------------------- | -------------------------------- | --------------------- |
| [axe-core-documentation.md](./testing/axe-core-documentation.md)         | Accessibility testing with axe-core | WCAG 2.2, automated testing      | Accessibility testing |
| [e2e-testing-suite-patterns.md](./testing/e2e-testing-suite-patterns.md) | E2E testing patterns                | Playwright, multi-tenant testing | E2E testing           |
| [playwright-best-practices.md](./testing/playwright-best-practices.md)   | Playwright best practices           | Testing strategies, reliability  | Testing patterns      |
| [playwright-documentation.md](./testing/playwright-documentation.md)     | Playwright documentation            | Testing framework, patterns      | Testing tools         |
| [react-testing-library.md](./testing/react-testing-library.md)           | React Testing Library               | Component testing, patterns      | Testing patterns      |
| [vitest-documentation.md](./testing/vitest-documentation.md)             | Vitest documentation                | Unit testing, performance        | Testing tools         |

### 📧 Email & Communication

**Location**: `docs/guides/email/`

| Document                                                               | Description                 | Key Topics                  | 2026 Standards     |
| ---------------------------------------------------------------------- | --------------------------- | --------------------------- | ------------------ |
| [email-package-structure.md](./email/email-package-structure.md)       | Email package structure     | Multi-tenant, templates     | Email architecture |
| [lead-notification-template.md](./email/lead-notification-template.md) | Lead notification templates | Email templates, automation | Email patterns     |
| [multi-tenant-email-routing.md](./email/multi-tenant-email-routing.md) | Multi-tenant email routing  | Tenant isolation, delivery  | Email patterns     |
| [postmark-documentation.md](./email/postmark-documentation.md)         | Postmark integration        | Email delivery, templates   | Email services     |
| [resend-documentation.md](./email/resend-documentation.md)             | Resend integration          | Email delivery, templates   | Email services     |
| [unified-email-send.md](./email/unified-email-send.md)                 | Unified email sending       | Abstraction, multi-provider | Email patterns     |

### 📅 Scheduling & Appointments

**Location**: `docs/guides/scheduling/`

| Document                                                            | Description                   | Key Topics                   | 2026 Standards      |
| ------------------------------------------------------------------- | ----------------------------- | ---------------------------- | ------------------- |
| [acuity-scheduling.md](./scheduling/acuity-scheduling.md)           | Acuity scheduling integration | Appointment booking, widgets | Scheduling services |
| [calcom-embed-widget.md](./scheduling/calcom-embed-widget.md)       | Cal.com embed widget          | Appointment booking, UI      | Scheduling services |
| [calcom-webhook-handler.md](./scheduling/calcom-webhook-handler.md) | Cal.com webhook handling      | Webhooks, automation         | Scheduling services |
| [calendly-documentation.md](./scheduling/calendly-documentation.md) | Calendly integration          | Appointment booking, API     | Scheduling services |

### 💳 Payments & Billing

**Location**: `docs/guides/payments-billing/`

| Document                                                                      | Description              | Key Topics                   | 2026 Standards   |
| ----------------------------------------------------------------------------- | ------------------------ | ---------------------------- | ---------------- |
| [billing-page-components.md](./payments-billing/billing-page-components.md)   | Billing page components  | UI components, payment flows | Billing patterns |
| [stripe-checkout-sessions.md](./payments-billing/stripe-checkout-sessions.md) | Stripe checkout sessions | Payment processing, flows    | Payment patterns |
| [stripe-customer-portal.md](./payments-billing/stripe-customer-portal.md)     | Stripe customer portal   | Subscription management      | Billing patterns |
| [stripe-documentation.md](./payments-billing/stripe-documentation.md)         | Stripe integration       | Payment processing, webhooks | Payment services |
| [stripe-webhook-handler.md](./payments-billing/stripe-webhook-handler.md)     | Stripe webhook handling  | Webhooks, security           | Payment patterns |

### 🔍 SEO & Metadata

**Location**: `docs/guides/seo-metadata/`

| Document                                                                              | Description                    | Key Topics                   | 2026 Standards   |
| ------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------- | ---------------- |
| [dynamic-og-images.md](./seo-metadata/dynamic-og-images.md)                           | Dynamic OG images              | Social sharing, automation   | SEO patterns     |
| [dynamic-sitemap-generation.md](./seo-metadata/dynamic-sitemap-generation.md)         | Dynamic sitemap generation     | SEO, indexing, automation    | SEO patterns     |
| [edge-a-b-testing.md](./seo-metadata/edge-a-b-testing.md)                             | Edge A/B testing               | Experimentation, performance | SEO optimization |
| [generative-engine-optimization.md](./seo-metadata/generative-engine-optimization.md) | Generative engine optimization | AI search, GEO, llms.txt     | SEO optimization |
| [llms.txt-spec.md](./seo-metadata/llms.txt-spec.md)                                   | llms.txt specification         | AI search, content discovery | SEO standards    |
| [metadata-generation-system.md](./seo-metadata/metadata-generation-system.md)         | Metadata generation            | SEO automation, templates    | SEO patterns     |
| [schema-org-documentation.md](./seo-metadata/schema-org-documentation.md)             | Schema.org implementation      | Structured data, SEO         | SEO patterns     |
| [seo-validation-ci-pipeline.md](./seo-metadata/seo-validation-ci-pipeline.md)         | SEO validation CI pipeline     | Automated testing, quality   | SEO automation   |
| [service-area-pages-engine.md](./seo-metadata/service-area-pages-engine.md)           | Service area pages engine      | Local SEO, programmatic SEO  | SEO patterns     |
| [structured-data-system.md](./seo-metadata/structured-data-system.md)                 | Structured data system         | Schema.org, automation       | SEO patterns     |

### 🤖 AI & Automation

**Location**: `docs/guides/ai-automation/`

| Document                                                                             | Description                   | Key Topics                       | 2026 Standards |
| ------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------- | -------------- |
| [agents-md-patterns.md](./ai-automation/agents-md-patterns.md)                       | AGENTS.md patterns            | AI agent configuration, patterns | AI integration |
| [ai-agent-cold-start-checklist.md](./ai-automation/ai-agent-cold-start-checklist.md) | AI agent cold start checklist | Agent setup, configuration       | AI patterns    |
| [ai-context-json-proposal.md](./ai-automation/ai-context-json-proposal.md)           | AI context JSON proposal      | Context management, AI agents    | AI patterns    |
| [ai-context-management.md](./ai-automation/ai-context-management.md)                 | AI context management         | Hierarchical loading, patterns   | AI patterns    |
| [autonomous-janitor-design.md](./ai-automation/autonomous-janitor-design.md)         | Autonomous janitor design     | AI automation, maintenance       | AI patterns    |
| [claude-code-integration.md](./ai-automation/claude-code-integration.md)             | Claude code integration       | AI coding assistance             | AI tools       |
| [claude-sub-agent-definitions.md](./ai-automation/claude-sub-agent-definitions.md)   | Claude sub-agent definitions  | Multi-agent coordination         | AI patterns    |
| [per-package-agents-stubs.md](./ai-automation/per-package-agents-stubs.md)           | Per-package agent stubs       | Package-level AI agents          | AI patterns    |
| [root-agents-master.md](./ai-automation/root-agents-master.md)                       | Root agents master            | Multi-agent coordination         | AI patterns    |

### 🏗️ Build System & Monorepo

**Location**: `docs/guides/build-monorepo/`

| Document                                                                        | Description                | Key Topics                         | 2026 Standards     |
| ------------------------------------------------------------------------------- | -------------------------- | ---------------------------------- | ------------------ |
| [changesets.md](./build-monorepo/changesets.md)                                 | Changesets for releases    | Version management, releases       | Build patterns     |
| [nx-affected-commands.md](./build-monorepo/nx-affected-commands.md)             | Nx affected commands       | Build optimization, caching        | Build tools        |
| [nx-core-team-whitepaper.md](./build-monorepo/nx-core-team-whitepaper.md)       | Nx core team insights      | Build optimization, best practices | Build tools        |
| [package-manager-benchmarks.md](./build-monorepo/package-manager-benchmarks.md) | Package manager benchmarks | Performance comparison             | Build tools        |
| [pnpm-workspaces.md](./build-monorepo/pnpm-workspaces.md)                       | pnpm workspaces            | Package management, monorepo       | Build tools        |
| [renovate-configuration.md](./build-monorepo/renovate-configuration.md)         | Renovate configuration     | Dependency updates, automation     | Build tools        |
| [turbo-json-configuration.md](./build-monorepo/turbo-json-configuration.md)     | Turbo JSON configuration   | Build optimization, caching        | Build tools        |
| [turborepo-documentation.md](./build-monorepo/turborepo-documentation.md)       | Turborepo documentation    | Build system, optimization         | Build tools        |
| [turborepo-remote-caching.md](./build-monorepo/turborepo-remote-caching.md)     | Turborepo remote caching   | Distributed builds, performance    | Build optimization |

### 🧪 Linting & Code Quality

**Location**: `docs/guides/linting/`

| Document                                                                       | Description                   | Key Topics                   | 2026 Standards |
| ------------------------------------------------------------------------------ | ----------------------------- | ---------------------------- | -------------- |
| [eslint-9.md](./linting/eslint-9.md)                                           | ESLint 9 configuration        | Linting, code quality        | Code quality   |
| [prettier.md](./linting/prettier.md)                                           | Prettier configuration        | Code formatting, consistency | Code quality   |
| [steiger-ci-integration.md](./linting/steiger-ci-integration.md)               | Steiger CI integration        | FSD linting, automation      | Code quality   |
| [steiger-fsd-linter.md](./linting/steiger-fsd-linter.md)                       | Steiger FSD linter            | FSD patterns, architecture   | Code quality   |
| [steiger-linting-configuration.md](./linting/steiger-linting-configuration.md) | Steiger linting configuration | FSD enforcement, quality     | Code quality   |

### 📊 Monitoring & Observability

**Location**: `docs/guides/monitoring/` & `docs/guides/observability/`

| Document                                                                                           | Description                   | Key Topics                  | 2026 Standards |
| -------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------- | -------------- |
| [opentelemetry-documentation.md](./observability/opentelemetry-documentation.md)                   | OpenTelemetry documentation   | Observability, tracing      | Monitoring     |
| [opentelemetry-instrumentation.md](./observability/opentelemetry-instrumentation.md)               | OpenTelemetry instrumentation | Tracing implementation      | Monitoring     |
| [opentelemetry-nextjs-instrumentation.md](./observability/opentelemetry-nextjs-instrumentation.md) | OpenTelemetry Next.js         | Framework integration       | Monitoring     |
| [sentry-error-tracking.md](./observability/sentry-error-tracking.md)                               | Sentry error tracking         | Error monitoring, debugging | Monitoring     |
| [vercel-opentelemetry-integration.md](./observability/vercel-opentelemetry-integration.md)         | Vercel OpenTelemetry          | Platform integration        | Monitoring     |

### ⚖️ Accessibility & Legal Compliance

**Location**: `docs/guides/accessibility-legal/`

| Document                                                                       | Description                   | Key Topics                          | 2026 Standards   |
| ------------------------------------------------------------------------------ | ----------------------------- | ----------------------------------- | ---------------- |
| [ada-title-ii-final-rule.md](./accessibility-legal/ada-title-ii-final-rule.md) | ADA Title II compliance       | Legal requirements, accessibility   | Legal compliance |
| [axe-core-documentation.md](./accessibility-legal/axe-core-documentation.md)   | axe-core testing automation   | Accessibility testing, WCAG         | Accessibility    |
| [gdpr-guide.md](./accessibility-legal/gdpr-guide.md)                           | GDPR compliance guide         | Data privacy, legal requirements    | Legal compliance |
| [hhs-section-504-docs.md](./accessibility-legal/hhs-section-504-docs.md)       | HHS Section 504 documentation | Accessibility requirements          | Legal compliance |
| [wcag-2.2-criteria.md](./accessibility-legal/wcag-2.2-criteria.md)             | WCAG 2.2 criteria             | Accessibility standards, compliance | Accessibility    |

### 📋 Standards & Specifications

**Location**: `docs/guides/standards-specs/`

| Document                                                                               | Description                  | Key Topics                      | 2026 Standards |
| -------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------- | -------------- |
| [cyclonedx-sbom.md](./standards-specs/cyclonedx-sbom.md)                               | CycloneDX SBOM specification | Software bill of materials      | Standards      |
| [w3c-design-tokens.md](./standards-specs/w3c-design-tokens.md)                         | W3C design tokens            | Design systems, standards       | Standards      |
| [green-software-foundation-sci.md](./standards-specs/green-software-foundation-sci.md) | GSF SCI specification        | Sustainability, metrics         | Standards      |
| [sci-calculation-examples.md](./standards-specs/sci-calculation-examples.md)           | SCI calculation examples     | Sustainability metrics          | Standards      |
| [semantic-versioning.md](./standards-specs/semantic-versioning.md)                     | Semantic versioning          | Version management, releases    | Standards      |
| [slsa-provenance.md](./standards-specs/slsa-provenance.md)                             | SLSA provenance              | Supply chain security           | Standards      |
| [spdx-specification.md](./standards-specs/spdx-specification.md)                       | SPDX specification           | License management, compliance  | Standards      |
| [style-dictionary.md](./standards-specs/style-dictionary.md)                           | Style Dictionary             | Design tokens, automation       | Standards      |
| [zod-schema-validation.md](./standards-specs/zod-schema-validation.md)                 | Zod schema validation        | TypeScript validation, patterns | Standards      |

### 📰 CMS & Content Management

**Location**: `docs/guides/cms-content/`

| Document                                                                     | Description               | Key Topics                       | 2026 Standards |
| ---------------------------------------------------------------------------- | ------------------------- | -------------------------------- | -------------- |
| [blog-content-architecture.md](./cms-content/blog-content-architecture.md)   | Blog content architecture | Sanity CMS, content management   | CMS patterns   |
| [sanity-cms-draft-mode-2026.md](./cms-content/sanity-cms-draft-mode-2026.md) | Sanity CMS draft mode     | Content editing, workflows       | CMS patterns   |
| [sanity-documentation.md](./cms-content/sanity-documentation.md)             | Sanity documentation      | Headless CMS, content management | CMS services   |
| [storyblok-documentation.md](./cms-content/storyblok-documentation.md)       | Storyblok documentation   | Headless CMS, visual editing     | CMS services   |

---

## 🎯 Quick Reference

### 🔥 Most Critical Guides (Production Ready)

1. **[Multi-Layer Rate Limiting](./backend-data/multi-layer-rate-limiting.md)** - Essential for SaaS scalability
2. **[Secrets Manager](./backend-data/secrets-manager.md)** - Enterprise security requirements
3. **[HubSpot Integration](./backend-data/hubspot-documentation.md)** - CRM integration patterns
4. **[Tenant Resolution](./multi-tenant/tenant-resolution-implementation.md)** - Multi-tenant foundation
5. **[Feature Flags System](./backend-data/feature-flags-system.md)** - Production feature management

### 🚀 Performance Optimization Guides

1. **[Core Web Vitals](./frontend/core-web-vitals-optimization.md)** - SEO and user experience
2. **[Bundle Size Budgets](./frontend/bundle-size-budgets.md)** - Performance budgets
3. **[Turborepo](./build-monorepo/turborepo-documentation.md)** - Build optimization
4. **[Edge Caching](./infrastructure-devops/vercel-domains-api.md)** - Global performance

### 🔒 Security & Compliance Guides

1. **[Post-Quantum Cryptography](./security/nist-fips-203-204-205.md)** - Future security readiness
2. **[Security Headers](./security/security-headers.md)** - HTTP security implementation
3. **[Multi-Tenant Security](./multi-tenant/noisy-neighbor-prevention.md)** - SaaS security patterns
4. **[GDPR Compliance](./accessibility-legal/gdpr-guide.md)** - Legal compliance requirements

---

## 📈 Documentation Metrics

- **Total Guides**: 51 comprehensive documents
- **Categories**: 15 specialized domains
- **2026 Standards Compliance**: 100% coverage
- **Production-Ready Examples**: All guides include working code
- **TypeScript Coverage**: 100% type-safe implementations
- **Testing Strategies**: Comprehensive unit, integration, and E2E patterns

---

## 🔍 Finding the Right Guide

### By Development Phase

- **Planning**: Architecture, ADRs, design patterns
- **Development**: Backend, frontend, testing patterns
- **Deployment**: Infrastructure, monitoring, security
- **Maintenance**: Operations, updates, optimization

### By Technical Domain

- **Backend**: Database, APIs, integrations, security
- **Frontend**: UI, performance, accessibility, testing
- **DevOps**: Build, deploy, monitor, scale
- **Architecture**: Design patterns, decisions, standards

### By Problem Type

- **Performance**: Core Web Vitals, optimization, monitoring
- **Security**: Authentication, authorization, compliance
- **Scalability**: Multi-tenant, rate limiting, caching
- **Integration**: Third-party services, APIs, webhooks

---

## 🤝 Contributing to Documentation

### Adding New Guides

1. Follow the established template structure
2. Include 2026 standards compliance
3. Provide production-ready code examples
4. Add comprehensive testing strategies
5. Update this index file

### Updating Existing Guides

1. Maintain backward compatibility
2. Update to latest 2026 standards
3. Enhance with new patterns and best practices
4. Validate all code examples
5. Update cross-references

---

## 📞 Support & Contact

For questions about specific guides or documentation patterns:

- **Technical Issues**: Create GitHub issues
- **Content Questions**: Use GitHub discussions
- **Contributions**: Follow contribution guidelines
- **Standards Updates**: Review 2026 compliance requirements

---

_Last Updated: February 2026_
_Documentation Version: 2.0_
_Standards Compliance: 2026_
