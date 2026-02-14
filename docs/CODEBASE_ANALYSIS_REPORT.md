# Comprehensive Codebase Analysis Report

**Project:** Multi-Industry Marketing Website Template System (hair-salon monorepo)  
**Analysis Date:** 2026-02-13  
**Scope:** Full repository (templates, packages, docs, CI/CD)

---

## Executive Summary

### Project Overview and Purpose

This repository is a **monorepo** for a multi-industry marketing website template system. It provides:

- **Industry templates** (e.g. `hair-salon`, `plumber`) as Next.js 15 apps
- **Shared packages** for UI (`@repo/ui`), utilities (`@repo/utils`), infrastructure (`@repo/infra`), and integrations (e.g. `@repo/integrations-supabase`)
- **Client projects** intended to be copied from templates and deployed independently

The stack is **Next.js 15.2.9**, **React 19**, **TypeScript 5.7** (strict), **Tailwind CSS**, with **Supabase**, **Sentry**, and **Upstash** for leads, errors, and rate limiting. The architecture is **template-based with shared packages** and clear separation of security/middleware into `@repo/infra`.

### Overall Health Score: **5 / 10**

**Justification:**

- **Strengths:** Strong security foundations (CSP, security headers, request validation, rate limiting, sanitization), good documentation and TODO-driven roadmap, infra extraction largely done, composable env validation, CSRF and CVE mitigations in place, well-structured Renovate configuration, clean monorepo architecture with Turborepo.
- **Weaknesses:** CI is **blocked** (type-check failure + high-severity audit finding). Docker deployment is **broken** (missing `output: 'standalone'`). 7 known vulnerabilities (Sentry 2+ majors behind, 4 Next.js CVEs). Booking flow has **critical security gaps** (raw IP, weak hashing, no CSRF, PII logging). Sentry is **half-implemented** (helpers/sanitization exist but config files missing). Rate limiting is **per-instance only** despite Upstash being configured. ~73% code duplication between templates (~6,500+ lines). Test coverage excludes plumber and has gaps; Jest config is hardcoded to hair-salon.

### Top 5 Critical Issues Requiring Immediate Attention

1. **Type-check failure in `@templates/hair-salon`** — Test files (`blog.test.ts`, `search.test.ts`) have redeclared block-scoped variables and implicit `any` types, causing `tsc --noEmit` to fail and blocking CI.
2. **Booking flow IP and hashing inconsistency** — Booking actions use raw `x-forwarded-for`/`x-real-ip` and `btoa` for hashing instead of `getValidatedClientIp` and SHA-256 (contact form does it correctly). This weakens rate limiting and auditability.
3. **ESLint configuration for `packages/ui` and `packages/utils`** — Both run `eslint src` but have no `eslint.config.*` and do not depend on `@repo/eslint-config`. Lint can be ineffective or fail depending on environment; README explicitly calls this out as broken.
4. **Booking storage is in-memory** — `internalBookings = new Map()` in both templates means bookings are lost on restart and not suitable for production; no persistence or integration with a real booking backend yet.
5. **Duplicate code between templates** — Large amounts of identical or near-identical code in `hair-salon` and `plumber` (e.g. `booking-actions.ts`, `booking-providers.ts`, `lib/actions/*`, features). Increases maintenance cost and risk of inconsistent fixes (e.g. security applied in one template only).

### Top 5 High-Impact Improvement Opportunities

1. **Complete Phase 1.3–1.7** — Migrate templates to use `@repo/integrations-supabase` (and future HubSpot, booking-providers, analytics packages) and remove duplicated feature code from templates.
2. **Add `eslint.config.mjs` to `packages/ui` and `packages/utils`** that extend `@repo/eslint-config/library` so `pnpm lint` is consistent and passes everywhere.
3. **Align booking security with contact form** — Use `getValidatedClientIp` and the same hashing/CSRF patterns in booking actions; consider shared action helpers.
4. **Fix test TypeScript and coverage** — Resolve redeclaration/implicit-any in tests (e.g. use unique names or test-specific tsconfig); add plumber and infra to coverage; consider e2e for critical flows.
5. **Introduce persistent booking backend or integration** — Replace in-memory Map with Supabase (or existing booking provider) so bookings survive restarts and scale.

---

## Phase 1: Project Understanding & Architecture (Deep Dive)

### 1.1 Project Context Discovery

#### 1.1.1 Project Type and Role

| Aspect | Finding |
|--------|--------|
| **Project type** | **Monorepo** — multiple deployable units (templates as Next.js apps) plus shared libraries. Not a single web app; a **template system** for generating and maintaining client marketing sites. |
| **Deployable units** | Each of `templates/hair-salon` and `templates/plumber` is a standalone Next.js application. Future clients live under `clients/[name]` (copy of a template). |
| **Primary deliverable** | Ready-to-use, industry-specific marketing websites with booking, contact, blog, SEO, and optional CRM/analytics. |

#### 1.1.2 Primary Languages and Runtimes

| Language / Runtime | Version / Notes |
|--------------------|-----------------|
| **TypeScript** | 5.7.2 (root and templates); strict mode via `tsconfig.base.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`. |
| **JavaScript** | Used only for config: `next.config.js`, `jest.config.js`, `turbo.json`, ESLint configs (`.mjs`/`.js`). |
| **Node.js** | **>=24.0.0** (enforced in root `package.json` `engines.node`). |
| **Package manager** | **pnpm 10.29.2** (strict via `packageManager` in root `package.json`). |

#### 1.1.3 Frameworks and UI Stack

| Layer | Technology | Version | Where |
|-------|------------|---------|--------|
| **Framework** | Next.js | 15.2.9 | Both templates |
| **UI library** | React | 19.0.0 | Both templates |
| **Styling** | Tailwind CSS | 3.4.17 | Both templates |
| **App Router** | Next.js App Router | Yes | `app/` in each template (no Pages Router usage). |

Next.js config (`templates/*/next.config.js`) transpiles only `@repo/ui` and `@repo/utils`; `@repo/infra` and `@repo/shared` are consumed as source (no pre-build step).

#### 1.1.4 Dependency Inventory (Exhaustive)

**Root `package.json` (workspace orchestrator)**

- **Workspaces:** `packages/*`, `packages/config/*`, `templates/*`, `clients/*` (see `pnpm-workspace.yaml`: same four globs).
- **Scripts:** `dev`, `build`, `lint`, `type-check`, `test`, `test:watch`, `test:coverage`, `verify:phase1`, `format`, `format:check`. Tests run via root Jest (`jest --maxWorkers=50%`), not per-package.
- **Root dependencies:** `server-only` (runtime). **Root devDependencies:** `turbo@2.2.3`, `typescript@5.7.2`, `prettier@3.2.5`, `jest@^30.2.0`, `ts-jest@^29.4.6`, `jest-environment-jsdom@^30.2.0`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `@types/jest`, `@typescript-eslint/eslint-plugin@8.19.1`, `@typescript-eslint/parser@8.19.1`.

**Templates (hair-salon and plumber — dependency set is identical except dev port)**

- **Shared packages:** `@repo/infra`, `@repo/ui`, `@repo/utils`, `@repo/shared` (all `workspace:*`).
- **Runtime:** `next@15.2.9`, `react@19.0.0`, `react-dom@19.0.0`, `zod@3.22.4`, `@sentry/nextjs@8.0.0`, `@upstash/ratelimit@2.0.5`, `@upstash/redis@1.34.3`, `react-hook-form@7.55.0`, `@hookform/resolvers@3.9.1`, `date-fns@^4.1.0`, `clsx@2.1.1`, `tailwind-merge@2.6.1`, `lucide-react@0.344.0`, `sonner@^2.0.7`, `next-mdx-remote@5.0.0`, `gray-matter@4.0.3`, `reading-time@1.5.0`, `remark-gfm@4.0.0`, `rehype-slug@6.0.0`, `rehype-pretty-code@0.14.1`.
- **Dev:** `@repo/eslint-config`, `eslint@9.18.0`, `eslint-config-next@15.2.9`, `@eslint/eslintrc@3.2.0`, `typescript@5.7.2`, `@types/node@20.17.9`, `@types/react@19.0.2`, `@types/react-dom@19.0.2`, `autoprefixer@10.4.20`, `postcss@8.4.49`, `tailwindcss@3.4.17`.
- **Ports:** hair-salon `3100`, plumber `3101`.

**@repo/shared** (`templates/shared`)

- **Exports:** `./types` → `types/index.ts`, `./site-config` → `types/site-config.ts`. Types only (SiteConfig, ConversionFlowConfig, NavLink, etc.); no runtime deps.

**@repo/infra** (`packages/infra`)

- **Exports:** `.` (main server barrel), `./client` (client-safe barrel), `./context/request-context`, `./context/request-context.server`.
- **Dependencies:** `@repo/utils`, `server-only`.
- **Peer:** `next@^15.2.3`, `@sentry/nextjs@>=8.0.0`.
- **Dev:** `@types/node`, `@upstash/ratelimit`, `@upstash/redis`, `@sentry/nextjs`, `eslint`, `typescript`, `zod`.

**@repo/integrations-supabase** (`packages/integrations/supabase`)

- **Exports:** `.`, `./client`, `./types`. **Dependencies:** `@repo/infra`, `@repo/utils`, `server-only`. **Peer:** `next@^15.2.3`. **Dev:** `@types/node`, `eslint`, `typescript`, `zod`. **Note:** Templates do not yet depend on this package; they still use in-template `features/supabase` and `lib/actions/supabase.ts` (TODO 1.3.4).

**@repo/ui** (`packages/ui`)

- **Exports:** `.` → `src/index.ts`. **Dependencies:** `@repo/utils`. **Peer:** `react@^19.0.0`, `react-dom@^19.0.0`. **Dev:** `@types/react`, `@types/react-dom`, `eslint`, `typescript`. **No** `@repo/eslint-config`; no `eslint.config.*` in package.

**@repo/utils** (`packages/utils`)

- **Exports:** `.` → `src/index.ts`. **Dependencies:** `clsx@2.1.1`, `tailwind-merge@2.6.1`. **Dev:** `eslint`, `typescript`. **No** `@repo/eslint-config`; no `eslint.config.*` in package.

**@repo/config** (`packages/config`)

- **Meta-package:** `workspaces: ["eslint-config", "typescript-config"]`; no direct code. Scripts: `format`, `format:check`.

**@repo/eslint-config** (`packages/config/eslint-config`)

- **Exports:** `.` → `library.js`, `./next` → `next.js`. **Dev:** `@eslint/eslintrc`, `@eslint/js`, `eslint`. Used by templates via `eslint.config.mjs` importing `@repo/eslint-config/next`; **not** used by `packages/ui` or `packages/utils` (no config file there).

**@repo/typescript-config** (`packages/config/typescript-config`)

- **Files:** `base.json`, `react.json`, `node.json`. **Peer:** `typescript>=5.7.2`. Templates extend root `tsconfig.base.json` (which matches this strict base); this package is available for explicit `extends` if desired.

#### 1.1.5 README, Documentation, and Configuration

| Document / Config | Purpose |
|------------------|---------|
| **README.md** | Project overview, quick start (template vs client), project structure, tech stack, docs index, Docker, contributing. Notes **broken** lint for packages/ui and packages/utils. |
| **CONTRIBUTING.md** | Setup, tooling versions, code standards, PR process. |
| **SECURITY.md** | Supported versions, private vulnerability reporting, disclosure. |
| **docs/INDEX.md** | Repository index: templates (hair-salon active; nail-salon, restaurant, etc. planned), clients (example-client referenced but **not present** in repo — only `clients/README.md` exists), packages, docs, configuration. |
| **docs/architecture/TEMPLATE_ARCHITECTURE.md** | Layers (Core Packages → Shared Template → Industry Templates → Clients), data flow (dev → template → shared → client → production), template/client structure, what belongs in shared vs template vs client. |
| **docs/architecture/README.md** | Additional architecture details. |
| **docs/CONFIG.md** | Configuration overview (pnpm, Node, TypeScript, ESLint, Prettier, Turbo, Next.js, React, Tailwind). |
| **docs/clients/README.md** | How to create a client (copy template, update package.json, env, branding, content); references `clients/example-client/` which **does not exist**. |
| **docs/templates/README.md**, **docs/templates/hair-salon.md** | Template usage and hair-salon specifics. |
| **docs/TESTING_STATUS.md** | Verification log for lint, type-check, build; historical status. |
| **docs/SECURITY_MONITORING_STATUS.md** | Security scanning, SBOM, secret scan, vulnerability remediation. |
| **docs/archive/** | Moved legacy: ARCHITECTURE.md, ARCHIVE.md, CODEBASE_ANALYSIS.md, etc. |
| **.env.example** (root and both templates) | NEXT_PUBLIC_SITE_URL, NODE_ENV; optional Supabase, HubSpot, Upstash, NEXT_PUBLIC_ANALYTICS_ID. |
| **turbo.json** | Tasks: `build` (depends on `^build`, outputs `.next/**`, `dist/**`), `dev` (no cache, persistent), `lint` (depends on `^lint`), `type-check` (depends on `^type-check`), `test` (depends on `^build`, outputs `coverage/**`), `format`/`format:check` (no cache). |
| **pnpm-workspace.yaml** | `packages: packages/*, packages/config/*, templates/*, clients/*`. |
| **tsconfig.json** (root) | Extends `tsconfig.base.json`, composite, empty include (orchestration only). |
| **tsconfig.base.json** | Strict compiler options; shared by all. |
| **templates/*/tsconfig.json** | Extend `../../tsconfig.base.json`, path aliases: `@/*` → template root, `@repo/ui`, `@repo/utils`, `@repo/infra`, `@repo/infra/*`, `@repo/shared/*`. |

**Gaps:** No `apps/` directory (README mentions it as optional). No `scripts/` or `infrastructure/` directories. `clients/` contains only `README.md` — no `example-client` or other client projects.

#### 1.1.6 Primary Features Mapped to Code

| Feature | Entry (route / UI) | Server / integration | Key files |
|---------|--------------------|----------------------|-----------|
| **Home** | `/` | — | `app/page.tsx`, Hero, ValueProps, ServicesOverview, SocialProof, FinalCTA |
| **Services** | `/services`, `/services/haircuts`, `/services/coloring`, `/services/treatments`, `/services/special-occasions` | — | `app/services/page.tsx`, `app/services/*/page.tsx`, `features/services/` |
| **Pricing** | `/pricing` | — | `app/pricing/page.tsx` |
| **Gallery** | `/gallery` | — | `app/gallery/page.tsx` |
| **Team** | `/team` | — | `app/team/page.tsx` |
| **About** | `/about` | — | `app/about/page.tsx` |
| **Contact** | `/contact` | ContactForm → submitContactForm | `app/contact/page.tsx`, `features/contact/`, `lib/actions/submit.ts` (rate limit, CSRF, sanitize, Supabase, HubSpot) |
| **Booking** | `/book` | BookingForm → submitBookingRequest | `app/book/page.tsx`, `features/booking/`, `lib/booking-actions.ts` (in-memory store, rate limit, no Supabase yet) |
| **Blog** | `/blog`, `/blog/[slug]` | MDX from content | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `features/blog/` |
| **Search** | `/search` (and nav) | getSearchIndex (server) | `app/search/page.tsx`, `lib/search.ts`, `features/search/` |
| **SEO / metadata** | All pages | layout metadata, sitemap, robots | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` |
| **OG image** | `/api/og` | Route handler | `app/api/og/route.tsx` |
| **Analytics / consent** | Layout | Consent banner, optional GA | `components/AnalyticsConsentBanner.tsx`, `features/analytics/` |
| **Security (global)** | Every request | Middleware | `middleware.ts` → `createMiddleware` (CSP, headers, CVE strip, optional CSRF) |

---

### 1.2 Architecture Analysis

#### 1.2.1 High-Level Architectural Diagram

```
                                    ┌─────────────────────────────────────────────────────────┐
                                    │  Root: pnpm workspaces, Turbo, Jest, Prettier             │
                                    │  Scripts: lint, type-check, build, test, format           │
                                    └───────────────────────────┬─────────────────────────────┘
                                                                │
         ┌──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┐
         │                                                      │                                                      │
         ▼                                                      ▼                                                      ▼
