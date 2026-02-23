<!--
/**
 * @file ADDTHESE.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for ADDTHESE.
 * @entrypoints docs/guides/ADDTHESE.md
 * @exports ADDTHESE
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

Given the enormous scope of this request (48 categories, 150+ new documents), I'll generate the first major batch of unchecked documents now, organized by section. This response covers **Sections 1, 2, 3, 6, and key sections of 25, 31, 35, and 45** — the highest-priority new items.

---

# renovate-configuration-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


> **Reference Documentation — February 2026**

## Overview

Renovate is an open-source automated dependency update bot that detects outdated dependencies across your repository, creates PRs to update them, and supports advanced monorepo configurations including `packageRules`, grouping, and per-package schedules. [docs.renovatebot](https://docs.renovatebot.com/configuration-options/)

## Installation

### Self-Hosted (GitHub Actions)

```yaml
# .github/workflows/renovate.yml
name: Renovate
on:
  schedule:
    - cron: '0 3 * * 1' # Every Monday at 3 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: renovatebot/github-action@v40
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: debug
```

### GitHub App (recommended for orgs)

Install the [Renovate GitHub App](https://github.com/apps/renovate) and add a `renovate.json` config to the root of your repository. [docs.renovatebot](https://docs.renovatebot.com)

---

## Base Configuration for pnpm Monorepos

```json
// renovate.json (repo root)
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":dependencyDashboard",
    ":semanticCommits",
    "group:monorepos",
    "group:recommended",
    "workarounds:all"
  ],

  // Limit PR creation rate — prevent overwhelming CI
  "prConcurrentLimit": 8,
  "prHourlyLimit": 2,
  "rebaseWhen": "conflicted",
  "schedule": ["before 6am on Monday"],

  // Auto-merge patch/minor for trusted packages
  "packageRules": [
    {
      "description": "Automerge patch updates for all packages",
      "matchUpdateTypes": ["patch", "pin", "digest"],
      "automerge": true,
      "automergeType": "pr",
      "platformAutomerge": true,
      "minimumReleaseAge": "3 days"
    },
    {
      "description": "Group all Next.js ecosystem updates",
      "matchPackageNames": ["next", "eslint-config-next", "@next/bundle-analyzer", "@next/font"],
      "groupName": "Next.js ecosystem",
      "automerge": false
    },
    {
      "description": "Group all Supabase packages",
      "matchPackagePatterns": ["^@supabase/"],
      "groupName": "Supabase",
      "automerge": false
    },
    {
      "description": "Group all Radix UI packages (safe to automerge patches)",
      "matchPackagePatterns": ["^@radix-ui/"],
      "groupName": "Radix UI",
      "automerge": true,
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Group all testing dependencies",
      "matchPackagePatterns": ["^@playwright/", "^vitest", "^@testing-library/"],
      "groupName": "Testing dependencies",
      "automerge": true
    },
    {
      "description": "Pin Node.js major version — manual upgrade only",
      "matchPackageNames": ["node"],
      "allowedVersions": "^22",
      "enabled": true
    },
    {
      "description": "Security updates — always open immediately",
      "matchCategories": ["security"],
      "automerge": false,
      "prPriority": 10,
      "labels": ["security", "dependencies"]
    },
    {
      "description": "Major version bumps — never automerge, assign reviewer",
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "assignees": ["@team-leads"],
      "reviewers": ["@team-leads"],
      "labels": ["major-update"]
    },
    {
      "description": "TypeScript and type definitions — automerge patches",
      "matchPackageNames": ["typescript"],
      "matchPackagePatterns": ["^@types/"],
      "groupName": "TypeScript and type definitions",
      "automerge": true,
      "matchUpdateTypes": ["patch", "minor"]
    }
  ]
}
```

---

## Monorepo-Specific Configuration

For large monorepos where different teams own different packages, use `additionalBranchPrefix` to create per-package PRs: [jvt](https://www.jvt.me/posts/2025/07/07/renovate-monorepo/)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],

  "packageRules": [
    {
      "description": "Split dependency updates by package directory",
      "matchFileNames": ["apps/**", "packages/**"],
      "additionalBranchPrefix": "{{packageFileDir}}/",
      "commitMessagePrefix": "{{packageFileDir}}:"
    },
    {
      "description": "apps/marketing — automerge UI patches",
      "matchPaths": ["apps/marketing/**"],
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "description": "apps/portal — conservative, no automerge",
      "matchPaths": ["apps/portal/**"],
      "automerge": false
    }
  ]
}
```

---

## Dependency Dashboard

The Dependency Dashboard is a GitHub Issue (automatically maintained by Renovate) that shows all pending updates in one place. Enable it with: [docs.mend](https://docs.mend.io/wsk/common-practices-for-renovate-configuration)

```json
{
  "dependencyDashboard": true,
  "dependencyDashboardTitle": "🔄 Dependency Updates Dashboard",
  "dependencyDashboardLabels": ["dependencies"]
}
```

---

## Security Vulnerability Auto-Patching

Renovate integrates with GitHub's dependency graph to detect and immediately open PRs for CVE-affected packages:

```json
{
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"],
    "automerge": true,
    "schedule": ["at any time"], // Override schedule for security patches
    "prPriority": 10
  },
  "osvVulnerabilityAlerts": true // Also check OSV database
}
```

---

## pnpm Catalog Support

Renovate supports the `catalog:` protocol introduced in pnpm 9. Ensure the `pnpm-workspace.yaml` is in `includePaths`:

```json
{
  "includePaths": ["pnpm-workspace.yaml", "package.json", "apps/**", "packages/**"]
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Renovate Official Documentation — https://docs.renovatebot.com
- Renovate Configuration Options — https://docs.renovatebot.com/configuration-options/
- Renovate Monorepo Presets — https://docs.renovatebot.com/presets-monorepo/
- Monorepo Optimization Tips — https://www.jvt.me/posts/2025/07/07/renovate-monorepo/
- Mend Common Practices — https://docs.mend.io/wsk/common-practices-for-renovate-configuration

---

# git-branching-strategies.md

> **Reference Documentation — February 2026**

## Overview

Modern high-velocity teams use **trunk-based development** (TBD) combined with **feature flags** as the primary branching strategy. Long-lived branches like `develop` and `release/*` introduce merge conflicts, delay integration, and break continuous delivery. [remoteenv](https://www.remoteenv.com/blog/feature-flag-branching-strategies-git-workflow)

---

## Branching Model Comparison

| Strategy                    | Integration Frequency | Merge Conflicts | CD Compatible | Feature Isolation |
| --------------------------- | --------------------- | --------------- | ------------- | ----------------- |
| GitFlow                     | Rare (per release)    | High            | ❌            | Via branches      |
| GitHub Flow                 | On PR merge           | Medium          | ⚠️            | Via branches      |
| **Trunk-Based Development** | Daily (or per commit) | Minimal         | ✅            | Via feature flags |

---

## Trunk-Based Development

**Core Rule:** All engineers commit to `main` at least once per day. Long-lived branches are prohibited. [launchdarkly](https://launchdarkly.com/blog/git-branching-strategies-vs-trunk-based-development/)

### Branch Naming Convention

```
main                    ← production; always deployable
feature/<ticket-id>-short-description   ← max 2 days lifespan
fix/<ticket-id>-short-description       ← max 1 day lifespan
chore/<description>                     ← dependency updates, config
```

### Branch Lifecycle Rules

```
feature/  → must merge to main within 48 hours
fix/      → must merge to main within 24 hours
No branch → survives a weekly cleanup (Autonomous Janitor job closes stale)
```

---

## Feature Flag Branching Pattern

Every feature ≥ 4 hours of work gets a feature flag **before** any code is written. The flag gates the feature at the UI/API level, allowing incomplete code to safely land in `main`. [configcat](https://configcat.com/trunk-based-development/)

```typescript
// Workflow:
// 1. Create flag in LaunchDarkly / Flagsmith BEFORE writing code
// 2. Write code behind the flag — commit to main daily
// 3. Flag starts at 0% rollout (off by default)
// 4. Enable for internal team → QA → gradual rollout → 100%
// 5. Remove flag + dead code within 1 sprint of full rollout

// Example:
const { enabled } = useFlag('new-booking-calendar-v2');

return enabled ? <BookingCalendarV2 /> : <BookingCalendarV1 />;
```

---

## GitHub Flow (Secondary Pattern)

Used when a project does not yet have feature flags infrastructure:

```
main ──────────────────────────────────────────► (production)
         ↑                    ↑
  PR merge (squash)      PR merge (squash)
         │                    │
feature/abc-123 ──────► feature/xyz-456
(reviewed, CI green)   (reviewed, CI green)
```

**Rules for GitHub Flow:**

- `main` is always deployable
- Feature branches are short-lived (< 3 days)
- All changes require a PR with ≥ 1 approval
- Squash merge (clean linear history)

---

## Branch Protection Rules

```yaml
# GitHub repository settings (Infrastructure as Code via Terraform)
branch_protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - 'TypeScript Check'
        - 'Tests'
        - 'Build Check'
        - 'Bundle Size Check'
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions:
      push: [] # Nobody force-pushes to main
    enforce_admins: true
    allow_force_pushes: false
    allow_deletions: false
    require_linear_history: true # Squash or rebase merges only
```

---

## Commit Convention (Conventional Commits)

```
type(scope): short description

Types: feat | fix | chore | docs | style | refactor | test | perf | ci | build | revert

Examples:
  feat(leads): add real-time lead scoring via QStash job
  fix(portal): correct CSS variable injection order to prevent FOUC
  chore(deps): update @supabase/supabase-js to v2.50.0
  perf(marketing): add priority prop to hero image for LCP improvement
  ci(lighthouse): lower LCP threshold to 2.2s
```

Enforced by `commitlint` + `husky`:

```json
// package.json (root)
{
  "commitlint": { "extends": ["@commitlint/config-conventional"] },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

---

## References

- Trunk-Based Development — https://trunkbaseddevelopment.com
- Feature Flags + TBD (LaunchDarkly) — https://launchdarkly.com/blog/git-branching-strategies-vs-trunk-based-development/
- TBD vs Git Branching (Statsig) — https://www.statsig.com/perspectives/trunk-based-development-vs-git-branching
- Feature Flag Branching Strategies — https://www.remoteenv.com/blog/feature-flag-branching-strategies-git-workflow
- ConfigCat TBD Guide — https://configcat.com/trunk-based-development/

---

# monorepo-directory-structure.md

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

# fsd-layer-architecture.md

> **Reference Documentation — February 2026**

## Overview

Feature-Sliced Design (FSD) 2.1 organizes frontend code into six hierarchical **layers**, each subdivided into domain-specific **slices**, each slice containing technical **segments**. The single most important rule: **a module can only import from layers below it**. [feature-sliced](https://feature-sliced.design)

---

## Layer Hierarchy (Top to Bottom)

```
app/         ← Initialization, providers, global styles, router
pages/       ← Route-level composition (Next.js app/ directory maps here)
widgets/     ← Self-contained UI blocks composing features + entities
features/    ← User interactions, business operations (actions)
entities/    ← Business objects (Lead, Tenant, Booking)
shared/      ← Reusable primitives with no business logic
```

**Import rule:** A module in `features/` can import from `entities/` and `shared/` but **never** from `widgets/` or `pages/`. [feature-sliced](https://feature-sliced.design/docs/get-started/overview)

---

## Layer Responsibilities

### `shared/`

Infrastructure and utilities with zero business domain knowledge:

```
shared/
├── ui/               # Generic UI components (Button, Input, Modal)
├── api/              # Base HTTP client, fetch wrappers
├── lib/              # Pure utilities (dates, strings, numbers)
├── config/           # Environment variable accessors
├── types/            # Primitive TypeScript types
└── constants/        # Application-wide constants
```

### `entities/`

Business objects — the nouns of your domain:

```
entities/
├── lead/
│   ├── model/        # Zustand slice or React context for lead state
│   ├── api/          # CRUD queries for leads
│   ├── ui/           # Lead card, lead avatar, lead status badge
│   └── index.ts      # Public API (what other layers can import)
├── tenant/
├── booking/
└── user/
```

### `features/`

User-initiated operations — the verbs of your domain:

```
features/
├── submit-contact-form/
│   ├── ui/           # The form component itself
│   ├── model/        # Form state, validation, submission handler
│   ├── api/          # POST /api/contact
│   └── index.ts
├── update-lead-status/
├── book-appointment/
└── manage-service-areas/
```

### `widgets/`

Stateful compositions of features and entities (e.g., a sidebar combining the lead list + filter controls):

```
widgets/
├── lead-feed/        # RealtimeLeadFeed + filter bar + export button
├── site-header/      # Nav + CTA + mobile menu
├── booking-modal/    # Cal.com embed + trigger button
└── contact-cta/      # Contact section composing submit-contact-form
```

### `pages/` (= Next.js `app/` routes)

Route-level components that assemble widgets:

```
// In Next.js, each app/*/page.tsx IS the FSD pages/ layer
// Do not create a separate pages/ directory — use app/ directory directly
```

### `app/` (= Next.js `app/layout.tsx`)

Global initialization: providers, fonts, global CSS, root error boundaries.

---

## Segments (Technical Subdivisions)

Every slice has the same internal structure — **segments**:

| Segment   | Contains                                                |
| --------- | ------------------------------------------------------- |
| `ui/`     | React components for this slice                         |
| `model/`  | State management, business logic, custom hooks          |
| `api/`    | Data fetching, mutations (server actions or REST calls) |
| `lib/`    | Pure utilities specific to this slice                   |
| `config/` | Slice-specific constants and configuration              |

```
entities/lead/
├── ui/
│   ├── LeadCard.tsx
│   ├── LeadScoreBadge.tsx
│   └── LeadStatusSelect.tsx
├── model/
│   ├── use-lead-store.ts   # Zustand or Jotai slice
│   └── lead-helpers.ts
├── api/
│   ├── get-leads.ts
│   ├── update-lead-status.ts
│   └── delete-lead.ts
└── index.ts               # Public surface — ONLY export from here
```

---

## Public API (index.ts)

Each slice exposes **only** what other layers need via `index.ts`. Internal modules are private:

```typescript
// entities/lead/index.ts
// ✅ Export: public surface for the lead entity
export { LeadCard } from './ui/LeadCard';
export { LeadScoreBadge } from './ui/LeadScoreBadge';
export { useLeadStore } from './model/use-lead-store';
export { getLeads, updateLeadStatus } from './api';
export type { Lead, LeadStatus, LeadSource } from './model/types';

