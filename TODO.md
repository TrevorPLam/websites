# Marketing Platform Monorepo — Implementation Plan

> **Philosophy**: Share infrastructure, not design. Every client site is unique and distinct.  
> **Architecture**: Packages = the platform. Client apps = unique compositions on that platform.  
> **Last updated**: 2026-02-14  
> **Reference**: [Codebase Analysis Report](./docs/CODEBASE_ANALYSIS_REPORT.md)
>
> **Format**: Each task is markable `- [ ]`. Declares **Paths**, **Depends on**, **Verify**, and where applicable: **Code**, **Script**, or **Command**.

---

## Sprint 0 — Unblock CI & Fix Critical Issues

**Goal**: Get CI green. Fix security vulnerabilities. Fix Docker. Everything else depends on this.  
**Estimated effort**: <1 day  
**Depends on**: nothing  
**Can be largely scripted — run sequentially.**

### 0.1 Fix TypeScript Errors Blocking CI

- [ ] **0.1.1** Fix `TS2451` and `TS7006` in hair-salon test files

  - **Paths**: `templates/hair-salon/features/blog/__tests__/blog.test.ts`, `templates/hair-salon/lib/__tests__/search.test.ts`
  - **Issue**: Block-scoped variable redeclaration (`path`, `templateRoot`) and implicit `any` on callback params
  - **Fix**: Rename conflicting variables; add explicit types to all callback parameters
  - **Verify**: `pnpm run type-check` exits 0

  ```ts
  // Before (blog.test.ts)
  const path = require('path');  // conflicts with @types/node global
  posts.forEach((post) => { ... });  // implicit any

  // After
  const testPath = require('path');
  posts.forEach((post: { slug: string; title: string }) => { ... });
  ```

- [ ] **0.1.2** Verify plumber has same test issues and fix if present

  - **Paths**: `templates/plumber/features/blog/__tests__/blog.test.ts`, `templates/plumber/lib/__tests__/search.test.ts`
  - **Verify**: `pnpm run type-check` passes for both templates

### 0.2 Upgrade Sentry to Fix High-Severity Vulnerability

- [ ] **0.2.1** Upgrade `@sentry/nextjs` from 8.0.0 to latest stable (10.38.0+)

  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`, `packages/infra/package.json`
  - **Depends on**: none
  - **Script**:
    ```bash
    pnpm --filter=@templates/hair-salon add @sentry/nextjs@latest
    pnpm --filter=@templates/plumber add @sentry/nextjs@latest
    pnpm --filter=@repo/infra add -D @sentry/nextjs@latest
    ```
  - **Then run**: `npx @sentry/migr8@latest` to auto-fix deprecated API usage
  - **Migration notes**: 8→9 removes some APIs (`BaseClient` → `Client`); 9→10 upgrades OpenTelemetry to v2
  - **Verify**: `pnpm audit --audit-level high` no longer fails on rollup or @sentry/browser

- [ ] **0.2.2** Update `@repo/infra` peer dependency range

  - **Path**: `packages/infra/package.json`
  - **Change**: `"@sentry/nextjs": ">=8.0.0"` → `"@sentry/nextjs": ">=10.0.0"`
  - **Verify**: `pnpm install` succeeds

### 0.3 Upgrade Next.js to Patch 4 Moderate CVEs

- [ ] **0.3.1** Upgrade `next` to 15.5.12 (latest stable v15 patch)

  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`
  - **Script**:
    ```bash
    pnpm --filter=@templates/hair-salon add next@15.5.12 eslint-config-next@15.5.12
    pnpm --filter=@templates/plumber add next@15.5.12 eslint-config-next@15.5.12
    ```
  - **Also update**: `packages/infra/package.json` peer dep to `"next": "^15.5.0"`
  - **Verify**: `pnpm audit` shows 0 high, 0 moderate for `next`; `pnpm build` passes both templates

### 0.4 Fix Docker Build

- [ ] **0.4.1** Add `output: 'standalone'` to `next.config.js` (both templates)

  - **Paths**: `templates/hair-salon/next.config.js`, `templates/plumber/next.config.js`
  - **Code**:
    ```js
    const nextConfig = {
      output: 'standalone',  // ← ADD THIS
      transpilePackages: ['@repo/ui', '@repo/utils', '@repo/infra', '@repo/shared'],
      // ... rest unchanged
    };
    ```
  - **Also fix**: Add `@repo/infra` and `@repo/shared` to `transpilePackages` (currently missing)
  - **Verify**: `pnpm build` produces `.next/standalone/` directory