┌─────────────────────┐                          ┌─────────────────────────────┐                          ┌─────────────────────┐
│  templates/         │                          │  packages/                  │                          │  clients/           │
│  hair-salon (3100)  │◄───depends on──────────►│  infra, ui, utils,         │                          │  (empty: only       │
│  plumber (3101)     │     @repo/*              │  config/*,                  │                          │   README.md;        │
│  shared/ (types)    │                          │  integrations/supabase     │                          │   example-client    │
└──────────┬──────────┘                          └─────────────┬─────────────┘                          │   not present)     │
           │                                                     │                                          └─────────────────────┘
           │  Each template:                                     │  infra: security, middleware, logger,
           │  app/, components/, features/, lib/,                 │  sentry, env; utils: cn(); ui: primitives;
           │  middleware.ts, site.config.ts                        │  config: eslint, tsconfig; integrations:
           │                                                      │  supabase (not yet used by templates)
           ▼                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Request path:                                                                                                                 │
│  HTTP → Next.js → middleware (createMiddleware: strip x-middleware-subrequest, CSP nonce, security headers, optional CSRF)    │
│  → App Router (layout.tsx: nonce, search index, Navigation, Footer, Providers, AnalyticsConsentBanner)                        │
│  → Page (e.g. contact, book) → Server Action (submitContactForm / submitBookingRequest)                                     │
│  → Validation (Zod) + rate limit (@repo/infra) + sanitize + CSRF (contact only) → Supabase/HubSpot or in-memory (booking)     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1.2.2 Architectural Patterns

| Pattern | Where | Notes |
|---------|--------|--------|
| **Layered / N-tier** | Templates depend on packages; no package depends on a template. Clear layers: infra → integrations; ui → utils; templates consume all. |
| **Factory** | `createMiddleware(options)` in `@repo/infra` returns a Next.js middleware function; templates call it and export `config.matcher` themselves. |
| **Composable configuration** | Env: `@repo/infra/env` schemas (base, rate-limit, supabase, hubspot, booking, sentry, public) composed via `validateEnv()`; templates use single `validatedEnv` from `lib/env.ts`. |
| **Feature-based modules** | Under `features/`: booking, blog, contact, services, search, analytics, hubspot, supabase. Each has components, lib, and sometimes index. |
| **Server Actions** | All form submissions go through `'use server'` functions (submit.ts, booking-actions.ts); no dedicated API route layer for these flows. |
| **Shared kernel** | `@repo/shared` defines types (SiteConfig, conversion flows); templates implement `site.config.ts` per industry. |

#### 1.2.3 Directory Structure (Complete)

```
repository root
├── .env.example
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint, type-check, build, test, SBOM, pnpm audit
│   │   ├── sbom-generation.yml
│   │   └── secret-scan.yml
├── package.json                # Workspace root; engines node>=24, packageManager pnpm@10.29.2
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json               # Extends tsconfig.base.json, composite
├── tsconfig.base.json          # Strict TS options shared by all
├── jest.config.js              # Root Jest; moduleNameMapper for @repo/* and @/
├── jest.setup.js
├── docker-compose.yml         # Builds templates/hair-salon, port 3100
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── TODO.md                     # Phased task list (Phase 1 extraction, integrations, features)
│
├── templates/
│   ├── hair-salon/             # @templates/hair-salon, port 3100
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout; CSP nonce, metadata, Navigation, Footer, Providers, AnalyticsConsentBanner
│   │   │   ├── page.tsx        # Home
│   │   │   ├── loading.tsx, not-found.tsx, providers.tsx
│   │   │   ├── about/, book/, contact/, gallery/, pricing/, team/, search/
│   │   │   ├── blog/, blog/[slug]/
│   │   │   ├── services/, services/haircuts|coloring|treatments|special-occasions/
│   │   │   ├── privacy/, terms/
│   │   │   ├── sitemap.ts, robots.ts
│   │   │   └── api/og/route.tsx
│   │   ├── components/         # Navigation, Footer, Hero, ValueProps, SocialProof, FinalCTA, SkipToContent, InstallPrompt, Breadcrumbs, ErrorBoundary, AnalyticsConsentBanner
│   │   ├── features/           # booking, blog, contact, services, search, analytics, hubspot, supabase
│   │   ├── lib/                # env.ts, env.public.ts, search.ts, actions/, constants.ts, utils.ts
│   │   ├── content/            # Blog MDX content
│   │   ├── public/
│   │   ├── site.config.ts      # SiteConfig from @repo/shared/types
│   │   ├── middleware.ts       # createMiddleware({})
│   │   ├── next.config.js, tsconfig.json, tailwind.config.ts, postcss.config.mjs
│   │   ├── eslint.config.mjs   # Extends @repo/eslint-config/next
│   │   └── .env.example
│   │
│   ├── plumber/                # @templates/plumber, port 3101 — same structure as hair-salon
│   │   └── (mirror of hair-salon app/, components/, features/, lib/, etc.)
│   │
│   └── shared/                 # @repo/shared
│       ├── types/
│       │   ├── site-config.ts  # SiteConfig, ConversionFlowConfig, NavLink, etc.
│       │   └── index.ts
│       ├── package.json, tsconfig.json, README.md
│       └── (no app/ or components — types only)
│
├── packages/
│   ├── ui/                     # @repo/ui
│   │   ├── src/
│   │   │   ├── index.ts        # Barrel: Container, Section, Button, Card, Input, Select, Textarea, Accordion
│   │   │   ├── components/
│   │   │   └── cn.ts (via utils)
│   │   └── package.json        # lint: eslint src — no eslint.config.*
│   │
│   ├── utils/                  # @repo/utils
│   │   ├── src/
│   │   │   ├── index.ts        # export { cn } from './cn'
│   │   │   └── cn.ts
│   │   └── package.json        # lint: eslint src — no eslint.config.*
│   │
│   ├── infra/                  # @repo/infra
│   │   ├── index.ts            # Server barrel: csp, security-headers, sanitize, rate-limit, request-validation, createMiddleware, request-context, logger, sentry
│   │   ├── index.client.ts     # Client barrel: sentry client, logger client
│   │   ├── security/           # csp.ts, security-headers.ts, sanitize.ts, rate-limit.ts, request-validation.ts
│   │   ├── middleware/         # create-middleware.ts
│   │   ├── logger/, context/, sentry/
│   │   ├── env/                # validate.ts, types.ts, schemas/* (base, rate-limit, supabase, hubspot, booking, sentry, public)
│   │   ├── __tests__/
│   │   └── package.json
│   │
│   ├── integrations/
│   │   └── supabase/           # @repo/integrations-supabase
│   │       ├── index.ts, client.ts, leads.ts, types.ts
│   │       └── package.json    # Not yet consumed by templates (TODO 1.3.4)
│   │
│   └── config/
│       ├── package.json        # Meta; workspaces: eslint-config, typescript-config
│       ├── eslint-config/      # @repo/eslint-config — library.js, next.js
│       │   └── package.json
│       └── typescript-config/  # @repo/typescript-config — base.json, react.json, node.json
│           └── package.json
│
├── clients/
│   └── README.md               # How to create client; example-client referenced but not present
│
└── docs/
    ├── INDEX.md
    ├── CONFIG.md, TESTING_STATUS.md, SECURITY_MONITORING_STATUS.md
    ├── MIGRATION_GUIDE.md, VERSION_POLICY.md, ANALYTICS_CONSENT_FLOW.md
    ├── architecture/           # TEMPLATE_ARCHITECTURE.md, README.md
    ├── templates/, clients/, api/, archive/
    └── (no apps/, scripts/, infrastructure/ in repo)
```

#### 1.2.4 Data Flow (End-to-End)

**1. Incoming HTTP request**

- Next.js receives the request. **Entry:** Next.js runtime.

**2. Middleware** (`templates/*/middleware.ts` → `packages/infra/middleware/create-middleware.ts`)

- **File:** `templates/hair-salon/middleware.ts` (same for plumber).
- **Steps:** Strip `x-middleware-subrequest` (CVE-2025-29927); optionally validate Origin against `allowedOrigins`; generate CSP nonce via `createCspNonce()`; build CSP with `buildContentSecurityPolicy()`; set `CSP_NONCE_HEADER` on request headers; set `Content-Security-Policy` and security headers (X-Content-Type-Options, X-Frame-Options, etc.) on response; `NextResponse.next({ request: { headers } })`.
- **Output:** Every request gets a nonce and security headers; request headers (with nonce) propagate to the app.

**3. Root layout** (`templates/hair-salon/app/layout.tsx`)

- **Server component.** Reads `headers()` for CSP nonce (fallback if missing). Calls `getSearchIndex()` from `lib/search.ts` (builds search index from blog/content). Imports `siteConfig` from `site.config.ts` (typed by `@repo/shared`). Renders Navigation (with searchItems), Footer, Providers, main (children), InstallPrompt, AnalyticsConsentBanner. Injects nonce into inline scripts (JSON-LD, consent).
- **Data:** Search index and public env (e.g. analytics ID) drive layout; no user payload yet.

**4. Page route (e.g. Contact)** (`app/contact/page.tsx`)

- Renders `ContactForm` from `features/contact/components/ContactForm.tsx`. Form uses `submitContactForm` from `lib/actions/submit.ts` (re-exported via `lib/actions.ts`).

**5. Server Action: Contact submit** (`lib/actions/submit.ts`)

- **Flow:** `submitContactForm(data)` → `headers()` for correlation ID and IP; `runWithRequestId` (request context); `withServerSpan` (Sentry); `getBlockedSubmissionResponse(requestHeaders, data)` (CSRF/origin + honeypot) from `lib/actions/helpers.ts`; if not blocked → `contactFormSchema.parse(data)`; `getClientIp()` using `getValidatedClientIp` from `@repo/infra/security/request-validation`; `buildSanitizedContactData(validatedData, clientIp)` (escapeHtml, sanitize email/name) from helpers; `checkRateLimit` from `@repo/infra` (email + IP, hashIp from helpers); `insertLeadWithSpan` (Supabase) and `syncHubSpotLead` from `lib/actions/supabase.ts` and hubspot; return success or rate-limit message.
- **Integrations:** Supabase (required for insert), HubSpot (best-effort). Both use template-local code (`lib/actions/supabase.ts`, `lib/actions/hubspot.ts`, `features/supabase`, `features/hubspot`); `@repo/integrations-supabase` exists but is not yet wired (TODO 1.3.4).

**6. Server Action: Booking submit** (`features/booking/lib/booking-actions.ts`)

- **Flow:** `submitBookingRequest(formData)` → `headers()` for IP (raw `x-forwarded-for`/`x-real-ip` — **not** `getValidatedClientIp`); parse form data; `validateBookingSecurity(rawFormData)` (Zod + honeypot/timestamp); `checkRateLimit` with `btoa`-based hash (inconsistent with contact); `detectSuspiciousActivity`; store in **in-memory** `internalBookings` Map; return success with booking ID / confirmation.
- **Persistence:** None beyond process memory; no Supabase or external booking provider in use.

**7. Blog and search**

- **Blog:** `getAllPosts()` (or equivalent) from `features/blog/lib/blog.ts` reads MDX from `content/blog/`; pages render via `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`.
- **Search:** `getSearchIndex()` in layout uses `lib/search.ts`; builds index from posts; SearchDialog / SearchPage in `features/search/` use it.

#### 1.2.5 Entry Points and Critical Pathways

| Type | Location | Purpose |
|------|----------|---------|
| **App entry** | `templates/*/app/layout.tsx` | Root layout, metadata, nonce, nav, footer, providers. |
| **Route entries** | `templates/*/app/**/page.tsx` | One per route; list in 1.1.6. |
| **API route** | `templates/*/app/api/og/route.tsx` | OG image generation. |
| **Middleware** | `templates/*/middleware.ts` | Single middleware function from `createMiddleware()`. |
| **Server actions** | `lib/actions/submit.ts`, `features/booking/lib/booking-actions.ts` | Contact and booking submission. |
| **Config matcher** | `templates/*/middleware.ts` `config.matcher` | Excludes `_next/static`, `_next/image`, favicon, icons. |

**Critical paths:** Contact submit (validation → CSRF → IP → rate limit → sanitize → Supabase/HubSpot). Booking submit (validation → rate limit → in-memory store). Both are synchronous from the user’s perspective (no background jobs in this codebase).

#### 1.2.6 Module Boundaries and Separation of Concerns

| Boundary | Responsibility | Consumed by |
|----------|----------------|-------------|
| **@repo/infra** | Security (CSP, headers, sanitize, rate-limit, request-validation), middleware factory, logger, request context, Sentry server/sanitize, env validation | Templates (and optionally integrations) |
| **@repo/infra/client** | Sentry client, logger client (client-safe) | Client components in templates |
| **@repo/ui** | Layout and form primitives (Container, Section, Button, Card, Input, Select, Textarea, Accordion) | Templates (and shared components if any) |
| **@repo/utils** | `cn()` (classnames utility) | @repo/ui and templates |
| **@repo/shared** | SiteConfig and conversion-flow types | Templates’ `site.config.ts` and any shared type usage |
| **@repo/integrations-supabase** | Supabase client and lead insertion (not yet used) | Intended for templates after 1.3.4 |
| **Template lib/** | Env validation wrapper, search index, server actions (submit, supabase, hubspot), helpers (hashing, CSRF check, sanitized contact build) | Same template only |
| **Template features/** | Feature UI and logic (booking, blog, contact, services, search, analytics, hubspot, supabase) | Same template only |

**Gaps:** Templates duplicate most of `lib/` and `features/` between hair-salon and plumber. Supabase/HubSpot logic lives in templates instead of shared integrations. Booking does not use a shared persistence layer.

#### 1.2.7 SOLID and Design Patterns

- **Single responsibility:** Infra modules are split (csp, security-headers, sanitize, rate-limit, request-validation, middleware, logger, sentry, env). Features are split by domain (booking, contact, blog, etc.).
- **Open/closed:** Middleware is open for extension via `CreateMiddlewareOptions` (cspReportEndpoint, allowedOrigins, enableStrictDynamic). Env schemas are composable (merge additional schemas).
- **Dependency inversion:** Templates depend on `@repo/infra` abstractions (e.g. `checkRateLimit`, `getValidatedClientIp`); infra does not depend on templates. Contact action uses helpers that call infra; booking action calls infra directly but uses its own IP/hashing.
- **Factory:** `createMiddleware()` returns a configured middleware function.
- **No circular dependencies:** Confirmed: templates → packages; infra → utils; ui → utils. Packages do not import templates.

#### 1.2.8 Dependency Graph (Package-Level)

```
                    ┌─────────────────────────────────────────────────────────┐
                    │  Root (marketing-website-templates)                      │
                    │  devDeps: turbo, typescript, jest, prettier, etc.        │
                    └───────────────────────────┬─────────────────────────────┘
                                                │
    ┌───────────────────┬───────────────────────┼───────────────────────┬───────────────────┐
    ▼                   ▼                       ▼                       ▼                   ▼
@templates/hair-salon  @templates/plumber   @repo/shared          @repo/config        (clients/*)
    │                       │                   (no deps)              (meta only)           (none)
    │                       │
    └───────────┬───────────┘
                │ depends on
                ▼
    ┌───────────────────────────────────────────────────────────────────────────────────────┐
    │  @repo/infra    @repo/ui    @repo/utils    @repo/shared                               │
    │       │             │            │              (types only)                          │
    │       │             └────────────┴── @repo/utils (clsx, tailwind-merge)                │
    │       └── @repo/utils, server-only; peer: next, @sentry/nextjs                        │
    └───────────────────────────────────────────────────────────────────────────────────────┘
                │
                │  @repo/integrations-supabase depends on @repo/infra, @repo/utils
                │  (not yet used by templates)
                ▼
    @repo/integrations-supabase
```

**Summary:** No cycles. Templates are the top-level consumers; infra and integrations sit below; ui and utils are leaves (utils) or depend only on utils (ui). Config packages are tooling-only (no runtime dependency from templates to config except ESLint/TypeScript at build/lint time).

---

## Phase 2: Code Quality Assessment (Deep Dive)

### 2.1 Code Structure & Organization

#### 2.1.1 File and Folder Organization

| Layer | Convention | Assessment |
|-------|-----------|------------|
| **App routes** | `app/<route>/page.tsx` (Next.js App Router) | Consistent. Every route is a directory with `page.tsx`. Dynamic routes use `[slug]`. |
| **Components** | `components/<Name>.tsx` (PascalCase) | Consistent. 11 template components, 8 `@repo/ui` primitives. |
| **Features** | `features/<domain>/` with `components/`, `lib/`, `index.ts` | Consistent. 8 feature domains (booking, blog, contact, services, search, analytics, hubspot, supabase). |
| **Lib** | `lib/` for env, search, actions, utils, constants | Clear. Actions split into `actions/submit.ts`, `helpers.ts`, `supabase.ts`, `hubspot.ts`, `types.ts`. |
| **Packages** | `packages/<name>/src/` for ui/utils; direct root for infra | Minor inconsistency: ui/utils use `src/`, infra does not. |
| **Config** | `packages/config/<tool>/` | Clean separation. |

**Verdict:** Organization is logical and navigable. One minor inconsistency (ui/utils use `src/` while infra exports from root).

#### 2.1.2 Separation of Concerns

| Boundary | Cohesion | Coupling | Notes |
|----------|----------|----------|-------|
| **@repo/infra** | **High** — Each module (csp, headers, sanitize, rate-limit, request-validation, middleware, logger, sentry, env) has a single domain. | Low to packages; peer deps to Next/Sentry. | Well-designed; clean barrel exports separate server vs client. |
| **@repo/ui** | **High** — Pure presentational primitives (Button, Card, Input, etc.) | Depends only on @repo/utils (`cn()`). | Good leaf package. |
| **@repo/utils** | **High** — Single export (`cn`). | Zero internal deps. | Could grow; currently minimal. |
| **Template `lib/actions/`** | **Medium** — `submit.ts` orchestrates; `helpers.ts` has 12 small functions; `supabase.ts` and `hubspot.ts` are adapters. | Tightly coupled to features (supabase, hubspot) and infra. | Helpers file is a grab-bag; could be split (hashing, CSRF, contact-building). |
| **Template `features/`** | **Medium-low** — Each feature has UI + lib, but booking mixes schema, actions, providers, and UI. | Booking depends on infra, env, but also has inline storage (`Map`). | Booking is the weakest boundary; contact is the cleanest. |

#### 2.1.3 Circular Dependencies

No circular dependencies found at any level:
- **Package level:** templates → packages (one-way). `@repo/infra` → `@repo/utils` (one-way). `@repo/ui` → `@repo/utils` (one-way).
- **File level within infra:** Each security module is independent. Logger imports context; middleware imports csp and headers. No cycles.
- **File level within templates:** Actions import from features and lib; features do not import from actions or from each other.

#### 2.1.4 Module Cohesion and Coupling (Detailed)

**High cohesion (good):**
- `packages/infra/security/sanitize.ts` — 11 related sanitization functions with shared config.
- `packages/infra/env/schemas/*.ts` — Each schema file handles one integration (supabase, hubspot, etc.).
- `templates/*/features/contact/` — Schema, form component, and index; clean and focused.

**Low cohesion (areas for improvement):**
- `templates/*/lib/actions/helpers.ts` — 12 exports spanning hashing, CSRF, name splitting, error normalization, sanitized data building, HubSpot idempotency. These serve different concerns (crypto, validation, data transformation).
- `packages/infra/env/validate.ts` (402 lines) — Creates schemas, validates, composes, plus environment-specific variants. Could be split into `compose.ts` and `validate.ts`.

---

### 2.2 Duplication Analysis (Quantified)

#### 2.2.1 Summary

| Metric | Count |
|--------|-------|
| **Total .ts/.tsx files compared** | ~85 |
| **IDENTICAL** | 62 (73%) |
| **NEAR-IDENTICAL** (1–5 line diffs) | 8 (9%) |
| **DIFFERENT** (meaningful changes) | 15 (18%) |
| **Template-only files** | 0 (same file set) |

**73% of all source files in `templates/plumber` are byte-for-byte identical to `templates/hair-salon`.** An additional 9% differ by only a comment or default string. Only `site.config.ts`, `package.json`, and a handful of content/metadata files differ meaningfully.

#### 2.2.2 Identical Files (Key Examples)

All of `lib/` (env.ts, search.ts, actions/submit.ts, helpers.ts, supabase.ts, hubspot.ts, types.ts, constants.ts, utils.ts, actions.ts) and all tests.

All of `features/` (booking/*, blog/*, contact/*, analytics/*, hubspot/*, supabase/*, services/*, search/*).

All of `components/` (Navigation, Footer, Hero, ValueProps, SocialProof, FinalCTA, SkipToContent, Breadcrumbs, ErrorBoundary, AnalyticsConsentBanner).

All of `app/` (layout.tsx, page.tsx, every route page, sitemap.ts, robots.ts, api/og/route.tsx).

All config (middleware.ts, next.config.js, tsconfig.json, tailwind.config, postcss.config).

#### 2.2.3 Near-Identical Files

| File | Difference |
|------|-----------|
| `lib/env.public.ts` | Plumber still defaults to `'Hair Salon Template'` |
| `features/blog/lib/blog.ts` | Plumber retains `'Hair Care'` default category |
| `features/booking/lib/booking-actions.ts` | ~7 lines differ (minor) |
| `app/layout.tsx` | Plumber retains `'hair salon'` SEO keywords |
| `eslint.config.mjs` | Comment says "hair salon template" |
| `components/InstallPrompt.tsx` | Copy says "hair salon services" |

#### 2.2.4 Plumber Is an Incomplete Fork

The plumber template has its own `site.config.ts` with plumber-specific data (services: residential, commercial, emergency, maintenance; conversionFlow: `'quote'`), but:
- **Service pages** still render haircuts, coloring, treatments, special-occasions.
- **Hero, ValueProps, SocialProof, FinalCTA** still display hair salon marketing copy.
- **Booking schema** uses hair-salon `SERVICE_TYPES` (`'haircut-style'`, `'color-highlights'`, etc.).
- **Booking providers** reference Mindbody, Vagaro, Square — salon-specific platforms.
- **Layout SEO keywords** include `'hair salon'`, `'haircut'`, etc.

**Impact:** Plumber is not usable as a plumber template without significant content and schema updates. The `site.config.ts` data-driven approach is correct in design but not carried through to all components and pages.

#### 2.2.5 Duplication Impact

- **Estimated duplicated lines:** ~6,500+ (across ~62 identical files averaging 100+ lines).
- **Risk:** A fix applied to one template (e.g. the booking IP validation fix) must be manually applied to the other. The existing booking security inconsistency (contact has validated IP; booking does not) could diverge further.
- **Root cause:** The planned extraction (TODO Phase 1.3–1.7) has not been completed. Templates were copied before shared packages were available.

---

### 2.3 Code Readability & Maintainability

#### 2.3.1 JSDoc and Comment Quality

| Area | Quality | Notes |
|------|---------|-------|
| **@repo/infra/env/schemas/** | **Excellent** | Every schema has JSDoc with examples, type descriptions, validation rules. |
| **@repo/infra/security/sanitize.ts** | **Excellent** | Attack scenarios, what-it-prevents blocks, usage examples. |
| **@repo/infra/security/request-validation.ts** | **Very good** | OWASP context, interface docs, configuration examples. |
| **@repo/infra/security/csp.ts** | **Good** | Main APIs documented; `processCspViolationReport` could use more. |
| **@repo/infra/logger/** | **Basic** | Module-level comments; individual functions sparsely documented. |
| **@repo/infra/sentry/** | **Sparse** | Module comments only; no function-level JSDoc. |
| **Template `lib/actions/submit.ts`** | **Very good** | Comprehensive JSDoc on `submitContactForm` (flow, rate limiting, security, error handling, examples). |
| **Template `lib/actions/helpers.ts`** | **Partial** | Some functions documented; 12 exports, ~4 have JSDoc. |
| **Template `features/booking/`** | **Partial** | Schema has inline comments; actions have minimal JSDoc; providers have minimal docs. |
| **Template components** | **Mixed** | Navigation, ErrorBoundary, InstallPrompt have JSDoc; Hero, ValueProps, SocialProof, Footer do not. |
| **@repo/ui components** | **Mixed** | Input, Select, Textarea, Accordion, Container, Section have JSDoc on props; Button, Card do not. |

**Pattern:** Infrastructure and critical server actions are well documented. UI components and feature components are inconsistently documented.

#### 2.3.2 Function Length and Complexity

| Complexity | Count | Examples |
|------------|-------|----------|
| **Simple** (≤15 lines, linear) | ~60% | `cn()`, `hashIp()`, `splitName()`, UI primitives (Button, Card, Container) |
| **Medium** (16–50 lines, 1–2 branches) | ~30% | `buildContentSecurityPolicy()`, `getSecurityHeaders()`, `validateOrigin()`, `checkRateLimit()` |
| **High** (>50 lines or >3 branches) | ~10% | `submitContactForm()` (orchestrator), `submitBookingRequest()` (302-line file), `booking-providers.ts` provider classes (~60–90 lines each), `validate.ts:createEnvSchema()`, `Navigation.tsx` (216 lines with mobile menu + focus trap) |

**Hotspots:**
- `packages/infra/env/validate.ts` — 402 lines; `createEnvSchema` and `validateEnv` each ~40 lines with repetitive `if (x) schema = schema.merge(x)` chains.
- `packages/infra/security/rate-limit.ts` — 471 lines; largest infra module. `checkMultipleLimits` switch and `RateLimiterFactory.create` have medium complexity.
- `templates/*/features/booking/lib/booking-providers.ts` — 366 lines; three provider classes repeat the same adapter pattern.
- `templates/*/features/booking/lib/booking-actions.ts` — 302 lines; `submitBookingRequest` is ~80 lines; inline `detectSuspiciousActivity` and in-memory store code.

#### 2.3.3 Naming Consistency

| Convention | Where | Compliance |
|------------|-------|-----------|
| **PascalCase** exports | Components (Button, Navigation, ContactForm, etc.) | 100% |
| **PascalCase** filenames for components | `components/*.tsx`, `features/*/components/*.tsx` | 100% |
| **kebab-case** filenames for lib | `lib/env.ts`, `security/rate-limit.ts`, `booking-actions.ts` | 100% |
| **camelCase** functions | `createMiddleware`, `getSecurityHeaders`, `submitContactForm` | 100% |
| **UPPER_SNAKE_CASE** constants | `RATE_LIMIT_PRESETS`, `FORM_VALIDATION`, `CSP_NONCE_HEADER` | 100% |

**Verdict:** Naming is highly consistent across the entire codebase.

#### 2.3.4 Magic Numbers and Hardcoded Values

| Category | Location | Value | Assessment |
|----------|----------|-------|-----------|
| **Rate limits** | `@repo/infra/security/rate-limit.ts` | Defined in `RATE_LIMIT_PRESETS` and `DEFAULT_RATE_LIMIT` | **Good** — named constants. |
| **Form validation** | `templates/*/lib/constants.ts` | `FORM_VALIDATION`, `RATE_LIMIT`, `HUBSPOT`, `UI_TIMING`, `TEST` | **Good** — centralized. |
| **Booking date range** | `booking-schema.ts` | `90` days | Acceptable in schema context; could be a constant. |
| **CSP max-age** | `csp.ts` | `86400` | Should be a named constant (e.g. `CSP_REPORT_MAX_AGE_SECONDS`). |
| **HSTS max-age** | `security-headers.ts` | `31536000` | Should be a named constant. |
| **Nonce length check** | `csp.ts` | `nonce.length < 16` | The `16` duplicates `NONCE_BYTE_LENGTH = 16` but uses it differently. |
| **Static pages** | `search.ts` | Hardcoded page titles, descriptions, tags | Acceptable for search index; could be derived from `siteConfig`. |
| **API base URLs** | `hubspot-client.ts`, `supabase-leads.ts` | `HUBSPOT_API_BASE_URL`, `SUPABASE_LEADS_PATH` | Named constants per file. |
| **Provider service maps** | `booking-providers.ts` | Mindbody/Vagaro/Square service IDs | Hardcoded; should be configurable or driven by env/config. |
| **Layout spacing** | Many components | `max-w-7xl`, `px-6`, `py-16`, `gap-8` | Tailwind utility classes used directly; not centralized but standard practice. |

---

### 2.4 Best Practices & Standards

#### 2.4.1 TypeScript Quality

**Strict mode:** Enabled globally (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`).

**Type assertions inventory (every `as` cast found):**

| File | Line | Cast | Risk |
|------|------|------|------|
| `lib/actions/submit.ts` | L30 | `process.env.NODE_ENV as any` | **High** — bypasses type safety for env. |
| `lib/env.ts` | L56 | `validateEnv() as CompleteEnv` | **Medium** — runtime-validated but compile-time cast. |
| `packages/infra/env/validate.ts` | L197–199 | `result.data as CompleteEnv`, `as EnvValidationResult` | **Medium** — Zod validates at runtime. |
| `packages/infra/security/rate-limit.ts` | L166–168 | `limiter: any` (Upstash Ratelimit) | **High** — loses type info on core rate limiter. |
| `packages/infra/security/rate-limit.ts` | L420 | `(check as any).type` | **High** — unchecked property access. |
| `packages/infra/sentry/sanitize.ts` | L63 | `sanitizeValue(event as JsonValue) as TEvent` | **Medium** — double assertion. |
| `features/booking/lib/booking-providers.ts` | L265–316 | `validatedEnv[key as keyof typeof validatedEnv]` | **Medium** — dynamic env access. |
| `features/booking/components/BookingForm.tsx` | (varies) | `prefilledService as any` | **High** — loses form field type. |
| `features/hubspot/lib/hubspot-client.ts` | L87, L116 | `(await response.json()) as HubSpotSearchResponse` | **Low** — common fetch pattern. |
| `features/supabase/lib/supabase-leads.ts` | L64 | `(await response.json()) as SupabaseLeadRow[]` | **Low** — common fetch pattern. |
| `features/analytics/lib/analytics.ts` | L49 | `window as Window & { gtag?: unknown }` | **Low** — extending window for analytics. |

**Total:** 13 type assertions across codebase. 3 are high-risk (`as any`), 5 are medium-risk, 5 are low-risk (standard fetch patterns or window extension).

#### 2.4.2 Async / Await Patterns

- **Server actions** (`submitContactForm`, `submitBookingRequest`): All use async/await with proper try/catch.
- **External API calls** (HubSpot, Supabase): async/await with error checking (`!response.ok` → throw).
- **HubSpot retry:** Exponential backoff via `waitForRetry()` in a for loop — correct pattern.
- **Dynamic imports:** `@upstash/ratelimit` and `@sentry/nextjs` are dynamically imported with `.catch(() => {})` — silent swallow on import failure.
- **React `cache()`:** Used in `search.ts` for memoizing `getSearchIndex()` — correct pattern.
- **No** raw `.then()` chains, no callback-style async, no unhandled promise rejections in scanned code.

**Issue:** Dynamic import failures for Sentry (`logger/client.ts`) and Upstash (`rate-limit.ts`) are silently swallowed. If these fail, the system degrades silently with no logging.

#### 2.4.3 ESLint Configuration Status

| Package | Has `eslint.config.*` | Has `@repo/eslint-config` dep | `lint` script | Effective config |
|---------|----------------------|------------------------------|---------------|------------------|
| `@templates/hair-salon` | `eslint.config.mjs` (extends `@repo/eslint-config/next`) | Yes (devDep) | `next lint` | Full: Next.js + TS rules |
| `@templates/plumber` | `eslint.config.mjs` (extends `@repo/eslint-config/next`) | Yes (devDep) | `next lint` | Full: Next.js + TS rules |
| `@repo/ui` | **None** | **Not listed** | `eslint src` | **Undefined** — ESLint 9 flat config finds no config; behavior depends on whether root config is found. |
| `@repo/utils` | **None** | **Not listed** | `eslint src` | **Undefined** — same issue. |
| `@repo/infra` | **None** | **Not listed** | `eslint .` | **Undefined** — same issue. |
| `@repo/integrations-supabase` | **None** | **Not listed** | `eslint .` | **Undefined** — same issue. |

**Impact:** When `pnpm lint` runs via Turbo, templates lint correctly. Packages may lint with no rules (ESLint 9 flat config requires explicit config) or error depending on ESLint's config resolution. README explicitly states this is broken.

#### 2.4.4 Error Handling Patterns

