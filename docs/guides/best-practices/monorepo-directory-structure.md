# Monorepo Directory Structure

> **Reference Documentation — February 2026**

## Overview

This document defines the canonical directory structure for the multi-tenant SaaS platform monorepo, optimized for Turborepo, pnpm workspaces, Feature-Sliced Design, and Next.js App Router. [makerkit](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)

---

## Complete Directory Tree

```
repo-root/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Main CI pipeline (typecheck, test, build)
│   │   ├── lighthouse.yml            # Performance gate
│   │   ├── bundle-size.yml           # Bundle size enforcement
│   │   ├── e2e.yml                   # Playwright E2E suite
│   │   ├── renovate.yml              # Automated dependency updates
│   │   └── release.yml               # Changesets publish workflow
│   ├── CODEOWNERS                    # Package ownership map
│   └── pull_request_template.md
│
├── apps/
│   ├── marketing/                    # Tenant marketing sites (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── [domain]/         # Per-tenant wildcard routing
│   │   │   │   ├── api/              # API routes
│   │   │   │   ├── layout.tsx        # Root layout
│   │   │   │   └── middleware.ts     # Tenant resolution (Edge)
│   │   │   ├── widgets/             # FSD: Widgets layer
│   │   │   ├── features/            # FSD: Features layer
│   │   │   ├── entities/            # FSD: Entities layer
│   │   │   └── shared/              # FSD: Shared layer
│   │   ├── public/
│   │   │   └── sw.js                # Service Worker (built by Serwist)
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── AGENTS.md                # AI agent context for this app
│   │
│   ├── portal/                      # Client dashboard (Next.js 16)
│   │   └── ...                      # Same structure as marketing
│   │
│   ├── super-admin/                 # Agency super admin panel (Next.js 16)
│   │   └── ...
│   │
│   └── docs/                        # Internal documentation site (optional)
│
├── packages/
│   ├── ui/                          # Shared component library
│   │   ├── src/
│   │   │   ├── components/          # Radix UI + shadcn/ui primitives
│   │   │   ├── hooks/               # Shared React hooks
│   │   │   └── index.ts             # Barrel export
│   │   ├── package.json
│   │   └── AGENTS.md
│   │
│   ├── db/                          # Database client + schema types
│   │   ├── src/
│   │   │   ├── client.ts            # Supabase client factory
│   │   │   ├── types.ts             # Generated Supabase types
│   │   │   └── queries/             # Reusable typed queries
│   │   └── package.json
│   │
│   ├── auth/                        # Authentication utilities (Clerk)
│   │   ├── src/
│   │   │   ├── middleware.ts        # Auth middleware helpers
│   │   │   ├── server-action-wrapper.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                      # Shared configuration types + validation
│   │   ├── src/
│   │   │   ├── types.ts             # SiteConfig type definition
│   │   │   ├── schema.ts            # Zod validation schema
│   │   │   └── next.config.ts       # Shared Next.js config factory
│   │   └── package.json
│   │
│   ├── multi-tenant/                # Tenant resolution + routing
│   │   ├── src/
│   │   │   ├── resolve-tenant.ts
│   │   │   ├── middleware-helpers.ts
│   │   │   └── domain-api.ts        # Vercel Domains API wrapper
│   │   └── package.json
│   │
│   ├── email/                       # Email templates + sending
│   │   ├── src/
│   │   │   ├── templates/           # React Email components
│   │   │   ├── send.ts              # Unified send function
│   │   │   └── routing.ts           # Resend/Postmark routing
│   │   └── package.json
│   │
│   ├── jobs/                        # Background job handlers
│   │   ├── src/
│   │   │   ├── handlers/            # QStash job handlers
│   │   │   ├── schedules/           # Cron schedule registration
│   │   │   └── verify.ts            # QStash signature verification
│   │   └── package.json
│   │
│   ├── billing/                     # Stripe integration
│   │   ├── src/
│   │   │   ├── stripe-client.ts
│   │   │   ├── webhook-handler.ts
│   │   │   └── checkout.ts
│   │   └── package.json
│   │
│   ├── analytics/                   # Tinybird + Vercel Analytics
│   │   ├── src/
│   │   │   ├── tinybird-client.ts
│   │   │   └── track-event.ts
│   │   └── package.json
│   │
│   ├── realtime/                    # Supabase Realtime hooks
│   │   ├── src/
│   │   │   ├── use-realtime-leads.ts
│   │   │   └── channels.ts
│   │   └── package.json
│   │
│   ├── seo/                         # SEO utilities: metadata, JSON-LD, sitemap
│   │   ├── src/
│   │   │   ├── metadata-factory.ts
│   │   │   ├── json-ld-builders.ts
│   │   │   └── sitemap-generator.ts
│   │   └── package.json
│   │
│   ├── settings/                    # Tenant settings server actions
│   │   ├── src/
│   │   │   ├── actions/
│   │   │   └── schema.ts
│   │   └── package.json
│   │
│   ├── content/                     # CMS clients (Sanity + Storyblok)
│   │   ├── src/
│   │   │   ├── sanity-client.ts
│   │   │   ├── groq/                # Typed GROQ queries
│   │   │   └── portable-text.ts
│   │   └── package.json
│   │
│   ├── security/                    # PQC, rate limiting, security headers
│   │   ├── src/
│   │   │   ├── pqc.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── csp.ts
│   │   └── package.json
│   │
│   └── observability/               # OpenTelemetry + Sentry
│       ├── src/
│       │   ├── instrumentation.ts
│       │   └── sentry-config.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/                  # SQL migration files (sequential)
│   │   ├── 0001_create_tenants.sql
│   │   ├── 0002_create_leads.sql
│   │   └── ...
│   ├── seed.sql                     # Test seed data
│   └── config.toml                  # Supabase local dev config
│
├── scripts/
│   ├── setup-env.sh                 # Fresh environment setup
│   ├── seed.ts                      # TypeScript seeder
│   └── generate-types.sh            # Supabase type generation
│
├── docs/
│   ├── adr/                         # Architecture Decision Records
│   │   ├── 0000-use-adrs.md
│   │   └── 0001-monorepo-tooling.md
│   └── runbooks/                    # Operational runbooks
│
├── .github/
├── .changeset/                      # Changesets for versioning
│   └── config.json
│
├── AGENTS.md                        # Root AI agent orchestration
├── CLAUDE.md                        # Claude-specific context
├── turbo.json                       # Turborepo pipeline config
├── pnpm-workspace.yaml              # pnpm workspace + catalog
├── package.json                     # Root package.json
├── .size-limit.ts                   # Bundle size budgets
├── .lighthouserc.ts                 # Lighthouse CI thresholds
├── renovate.json                    # Automated dependency updates
└── tsconfig.json                    # Root TypeScript config (base)
```

---

## Package Naming Convention

All internal packages are namespaced under `@repo/`:

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "version": "0.0.0", // Managed by Changesets
  "private": true,
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./hooks": "./src/hooks/index.ts"
  }
}
```

**Convention:** `@repo/<package-name>` — never use `@org/` or unscoped names for workspace packages.

---

## pnpm Workspace Catalog

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

catalog:
  # Pin all apps to identical versions via catalog: protocol
  react: ^19.0.0
  react-dom: ^19.0.0
  next: ^16.0.0
  typescript: ^5.7.0
  '@supabase/supabase-js': ^2.50.0
  'zod': ^3.24.0
  'tailwindcss': ^4.0.0
  'vitest': ^3.0.0
  '@playwright/test': ^1.50.0
```

---

## References

- next-forge (Vercel reference architecture) — https://github.com/vercel/next-forge
- Next.js 16 App Router Project Structure — https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure
- Monorepo Setup with Next.js and Turborepo — https://alexpate.com/posts/monorepo-setup
- pnpm Workspaces — https://pnpm.io/workspaces
- Turborepo Monorepo Guide — https://turbo.build/repo/docs

---