- [ ] **0.4.2** Create `.dockerignore`

  - **Path**: `.dockerignore`
  - **Content**:
    ```
    node_modules
    .next
    .git
    .github
    docs
    *.md
    .turbo
    ```
  - **Verify**: `docker build` context is significantly smaller

- [ ] **0.4.3** Pin pnpm version in Dockerfile, add non-root user, add HEALTHCHECK

  - **Path**: `templates/hair-salon/Dockerfile`
  - **Verify**: `docker build -f templates/hair-salon/Dockerfile .` succeeds

### 0.5 Version Alignment via pnpm Catalogs

- [ ] **0.5.1** Add catalog to `pnpm-workspace.yaml`

  - **Path**: `pnpm-workspace.yaml`
  - **Code**:
    ```yaml
    packages:
      - 'packages/*'
      - 'packages/config/*'
      - 'templates/*'
      - 'clients/*'

    catalog:
      next: "15.5.12"
      react: "19.2.4"
      react-dom: "19.2.4"
      typescript: "5.9.3"
      "@sentry/nextjs": "^10.0.0"
      "@types/node": "^24.0.0"
      "@types/react": "^19.2.0"
      "@types/react-dom": "^19.2.0"
      zod: "^3.23.0"
      eslint: "^9.18.0"
    ```
  - **Then**: Update all `package.json` files to use `"catalog:"` for these deps
  - **Verify**: `pnpm install` succeeds; `pnpm outdated` shows consistent versions

- [ ] **0.5.2** Upgrade `@types/node` to match `engines.node >= 24`

  - **All package.json files**: Change `@types/node` to `catalog:` (resolves to `^24.0.0`)
  - **Verify**: `pnpm run type-check` passes

### 0.6 Verify CI is Green

- [ ] **0.6.1** Run full CI pipeline locally

  - **Command**: `pnpm lint; pnpm type-check; pnpm build; pnpm test; pnpm audit --audit-level high`
  - **Verify**: All exit 0

---

## Sprint 1 — Security Hardening & Missing Infrastructure

**Goal**: Fix all critical security gaps. Add missing infra components.  
**Estimated effort**: 1–3 days  
**Depends on**: Sprint 0

### 1.1 Fix Booking Flow Security

- [ ] **1.1.1** Use `getValidatedClientIp` instead of raw `x-forwarded-for`

  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Replace**:
    ```ts
    // REMOVE:
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    // ADD:
    import { getValidatedClientIp } from '@repo/infra/security/request-validation';
    const clientIp = await getValidatedClientIp(headersList, { environment: validatedEnv.NODE_ENV });
    ```
  - **Verify**: IP is validated and sanitized; no raw header access

- [ ] **1.1.2** Replace `btoa` hashing with SHA-256

  - **Same files as 1.1.1**
  - **Replace**:
    ```ts
    // REMOVE:
    hashIp: (value: string) => btoa(value).substring(0, 16),
    // ADD (use same hashIp from contact form helpers, or don't pass — use default):
    // The default checkRateLimit uses salted SHA-256 from @repo/infra
    ```
  - **Verify**: Rate limiting uses cryptographic hashing

- [ ] **1.1.3** Add CSRF / origin validation to booking

  - **Same files as 1.1.1**
  - **Add before booking logic**:
    ```ts
    import { getBlockedSubmissionResponse } from '@/lib/actions/helpers';
    const blocked = getBlockedSubmissionResponse(headersList, formData);
    if (blocked) return blocked;
    ```
  - **Verify**: Booking submission rejects cross-origin requests

- [ ] **1.1.4** Replace `console.*` with structured logger

  - **Same files as 1.1.1**
  - **Replace all** `console.log`, `console.error` with `import { logger } from '@repo/infra'`
  - **Verify**: No `console.` calls remain in booking-actions.ts; PII not logged

- [ ] **1.1.5** Sanitize booking form fields before storage

  - **Paths**: `templates/*/features/booking/lib/booking-actions.ts`, `templates/*/features/booking/lib/booking-schema.ts`
  - **Action**: Call `escapeHtml()` / `sanitizeInput()` on user inputs before storing; call `sanitizeNotes()` on notes field
  - **Verify**: No raw HTML stored in booking data