| Pattern | Where | Quality |
|---------|-------|---------|
| **Zod validation → user message** | Contact submit, booking submit | **Good** — ZodError caught, field errors returned. |
| **Generic catch → safe message** | All server actions | **Good** — no internal details exposed. |
| **Structured result objects** | `{ success: boolean; message: string; errors?: ZodIssue[] }` | **Good** — consistent contract. |
| **Error logging** | `logError()` from `@repo/infra` with request context | **Good** — structured, JSON in production. |
| **External API errors** | `!response.ok` → throw | **Adequate** — throws for HubSpot/Supabase; caught by action wrapper. |
| **Retry with backoff** | HubSpot upsert | **Good** — exponential backoff with max retries. |
| **Swallowed import errors** | Sentry client, Upstash dynamic import | **Poor** — silent `.catch(() => {})` or `.catch(() => null)`. |
| **Fallback for missing nonce** | `layout.tsx` `resolveCspNonce` | **Good** — logs warning, creates fallback, static nonce as last resort. |
| **ErrorBoundary** | `components/ErrorBoundary.tsx` | **Good** — class component with `getDerivedStateFromError` and `componentDidCatch`; renders fallback UI with retry. |

#### 2.4.5 PII Handling

| Flow | PII in logs? | Hashing | Assessment |
|------|-------------|---------|-----------|
| **Contact submit** | No — only hashed IP and email in spans | SHA-256 with salt | **Good** |
| **Booking submit** | **Yes** — `console.warn` logs raw `ip` and `validatedData.email` (line 112–116) | `btoa().substring(0, 16)` | **Poor** — raw PII logged; weak hashing |
| **Logger sensitive keys** | Redacted via `SENSITIVE_KEYS` and `SENSITIVE_KEY_SUBSTRINGS` | N/A | **Good** — auto-redacts `password`, `token`, `key`, etc. |
| **Sentry events** | Sanitized via `sanitizeSentryEvent` | Regex redaction | **Good** |

---

### 2.5 UI Component Quality

#### 2.5.1 @repo/ui Primitives (8 components)

| Component | Lines | Props typed | Accessibility | Design tokens | Notes |
|-----------|-------|-------------|---------------|--------------|-------|
| **Button** | 42 | `ButtonProps extends ButtonHTMLAttributes` | `focus-visible:ring-2`, `disabled:opacity-50` | Variant/size maps | Clean; `forwardRef`. |
| **Card** | 20 | `CardProps extends HTMLAttributes` | None needed (div) | Variant map | Clean. |
| **Input** | 54 | Yes; `label`, `error`, `isValid` | `aria-invalid`, `aria-describedby`, `role="alert"` | CSS vars | Excellent a11y. |
| **Select** | 67 | Yes; `label`, `options`, `error` | Same as Input | CSS vars | Excellent a11y. |
| **Textarea** | 54 | Yes; same pattern as Input | Same as Input | CSS vars | `min-h-[80px]` hardcoded. |
| **Accordion** | 80 | `AccordionItem`, `multiple` | `aria-expanded`, `aria-controls`, `role="region"` | `max-h-96` hardcoded | Good. |
| **Container** | 27 | `size` prop | N/A (layout) | Size map | Clean. |
| **Section** | 20 | `as` prop (polymorphic) | Semantic HTML (section/aside) | N/A | Clean. |

**Verdict:** Well-designed primitive library. Consistent use of `forwardRef`, typed props, and ARIA attributes on form elements. Accessibility is strong.

#### 2.5.2 Template Components (11 components)

| Component | Lines | Complexity | Uses @repo/ui | Accessibility | Issue |
|-----------|-------|-----------|---------------|---------------|-------|
| **Navigation** | 216 | High (mobile menu, focus trap, keyboard) | Button, SearchDialog | `role="navigation"`, `aria-label`, `aria-expanded`, Escape key | Correct. |
| **Footer** | 92 | Medium | None | `aria-label` on social links, `<footer>` | Does not use `Container` from @repo/ui. |
| **Hero** | 58 | Simple | Button, Container | Semantic `<section>` | Correct. |
| **ValueProps** | 87 | Medium (memo) | Container, Section, Card | Semantic headings | Correct. |
| **SocialProof** | 78 | Medium (memo) | Container, Section, Card | Semantic structure | Correct. |
| **FinalCTA** | 41 | Simple | Button, Container, Section | Semantic headings | Correct. |
| **SkipToContent** | 14 | Trivial | None | `sr-only`, `focus:not-sr-only` | Hardcoded blue focus styles (should use design tokens). |
| **InstallPrompt** | 145 | Medium (useState, useEffect, timers) | Button | `aria-label` on dismiss | Uses `UI_TIMING` constants. |
| **Breadcrumbs** | 98 | Medium (useMemo, pathname) | None | `aria-label`, `aria-current`, `sr-only` | Does not use Container. |
| **ErrorBoundary** | 195 | Class component, error handling | **None** — custom buttons | `focus-visible` on buttons | Should use `@repo/ui` Button. |
| **AnalyticsConsentBanner** | 122 | Medium (state, subcomponents) | Button | `role="dialog"`, `aria-live`, `aria-labelledby` | Correct. |

#### 2.5.3 Feature Components (7 key components)

| Component | Lines | Complexity | Uses @repo/ui | Issues |
|-----------|-------|-----------|---------------|--------|
| **ContactForm** | 215 | High (react-hook-form, zod, server action, Sentry) | Input, Select, Textarea, Button | Correct and secure (honeypot, CSRF). |
| **BookingForm** | 319 | High (useForm, useTransition, toast) | Card, Button, Input, Select, Textarea | `(prefilledService as any)`; TODO for analytics; duplicates label pattern. |
| **ServicesOverview** | 71 | Simple | Container, Section, Card | Correct. |
| **ServiceDetailLayout** | 247 | High (structured data, many sections) | Container, Section, Card, Button, Accordion | Correct; uses most @repo/ui primitives. |
| **SearchDialog** | 169 | Medium (keyboard shortcut, useMemo) | Button | Uses raw `<input>` instead of `@repo/ui` Input. |
| **SearchPage** | 95 | Medium (useSearchParams) | **None** | Does not use @repo/ui layout; hardcoded colors. |
| **BlogPostContent** | 37 | Simple (MDXRemote) | None | Correct. |

---

### 2.6 Infra Package Quality (Per-Module Summary)