// ❌ NOT exported: internal implementation details
// do NOT re-export from LeadCard.tsx internals
```

---

## @x Cross-Slice Notation

When two slices on the same layer must communicate, use the `@x` notation to make the dependency explicit and auditable: [github](https://github.com/feature-sliced/documentation)

```typescript
// features/book-appointment/model/use-booking.ts

// ✅ Correct @x cross-slice import — explicit, visible to Steiger
import { useLeadStore } from 'entities/lead/@x/book-appointment';
//                                             ^^^^^^^^^^^^^^^^^^^
// entities/lead must explicitly expose this in @x/book-appointment.ts

// ❌ Wrong — direct deep import bypasses the public API
import { useLeadStore } from 'entities/lead/model/use-lead-store';
```

The slice being imported from must create the `@x/` file:

```typescript
// entities/lead/@x/book-appointment.ts
// Explicit cross-slice export for the book-appointment feature
export { useLeadStore } from '../model/use-lead-store';
```

---

## Layer Mapping in Next.js App Router

```
FSD Layer       Next.js Location
──────────────────────────────────────────────────
app/            src/app/layout.tsx (+ providers.tsx)
pages/          src/app/**/page.tsx (one-to-one mapping)
widgets/        src/widgets/ (imported by page.tsx)
features/       src/features/ (imported by widgets/)
entities/       src/entities/ (imported by features/ + widgets/)
shared/         src/shared/ (imported by all layers)
```

---

## References

- FSD Official Documentation — https://feature-sliced.design/docs/get-started/overview
- FSD GitHub Repository — https://github.com/feature-sliced/documentation
- FSD Tutorial (Real World App) — https://feature-sliced.design/docs/get-started/tutorial
- Mastering FSD: Lessons from Real Projects — https://dev.to/arjunsanthosh/mastering-feature-sliced-design-lessons-from-real-projects-2ida

---

# cross-slice-import-patterns.md

> **Reference Documentation — February 2026**

## Overview

In Feature-Sliced Design, modules on the **same layer cannot import each other** by default. The `@x` (cross-import) notation provides a controlled, auditable escape hatch for necessary cross-slice dependencies within the same layer. [feature-sliced](https://feature-sliced.design/docs/get-started/overview)

---

## The Problem: Same-Layer Imports

```typescript
// ❌ VIOLATION — feature importing from another feature on the same layer
// features/book-appointment/model/use-booking.ts

import { useContactForm } from 'features/submit-contact-form';
// Steiger will flag this as: "no-cross-imports" violation
```

This creates hidden coupling between slices, making refactoring unpredictable.

---

## The Solution: @x Notation

The `@x/` directory creates an **explicit contract** between two slices:

```
entities/lead/
├── ...                         # Internal implementation
└── @x/
    ├── book-appointment.ts     # Exports only for book-appointment feature
    └── analytics-dashboard.ts  # Exports only for analytics-dashboard widget
```

**Consumer (importer):**

```typescript
// features/book-appointment/model/use-booking.ts

// ✅ Explicit @x import — visible in code review, tracked by Steiger
import { useLeadStore, type Lead } from 'entities/lead/@x/book-appointment';
```

**Provider (exporter) — must be explicit:**

```typescript
// entities/lead/@x/book-appointment.ts
// Only export what book-appointment legitimately needs.
// This file documents the dependency contract.

export { useLeadStore } from '../model/use-lead-store';
export type { Lead, LeadId } from '../model/types';

// Do NOT export UI components here — book-appointment has no right to render lead UI
```

---

## Dependency Flow Examples

### Valid: entity → shared

```typescript
// entities/lead/api/get-leads.ts
import { supabaseClient } from 'shared/api/supabase'; // ✅ entity → shared
```

### Valid: feature → entity (direct)

```typescript
// features/update-lead-status/api/update.ts
import { updateLeadStatus } from 'entities/lead'; // ✅ feature → entity public API
```

### Valid: feature → entity (cross-slice via @x)

```typescript
// features/book-appointment/model/use-booking.ts
import { type Lead } from 'entities/lead/@x/book-appointment'; // ✅ @x notation
```

### Invalid: feature → feature

```typescript
// features/book-appointment/model/use-booking.ts
import { formState } from 'features/submit-contact-form/model'; // ❌ same-layer import
```

**Resolution:** Extract the shared state to an `entity` or `shared` slice.

---

## Steiger Rule: `no-cross-imports`

Steiger's `no-cross-imports` rule enforces the `@x` pattern and fails CI for violations:

```typescript
// .steiger.config.ts
export default defineConfig({
  rules: {
    '@feature-sliced/no-cross-imports': [
      'error',
      {
        // Allow @x notation — it IS the sanctioned cross-import mechanism
        allowViaXNotation: true,
      },
    ],
  },
});
```

---

## When to Use @x vs. Lifting to Shared

| Situation                                           | Solution                                                    |
| --------------------------------------------------- | ----------------------------------------------------------- |
| One feature needs a type from another feature       | Lift the type to `entities/` or `shared/types/`             |
| One entity needs state from another entity          | Lift to `shared/model/` or create a new higher-level entity |
| Feature needs to call an entity's internal function | Expose via entity's `index.ts` public API                   |
| Two features need the same ephemeral state          | Extract to `entities/` slice                                |
| Cross-entity read for rendering (rare, audited)     | `@x` notation with explicit contract file                   |

**Rule of thumb:** If you need `@x` more than twice per feature, the feature should probably be split or the shared logic lifted to `entities/`.

---

## References

- FSD Cross-Import (@x notation) — https://feature-sliced.design/docs/reference/slices-segments#cross-imports
- FSD Overview — https://feature-sliced.design/docs/get-started/overview
- Steiger no-cross-imports rule — https://github.com/feature-sliced/steiger

---

# steiger-ci-integration.md

> **Reference Documentation — February 2026**

## Overview

Steiger is the official FSD linter. Integrating it into CI ensures that architectural violations — wrong layer imports, missing `index.ts` public APIs, insignificant slices — are caught automatically before merging. [github](https://github.com/feature-sliced/documentation)

---

## Installation

```bash
pnpm add -D steiger @feature-sliced/steiger-plugin
```

---

## Configuration

```typescript
// .steiger.config.ts (repo root)
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // Error on any slice that is never imported anywhere
      '@feature-sliced/insignificant-slice': 'error',

      // Error on direct cross-layer imports not using @x
      '@feature-sliced/no-cross-imports': 'error',

      // Error on missing public API (index.ts)
      '@feature-sliced/public-api': 'error',

      // Error on imports skipping a layer
      '@feature-sliced/layers-slices': 'error',

      // Warn on ambiguously named slices (should be noun for entities, verb for features)
      '@feature-sliced/ambiguous-slice-names': 'warn',
    },
  },
  {
    // Exclude auto-generated files
    files: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    rules: {
      '@feature-sliced/no-cross-imports': 'off',
    },
  },
]);
```

---

## Running Steiger

```bash
# Check a specific app
pnpm steiger apps/marketing/src

# Check all apps
pnpm steiger apps/*/src packages/*/src

# Add to turbo.json pipeline
```

```json
// turbo.json
{
  "tasks": {
    "lint:arch": {
      "dependsOn": [],
      "cache": true,
      "inputs": ["src/**/*.ts", "src/**/*.tsx", ".steiger.config.ts"]
    }
  }
}
```

---

## GitHub Actions Integration

```yaml
# .github/workflows/ci.yml (additions)
- name: FSD Architecture Check (Steiger)
  run: pnpm steiger apps/*/src packages/*/src
  # Reports all violations; fails CI on any 'error' level rule