- [ ] **1.1.6** Make booking IDs non-guessable

  - **Paths**: `templates/*/features/booking/lib/booking-actions.ts`
  - **Issue**: Currently `booking_${Date.now()}_${random}` — sequential and predictable
  - **Fix**: Use `crypto.randomUUID()` or similar cryptographic ID
  - **Verify**: Booking IDs are opaque UUIDs

- [ ] **1.1.7** Add auth/authorization for `getBookingDetails` (IDOR fix)

  - **Paths**: `templates/*/features/booking/lib/booking-actions.ts` L274–288
  - **Issue**: Any caller with a booking ID can retrieve details — no ownership check
  - **Verify**: Only the booking owner (or admin) can access details

- [ ] **1.1.8** Add CSRF to `confirmBooking` and `cancelBooking`

  - **Paths**: `templates/*/features/booking/lib/booking-actions.ts` L174–270
  - **Action**: Apply same `getBlockedSubmissionResponse` pattern as submitBookingRequest
  - **Verify**: State-changing booking endpoints reject cross-origin requests

- [ ] **1.1.9** Configure `allowedOrigins` for edge CSRF in middleware

  - **Paths**: `templates/*/middleware.ts`
  - **Action**: Pass `allowedOrigins` array to `createMiddleware()` options
  - **Verify**: Middleware rejects unknown origins

### 1.2 Activate Distributed Rate Limiting

- [ ] **1.2.1** Pass Upstash env to `checkRateLimit` call chain

  - **Paths**: `templates/*/lib/actions/submit.ts`, `templates/*/features/booking/lib/booking-actions.ts`
  - **Issue**: `checkRateLimit` never receives env, so Upstash Redis is never used (D8)
  - **Verify**: When `UPSTASH_REDIS_REST_URL` is set, rate limiting uses Redis (not in-memory)

### 1.3 Create Sentry Configuration Files

- [ ] **1.3.1** Create `sentry.client.config.ts` for hair-salon

  - **Path**: `templates/hair-salon/sentry.client.config.ts`
  - **Code**:
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
  - **Verify**: Sentry initializes in dev; events have PII stripped

- [ ] **1.3.2** Create `sentry.server.config.ts` for hair-salon

  - **Path**: `templates/hair-salon/sentry.server.config.ts`
  - **Code**: Similar to client but without replays; add `beforeSend: sanitizeSentryEvent`
  - **Verify**: Server-side errors captured with PII redacted

- [ ] **1.3.3** Fix Sentry DSN variable mismatch

  - **Path**: `packages/infra/env/schemas/sentry.ts`
  - **Issue**: Schema uses `SENTRY_DSN` but runtime checks `NEXT_PUBLIC_SENTRY_DSN`
  - **Verify**: Variable names are consistent across schema and runtime usage

- [ ] **1.3.4** Wrap `next.config.js` with `withSentryConfig`

  - **Path**: `templates/hair-salon/next.config.js`
  - **Verify**: Source maps uploaded to Sentry in production builds

- [ ] **1.3.5** Copy Sentry config to plumber template

  - **Verify**: Both templates have working Sentry with PII sanitization

### 1.4 Add Error Recovery Pages

- [ ] **1.4.1** Create `app/error.tsx` (route-level error boundary)

  - **Paths**: `templates/hair-salon/app/error.tsx`, `templates/plumber/app/error.tsx`
  - **Verify**: Rendering errors show recovery UI; Sentry captures the error

- [ ] **1.4.2** Create `app/global-error.tsx` (root layout error boundary)

  - **Paths**: `templates/hair-salon/app/global-error.tsx`, `templates/plumber/app/global-error.tsx`
  - **Verify**: Root-level errors show minimal recovery page

### 1.5 Add Health Check Endpoint

- [ ] **1.5.1** Create `/api/health` route

  - **Path**: `templates/hair-salon/app/api/health/route.ts`
  - **Code**:
    ```ts
    import { NextResponse } from 'next/server';
    export async function GET() {
      return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
    ```
  - **Copy to**: `templates/plumber/app/api/health/route.ts`
  - **Verify**: `curl localhost:3100/api/health` returns `{"status":"ok"}`

### 1.6 Create `.env.example`

- [ ] **1.6.1** Document all required and optional environment variables

  - **Path**: `.env.example`
  - **Source**: Aggregate from `packages/infra/env/schemas/*.ts`
  - **Verify**: New developer can copy `.env.example` → `.env.local` and start developing

---