| Module | Lines | Functions | Type safety | JSDoc | Complexity | Key issue |
|--------|-------|-----------|-------------|-------|-----------|-----------|
| **security/csp.ts** | 247 | 8 | Good; no `any` | Good | Medium (nested ternaries in `processCspViolationReport`) | Ternary chain should be helper functions. |
| **security/security-headers.ts** | 235 | 6 | Good | Good | Low–medium | `indexOf !== -1` should use `.includes()`. |
| **security/sanitize.ts** | 295 | 11 | Strong | Excellent | Low–medium | `indexOf === -1` should use `.includes()`. |
| **security/rate-limit.ts** | 471 | 13 | **Weak:** `limiter: any`, `(check as any).type` | Decent | Medium | Largest infra module; `any` on core limiter type. |
| **security/request-validation.ts** | 319 | 7 | Good | Strong (OWASP) | Low–medium | Clean. |
| **middleware/create-middleware.ts** | 114 | 2 | Good | Good (CVE ref) | Low | Could split CSP/headers/CSRF into composable steps. |
| **logger/index.ts** | 257 | 14 | Good | Basic | Low–medium | Duplicate `SENSITIVE_KEYS` and `SENSITIVE_KEY_SUBSTRINGS`. |
| **logger/client.ts** | 36 | 2 | Good | Short | Low | Swallowed Sentry import error. |
| **context/*.ts** | 22 + 34 | 4 | Good; generics | Adequate | Very low | Clean. |
| **sentry/*.ts** | 56 + 39 + 69 | 10 | Good (1 double assertion) | Sparse | Low | `sanitizeValue(event as JsonValue) as TEvent`. |
| **env/validate.ts** | 402 | 7 | **Weak:** `as CompleteEnv` casts | Very strong | Medium | Repetitive schema merge chains. |
| **env/types.ts** | 241 | 0 | Strong | Very good | N/A | Aspirational interfaces (not all implemented). |
| **env/schemas/*.ts** (7 files) | 161–369 ea | ~5 each | Good | Strong | Low | Repetitive `validate` + `safeValidate` + "both-or-neither" pattern across all schemas. |

**Overall infra assessment:** High quality with consistent patterns. Main weaknesses are the `any` casts in rate-limit.ts, repetitive validation boilerplate across env schemas, and sparse JSDoc in sentry/logger modules.

---

### 2.7 Phase 2 Summary

#### What's Working Well

1. **Naming conventions** — 100% consistent across the codebase (PascalCase components, kebab-case files, camelCase functions, UPPER_SNAKE_CASE constants).
2. **Infra package design** — Clean separation, strong JSDoc in security and env modules, proper barrel exports with server/client split.
3. **Accessibility** — Form primitives in `@repo/ui` have comprehensive ARIA support. Navigation has focus trap and keyboard handling. Breadcrumbs, SearchDialog, AnalyticsConsentBanner all use appropriate ARIA roles.
4. **Error handling** — Contact form has exemplary error handling (Zod → user message, generic catch, no leaks). Structured `{ success, message }` result pattern used consistently.
5. **Validation** — Zod used systematically for contact, booking, blog frontmatter, and all env schemas.
6. **Constants** — Centralized in `lib/constants.ts` and infra presets; few raw magic numbers.

#### What Needs Improvement

1. **Duplication** — 73% file identity between templates; ~6,500+ duplicated lines. This is the single largest code quality issue. The planned extraction (TODO 1.3–1.7) is the correct fix but is incomplete.
2. **Plumber completeness** — Plumber template still renders hair-salon content, keywords, service types, and booking logic. It is functionally a broken fork.
3. **Type assertions** — 13 `as` casts, 3 using `any`. The `rate-limit.ts` `any` on the core limiter and `submit.ts` `NODE_ENV as any` are the most impactful.
4. **ESLint for packages** — 4 packages (ui, utils, infra, integrations-supabase) have no ESLint config; lint runs are ineffective for them.
5. **PII in booking logs** — Raw IP and email logged via `console.warn` in booking-actions.ts.
6. **Swallowed import errors** — Sentry and Upstash dynamic import failures are silently caught, making it hard to diagnose missing integrations.
7. **Env schema boilerplate** — Each of the 7 env schema files repeats `validate` + `safeValidate` + error formatting. A shared helper would eliminate ~350 lines of duplication.

---

## Phase 3: Security & Reliability (Deep Dive)

### 3.1 Security Analysis by Category

#### A. Content Security Policy (CSP)

| Directive | Production | Development | Notes |
|-----------|-----------|-------------|-------|
| `script-src` | `'strict-dynamic' 'nonce-...'` | `'nonce-...' 'unsafe-eval'` | `strict-dynamic` in prod. `unsafe-eval` in dev only (Next.js HMR). |
| `style-src` | `'self'` | `'self' 'unsafe-inline'` | Inline styles allowed only in dev. |
| `frame-ancestors` | `'none'` | `'none'` | Clickjacking prevented. |
| `object-src` | `'none'` | `'none'` | Plugin execution blocked. |
| `connect-src` | `'self' *.google-analytics.com *.sentry.io` | Same + `webpack://` | Analytics and error tracking allowed. |
| `report-uri` / `report-to` | Configurable via `cspReportEndpoint` | Same | **Not configured** — `createMiddleware({})` passes no endpoint. |

- **Nonce:** 16-byte crypto-random, base64-encoded via `createCspNonce()`. Passed as `x-csp-nonce` header. Layout reads it and injects into inline `<script>` tags.
- **Fallback:** If nonce header missing, layout logs warning and generates a new nonce; if crypto unavailable, uses static `'fallback-nonce'`.

| Finding | Severity | Location |
|---------|----------|----------|
| CSP report endpoint not configured | Low | `templates/*/middleware.ts` — `createMiddleware({})` |
| `unsafe-eval` in development | Low | `packages/infra/security/csp.ts` L90–93 |

#### B. HTTP Security Headers

| Header | Production | Development |
|--------|-----------|-------------|
| `X-Content-Type-Options` | `nosniff` | `nosniff` |
| `X-Frame-Options` | `DENY` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Same |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Not set |
| `Cross-Origin-Resource-Policy` | `same-origin` | `same-origin` |
| `Cross-Origin-Opener-Policy` | `same-origin` | Disabled |
| `Cross-Origin-Embedder-Policy` | `require-corp` | Disabled |
| `X-Debug-Info` | Not set | `enabled` |

| Finding | Severity | Location |
|---------|----------|----------|
| HSTS `max-age=31536000` is a magic number | Info | `security-headers.ts` L114 |
| `X-Debug-Info: enabled` in development | Medium | `security-headers.ts` L129–132 — ensure it cannot leak to prod |

#### C. CSRF Protection

**Contact form (protected):**
- `getBlockedSubmissionResponse()` in `helpers.ts` calls `validateOrigin()` with `NEXT_PUBLIC_SITE_URL` from env. Rejects requests with invalid or missing Origin/Referer.
- Honeypot field (`website`) blocks bots.

**Booking form (NOT protected):**

| Finding | Severity | Location |
|---------|----------|----------|
| `submitBookingRequest` has NO Origin/Referer validation | **Critical** | `booking-actions.ts` — no `validateOrigin` call |
| `confirmBooking` / `cancelBooking` have NO Origin/Referer validation | **High** | `booking-actions.ts` L174–270 |
| Booking IDs are guessable (`booking_${Date.now()}_${random}`) | **High** | `booking-actions.ts` — enables IDOR for confirm/cancel |
| `getBookingDetails` returns data for any valid ID (IDOR) | **Medium** | `booking-actions.ts` L274–288 |
| Edge CSRF not configured in middleware | **High** | `middleware.ts` — `createMiddleware({})` passes no `allowedOrigins` |

#### D. Input Validation & Sanitization (Field-Level Trace)

**Contact form — every field traced from client to storage:**

| Field | Client (Zod) | Server Validation | Server Sanitization | Storage |
|-------|-------------|-------------------|--------------------|---------| 
| `name` | min 2, max 100 | `contactFormSchema.parse()` | `sanitizeName()` | Supabase |
| `email` | `.email()`, max 254 | Same | `sanitizeEmail()` | Supabase |
| `phone` | Optional, max 20 | Same | `escapeHtml()` | Supabase |
| `message` | min 10, max 2000 | Same | `escapeHtml()` | Supabase |
| `company` | Optional, max 100 | Same | `escapeHtml()` | Supabase |
| `website` | Honeypot — blocks if filled | Same | N/A (blocked) | Never stored |

**Booking form — every field traced:**

| Field | Client (FormData) | Server Validation | Server Sanitization | Storage |
|-------|-------------------|-------------------|--------------------|---------| 
| `firstName` | Raw | `bookingFormSchema.parse()`: min 2, max 50, regex `[a-zA-Z\s\-']` | **None** | In-memory Map |
| `lastName` | Raw | Same | **None** | In-memory Map |
| `email` | Raw | `.email().toLowerCase().trim()` | **None** | In-memory Map |
| `phone` | Raw | Regex, min 10, max 20 | **None** | In-memory Map |
| `serviceType` | Raw | `.enum(SERVICE_TYPES)` | **None** | In-memory Map |
| `preferredDate` | Raw | Date range check (next 90 days) | **None** | In-memory Map |
| `timeSlot` | Raw | `.enum(TIME_SLOTS)` | **None** | In-memory Map |
| `notes` | Raw | Optional, max 500, regex `/^[^<>]*$/` | **`sanitizeNotes()` exists but is NOT called** | In-memory Map |
| `honeypot` | Raw | Blocks if filled | N/A | Never stored |

| Finding | Severity | Location |
|---------|----------|----------|
| Booking fields validated by Zod but NOT sanitized (no `escapeHtml`) | **Medium** | `booking-actions.ts` L77–91 |
| `sanitizeNotes()` exists in schema but never called before storage | **Medium** | `booking-schema.ts` L156–163 |
| Notes regex `/^[^<>]*$/` blocks `<>` but not all XSS vectors (e.g. event handlers in re-rendered contexts) | **Low** | `booking-schema.ts` L88 |

#### E. Rate Limiting

| Config | Contact | Booking | API (default) |
|--------|---------|---------|---------------|
| **Limit** | 3/hour | 5/hour | 100/minute |
| **Keys** | Email + IP | Email + IP | IP |
| **Algorithm** | Sliding window (Upstash) | Same | Same |
| **Fallback** | In-memory (per-instance) | Same | Same |

| Finding | Severity | Location |
|---------|----------|----------|
| Booking uses raw `x-forwarded-for` — client can spoof IP to bypass rate limit | **Critical** | `booking-actions.ts` L75 |
| Booking hashes IP with `btoa(value).substring(0, 16)` — **reversible**, not a hash | **Critical** | `booking-actions.ts` L97–100 |
| Contact uses `getValidatedClientIp` + SHA-256 salt — correct | Info | `submit.ts` L28–31 |
| In-memory fallback means rate limits are per-instance in serverless | **Medium** | `rate-limit.ts` L187–191 |
| `hashIp` in rate-limit.ts uses non-crypto 32-bit hash; comment notes "consider cryptographic hash" | **High** | `rate-limit.ts` L267–276 |

#### F. Secrets & API Keys

| Secret | Storage | Client-exposed? | Validated? |
|--------|---------|-----------------|-----------|
| `SUPABASE_URL` | `.env.local` | No | Zod (supabaseEnvSchema) |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | No | Zod |
| `HUBSPOT_PRIVATE_APP_TOKEN` | `.env.local` | No | Zod (optional) |
| `UPSTASH_REDIS_REST_URL` | `.env.local` | No | Zod (URL format) |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` | No | Zod (optional) |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` | Yes (public) | Zod |
| `NEXT_PUBLIC_SITE_NAME` | `.env.local` | Yes (public) | Zod |
| `NEXT_PUBLIC_ANALYTICS_ID` | `.env.local` | Yes (public) | Zod (optional) |

- `server-only` import in `lib/env.ts` prevents accidental client bundling.
- `.env.example` contains only placeholders; no real secrets.
- GitGuardian secret scanning in CI (requires `GITGUARDIAN_API_KEY`).
- No secrets found in committed code.

#### G. External API Security

| API | Auth | Response Validation | Error Leakage Risk |
|-----|------|--------------------|--------------------|
| **HubSpot** | Bearer token from env | Checks `Array.isArray(results)` | `errorText` included in thrown error — could reach logs |
| **Supabase** | Service role key in `apikey` + `Authorization` | Checks `!response.ok` | `errorText` included in thrown error |

| Finding | Severity | Location |
|---------|----------|----------|
| `response.json()` can throw on malformed JSON — no try/catch | **Medium** | `hubspot-client.ts`, `supabase-leads.ts` |
| API error text propagated in thrown errors — may contain internal details | **Medium** | `hubspot-client.ts` L108, `supabase-leads.ts` L36 |

#### H. XSS Prevention

| Vector | Location | Risk | Notes |
|--------|----------|------|-------|
| `dangerouslySetInnerHTML` (JSON-LD) | `layout.tsx`, `ServiceDetailLayout.tsx`, `blog/[slug]/page.tsx`, `Breadcrumbs.tsx` | **Low** | Static/build-time data; nonce-protected inline scripts |
| MDX content rendering | `BlogPostContent.tsx` via `next-mdx-remote` | **Medium** | Build-time content; safe if content source is trusted. Risk if MDX ever becomes user-editable. |
| OG image route | `app/api/og/route.tsx` | **Info** | Uses `escapeHtml()` on title/description before rendering |
| Contact data in Supabase | Storage | **Info** | All fields sanitized with `escapeHtml`/`sanitizeName`/`sanitizeEmail` |
| Booking data in memory | `internalBookings` Map | **Medium** | Validated but not sanitized; if ever rendered as HTML, XSS risk |

#### I. Server Action Security

| Action | `'use server'` | CSRF | Validation | Rate Limit | Sanitization |
|--------|----------------|------|-----------|-----------|-------------|
| `submitContactForm` | Yes | Origin + honeypot | Zod | Email + IP | Full (escapeHtml, sanitizeName, sanitizeEmail) |
| `submitBookingRequest` | Yes | **None** | Zod | Email + IP (spoofable) | **None** |
| `confirmBooking` | Yes | **None** | ID check only | **None** | N/A |
| `cancelBooking` | Yes | **None** | ID check only | **None** | N/A |
| `getBookingDetails` | Yes | **None** | ID check only | **None** | N/A |

#### J. Dependency Vulnerabilities & Supply Chain

- CI runs `pnpm audit --audit-level high` — fails build on high/critical.
- SBOM generated (SPDX via Anchore) with 90-day retention.
- Separate `sbom-generation.yml` runs audit with `|| true` (does not fail).
- GitGuardian secret scanning on push/PR to main/develop.
- Next.js upgraded to 15.2.9 for CVE remediation (4 critical CVEs fixed).
- One transitive high-severity vulnerability may remain (rollup via Sentry).

#### K. Information Disclosure

| Finding | Severity | Location |
|---------|----------|----------|
| Booking logs raw `email` and `ip` via `console.warn`/`console.info` | **High** | `booking-actions.ts` L109–116, L138–145 |
| Logger includes `error.stack` in serialized errors | **Medium** | `logger/index.ts` L165–179 — may contain internal paths |
| HubSpot/Supabase error text in thrown errors can reach logs | **Medium** | `hubspot-client.ts` L108, `supabase-leads.ts` L36 |
| Zod field-level errors returned to client (no stack traces) | **Info** | `submit.ts` L149 |
| Generic messages for non-Zod errors (no internals exposed) | **Info** | `submit.ts` L152 |

#### Security Findings Summary

| Severity | Count | Key Findings |
|----------|-------|-------------|
| **Critical** | 3 | Booking: no CSRF, spoofable IP for rate limiting, reversible `btoa` hash |
| **High** | 4 | Edge CSRF not configured, IDOR on booking confirm/cancel, rate-limit `hashIp` non-crypto, PII in booking logs |
| **Medium** | 7 | Booking data not sanitized, `sanitizeNotes` unused, in-memory rate-limit fallback per-instance, `response.json()` unguarded, API error text propagation, logger stack traces, MDX trust model |
| **Low** | 3 | CSP report not configured, `unsafe-eval` in dev, notes regex limited |
| **Info** | 8 | Correct patterns in contact form, CSP, headers, env validation, secret scanning |

---

### 3.2 Error Handling & Resilience (Deep Dive)

#### 3.2.1 Error Flow: Contact Form Submission

```
ContactForm.onSubmit
  │
  ├─ try: submitContactForm(data)
  │   ├─ runWithRequestId → withServerSpan
  │   │   ├─ getBlockedSubmissionResponse(headers, data)
  │   │   │   ├─ validateOrigin fails → return { success: false, "Invalid request..." }
  │   │   │   └─ honeypot triggered  → return { success: false, "Unable to submit..." }
  │   │   │
  │   │   ├─ contactFormSchema.parse(data)
  │   │   │   └─ ZodError → caught by outer catch → { success: false, "Please check...", errors }
  │   │   │
  │   │   ├─ getClientIp() → getValidatedClientIp
  │   │   │   └─ failure → caught by outer catch → generic message
  │   │   │
  │   │   ├─ checkRateLimit({ email, clientIp, hashIp })
  │   │   │   ├─ Upstash fails → console.warn → in-memory fallback → continues
  │   │   │   └─ limit exceeded → lead still inserted with isSuspicious=true
  │   │   │       → return { success: false, "Too many submissions..." }
  │   │   │
  │   │   ├─ insertLeadWithSpan → insertSupabaseLead
  │   │   │   └─ Supabase down → throw → caught → { success: false, "Something went wrong..." }
  │   │   │
  │   │   └─ syncHubSpotLead (best-effort)
  │   │       ├─ retryHubSpotUpsert (3 retries, exponential backoff)
  │   │       │   └─ all retries fail → returns { error } → updates lead "needs_sync"
  │   │       └─ updateLeadWithSpan fails → try/catch swallows → logged only
  │   │
  │   └─ catch: logError → ZodError? user fields : generic message
  │
  └─ catch (ContactForm): setSubmitStatus(error) → "Something went wrong..."
```

**Assessment:** Exemplary. Every error path is handled. User never sees internals. Supabase is required (failure = user error). HubSpot is best-effort (failure = silent retry marking). Rate limit failure degrades gracefully.

#### 3.2.2 Error Flow: Booking Submission

```
BookingForm.onSubmit
  │
  ├─ try: startTransition → submitBookingRequest(formData)
  │   ├─ headers() → extract IP (raw x-forwarded-for)
  │   │
  │   ├─ validateBookingSecurity(rawFormData)
  │   │   └─ ZodError → caught → "Failed to submit booking request..."
  │   │
  │   ├─ checkRateLimit({ email, clientIp, hashIp: btoa })
  │   │   ├─ Upstash fails → in-memory fallback
  │   │   └─ limit exceeded → return { success: false, "Too many booking attempts..." }
  │   │
  │   ├─ detectSuspiciousActivity → console.warn (logs raw email + IP)
  │   │
  │   ├─ internalBookings.set(...) → console.info (logs raw email + IP)
  │   │
  │   ├─ getBookingProviders().createBookingWithAllProviders
  │   │   ├─ Promise.allSettled per provider
  │   │   │   ├─ Provider try/catch → console.error → { success: false, error }
  │   │   │   └─ rejected → mapped to { success: false, "Provider X failed" }
  │   │   └─ booking still stored even if all providers fail
  │   │
  │   └─ return { success: true, bookingId, confirmationNumber, providerResults }
  │
  ├─ catch (submitBookingRequest): console.error → "Failed to submit booking request..."
  │
  └─ catch (BookingForm): toast.error → "An unexpected error occurred..."
```

**Assessment:** Functional but weaker than contact. No CSRF gate. Uses `console.error`/`console.warn`/`console.info` instead of infra logger (no structured logging, no Sentry). PII logged in plain text. Provider errors are converted but not centrally logged.

#### 3.2.3 Swallowed Errors (Complete List)

| Location | What's Swallowed | Impact |
|----------|------------------|--------|
| `packages/infra/logger/client.ts` L33 | Sentry import/capture failure `.catch(() => {})` | No Sentry event; silent |
| `packages/infra/sentry/client.ts` | `loadSentry().catch(() => null)` | Tracing disabled; silent |
| `packages/infra/security/rate-limit.ts` L197–199 | Upstash `reset` failure | Rate limit state may not reset |
| `templates/*/lib/actions/supabase.ts` L83–84, L96–98 | `updateLeadWithSpan` after HubSpot sync | Sync status may be wrong in DB |
| `templates/*/features/booking/lib/booking-providers.ts` | Provider fetch/parse errors → `{ success: false }` | No centralized logging of provider failures |
| `templates/*/components/ErrorBoundary.tsx` L39–41, L56–58 | sessionStorage errors | Recovery attempts not persisted |

#### 3.2.4 Unhandled Edge Cases

| Edge Case | Location | Risk |
|-----------|----------|------|
| `response.json()` on malformed JSON from HubSpot/Supabase | `hubspot-client.ts`, `supabase-leads.ts` | Throws `SyntaxError`; caught by outer try/catch but not with a specific message |
| `getAllPosts()` / `getSearchIndex()` failure (fs errors) | `layout.tsx`, `search.ts`, `blog.ts` | No try/catch; layout can crash |
| `internalBookings` Map never pruned | `booking-actions.ts` | Memory growth in long-running process |
| `FormData.get()` returns `null` for missing fields | `booking-actions.ts` L79–82 | Passed to Zod; will fail validation, but `rawFormData` object has `null` values |
| `SERVICE_LABELS[booking.data.serviceType]` with unknown key | `booking-actions.ts` L278 | Returns `undefined`; no crash but incorrect display |
| `splitName('')` | `helpers.ts` | Returns `{ firstName: '', lastName: undefined }` |
| `headers()` outside request context | `submit.ts`, `booking-actions.ts` | Next.js throws; caught by outer try/catch |
| `validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN` undefined when HubSpot enabled | `hubspot-client.ts` | `Bearer undefined` sent to API; 401 response caught |

#### 3.2.5 Graceful Degradation Matrix

| Service | When Unavailable | Behavior | User Impact |
|---------|-----------------|----------|-------------|
| **Upstash Redis** | Connection failure | `console.warn` → in-memory rate limiter | Rate limits per-instance only (weaker in serverless) |
| **Supabase** | API error | Error propagates → generic message to user | Contact submission fails |
| **HubSpot** | API error | 3 retries with exponential backoff → marks lead `needs_sync` | Contact succeeds; CRM sync delayed |
| **Sentry** | Import or DSN failure | `.catch(() => null)` → continues without tracing | No error tracking; no user impact |
| **Crypto API** | Unavailable | Fallback nonce generated; last resort static nonce | Layout renders; CSP may be weaker |
| **sessionStorage** | Blocked/full | ErrorBoundary recovery attempts not persisted | Error recovery works; count resets |
| **localStorage** | Blocked/full | Analytics consent returns `null` | Consent treated as unknown; analytics off |
| **Booking providers** | API failures | `Promise.allSettled` → per-provider error results | Booking stored internally; provider sync failed |

---

### 3.3 Testing Coverage & Strategy (Deep Dive)

#### 3.3.1 Jest Configuration Assessment

| Setting | Value | Issue |
|---------|-------|-------|
| `testEnvironment` | `node` | No DOM — React component tests impossible without jsdom |
| `moduleNameMapper @/` | → `templates/hair-salon/` | **Hardcoded** — plumber tests using `@/` would resolve to hair-salon |
| `collectCoverageFrom` | hair-salon, ui, utils | **Missing:** `packages/infra/**`, `templates/plumber/**` |
| `setupFilesAfterSetup` | `jest.setup.js` | Loads `@testing-library/jest-dom`, suppresses React console |
| `jest.helpers.ts` (146 lines) | `createTestEnv`, `mockEnv`, `waitFor`, `assertThrows` | **Never imported** — dead code |

#### 3.3.2 Test Inventory (All 17 Files)

**Infra tests (7 files, 167 test cases):**

| Test File | Describes | Tests | What's Tested | What's NOT Tested |
|-----------|-----------|-------|---------------|-------------------|
| `csp.test.ts` | 7 | 21 | `createCspNonce`, `buildContentSecurityPolicy`, `buildReportToConfig`, `validateCspNonce`, `processCspViolationReport`, `buildLegacyContentSecurityPolicy` | `encodeBase64` edge cases, `getCryptoProvider` fallback |
| `security-headers.test.ts` | 7 | 24 | `getSecurityHeaders`, `getProductionSecurityHeaders`, `getDevelopmentSecurityHeaders`, `validateSecurityHeaders`, `getLegacySecurityHeaders` | `buildPermissionsPolicy` directly |
| `sanitize.test.ts` | 8 | 59 | `escapeHtml`, `sanitizeEmailSubject`, `textToHtmlParagraphs`, `sanitizeEmail`, `sanitizeName`, `sanitizeUrl` | **`sanitizeHtml`, `sanitizeInput`, `validateAndSanitize`** |
| `rate-limit.test.ts` | 9 | 24 | Presets, `hashIp`, `getClientIp`, `limitByIp`, `limitByUserId`, `limitByEmail`, `checkMultipleLimits`, `generateRateLimitHeaders`, `resetRateLimit` | Upstash distributed path (in-memory only) |
| `request-validation.test.ts` | 7 | 25 | `validateOrigin`, `getValidatedClientIp`, `createValidationConfig`, `validateRequest`, `TRUSTED_IP_HEADERS` | — (good coverage) |
| `logger.test.ts` | 2 | 5 | `logInfo`, `logError`, `logWarn`, `sanitizeLogContext` | **`log()` generic function** |
| `create-middleware.test.ts` | 4 | 9 | CVE-2025-29927, CSP header, security headers, `allowedOrigins` CSRF | Edge cases (malformed URL, missing headers) |

**Infra env tests (2 files, 36 test cases):**

| Test File | Describes | Tests | What's Tested |
|-----------|-----------|-------|---------------|
| `base.test.ts` | 4 | 14 | `baseEnvSchema`, `validateBaseEnv`, `safeValidateBaseEnv` |
| `rate-limit.test.ts` | 6 | 22 | `rateLimitEnvSchema`, `validateRateLimitEnv`, `safeValidateRateLimitEnv`, `isDistributedRateLimitingEnabled` |

**Template tests (8 files, 88 test cases):**

| Test File | Describes | Tests | What's Tested | Notes |
|-----------|-----------|-------|---------------|-------|
| `hair-salon/sanitize.test.ts` | 8 | 59 | Same as infra sanitize (imports from `@repo/infra`) | Duplicate of infra test |
| `hair-salon/search.test.ts` | 1 | 2 | `getSearchIndex`, blog slug mapping | File system dependent; brittle |
| `hair-salon/env.test.ts` | 7 | 23 | `validatedEnv`, `getNodeEnvironment`, `isProduction`, etc. | `process.env` mutation |
| `hair-salon/env-setup.ts` | — | — | Setup only (not a test) | |
| `hair-salon/blog.test.ts` | 1 | 4 | `getAllPosts`, `getAllCategories`, `getPostBySlug`, `getFeaturedPosts` | File system dependent |
| `plumber/sanitize.test.ts` | 8 | 59 | Same as hair-salon (minor style diffs: `.startsWith` vs `.indexOf`) | Duplicate |
| `plumber/search.test.ts` | 1 | 2 | Same as hair-salon | Duplicate |
| `plumber/blog.test.ts` | 1 | 4 | Same as hair-salon | Duplicate |

**Total: 17 test files, ~291 test cases.**

#### 3.3.3 Coverage Gap Analysis — Infra Exports

| Export | Module | Tested |
|--------|--------|--------|
| `createCspNonce` | csp | Yes |
| `buildContentSecurityPolicy` | csp | Yes |
| `buildReportToConfig` | csp | Yes |
| `validateCspNonce` | csp | Yes |
| `processCspViolationReport` | csp | Yes |
| `CSP_NONCE_HEADER` | csp | Yes |
| `CSP_REPORT_TO_HEADER`, `CSP_REPORT_ONLY_HEADER` | csp | **No** |
| `getSecurityHeaders` | security-headers | Yes |
| `validateSecurityHeaders` | security-headers | Yes |
| `escapeHtml` | sanitize | Yes |
| **`sanitizeHtml`** | sanitize | **No** |
| `sanitizeEmail`, `sanitizeName`, `sanitizeUrl` | sanitize | Yes |
| **`sanitizeInput`** | sanitize | **No** |
| **`validateAndSanitize`** | sanitize | **No** |
| `limitByIp`, `limitByUserId`, `limitByEmail` | rate-limit | Yes |
| `checkMultipleLimits` | rate-limit | Yes |
| `validateOrigin`, `getValidatedClientIp` | request-validation | Yes |
| `createMiddleware` | middleware | Yes |
| `logInfo`, `logWarn`, `logError` | logger | Yes |
| **`log`** (generic) | logger | **No** |
| `sanitizeLogContext` | logger | Yes |
| **`runWithRequestId`** | context | **No** |
| **`getRequestId`** | context | **No** |
| **`withServerSpan`** | sentry/server | **No** |
| **`sanitizeSentryEvent`** | sentry/sanitize | **No** |

**11 exported functions have no test coverage.**

#### 3.3.4 Server Action Test Coverage

| Action | Tested |
|--------|--------|
| `submitContactForm` | **No** |
| `submitBookingRequest` | **No** |
| `confirmBooking` | **No** |
| `cancelBooking` | **No** |
| `getBookingDetails` | **No** |

**Zero server actions are tested.** These are the primary attack surface (CSRF, rate limiting, validation, sanitization).

#### 3.3.5 Component Test Coverage

| Component | Tested |
|-----------|--------|
| ContactForm | **No** |
| BookingForm | **No** |
| Navigation | **No** |
| Footer | **No** |
| Hero | **No** |
| ErrorBoundary | **No** |
| SearchDialog | **No** |
| AnalyticsConsentBanner | **No** |
| All @repo/ui components | **No** |

**Zero components are tested.** The `testEnvironment: 'node'` setting prevents DOM-based tests. `@testing-library/react` and `jest-environment-jsdom` are in root devDependencies but unused.

#### 3.3.6 Critical Untested Paths (Ranked)

| Rank | Path | Impact if Broken |
|------|------|-----------------|
| 1 | `submitContactForm` (validation → CSRF → rate limit → sanitize → Supabase) | Contact leads lost; security bypass |
| 2 | `submitBookingRequest` (validation → rate limit → storage) | Booking integrity; rate limit bypass |
| 3 | `confirmBooking` / `cancelBooking` (IDOR, no auth) | Unauthorized booking changes |
| 4 | `getBlockedSubmissionResponse` (CSRF + honeypot) | CSRF protection failure |
| 5 | `buildSanitizedContactData` (sanitization pipeline) | XSS in stored data |
| 6 | `sanitizeHtml`, `sanitizeInput`, `validateAndSanitize` | Sanitization regressions |
| 7 | `withServerSpan`, `runWithRequestId` | Tracing/context failures |
| 8 | `sanitizeSentryEvent` | PII leakage to Sentry |
| 9 | ContactForm, BookingForm UI behavior | User-facing regressions |

#### 3.3.7 Test Quality Issues

| Issue | Location | Impact |
|-------|----------|--------|
| `blog.test.ts` and `search.test.ts` cause type-check failure | Both templates | Redeclared block-scoped variables (`path`, `templateRoot`, `originalCwd`); implicit `any` on callback params. Blocks CI. |
| `jest.helpers.ts` is dead code (146 lines, never imported) | Root | Wasted maintenance; suggests abandoned test helpers. |
| Hair-salon `sanitize.test.ts` duplicates infra `sanitize.test.ts` | Both templates | 59 test cases run twice; no additional coverage. |
| `moduleNameMapper @/` hardcoded to hair-salon | `jest.config.js` | Plumber tests using `@/` resolve incorrectly; works only because plumber tests use relative paths. |
| No Upstash integration tests | `rate-limit.test.ts` | Distributed rate limiting path entirely untested. |
| File system tests (`search.test.ts`, `blog.test.ts`) | Both templates | Brittle; depend on `process.cwd` override and real content files. |

#### 3.3.8 Test Strategy Recommendations

1. **Immediate:** Fix type-check failures in `blog.test.ts` and `search.test.ts` (rename variables, add types).
2. **High priority:** Add server action unit tests with mocked dependencies (Supabase, HubSpot, rate limit).
3. **High priority:** Add tests for untested sanitize exports (`sanitizeHtml`, `sanitizeInput`, `validateAndSanitize`).
4. **Medium:** Add component tests using jsdom (create a separate jest config or use `testEnvironment` override per file).
5. **Medium:** Add `packages/infra` and `templates/plumber` to `collectCoverageFrom`.
6. **Medium:** Delete or integrate `jest.helpers.ts`.
7. **Low:** Add Sentry/context tests (`withServerSpan`, `runWithRequestId`, `sanitizeSentryEvent`).
8. **Low:** Consider e2e tests (Playwright or Cypress) for contact and booking flows.

---

## Phase 4: Performance & Optimization (Deep Dive)

### 4.1 Rendering Strategy Assessment

#### 4.1.1 Server vs Client Component Boundary

Every page in the application uses Server Components for the page shell, with Client Components for interactive elements. This is the correct architectural decision for Next.js 15 / React 19.

**Complete Page Rendering Map:**

| Route | Component Type | Rendering Mode | Data Source | Why Dynamic? |
|-------|---------------|----------------|-------------|--------------|
| `/` (layout) | Server | **Dynamic** | `getSearchIndex()`, `headers()` | `headers()` for CSP nonce |
| `/` (page) | Server | Dynamic (inherited) | None; static content | Layout forces dynamic |
| `/about` | Server | Dynamic (inherited) | None; static content | Layout forces dynamic |
| `/contact` | Server | Dynamic (inherited) | `siteConfig` (static import) | Layout forces dynamic |
| `/book` | Server | Dynamic (inherited) | None | Layout forces dynamic |
| `/pricing` | Server | Dynamic (inherited) | Inlined pricing arrays | Layout forces dynamic |
| `/gallery` | Server | Dynamic (inherited) | Inlined `portfolioItems` | Layout forces dynamic |
| `/team` | Server | Dynamic (inherited) | Inlined `teamMembers` | Layout forces dynamic |
| `/services` | Server | Dynamic (inherited) | Inlined service arrays | Layout forces dynamic |
| `/services/haircuts` | Server | Dynamic (inherited) | Props to layout | Layout forces dynamic |
| `/blog` | Server | **Dynamic** | `getAllPosts()`, `searchParams` | `searchParams` + layout |
| `/blog/[slug]` | Server | **SSG** | `getPostBySlug()` (fs) | `generateStaticParams` |
| `/search` | Server | Attempts `force-static` | `getSearchIndex()` | Likely overridden by layout |
| `/sitemap.xml` | Route handler | Static at build | `getAllPosts()` | N/A |
| `/robots.txt` | Route handler | Static at build | `getPublicBaseUrl()` | N/A |
| `/api/og` | Edge route | Per-request | Query params | `runtime = 'edge'` |

**Critical Finding — All Routes Forced Dynamic:**

The root `app/layout.tsx` calls `await headers()` to extract the CSP nonce. In Next.js 15, calling `headers()` in a layout opts the **entire route tree** into dynamic rendering. This means:

- **12+ content pages** (about, contact, pricing, gallery, team, services, etc.) that contain **zero dynamic data** are rendered on every request instead of being served as static HTML.
- The `/search` page explicitly sets `export const dynamic = 'force-static'` but this is likely overridden by the parent layout's `headers()` call.
- Only `/blog/[slug]` with `generateStaticParams` may produce truly static pages (at build time).

**Impact:** Every request to any route incurs server-side React rendering overhead. For a content-heavy site with mostly static pages, this eliminates one of Next.js's strongest performance features — static HTML served from CDN.

**Recommendation:** Move CSP nonce handling into middleware (`packages/infra/middleware/create-middleware.ts`) where it already runs, and pass the nonce via a request header that the layout reads. This would allow all content pages to be statically generated.

#### 4.1.2 Client Component Inventory

| Component | `'use client'` | Hooks Used | Key Dependencies | Bundle Weight |
|-----------|:-:|------------|-----------------|:------:|
| `Navigation` | Yes | `useState`, `usePathname`, `useRef`×3, `useMemo`, `useEffect`×2 | `SearchDialog`, `lucide-react`, `@repo/ui` | Medium |
| `ContactForm` | Yes | `useState`×2, `useForm` (react-hook-form) | `react-hook-form`, `zod`, `Sentry`, analytics | **Heavy** |
| `BookingForm` | Yes | `useState`, `useTransition`, `useForm` | `react-hook-form`, `zod`, `sonner` (toast) | **Heavy** |
| `SearchDialog` | Yes | `useState`×3, `useRef`, `useMemo`, `useEffect`×2 | `lucide-react`, `@repo/ui` | Medium |
| `SearchPage` | Yes | `useState`, `useMemo`, `useSearchParams` | `next/navigation`, `lucide-react` | Medium |
| `AnalyticsConsentBanner` | Yes | `useState`×2, `useEffect` | `next/script`, GA4 consent lib | Medium |
| `InstallPrompt` | Yes | `useState`×2, `useEffect` | PWA APIs, `localStorage` | Low |
| `ErrorBoundary` | Yes | Class component (lifecycle) | `@repo/infra`, `sessionStorage` | Low |
| `Breadcrumbs` | Yes | `usePathname`, `useMemo` | `next/link`, `lucide-react` | Low |
| `Providers` | Yes | None (wrapper) | `ErrorBoundary`, `Breadcrumbs` | Wrapper only |
| `Accordion` (`@repo/ui`) | Yes | `useState` | None | Low |

**Non-client components sometimes misusing `React.memo`:**

| Component | `'use client'` | `React.memo` | Issue |
|-----------|:-:|:-:|-------|
| `Footer` | No (Server) | No | Correct |
| `Hero` | No (Server) | No | Correct |
| `SocialProof` | No (Server) | Yes | **Unnecessary** — `memo` has no effect on Server Components |
| `ValueProps` | No (Server) | Yes | **Unnecessary** — `memo` has no effect on Server Components |

**Recommendation:** Remove `React.memo` from `SocialProof` and `ValueProps` since they are Server Components where memoization is meaningless.

#### 4.1.3 Dynamic Imports (Code Splitting)

Two components use `next/dynamic`:

| Page | Import | `ssr` | Purpose |
|------|--------|:-----:|---------|
| `app/page.tsx` | `SocialProof` | `true` | Below-fold; code-split for smaller initial bundle |
| `app/page.tsx` | `FinalCTA` | `true` | Below-fold; code-split for smaller initial bundle |
| `app/blog/[slug]/page.tsx` | `BlogPostContent` | `true` | MDX rendering; heavy dependency split out |

**Assessment:** Good use of dynamic imports for below-fold and heavy components. However, `ssr: true` means the components are still rendered on the server and their JS is loaded eagerly. For true lazy loading of below-fold components, consider `ssr: false` with a loading skeleton (though this trades off SEO for performance).

**Missing opportunity:** `ContactForm` and `BookingForm` are the heaviest client bundles (react-hook-form + zod + form state) but are imported statically. Since forms are often below the fold, wrapping them in `next/dynamic` with a loading skeleton could improve initial page load for `/contact` and `/book`.

### 4.2 Caching Strategy Assessment

#### 4.2.1 React `cache()` Usage

| Location | Function | What's Cached | Scope |
|----------|----------|---------------|-------|
| `lib/search.ts` | `getSearchIndex()` wraps `buildSearchIndex()` | Search index built from all blog posts | **Per-request** only |
| `features/blog/lib/blog.ts` | `getAllPosts()` wraps `readAllPosts()` | All blog posts (fs reads) | **Per-request** only |
| `features/blog/lib/blog.ts` | `getPostBySlug()` wraps `readPostBySlug()` | Single post by slug | **Per-request** only |

**Critical Gap:** React `cache()` only deduplicates within a single request/render tree. There is **no cross-request caching** (`unstable_cache`, `revalidate`, or fetch cache) for any data. This means:

- Every dynamic page request re-reads all blog post files from disk (synchronous I/O).
- `getSearchIndex()` rebuilds the search index on every request.
- Blog post metadata (frontmatter parsing, reading time calculation) is recomputed each time.

For a site with dozens of blog posts, this adds measurable latency to every request.

**Recommendation:** Use `unstable_cache` (or the newer `use cache` directive in Next.js 15.1+) with a `revalidate` period for `readAllPosts` and `readPostBySlug`. Since blog content only changes at deploy time (files on disk), even a long revalidation window (e.g. 3600s) would be safe.

#### 4.2.2 Next.js Route-Level Caching

| Mechanism | Used? | Notes |
|-----------|:-----:|-------|
| `revalidate` (ISR) | No | No route exports `revalidate` |
| `generateStaticParams` (SSG) | Yes | Only `/blog/[slug]` |
| `dynamic = 'force-static'` | Yes | `/search` page, but likely overridden by layout |
| `revalidatePath` (on-demand) | Yes | Booking actions call `revalidatePath('/book')` and `revalidatePath('/booking-confirmation')` after mutations |
| Fetch cache | No | No `fetch()` calls with `next.revalidate` or `next.tags` |

**Assessment:** The caching strategy is minimal. ISR is not used anywhere. The combination of dynamic layout + no `unstable_cache` means the app operates essentially as a fully server-rendered application with no static optimization beyond the blog post SSG.

#### 4.2.3 Rate Limit Store Caching

The `RateLimiterFactory` (in `packages/infra/security/rate-limit.ts`) implements instance caching:

```
static instances: { [key: string]: RateLimiter } = {};
```

- **Key:** `${preset}-${JSON.stringify(config)}` — bounded by preset/config combinations (~6 presets).
- **Upstash fallback:** If Redis is unavailable, creates an `InMemoryRateLimiter` and caches it. This is a good graceful degradation pattern.
- **Issue:** The `InMemoryRateLimiter.limits` object (line 101) grows with unique identifiers. Cleanup only happens when an expired entry is accessed — there is **no periodic sweep**. Over time, stale entries accumulate.

### 4.3 Algorithm & Data Structure Analysis

#### 4.3.1 Algorithm Complexity Inventory

| Location | Function | Complexity | Concern |
|----------|----------|:----------:|---------|
| `blog.ts:135–156` | `readAllPosts()` | O(f) per file + O(p log p) sort | Sync I/O per file |
| `blog.ts:176` | `readPostBySlug()` | O(p) linear scan | Calls `readAllPosts().find()` instead of Map lookup |
| `search.ts:96–114` | `buildSearchIndex()` | O(p) | Acceptable |
| `rate-limit.ts:267–277` | `hashIp()` | O(n) n=IP length | Non-cryptographic; fine for rate limiting |
| `rate-limit.ts:293–309` | `getClientIp()` | O(k) k=7 headers | Fixed small array |
| `rate-limit.ts:390–447` | `checkMultipleLimits()` | O(m) sequential | Could parallelize independent checks |
| `sanitize.ts:114–147` | `sanitizeHtml()` | O(n) per pass × 2 | Two regex passes over HTML |
| `sanitize.ts:88` | `escapeHtml()` | O(n) | Efficient single-pass replace |
| `logger/index.ts:128–152` | `sanitizeLogContext()` | O(nodes × depth) | **No recursion depth limit** |
| `csp.ts:38–42` | `encodeBase64()` | **O(n²)** | String concat in loop |
| `csp.ts:99–134` | `buildContentSecurityPolicy()` | O(d) d≈12 | Array `push` + `join` — good |

**O(n²) Issue — `encodeBase64()`** (`packages/infra/security/csp.ts:38–42`):

```ts
// Current: string concatenation in loop — O(n²)
let binary = '';
bytes.forEach((byte) => {
  binary += String.fromCharCode(byte);
});
```

For the current use case (16 bytes for CSP nonce), the impact is negligible. However, the pattern is anti-idiomatic and would degrade for larger inputs.

**Fix:** `Array.from(bytes, b => String.fromCharCode(b)).join('')` — O(n).

**No Recursion Depth Limit — `sanitizeLogContext()`** (`packages/infra/logger/index.ts`):

`sanitizeValue()` recurses into nested objects/arrays with no depth cap. A deeply nested object (e.g. a circular-like graph or a very deep error chain) could cause a stack overflow.

**Fix:** Add a `maxDepth` parameter (e.g. 10) and return `'[too deep]'` when exceeded.

#### 4.3.2 Data Structure Optimization Opportunities

| Location | Current | Optimal | Impact |
|----------|---------|---------|--------|
| `sanitize.ts:47` | `ALLOWED_HTML_TAGS` = Array + `indexOf` | `Set` + `.has()` | O(t) → O(1) lookup |
| `sanitize.ts:48` | `ALLOWED_HTML_ATTRIBUTES` = Array + `indexOf` | `Set` + `.has()` | O(a) → O(1) lookup |
| `blog.ts:176` | `readAllPosts().find(p => p.slug === slug)` | `Map<slug, Post>` | O(p) → O(1) lookup |
| `logger/index.ts:48–62` | `SENSITIVE_KEY_SUBSTRINGS` = Array + `.some()` | Pre-compiled regex | Marginal improvement |

#### 4.3.3 Unbounded Data Structures (Memory Leak Risk)

| Location | Structure | Growth Pattern | Eviction | Risk |
|----------|-----------|---------------|----------|:----:|
| `booking-actions.ts:27` | `internalBookings` Map | Every booking submission | **None** | **High** |
| `rate-limit.ts:101` | `InMemoryRateLimiter.limits` | Every unique identifier | Only on access (expired) | **Medium** |
| `rate-limit.ts:208` | `RateLimiterFactory.instances` | Per preset/config combo | Manual `clearCache()` only | Low (bounded) |

**`internalBookings`** is the most serious: it grows without bound, has no TTL, no max size, and no eviction policy. In a long-running server, this Map accumulates all booking data in memory indefinitely.

**`InMemoryRateLimiter.limits`** cleans up entries only when they are individually accessed after expiration. If identifiers are not revisited (e.g. one-time visitors), their entries remain forever.

**Recommendation for both:**
1. Add a periodic cleanup interval (e.g. every 5 minutes, sweep all entries and delete expired ones).
2. Add a max size with LRU eviction.
3. For `internalBookings`: replace with a persistent store (Supabase) as a critical priority.

### 4.4 I/O Efficiency Analysis

#### 4.4.1 Synchronous File System Reads

`features/blog/lib/blog.ts` uses synchronous Node.js APIs:

| Line | API | Operation |
|------|-----|-----------|
| 138 | `fs.existsSync(postsDirectory)` | Check if posts directory exists |
| 141 | `fs.readdirSync(postsDirectory)` | List all markdown files |
| 147 | `fs.readFileSync(fullPath, 'utf8')` | Read each post file |

**Impact:** Every call to `readAllPosts()` blocks the Node.js event loop while reading every blog post file sequentially. With React `cache()` only deduplicating per-request (and no `unstable_cache`), this happens on **every page request** for routes that call `getAllPosts()` or `getSearchIndex()` (which includes the root layout via search index).

**Quantified Impact:** For 20 blog posts averaging 5KB each:
- ~20 synchronous file reads per request
- ~100KB of I/O per request
- Blocks the event loop for the entire duration
- `gray-matter` parsing + `reading-time` calculation per file

**Recommendation:**
1. **Short-term:** Add `unstable_cache` with a long revalidation period — blog content only changes at deploy time.
2. **Long-term:** Switch to `fs.promises.readdir` + `Promise.all(files.map(f => fs.promises.readFile(f)))` for parallel async reads.

#### 4.4.2 Sequential vs Parallel API Calls

| Flow | Pattern | Could Parallelize? |
|------|---------|:------------------:|
| Contact: `insertLead` → `syncHubSpotLead` | Sequential | No (HubSpot needs lead ID) |
| HubSpot: `searchContact` → `upsertContact` | Sequential | No (upsert depends on search) |
| HubSpot: retry loop (up to 3 attempts) | Sequential with exponential backoff | N/A (by design) |
| Rate limit: email check → IP check | Sequential | **Yes** |
| Booking providers: all providers | `Promise.allSettled` | Already parallel |

**Rate Limit Sequential Checks** (`rate-limit.ts:513–528`):

```ts
// legacyRateLimit.checkRateLimit runs email then IP sequentially
const emailResult = await limitByEmail(email);
if (!emailResult.success) return false;
const ipResult = await limitByIp({ 'x-forwarded-for': clientIp });
return ipResult.success;
```

The email and IP rate limits are independent checks. They could be run in parallel with `Promise.all`. However, the "fail fast" behavior (skip IP check if email fails) is a minor optimization. For Upstash Redis, each check is a network round-trip, so parallelizing could halve latency.

**The `checkMultipleLimits()` function** (lines 390–447) has the same issue — it runs all checks sequentially in a `for` loop with fail-fast. Converting to parallel execution with early termination via `Promise.race` or `Promise.allSettled` would reduce total latency.

#### 4.4.3 External API Call Patterns

**HubSpot Integration (contact flow):**

| Step | API Call | Timing |
|------|----------|--------|
| 1 | `searchHubSpotContact(email)` | ~200-500ms (search API) |
| 2 | `upsertHubSpotContact(properties)` | ~200-500ms (create/update API) |
| 3 | Retry on failure (up to 3 attempts) | Exponential backoff: 1s, 2s, 4s (capped at 4s) |
| 4 | `updateSupabaseLead(status)` | ~100-200ms (update sync status) |

**Total worst case:** ~1s (success) to ~8s (3 retries with backoff).

**Good patterns:**
- Idempotency keys for HubSpot upserts prevent duplicates on retries.
- Exponential backoff with max delay cap.
- Retry result tracked (attempt count stored in Supabase).

**Missing patterns:**
- No request timeouts on `fetch()` calls. A hung HubSpot/Supabase API could block the server action indefinitely.
- No circuit breaker pattern — if HubSpot is down, every contact submission still attempts 3 retries.
- `buildHubSpotHeaders()` is called multiple times per flow (search + upsert) — minor but could be cached per-call.

**Booking Provider Integration:**

| Pattern | Implementation | Assessment |
|---------|---------------|------------|
| Parallel execution | `Promise.allSettled` over all providers | Good |
| Provider count | 3 providers (Mindbody, Vagaro, Square) | Good; not excessive |
| Error isolation | Each provider catches its own errors | Good |
| Connection reuse | Standard `fetch()` | Node.js 18+ keeps connections by default |

**Issue:** All 3 booking providers are called on every submission regardless of whether they are enabled/configured. Each disabled provider immediately returns `{ success: false, error: 'X not configured' }`, which is fast but unnecessary. Pre-filtering to only call enabled providers would be cleaner.

**Missing:** No fetch timeouts. If any provider API hangs, `Promise.allSettled` waits indefinitely.

**Supabase Integration:**

| Pattern | Implementation | Assessment |
|---------|---------------|------------|
| Headers | Rebuilt per-call via `buildSupabaseHeaders()` | Minor overhead |
| Connection | Standard `fetch()` to REST API | No pooling needed for REST |
| Error handling | Status check + error text extraction | Good |
| Validation | Response validation (checks for valid lead ID) | Good |

### 4.5 Middleware Per-Request Overhead

`packages/infra/middleware/create-middleware.ts` runs on every request:

| Operation | Cost | Notes |
|-----------|:----:|-------|
| Clone headers + strip `x-middleware-subrequest` | O(h) | h = header count; necessary |
| Build `allowedSet` from `allowedOrigins` | O(o) | **Rebuilt every request** |
| `createCspNonce()` — 16 random bytes + base64 | ~μs | Crypto operation; small |
| `buildContentSecurityPolicy()` — array joins | O(12) | 12 CSP directives |
| Set security headers (6-8 headers) | O(1) each | Necessary |
| Total | **~50-100μs** | Acceptable for middleware |

**Optimization — `allowedSet` rebuilt per request** (lines 72-74):

```ts
// This runs on EVERY request, but allowedOrigins is static config
const allowedSet = new Set(
  (config?.allowedOrigins || []).map((o) => normalizeOrigin(o))
);
```

The `allowedOrigins` array is passed as config when the middleware is created. It never changes between requests. Building the `Set` once at middleware creation time and closing over it would avoid repeated allocation.

### 4.6 Bundle Size & Build Analysis

#### 4.6.1 Next.js Configuration

`templates/hair-salon/next.config.js`:

```js
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/utils'],
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
```

**Assessment:**
- `transpilePackages` includes `@repo/ui` and `@repo/utils` but **not** `@repo/infra` or `@repo/shared`. These are consumed as source and transpiled by Next.js automatically via workspace resolution, but explicit inclusion in `transpilePackages` can improve build caching.
- `ignoreDuringBuilds: false` for both ESLint and TypeScript is correct for quality — but currently **build will fail** due to known type-check errors in test files (though test files may not be included in the build `tsconfig`).
- No `experimental` features, `images` configuration, or `webpack` customizations — very minimal config.

**Missing optimizations:**
- No `images.remotePatterns` configuration (OG images reference external URLs).
- No `output: 'standalone'` for Docker deployment optimization.
- No `poweredByHeader: false` (minor security/performance).
- No `compress: false` (when behind a CDN that handles compression).

#### 4.6.2 Build Output Observations

From Turbo build logs:

| Route | Size (First Load JS) | Notes |
|-------|-----:|-------|
| `/book` | 9.37 kB | Heaviest page (BookingForm) |
| `/contact` | 2.49 kB | ContactForm (react-hook-form shared chunk) |
| Middleware | 54.9 kB | Security headers, CSP, rate limiting |

**Build warnings identified:**
- Dynamic `require()` expressions in OpenTelemetry and Sentry — these pull in Express/Fastify/Prisma instrumentations even when unused, harming tree-shaking.
- Prisma instrumentation loaded but no Prisma usage in the codebase.

**Recommendation:** Configure Sentry's `webpack` plugin or `serverExternalPackages` to exclude unused instrumentations.

#### 4.6.3 Heavy Client Dependencies

| Dependency | Used By | Approx. Bundle Cost |
|------------|---------|----:|
| `react-hook-form` | ContactForm, BookingForm | ~25 kB (gzipped) |
| `zod` | Forms, env validation | ~13 kB (gzipped) |
| `@sentry/nextjs` | Error tracking | ~30 kB (gzipped) |
| `next-mdx-remote` | Blog posts | ~15 kB (gzipped) |
| `sonner` | BookingForm toasts | ~5 kB (gzipped) |
| `lucide-react` | Icons (Navigation, Search, etc.) | Tree-shakeable per icon |

**Assessment:** The heaviest client-side dependencies are `react-hook-form`, `zod`, and `@sentry/nextjs`. Since `zod` is used server-side for env validation, it should be checked whether it's being bundled into client chunks unnecessarily (it should only be in the ContactForm/BookingForm client bundles where form schemas are validated).

### 4.7 Font & Image Optimization

#### 4.7.1 Font Loading Strategy

| Font | Source | Weights | Display | CSS Variable |
|------|--------|---------|---------|--------------|
| Inter | `next/font/google` | Default (400) | `swap` | `--font-inter` |
| IBM Plex Sans | `next/font/google` | 400, 600, 700 | `swap` | `--font-plex` |

**Assessment:** Excellent. Using `next/font/google` automatically self-hosts fonts, eliminating the Google Fonts network request. `display: 'swap'` prevents invisible text during load. CSS variables allow flexible application.

#### 4.7.2 Image Optimization

| Location | `next/image` | `priority` | `sizes` | `placeholder` |
|----------|:---:|:---:|:---:|:---:|
| Hero component | Yes | Yes | `(min-width: 1280px) 592px, (min-width: 1024px) 50vw, 0px` | No |
| Gallery page | **No** | - | - | - |
| Team page | **No** | - | - | - |
| Blog posts | **No** | - | - | - |
| OG images | Via `ImageResponse` (Edge) | N/A | N/A | N/A |

**Issues:**
- Gallery and Team pages use **placeholder `<div>` elements** instead of real images. When real images are added, they must use `next/image`.
- Blog post pages have no hero/featured images rendered in the page body.
- Hero image lacks `placeholder="blur"` for better perceived loading.

**Recommendation:** When real images are added to Gallery/Team, use `next/image` with proper `sizes` attributes and consider `placeholder="blur"` with `blurDataURL` for above-the-fold images.

### 4.8 Performance Issue Summary

| # | Issue | Severity | Location | Impact |
|---|-------|:--------:|----------|--------|
| 1 | All routes forced dynamic by `headers()` in layout | **Critical** | `app/layout.tsx` | Every request triggers SSR; eliminates static CDN serving |
| 2 | No cross-request caching for blog/search data | **High** | `blog.ts`, `search.ts` | Sync I/O + parsing on every request |
| 3 | `internalBookings` Map grows without bound | **High** | `booking-actions.ts:27` | Memory leak in long-running server |
| 4 | `InMemoryRateLimiter.limits` no periodic cleanup | **Medium** | `rate-limit.ts:101` | Gradual memory growth |
| 5 | Synchronous file reads for blog posts | **Medium** | `blog.ts:141,147` | Blocks event loop during I/O |
| 6 | No fetch timeouts on external API calls | **Medium** | `hubspot-client.ts`, `supabase-leads.ts`, `booking-providers.ts` | Hung API can block server action indefinitely |
| 7 | Rate limit checks run sequentially | **Low** | `rate-limit.ts:513–528` | Extra latency on each form submission |
| 8 | `allowedSet` rebuilt per request in middleware | **Low** | `create-middleware.ts:72–74` | Unnecessary allocation |
| 9 | O(n²) string concat in `encodeBase64()` | **Low** | `csp.ts:38–42` | Negligible for 16 bytes; bad pattern |
| 10 | `sanitizeLogContext()` no recursion depth limit | **Low** | `logger/index.ts` | Stack overflow risk on deep objects |
| 11 | `React.memo` on Server Components | **Info** | `SocialProof`, `ValueProps` | No effect; misleading |
| 12 | Heavy forms not dynamically imported | **Info** | `ContactForm`, `BookingForm` | Could improve initial page load |
| 13 | All booking providers called regardless of enabled state | **Info** | `booking-providers.ts:372` | Unnecessary function calls |

### 4.9 Recommended Fixes with Code Examples

#### Fix 1: Move CSP nonce out of layout (Critical)

**Current** — `app/layout.tsx`:
```ts
const headersList = await headers();
const nonce = headersList.get('x-csp-nonce') || '';
```

**Recommended** — Pass nonce via a server-only module that reads from middleware-set header without calling `headers()` in layout. Alternatively, use the `next/headers` `cookies()` approach with middleware setting a cookie, or use the newer Next.js 15.1+ `connection()` API that doesn't opt into full dynamic rendering.

#### Fix 2: Add cross-request caching for blog data (High)

**Current:**
```ts
export const getAllPosts = cache(readAllPosts);
```

**Recommended:**
```ts
import { unstable_cache } from 'next/cache';

export const getAllPosts = unstable_cache(
  readAllPosts,
  ['blog-all-posts'],
  { revalidate: 3600 } // 1 hour; blog changes only at deploy
);
```

#### Fix 3: Add fetch timeouts to external API calls (Medium)

**Recommended pattern for all `fetch()` calls:**
```ts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  // ... handle response
} finally {
  clearTimeout(timeout);
}
```

#### Fix 4: Parallelize independent rate limit checks (Low)

**Current:**
```ts
const emailResult = await limitByEmail(email);
if (!emailResult.success) return false;
const ipResult = await limitByIp({ 'x-forwarded-for': clientIp });
return ipResult.success;
```

**Recommended:**
```ts
const [emailResult, ipResult] = await Promise.all([
  limitByEmail(email),
  limitByIp({ 'x-forwarded-for': clientIp }),
]);
return emailResult.success && ipResult.success;
```

---

## Phase 5: Scalability & Extensibility (Deep Dive)

### 5.1 Horizontal Scaling Assessment

#### 5.1.1 Module-Level Mutable State Inventory

Every module-level mutable variable represents state that is **not shared** across server instances. A complete audit reveals:

| Location | Variable | Type | Persistence | Shared Across Instances? |
|----------|----------|------|:-----------:|:------------------------:|
| `booking-actions.ts:27` | `internalBookings` | `Map<string, Booking>` | In-memory only | No |
| `rate-limit.ts:101` | `InMemoryRateLimiter.limits` | `{ [key]: { count, resetAt } }` | In-memory only | No |
| `rate-limit.ts:208` | `RateLimiterFactory.instances` | `{ [key]: RateLimiter }` | In-memory only | No |
| `booking-providers.ts:391` | `_bookingProviders` | `BookingProviders \| null` | Singleton | No (but stateless) |

**Impact of running multiple instances:**

| Scenario | What Happens |
|----------|--------------|
| User submits booking on Instance A, tries to view on Instance B | "Booking not found" — data only exists in Instance A's Map |
| User hits rate limit on Instance A, retries on Instance B | Rate limit resets — Instance B has a fresh `InMemoryRateLimiter` |
| Instance A restarts | All bookings and rate limit data lost |
| Load balancer distributes across 3 instances | Rate limits are 3× more permissive (each instance tracks independently) |

#### 5.1.2 Upstash Redis: Configured But Never Used

A critical discovery from the scaling analysis: the `checkRateLimit()` function (the one actually called by both contact and booking flows) **never passes environment variables** to the rate limiter factory:

```ts
// rate-limit.ts:513-528 — legacyRateLimit.checkRateLimit
const emailResult = await limitByEmail(email);        // No env passed
const ipResult = await limitByIp({ ... });             // No env passed
```

`limitByEmail()` and `limitByIp()` call `RateLimiterFactory.create(preset, customConfig, env)` where `env` defaults to `undefined`. The factory only creates an `UpstashRateLimiter` when `env?.UPSTASH_REDIS_REST_URL && env?.UPSTASH_REDIS_REST_TOKEN` — so it **always falls back to `InMemoryRateLimiter`**, even when Upstash credentials are configured in environment variables.

**Severity:** High. The Upstash dependency exists, the configuration exists, but the distributed rate limiting is never activated. This means rate limiting is purely per-instance and ineffective in any multi-instance or serverless deployment.

**Fix:** Pass `process.env` (or the relevant validated env fields) through the `checkRateLimit` → `limitByEmail`/`limitByIp` call chain.

#### 5.1.3 Serverless (Vercel) Compatibility

| Component | Serverless Compatible? | Issue |
|-----------|:---------------------:|-------|
| Supabase REST (`fetch`) | Yes | Stateless HTTP; designed for serverless |
| Upstash Redis REST | Yes | Designed for serverless — but never activated (see above) |
| CSP nonce (`crypto.getRandomValues`) | Yes | Available in Edge and Node runtimes |
| Middleware | Yes | Uses only `NextRequest`/`NextResponse`; Edge-compatible |
| Blog file reads (`fs.readFileSync`) | **Partial** | Works if content is bundled at build; fails for dynamic reads in serverless |
| `internalBookings` Map | **No** | Lost between invocations; useless in serverless |
| `InMemoryRateLimiter` | **No** | New instance per cold start; no rate limiting in serverless |
| `_bookingProviders` singleton | Yes | Stateless; re-created per cold start is fine |
| `AsyncLocalStorage` (request context) | Yes | Per-request; no cross-invocation dependency |
| `validatedEnv` (module-level) | Yes | Re-evaluated per cold start; adds minor latency |

**Conclusion:** The app is **partially serverless-compatible**. The contact form flow (Supabase + HubSpot via `fetch`) would work correctly on Vercel. The booking flow is fundamentally broken in serverless due to `internalBookings` and `InMemoryRateLimiter`.

#### 5.1.4 Docker Deployment Gap

The `templates/hair-salon/Dockerfile` references `.next/standalone`:

```dockerfile
COPY --from=builder /app/templates/hair-salon/.next/standalone ./
```

But `next.config.js` does **not** set `output: 'standalone'`. This means the `.next/standalone` directory is never produced, and the Docker build will fail when trying to copy from it.

**Fix:** Add `output: 'standalone'` to `next.config.js`.

#### 5.1.5 Server-Side Session State

No server-side session stores exist. All user state is client-side:

| State | Storage | Server-side? |
|-------|---------|:------------:|
| Analytics consent | Cookie + `localStorage` | No |
| Error recovery state | `sessionStorage` | No |
| PWA install dismissed | `localStorage` | No |
| Search query | URL `searchParams` | No |

This is good for horizontal scaling — no sticky sessions required.

### 5.2 Vertical Scaling Constraints

#### 5.2.1 Memory-Bound Operations

| Component | Memory Behavior | Scaling Risk |
|-----------|----------------|:------------:|
| `internalBookings` Map | Grows with every booking, never shrinks | **High** |
| `InMemoryRateLimiter.limits` | Grows with unique identifiers, cleanup only on access | **Medium** |
| `readAllPosts()` (cached per-request) | All blog posts loaded into memory per request | **Low** (bounded by post count) |
| `buildSearchIndex()` | Full search index in memory per request | **Low** (bounded by post count) |

#### 5.2.2 CPU-Bound Operations

| Operation | Location | Cost |
|-----------|----------|:----:|
| Zod schema validation (env) | `packages/infra/env/validate.ts` | One-time at startup |
| Zod form validation | `ContactForm`, `BookingForm`, `booking-schema.ts` | Per submission |
| `gray-matter` + `reading-time` parsing | `blog.ts:147-153` | Per blog post per request |
| CSP nonce generation (`getRandomValues`) | `csp.ts` | Per request (~μs) |
| `sanitizeLogContext()` recursion | `logger/index.ts` | Per log call with context |
| MDX rendering (`next-mdx-remote`) | `BlogPostContent` | Per blog post view |

None are computationally expensive in isolation; the main concern is the cumulative per-request cost of blog parsing when no cross-request cache exists.

#### 5.2.3 I/O-Bound Operations

| Operation | Type | Latency |
|-----------|------|:-------:|
| Supabase REST (insert/update lead) | Network | ~100-300ms |
| HubSpot API (search + upsert) | Network | ~200-500ms each |
| HubSpot retry (up to 3 attempts) | Network + backoff | Up to ~8s worst case |
| Booking providers (3 parallel) | Network | ~200-500ms per provider |
| Blog file reads (`fs.readFileSync`) | Disk | ~1-5ms per file |
| Upstash Redis (if activated) | Network | ~5-20ms |

The contact form submission critical path is dominated by HubSpot API latency: Supabase insert (~200ms) → HubSpot search + upsert (~400-1000ms) → Supabase update (~200ms). Total: **~800ms-1.4s on success**, up to **~8s with retries**.

### 5.3 Template System & Extensibility

#### 5.3.1 Template Architecture

Templates are full Next.js 15 applications that share infrastructure via workspace packages:

```
Template = Site Config + Features + Shared Packages
         ↓              ↓            ↓
  site.config.ts   features/*   @repo/ui, @repo/utils,
  lib/env.ts                    @repo/infra, @repo/shared
  middleware.ts
```

**What makes a template a template:**

1. Implements `SiteConfig` interface from `@repo/shared/types` (business name, nav, contact, SEO, theme)
2. Uses `createMiddleware()` from `@repo/infra` for security headers
3. Uses `validateEnv()` from `@repo/infra/env` for environment validation
4. Extends `@repo/config/tailwind-preset` for consistent design tokens
5. Contains `features/` directory with domain-specific modules

**Customizable vs hardcoded:**

| Customizable (via `site.config.ts`) | Hardcoded (requires code changes) |
|--------------------------------------|----------------------------------|
| Business name, tagline, description | App directory structure (`app/`) |
| Navigation links, social links | Feature module wiring (imports) |
| Contact info (email, phone, address) | Middleware configuration |
| SEO metadata, keywords | Env variable names |
| Theme colors (HSL values) | Component hierarchy |
| Conversion flow type (booking/quote/contact/dispatch) | Package dependencies |
| Footer columns, hours | Route structure |

#### 5.3.2 Creating a New Template (Friction Analysis)

Steps to create a third template (e.g. `templates/dentist`):

| Step | Effort | Risk |
|------|:------:|:----:|
| 1. Copy `templates/hair-salon` to `templates/dentist` | Low | High (copies all 85+ files including hair-salon-specific content) |
| 2. Update `package.json` (name, port) | Low | Low |
| 3. Customize `site.config.ts` | Low | Low |
| 4. Update `lib/env.ts` (if different features needed) | Low | Low |
| 5. Replace all content pages (about, services, pricing, team, gallery) | **High** | **High** (content is hardcoded in page components, not data-driven) |
| 6. Update blog posts in `content/blog/` | Medium | Low |
| 7. Update booking service types in `booking-schema.ts` | Medium | Medium |
| 8. Update SEO keywords throughout | Medium | Medium (scattered across pages) |
| 9. Update OG image colors in `app/api/og/route.tsx` | Low | Low |

**Key friction points:**
- **Step 5 is the bottleneck.** Content is embedded directly in React components (e.g., `app/pricing/page.tsx` has hardcoded pricing tiers as JSX arrays). There is no content layer or CMS integration. Each template requires rewriting page content.
- Step 1 copies ~6,500+ lines of duplicated code. Changes to shared behavior (e.g., the booking flow) must be applied to every template.
- The plumber template still contains hair-salon-specific content in many places (incomplete fork).

#### 5.3.3 Feature Module Design Assessment

**Feature inventory (hair-salon):**

| Feature | Directory | Structure | Self-contained? |
|---------|-----------|-----------|:---------------:|
| Booking | `features/booking/` | `lib/`, `components/` | Mostly (depends on `@/lib/env`) |
| Contact | `features/contact/` | `components/` | No (relies on `lib/actions/`) |
| Blog | `features/blog/` | `lib/`, `components/`, `__tests__/` | Mostly (reads from `content/blog/`) |
| Search | `features/search/` | `components/` | No (depends on blog via `getSearchIndex`) |
| Analytics | `features/analytics/` | `lib/` | Yes |
| HubSpot | `features/hubspot/` | `lib/` | Yes |
| Supabase | `features/supabase/` | `lib/` | Yes |

**Cross-feature coupling:**

```
search ──→ blog (getAllPosts for search index)
contact ──→ analytics (trackFormSubmission)
contact ──→ lib/actions ──→ supabase + hubspot
booking ──→ lib/env (validatedEnv)
booking ──→ booking-providers
```

**Can features be removed without breaking others?**

| Remove | Impact |
|--------|--------|
| Booking | Safe if routes and imports removed |
| Blog | Breaks search (depends on `getAllPosts`), breaks layout (search index) |
| Search | Safe; remove from Navigation |
| Analytics | Must remove imports from ContactForm |
| HubSpot | Must update `lib/actions/supabase.ts` (syncs to HubSpot after lead insert) |

**Assessment:** Features are partially modular. Blog is a dependency hub — removing it requires updating search and layout. Contact flow is tightly coupled to both Supabase and HubSpot. There is no feature registry or dynamic feature loading.

#### 5.3.4 Booking Provider Extensibility

The booking provider system uses a closed factory pattern:

```ts
export type BookingProvider = 'mindbody' | 'vagaro' | 'square' | 'calendly';

class BookingProviders {
  private mindbody: MindbodyProvider;
  private vagaro: VagaroProvider;
  private square: SquareProvider;
  // No calendly implementation
}
```

**Adding a new provider requires:**
1. Add to the `BookingProvider` union type
2. Create a new provider class
3. Add to `BookingProviders` constructor
4. Add to `createBookingWithProvider` switch statement
5. Add to `getProviderStatus` return value
6. Add to the `providers` array in `createBookingWithAllProviders`

This is a textbook Open/Closed Principle violation — the class must be modified for every new provider.

**Recommended pattern:**

```ts
interface IBookingProvider {
  name: string;
  createBooking(data: BookingFormData): Promise<BookingProviderResponse>;
  isEnabled(): boolean;
}

class BookingProviderRegistry {
  private providers: IBookingProvider[] = [];
  register(provider: IBookingProvider) { this.providers.push(provider); }
  async createBookingWithAll(data: BookingFormData) {
    const enabled = this.providers.filter(p => p.isEnabled());
    return Promise.allSettled(enabled.map(p => p.createBooking(data)));
  }
}
```

### 5.4 Package Boundary Assessment

#### 5.4.1 Package Dependency Graph

```
@repo/utils          (leaf — no internal dependencies)
    ↑
@repo/ui             (depends on @repo/utils)
    ↑
@repo/infra          (depends on @repo/utils)
    ↑
@repo/integrations-supabase  (depends on @repo/infra, @repo/utils)
    ↑
templates/*          (depend on all of the above + @repo/shared)
```

**No circular dependencies** — the graph is a clean DAG.

#### 5.4.2 Package Export Boundary Violations

| Package | Declared Exports | Used Internal Paths | Violation? |
|---------|-----------------|---------------------|:----------:|
| `@repo/infra` | `.`, `./client`, `./context/request-context`, `./context/request-context.server` | `@repo/infra/env`, `@repo/infra/security/request-validation`, `@repo/infra/security/rate-limit` | **Yes** |
| `@repo/shared` | `./types`, `./site-config` | No violations observed | No |
| `@repo/ui` | `./src/index.ts` | No violations observed | No |
| `@repo/utils` | `./src/index.ts` | No violations observed | No |

Templates import `@repo/infra/env`, `@repo/infra/security/request-validation`, and other deep paths that are **not declared in `@repo/infra/package.json` exports**. This works because TypeScript path mapping (`@repo/infra/*` → `../../packages/infra/*`) bypasses the Node.js exports resolution. It would break if packages were published to a registry or if Node.js strict exports resolution were enforced.

**Fix:** Add explicit export entries to `@repo/infra/package.json`:

```json
{
  "exports": {
    ".": "./index.ts",
    "./client": "./client.ts",
    "./env": "./env/index.ts",
    "./security/*": "./security/*.ts",
    "./context/*": "./context/*.ts"
  }
}
```

#### 5.4.3 `packages/integrations/supabase` — Not in Workspace

`packages/integrations/supabase/` exists with a full implementation (`client.ts`, `leads.ts`, `types.ts`, `index.ts`) but:

1. The pnpm workspace glob is `packages/*` — this matches `packages/infra`, `packages/ui`, etc., but **not** `packages/integrations/supabase` (it would need `packages/integrations/*`).
2. Templates still use `features/supabase/lib/supabase-leads.ts` — the new integration package is not wired in.
3. TODO 1.3.4 ("Update templates to use `@repo/integrations-supabase`") is pending.

**Fix:** Add `packages/integrations/*` to `pnpm-workspace.yaml` and complete TODO 1.3.4.

### 5.5 Configuration & Environment Extensibility

#### 5.5.1 Environment Schema Composition

The env validation system is well-designed for extensibility:

```
createEnvSchema({
  required: {
    base: baseEnvSchema,        // NODE_ENV, etc.
    public: publicEnvSchema,    // NEXT_PUBLIC_* vars
  },
  optional: {
    rateLimit: rateLimitEnvSchema,   // UPSTASH_*
    supabase: supabaseEnvSchema,     // SUPABASE_*
    hubspot: hubspotEnvSchema,       // HUBSPOT_*
    booking: bookingEnvSchema,       // MINDBODY_*, VAGARO_*, SQUARE_*
    sentry: sentryEnvSchema,         // SENTRY_*
  }
})
```

**Adding a new integration (e.g., Mailchimp):**
1. Create `packages/infra/env/schemas/mailchimp.ts` with a Zod schema
2. Add it to `createEnvSchema({ optional: { mailchimp: mailchimpEnvSchema } })`
3. Feature flags automatically detect presence via `getFeatureFlags()`

This is a clean, composable pattern. The main limitation is that all schemas live in `@repo/infra` — a new integration's env schema must be added to the infra package rather than living with the integration package.

#### 5.5.2 Runtime Configuration Behavior

`validatedEnv` is evaluated **once** at module load time and cached as a constant:

```ts
// templates/hair-salon/lib/env.ts
export const validatedEnv = validateEnv() as CompleteEnv;
```

- Environment variable changes after process start are **not reflected**.
- Booking provider configuration is read from `validatedEnv` at first `getBookingProviders()` call and cached in the singleton.
- To pick up env changes, the process must restart (or a new serverless instance must cold-start).

This is acceptable for most deployments but means feature flag changes require a redeploy.

### 5.6 Technical Debt Inventory

#### 5.6.1 In-Code TODO/FIXME Comments

| File | Line | Text | Category |
|------|:----:|------|----------|
| `features/booking/components/BookingForm.tsx` (both templates) | 23 | `// TODO: Implement analytics tracking` | Feature gap |
| `packages/infra/security/csp.ts` | 91 | `// Development: allow unsafe-eval for Next.js HMR (temporary)` | Workaround |

Only **2 unique in-code TODOs** exist — the codebase is relatively clean of scattered TODO markers.

#### 5.6.2 Commented-Out Code

| File | Lines | Content | Why It Exists |
|------|:-----:|---------|---------------|
| `BookingForm.tsx` (both templates) | 24 | `// import { trackBookingEvent } from '...'` | Analytics not yet implemented |
| `BookingForm.tsx` (both templates) | 70-76 | `// trackBookingEvent('booking_attempted', ...)` | Stub for future analytics |
| `BookingForm.tsx` (both templates) | 95-102 | `// trackBookingEvent('booking_submitted', ...)` | Stub for future analytics |
| `BookingForm.tsx` (both templates) | 107-111 | `// trackBookingEvent('booking_error', ...)` | Stub for future analytics |
| `BookingForm.tsx` (both templates) | 119-123 | `// trackBookingEvent('booking_error', ...)` | Stub for future analytics |
| `booking-providers.ts` (both templates) | 4-13 | Commented Zod schema for provider config | Dead reference code |

All commented code relates to analytics stubs in BookingForm. This should be removed and tracked as a proper feature ticket instead.

#### 5.6.3 Type Assertion Workarounds

| Pattern | Count | Locations |
|---------|:-----:|-----------|
| `as any` | 7 | `submit.ts:31` (both), `BookingForm.tsx:52` (both), `rate-limit.ts:435`, test files |
| `as unknown` | 5 | `ContactForm.tsx:37` (both), `BookingForm.tsx:49` (both), test mocks |
| `limiter: any` | 2 | `rate-limit.ts:166,169` (Upstash Ratelimit type not imported) |

Most `as any` usages are workarounds for imprecise types. The `as unknown as Parameters<...>` pattern in forms is a react-hook-form / Zod resolver type compatibility issue.

#### 5.6.4 Deprecated Code Still In Use

| Location | Deprecated Item | Replacement | Still Used? |
|----------|----------------|-------------|:-----------:|
| `booking-providers.ts:407` | `bookingProviders` export (eager init) | `getBookingProviders()` (lazy) | Yes (at module level) |
| `rate-limit.ts:513` | `legacyRateLimit.checkRateLimit` | `limitByIp`, `limitByEmail` | Yes (via `checkRateLimit`) |
| `integrations/supabase/leads.ts` | Entire module (7 functions) | `client.ts` equivalents | No (templates still use `features/supabase`) |
| `sanitize.ts:388` | Generic sanitize export | Specific functions | Unclear |
| `security-headers.ts:226` | Legacy headers helper | `getSecurityHeaders` | Unclear |
| `csp.ts:233` | Legacy CSP helper | `buildContentSecurityPolicy` | Unclear |

The `bookingProviders` eager export (`line 407`) is particularly problematic — it calls `getBookingProviders()` at import time, which reads `validatedEnv` and can fail during build if env vars aren't set.

#### 5.6.5 Direct `process.env` Access (Bypassing Validated Env)

| File | Usage | Risk |
|------|-------|:----:|
| `submit.ts:31` (both templates) | `process.env.NODE_ENV as any` | Medium |
| `analytics.ts:7,11` (both templates) | `process.env.NODE_ENV` for `isDev`, `isTest` | Low |
| `site.config.ts:9` (both templates) | `process.env.NEXT_PUBLIC_SITE_URL` | Low |
| `logger/index.ts:12,16` | `process.env.NODE_ENV` | Low |
| `logger/client.ts:25` | `process.env.NEXT_PUBLIC_SENTRY_DSN` | Low |
| `middleware/create-middleware.ts:86` | `process.env.NODE_ENV` | Low |
| `integrations/supabase/leads.ts:23,37,78,132` | `process.env.SUPABASE_*` (deprecated module) | Medium |
| `integrations/supabase/client.ts:60-61` | `process.env.SUPABASE_*` (fallback) | Low |

Many `process.env.NODE_ENV` accesses are for basic dev/prod detection and are acceptable. The concerning ones are the Supabase direct access in the deprecated leads module.

#### 5.6.6 Raw `console` Usage (Bypassing Structured Logger)

| File | Occurrences | Should Use Logger? |
|------|:-----------:|:------------------:|
| `booking-actions.ts` (both templates) | 4 (`warn`, `info`, `error`×2) | **Yes** — PII logged |
| `booking-providers.ts` (both templates) | 3 (`error`×3) | **Yes** |
| `booking-schema.ts` (both templates) | 1 (`error`) | Yes |
| `rate-limit.ts` | 3 (`warn`×3) | Yes |
| `blog.ts` (both templates) | 1 (`warn`) | Yes |
| `env.public.ts` (both templates) | 1 (`error`) | Low priority |

The booking flow is the worst offender: `booking-actions.ts` uses `console.warn` and `console.info` with raw IP addresses and email addresses (PII), completely bypassing the structured logger's PII sanitization.

#### 5.6.7 Test File Anti-Patterns

| Pattern | Files | Issue |
|---------|:-----:|-------|
| `require()` instead of `import` | 8 test files | CJS in TypeScript; breaks type-checking |
| `module.exports` in .ts | 2 files (`env-setup.ts`) | CJS export in TypeScript |
| Missing type annotations | `blog.test.ts`, `search.test.ts` | Causes `TS7006` errors |
| Variable name conflicts | `blog.test.ts`, `search.test.ts` | Causes `TS2451` errors |

### 5.7 TODO.md Roadmap Progress Assessment

#### 5.7.1 Completion Status

| Phase | Tasks | Completed | Status |
|-------|:-----:|:---------:|--------|
| **1.1** Create `packages/infra/` | 14 | 14 | **100%** |
| **1.2** Env validation extraction | 6 | 6 | **100%** |
| **1.3** Supabase integration package | 4 | 3 | **75%** (1.3.4 pending: wire templates) |
| **1.4** HubSpot integration package | ~6 | 0 | **0%** |
| **1.5** Booking providers package | ~6 | 0 | **0%** |
| **1.6** Analytics package | ~6 | 0 | **0%** |
| **1.7** Shared feature packages | ~8 | 0 | **0%** |
| **1.8** Template cleanup | ~6 | 0 | **0%** |
| **1.9** Codebase analysis follow-ups | ~12 | 0 | **0%** |
| **Phases 2-7** | ~95 | 0 | **0%** |
| **Total** | **~163** | **~43** | **~26%** |

#### 5.7.2 Roadmap Items Referencing Non-Existent Code

| TODO Item | Referenced Path | Exists? |
|-----------|----------------|:-------:|
| 1.7.5 | `packages/features/gallery` | No |
| 1.7.6 | `packages/features/team` | No |
| 1.7.7 | `packages/features/reviews` | No |
| 3.1.1 | `packages/config/types/site-config.ts` | No (lives in `templates/shared/types/`) |
| 4.1.1 | `CLIENT_SITE_STRUCTURE.md` | No |
| Various | `clients/example-client` | No (only `clients/README.md`) |

### 5.8 Scalability Issue Summary

| # | Issue | Severity | Category | Impact |
|---|-------|:--------:|----------|--------|
| 1 | Upstash Redis never activated in rate limit call chain | **Critical** | Horizontal scaling | Rate limiting ineffective across instances/serverless |
| 2 | `internalBookings` Map not shared across instances | **Critical** | Horizontal scaling | Bookings lost on restart, inconsistent across instances |
| 3 | Docker `output: 'standalone'` not set in `next.config.js` | **High** | Deployment | Docker build will fail |
| 4 | `packages/integrations/*` not in pnpm workspace | **High** | Extensibility | New Supabase integration package not usable |
| 5 | `@repo/infra` subpath exports not declared in `package.json` | **High** | Package boundaries | Would break if packages were published |
| 6 | Booking provider factory closed for extension | **Medium** | Extensibility | Adding providers requires modifying factory class |
| 7 | Content hardcoded in page components | **Medium** | Template scaling | New templates require rewriting all page content |
| 8 | 12 deprecated exports still in use or reachable | **Medium** | Technical debt | Confusion about which API to use |
| 9 | Booking flow uses raw `console` with PII | **Medium** | Technical debt | Bypasses PII sanitization in structured logger |
| 10 | Feature modules not pluggable | **Low** | Extensibility | Manual wiring required to add/remove features |
| 11 | 8 test files use `require()` instead of `import` | **Low** | Technical debt | CJS anti-pattern in TypeScript |
| 12 | `bookingProviders` eager export triggers env validation at import | **Low** | Extensibility | Build-time failures if env not set |

### 5.9 Recommendations

#### Quick Wins

1. **Add `packages/integrations/*` to `pnpm-workspace.yaml`** and complete TODO 1.3.4 — this unblocks the entire integration extraction roadmap.
2. **Add subpath exports to `@repo/infra/package.json`** — aligns declared API with actual usage.
3. **Add `output: 'standalone'` to `next.config.js`** — fixes Docker deployment.
4. **Remove commented-out analytics code from BookingForm** — track as a feature ticket instead of dead code.

#### Strategic Improvements

5. **Pass env credentials through `checkRateLimit` to enable Upstash** — this single change enables distributed rate limiting across all instances.
6. **Extract page content to data files** — move hardcoded pricing tiers, team members, services, and gallery items from JSX into JSON/TypeScript data files that templates can override, reducing the copy-paste burden for new templates.
7. **Refactor booking providers to a registry pattern** — open for extension, closed for modification.
8. **Replace `console.*` in booking flow with structured logger** — eliminates PII exposure and provides consistent observability.

#### Long-Term

9. **Complete Phases 1.4-1.8** of the TODO roadmap — extract HubSpot, booking providers, analytics, and shared features into packages to eliminate the ~73% code duplication between templates.
10. **Introduce a feature flag / plugin registry** — allow templates to declare which features they use, enabling automatic wiring and reducing manual import management.

---

## Phase 6: DevOps & Operations (Deep Dive)

### 6.1 CI/CD Pipeline Architecture

The project uses three GitHub Actions workflows plus Renovate for automated dependency management.

#### 6.1.1 Primary CI Pipeline (`ci.yml`)

| Property | Value |
|----------|-------|
| **Triggers** | `push` and `pull_request` to `main` and `develop` |
| **Runner** | `ubuntu-latest` |
| **Timeout** | 30 minutes |
| **Node matrix** | `[24.x]` (single version) |
| **Permissions** | `contents: read` |
| **Concurrency** | None configured |

**Step-by-step execution:**

| # | Step | Action/Command | Purpose | Failure Impact |
|---|------|----------------|---------|:---:|
| 1 | Checkout | `actions/checkout@v4` (`fetch-depth: 0`) | Full history for SBOM | Low |
| 2 | Setup pnpm | `pnpm/action-setup@v2` (v10.29.2) | Package manager | Blocks all |
| 3 | Setup Node.js | `actions/setup-node@v4` with pnpm cache | Runtime + cache | Blocks all |
| 4 | Install dependencies | `pnpm install --frozen-lockfile` | Deterministic install | Blocks all |
| 5 | **Lint** | `pnpm lint` (→ `turbo run lint`) | Code quality gate | Fails CI |
| 6 | **Type check** | `pnpm type-check` (→ `turbo run type-check`) | Type safety gate | **Currently failing** |
| 7 | **Build** | `pnpm build` (→ `turbo run build`) | Production build | Fails CI |
| 8 | **Test** | `pnpm test` (→ `jest --maxWorkers=50%`) | Test suite | Fails CI |
| 9 | Generate SBOM | `anchore/sbom-action@v0` (SPDX JSON) | Software bill of materials | Non-blocking (runs after tests) |
| 10 | Upload SBOM | `actions/upload-artifact@v4` (90-day retention) | Artifact storage | Non-blocking |
| 11 | **Dependency audit** | `pnpm audit --audit-level high` | Vulnerability gate | Fails CI on high/critical |

**Pipeline Assessment:**

- **Strengths:** Sequential quality gates (lint → type-check → build → test) catch issues early. SBOM generation and dependency audit provide supply chain security. Frozen lockfile ensures reproducibility.
- **Weaknesses:**
  - **No parallelism** — all steps run sequentially in a single job. Lint and type-check are independent and could run in parallel.
  - **No `continue-on-error`** — any step failure stops the entire pipeline, preventing later steps (e.g., SBOM) from running.
  - **No deployment step** — CI is quality-gate only; no CD.
  - **No failure notifications** — relies on GitHub's default status checks.
  - **Single Node version matrix** — `[24.x]` provides no cross-version validation.

#### 6.1.2 SBOM Generation Workflow (`sbom-generation.yml`)

| Property | Value |
|----------|-------|
| **Triggers** | `push` to `main`, `release: published`, `pull_request` to `main` |
| **Timeout** | 15 minutes |
| **Permissions** | `contents: read`, `security-events: write` |

**Steps:** Checkout → Setup Node → Install deps → Generate SPDX SBOM → Generate CycloneDX SBOM → Upload both → `pnpm audit --audit-level high || true` → Upload dependency scan results.

**Key difference from CI:** Audit uses `|| true` so it **never fails the job** — it's informational only. CI's audit step is the enforcement point.

**Artifacts produced:**

| Artifact | Format | Retention |
|----------|--------|:---------:|
| `sbom-spdx` | SPDX JSON | 90 days |
| `sbom-cyclonedx` | CycloneDX JSON | 90 days |
| `dependency-scan` | Raw audit results | 30 days |

**Issue:** The dependency scan upload references `pnpm-audit-results.json` and `node_modules/.audit.json`, but these files are not produced by `pnpm audit` by default — `pnpm audit` outputs to stdout. The artifact upload will likely capture empty/missing files.

#### 6.1.3 Secret Scanning Workflow (`secret-scan.yml`)

| Property | Value |
|----------|-------|
| **Triggers** | `push` and `pull_request` to `main` and `develop` |
| **Permissions** | `contents: read`, `pull-requests: write` |
| **Tool** | GitGuardian (`GitGuardian/ggshield-action@v1`) |

**Required secret:** `GITGUARDIAN_API_KEY` — if not configured, the entire workflow fails.

**Assessment:** Good security practice. GitGuardian scans for leaked secrets in commits. The `pull-requests: write` permission allows commenting on PRs with findings.

#### 6.1.4 Renovate Configuration

Well-configured dependency management:

| Setting | Value | Assessment |
|---------|-------|------------|
| Schedule | Mondays before 6am UTC | Good — predictable window |
| Patch auto-merge | Yes (devDependencies) | Good — low risk |
| Minor production | Requires approval, 3-day stability | Good — cautious |
| Major updates | Manual review, 7-day stability | Good — conservative |
| Vulnerability alerts | Enabled, any time, labeled `security` | Good — prompt |
| Lock file maintenance | Monthly, auto-merge | Good |
| PR limits | 3 concurrent PRs, 2/hour | Good — prevents flooding |

**Dependency groups:**
- React ecosystem (react, react-dom, @types/react*)
- Next.js ecosystem (next, @next/*)
- TypeScript ecosystem (typescript, @types/*)

**Assessment:** The Renovate configuration is production-grade and well-tuned for a monorepo.

### 6.2 Build System (Turborepo)

#### 6.2.1 Task Dependency Graph

```
turbo.json task definitions:

build ─────→ ^build (upstream packages build first)
lint ──────→ ^lint
type-check → ^type-check
test ──────→ ^build (requires upstream builds)
dev ────────→ (no deps, not cached, persistent)
format ────→ (no deps, not cached)
```

**Visual dependency flow for `turbo run build`:**

```
@repo/utils (no build) ────┐
@repo/ui (no build) ───────┤
@repo/infra (no build) ────┤──→ @templates/hair-salon (next build)
@repo/shared (no build) ───┤──→ @templates/plumber (next build)
@repo/integrations-supabase ┘
```

Since shared packages have no `build` script (they're consumed as source via `transpilePackages`), the `^build` dependency is effectively a no-op for most packages. Only templates run `next build`.

#### 6.2.2 Task Coverage Per Package

| Package | `build` | `lint` | `type-check` | `test` | `dev` |
|---------|:-------:|:------:|:------------:|:------:|:-----:|
| `@templates/hair-salon` | `next build` | `next lint` | `tsc --noEmit` | `jest` | `next dev -p 3100` |
| `@templates/plumber` | `next build` | `next lint` | `tsc --noEmit` | `jest` | `next dev -p 3101` |
| `@repo/infra` | — | `eslint .` | `tsc --noEmit` | — | — |
| `@repo/integrations-supabase` | — | `eslint .` | `tsc --noEmit` | — | — |
| `@repo/ui` | — | `eslint src` | — | — | — |
| `@repo/utils` | — | `eslint src` | — | — | — |
| `@repo/shared` | — | — | — | — | — |
| `@repo/eslint-config` | — | — | — | — | — |
| `@repo/typescript-config` | — | — | — | — | — |

**Gaps:**
- `@repo/ui` and `@repo/utils` have **no type-check** script — TypeScript errors in these packages are only caught when templates build.
- `@repo/shared` has **no lint, type-check, or build** — completely unverified by CI.
- No package has its **own test script** — all testing runs via the root Jest config.

#### 6.2.3 Caching Strategy

| Task | Cached? | Outputs | Custom Inputs |
|------|:-------:|---------|---------------|
| `build` | Yes | `.next/**`, `!.next/cache/**`, `dist/**`, `build/**` | Default |
| `lint` | Yes | Default (empty) | Default |
| `type-check` | Yes | Default (empty) | Default |
| `test` | Yes | `coverage/**` | `src/**/*.ts`, `src/**/*.tsx`, `**/__tests__/**`, `jest.config.js` |
| `dev` | No | — | — |
| `format` | No | — | — |

**Remote caching:** Not configured. No `TURBO_TOKEN` or `TURBO_TEAM` environment variables. All caching is local only.

**Implication:** CI rebuilds everything from scratch on every run. For a monorepo with two Next.js templates, this means two full `next build` executions per CI run (~2-5 minutes each).

**Recommendation:** Enable Turbo remote caching (Vercel or self-hosted) to skip unchanged builds in CI. This could reduce CI time by 50-80% on typical PRs that only touch one template or one package.

#### 6.2.4 Test Execution Architecture

**Critical design issue:** The root `test` script is `jest --maxWorkers=50%`, which runs Jest globally — **not via Turbo**. This means:

- Turbo's `test` task definition (with its `dependsOn: ["^build"]` and caching) is **never used** from the CI pipeline.
- All tests across the monorepo run in a single Jest process with a single `jest.config.js`.
- The root `jest.config.js` has `moduleNameMapper` hardcoded to `templates/hair-salon`, making it impossible to correctly test `templates/plumber` code.
- `collectCoverageFrom` explicitly **excludes** `packages/infra` and `templates/plumber`.

### 6.3 Docker & Deployment

#### 6.3.1 Dockerfile Analysis (`templates/hair-salon/Dockerfile`)

**Three-stage build:**

| Stage | Base Image | Purpose | Issues |
|-------|-----------|---------|--------|
| **deps** | `node:24-alpine` | Install dependencies | Installs pnpm globally via npm; copies all `packages/` |
| **builder** | `node:24-alpine` | Build the Next.js app | Copies full repo; runs `pnpm build --filter=@templates/hair-salon` |
| **runtime** | `node:24-alpine` | Production server | Copies `.next/standalone`, static assets, public dir |

**Line-by-line issues:**

| Line | Issue | Severity |
|:----:|-------|:--------:|
| 6 | `RUN npm install -g pnpm` — version not pinned; could get different pnpm version than lockfile expects | **Medium** |
| 8 | `COPY packages ./packages` — copies ALL packages including irrelevant ones, increasing build context | **Low** |
| 20 | `COPY --from=deps /app/.pnpm-store ./.pnpm-store` — pnpm store may not be at this path with global install | **Medium** |
| 31 | `COPY --from=builder /app/templates/hair-salon/.next/standalone ./` — **`.next/standalone` does not exist** because `next.config.js` lacks `output: 'standalone'`** | **Critical** |
| 37 | `CMD ["node", "templates/hair-salon/server.js"]` — `server.js` is only produced with `output: 'standalone'` | **Critical** |
| — | No `HEALTHCHECK` instruction | **Medium** |
| — | No `.dockerignore` file exists | **Medium** |
| — | No non-root `USER` — runs as root | **Medium** |

#### 6.3.2 Docker Compose Analysis

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: templates/hair-salon/Dockerfile
    ports:
      - '3100:3100'
    environment:
      - NODE_ENV=development
    volumes:
      - ./templates/hair-salon:/app/templates/hair-salon
      - /app/node_modules
```

**Issues:**

| Issue | Severity |
|-------|:--------:|
| `NODE_ENV=development` in Docker — defeats purpose of production image | **Medium** |
| Volume mount overrides built files — `.next` would be overwritten by local source | **Medium** |
| No `.env_file` directive — env vars (Supabase, HubSpot, etc.) not injected | **High** |
| No restart policy (`restart: unless-stopped`) | **Low** |
| No resource limits (memory, CPU) | **Low** |
| Single service — no database, Redis, or reverse proxy | **Info** |
| Only hair-salon — no plumber service defined | **Info** |
| `version: '3.8'` is deprecated in modern Docker Compose | **Info** |

#### 6.3.3 Missing `.dockerignore`

Without `.dockerignore`, the Docker build context includes:

- `node_modules/` (~500MB+)
- `.next/` (build outputs from local dev)
- `.git/` (repository history)
- `.turbo/` (cache files)
- All documentation, test files, and unused templates

**Recommended `.dockerignore`:**

```
node_modules
.next
.turbo
.git
*.md
**/__tests__
**/test
coverage
.env*
```

#### 6.3.4 Deployment Strategy Assessment

| Target | Status | Notes |
|--------|:------:|-------|
| Docker | **Broken** | Missing `output: 'standalone'`, no `.dockerignore`, no health check |
| Vercel | Partially compatible | Blog fs reads work at build; in-memory stores break in serverless |
| Custom Node server | Compatible | Standard Next.js; need to start with `next start` |
| Kubernetes | **Not configured** | No Helm charts, no manifests, no probes |

### 6.4 Monitoring & Observability

#### 6.4.1 Sentry Integration — Incomplete Setup

**What exists:**

| Component | File | Status |
|-----------|------|:------:|
| Server span helper | `packages/infra/sentry/server.ts` | Implemented |
| Client span helper | `packages/infra/sentry/client.ts` | Implemented |
| PII sanitization | `packages/infra/sentry/sanitize.ts` | **Implemented but not wired** |
| `sentry.client.config.ts` | — | **Missing** |
| `sentry.server.config.ts` | — | **Missing** |
| `sentry.edge.config.ts` | — | **Missing** |
| `instrumentation.ts` | — | **Missing** |
| `withSentryConfig` in `next.config.js` | — | **Not applied** |

**Consequence of missing config files:**

Without `sentry.client.config.ts` and `sentry.server.config.ts`, Sentry is **never explicitly initialized**. The `@sentry/nextjs` SDK may auto-initialize from environment variables, but:

- Sample rates are not controlled (defaults to 100% errors, 0% transactions).
- `sanitizeSentryEvent` (PII redaction) is never set as `beforeSend` — **PII may reach Sentry**.
- Source maps are not uploaded — production stack traces are minified and unreadable.
- No release tagging — errors cannot be correlated to deployments.
- No environment filtering — dev/staging/prod errors are mixed.

**The `sanitizeSentryEvent` function** (`packages/infra/sentry/sanitize.ts`) is well-implemented:
- Redacts email addresses via regex
- Redacts phone numbers via regex
- Redacts known PII keys: `email`, `phone`, `name`, `firstName`, `lastName`, `company`, `message`, `formData`, `contact`
- Recursively sanitizes nested objects and arrays

But it is **never referenced** from any Sentry configuration.

**Sentry DSN mismatch:**

| Location | Variable Used |
|----------|---------------|
| `packages/infra/env/schemas/sentry.ts` | `SENTRY_DSN` |
| `packages/infra/logger/index.ts` | `NEXT_PUBLIC_SENTRY_DSN` |
| `packages/infra/sentry/server.ts` | `NEXT_PUBLIC_SENTRY_DSN` |
| `packages/infra/sentry/client.ts` | `NEXT_PUBLIC_SENTRY_DSN` |

The env schema validates `SENTRY_DSN` but all runtime code checks `NEXT_PUBLIC_SENTRY_DSN`. If only `SENTRY_DSN` is set (as the schema suggests), Sentry will be disabled at runtime.

#### 6.4.2 Structured Logging

The structured logger (`packages/infra/logger/index.ts`) is well-designed:

**Log levels:** `info`, `warn`, `error` (no `debug` or `trace`).

**Behavior by environment:**

| Environment | Format | Output | Sentry Integration |
|-------------|--------|--------|:------------------:|
| Development | `[LEVEL] message context` | `console.*` | No |
| Test | `[LEVEL] message context` | `console.*` | No |
| Production | JSON line `{timestamp, level, message, context, error}` | `console.*` (Vercel Log Drain compatible) | Yes (if DSN set) |

**Automatic enrichment:**
- `request_id` from `AsyncLocalStorage` via `getRequestId()` — only available when `runWithRequestId()` was called by the entry point.

**PII sanitization:**
- `SENSITIVE_KEYS` Set: `password`, `token`, `authorization`, `cookie`, `api_key`, `secret`, etc.
- `SENSITIVE_KEY_SUBSTRINGS` Array: partial match on key names.
- Sensitive values replaced with `[REDACTED]`.

**Gaps:**
- No `debug` level for development troubleshooting.
- No log correlation with Sentry trace IDs.
- No structured error codes (only free-form messages).
- No log volume controls or sampling.
- `sanitizeLogContext` has no recursion depth limit (identified in Phase 4).

#### 6.4.3 Distributed Tracing

**Request ID propagation:**

```
Client request
  ↓ (x-correlation-id header)
Server Action (submit.ts)
  ↓ runWithRequestId(correlationId, ...)
  ↓ AsyncLocalStorage stores { requestId }
  ↓
  ├── logInfo/logWarn/logError → includes request_id
  ├── withServerSpan('supabase.insert') → Sentry span
  └── withServerSpan('hubspot.search') → Sentry span
```

**Manual spans created:**

| Span Name | Op | Location | Traced Operations |
|-----------|-----|----------|-------------------|
| `contact_form.submit` | `action` | `submit.ts` | Full contact flow |
| `supabase.insert` | `db.supabase` | `supabase.ts` | Lead insert |
| `supabase.update` | `db.supabase` | `supabase.ts` | Lead update |
| `hubspot.search` | `http.client` | `hubspot.ts` | Contact search |
| `hubspot.upsert` | `http.client` | `hubspot.ts` | Contact upsert |

**What is NOT traced:**
- Booking flow (no spans in `booking-actions.ts`)
- Middleware execution
- Blog data loading
- Search index building
- Rate limit checks
- Any client-side operations

**Assessment:** Tracing covers the contact form flow well but completely misses the booking flow. Since Sentry config files are missing, trace data may not actually be collected.

#### 6.4.4 Error Handling & Recovery

**Error boundary coverage:**

| Level | Component | Exists? | Behavior |
|-------|-----------|:-------:|----------|
| Global app | `<ErrorBoundary>` in `providers.tsx` | Yes | Fallback UI, retry (max 1), reset via `sessionStorage` |
| Route-level | `error.tsx` | **No** | Falls through to global boundary |
| Layout-level | `global-error.tsx` | **No** | No custom fallback; Next.js default error page |
| 404 | `not-found.tsx` | Yes | Custom page with navigation links |

**Missing `error.tsx` and `global-error.tsx`:**

Without `app/error.tsx`, any route-level error (e.g., a failing server component) propagates to the global `ErrorBoundary` in `providers.tsx`. This works but provides no route-specific error handling or recovery.

Without `app/global-error.tsx`, errors in the root layout (e.g., `getSearchIndex()` failure, font loading failure) show Next.js's default error page with no custom branding or recovery options.

#### 6.4.5 Health Checks

**No health check endpoint exists.** There is no `/api/health`, `/api/healthcheck`, or similar route.

**Impact:**
- Docker containers cannot be health-checked (no `HEALTHCHECK` in Dockerfile)
- Load balancers cannot verify backend health
- Kubernetes readiness/liveness probes cannot be configured
- No automated detection of degraded state (e.g., Supabase unreachable, Sentry misconfigured)

**Recommended `/api/health` response:**

```ts
// app/api/health/route.ts
export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    checks: {
      supabase: await checkSupabase(),   // HEAD request to Supabase
      sentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      rateLimit: await checkRateLimit(), // Verify Upstash connectivity
    }
  };
  const healthy = Object.values(checks.checks).every(Boolean);
  return Response.json(checks, { status: healthy ? 200 : 503 });
}
```

#### 6.4.6 Analytics & Consent

**Consent model:** Opt-in (GDPR-compliant).

| State | Behavior |
|-------|----------|
| `'unknown'` | Consent banner shown; no analytics loaded |
| `'granted'` | GA4 gtag loaded; events tracked |
| `'denied'` | No analytics; no banner (user has declined) |

**Storage:** Cookie `ydm_analytics_consent` (1-year expiry) + `localStorage` backup.

**Events tracked:**
- `trackFormSubmission(formName, success)` — contact form submissions
- `trackCTAClick(ctaText)` — CTA button clicks
- `trackEvent(action, category, label, value)` — generic events

**Development behavior:** In dev/test, events are logged locally via `logInfo()` instead of being sent to GA4.

**Issue:** Booking form analytics are **disabled** (all `trackBookingEvent` calls are commented out). ContactForm tracks via `trackFormSubmission`, but BookingForm does not.

### 6.5 Environment Configuration Management

#### 6.5.1 Environment Variable Flow

```
.env / .env.local (developer)
        ↓