```

---

## Common Violations and Fixes

| Violation             | Cause                                      | Fix                                         |
| --------------------- | ------------------------------------------ | ------------------------------------------- |
| `insignificant-slice` | Slice has no importers                     | Delete or merge into an existing slice      |
| `no-cross-imports`    | `features/a` imports `features/b` directly | Use `@x` notation or lift to `entities/`    |
| `public-api`          | Slice missing `index.ts`                   | Create `index.ts` and export public surface |
| `layers-slices`       | `shared/` importing from `entities/`       | Move shared code down to `shared/lib/`      |

---

## References

- Steiger GitHub — https://github.com/feature-sliced/steiger
- FSD Steiger Plugin — https://github.com/feature-sliced/steiger/tree/main/packages/steiger-plugin-fsd
- FSD CI Integration — https://feature-sliced.design/docs/guides/tech/with-steiger

---

# github-actions-workflow-complete.md

> **Reference Documentation — February 2026**

## Overview

This document defines the complete GitHub Actions CI/CD pipeline for the monorepo, covering type checking, unit tests, build validation, bundle size enforcement, Lighthouse performance gates, E2E tests, and staged production promotion. [github](https://github.com/marketplace/actions/lighthouse-ci-action)

---

## Complete Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  PNPM_VERSION: '9'
  NODE_VERSION: '22'
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

jobs:
  # ── 1. TypeScript & Lint ──────────────────────────────────────────────────
  typecheck:
    name: TypeScript + ESLint + Steiger
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck # Runs tsc --noEmit across all packages
      - run: pnpm lint # ESLint 9 flat config
      - run: pnpm lint:arch # Steiger FSD architecture check

  # ── 2. Unit Tests ─────────────────────────────────────────────────────────
  test:
    name: Unit Tests + Coverage
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage
        env:
          NODE_ENV: test
      - uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

  # ── 3. Build ──────────────────────────────────────────────────────────────
  build:
    name: Production Build
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - name: Build (with Turborepo remote cache)
        run: pnpm build
        env:
          NODE_ENV: production
          NEXT_TELEMETRY_DISABLED: '1'
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_ROOT_DOMAIN: staging.agency.com

  # ── 4. Bundle Size ────────────────────────────────────────────────────────
  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter marketing build
        env:
          ANALYZE: 'true'
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: 'https://stub.supabase.co'
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'stub'
      - run: pnpm size-limit --json > size-report.json
        continue-on-error: true
      - uses: actions/github-script@v7
        name: Post size report comment
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('size-report.json', 'utf8'));
            const exceeded = report.filter(r => r.exceeded);
            const rows = report.map(r =>
              `| ${r.exceeded ? '❌' : '✅'} | ${r.name} | ${(r.sizeRaw/1024).toFixed(1)} KB | ${(r.limitRaw/1024).toFixed(1)} KB |`
            ).join('\n');
            const body = `## 📦 Bundle Size Report\n\n| Status | Bundle | Size | Limit |\n|--------|--------|------|-------|\n${rows}\n\n${exceeded.length ? '> ⚠️ **Limits exceeded — fix before merging**' : '> ✅ All bundles within budget'}`;
            github.rest.issues.createComment({ issue_number: context.issue.number, owner: context.repo.owner, repo: context.repo.repo, body });
      - name: Fail on exceeded budgets
        run: |
          FAILED=$(cat size-report.json | jq '[.[] | select(.exceeded == true)] | length')
          if [ "$FAILED" -gt "0" ]; then exit 1; fi

  # ── 5. E2E Tests ──────────────────────────────────────────────────────────
  e2e:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    timeout-minutes: 30
    needs: [test, build]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter e2e exec playwright install chromium
      - run: pnpm --filter e2e test
        env:
          CI: true
          PLAYWRIGHT_BASE_URL: ${{ steps.vercel-preview.outputs.url }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ github.sha }}
          path: packages/e2e/playwright-report/
          retention-days: 14

  # ── 6. Lighthouse CI ──────────────────────────────────────────────────────
  lighthouse:
    name: Lighthouse Performance Gate
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - name: Wait for Vercel Preview
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        id: vercel-preview
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 300
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      - run: pnpm add -g @lhci/cli@0.14.x
      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          LHCI_BASE_URL: ${{ steps.vercel-preview.outputs.url }}

  # ── 7. Deploy Staging ─────────────────────────────────────────────────────
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, build, bundle-size]
    if: github.ref == 'refs/heads/staging' && github.event_name == 'push'
    environment:
      name: staging
      url: https://staging.agency.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (staging)
        run: npx vercel --token=${{ secrets.VERCEL_TOKEN }} --env=staging
      - name: Smoke tests
        run: pnpm --filter e2e test:smoke
        env:
          PLAYWRIGHT_BASE_URL: https://staging.agency.com

  # ── 8. Deploy Production (staged) ─────────────────────────────────────────
  deploy-production:
    name: Stage Production Deployment
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, build, bundle-size]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production-db # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - name: Deploy (staged, no domain assignment)
        run: |
          STAGED=$(npx vercel --prod --skip-domain --token=${{ secrets.VERCEL_TOKEN }} 2>&1 | tail -1)
          echo "STAGED_URL=$STAGED" >> $GITHUB_ENV
      - name: Run smoke tests against staged URL
        run: pnpm --filter e2e test:smoke
        env:
          PLAYWRIGHT_BASE_URL: ${{ env.STAGED_URL }}
      - name: Notify team (promote manually in Vercel dashboard)
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_DEPLOYMENTS }} \
            -H 'Content-type: application/json' \
            -d '{"text":"🚀 Production staged: ${{ env.STAGED_URL }} — promote when ready"}'
```

---

## References

- GitHub Actions Workflow Syntax — https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions
- Lighthouse CI Action — https://github.com/marketplace/actions/lighthouse-ci-action
- Monitoring with Lighthouse CI — https://softwarehouse.au/blog/monitoring-performance-with-lighthouse-ci-in-github-actions/
- Vercel Staging Environments — https://vercel.com/kb/guide/set-up-a-staging-environment-on-vercel

---

# stripe-webhook-handler.md

> **Reference Documentation — February 2026**

## Overview

Stripe webhooks notify your application of billing events (subscription created, invoice paid, payment failed). The handler must verify the Stripe signature before processing, use `stripe.webhooks.constructEvent()` with the raw request body, and return 200 immediately — long processing goes to a QStash queue. [digitalapplied](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026)

---

## Critical: Raw Body Requirement

Next.js App Router does not buffer the raw body by default. Stripe signature verification requires the **raw bytes** — not the parsed JSON. This is the most common source of webhook verification failures:

```typescript
// apps/*/src/app/api/webhooks/stripe/route.ts
export const runtime = 'nodejs'; // Must be Node.js — not Edge
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { handleStripeEvent } from '@repo/billing/webhook-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Use latest stable API version
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // ← Must use .text(), not .json()
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Return 200 immediately — process async via QStash
  await handleStripeEvent(event);

  return NextResponse.json({ received: true }, { status: 200 });
}
```

---

## Event Handler (packages/billing)

```typescript
// packages/billing/src/webhook-handler.ts
import type Stripe from 'stripe';
import { db } from '@repo/db';
import { qstash } from '@repo/jobs/client';

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    // ── Subscription lifecycle ────────────────────────────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscriptionToDb(sub);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .from('tenants')
        .update({ status: 'cancelled', plan: null })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }

    // ── Invoice events ────────────────────────────────────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      // Enqueue receipt email via QStash (async — don't block webhook response)
      await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/email/receipt`,
        body: {
          type: 'payment_receipt',
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
          periodEnd: invoice.period_end,
        },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await db
        .from('tenants')
        .update({ billing_status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string);
      // Email dunning sequence starts here
      await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/email/payment-failed`,
        body: { customerId: invoice.customer, attemptCount: invoice.attempt_count },
      });
      break;
    }

    // ── Checkout ─────────────────────────────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription') {
        await activateTenantSubscription(session);
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }
}

async function syncSubscriptionToDb(sub: Stripe.Subscription) {
  const planMap: Record<string, 'starter' | 'pro' | 'enterprise'> = {
    price_starter: 'starter',
    price_pro: 'pro',
    price_enterprise: 'enterprise',
  };

  const priceId = sub.items.data[0]?.price.id ?? '';
  const plan = planMap[priceId] ?? 'starter';
  const status = sub.status === 'active' ? 'active' : 'suspended';

  await db
    .from('tenants')
    .update({
      plan,
      status,
      billing_status: sub.status,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', sub.customer as string);
}
```

---

## Idempotency

Stripe retries webhooks for up to 72 hours if your endpoint returns non-200. Use the event `id` as an idempotency key to prevent duplicate processing: [digitalapplied](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026)

```typescript
// At the start of handleStripeEvent:
const { data: existing } = await db
  .from('processed_webhook_events')
  .select('id')
  .eq('event_id', event.id)
  .maybeSingle();

if (existing) {
  console.log(`[Stripe] Event ${event.id} already processed — skipping`);
  return;
}

await db.from('processed_webhook_events').insert({ event_id: event.id });
// Proceed with processing...
```

---

## References

- Stripe Webhook Documentation — https://stripe.com/docs/webhooks
- Stripe Webhooks with Next.js App Router — https://www.mtechzilla.com/blogs/integrate-stripe-checkout-with-nextjs
- Complete Stripe Integration Guide 2026 — https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026

---

# qstash-client-setup.md

> **Reference Documentation — February 2026**

## Overview

QStash is Upstash's serverless message queue and scheduler. It enables background processing in Next.js without requiring a persistent server — jobs are invoked via HTTP POST from QStash to your API routes. [upstash](https://upstash.com/docs/qstash/quickstarts/vercel-nextjs)

---

## Installation

```bash
pnpm add @upstash/qstash
```

---

## Client Setup

```typescript
// packages/jobs/src/client.ts
import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// Shorthand for publishing to an internal API route
export function publishJob<T extends Record<string, unknown>>(
  route: string,
  body: T,
  options?: {
    delay?: number; // Delay in seconds
    retries?: number; // Default: 3
    timeout?: number; // Handler timeout in seconds
    deduplicationId?: string; // Prevent duplicate messages
  }
) {
  return qstash.publishJSON({
    url: `${process.env.APP_URL}${route}`,
    body,
    retries: options?.retries ?? 3,
    delay: options?.delay,
    timeout: options?.timeout,
    deduplicationId: options?.deduplicationId,
  });
}
```

---

## Request Verification Middleware

Every QStash consumer route **must** verify the signature to prevent unauthorized invocation: [upstash](https://upstash.com/docs/qstash/quickstarts/vercel-nextjs)

```typescript
// packages/jobs/src/verify.ts
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';

// Wrap any API route handler with this to verify QStash signature
export { verifySignatureAppRouter as verifyQStashSignature };

// Usage in a route:
// export const POST = verifyQStashSignature(async (req: Request) => { ... });
```

---

## Example: Weekly Report Job

```typescript
// apps/*/src/app/api/jobs/reports/weekly/route.ts
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { generateAndSendWeeklyReports } from '@repo/jobs/handlers/weekly-reports';

export const maxDuration = 60; // Required for PDF generation
export const runtime = 'nodejs';

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  await generateAndSendWeeklyReports(body);
  return Response.json({ success: true });
});
```

---

## Scheduled Jobs Registration

```typescript
// packages/jobs/src/schedules/register.ts
// Run once at startup or via admin action to register cron schedules

import { qstash } from '../client';