## Sprint 2 — Package Quality & Boundaries

**Goal**: Fix all package boundary issues. Make the platform solid.  
**Estimated effort**: 3–5 days  
**Depends on**: Sprint 0

### 2.1 Fix Package Boundaries

- [ ] **2.1.1** Add `packages/integrations/*` to pnpm workspace

  - **Path**: `pnpm-workspace.yaml`
  - **Add**: `'packages/integrations/*'` to packages array
  - **Verify**: `pnpm install`; `@repo/integrations-supabase` is recognized

- [ ] **2.1.2** Declare `@repo/infra` subpath exports in `package.json`

  - **Path**: `packages/infra/package.json`
  - **Add all subpath exports that code currently imports**:
    ```json
    "exports": {
      ".": "./index.ts",
      "./client": "./index.client.ts",
      "./context/request-context": "./context/request-context.ts",
      "./context/request-context.server": "./context/request-context.server.ts",
      "./security/request-validation": "./security/request-validation.ts",
      "./sentry/sanitize": "./sentry/sanitize.ts",
      "./sentry/client": "./sentry/client.ts",
      "./sentry/server": "./sentry/server.ts"
    }
    ```
  - **Verify**: All template imports of `@repo/infra/*` resolve correctly

### 2.2 Fix Linting Infrastructure

- [ ] **2.2.1** Add ESLint config to `packages/ui`

  - **Path**: `packages/ui/eslint.config.mjs`
  - **Also add**: `"@repo/eslint-config": "workspace:*"` to devDependencies
  - **Verify**: `pnpm --filter=@repo/ui lint` runs and passes (or shows real issues)

- [ ] **2.2.2** Add ESLint config to `packages/utils`

  - **Path**: `packages/utils/eslint.config.mjs`
  - **Same pattern as 2.2.1**
  - **Verify**: `pnpm --filter=@repo/utils lint` runs and passes

### 2.3 Fix Testing Infrastructure

- [ ] **2.3.1** Fix root Jest config for multi-template support

  - **Path**: `jest.config.js`
  - **Issue**: `moduleNameMapper` hardcoded to `templates/hair-salon/$1`; plumber tests broken (D24)
  - **Options**:
    - A) Per-package Jest configs (preferred): Each template gets its own `jest.config.js` with correct `@/*` mapping; root runs via Turbo `turbo run test`
    - B) Fix root config to detect which template a test belongs to
  - **Verify**: `pnpm test` runs tests for both templates correctly

- [ ] **2.3.2** Remove unused `jest.helpers.ts`

  - **Path**: `jest.helpers.ts`
  - **Issue**: 146-line file that is never imported
  - **Verify**: `pnpm test` still passes after removal

### 2.4 Performance Quick Wins

- [ ] **2.4.1** Add `unstable_cache` for blog data

  - **Paths**: `templates/hair-salon/features/blog/lib/blog.ts`, `templates/plumber/features/blog/lib/blog.ts`
  - **Replace**: `cache(readAllPosts)` → `unstable_cache(readAllPosts, ['blog-all-posts'], { revalidate: 3600 })`
  - **Verify**: Blog data cached across requests (not re-read from filesystem each time)

- [ ] **2.4.2** Add fetch timeouts to external API calls

  - **Paths**: `templates/*/features/hubspot/lib/hubspot-client.ts`, `templates/*/features/supabase/lib/supabase-leads.ts`, `templates/*/features/booking/lib/booking-providers.ts`
  - **Add**: `signal: AbortSignal.timeout(10_000)` to all `fetch()` calls
  - **Verify**: External API calls fail gracefully after 10 seconds instead of hanging

- [ ] **2.4.3** Add periodic cleanup to `InMemoryRateLimiter`

  - **Path**: `packages/infra/security/rate-limit.ts`
  - **Issue**: `limits` Map grows without bound (D20)
  - **Verify**: Old entries are cleaned up periodically

### 2.5 DX Improvements

- [ ] **2.5.1** Create `.env.example` (if not done in 1.6)

- [ ] **2.5.2** Enable Turbo remote caching

  - **Commands**: `npx turbo login` → `npx turbo link`
  - **CI**: Add `TURBO_TOKEN` and `TURBO_TEAM` to GitHub Actions secrets
  - **Path**: `.github/workflows/ci.yml` — ensure `turbo` commands use remote cache
  - **Verify**: Second CI run shows cache hits

---

## Sprint 3 — Complete Existing Extractions

