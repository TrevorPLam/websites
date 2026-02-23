# 1.4 Complete Directory Structure

```
marketing-monorepo/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Main CI pipeline
│   │   ├── deploy.yml                # Staging → Production
│   │   ├── auto-rollback.yml         # Smoke test → rollback
│   │   ├── accessibility.yml         # WCAG 2.2 AA audit
│   │   ├── tokens-sync.yml           # Figma → Git sync
│   │   ├── rls-validation.yml        # Supabase RLS tests
│   │   └── security-scan.yml         # Dependency audit
│   ├── CODEOWNERS                    # Require review from AI agent or human
│   ├── dependabot.yml                # Automated dependency updates
│   ├── branch-protection.yml         # Branch protection rules
│   └── renovate.json                 # Dependency updates
│
├── apps/
│   ├── web/                          # Main marketing site platform
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── (marketing)/          # Marketing route group
│   │   │   │   ├── [domain]/         # Dynamic tenant routes
│   │   │   │   │   ├── page.tsx     # Home page (PPR)
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── contact/
│   │   │   │   │   └── blog/
│   │   │   │   └── layout.tsx
│   │   │   ├── api/                 # API routes
│   │   │   │   ├── leads/
│   │   │   │   │   └── route.ts     # Lead capture API
│   │   │   │   ├── webhooks/
│   │   │   │   │   └── stripe/
│   │   │   │   │       └── route.ts
│   │   │   │   └── trpc/
│   │   │   │       └── [trpc]/
│   │   │   │           └── route.ts
│   │   │   ├── robots.ts            # Per-tenant robots
│   │   │   ├── sitemap.ts           # Per-tenant sitemap
│   │   │   ├── layout.tsx
│   │   │   └── middleware.ts        # Tenant resolution + security
│   │   ├── instrumentation.ts       # OpenTelemetry setup
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   ├── turbo.json               # App-specific overrides
│   │   └── AGENTS.md                # 40 lines max
│   │
│   ├── admin/                        # Internal admin dashboard
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── tenants/             # Tenant management
│   │   │   ├── analytics/           # Cross-tenant metrics
│   │   │   ├── domains/
│   │   │   └── billing/             # Billing status
│   │   ├── src/
│   │   ├── package.json
│   │   ├── AGENTS.md
│   │   └── README.md
│   │
│   └── portal/                       # White-label client portal
│       ├── app/
│       │   ├── leads/               # Lead management
│       │   ├── analytics/           # Per-tenant CWV
│       │   ├── billing/              # Invoice history
│       │   ├── settings/
│       │   └── export/              # GDPR data export
│       ├── src/
│       ├── package.json
│       ├── AGENTS.md
│       └── README.md
│
├── sites/                            # Individual client site configs
│   # Client sites will be added here as needed
│   # Each site follows this structure:
│   # ├── {client-name}/
│   # │   ├── src/
│   # │   │   ├── app/                  # Next.js 16 App Router
│   # │   │   ├── components/
│   # │   │   └── lib/
│   # │   ├── site.config.ts           # Complete config (see Domain 2)
│   # │   ├── content/                 # Client-specific content (optional)
│   # │   ├── public/                  # Client assets (logo, images)
│   # │   ├── package.json
│   # │   ├── next.config.ts
│   # │   ├── tailwind.config.ts
│   # │   └── AGENTS.md
│
├── packages/
│   ├── config-schema/               # Zod schema for site.config.ts
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── schema.ts            # Complete schema (Domain 2)
│   │   │   ├── identity.ts
│   │   │   ├── theme.ts
│   │   │   ├── seo.ts
│   │   │   ├── integrations.ts
│   │   │   ├── compliance.ts
│   │   │   └── validation.ts
│   │   ├── package.json
│   │   └── AGENTS.md
│   │
│   ├── ui/                          # Design system components
│   │   ├── src/
│   │   │   ├── primitives/           # Radix UI wrappers
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   └── card/
│   │   │   ├── marketing/            # Marketing-specific components
│   │   │   │   ├── hero-section/
│   │   │   │   ├── cta-button/
│   │   │   │   └── testimonial-card/
│   │   │   ├── shared/               # FSD: shared layer
│   │   │   │   ├── ui/              # Button, Card, Input
│   │   │   │   └── lib/             # Utilities
│   │   │   ├── entities/             # FSD: entities layer
│   │   │   │   ├── lead/
│   │   │   │   └── tenant/
│   │   │   ├── features/            # FSD: features layer
│   │   │   │   ├── lead-form/
│   │   │   │   └── a-b-test/
│   │   │   └── widgets/             # FSD: widgets layer
│   │   │       ├── header/
│   │   │       └── footer/
│   │   ├── tokens.json              # Design tokens (Style Dictionary)
│   │   ├── tokens.css               # Generated CSS variables
│   │   ├── package.json
│   │   └── AGENTS.md
│   │
│   ├── auth/                        # Multi-tenant auth utilities
│   │   ├── src/
│   │   │   ├── server.ts            # Server-only auth utilities
│   │   │   ├── client.ts            # Client components
│   │   │   ├── middleware.ts         # Auth middleware helpers
│   │   │   └── rls-helpers.ts
│   │   └── AGENTS.md
│   │
│   ├── database/                    # Supabase client + types
│   │   ├── src/
│   │   │   ├── client.ts            # Supabase client factory
│   │   │   ├── types.ts             # Generated from DB schema
│   │   │   └── migrations/          # SQL migrations
│   │   │       ├── 001_initial.sql
│   │   │       ├── 002_add_rls.sql
│   │   │       └── 003_secret_functions.sql
│   │   ├── seed.ts
│   │   └── AGENTS.md
│   │
│   ├── seo/                         # SEO utilities
│   │   ├── src/
│   │   │   ├── metadata.ts          # generateMetadata helpers
│   │   │   ├── sitemap.ts           # Dynamic sitemap generation
│   │   │   ├── robots.ts            # Dynamic robots.txt
│   │   │   └── schema-org.ts        # JSON-LD schema generators
│   │   └── AGENTS.md
│   │
│   ├── analytics/                   # Multi-tenant analytics
│   │   ├── src/
│   │   │   ├── tinybird.ts          # Tinybird client
│   │   │   ├── cwv-collector.ts     # Core Web Vitals
│   │   │   ├── events.ts            # Event types
│   │   │   ├── sentry-config.ts
│   │   │   └── tracking.ts          # Client-side tracker
│   │   └── AGENTS.md
│   │
│   ├── cms-adapters/                # CMS abstraction layer
│   │   ├── src/
│   │   │   ├── types.ts              # ContentAdapter interface
│   │   │   ├── adapter.ts
│   │   │   ├── sanity.ts            # Sanity implementation
│   │   │   └── storyblok.ts         # Storyblok implementation
│   │   └── AGENTS.md
│   │
│   ├── email/                       # Transactional email
│   │   ├── src/
│   │   │   ├── postmark-client.ts   # Postmark client
│   │   │   └── templates/           # Email templates
│   │   └── AGENTS.md
│   │
│   ├── crypto-provider/             # Post-quantum crypto abstraction
│   │   ├── src/
│   │   │   ├── provider-interface.ts # CryptoProvider interface
│   │   │   ├── provider.ts          # Factory function
│   │   │   ├── rsa-provider.ts      # Current (RSA-2048/4096)
│   │   │   ├── hybrid-provider.ts   # Transition (RSA + ML-DSA)
│   │   │   └── pqc-provider.ts      # Future (FIPS 204 ML-DSA)
│   │   └── AGENTS.md
│   │
│   ├── server-actions/              # Reusable server action wrappers
│   │   ├── src/
│   │   │   ├── create-action.ts     # Security wrapper (Domain 4)
│   │   │   └── types.ts
│   │   └── AGENTS.md
│   │
│   ├── multi-tenant/                # Tenant resolution + suspension
│   │   ├── src/
│   │   │   ├── resolve-tenant.ts
│   │   │   ├── check-billing.ts
│   │   │   └── rate-limit.ts
│   │   └── AGENTS.md
│   │
│   ├── ab-testing/                  # Edge A/B testing
│   │   ├── src/
│   │   │   ├── middleware-ab.ts
│   │   │   └── variant-assignment.ts
│   │   └── AGENTS.md
│   │
│   ├── lead-capture/                # Lead scoring + routing
│   │   ├── src/
│   │   │   ├── capture-lead.ts
│   │   │   ├── score-lead.ts
│   │   │   └── route-lead.ts
│   │   └── AGENTS.md
│   │
│   ├── design-tokens/               # Style Dictionary tokens
│   │   ├── tokens/
│   │   │   ├── primitives.json
│   │   │   ├── semantic.json
│   │   │   └── component.json
│   │   ├── build.js
│   │   └── AGENTS.md
│   │
│   ├── testing-utils/               # Shared test utilities
│   │   ├── src/
│   │   │   ├── setup.ts
│   │   │   ├── fixtures.ts
│   │   │   └── tenant-context.ts     # setTenantContext() helper
│   │   └── AGENTS.md
│   │
│   ├── feature-flags/               # Feature flag management
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── AGENTS.md
│   │
│   └── org-assets/                  # Legal docs, branding
│       ├── legal/
│       │   ├── dpa-template.md      # Data Processing Agreement
│       │   ├── privacy-policy.md
│       │   ├── terms-of-service.md
│       │   └── subprocessors.json
│       ├── compliance/
│       │   ├── wcag-2.2-checklist.md
│       │   └── gdpr-dsar-process.md
│       ├── logos/
│       └── AGENTS.md
│
├── e2e/                             # End-to-end tests
│   ├── tests/
│   │   ├── multi-tenant/
│   │   │   ├── rls-isolation.spec.ts
│   │   │   └── tenant-context.ts
│   │   ├── accessibility/
│   │   │   ├── axe-core.spec.ts
│   │   │   ├── focus-visible.spec.ts
│   │   │   └── target-size.spec.ts
│   │   ├── wcag.spec.ts             # WCAG 2.2 AA automated tests
│   │   ├── visual-regression.spec.ts
│   │   ├── lead-capture.spec.ts
│   │   └── smoke.spec.ts            # Critical path tests
│   ├── playwright.config.ts
│   └── AGENTS.md
│
├── docs/                            # Documentation
│   ├── getting-started/
│   │   ├── 01-prerequisites.md
│   │   ├── 02-first-run.md
│   │   └── 03-first-client-site.md
│   ├── runbooks/
│   │   ├── onboard-client.md
│   │   ├── domain-setup.md
│   │   ├── rollback.md
│   │   ├── secret-rotation.md
│   │   └── offboard-client.md
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── data-flow.md
│   │   ├── tenant-resolution.md
│   │   └── fsd-layers.md
│   ├── adrs/                         # Architecture Decision Records
│   │   ├── ADR-001-monorepo-choice.md
│   │   ├── ADR-002-fsd-adoption.md
│   │   ├── ADR-003-supabase-vs-planetscale.md
│   │   ├── ADR-004-tailwind-v4-migration.md
│   │   ├── ADR-005-pqc-strategy.md
│   │   ├── ADR-006-cms-abstraction.md
│   │   └── ADR-007-vercel-lock-in-mitigation.md
│   └── AGENTS.md
│
├── infrastructure/
│   ├── terraform/                    # IaC (optional)
│   │   ├── vercel.tf
│   │   ├── supabase.tf
│   │   └── dns.tf
│   └── scripts/
│       ├── create-site.ts            # Golden Path CLI
│       ├── backup-db.sh
│       └── seed-demo-data.ts
│
├── .changeset/                      # Changesets for versioning
│   ├── config.json
│   └── README.md
│
├── .mcp/                            # Model Context Protocol
│   └── config.json
│
├── .npmrc                           # pnpm configuration
├── .env.example                     # Environment variable template
├── .gitignore
├── .prettierrc
├── .eslintrc.js                     # ESLint 9 flat config
├── .steiger/
│   └── config.json
├── pnpm-workspace.yaml              # See 1.2
├── turbo.jsonc                      # See 1.3
├── tsconfig.json                    # Base TypeScript config
├── renovate.json                    # See 1.5
├── package.json                     # Root package with scripts
├── AGENTS.md                        # Root context file (60 lines max)
├── CLAUDE.md                        # Claude Code specific context
└── README.md                        # Getting started
```

**Key Principles:**

- `apps/`: Consumer applications (public-facing, admin, portal)
- `sites/`: Configuration-only (no code), scales to 1000+
- `packages/`: Shared libraries following Feature-Sliced Design
- 15+ AGENTS.md files: Each package has context stub (40–60 lines)
- Single `.env.example`: All environment variables documented centrally

**File Counts by Role:**

- Client Sites: 1,000 × `site.config.ts` = 1,000 files
- Packages: 15 packages × avg 8 files = 120 files
- Apps: 3 apps × avg 30 files = 90 files
- E2E Tests: ~50 test files
- **Total:** ~1,260 source files for 1,000-client deployment

**When to Build:** P0 (Directory structure Day 1, packages incrementally P0–P2)