const SCHEDULES = [
  {
    name: 'weekly-reports',
    cron: '0 23 * * 0', // Sunday 11 PM UTC
    url: '/api/jobs/reports/weekly',
    body: { trigger: 'cron' },
  },
  {
    name: 'daily-crm-sync',
    cron: '0 6 * * *', // Daily at 6 AM UTC
    url: '/api/jobs/crm/sync',
    body: { trigger: 'cron' },
  },
  {
    name: 'gdpr-deletion-check',
    cron: '0 2 * * 0', // Weekly Sunday 2 AM UTC
    url: '/api/jobs/gdpr/deletion-check',
    body: { trigger: 'cron' },
  },
];

export async function registerAllSchedules() {
  const existing = await qstash.schedules.list();
  const existingNames = existing.map((s: any) => s.destination.split('/').pop());

  for (const schedule of SCHEDULES) {
    if (!existingNames.includes(schedule.name)) {
      await qstash.schedules.create({
        destination: `${process.env.APP_URL}${schedule.url}`,
        cron: schedule.cron,
        body: JSON.stringify(schedule.body),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(`[QStash] Registered schedule: ${schedule.name}`);
    }
  }
}
```

---

## References

- QStash Next.js Quickstart — https://upstash.com/docs/qstash/quickstarts/vercel-nextjs
- QStash Background Jobs — https://upstash.com/docs/qstash/features/background-jobs
- QStash Schedules — https://upstash.com/docs/qstash/features/schedules
- Upstash QStash SDK — https://github.com/upstash/qstash-js

---

# rendering-decision-matrix.md

> **Reference Documentation — February 2026**

## Overview

Next.js 16 supports four rendering modes: Static Site Generation (SSG), Incremental Static Regeneration (ISR), Server-Side Rendering (SSR), and Client-Side Rendering (CSR). Choosing the wrong mode for a page type is the most common source of performance regressions and unnecessary server load. [digitalapplied](https://www.digitalapplied.com/blog/nextjs-16-performance-server-components-guide)

---

## Decision Matrix

| Page Type          | Mode                                               | Reason                                               |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| Marketing homepage | **PPR** (SSG shell + dynamic island)               | Best LCP; only above-fold is static                  |
| Service area pages | **ISR** (`cacheLife: 24h`)                         | SEO-critical; changes infrequently                   |
| Blog posts         | **ISR** (`cacheLife: 1h`) + on-demand revalidation | CMS-driven; on-demand ISR on publish                 |
| Contact form page  | **SSG**                                            | Pure static; form is client-side                     |
| Portal dashboard   | **SSR** + `use cache` per-query                    | Always-fresh data; authenticated                     |
| Realtime lead feed | **SSR** initial + **CSR** updates                  | Server renders initial leads; Realtime adds new ones |
| Booking page       | **SSG** + CSR for Cal.com embed                    | Cal.com embeds as CSR component                      |
| Super admin panel  | **SSR**                                            | Must never cache admin data                          |
| PDF report pages   | **Streaming SSR** (`Suspense`)                     | Large data queries stream progressively              |
| A/B test variants  | **Edge Middleware + SSG**                          | Middleware selects variant at edge; no layout shift  |

---

## Mode Implementation Patterns

### SSG (Static)

```typescript
// No exports needed — Next.js defaults to static if no dynamic data
export default async function ContactPage() {
  return <ContactForm />;
}
```

### ISR (Incremental Static Regeneration)

```typescript
// Next.js 16 uses cacheLife instead of revalidate
import { unstable_cacheLife as cacheLife } from 'next/cache';

export default async function ServiceAreaPage({ params }: Props) {
  const area = await getServiceAreaData(params.slug, { cacheLife: '24h' });
  return <ServiceAreaContent area={area} />;
}
```

### PPR (Partial Pre-rendering)

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: { ppr: true },
};

// page.tsx
export default function HomePage() {
  return (
    <main>
      {/* Static shell — pre-rendered at build */}
      <HeroSection />
      <ServicesSection />

      {/* Dynamic island — streamed at request time */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <DynamicReviews />
      </Suspense>
    </main>
  );
}
```

### SSR (Server-Side Rendering)

```typescript
// Force dynamic rendering — runs on every request
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Runs fresh on every request
  const leads = await getRecentLeads();
  return <LeadDashboard leads={leads} />;
}
```

---

## `use cache` Directive (Next.js 16)

The `use cache` directive allows granular caching of individual functions without making an entire page static:

```typescript
// Cache a specific data fetch for 5 minutes
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function getTenantConfig(tenantId: string) {
  'use cache';
  cacheTag(`tenant:${tenantId}`);
  cacheLife('5m');

  return db.from('tenants').select('config').eq('id', tenantId).single();
}
```

---

## References

- Next.js 16 Rendering Modes — https://nextjs.org/docs/app/building-your-application/rendering
- Next.js PPR Documentation — https://nextjs.org/docs/app/api-reference/config/next-config-js/ppr
- Next.js `use cache` Directive — https://nextjs.org/docs/app/api-reference/directives/use-cache
- Next.js 16 Performance Guide — https://www.digitalapplied.com/blog/nextjs-16-performance-server-components-guide

---

# tenant-caching-patterns.md

> **Reference Documentation — February 2026**

## Overview

Tenant-isolated caching prevents one tenant's data from ever appearing in another tenant's response. This requires every `use cache` call, ISR page, and Upstash Redis key to include the `tenantId` as a cache key component and cache tag. [vercel](https://vercel.com/docs/incremental-migration)

---

## The Isolation Invariant

```
RULE: Every cache key and cache tag that contains tenant-specific data
      MUST include tenantId as a component.

CORRECT:   cacheTag(`tenant:${tenantId}:leads`)
INCORRECT: cacheTag('leads')   ← shared across ALL tenants
```

---

## `use cache` + `cacheTag` Pattern

```typescript
// packages/db/src/queries/tenant-queries.ts
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

export async function getTenantConfig(tenantId: string) {
  'use cache';
  cacheTag(`tenant:${tenantId}`); // Bust all tenant data
  cacheTag(`tenant:${tenantId}:config`); // Bust only config
  cacheLife('1h');

  const { data } = await supabase
    .from('tenants')
    .select('config, plan, status')
    .eq('id', tenantId)
    .single();

  return data;
}

export async function getTenantLeads(tenantId: string, limit = 20) {
  'use cache';
  cacheTag(`tenant:${tenantId}`);
  cacheTag(`tenant:${tenantId}:leads`);
  cacheLife('5m');

  return supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
}
```

---

## Tag-Based Invalidation Map

| Tenant Action              | `revalidateTag()` Calls                              |
| -------------------------- | ---------------------------------------------------- |
| Update identity settings   | `tenant:${id}`, `tenant:${id}:config`                |
| New lead created           | `tenant:${id}:leads`                                 |
| Service area added/removed | `tenant:${id}:sitemap`, `tenant:${id}:service-areas` |
| Blog post published        | `tenant:${id}:blog`, `tenant:${id}:blog:${slug}`     |
| Plan upgrade/downgrade     | `tenant:${id}` (full bust)                           |

---

## Upstash Redis Key Namespace

```typescript
// packages/security/src/rate-limit.ts

// All Redis keys prefixed with tenant ID
export function tenantRateLimitKey(tenantId: string, action: string) {
  return `ratelimit:${tenantId}:${action}`;
}

// Cache keys
export function tenantCacheKey(tenantId: string, resource: string) {
  return `cache:v1:${tenantId}:${resource}`;
}

// Session keys (Upstash Redis)
export function tenantSessionKey(tenantId: string, userId: string) {
  return `session:${tenantId}:${userId}`;
}
```

---

## References

- Next.js `cacheTag` Documentation — https://nextjs.org/docs/app/api-reference/functions/cacheTag
- Next.js `use cache` Directive — https://nextjs.org/docs/app/api-reference/directives/use-cache
- Vercel Incremental Migration — https://vercel.com/docs/incremental-migration

---

# bundle-size-budgets.md

> **Reference Documentation — February 2026**

## Overview

Bundle size budgets prevent unintentional performance regressions from landing in production. The budget system has two layers: `size-limit` (enforces hard byte limits per route) and `@next/bundle-analyzer` (visual treemap for investigation). Both run in CI. [catchmetrics](http://www.catchmetrics.io/blog/reducing-nextjs-bundle-size-with-nextjs-bundle-analyzer)

---

## `size-limit` Configuration

```typescript
// .size-limit.ts (repo root)
const config = [
  // ── Marketing site (SEO-critical — hard limits) ──────────────────────────
  {
    name: 'Marketing: Homepage first-load JS',
    path: '.next/static/chunks/pages/index.js',
    limit: '85 KB',
    gzip: true,
  },
  {
    name: 'Marketing: Service area page',
    path: '.next/static/chunks/pages/service-area/**/*.js',
    limit: '60 KB',
    gzip: true,
  },
  {
    name: 'Marketing: Contact page',
    path: '.next/static/chunks/pages/contact.js',
    limit: '50 KB',
    gzip: true,
  },

  // ── Framework chunks ─────────────────────────────────────────────────────
  {
    name: 'React + Next.js runtime',
    path: '.next/static/chunks/framework-*.js',
    limit: '50 KB',
    gzip: true,
  },

  // ── Portal (authenticated — softer limits) ────────────────────────────────
  {
    name: 'Portal: Dashboard first-load JS',
    path: '.next/static/chunks/pages/dashboard/index.js',
    limit: '120 KB',
    gzip: true,
  },
];

export default config;
```

---

## Bundle Analyzer Integration

```typescript
// packages/config/src/next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// Usage:
// ANALYZE=true pnpm --filter marketing build
// Open .next/analyze/client.html to inspect treemap
```

---

## `optimizePackageImports` — Tree-Shaking Enforcement

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react', // Without this: entire icon library ships (500+ icons)
      '@radix-ui/react-icons',
      'date-fns', // Without this: entire date-fns tree ships
      'lodash-es',
    ],
  },
};
```

**Impact:** `lucide-react` without `optimizePackageImports` adds ~180 KB gzip. With it: ~2 KB per icon used. [dev](https://dev.to/gouranga-das-khulna/how-to-reduce-bundle-size-in-next-js-5fdl)

---

## Common Bundle Size Culprits

| Package                    | Default Size | Optimized                                     |
| -------------------------- | ------------ | --------------------------------------------- |
| `lucide-react` (all icons) | ~180 KB gzip | ~2 KB/icon with `optimizePackageImports`      |
| `date-fns` (full)          | ~75 KB gzip  | ~5–15 KB with tree-shaking                    |
| `@react-pdf/renderer`      | ~200 KB      | Lazy load in report routes only               |
| Recharts                   | ~120 KB      | Lazy load behind `dynamic(() => import(...))` |
| `moment.js`                | ~72 KB       | Replace with `date-fns` or `Temporal`         |

---

## References

- `@next/bundle-analyzer` — https://www.npmjs.com/package/@next/bundle-analyzer
- Next.js Package Bundling Guide — https://nextjs.org/docs/app/guides/package-bundling
- Reducing Bundle Size in Next.js — https://dev.to/gouranga-das-khulna/how-to-reduce-bundle-size-in-next-js-5fdl
- `size-limit` npm — https://github.com/ai/size-limit

---

Now I have enough context to generate all 5 Batch B documents at production depth. Here they are:

---

# `security-middleware-implementation.md`

> **Internal Template — customize as needed.**

```
# security-middleware-implementation.md
```

## Overview

This document specifies the complete `middleware.ts` implementation for the multi-tenant SaaS platform. The middleware runs at the Vercel Edge Runtime on every request and orchestrates a layered security pipeline: bot detection → IP allow/deny → per-tenant rate limiting → tenant resolution → Clerk authentication → CSP nonce injection → security header attachment. Each layer is independently composable and fails closed (deny on error). [projectdiscovery](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass)

> **CVE-2025-29927 Note:** Never rely solely on middleware for auth. Every protected Server Component and Route Handler must independently call `auth()` or `protect()` from Clerk. Middleware is a first-line filter only. [clerk](https://clerk.com/blog/cve-2025-29927)

---

## Architecture

```
Incoming Request
       │
       ▼
┌─────────────────────────────────────────┐
│  1. STRIP INTERNAL HEADERS              │  ← Block x-middleware-subrequest forgery
│     (CVE-2025-29927 hardening)          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  2. BOT / UA DETECTION                  │  ← Block known scrapers, scanners
│     (user-agent + IP reputation)        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  3. GLOBAL RATE LIMIT (Edge)            │  ← Upstash Ratelimit sliding window
│     10 req/s per IP                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  4. TENANT RESOLUTION                   │  ← hostname → tenantId lookup
│     (subdomain + custom domain)         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  5. PER-TENANT RATE LIMIT               │  ← Upstash Ratelimit token bucket
│     100 req/min per tenantId            │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  6. CLERK AUTH GATE                     │  ← JWT verification, redirect logic
│     (clerkMiddleware)                   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  7. CSP NONCE GENERATION                │  ← crypto.randomUUID() nonce
│     Injected into x-nonce header        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  8. SECURITY HEADERS                    │  ← HSTS, CSP, X-Frame, Permissions
│     (applied to response)               │
└───────────────┬─────────────────────────┘
                │
                ▼
             Route Handler / Page
```

---

## Implementation

### `apps/portal/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { geolocation, ipAddress } from '@vercel/functions';
import { type NextRequest, NextResponse } from 'next/server';

// ─── Redis clients (reused across invocations via module scope) ───────────────
const redis = Redis.fromEnv();

const globalRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 s'),
  analytics: true,
  prefix: 'rl:global',
  ephemeralCache: new Map(),
});

const tenantRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(100, '1 m', 20),
  analytics: true,
  prefix: 'rl:tenant',
  ephemeralCache: new Map(),
});

// ─── Route matchers ───────────────────────────────────────────────────────────
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)',   // Stripe, Cal.com, QStash — verified by their own HMAC
  '/api/health',
  '/_next/(.*)',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap(.*)',
]);

const isApiRoute = createRouteMatcher(['/api/(.*)']);

// ─── Known bot user-agent patterns ───────────────────────────────────────────
const BOT_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i,
  /zgrab/i, /nuclei/i, /python-requests\/ [nextjs](https://nextjs.org/docs/pages/guides/content-security-policy)\./i,
  /go-http-client\/1\./i, /curl\/[0-6]\./i,
];

function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((p) => p.test(ua));
}

// ─── Tenant resolution ────────────────────────────────────────────────────────
async function resolveTenantId(hostname: string): Promise<string | null> {
  // Strip port for local dev
  const host = hostname.split(':')[0];

  // Architecture invariant: all Redis keys include tenantId namespace
  const cached = await redis.get<string>(`tenant:hostname:${host}`);
  if (cached) return cached;

  // Fallback: subdomain resolution for *.yourdomain.com
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'yourdomain.com';
  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = host.replace(`.${BASE_DOMAIN}`, '');
    // Cache miss → store for 5 min
    await redis.setex(`tenant:hostname:${host}`, 300, subdomain);
    return subdomain;
  }

  return null;
}

// ─── CSP nonce + header builder ───────────────────────────────────────────────
function buildSecurityHeaders(nonce: string, tenantId: string | null) {
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} https://clerk.accounts.dev https://*.clerk.accounts.dev https://js.stripe.com https://cal.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https://*.supabase.co https://res.cloudinary.com https://images.unsplash.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://o*.ingest.sentry.io https://*.tinybird.co`,
    `frame-src 'self' https://js.stripe.com https://cal.com https://*.cal.com`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report?tenantId=${tenantId ?? 'unknown'}`,
  ].join('; ');

  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-DNS-Prefetch-Control': 'on',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "https://js.stripe.com")',
      'usb=()',
      'bluetooth=()',
      'accelerometer=()',
      'gyroscope=()',
    ].join(', '),
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
  } as const;
}

// ─── Main middleware (Clerk wraps the core logic) ─────────────────────────────
export default clerkMiddleware(async (auth, request: NextRequest) => {
  const response = NextResponse.next();

  // 1. Strip forged internal routing headers (CVE-2025-29927 hardening)
  //    If present on inbound edge requests, strip them to prevent bypass.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-middleware-subrequest');

  // 2. Bot detection
  const ua = request.headers.get('user-agent');
  if (isBotUserAgent(ua)) {
    return new NextResponse(null, { status: 403 });
  }

  // 3. Global IP rate limit
  const ip = ipAddress(request) ?? 'anonymous';
  const geo = geolocation(request);
  const { success: globalOk, limit, reset, remaining } = await globalRatelimit.limit(ip);
  if (!globalOk) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests', retryAfter: reset }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }

  // 4. Tenant resolution
  const hostname = request.headers.get('host') ?? '';
  const tenantId = await resolveTenantId(hostname);

  // Attach tenantId to forwarded request headers for downstream consumption
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
  }

  // 5. Per-tenant rate limit (only if tenant identified)
  if (tenantId) {
    const tenantKey = `${tenantId}:${ip}`;
    const { success: tenantOk, reset: tenantReset } = await tenantRatelimit.limit(tenantKey);
    if (!tenantOk) {
      return new NextResponse(
        JSON.stringify({ error: 'Tenant rate limit exceeded' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((tenantReset - Date.now()) / 1000)),
          },
        },
      );
    }
  }

  // 6. Auth gate (Clerk handles JWT verification internally)
  if (!isPublicRoute(request)) {
    const { userId, orgId } = await auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // For API routes, return 401 instead of redirect
    if (isApiRoute(request) && !userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Tenant <-> org isolation check
    if (tenantId && orgId && orgId !== tenantId) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 7. CSP nonce generation
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  requestHeaders.set('x-nonce', nonce);

  // 8. Build and attach security headers
  const secHeaders = buildSecurityHeaders(nonce, tenantId);

  const finalResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  for (const [key, value] of Object.entries(secHeaders)) {
    finalResponse.headers.set(key, value);
  }

  // Forward diagnostic headers (stripped in production by Vercel edge)
  if (process.env.NODE_ENV !== 'production') {
    finalResponse.headers.set('x-debug-tenant', tenantId ?? 'unresolved');
    finalResponse.headers.set('x-debug-geo', JSON.stringify(geo));
  }

  return finalResponse;
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Middleware Execution Performance Targets

| Layer                            | P50    | P95   | Failure mode             |
| -------------------------------- | ------ | ----- | ------------------------ |
| Bot UA check                     | <0.1ms | 0.5ms | 403                      |
| Global rate limit (Upstash edge) | 2ms    | 8ms   | 429                      |
| Tenant resolution (Redis cached) | 1ms    | 4ms   | Continue (tenantId=null) |
| Per-tenant rate limit            | 2ms    | 8ms   | 429                      |
| Clerk JWT verification           | 12ms   | 18ms  | 401/redirect             |
| Total middleware                 | ~18ms  | ~40ms | Fail closed              |

Clerk's session validation averages 12.5ms at P50 and 18ms at P95. [clerk](https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router)

---

## References

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [CVE-2025-29927: Middleware Authorization Bypass](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass) [projectdiscovery](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass)
- [Clerk CVE-2025-29927 Advisory](https://clerk.com/blog/cve-2025-29927) [clerk](https://clerk.com/blog/cve-2025-29927)
- [Upstash Ratelimit Overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Upstash Dynamic Rate Limits (Jan 2026)](https://upstash.com/blog/dynamic-rate-limits) [upstash](https://upstash.com/blog/dynamic-rate-limits)
- [Next.js CSP Guide](https://nextjs.org/docs/app/guides/content-security-policy) [nextjs](https://nextjs.org/docs/app/guides/content-security-policy)

---

---

# `server-action-security-wrapper.md`

> **Internal Template — customize as needed.**

```
# server-action-security-wrapper.md
```

## Overview

This document specifies `createServerAction()` — the platform's universal security wrapper for all Next.js Server Actions. Every Server Action in the codebase MUST be created through this factory. It enforces: Clerk authentication, tenant scoping, Zod input validation, per-action rate limiting, and structured error responses. CSRF protection is handled natively by Next.js (POST-only + Origin header check), so no manual token is required. [makerkit](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)

---

## Architecture

```
Client calls Server Action
         │
         ▼
┌────────────────────────────┐
│  createServerAction()      │
│  ┌──────────────────────┐  │
│  │ 1. Auth check        │  │ ← Clerk auth(), returns userId + orgId
│  │    (fail → throw)    │  │
│  ├──────────────────────┤  │
│  │ 2. Tenant scoping    │  │ ← orgId must match x-tenant-id header
│  │    (fail → throw)    │  │
│  ├──────────────────────┤  │
│  │ 3. Zod validation    │  │ ← Input schema parse
│  │    (fail → return    │  │   structured error)
│  │     field errors)    │  │
│  ├──────────────────────┤  │
│  │ 4. Rate limit        │  │ ← Per-action, per-user Upstash check
│  │    (fail → throw)    │  │
│  ├──────────────────────┤  │
│  │ 5. Execute handler   │  │ ← Wrapped in try/catch + Sentry
│  │    (fail → Sentry)   │  │
│  └──────────────────────┘  │
└────────────────────────────┘
         │
         ▼
   ActionResult<TOutput>
```

---

## Core Implementation

### `packages/server-actions/src/create-server-action.ts`

```typescript
import { auth } from '@clerk/nextjs/server';
import * as Sentry from '@sentry/nextjs';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { z, type ZodSchema, type ZodError } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionError = {
  success: false;
  error: string;
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'INTERNAL_ERROR';
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;

export type ActionContext = {
  userId: string;
  tenantId: string;
  orgId: string | null;
};

export type ServerActionHandler<TInput, TOutput> = (
  input: TInput,
  ctx: ActionContext
) => Promise<TOutput>;

export interface CreateServerActionOptions<TInput, TOutput> {
  /** Zod schema for input validation */
  schema: ZodSchema<TInput>;
  /** The action handler receives validated input + auth context */
  handler: ServerActionHandler<TInput, TOutput>;
  /** Optional: allow unauthenticated callers (public actions) */
  allowUnauthenticated?: boolean;
  /** Optional: rate limit override (default: 20 req / 1 min per user) */
  rateLimit?: { requests: number; window: string };
  /** Optional: action name for rate limit key namespacing + Sentry tagging */
  actionName?: string;
}

// ─── Redis singleton ──────────────────────────────────────────────────────────
const redis = Redis.fromEnv();

// ─── Default rate limit: 20 requests per minute per user ─────────────────────
const defaultRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: true,
  prefix: 'rl:action',
  ephemeralCache: new Map(),
});