**Goal**: Finish the in-progress package extractions from the original roadmap.  
**Estimated effort**: 1–2 weeks  
**Depends on**: Sprint 0 (CI green)

### 3.1 Wire Templates to `@repo/integrations-supabase`

**Previously**: TODO 1.3.4 (incomplete)

- [ ] **3.1.1** Update templates to import from `@repo/integrations-supabase`

  - **Paths**: `templates/*/lib/actions/submit.ts`, `templates/*/features/supabase/`
  - **Depends on**: 2.1.1 (package in workspace)
  - **Verify**: `pnpm build` both; Supabase lead insert works

- [ ] **3.1.2** Delete duplicated `features/supabase/` from templates

  - **Verify**: No `features/supabase` dir in templates; builds pass

### 3.2 Extract HubSpot Integration

**Previously**: TODO 1.4

- [ ] **3.2.1** Create `packages/integrations/hubspot/`

  - **Path**: `packages/integrations/hubspot/package.json`
  - **Source**: `templates/hair-salon/features/hubspot/`, `templates/hair-salon/lib/actions/hubspot.ts`
  - **Verify**: `pnpm install`; package builds

- [ ] **3.2.2** Move client, sync logic, types

  - **Paths**: `packages/integrations/hubspot/client.ts`, `sync.ts`, `types.ts`
  - **Verify**: Retry/upsert logic preserved; templates import from package

- [ ] **3.2.3** Update templates and delete duplicated feature

  - **Verify**: `pnpm build` both; no `features/hubspot` in templates

### 3.3 Extract Booking Providers

**Previously**: TODO 1.5

- [ ] **3.3.1** Create `packages/integrations/booking-providers/`

  - **Source**: `templates/hair-salon/features/booking/lib/booking-providers.ts`
  - **Refactor**: Use registry/plugin pattern instead of closed factory (fixes D23)
  - **Code**:
    ```ts
    // Registry pattern (open for extension)
    const providerRegistry = new Map<string, BookingProvider>();
    export function registerProvider(name: string, provider: BookingProvider) {
      providerRegistry.set(name, provider);
    }
    export function getProvider(name: string): BookingProvider | undefined {
      return providerRegistry.get(name);
    }
    ```
  - **Verify**: Providers are extensible without modifying source

### 3.4 Extract Analytics

**Previously**: TODO 1.6

- [ ] **3.4.1** Create `packages/integrations/analytics/`

  - **Source**: `templates/hair-salon/features/analytics/`
  - **Include**: Tracking, consent management (GDPR), Vercel analytics helpers
  - **Verify**: `pnpm build`; analytics consent works

---

## Sprint 4 — Architecture Evolution (Platform Model)

**Goal**: Restructure repo from template-centric to platform-centric.  
**Estimated effort**: 1 week  
**Depends on**: Sprint 3

### 4.1 Restructure Directories

- [ ] **4.1.1** Create `apps/` directory for client sites

  - **Command**: `mkdir apps`
  - **Update**: `pnpm-workspace.yaml` — add `'apps/*'`

- [ ] **4.1.2** Move templates to `reference/` (or keep as `templates/` but clearly marked as reference)

  - **Decision**: Either rename `templates/` → `reference/` or add a `README.md` to `templates/` explaining they are reference implementations, not starting points for clients
  - **Update**: `pnpm-workspace.yaml`, `turbo.json`, `.github/workflows/ci.yml`
  - **Verify**: `pnpm build` passes; CI still works

- [ ] **4.1.3** Deprecate `templates/plumber`

  - **Issue**: Incomplete fork with hair-salon content (73% identical). Maintaining two near-identical templates pushes toward sameness.
  - **Action**: Add deprecation notice to `templates/plumber/README.md`; optionally move to `archive/plumber`
  - **Verify**: Team agrees on deprecation plan

### 4.2 Create Client Site Scaffold

- [ ] **4.2.1** Document the "new client site" process

  - **Path**: `docs/NEW_CLIENT_SITE.md`
  - **Content**: Step-by-step for starting a new client app that composes packages
  - **Sections**: Init Next.js app → add workspace deps → configure `site.config.ts` → build unique pages
  - **Verify**: A developer can follow the doc to create a new client site