process.env (Node.js)
        ↓
validateEnv() → Zod schemas → validatedEnv (typed, validated)
        ↓
Template code imports validatedEnv from @/lib/env
```

**Template env validation (`lib/env.ts`):**

```ts
import { validateEnv, type CompleteEnv } from '@repo/infra/env';
export const validatedEnv = validateEnv() as CompleteEnv;
```

- Validated once at module load time.
- Throws on invalid env (fails startup).
- `CompleteEnv` type provides full type safety for all validated variables.

**Feature flags derived from env:**

```ts
getFeatureFlags() → {
  hasSupabase: boolean,
  hasHubSpot: boolean,
  hasRateLimit: boolean,
  hasSentry: boolean,
  hasBookingProviders: boolean,
}
```

#### 6.5.2 Environment-Specific Configuration

| Config | Where Set | Per-Template? |
|--------|-----------|:-------------:|
| `NODE_ENV` | Docker, CI, local | Shared |
| `NEXT_PUBLIC_SITE_URL` | `.env` | Yes |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `.env` | Shared |
| `HUBSPOT_PRIVATE_APP_TOKEN` | `.env` | Shared |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | `.env` | Shared |
| `NEXT_PUBLIC_SENTRY_DSN` | `.env` | Could be per-template |
| `MINDBODY_*`, `VAGARO_*`, `SQUARE_*` | `.env` | Could be per-template |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `.env` | Per-template |

**Missing:** No `.env.example` file to document required variables. Developers must read the Zod schemas to understand what's needed.

### 6.6 DevOps Issue Summary

| # | Issue | Severity | Category | Impact |
|---|-------|:--------:|----------|--------|
| 1 | Docker build broken — `output: 'standalone'` not set | **Critical** | Deployment | Cannot deploy via Docker |
| 2 | Sentry config files missing — PII may reach Sentry unredacted | **Critical** | Observability | PII exposure, no controlled sampling |
| 3 | Sentry DSN variable mismatch (schema vs runtime) | **High** | Observability | Sentry may be silently disabled |
| 4 | No `error.tsx` or `global-error.tsx` | **High** | Error handling | Poor UX on route/layout errors |
| 5 | No health check endpoint | **High** | Operations | No automated health monitoring |
| 6 | `sanitizeSentryEvent` not wired as `beforeSend` | **High** | Security | PII sent to Sentry if SDK auto-initializes |
| 7 | No `.dockerignore` — bloated build context | **Medium** | Deployment | Slow Docker builds |
| 8 | No Turbo remote caching in CI | **Medium** | Build | Full rebuild every CI run |
| 9 | Root Jest bypasses Turbo — plumber tests broken | **Medium** | Testing | Plumber code not properly tested |
| 10 | Docker Compose uses `NODE_ENV=development` | **Medium** | Deployment | Non-production behavior in container |
| 11 | Booking flow has no tracing spans | **Medium** | Observability | Booking performance invisible |
| 12 | No `.env.example` | **Medium** | DX | Developers must read Zod schemas |
| 13 | CI has no parallelism — lint/type-check sequential | **Low** | Build | ~1-2 min wasted per CI run |
| 14 | `packages/ui`, `utils`, `shared` have no type-check | **Low** | Quality | Errors only caught transitively |
| 15 | Dockerfile pnpm version not pinned | **Low** | Deployment | Non-reproducible builds |
| 16 | Docker runs as root user | **Low** | Security | Container escape risk |
| 17 | `docker-compose.yml` uses deprecated `version` key | **Info** | Deployment | Warning in modern Docker |
| 18 | SBOM audit artifact references non-existent files | **Info** | CI | Artifact upload is empty |

### 6.7 Recommendations

#### Critical Fixes

1. **Add `output: 'standalone'` to `next.config.js`** — required for the Dockerfile to work:

```js
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@repo/ui', '@repo/utils'],
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
```

2. **Create Sentry config files** — at minimum `sentry.client.config.ts` and `sentry.server.config.ts`:

```ts
// templates/hair-salon/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';
import { sanitizeSentryEvent } from '@repo/infra/sentry/sanitize';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend: sanitizeSentryEvent,
});
```

3. **Add `app/error.tsx` and `app/global-error.tsx`** — provide branded error recovery for route and layout failures.

#### High Priority

4. **Add `/api/health` endpoint** — return health status of critical dependencies.
5. **Align Sentry DSN variable** — use `NEXT_PUBLIC_SENTRY_DSN` consistently in both schema and runtime, or map between them in the env validation.
6. **Create `.dockerignore`** — exclude `node_modules`, `.next`, `.git`, `.turbo`, tests, docs.

#### Medium Priority

7. **Enable Turbo remote caching** — add `TURBO_TOKEN` and `TURBO_TEAM` to CI secrets.
8. **Parallelize CI** — split lint/type-check into parallel jobs, or use `turbo run lint type-check --parallel`.
9. **Add spans to booking flow** — wrap `submitBookingRequest` with `withServerSpan`.
10. **Create `.env.example`** — document all required and optional environment variables.
11. **Fix Dockerfile** — pin pnpm version, add non-root `USER`, add `HEALTHCHECK` instruction.

#### Low Priority

12. **Add `type-check` scripts to `@repo/ui` and `@repo/utils`** — catch errors at the package level.
13. **Fix test architecture** — either use per-package Jest configs with `turbo run test`, or fix root Jest to support all templates.

---

## Phase 7: Dependencies & Technical Debt (Deep Dive)

### 7.1 Dependency Vulnerability Audit

Live `pnpm audit` results (as of 2026-02-13):

| # | Severity | Package | Vulnerability | Path | Patched In |
|---|:--------:|---------|---------------|------|:----------:|
| 1 | **High** | `rollup` | DOM Clobbering → XSS (GHSA-gcx4-mw62-g8wm) | `@sentry/nextjs` → `rollup` | ≥3.29.5 |
| 2 | Moderate | `@sentry/browser` | Prototype Pollution (GHSA-593m-55hh-j8gv) | `@sentry/nextjs` → `@sentry/react` → `@sentry/browser` | ≥8.33.0 |
| 3 | Moderate | `next` | Cache Key Confusion — Image Optimization (GHSA-g5qg-72qw-gw5v) | `packages/infra` → `next` (peer) | ≥15.4.5 |
| 4 | Moderate | `next` | Content Injection — Image Optimization (GHSA-xv57-4mr9-wg8v) | `packages/infra` → `next` (peer) | ≥15.4.5 |
| 5 | Moderate | `next` | Middleware SSRF (GHSA-4342-x723-ch2f) | `packages/infra` → `next` (peer) | ≥15.4.7 |
| 6 | Moderate | `next` | DoS via Image Optimizer (GHSA-9g9p-9gw9-jx7f) | `packages/infra` → `next` (peer) | ≥15.5.10 |
| 7 | Low | `@eslint/plugin-kit` | ReDoS (GHSA-xffm-g5w8-qvg7) | `eslint-config` → `eslint` → `@eslint/plugin-kit` | ≥0.3.4 |

**Total: 7 vulnerabilities (1 high, 5 moderate, 1 low).**

**Analysis:**

- **Vulnerabilities #1 and #2 (Sentry):** Both transitive through `@sentry/nextjs@8.0.0` (latest is 10.38.0). Upgrading Sentry is the **single most impactful upgrade** — it fixes 2 of 7 vulnerabilities.
- **Vulnerabilities #3–6 (Next.js):** Templates use `next@15.2.9`. Upgrading to ≥15.5.10 resolves all four. Next.js 16 is available but is a major version.
- **Vulnerability #7 (ESLint):** Low severity, dev-only.

**CI Impact:** `pnpm audit --audit-level high` **fails** on vulnerability #1 (rollup). CI is currently blocked.

### 7.2 Outdated Dependencies

Live `pnpm outdated` results (as of 2026-02-13):

#### Major Version Bumps Available

| Package | Current | Latest | Gap | Risk |
|---------|:-------:|:------:|:---:|:----:|
| `@sentry/nextjs` | 8.0.0 | 10.38.0 | **2 majors** | High |
| `next` | 15.2.9 | 16.1.6 | 1 major | High |
| `eslint` | 9.18.0 | 10.0.0 | 1 major | Medium |
| `eslint-config-next` | 15.2.9 | 16.1.6 | 1 major | Medium |
| `next-mdx-remote` | 5.0.0 | 6.0.0 | 1 major | Medium |
| `tailwindcss` | 3.4.17 | 4.1.18 | 1 major | High |
| `tailwind-merge` | 2.6.1 | 3.4.0 | 1 major | Medium |
| `zod` | 3.22.4 | 4.3.6 | 1 major | Medium |
| `@hookform/resolvers` | 3.9.1 | 5.2.2 | 2 majors | Medium |
| `@types/node` | 20.17.9 | 25.2.3 | 5 majors | Low |

#### Minor/Patch Updates Available

| Package | Current | Latest | Package | Current | Latest |
|---------|:-------:|:------:|---------|:-------:|:------:|
| `react` | 19.0.0 | 19.2.4 | `react-dom` | 19.0.0 | 19.2.4 |
| `react-hook-form` | 7.55.0 | 7.71.1 | `lucide-react` | 0.344.0 | 0.564.0 |
| `turbo` | 2.2.3 | 2.8.8 | `typescript` | 5.7.2 | 5.9.3 |
| `prettier` | 3.2.5 | 3.8.1 | `@typescript-eslint/*` | 8.19.1 | 8.55.0 |
| `postcss` | 8.4.49 | 8.5.6 | `@upstash/redis` | 1.34.3 | 1.36.2 |
| `@upstash/ratelimit` | 2.0.5 | 2.0.8 | `@eslint/eslintrc` | 3.2.0 | 3.3.3 |
| `@types/react` | 19.0.2 | 19.2.14 | `@types/react-dom` | 19.0.2 | 19.2.3 |
| `autoprefixer` | 10.4.20 | 10.4.24 | `remark-gfm` | 4.0.0 | 4.0.1 |

### 7.3 Version Consistency Analysis

| Package | Templates | `@repo/infra` | `@repo/integrations-supabase` | Issue |
|---------|:---------:|:-------------:|:-----------------------------:|-------|
| `@types/node` | 20.17.9 | ^22.0.0 | ^22.0.0 | **Mismatch** — project requires Node ≥24; all should use ^24.0.0 |
| `zod` | 3.22.4 | ^3.23.0 | ^3.23.0 | **Mismatch** — pnpm resolves different versions |
| `typescript` | 5.7.2 | ^5.7.2 | ^5.7.2 | Compatible |
| `eslint` | 9.18.0 | ^9.18.0 | ^9.18.0 | Compatible |
| `@sentry/nextjs` | 8.0.0 | >=8.0.0 (peer) | — | Compatible but severely outdated |

### 7.4 Dependency Bloat Analysis

`@sentry/nextjs@8.0.0` pulls in 13+ unused OpenTelemetry instrumentations (Express, Fastify, Hapi, Koa, GraphQL, MongoDB, Mongoose, MySQL, MySQL2, PostgreSQL, ioredis, NestJS, Prisma). None are used. They add `node_modules` size and produce dynamic `require()` build warnings.

`rehype-pretty-code` pulls in `shiki` (~30 MB+ in `node_modules`) for code highlighting. A lighter alternative like `rehype-highlight` (~300 KB) may suffice if syntax highlighting fidelity is not critical.

`@repo/integrations-supabase` exists but `packages/integrations/*` is **not in pnpm workspace** — the package is dead code.

### 7.5 License Compatibility

| License | Approx. Count | Category | Status |
|---------|:-------------:|:--------:|:------:|
| MIT | ~700+ | Permissive | Compatible |
| ISC, Apache-2.0, BSD-2/3, 0BSD | ~120 | Permissive | Compatible |
| CC-BY-4.0, CC0-1.0, BlueOak-1.0.0 | 5 | Permissive | Compatible |
| **FSL-1.1-MIT** (`@sentry/cli`) | 2 | Functional Source | OK for non-competing use |
| **Apache-2.0 AND LGPL-3.0-or-later** (`@img/sharp-win32-x64`) | 1 | Weak copyleft | OK (dynamically linked native module) |

**No GPL, AGPL, or SSPL licenses found.** All licenses are compatible for commercial marketing websites.

### 7.6 Consolidated Technical Debt Inventory

**40 items cataloged across all phases** (5 critical, 9 high, 15 medium, 11 low):

#### Critical (Blocks Production / CI)

| # | Item | Location | Effort |
|---|------|----------|:------:|
| D1 | Docker build broken — `output: 'standalone'` missing | `next.config.js` | Small |
| D2 | Type-check fails — TS errors in test files block CI | `blog.test.ts`, `search.test.ts` | Small |
| D3 | Sentry config files missing — uncontrolled PII exposure | Templates | Medium |
| D4 | `pnpm audit` fails (rollup high via Sentry 8.0.0) — blocks CI | `@sentry/nextjs` | Medium |
| D5 | `internalBookings` Map — data loss, breaks scaling | `booking-actions.ts:27` | Large |

#### High (Security / Reliability)

| # | Item | Location | Effort |
|---|------|----------|:------:|
| D6 | Booking: raw IP, weak hashing, no CSRF | `booking-actions.ts:75,98` | Small |
| D7 | Booking: PII logged via `console.*` | `booking-actions.ts:110,138` | Small |
| D8 | Upstash never activated — rate limiting per-instance | `rate-limit.ts:513-528` | Small |
| D9 | `sanitizeSentryEvent` not wired as `beforeSend` | `sentry/sanitize.ts` | Small |
| D10 | Sentry DSN variable mismatch (schema vs runtime) | `env/schemas/sentry.ts` | Small |
| D11 | No `error.tsx` / `global-error.tsx` | Templates | Small |
| D12 | No health check endpoint | Templates | Small |
| D13 | 4 Next.js CVEs (moderate) | `next@15.2.9` | Medium |
| D14 | `@repo/infra` subpath exports undeclared | `packages/infra/package.json` | Small |

#### Medium (Quality / Maintainability)

| # | Item | Location | Effort |
|---|------|----------|:------:|
| D15 | ~73% template duplication (~6,500+ lines) | Both templates | Large |
| D16 | `packages/integrations/*` not in workspace | `pnpm-workspace.yaml` | Small |
| D17 | ESLint missing in `packages/ui`, `utils` | Both packages | Small |
| D18 | All routes forced dynamic (`headers()` in layout) | `app/layout.tsx` | Medium |
| D19 | No cross-request caching for blog/search | `blog.ts`, `search.ts` | Small |
| D20 | `InMemoryRateLimiter.limits` no periodic cleanup | `rate-limit.ts:101` | Small |
| D21 | No fetch timeouts on external APIs | Multiple | Small |
| D22 | 12 deprecated exports still reachable | Various | Medium |
| D23 | Booking providers closed for extension (OCP) | `booking-providers.ts` | Medium |
| D24 | Root Jest hardcoded to hair-salon | `jest.config.js` | Medium |
| D25 | No Turbo remote caching | CI / `turbo.json` | Small |
| D26 | `@types/node` mismatch (20.x vs ≥24 required) | Multiple | Small |
| D27 | `zod` version mismatch | Multiple | Small |
| D28 | No `.dockerignore` | Root | Small |
| D29 | No `.env.example` | Root | Small |

#### Low (Code Quality / DX) — D30 through D40

`process.env.NODE_ENV as any`, `React.memo` on Server Components, eager `bookingProviders` export, `require()` in test files, `module.exports` in TS, commented-out analytics stubs, O(n²) `encodeBase64`, `sanitizeLogContext` no depth limit, sequential rate limit checks, hardcoded phone in `book/page.tsx`, Dockerfile runs as root.

### 7.7 Recommended Upgrade Path

**Phase A — Unblock CI:** Upgrade `@sentry/nextjs` (≥8.33.0) + fix test files.  
**Phase B — Patch Security:** Upgrade `next` (≥15.5.10) + patch React (19.2.4).  
**Phase C — Minor Upgrades:** Turbo, TypeScript, react-hook-form, Upstash, align `@types/node` and `zod`.  
**Phase D — Major Upgrades (Quarterly):** Tailwind 4, Zod 4, ESLint 10, `@hookform/resolvers` 5, `next-mdx-remote` 6.

---

## Metrics & Statistics

| Metric | Value |
|--------|-------|
| **Total TypeScript/TSX files** (excl. `node_modules`) | ~110+ |
| **Total test files** | 17 |
| **Workspace packages** | 11 |
| **Templates** | 2 (hair-salon, plumber) + shared types |
| **Code duplication** | ~73% of template files byte-for-byte identical (~6,500+ lines) |
| **Production dependencies** | 62 (across all `package.json`) |
| **Dev dependencies** | 52 |
| **Peer dependencies** | 7 |
| **Known vulnerabilities** | 7 (1 high, 5 moderate, 1 low) |
| **Outdated packages** | 23 (10 major, 13 minor/patch) |
| **Test coverage** | Not measured — config excludes plumber and `packages/infra` |
| **CI status** | Blocked (type-check + audit high) |
| **Docker deployment** | Broken (`output: 'standalone'` missing) |
| **Sentry integration** | Partial (helpers exist, config missing) |
| **Health check** | None |
| **TODO.md progress** | ~26% (43 of ~163 tasks) |
| **Unique license types** | 11; all compatible for commercial use |
| **Technical debt items** | 40 cataloged (5 critical, 9 high, 15 medium, 11 low) |

---

## Prioritized Action Plan

### P0 — Unblock CI (Immediate, <1 day)

| # | Action | Effort | Impact | Fixes |
|---|--------|:------:|--------|-------|
| 1 | Fix TS errors in `blog.test.ts` and `search.test.ts` | Small | Unblocks `type-check` | D2 |
| 2 | Upgrade `@sentry/nextjs` to >=8.33.0 | Medium | Resolves 2 CVEs; unblocks audit | D4 |
| 3 | Add `output: 'standalone'` to `next.config.js` | Small | Fixes Docker build | D1 |

### P1 — Security Hardening (This Sprint, 1–3 days)

| # | Action | Effort | Impact | Fixes |
|---|--------|:------:|--------|-------|
| 4 | Upgrade `next` to >=15.5.10 | Medium | Resolves 4 moderate CVEs | D13 |
| 5 | Fix booking: validated IP, SHA-256 hashing, CSRF | Small | 3 security gaps closed | D6 |
| 6 | Replace `console.*` in booking with structured logger | Small | Stops PII logging | D7 |
| 7 | Pass env to `checkRateLimit` to activate Upstash | Small | Distributed rate limiting | D8 |
| 8 | Create Sentry config files with `beforeSend` | Medium | PII protection, sampling | D3, D9, D10 |
| 9 | Add `app/error.tsx` and `app/global-error.tsx` | Small | Error recovery UX | D11 |
| 10 | Add `/api/health` endpoint | Small | Health monitoring | D12 |

### P2 — Code Quality (Next Sprint, 3–5 days)

| # | Action | Effort | Impact | Fixes |
|---|--------|:------:|--------|-------|
| 11 | Add ESLint config to `packages/ui` and `utils` | Small | Consistent linting | D17 |
| 12 | Add `packages/integrations/*` to workspace | Small | Unblocks extraction | D16 |
| 13 | Add `@repo/infra` subpath exports | Small | Clean boundaries | D14 |
| 14 | Align `@types/node` and `zod` versions | Small | Consistency | D26, D27 |
| 15 | Add `unstable_cache` for blog/search | Small | Eliminate sync I/O | D19 |
| 16 | Add fetch timeouts on external APIs | Small | Prevent hung requests | D21 |
| 17 | Create `.dockerignore` and `.env.example` | Small | Build perf, DX | D28, D29 |
| 18 | Fix Jest config (per-package or multi-template) | Medium | Plumber tests work | D24 |

### P3 — Strategic Improvements (2–4 weeks)

| # | Action | Effort | Impact | Fixes |
|---|--------|:------:|--------|-------|
| 19 | Wire templates to `@repo/integrations-supabase` | Medium | Begin dedup | D15 |
| 20 | Replace in-memory booking with Supabase | Large | Prod-ready booking | D5 |
| 21 | Move CSP nonce to middleware for static pages | Medium | Static generation | D18 |
| 22 | Extract HubSpot, booking, analytics to packages | Large | Eliminate duplication | D15 |
| 23 | Refactor booking providers to registry pattern | Medium | Extensibility | D23 |
| 24 | Enable Turbo remote caching | Small | 50-80% faster CI | D25 |

### P4 — Major Upgrades (Quarterly)

| # | Action | Effort | Risk |
|---|--------|:------:|:----:|
| 25 | Tailwind CSS 3 → 4 | Large | High |
| 26 | Zod 3 → 4 | Medium | Medium |
| 27 | ESLint 9 → 10 | Medium | Medium |

---

## Code Examples

### 1. Fix: Booking security — validated IP, proper hashing, CSRF

**Current (3 critical issues):**

```ts
// booking-actions.ts:73-98 — raw IP, weak hashing, no CSRF
const headersList = await headers();
const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
// ...
hashIp: (value: string) => btoa(value).substring(0, 16),
```

**Recommended:**

```ts
import { getValidatedClientIp } from '@repo/infra/security/request-validation';
import { getBlockedSubmissionResponse } from '@/lib/actions/helpers';

const headersList = await headers();

// 1. CSRF / origin validation
const blocked = getBlockedSubmissionResponse(headersList, formData);
if (blocked) return blocked;

// 2. Validated IP extraction
const clientIp = await getValidatedClientIp(headersList, {
  environment: validatedEnv.NODE_ENV,
});

// 3. Proper hashing (salted SHA-256)
const rateLimitResult = await checkRateLimit({
  email: validatedData.email,
  clientIp,
});
```

### 2. Fix: Enable distributed rate limiting

**Current (Upstash never activated):**

```ts
// rate-limit.ts — env never passed through
const emailResult = await limitByEmail(email);     // env = undefined → InMemoryRateLimiter
const ipResult = await limitByIp({ ... });          // env = undefined → InMemoryRateLimiter
```

**Recommended:**

```ts
export async function checkRateLimit(params: {
  email: string;
  clientIp: string;
}): Promise<boolean> {
  const env = {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
  const emailResult = await limitByEmail(params.email, 'contact', undefined, env);
  if (!emailResult.success) return false;
  const ipResult = await limitByIp(
    { 'x-forwarded-for': params.clientIp }, 'contact', undefined, env
  );
  return ipResult.success;
}
```

### 3. Fix: Sentry initialization with PII redaction

**Create `templates/hair-salon/sentry.client.config.ts`:**

```ts
import * as Sentry from '@sentry/nextjs';
import { sanitizeSentryEvent } from '@repo/infra/sentry/sanitize';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  beforeSend: sanitizeSentryEvent,
});
```

### 4. Fix: Add cross-request caching for blog data

**Current (re-reads all files every request):**

```ts
export const getAllPosts = cache(readAllPosts); // per-request only
```

**Recommended:**

```ts
import { unstable_cache } from 'next/cache';

export const getAllPosts = unstable_cache(
  readAllPosts,
  ['blog-all-posts'],
  { revalidate: 3600, tags: ['blog'] }
);
```

---

## Final Summary Table

| Category | Current State | Priority | Key Action |
|----------|:--------------|:--------:|------------|
| **CI Pipeline** | Blocked (type-check + audit) | **P0** | Fix test TS errors; upgrade Sentry |
| **Docker Deployment** | Broken | **P0** | Add `output: 'standalone'` |
| **Vulnerabilities** | 7 (1 high, 5 moderate, 1 low) | **P1** | Upgrade Sentry + Next.js |
| **Booking Security** | Raw IP, weak hash, no CSRF, PII logged | **P1** | Apply contact form patterns |
| **Rate Limiting** | Upstash never activated | **P1** | Pass env to rate limit functions |
| **Error Tracking** | Config missing, PII unprotected | **P1** | Create Sentry configs with `beforeSend` |
| **Error Recovery** | No `error.tsx` | **P1** | Add route/layout error pages |
| **Health Monitoring** | None | **P1** | Add `/api/health` endpoint |
| **Rendering** | All routes forced dynamic | **P2** | Move CSP nonce to middleware |
| **Caching** | No cross-request caching | **P2** | Add `unstable_cache` for blog |
| **ESLint** | Missing in ui/utils | **P2** | Add eslint.config.mjs |
| **Package Boundaries** | Exports undeclared; integrations outside workspace | **P2** | Fix exports and workspace |
| **Code Duplication** | ~73% between templates | **P3** | Complete extraction roadmap |
| **Booking Persistence** | In-memory Map (data loss) | **P3** | Replace with Supabase |
| **Outdated Packages** | 23 outdated (10 major) | **P3** | Follow phased upgrade path |
| **Testing** | Jest hardcoded to hair-salon | **P3** | Fix Jest or per-package tests |
| **Technical Debt** | 40 items cataloged | ongoing | Address per priority each sprint |

---

## Overall Health Score: 5 / 10

The codebase demonstrates strong foundational architecture — clean package separation, composable env validation, structured logging with PII redaction, comprehensive security middleware (CSP, HSTS, CSRF), and thoughtful dependency management via Renovate. The monorepo structure with Turborepo scales cleanly for additional templates.

However, it is currently in a **mid-extraction state** where significant work remains:

- **CI is blocked** by type-check failures and a high-severity audit finding
- **Docker deployment is broken** due to missing `output: 'standalone'`
- **7 known vulnerabilities** exist (`@sentry/nextjs` is 2+ majors behind; Next.js has 4 moderate CVEs)
- **The booking flow has critical security gaps** (raw IP, `btoa` hashing, no CSRF, PII logging)
- **Sentry is half-implemented** — helpers and PII sanitization exist but are never wired
- **~73% of template code is duplicated** between hair-salon and plumber
- **Rate limiting is per-instance only** despite Upstash being configured

Addressing P0 and P1 items would raise this to **7/10**. Completing the extraction roadmap and major upgrades would bring it to **8–9/10**.

---

## Addendum A: Technology Research Update (2026-02-14)

This addendum documents the current state of all key technologies as of February 14, 2026, correcting or supplementing the original analysis where the landscape has shifted.

### A.1 Current Stable Versions vs. Repo Versions

| Technology | Repo Version | Current Stable | Gap | Notes |
|------------|:------------:|:--------------:|:---:|-------|
| Next.js | 15.2.9 | **15.5.12** / 16.1.6 | 15.5.12 patches 4 CVEs; 16.x is a major | 15.5.12 is the safe patch target |
| React | 19.0.0 | 19.2.4 | Minor | Bug fixes only |
| TypeScript | 5.7.2 | **5.9.3** | Minor | Adds `import defer`, `--module node20`, perf improvements |
| Tailwind CSS | 3.4.17 | **4.1.18** | Major | Stable since Jan 2025; CSS-first config; 5x faster builds; migration tool: `npx @tailwindcss/upgrade` |
| Zod | 3.22.4 | **4.3.6** | Major | Stable since Jul 2025; 14.7x faster string parsing; codemod: `zod-v3-to-v4` |
| ESLint | 9.18.0 | **10.0.0** | Major | Released **Feb 6, 2026** (8 days ago); flat config only; removes all eslintrc support |
| Sentry SDK | 8.0.0 | **10.38.0** | 2 majors | Migration: 8→9→10; codemod: `npx @sentry/migr8@latest`; OpenTelemetry v2 in v10 |
| Turbo | 2.2.3 | **2.8.8** | Minor | Free remote caching via Vercel; improved task boundaries |
| pnpm | 10.29.2 | 10.x (current) | Current | **Catalogs** feature (since 9.5) solves version consistency |
| `@hookform/resolvers` | 3.9.1 | 5.2.2 | 2 majors | react-hook-form v8 still in beta; stay on v7 + resolvers v3 for now |
| `@supabase/supabase-js` | Not direct dep | 2.93.2 | N/A | Node 18 dropped in 2.79.0; granular tokens now mandatory |
| `@upstash/ratelimit` | 2.0.5 | 2.0.8 | Patch | Ephemeral caching enabled by default; analytics option |

### A.2 ESLint 10 (Just Released)

ESLint 10.0.0 was released on **February 6, 2026** — 8 days before this analysis. Key impacts:

- **Flat config is now the ONLY format** — `.eslintrc.*` files are completely ignored
- **Node.js >=20.19.0 required** (repo requires >=24, so compatible)
- Config lookup now starts from **each linted file's directory** upward (better for monorepos)
- Migration tool: `npx @eslint/migrate-config .eslintrc.json`

**Impact on this repo:** The repo already uses `eslint.config.mjs` in templates, so the flat config requirement is mostly met. However, `packages/ui` and `packages/utils` lack any ESLint config — under ESLint 10, they would pick up configs from parent directories (or none), which is actually slightly better behavior than ESLint 9 for monorepos.

**Recommendation:** Upgrade to ESLint 10 during the P2 sprint. The migration is low-risk since the repo already uses flat config.

### A.3 pnpm Catalogs (Solves Version Consistency)

pnpm **catalogs** (available since pnpm 9.5, already usable with the repo's pnpm 10.29.2) directly solve the version mismatch problem (D26, D27) identified in Phase 7:

```yaml
# pnpm-workspace.yaml
catalog:
  typescript: "5.9.3"
  zod: "^4.0.0"
  "@types/node": "^24.0.0"
  eslint: "^10.0.0"
  react: "19.2.4"
  react-dom: "19.2.4"
  next: "15.5.12"
  "@sentry/nextjs": "^10.0.0"
```

Then in every `package.json`:
```json
{ "dependencies": { "next": "catalog:" } }
```

**One place to update versions, zero drift.** This should be adopted immediately as part of the dependency alignment work.

### A.4 next-forge (Vercel's Reference Architecture)

Vercel maintains **next-forge** as the production-grade Turborepo template. Its architecture is relevant because it validates the "packages as platform" model the user wants:

| Aspect | next-forge | This Repo | Gap |
|--------|:----------:|:---------:|-----|
| Structure | `apps/*` + `packages/*` | `templates/*` + `packages/*` | Rename `templates` → reference; use `apps/` for clients |
| Linting | **Biome** (10-100x faster) | ESLint 9 + Prettier | Consider Biome for DX |
| Styling | Tailwind + shadcn/ui | Tailwind + custom | shadcn/ui adds accessible primitives |
| Database | Drizzle ORM + Neon | Supabase | Different approach; both valid |
| Auth | Clerk | None | Not needed for marketing sites |
| Observability | Sentry + BetterStack | Sentry (half-implemented) | Fix Sentry; consider BetterStack for logs |
| Packages | `@repo/design-system`, `@repo/database`, etc. | `@repo/ui`, `@repo/infra`, etc. | Similar pattern; this repo's infra is more mature |

**Key takeaway:** The repo's package structure is sound and aligns with industry best practice. The difference is that next-forge treats `apps/` as the primary deliverables and packages as the shared platform — exactly the model the user should adopt.

### A.5 Biome vs. ESLint (New Consideration)

Biome is now a mature alternative to ESLint + Prettier:

| Metric | ESLint + Prettier | Biome |
|--------|:-----------------:|:-----:|
| Lint 10,000 files | 45.2s | 0.8s |
| Format 10,000 files | 12.1s | 0.3s |
| Config files | 3+ | 1 (`biome.json`) |
| Language | Node.js | Rust |

**Recommendation:** Do NOT switch to Biome now — the repo has ESLint infrastructure already and ESLint 10 just dropped. However, for a future major DX improvement sprint, Biome is worth evaluating. The priority is fixing what's broken, not replacing what works.

---

## Addendum B: Architectural Paradigm Shift — "Unique Sites, Not Templates"

### B.1 The Problem with the Current Model

The current architecture is **template-centric**: pick a template → copy → customize. This pushes toward:

- Same structure, same layout, same sections across clients of the same type
- "Cookie-cutter" sites that look and feel identical
- Template code as the primary codebase, with packages as secondary

**The agency's stated goal is the opposite:** every client site should be **unique and distinct**, even when it's the same business type (e.g., two different hair salons).

### B.2 The Recommended Model: "Platform + Unique Apps"

Reframe the repo as a **platform**, not a template system:

```
packages/          ← THE CORE PLATFORM (security, UI, integrations, features)
  infra/           ← Security, middleware, logging, env, Sentry, rate limiting
  ui/              ← Design system primitives (compose differently per client)
  utils/           ← Shared utilities
  shared/          ← Types, config schemas
  integrations/    ← Supabase, HubSpot, booking providers, analytics
  features/        ← Contact, booking, blog, search (logic only, not layout)
  config/          ← ESLint, TypeScript configs

apps/              ← CLIENT SITES (each one unique)
  client-joes-salon/    ← Unique design, unique layout, unique content
  client-elite-cuts/    ← Completely different look, same platform underneath
  client-ace-plumbing/  ← Different industry, same platform

reference/         ← OPTIONAL REFERENCE IMPLEMENTATIONS (formerly "templates")
  hair-salon/      ← "Here's one way to build a salon site"
  plumber/         ← "Here's one way to build a plumber site"
```

### B.3 What Changes

| Aspect | Template Model (Current) | Platform Model (Recommended) |
|--------|:------------------------:|:----------------------------:|
| Starting a new client | Copy template → customize | New Next.js app → compose packages |
| Design freedom | Constrained by template structure | Fully unique per client |
| Shared code | Templates share by duplication | Apps share via packages |
| Templates | Primary deliverable | Optional reference only |
| Client sites | Customized copies | Original compositions |
| Adding a feature | Add to template → re-copy | Add to package → import in any app |

### B.4 Impact on TODO.md

The existing TODO.md is built around the template model. The recommended changes:

1. **Phase 1 (Extract & Share)** → Still relevant and partially done. Continue extracting shared code into packages.
2. **Phase 2 (UI Primitives)** → Still relevant. The UI library is the platform's design building block.
3. **Phase 3 (Industry Presets)** → **Demote.** Presets push toward sameness. Replace with a lighter `createSiteConfig()` that doesn't dictate layout or design.
4. **Phase 4 (Client Sites)** → **Elevate.** This is now the primary goal, not a later phase.
5. **Phase 5 (New Templates)** → **Remove or defer indefinitely.** Each new site is unique, not a new template.
6. **Phase 6 (Polish)** → Still relevant but should be earlier (CI/CD, testing, DX).
7. **Phase 7 (Future)** → Keep as backlog.

### B.5 What to Do with Existing Templates

- **Keep `templates/hair-salon`** as a working reference implementation
- **Deprecate `templates/plumber`** — it's an incomplete fork with hair-salon content; maintaining two templates that push toward sameness is counter to the goal
- **Do not create new templates** — each client site is built fresh on the platform
- Templates can still be run locally as demos or for platform development/testing