const ratelimitCache = new Map<string, Ratelimit>();

function getRatelimit(options?: { requests: number; window: string }): Ratelimit {
  if (!options) return defaultRatelimit;
  const key = `${options.requests}:${options.window}`;
  if (!ratelimitCache.has(key)) {
    ratelimitCache.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(options.requests, options.window),
        analytics: true,
        prefix: 'rl:action:custom',
        ephemeralCache: new Map(),
      })
    );
  }
  return ratelimitCache.get(key)!;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createServerAction<TInput, TOutput>(
  options: CreateServerActionOptions<TInput, TOutput>
) {
  const {
    schema,
    handler,
    allowUnauthenticated = false,
    rateLimit,
    actionName = 'unknown',
  } = options;

  return async (rawInput: unknown): Promise<ActionResult<TOutput>> => {
    return Sentry.withScope(async (scope) => {
      scope.setTag('serverAction', actionName);

      try {
        // ── Step 1: Authentication ─────────────────────────────────────────
        const { userId, orgId } = await auth();

        if (!allowUnauthenticated && !userId) {
          return {
            success: false,
            error: 'Authentication required',
            code: 'UNAUTHORIZED',
          } satisfies ActionError;
        }

        // ── Step 2: Tenant scoping ─────────────────────────────────────────
        //    Architecture invariant: tenantId must be present in all actions
        const headerStore = await headers();
        const tenantId = headerStore.get('x-tenant-id');

        if (!tenantId) {
          Sentry.captureMessage(
            `Server action ${actionName} called without x-tenant-id header`,
            'warning'
          );
          return {
            success: false,
            error: 'Tenant context missing',
            code: 'FORBIDDEN',
          } satisfies ActionError;
        }

        // Verify orgId matches tenantId for authenticated actions
        if (userId && orgId && orgId !== tenantId) {
          scope.setTag('tenantMismatch', 'true');
          Sentry.captureMessage(
            `Tenant isolation violation in ${actionName}: orgId=${orgId} tenantId=${tenantId}`,
            'error'
          );
          return {
            success: false,
            error: 'Forbidden',
            code: 'FORBIDDEN',
          } satisfies ActionError;
        }

        scope.setTag('tenantId', tenantId);
        scope.setUser({ id: userId ?? 'anonymous' });

        // ── Step 3: Input validation ───────────────────────────────────────
        const parsed = schema.safeParse(rawInput);

        if (!parsed.success) {
          const zodError = parsed.error as ZodError;
          const fieldErrors = zodError.flatten().fieldErrors as Record<string, string[]>;
          return {
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            fieldErrors,
          } satisfies ActionError;
        }

        // ── Step 4: Rate limiting ──────────────────────────────────────────
        //    Architecture invariant: rate limit key includes tenantId
        const rl = getRatelimit(rateLimit);
        const rlKey = `${tenantId}:${userId ?? 'anon'}:${actionName}`;
        const { success: rlOk, reset } = await rl.limit(rlKey);

        if (!rlOk) {
          return {
            success: false,
            error: `Rate limit exceeded. Retry after ${new Date(reset).toISOString()}`,
            code: 'RATE_LIMITED',
          } satisfies ActionError;
        }

        // ── Step 5: Execute handler ────────────────────────────────────────
        const ctx: ActionContext = {
          userId: userId!,
          tenantId,
          orgId: orgId ?? null,
        };

        const data = await handler(parsed.data, ctx);

        return { success: true, data } satisfies ActionSuccess<TOutput>;
      } catch (err) {
        Sentry.captureException(err, {
          tags: { serverAction: actionName },
        });

        if (process.env.NODE_ENV === 'development') {
          console.error(`[createServerAction:${actionName}]`, err);
        }

        return {
          success: false,
          error: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        } satisfies ActionError;
      }
    });
  };
}
```

---

## Usage Examples

### Authenticated, tenant-scoped action

```typescript
// features/leads/actions/create-lead.action.ts
'use server';

import { createServerAction } from '@your-org/server-actions';
import { createLeadSchema } from '../schemas/lead.schema';
import { db } from '@/lib/db';

export const createLeadAction = createServerAction({
  actionName: 'createLead',
  schema: createLeadSchema,
  rateLimit: { requests: 10, window: '1 m' },
  handler: async (input, ctx) => {
    // ctx.tenantId is guaranteed present and verified
    const lead = await db
      .from('leads')
      .insert({
        ...input,
        tenant_id: ctx.tenantId, // Architecture invariant: always scope to tenantId
        created_by: ctx.userId,
      })
      .select()
      .single();

    return lead;
  },
});
```

### Public action (no auth required)

```typescript
// features/contact/actions/submit-contact.action.ts
'use server';

import { createServerAction } from '@your-org/server-actions';
import { contactFormSchema } from '../schemas/contact.schema';

export const submitContactAction = createServerAction({
  actionName: 'submitContact',
  schema: contactFormSchema,
  allowUnauthenticated: true,
  rateLimit: { requests: 3, window: '5 m' }, // Aggressive limit for public
  handler: async (input, ctx) => {
    // ctx.tenantId still present (from x-tenant-id header via middleware)
    await sendLeadNotification({ ...input, tenantId: ctx.tenantId });
    return { submitted: true };
  },
});
```

### Consuming in a React component

```typescript
// features/leads/ui/lead-form.tsx
'use client';

import { useActionState } from 'react';
import { createLeadAction } from '../actions/create-lead.action';
import type { ActionResult } from '@your-org/server-actions';

const initialState: ActionResult<{ id: string }> = { success: false, error: '', code: 'INTERNAL_ERROR' };