- [ ] **4.2.2** Create a minimal client site scaffold (optional)

  - **Path**: `apps/_scaffold/` (or a script)
  - **Contains**: Bare `package.json` with platform deps, `next.config.js`, `site.config.ts` skeleton, `middleware.ts` using `createMiddleware`, `app/layout.tsx`, `app/page.tsx`
  - **Note**: This is NOT a template to copy — it's the minimal wiring to get platform packages working
  - **Verify**: `pnpm build` succeeds for scaffold app

### 4.3 CI/CD for Multi-App

- [ ] **4.3.1** Update CI to handle `apps/*` alongside `templates/*`

  - **Path**: `.github/workflows/ci.yml`
  - **Add**: Turbo filter for affected builds: `turbo run build --filter=...[HEAD^1]`
  - **Verify**: CI only builds changed apps/packages

- [ ] **4.3.2** Parallelize CI jobs

  - **Path**: `.github/workflows/ci.yml`
  - **Change**: Run lint, type-check, test as parallel jobs (not sequential steps)
  - **Verify**: CI completes faster

---

## Sprint 5 — Major Dependency Upgrades

**Goal**: Modernize the dependency stack.  
**Estimated effort**: 1–2 weeks (can be done incrementally)  
**Depends on**: Sprint 0 (CI green), Sprint 2 (package boundaries fixed)

### 5.1 Upgrade TypeScript (Low Risk)

- [ ] **5.1.1** Upgrade to TypeScript 5.9.3

  - **Command**: Update catalog in `pnpm-workspace.yaml`; `pnpm install`
  - **New features**: `import defer` support, better hovers, perf improvements
  - **Verify**: `pnpm type-check` passes

### 5.2 Upgrade Turbo (Low Risk)

- [ ] **5.2.1** Upgrade to Turbo 2.8.8

  - **Command**: `pnpm add -D -w turbo@latest`
  - **Verify**: `pnpm build` passes; remote caching works

### 5.3 Upgrade React (Low Risk)

- [ ] **5.3.1** Upgrade React and React DOM to 19.2.4

  - **Command**: Update catalog; `pnpm install`
  - **Verify**: `pnpm build` passes; no runtime regressions

### 5.4 Upgrade Tailwind CSS to v4 (High Risk — Plan Carefully)

- [ ] **5.4.1** Run automated migration tool

  - **Command**: `npx @tailwindcss/upgrade` (in each template directory)
  - **Key changes**:
    - `tailwind.config.js` → CSS-based `@theme` directives
    - `@tailwind base/components/utilities` → CSS imports
    - PostCSS config changes
    - Some utility class renames
  - **Verify**: All pages render correctly; no missing styles

- [ ] **5.4.2** Update `packages/ui` for Tailwind v4

  - **Verify**: All UI components render correctly with new Tailwind

- [ ] **5.4.3** Update `tailwind-merge` to v3

  - **Required for**: Tailwind v4 class format compatibility
  - **Verify**: `cn()` utility works correctly

### 5.5 Upgrade Zod to v4 (Medium Risk)

- [ ] **5.5.1** Run codemod and upgrade

  - **Command**: `npx zod-v3-to-v4` then `pnpm add zod@^4.0.0` via catalog
  - **Key changes**: `message` param → `error` param; `errorMap` → `error`
  - **Impact**: All env schemas in `packages/infra/env/schemas/`, all form schemas
  - **Verify**: `pnpm type-check` and `pnpm build` pass; env validation still works

### 5.6 Upgrade ESLint to v10 (Medium Risk)

- [ ] **5.6.1** Upgrade ESLint and plugins

  - **Command**: Update catalog to `eslint: "^10.0.0"`; upgrade `@typescript-eslint/*` to compatible versions
  - **Key change**: `.eslintrc.*` completely removed (repo already uses flat config)
  - **Verify**: `pnpm lint` passes; ESLint 10's per-file config lookup works correctly in monorepo

---

## Sprint 6 — UI Component Library Enhancement

**Goal**: Build out the design system primitives that enable unique client sites.  
**Estimated effort**: 2–4 weeks  
**Depends on**: Sprint 0 (CI green)  
**Note**: This can run in parallel with Sprints 1–4.

### 6.1 Audit & Foundation

- [ ] **6.1.1** Audit current 8 UI components (Button, Card, Container, Section, Input, Select, Textarea, Accordion)
- [ ] **6.1.2** Evaluate Radix UI or shadcn/ui as headless a11y layer
- [ ] **6.1.3** Add per-component exports for tree-shaking (`package.json` exports field)
- [ ] **6.1.4** Add ESLint config and unit tests to `packages/ui` (blocked by 2.2.1)

### 6.2 Content Primitives

- [ ] **6.2.1** Badge — `packages/ui/src/Badge/Badge.tsx`
- [ ] **6.2.2** Avatar + AvatarGroup — `packages/ui/src/Avatar/`
- [ ] **6.2.3** Divider — `packages/ui/src/Divider/Divider.tsx`
- [ ] **6.2.4** Image (Next.js wrapper) — `packages/ui/src/Image/Image.tsx`
- [ ] **6.2.5** VisuallyHidden — `packages/ui/src/VisuallyHidden/VisuallyHidden.tsx`

### 6.3 Layout Primitives

- [ ] **6.3.1** Stack / VStack — `packages/ui/src/Stack/Stack.tsx`
- [ ] **6.3.2** Inline / HStack — `packages/ui/src/Inline/Inline.tsx`
- [ ] **6.3.3** Grid — `packages/ui/src/Grid/Grid.tsx`
- [ ] **6.3.4** AspectRatio — `packages/ui/src/AspectRatio/AspectRatio.tsx`

### 6.4 Input Primitives

- [ ] **6.4.1** Checkbox — `packages/ui/src/Checkbox/Checkbox.tsx`
- [ ] **6.4.2** Radio + RadioGroup — `packages/ui/src/Radio/`
- [ ] **6.4.3** Switch — `packages/ui/src/Switch/Switch.tsx`
- [ ] **6.4.4** DatePicker — `packages/ui/src/DatePicker/DatePicker.tsx`
- [ ] **6.4.5** FileUpload — `packages/ui/src/FileUpload/FileUpload.tsx`

### 6.5 Feedback Components

- [ ] **6.5.1** Toast (wrap Sonner) — `packages/ui/src/Toast/`
- [ ] **6.5.2** Alert — `packages/ui/src/Alert/Alert.tsx`
- [ ] **6.5.3** Dialog/Modal — `packages/ui/src/Dialog/`
- [ ] **6.5.4** Drawer — `packages/ui/src/Drawer/Drawer.tsx`
- [ ] **6.5.5** Tooltip + Popover — `packages/ui/src/Tooltip/`, `Popover/`
- [ ] **6.5.6** Skeleton + Spinner — `packages/ui/src/Skeleton/`, `Spinner/`

### 6.6 Compositions

- [ ] **6.6.1** FormField (label + input + helper + error) — `packages/ui/src/FormField/`
- [ ] **6.6.2** NavigationMenu — `packages/ui/src/NavigationMenu/`
- [ ] **6.6.3** MobileMenu — `packages/ui/src/MobileMenu/`
- [ ] **6.6.4** Breadcrumb (with JSON-LD) — `packages/ui/src/Breadcrumb/`
- [ ] **6.6.5** Tabs, Pagination, Table — `packages/ui/src/Tabs/`, etc.

### 6.7 Hooks

- [ ] **6.7.1** useMediaQuery, useScrollPosition, useDebounce, useClickOutside, useReducedMotion
- [ ] **6.7.2** useFocusTrap, useIntersectionObserver

### 6.8 Accessibility (WCAG 2.2 AA)

- [ ] **6.8.1** SkipToContent — `packages/ui/src/SkipToContent/`
- [ ] **6.8.2** FocusTrap — `packages/ui/src/FocusTrap/`
- [ ] **6.8.3** LiveRegion — `packages/ui/src/LiveRegion/`
- [ ] **6.8.4** Audit all components — visible focus, 24×24px touch targets, aria attributes

---

## Sprint 7 — Feature Packages

**Goal**: Extract reusable feature logic (not UI, not layout — just logic).  
**Estimated effort**: 2–3 weeks  
**Depends on**: Sprint 3

### 7.1 `packages/features/contact/`

- [ ] **7.1.1** Create package with schema, server action, integrations composition
- [ ] **7.1.2** Keep form UI in client apps (each client designs their own contact form)
- [ ] **7.1.3** Update reference template to use feature package
- [ ] **Verify**: `pnpm build`; contact form submission works

### 7.2 `packages/features/booking/`

- [ ] **7.2.1** Create package with schema, server action, provider integration
- [ ] **7.2.2** **Replace in-memory Map with Supabase persistence** (fixes D5)
- [ ] **7.2.3** Update reference template
- [ ] **Verify**: Bookings persist across restarts