export function LeadForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return createLeadAction(Object.fromEntries(formData));
    },
    initialState,
  );

  return (
    <form action={formAction}>
      {/* fields */}
      {!state.success && state.code === 'VALIDATION_ERROR' && (
        <ul>
          {Object.entries(state.fieldErrors ?? {}).map(([field, errors]) => (
            <li key={field}>{errors.join(', ')}</li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={isPending}>Submit</button>
    </form>
  );
}
```

---

## Package Export

### `packages/server-actions/src/index.ts`

```typescript
export { createServerAction } from './create-server-action';
export type {
  ActionResult,
  ActionSuccess,
  ActionError,
  ActionContext,
} from './create-server-action';
```

### `packages/server-actions/package.json`

```json
{
  "name": "@your-org/server-actions",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "dependencies": {
    "@clerk/nextjs": "^6.0.0",
    "@sentry/nextjs": "^9.0.0",
    "@upstash/ratelimit": "^2.0.0",
    "@upstash/redis": "^1.34.0",
    "zod": "^3.23.0"
  }
}
```

---

## CSRF Posture

Next.js Server Actions have native CSRF protection via: [nextjs](https://nextjs.org/blog/security-nextjs-server-components-actions)

- Only accept `POST` requests
- Verify `Origin` header matches the deployment domain
- Use internally generated, encrypted action IDs that cannot be forged by attackers

Manual CSRF token injection is therefore **not needed** and would be redundant. [makerkit](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)

---

## References

- [Next.js Security in Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions) [nextjs](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [Server Actions Security — 5 Vulnerabilities](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions) [makerkit](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)
- [Next.js Server Action and Frontend Security](https://www.querypie.com/features/documentation/blog/20/nextjs-server-action-security) [querypie](https://www.querypie.com/features/documentation/blog/20/nextjs-server-action-security)
- [Next-level security: Next.js applications](https://www.vintasoftware.com/blog/security-nextjs-applications) [vintasoftware](https://www.vintasoftware.com/blog/security-nextjs-applications)

---

---

# `security-headers-system.md`

> **Internal Template — customize as needed.**

```
# security-headers-system.md
```

## Overview

This document specifies the complete HTTP security header system for all apps in the platform. Headers are applied at two layers: **middleware-level** (dynamic, nonce-bearing CSP) for all runtime responses, and **`next.config.ts`-level** (static headers) as a fallback for static assets and edge-cached responses. The combination achieves an A+ rating on [securityheaders.com](https://securityheaders.com). [nextjs](https://nextjs.org/docs/pages/guides/content-security-policy)

---

## Header Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Header Sources                        │
│                                                           │
│  next.config.ts headers()          middleware.ts          │
│  ─────────────────────────         ──────────────────     │
│  • Static fallback headers         • Dynamic CSP w/ nonce │
│  • Applied at build time           • Applied at runtime   │
│  • Cached with static assets       • Per-request nonce    │
│  • No nonce support                • Tenant-aware report  │
│                                      URI                  │
└───────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
    Edge Cache                          Dynamic Response
    (CDN layer)                         (SSR / RSC)
```

**Rule:** The middleware CSP **always wins** (applied last, overrides static config headers at the edge). The `next.config.ts` headers serve as defense-in-depth for paths that bypass middleware (e.g. `/_next/static/**`). [nextjs](https://nextjs.org/docs/app/guides/content-security-policy)

---

## Implementation

### `apps/portal/next.config.ts` — Static Security Headers

```typescript
import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // HSTS: 2 years, includeSubDomains, preload-eligible
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Referrer leakage prevention
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable dangerous browser features
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "https://js.stripe.com")',
      'usb=()',
      'bluetooth=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'midi=()',
      'fullscreen=(self)',
      'picture-in-picture=()',
    ].join(', '),
  },
  // Cross-origin isolation (enables SharedArrayBuffer)
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'credentialless',
  },
  // DNS prefetch control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Static assets: long-lived cache but still secure
        source: '/_next/static/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### `packages/security/src/csp-builder.ts` — Dynamic CSP Builder

```typescript
export interface CspConfig {
  nonce: string;
  tenantId: string | null;
  isDev: boolean;
  /** Additional allowed script origins for this tenant */
  extraScriptSrc?: string[];
  /** Additional allowed connect origins for this tenant */
  extraConnectSrc?: string[];
}

export interface CspDirectives {
  [directive: string]: string[];
}

/**
 * Builds a strict nonce-based CSP.
 * Architecture invariant: report-uri always includes tenantId.
 */
export function buildCsp(config: CspConfig): string {
  const { nonce, tenantId, isDev, extraScriptSrc = [], extraConnectSrc = [] } = config;

  const directives: CspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      // Clerk
      'https://clerk.accounts.dev',
      'https://*.clerk.accounts.dev',
      // Stripe
      'https://js.stripe.com',
      // Cal.com
      'https://cal.com',
      'https://*.cal.com',
      ...extraScriptSrc,
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'blob:',
      'data:',
      'https://*.supabase.co',
      'https://img.clerk.com',
      'https://res.cloudinary.com',
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      // Supabase
      'https://*.supabase.co',
      'wss://*.supabase.co',
      // Clerk
      'https://clerk.accounts.dev',
      'https://*.clerk.accounts.dev',
      // Stripe
      'https://api.stripe.com',
      // Sentry
      'https://o*.ingest.sentry.io',
      'https://o*.ingest.us.sentry.io',
      // Tinybird
      'https://api.tinybird.co',
      'https://*.tinybird.co',
      ...extraConnectSrc,
    ],
    'frame-src': [
      "'self'",
      'https://js.stripe.com',
      'https://hooks.stripe.com',
      'https://cal.com',
      'https://*.cal.com',
    ],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    'report-uri': [`/api/csp-report?tenantId=${encodeURIComponent(tenantId ?? 'unknown')}`],
  };

  return Object.entries(directives)
    .map(([key, values]) => (values.length > 0 ? `${key} ${values.join(' ')}` : key))
    .join('; ');
}
```

---

### `apps/portal/app/api/csp-report/route.ts` — CSP Violation Reporter

```typescript
import * as Sentry from '@sentry/nextjs';
import { type NextRequest, NextResponse } from 'next/server';

interface CspReport {
  'csp-report': {
    'document-uri': string;
    referrer: string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'status-code': number;
    'script-sample'?: string;
  };
}

export async function POST(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId') ?? 'unknown';

  try {
    const report = (await request.json()) as CspReport;
    const cspReport = report['csp-report'];

    // Filter noise: browser extension violations
    const blockedUri = cspReport['blocked-uri'];
    if (blockedUri.startsWith('chrome-extension://') || blockedUri === 'about') {
      return NextResponse.json({ ok: true });
    }

    Sentry.captureMessage('CSP Violation', {
      level: 'warning',
      tags: {
        tenantId,
        violatedDirective: cspReport['violated-directive'],
        blockedUri,
      },
      extra: { report: cspReport },
    });
  } catch {
    // Malformed report — ignore
  }

  return NextResponse.json({ ok: true });
}
```

---

## Header Reference Table

| Header                         | Value                                          | Purpose                        |
| ------------------------------ | ---------------------------------------------- | ------------------------------ |
| `Content-Security-Policy`      | Nonce-based (see builder)                      | XSS, data injection prevention |
| `Strict-Transport-Security`    | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years        |
| `X-Frame-Options`              | `DENY`                                         | Clickjacking prevention        |
| `X-Content-Type-Options`       | `nosniff`                                      | MIME sniffing prevention       |
| `Referrer-Policy`              | `strict-origin-when-cross-origin`              | Referrer leakage control       |
| `Permissions-Policy`           | (see above)                                    | Feature/API gating             |
| `Cross-Origin-Opener-Policy`   | `same-origin`                                  | Cross-origin isolation         |
| `Cross-Origin-Resource-Policy` | `cross-origin`                                 | CORP for CDN assets            |
| `Cross-Origin-Embedder-Policy` | `credentialless`                               | Enable `SharedArrayBuffer`     |
| `X-DNS-Prefetch-Control`       | `on`                                           | DNS performance (safe)         |

---

## Nonce Flow in Server Components

```typescript
// app/layout.tsx — Reading nonce for inline scripts
import { headers } from 'next/headers';
import Script from 'next/script';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const nonce = headerStore.get('x-nonce') ?? '';

  return (
    <html lang="en">
      <head>
        {/* Architecture invariant: third-party scripts use next/script afterInteractive */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="afterInteractive"
          nonce={nonce}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## References

- [Next.js CSP Documentation](https://nextjs.org/docs/app/guides/content-security-policy) [nextjs](https://nextjs.org/docs/app/guides/content-security-policy)
- [Next.js Headers Config](https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers) [nextjs](https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers)
- [Security Headers Guide (2025/2026)](https://github.com/VolkanSah/Security-Headers-Guide) [github](https://github.com/VolkanSah/Security-Headers-Guide)
- [Security Headers Best Practices](https://barrion.io/blog/security-headers-guide) [barrion](https://barrion.io/blog/security-headers-guide)

---

---

# `multi-layer-rate-limiting.md`

> **Internal Template — customize as needed.**

```
# multi-layer-rate-limiting.md
```

## Overview

The platform implements a three-layer rate limiting strategy using Upstash Ratelimit: **Edge** (global IP protection in middleware), **API** (per-route, per-tenant protection in Route Handlers), and **Action** (per-server-action, per-user protection via `createServerAction()`). Each layer uses a different algorithm tuned to its traffic profile. All rate limit keys include `tenantId` per platform invariant. [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

---

## Layer Architecture

```
                     Incoming Request
                            │
              ┌─────────────▼─────────────┐
              │   LAYER 1: EDGE (Global)   │  middleware.ts
              │   Algorithm: Sliding Window │  Key: ip
              │   Limit: 10 req/sec        │  Redis prefix: rl:global
              └─────────────┬─────────────┘
                            │ pass
              ┌─────────────▼─────────────┐
              │  LAYER 2: API (Per-Route)  │  Route Handler / tRPC
              │  Algorithm: Token Bucket   │  Key: tenantId:userId:route
              │  Limit: varies by plan     │  Redis prefix: rl:api
              └─────────────┬─────────────┘
                            │ pass
              ┌─────────────▼─────────────┐
              │  LAYER 3: ACTION          │  createServerAction()
              │  Algorithm: Sliding Window │  Key: tenantId:userId:action
              │  Limit: 20 req/min        │  Redis prefix: rl:action
              └─────────────┬─────────────┘
                            │ pass
                       Route Handler
```

---

## Layer 1: Edge Global Rate Limit

Applied in `middleware.ts` (see `security-middleware-implementation.md`). Uses **sliding window** — appropriate for smoothing bursty traffic. [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

```typescript
// packages/ratelimit/src/edge.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const edgeRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 s'),
  analytics: true,
  prefix: 'rl:global',
  ephemeralCache: new Map(), // In-process cache reduces Redis calls for blocked IPs
});
```

---

## Layer 2: API Route Rate Limit

Applied in Route Handlers using a `withRateLimit()` HOF. Uses **token bucket** — permits short bursts while enforcing sustained limits. [upstash](https://upstash.com/blog/dynamic-rate-limits)

```typescript
// packages/ratelimit/src/api.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export type PlanTier = 'free' | 'pro' | 'enterprise';

/**
 * Per-plan rate limit configurations.
 * Architecture invariant: key always includes tenantId.
 */
const PLAN_LIMITS: Record<PlanTier, { requests: number; window: string; burst: number }> = {
  free: { requests: 60, window: '1 m', burst: 10 },
  pro: { requests: 600, window: '1 m', burst: 50 },
  enterprise: { requests: 6000, window: '1 m', burst: 200 },
};

const ratelimitByPlan = Object.fromEntries(
  Object.entries(PLAN_LIMITS).map(([plan, config]) => [
    plan,
    new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(config.requests, config.window, config.burst),
      analytics: true,
      prefix: `rl:api:${plan}`,
      ephemeralCache: new Map(),
    }),
  ])
) as Record<PlanTier, Ratelimit>;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit an API request by tenantId + userId.
 * Falls back to 'free' tier if plan unknown.
 */
export async function checkApiRateLimit(params: {
  tenantId: string;
  userId: string;
  routeKey: string;
  plan?: PlanTier;
}): Promise<RateLimitResult> {
  const { tenantId, userId, routeKey, plan = 'free' } = params;
  // Architecture invariant: key includes tenantId
  const key = `${tenantId}:${userId}:${routeKey}`;
  return ratelimitByPlan[plan].limit(key);
}
```

### Usage in a Route Handler

```typescript
// app/api/leads/route.ts
import { auth } from '@clerk/nextjs/server';
import { checkApiRateLimit } from '@your-org/ratelimit/api';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const headerStore = await headers();
  const tenantId = headerStore.get('x-tenant-id');
  if (!tenantId) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

  const rl = await checkApiRateLimit({
    tenantId,
    userId,
    routeKey: 'GET:/api/leads',
    plan: 'pro', // Fetch from Stripe subscription in production
  });

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
          'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  // ... handle request
}
```

---

## Layer 3: Action Rate Limit

Built into `createServerAction()` (see `server-action-security-wrapper.md`). Sensitive actions get tighter limits:

```typescript
// Aggressive limits for auth-adjacent actions
export const requestPasswordResetAction = createServerAction({
  actionName: 'requestPasswordReset',
  schema: z.object({ email: z.string().email() }),
  allowUnauthenticated: true,
  rateLimit: { requests: 3, window: '15 m' }, // 3 per 15 minutes
  handler: async (input, ctx) => {
    /* ... */
  },
});

// Normal limits for data mutations
export const updateProfileAction = createServerAction({
  actionName: 'updateProfile',
  schema: updateProfileSchema,
  rateLimit: { requests: 30, window: '1 m' },
  handler: async (input, ctx) => {
    /* ... */
  },
});
```

---

## Dynamic Rate Limits (Upstash Jan 2026 Feature)

Upstash introduced `dynamicLimits` in January 2026, allowing runtime limit overrides without redeployment. This is useful for temporarily throttling a misbehaving tenant. [upstash](https://upstash.com/blog/dynamic-rate-limits)

```typescript
// packages/ratelimit/src/dynamic.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const dynamicRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'rl:dynamic',
  // enableDynamicLimits allows per-identifier overrides stored in Redis
  // See: https://upstash.com/blog/dynamic-rate-limits
});

/**
 * Throttle a specific tenant at runtime (e.g. from super-admin dashboard).
 * Architecture invariant: key includes tenantId.
 */
export async function throttleTenant(tenantId: string, requestsPerMin: number) {
  // Store dynamic limit override in Redis
  await redis.set(
    `rl:dynamic:override:${tenantId}`,
    JSON.stringify({ limit: requestsPerMin }),
    { ex: 3600 } // 1 hour override
  );
}
```

---

## Rate Limit Monitoring

```typescript
// packages/ratelimit/src/analytics.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Fetch rate limit analytics for a tenant (past 24h).
 * Used by super-admin dashboard.
 */
export async function getTenantRateLimitStats(tenantId: string) {
  const keys = await redis.keys(`rl:*:${tenantId}:*`);
  const stats = await Promise.all(
    keys.map(async (key) => ({
      key,
      count: (await redis.get<number>(key)) ?? 0,
    }))
  );
  return stats.sort((a, b) => b.count - a.count).slice(0, 20);
}
```

---

## Rate Limit Limit Reference

| Layer            | Algorithm      | Default Limit   | Key Pattern              | 429 Headers       |
| ---------------- | -------------- | --------------- | ------------------------ | ----------------- |
| Edge (global)    | Sliding Window | 10 req/s per IP | `ip`                     | `Retry-After`     |
| API (free)       | Token Bucket   | 60 req/min      | `tenantId:userId:route`  | `X-RateLimit-*`   |
| API (pro)        | Token Bucket   | 600 req/min     | `tenantId:userId:route`  | `X-RateLimit-*`   |
| API (enterprise) | Token Bucket   | 6000 req/min    | `tenantId:userId:route`  | `X-RateLimit-*`   |
| Action (default) | Sliding Window | 20 req/min      | `tenantId:userId:action` | none (JSON error) |
| Action (auth)    | Sliding Window | 3 per 15 min    | `tenantId:userId:action` | none (JSON error) |

---

## References

- [Upstash Ratelimit Overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Upstash Dynamic Rate Limits (Jan 2026)](https://upstash.com/blog/dynamic-rate-limits) [upstash](https://upstash.com/blog/dynamic-rate-limits)
- [Next.js Rate Limiting Patterns](https://github.com/vercel/next.js/discussions/79579) [github](https://github.com/vercel/next.js/discussions/79579)

---

---

# `secrets-manager.md`

> **Internal Template — customize as needed.**

```
# secrets-manager.md
```

## Overview

This document specifies the platform's secret management strategy: environment variable validation with Zod at startup, a secrets rotation protocol, and the Doppler → Vercel env sync pipeline. Every secret is validated at boot time — the application fails fast rather than running with undefined credentials. The strategy supports both Vercel's native environment variable system and Doppler for teams requiring centralized rotation and audit trails. [doppler](https://www.doppler.com/blog/dynamic-secrets-in-action)

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Secret Lifecycle                         │
│                                                          │
│  Doppler (source of truth)                               │
│       │                                                  │
│       ├─── Doppler CLI sync ──► Vercel Env Vars          │
│       │                              │                   │
│       ├─── GitHub Actions ◄──────────┘                   │
│       │    (DOPPLER_TOKEN secret)                        │
│       │                                                  │
│       └─── Auto-rotation ──► Webhook ──► Vercel rotate   │
│            (30-day schedule)              API             │
│                                                          │
│  Environment Hierarchy:                                  │
│  doppler/production ──► vercel/production                │
│  doppler/staging    ──► vercel/preview                   │
│  doppler/dev        ──► .env.local (gitignored)          │
└──────────────────────────────────────────────────────────┘
```

---

## Zod Environment Validation

### `packages/env/src/server.ts`

```typescript
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Server-side environment schema.
 * Application will throw at startup if any required variable is missing or invalid.
 * Never import this in client-side code.
 */
export const serverEnv = createEnv({
  server: {
    // ── Node ──────────────────────────────────────────────────────────
    NODE_ENV: z.enum(['development', 'test', 'production']),

    // ── Database ──────────────────────────────────────────────────────
    DATABASE_URL: z
      .string()
      .url()
      .refine((url) => url.startsWith('postgresql://'), 'Must be a PostgreSQL URL'),
    DATABASE_POOL_URL: z
      .string()
      .url()
      .refine((url) => url.includes('supavisor') || url.includes('pooler'), {
        message: 'Pool URL must use Supavisor',
      }),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(100),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(100),

    // ── Auth ──────────────────────────────────────────────────────────
    CLERK_SECRET_KEY: z.string().startsWith('sk_'),
    CLERK_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

    // ── Payments ──────────────────────────────────────────────────────
    STRIPE_SECRET_KEY: z
      .string()
      .startsWith('sk_')
      .refine(
        (key) =>
          process.env.NODE_ENV === 'production'
            ? key.startsWith('sk_live_')
            : key.startsWith('sk_test_'),
        { message: 'Wrong Stripe key for environment' }
      ),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
    STRIPE_PRICE_ID_PRO_MONTHLY: z.string().startsWith('price_'),
    STRIPE_PRICE_ID_PRO_ANNUAL: z.string().startsWith('price_'),
    STRIPE_PRICE_ID_ENTERPRISE_MONTHLY: z.string().startsWith('price_'),

    // ── Email ─────────────────────────────────────────────────────────
    RESEND_API_KEY: z.string().startsWith('re_'),
    POSTMARK_SERVER_TOKEN: z.string().min(20),

    // ── Upstash ───────────────────────────────────────────────────────
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(20),
    QSTASH_TOKEN: z.string().min(20),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(20),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(20),

    // ── CMS ───────────────────────────────────────────────────────────
    SANITY_API_TOKEN: z.string().min(20),
    SANITY_WEBHOOK_SECRET: z.string().min(20),

    // ── Analytics ─────────────────────────────────────────────────────
    TINYBIRD_API_KEY: z.string().min(20),

    // ── Observability ─────────────────────────────────────────────────
    SENTRY_AUTH_TOKEN: z.string().min(20),
    SENTRY_DSN: z.string().url(),

    // ── Cal.com ───────────────────────────────────────────────────────
    CALCOM_API_KEY: z.string().min(20),
    CALCOM_WEBHOOK_SECRET: z.string().min(20),

    // ── Vercel ────────────────────────────────────────────────────────
    VERCEL_TOKEN: z.string().min(20).optional(),

    // ── PQC ───────────────────────────────────────────────────────────
    PQC_PRIVATE_KEY_HEX: z.string().length(64).optional(), // ML-KEM-768 private key hex
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_POOL_URL: process.env.DATABASE_POOL_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_PRO_MONTHLY: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    STRIPE_PRICE_ID_PRO_ANNUAL: process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
    STRIPE_PRICE_ID_ENTERPRISE_MONTHLY: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    TINYBIRD_API_KEY: process.env.TINYBIRD_API_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    CALCOM_API_KEY: process.env.CALCOM_API_KEY,
    CALCOM_WEBHOOK_SECRET: process.env.CALCOM_WEBHOOK_SECRET,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    PQC_PRIVATE_KEY_HEX: process.env.PQC_PRIVATE_KEY_HEX,
  },

  // Skip validation in Jest (vars are mocked)
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',

  // Throw on access of unknown env var (prevents accidental process.env usage)
  emptyStringAsUndefined: true,
});
```

### `packages/env/src/client.ts`

```typescript
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/** Client-safe environment variables (prefixed NEXT_PUBLIC_). */
export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(3),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(100),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
    NEXT_PUBLIC_CALCOM_EMBED_URL: z.string().url().optional(),
    NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN: z.string().min(20).optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_CALCOM_EMBED_URL: process.env.NEXT_PUBLIC_CALCOM_EMBED_URL,
    NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN: process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN,
  },
});
```

---

## Secret Rotation Protocol

### Rotation Triggers

| Trigger              | Cadence              | Method                   |
| -------------------- | -------------------- | ------------------------ |
| Scheduled            | 30-day auto-rotation | Doppler → Vercel webhook |
| Security audit       | On-demand            | Manual Doppler rotation  |
| Compromise detected  | Immediate            | Break-glass runbook      |
| Employee offboarding | Within 1 hour        | Doppler team key revoke  |

### Vercel Secrets Rotation API

Vercel supports synchronous and asynchronous rotation callbacks as of January 2025. [vercel](https://vercel.com/docs/integrations/create-integration/secrets-rotation)

```typescript
// apps/super-admin/app/api/rotate-secrets/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@your-org/env/server';

interface RotationRequest {
  projectId: string;
  secretName: string;
  reason?: string;
  delayOldSecretsExpirationHours?: number;
}

/**
 * Vercel calls this endpoint during secret rotation.
 * Returns new secret values synchronously.
 * Architecture invariant: protected by Vercel webhook signature.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-vercel-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as RotationRequest;

  // Log rotation event to Sentry for audit trail
  const { captureMessage } = await import('@sentry/nextjs');
  captureMessage(`Secret rotation triggered: ${body.secretName}`, {
    level: 'info',
    tags: { rotation: 'true', secretName: body.secretName },
  });

  // Synchronous rotation response
  return NextResponse.json({
    sync: true,
    secrets: [
      {
        name: body.secretName,
        value: await generateNewSecret(body.secretName),
      },
    ],
  });
}

async function generateNewSecret(secretName: string): Promise<string> {
  // In practice, call the relevant provider API (Stripe, Resend, etc.)
  // to generate a new key, then return it.
  // This is a stub — implement per-provider rotation logic.
  throw new Error(`Rotation for ${secretName} not yet implemented`);
}
```

---

## Doppler → Vercel Sync (CI/CD)

### `.github/workflows/sync-secrets.yml`

```yaml
name: Sync Secrets to Vercel

on:
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * 1' # Every Monday at 2am UTC

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v3

      - name: Sync production secrets to Vercel
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          doppler secrets download \
            --project your-saas \
            --config production \
            --format env \
            --no-file | while IFS='=' read -r key value; do
              vercel env add "$key" production <<< "$value" --token="$VERCEL_TOKEN" || true
            done
```

---

## Break-Glass Secret Rotation Runbook

When a secret compromise is detected: [doppler](https://www.doppler.com/blog/lifecycle-secrets-security-posture)

```
1. CONTAIN
   ├── Immediately revoke the compromised key at source (Stripe/Resend/etc.)
   ├── Identify exposure window from audit log
   └── Block suspicious IP addresses via Upstash deny list

2. ROTATE
   ├── Generate new secret at provider dashboard
   ├── Update Doppler: doppler secrets set KEY_NAME=<new_value>
   ├── Trigger Doppler → Vercel sync
   └── Verify deployment picks up new secret (check Vercel deploy logs)

3. VALIDATE
   ├── Run: pnpm exec ts-node packages/env/scripts/validate.ts
   ├── Smoke test critical paths (auth, payments, email)
   └── Monitor Sentry for auth errors for 30 minutes

4. DOCUMENT
   ├── Create incident report in Linear
   ├── Update secret rotation log in Notion
   └── Schedule post-mortem within 48 hours
```

---

## CI Validation

```typescript
// packages/env/scripts/validate.ts
import { serverEnv } from '../src/server';
import { clientEnv } from '../src/client';

// This script is run in CI to validate all required env vars are present.
// It fails the build if any are missing.
console.log('✅ Server env validated:', Object.keys(serverEnv).length, 'variables');
console.log('✅ Client env validated:', Object.keys(clientEnv).length, 'variables');
process.exit(0);
```

```yaml
# In github-actions-workflow-complete.yml — add this step to the validate job:
- name: Validate environment variables
  run: pnpm --filter @your-org/env exec ts-node scripts/validate.ts
  env:
    SKIP_ENV_VALIDATION: 'false'
    # All required secrets injected from GitHub Secrets
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    # ... etc
```

---

## References

- [Vercel Secrets Rotation](https://vercel.com/docs/integrations/create-integration/secrets-rotation) [vercel](https://vercel.com/docs/integrations/create-integration/secrets-rotation)
- [Rotating Vercel Environment Variables](https://vercel.com/docs/environment-variables/rotating-secrets) [vercel](https://vercel.com/docs/environment-variables/rotating-secrets)
- [Doppler Dynamic Secrets & Rotation](https://www.doppler.com/blog/dynamic-secrets-in-action) [doppler](https://www.doppler.com/blog/dynamic-secrets-in-action)
- [Secret Lifecycle and Security Posture](https://www.doppler.com/blog/lifecycle-secrets-security-posture) [doppler](https://www.doppler.com/blog/lifecycle-secrets-security-posture)
- [@t3-oss/env-nextjs](https://env.t3.gg/)

---

---

**All 5 Batch B documents are complete.** Here's a summary of what was generated:

| Document                                | Key Patterns Covered                                                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `security-middleware-implementation.md` | 8-layer pipeline, CVE-2025-29927 hardening, bot detection, dual rate limiting, Clerk auth gate, nonce injection, tenant resolution                   |
| `server-action-security-wrapper.md`     | `createServerAction()` factory, auth + tenant scoping + Zod + rate limit, `ActionResult<T>` type, React 19 `useActionState` integration              |
| `security-headers-system.md`            | Dynamic nonce CSP builder, `next.config.ts` static headers, all 9 security headers, CSP violation reporter endpoint, nonce flow in Server Components |
| `multi-layer-rate-limiting.md`          | 3-layer strategy, Sliding Window / Token Bucket algorithms, per-plan limits (free/pro/enterprise), Upstash Jan 2026 dynamic limits feature           |
| `secrets-manager.md`                    | `@t3-oss/env-nextjs` Zod validation, Doppler→Vercel sync workflow, rotation API, break-glass runbook, CI validation script                           |


## Best Practices

[Add content here]


## Testing

[Add content here]