### 7.3 `packages/features/blog/`

- [ ] **7.3.1** Create package with MDX utilities, reading time, frontmatter parsing
- [ ] **7.3.2** Keep blog layout/design in client apps
- [ ] **Verify**: Blog pages render; tests pass

### 7.4 `packages/features/search/`

- [ ] **7.4.1** Create package with index builder, search logic
- [ ] **7.4.2** Keep search UI in client apps
- [ ] **Verify**: Search works across blog and pages

---

## Sprint 8 — Production Readiness

**Goal**: Testing, performance, SEO, documentation.  
**Estimated effort**: 2–4 weeks  
**Depends on**: Sprints 1–4

### 8.1 Testing

- [ ] **8.1.1** Unit tests for all `packages/infra` exports
- [ ] **8.1.2** Integration tests for contact and booking server actions (mocked external services)
- [ ] **8.1.3** E2E with Playwright for critical flows (form submit, mobile nav, keyboard nav)
- [ ] **8.1.4** axe-core accessibility testing in E2E

### 8.2 Performance

- [ ] **8.2.1** Move CSP nonce generation from layout to middleware (enables static generation) (D18)
- [ ] **8.2.2** Dynamic import heavy components below fold (`next/dynamic`)
- [ ] **8.2.3** Core Web Vitals audit — LCP <2.5s, INP <200ms, CLS <0.1
- [ ] **8.2.4** Tree-shaking verification for `packages/ui`

### 8.3 SEO

- [ ] **8.3.1** JSON-LD generators for LocalBusiness, Article, FAQ, BreadcrumbList
- [ ] **8.3.2** Auto sitemap and robots via Next.js Metadata API
- [ ] **8.3.3** Dynamic OG image generation

### 8.4 Documentation

- [ ] **8.4.1** `docs/NEW_CLIENT_SITE.md` — step-by-step guide
- [ ] **8.4.2** `CONTRIBUTING.md` — how to add a feature, integration, or UI component
- [ ] **8.4.3** `docs/ARCHITECTURE.md` — platform architecture overview
- [ ] **8.4.4** VS Code workspace settings and recommended extensions

---

## Backlog — Future Enhancements

**Do not build until demonstrated need.**

- [ ] **B.1** i18n — next-intl, hreflang — **Trigger**: Client needs multi-language
- [ ] **B.2** CMS integration — Sanity, Storyblok, Payload — **Trigger**: Client needs content editing
- [ ] **B.3** AI chatbot — **Trigger**: Client requests
- [ ] **B.4** A/B testing — **Trigger**: Data-driven optimization
- [ ] **B.5** CLI (`pnpm create:client`) — **Trigger**: 10+ client sites
- [ ] **B.6** Biome migration (replace ESLint + Prettier) — **Trigger**: DX sprint; 10-100x faster linting
- [ ] **B.7** Storybook or component showcase — **Trigger**: Team grows beyond 2-3 developers

---

## Progress Tracking

| Sprint | Description | Tasks | Status |
|:------:|-------------|:-----:|:------:|
| 0 | Unblock CI & Critical Fixes | 13 | Not started |
| 1 | Security Hardening & Missing Infra | 14 | Not started |
| 2 | Package Quality & Boundaries | 12 | Not started |
| 3 | Complete Existing Extractions | 9 | Not started |
| 4 | Architecture Evolution | 7 | Not started |
| 5 | Major Dependency Upgrades | 8 | Not started |
| 6 | UI Component Library | 30+ | Not started |
| 7 | Feature Packages | 10 | Not started |
| 8 | Production Readiness | 12 | Not started |

---

## Task Format Reference (for AI Agents)

Each executable task follows this structure:

```
- [ ] **Task ID** Task title
  - **Path**: `file/or/directory/path`
  - **Source**: `source/path` (for extraction tasks)
  - **Depends on**: Task IDs or "none"
  - **Verify**: Command to run, test to create, or criterion to check
  - **Code**: (optional) Code snippet showing the change
  - **Script**: (optional) Shell command to execute
  - [ ] **Subtask** — description
```

**Verification types**:

- `pnpm build` / `pnpm test` / `pnpm type-check` / `pnpm lint`
- Create unit test at `path` testing X
- Manual check: Y
- Lighthouse score Z

**Sprint execution order**: 0 → 1 → 2 (parallel with 1) → 3 → 4 → 5 (can overlap 4) → 6 (parallel with 3-5) → 7 → 8
