# Marketing Website Monorepo — Master TODO

**Last Updated:** February 14, 2026
**Goal:** Transform from template-based to feature-based, industry-agnostic marketing website platform
**Timeline:** 12 weeks | **Current State:** Single hair-salon template → **Target:** 12 industries, 20+ components, config-driven

---

## AI Agent Usage Instructions

Each task uses the following status convention:

- `[ ]` TODO/Pending
- `[🔄]` IN_PROGRESS
- `[x]` COMPLETED
- `[🚫]` BLOCKED
- `[⏸️]` PAUSED

**To update a task:** change its status line and fill in Assigned To / Completed date.

```markdown
**Status:** [🔄] IN_PROGRESS | **Assigned To:** [AgentName] | **Completed:** [ ]
**Status:** [x] COMPLETED | **Assigned To:** [AgentName] | **Completed:** [2026-02-14]
```

---

## Architecture Context

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)    │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)        │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)             │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)       │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│ ← @repo/infra exists
└─────────────────────────────────────────────────────────────────────────────┘
```

| Layer  | Package                      | Status             | Scope                                           |
| ------ | ---------------------------- | ------------------ | ----------------------------------------------- |
| **--** | Housekeeping (Wave 0)        | 🔴 Not Started     | Config fixes, tooling, CI, bug fixes (32 tasks) |
| **L2** | `@repo/ui`                   | 🟡 8 of 14         | +6 UI primitives                                |
| **L2** | `@repo/marketing-components` | 🔴 Not Started     | 10 marketing components                         |
| **L2** | `@repo/features`             | 🔴 Not Started     | 9 feature modules                               |
| **L2** | `@repo/types`                | 🟡 As @repo/shared | Move + extend SiteConfig                        |
| **L3** | `@repo/page-templates`       | 🔴 Not Started     | 6 page templates                                |
| **L3** | `clients/`                   | 🔴 Not Started     | 5 example client implementations                |
| **L0** | `@repo/infra`                | 🟢 Exists          | Security, middleware, logging, 7 env schemas    |
| **L0** | `@repo/integrations`         | 🟡 Partial         | 3 exist, 6 more planned                         |

---

## Execution Strategy

### Vision: Configuration-as-Code Architecture (CaCA)

Every aspect of a client website — theming, page composition, feature selection, SEO schema — is driven by a single validated `site.config.ts`. No code changes required to launch a new client. Config is the product. Code is the escape hatch.

### Wave Plan (Critical Path)

```text
Wave 0 (Repo Integrity) ────────────────────────────────────────────────────────┐
├── Batch A (config fixes)         ───── parallel ─────┐                        │
├── Batch B (code fixes)           ───── parallel ─────┤                        │
├── Batch C (tooling)              ───── after A ──────┘                        │
└── Batch D (upgrades + CI)        ───── after A+B+C ──────────────────────────┘
    │
    ├──→ Wave 1 Track A: Config + Types (0.8 → 1.8 → 1.9)
    ├──→ Wave 1 Track B: Feature Extraction (2.11 → 2.12-2.20)
    ├──→ Wave 1 Track C: Testing (2.21 → 2.22)
    │
    └──→ Wave 2: Page Templates (3.1-3.8)
         │
         └──→ Wave 3: Client Factory (5.1-5.7, 6.10)
```

### Parallelization Model

| Track                            | Tasks                           | Outcome                        |
| -------------------------------- | ------------------------------- | ------------------------------ |
| **Track A (Core Platform)**      | 0.x → Config/Types → CI/release | Stable monorepo + typed config |
| **Track B (Feature Extraction)** | 2.11-2.22 + parity tests        | Reusable feature spine         |
| **Track C (Template Assembly)**  | 3.1-3.8 → starter client        | Launch-ready page assembly     |

### Dependency Health Matrix

| Dependency Path         | Execution Rule                                            |
| ----------------------- | --------------------------------------------------------- |
| `0.3 → 0.13`            | Ship CI gate immediately after Turbo upgrade              |
| `0.8 → 1.8 → 1.9`       | Finish package move before config/industry expansion      |
| `1.7 → 2.1-2.10`        | Build package scaffold first, then components             |
| `2.11 → 2.12/13/15/20`  | Do not start extraction before feature skeleton exists    |
| `2.21 → 2.22`           | Establish strategy first, then parity suite               |
| `2.12-2.20 → 2.22`      | Add parity tests per extracted feature                    |
| `3.2/3.3/3.5/3.8 → 5.1` | Only start starter after minimum page set done            |
| `5.1 → 5.2/5.3/5.7`     | Use starter as single source for first launch factory     |
| `6.1/5.2-5.6 → 6.3`     | Never delete `templates/` until migration matrix complete |
| `6.3/6.9/5.7 → 6.10`    | Require rollback rehearsal before cutover sign-off        |

**Fast blocker checks before starting any task:**

1. Confirm all listed dependencies are marked complete
2. Confirm no dependency points to deferred NEXT/LATER work
3. Confirm CI gate requirements for the task's wave are already green
4. Confirm rollback path exists for any destructive or migration task

---

## Verified Findings (February 14, 2026 Audit)

> These corrections from 3 audit passes are **folded into the tasks below** rather than kept separate. This section is the reference log.

### Corrections to Prior Analysis

| Claim                               | Actual                                                         | Impact                       |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------- |
| "7 packages"                        | 5 top-level dirs → ~10 workspace packages                      | Package count was misleading |
| Search feature "no components"      | Has SearchDialog (6.3KB) + SearchPage (3.5KB)                  | Less extraction work         |
| Services feature "1 component"      | Has ServicesOverview + ServiceDetailLayout (8KB)               | Less extraction work         |
| Booking lib "4 files incl utils.ts" | 3 files (no utils.ts) + 1 test dir                             | Minor                        |
| navLinks "7 items"                  | 6 items (no Contact in nav)                                    | Minor                        |
| @repo/utils "zero dependencies"     | Has clsx + tailwind-merge as runtime deps                      | Incorrect claim              |
| conversionFlow "only booking"       | SiteConfig supports 4 flows: booking, contact, quote, dispatch | **Reduces Task 1.8 scope**   |
| "No tests in template features"     | 4 test files in template (blog, booking, env, search)          | Better test baseline         |
| Turbo "v2.8.4 available"            | Latest stable is v2.8.7+                                       | Gap is larger                |
| INP "replaces FID March 2026"       | INP replaced FID in **March 2024**                             | Already in effect            |

### Key Discoveries

- **@repo/shared** (`templates/shared/`): Defines `SiteConfig` type with 4 conversion flow types via discriminated union. Not inventoried previously.
- **7 env validation schemas** in `packages/infra/env/schemas/` (base, booking, hubspot, public, rate-limit, sentry, supabase).
- **Config conflict**: `.npmrc` sets `node-linker=hoisted`, `.pnpmrc` sets `node-linker=pnpm`.
- **Workspace glob mismatch**: `package.json` workspaces omits `packages/integrations/*`, `packages/features/*`, `apps/*`.
- **Broken infra export**: subpath `./security/create-middleware` → file is at `middleware/create-middleware.ts`.
- **Theme config not wired**: `site.config.ts` theme values have zero visual effect — no code generates CSS vars from config.
- **Sentry DSN mismatch**: Code uses `NEXT_PUBLIC_SENTRY_DSN`, schema validates `SENTRY_DSN`, `.env.example` documents `SENTRY_DSN`.
- **Dockerfile references standalone output** which is commented out in `next.config.js`.
- **Booking providers**: ~300 lines of duplicated code across 4 provider classes.
- **Broken Tailwind class**: `hover:bg-primary/90-50` in SearchDialog.
- **Node.js engine >=24.0.0** blocks contributors on LTS versions (20, 22).
- **turbo.json missing globalEnv** — env changes can produce incorrect cache hits.
- **Template deps not using pnpm catalog** — version drift between packages.

---

# NOW — Waves 0-3: Launch 2 Client Sites Fast

---

## Wave 0: Repo Integrity (Day 0-2)

> **Rationale:** Fix inconsistencies and upgrade tooling BEFORE building new features. Skipping risks cascading build failures and wasted rework.
>
> **Exit Gate:** `pnpm install && pnpm turbo lint type-check build test` all green.

### Batch A — Config & Dependency Fixes (parallel, ~2.5 hrs)

All tasks in Batch A can be executed in parallel. No dependencies between them.

---

#### 0.1 Resolve Config File Conflicts

**Priority:** CRITICAL | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `.npmrc` sets `node-linker = hoisted` while `.pnpmrc` sets `node-linker=pnpm`. These conflict. Since the project uses pnpm workspaces, `.pnpmrc` should win.

**Steps:**

1. Open `.npmrc` — remove the `node-linker = hoisted` line
2. Verify `.pnpmrc` — confirm `node-linker=pnpm` is present
3. Run `pnpm install` — confirm no linker warnings
4. Add decision note in `docs/tooling/pnpm.md` explaining why `node-linker=pnpm` is selected
5. Optional: if Windows path-length warnings appear, evaluate `virtualStoreDir` setting

**Acceptance Criteria:**

- Root `.npmrc` no longer contains `node-linker`
- Effective config resolves to `node-linker=pnpm` in all environments
- Fresh `pnpm install` succeeds without linker warnings

**Files:**

- Fix: `.npmrc` — remove `node-linker = hoisted`
- Verify: `.pnpmrc` — confirm `node-linker=pnpm`

---

#### 0.2 Sync Workspace Glob Configuration

**Priority:** CRITICAL | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `package.json` workspaces field is missing `packages/integrations/*`, `packages/features/*`, and `apps/*` that `pnpm-workspace.yaml` includes.

**Steps:**

1. Update `package.json` workspaces to match `pnpm-workspace.yaml`:
   ```json
   "workspaces": [
     "packages/*",
     "packages/config/*",
     "packages/integrations/*",
     "packages/features/*",
     "templates/*",
     "clients/*",
     "apps/*"
   ]
   ```
2. Run `pnpm -r list --depth -1` — verify expected package groups appear
3. Add CI check to prevent future drift (script that compares workspace arrays)
4. Document policy: "workspace changes must update both files in same PR"

**Acceptance Criteria:**

- `package.json` workspace globs exactly mirror `pnpm-workspace.yaml`
- `pnpm -r list --depth -1` includes expected package groups

**Files:**

- Fix: `package.json` — add missing workspace globs

---

#### 0.9 Fix Infra Dependency Placement

**Priority:** CRITICAL | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `@repo/infra` has runtime dependencies in `devDependencies`:

- `zod` — unconditionally imported at module load (all 7 env schemas). Must be `dependencies`.
- `@upstash/ratelimit` + `@upstash/redis` — dynamically imported with try/catch in `security/rate-limit.ts`. Should be `peerDependencies`.

**Evidence:**

- `packages/infra/security/rate-limit.ts:253-254` — `await import('@upstash/ratelimit')` and `await import('@upstash/redis')`
- `packages/infra/env/schemas/*.ts` (all 7 files) — `import { z } from 'zod'`

**Steps:**

1. In `packages/infra/package.json`, move `zod` from `devDependencies` to `dependencies`
2. Move `@upstash/ratelimit` and `@upstash/redis` from `devDependencies` to `peerDependencies`
3. Run `pnpm install` and confirm lockfile is clean
4. Verify no runtime module-not-found errors

**Files:**

- Fix: `packages/infra/package.json`

---

#### 0.10 Fix Broken Infra Export Path

**Priority:** CRITICAL | **Effort:** 5 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `packages/infra/package.json:18` exports `"./security/create-middleware": "./security/create-middleware.ts"` but the file is at `middleware/create-middleware.ts`. No consumer currently uses the broken subpath (verified via grep), but it's a latent bug.

**Steps:**

1. Decide canonical namespace: `./middleware/*` (matches filesystem) or `./security/*` (matches domain)
2. If keeping filesystem convention, change export to:
   ```json
   "./middleware/create-middleware": "./middleware/create-middleware.ts"
   ```
3. If keeping domain convention, move file to `security/create-middleware.ts`
4. Verify export resolves: add a temporary consumer test import

**Files:**

- Fix: `packages/infra/package.json` — correct export path

---

#### 0.15 Align Sentry DSN Environment Variable Naming

**Priority:** HIGH | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** All runtime code uses `NEXT_PUBLIC_SENTRY_DSN` but:

- `packages/infra/env/schemas/sentry.ts` validates `SENTRY_DSN` (wrong name)
- `.env.example:28-29` documents `SENTRY_DSN` (wrong name)

**Evidence:**

- `packages/infra/logger/index.ts:209` — `process.env.NEXT_PUBLIC_SENTRY_DSN`
- `packages/infra/sentry/client.ts:19`, `server.ts:18` — same
- `templates/hair-salon/sentry.client.config.ts:12`, `sentry.server.config.ts:12` — same

**Steps:**

1. Update `packages/infra/env/schemas/sentry.ts` — validate `NEXT_PUBLIC_SENTRY_DSN` instead of `SENTRY_DSN`
2. Update `.env.example` — document `NEXT_PUBLIC_SENTRY_DSN`
3. Keep `SENTRY_AUTH_TOKEN` as-is (build-time only, not `NEXT_PUBLIC_`)
4. Run type-check to confirm no breakage

**Files:**

- Fix: `packages/infra/env/schemas/sentry.ts`
- Fix: `.env.example`

---

#### 0.20 Fix Port Number Inconsistency

**Priority:** MEDIUM | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** Three different port numbers referenced:

- `templates/hair-salon/package.json:8-9` — port `3100` (dev server)
- `templates/hair-salon/site.config.ts:32` — fallback `http://localhost:3000`
- `templates/hair-salon/lib/constants.ts:101` — `DEFAULT_DEV_URL: 'http://localhost:3000'`
- `templates/hair-salon/Dockerfile:44` — `EXPOSE 3100`

**Steps:**

1. Align all references to port `3100` (since that's what `next dev` actually uses)
2. Update `site.config.ts` fallback URL
3. Update `lib/constants.ts` DEFAULT_DEV_URL

**Files:**

- Fix: `templates/hair-salon/site.config.ts`
- Fix: `templates/hair-salon/lib/constants.ts`

---

#### 0.27 Run pnpm Catalog Codemod for Dependency Consistency

**Priority:** HIGH | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** Template dependencies use hardcoded versions instead of `catalog:` protocol, causing version drift:

- `react: "19.0.0"` → should be `catalog:`
- `zod: "3.22.4"` → catalog has `^3.22.0` (infra has `^3.23.0`)
- `@sentry/nextjs: "10.38.0"` → should be `catalog:`
- `typescript: "5.7.2"` → should be `catalog:`

**Steps:**

1. Run `pnpx codemod pnpm/catalog`
2. Review diff — ensure catalog resolution is correct for all packages
3. Run `pnpm install` — verify lockfile is clean
4. Consider adding `catalogMode: 'strict'` to `.npmrc` to prevent future drift

**Files:**

- Update: All workspace `package.json` files (automated by codemod)

---

#### 0.28 Fix Node.js Engine Requirement

**Priority:** MEDIUM | **Effort:** 5 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `package.json:7` requires `"node": ">=24.0.0"`. Node 24 entered Current April 2025, LTS Oct 2025. This blocks contributors on LTS 20 and 22.

**Steps:**

1. Change to `"node": ">=22.0.0"` (latest LTS)
2. Verify CI runner Node version matches

**Files:**

- Fix: `package.json` — engines field

---

#### 0.29 Add globalEnv to turbo.json

**Priority:** HIGH | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `turbo.json` has no `globalEnv` or `globalPassThroughEnv`. Environment variables like `NODE_ENV` and `NEXT_PUBLIC_SITE_URL` could produce incorrect cache hits.

**Steps:**

1. Add to `turbo.json`:
   ```json
   {
     "globalEnv": [
       "NODE_ENV",
       "NEXT_PUBLIC_SITE_URL",
       "NEXT_PUBLIC_SENTRY_DSN",
       "NEXT_PUBLIC_GA_MEASUREMENT_ID"
     ],
     "globalPassThroughEnv": ["SENTRY_AUTH_TOKEN", "VERCEL_URL"]
   }
   ```
2. Clear turbo cache: `turbo clean`
3. Verify build succeeds with correct env handling

**Files:**

- Fix: `turbo.json`

---

### Batch B — Code Fixes (parallel with Batch A, ~5.5 hrs)

All tasks in Batch B can be executed in parallel with each other and with Batch A.

---

#### 0.14 Wire Theme Config to CSS Generation

**Priority:** CRITICAL | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Codex] | **Completed:** [2026-02-15]

**What:** The entire config-driven theming story was broken. `site.config.ts` defines HSL theme values (lines 103-121) but `globals.css` used hardcoded hex values. No code read `siteConfig.theme` to generate CSS custom properties. Changing `site.config.ts` theme values had **zero visual effect**.

**Evidence:**

- `templates/hair-salon/site.config.ts:103-121` — HSL strings like `'174 85% 33%'`
- `templates/hair-salon/app/globals.css:11` — Hex values like `#0ea5a4`
- `packages/config/tailwind-preset.js:4-27` — References `var(--primary)` etc.
- **No code** reads `siteConfig.theme` and generates CSS custom properties

**Steps:**

1. Create a `ThemeInjector` server component:
   ```typescript
   // packages/ui/src/components/ThemeInjector.tsx
   export function ThemeInjector({ theme }: { theme: ThemeColors }) {
     const css = Object.entries(theme)
       .map(([key, value]) => `--${key}: ${value};`)
       .join('\n    ');
     return <style dangerouslySetInnerHTML={{ __html: `:root {\n    ${css}\n  }` }} />;
   }
   ```
2. Export from `packages/ui/src/index.ts`
3. Use in `templates/hair-salon/app/layout.tsx`:
   ```tsx
   <ThemeInjector theme={siteConfig.theme.colors} />
   ```
4. Keep `globals.css` values as fallback defaults
5. Verify visual output changes when `site.config.ts` theme values change

**Acceptance Criteria:**

- [x] Changing theme values in `site.config.ts` produces visible CSS changes
- [x] `globals.css` remains as fallback when no config override exists
- [x] No hydration mismatch warnings (Server Component)

**Implementation Summary:**

- `ThemeInjector` existed; verified and enhanced (type compatibility with @repo/shared ThemeColors)
- Fixed `logError` calls in error.tsx and global-error.tsx (Task 0.26 follow-up) for build verification
- See `docs/theming/theme-injector.md` for architecture and usage

**Files:**

- `packages/ui/src/components/ThemeInjector.tsx` (enhanced types)
- `packages/ui/src/index.ts` (exports)
- `templates/hair-salon/app/layout.tsx` (wired)
- `docs/theming/theme-injector.md` (created)

---

#### 0.21 Replace Local `cn` Imports with `@repo/utils`

**Priority:** MEDIUM | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** Template components import a duplicate `cn()` from `@/lib/utils` instead of the canonical `@repo/utils` version.

**Evidence:** `templates/hair-salon/components/Navigation.tsx:33` — `import { cn } from '@/lib/utils';`

**Steps:**

1. Grep for all `@/lib/utils` imports across `templates/hair-salon/`
2. Replace each with `import { cn } from '@repo/utils';`
3. Verify `@repo/utils` is in template's `package.json` dependencies
4. Delete `templates/hair-salon/lib/utils.ts` if it only exports `cn`
5. Run type-check and build

**Files:**

- Fix: All template files importing `@/lib/utils`
- Possibly delete: `templates/hair-salon/lib/utils.ts`

---

#### 0.22 Fix Hardcoded Colors in not-found.tsx and loading.tsx

**Priority:** MEDIUM | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:**

- `templates/hair-salon/app/not-found.tsx:9-62` — Uses `blue-600`, `purple-600`, `pink-600`, `gray-900` instead of semantic tokens
- `templates/hair-salon/app/loading.tsx:10` — Spinner uses `border-t-blue-600` instead of `border-t-primary`

**Steps:**

1. Replace all hardcoded Tailwind color classes with semantic token classes (`primary`, `secondary`, `foreground`, etc.)
2. Verify visual output looks correct with current theme

**Files:**

- Fix: `templates/hair-salon/app/not-found.tsx`
- Fix: `templates/hair-salon/app/loading.tsx`

---

#### 0.23 Fix Social Links Missing target/rel Attributes

**Priority:** MEDIUM | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `templates/hair-salon/components/Footer.tsx:62-69` — Social media links lack `target="_blank"` and `rel="noopener noreferrer"`. The metaheader invariant says "Social links must open in new tabs" but the implementation doesn't enforce this.

**Additional fix:** Line 38 uses Instagram icon as TikTok fallback (`tiktok: Instagram`). Replace with `Music2` icon from Lucide or a custom SVG.

**Steps:**

1. Add `target="_blank" rel="noopener noreferrer"` to all social links
2. Replace TikTok icon fallback with `Music2` from lucide-react
3. Verify links open in new tabs

**Files:**

- Fix: `templates/hair-salon/components/Footer.tsx`

---

#### 0.24 Fix Supabase Client Eager Initialization

**Priority:** MEDIUM | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `packages/integrations/supabase/client.ts:200` — `export const supabaseClient = createSupabaseClient();` executes at module load time. Throws if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are not set. Any import crashes in environments without Supabase.

**Additional:** Duplicate `SupabaseClientConfig` interface in both `client.ts:34-38` and `types.ts:71-80`. Also `SupabaseApiResponse` uses `any` type at `types.ts:140,150`.

**Steps:**

1. Replace eager singleton with lazy pattern:
   ```typescript
   export const getSupabaseClient = () => createSupabaseClient();
   ```
2. Grep for `supabaseClient` imports and migrate to `getSupabaseClient()`
3. Remove duplicate `SupabaseClientConfig` from `client.ts`, import from `types.ts`
4. Replace `any` with `unknown` in `SupabaseApiResponse`

**Files:**

- Fix: `packages/integrations/supabase/client.ts`
- Fix: `packages/integrations/supabase/types.ts`

---

#### 0.25 Create Unified Route Registry

**Priority:** HIGH | **Effort:** 1 hr | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Codex] | **Completed:** [2026-02-15]

**What:** Two separate hardcoded lists of site pages exist:

- `templates/hair-salon/app/sitemap.ts:12-108` — 16 static pages
- `templates/hair-salon/lib/search.ts:38-119` — 10 static pages

When a route is added or removed, both files must be updated independently.

**Steps:**

1. Create `templates/hair-salon/lib/routes.ts` with a single authoritative route registry
2. Refactor `sitemap.ts` to consume from route registry
3. Refactor `search.ts` to consume from route registry
4. This becomes the foundation for config-driven routing in the refactor

**Implementation Summary:**

- Created `lib/routes.ts` with `RouteEntry` type, `STATIC_ROUTES` (16 entries), `getSitemapEntries()`, and `getSearchEntries()`
- `sitemap.ts` now uses `getSitemapEntries(baseUrl)` for static pages; blog posts still generated dynamically
- `search.ts` now uses `getSearchEntries()` for static pages; blog items merged in `buildSearchIndex()`
- Search index expanded to include all 16 static pages (previously 10) — adds service detail pages, privacy, terms
- Added `docs/architecture/route-registry.md` for architecture documentation
- Added `lib/__tests__/routes.test.ts` — 9 unit tests, all passing

**Files:**

- Created: `templates/hair-salon/lib/routes.ts`
- Refactored: `templates/hair-salon/app/sitemap.ts`
- Refactored: `templates/hair-salon/lib/search.ts`
- Created: `docs/architecture/route-registry.md`
- Created: `templates/hair-salon/lib/__tests__/routes.test.ts`

---

#### 0.26 Fix error.tsx and global-error.tsx Sentry Usage

**Priority:** MEDIUM | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:**

- `templates/hair-salon/app/error.tsx:11` — Directly imports `@sentry/nextjs` instead of `@repo/infra` abstraction. `ErrorBoundary.tsx` correctly uses `@repo/infra/client` — inconsistent.
- `templates/hair-salon/app/global-error.tsx:13` — Receives error but suppresses with eslint-disable. No error reporting at all. This is the **last-resort** error boundary.

**Steps:**

1. In `error.tsx`: Replace `import * as Sentry from '@sentry/nextjs'` with `import { logError } from '@repo/infra/client'`
2. Use `logError()` instead of `Sentry.captureException()`
3. In `global-error.tsx`: Add error reporting via `@repo/infra/client` logError
4. Remove eslint-disable that suppresses the unused error parameter

**Files:**

- Fix: `templates/hair-salon/app/error.tsx`
- Fix: `templates/hair-salon/app/global-error.tsx`

---

#### 0.30 Fix SearchDialog Broken Tailwind Class

**Priority:** HIGH | **Effort:** 5 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `templates/hair-salon/features/search/components/SearchDialog.tsx:141` — `hover:bg-primary/90-50` is not a valid Tailwind class.

**Steps:**

1. Change to `hover:bg-primary/5` (subtle hover) or `hover:bg-primary/50`
2. Verify visual appearance

**Files:**

- Fix: `templates/hair-salon/features/search/components/SearchDialog.tsx`

---

#### 0.31 Remove Deprecated bookingProviders Export

**Priority:** MEDIUM | **Effort:** 15 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `templates/hair-salon/features/booking/lib/booking-providers.ts:433` — `export const bookingProviders = getBookingProviders();` executes at module load time despite being marked `@deprecated` in favor of lazy `getBookingProviders()` (line 422).

**Steps:**

1. Remove line 433 entirely
2. Grep for `bookingProviders` imports (not `getBookingProviders`)
3. Migrate any found to `getBookingProviders()`

**Files:**

- Fix: `templates/hair-salon/features/booking/lib/booking-providers.ts`

---

### Batch C — Tooling Setup (after Batch A, ~3.5 hrs)

These tasks depend on Batch A config fixes being complete. Can run in parallel with each other.

---

#### 0.17 Add knip for Dead Code/Dependency Detection

**Priority:** HIGH | **Effort:** 1 hr | **Dependencies:** 0.2

**Status:** [x] COMPLETED | **Assigned To:** [Codex] | **Completed:** [2026-02-14]

**What:** [knip](https://knip.dev/) finds unused files, exports, and dependencies in monorepos. Would have automatically detected the duplicate `cn()`, broken export paths, stale dependencies.

**Implementation Summary:**

- Installed knip ^5.83.1 as root devDependency
- Created `knip.config.ts` with workspace config, ignoreDependencies, ignoreExportsUsedInFile, ignoreIssues, ignoreUnresolved
- Added `pnpm knip` to root scripts; added CI step (non-blocking, continue-on-error)
- Fixed ESLint imports: `@repo/eslint-config/library.js` → `@repo/eslint-config` (packages/infra, utils, ui)
- Added unlisted deps: @repo/config (hair-salon), @repo/eslint-config (infra), tailwindcss (packages/config)
- Created `docs/tooling/knip.md` for usage and interpretation

**Files:**

- Create: `knip.config.ts`
- Create: `docs/tooling/knip.md`
- Update: root `package.json` scripts
- Update: `.github/workflows/ci.yml`
- Update: `templates/hair-salon/package.json`, `packages/infra/package.json`, `packages/config/package.json`

---

#### 0.18 Add syncpack for Version Consistency

**Priority:** HIGH | **Effort:** 1 hr | **Dependencies:** 0.27

**Status:** [x] COMPLETED | **Assigned To:** [Codex] | **Completed:** [2026-02-14]

**What:** [syncpack](https://jamiemason.github.io/syncpack/) ensures consistent dependency versions across workspace packages. Would catch zod version mismatch, React not using catalog, etc.

**Implementation Summary:**

- Installed syncpack@13.0.4 (stable) as root devDependency
- Created `.syncpackrc.json` with version groups: ignore @repo/** (workspace), unsupported/catalog, local; semver group for peer deps (^)
- Fixed 11 mismatches via `syncpack fix-mismatches`: @eslint/eslintrc, @types/node, @upstash/*, eslint, tailwindcss, typescript, @sentry/nextjs peer
- Added `syncpack:check` and `syncpack:fix` to root scripts; CI step (blocking) after type-check
- Created `docs/tooling/syncpack.md`; cross-linked in `docs/tooling/pnpm.md`

**Files:**

- Created: `.syncpackrc.json`
- Created: `docs/tooling/syncpack.md`
- Update: root `package.json` scripts
- Update: `.github/workflows/ci.yml`
- Update: `packages/config/package.json`, `packages/infra/package.json`, `templates/hair-salon/package.json`, `templates/shared/package.json`, `packages/config/typescript-config/package.json` (version fixes)

---

#### 0.19 Add Export Map Validation Script

**Priority:** HIGH | **Effort:** 1 hr | **Dependencies:** 0.10

**Status:** [x] COMPLETED | **Assigned To:** [Codex] | **Completed:** [2026-02-14]

**What:** Validate that every entry in every `package.json` `exports` field resolves to an actual file on disk. Prevents BUG-1 (broken infra export) from recurring.

**Implementation Summary:**

- Created `scripts/validate-exports.js` (plain Node.js, matches validate-workspaces pattern — no tsx dep)
- Validates all workspace package.json files under packages/*, templates/*, clients/*, apps/*
- Supports simple string exports and conditional exports (import/require/default)
- Added `pnpm validate-exports` script; CI step (blocking) after type-check, before syncpack
- Created `docs/tooling/validate-exports.md`; cross-linked in `docs/tooling/pnpm.md`
- Verified: detects broken exports (tested with intentional invalid path); all current exports pass

**Files:**

- Create: `scripts/validate-exports.js`
- Create: `docs/tooling/validate-exports.md`
- Update: root `package.json` scripts
- Update: `.github/workflows/ci.yml`

---

#### 0.32 Create .env.production.local.example for Docker

**Priority:** MEDIUM | **Effort:** 30 min | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** [Cascade] | **Completed:** [2026-02-14]

**What:** `docker-compose.yml:17` references `.env.production.local` but no example file exists and no documentation for required vars.

**Steps:**

1. Create `.env.production.local.example` with all required vars documented
2. Add Docker section to CONTRIBUTING.md

**Files:**

- Create: `.env.production.local.example`
- Update: `CONTRIBUTING.md` or `docs/docker.md`

---

### Batch D — Upgrades & CI (after A+B+C, ~3.5 hrs)

These tasks must run after config/code fixes and tooling are in place.

---

#### 0.3 Upgrade Turborepo

**Priority:** HIGH | **Effort:** 1 hr | **Dependencies:** 0.2

**Status:** [x] COMPLETED | **Assigned To:** [Composer] | **Completed:** [2026-02-14]

**What:** Turbo 2.2.3 → 2.8.9 (latest stable). 6-minor-version gap with significant improvements: affected package detection, composable configuration, devtools, task search in TUI, sidecar tasks, performance.

**Steps:**

1. Run `pnpm up turbo@latest -D -w`
2. Verify `turbo.json` uses `tasks` (not `pipeline`) — already correct
3. Run `pnpm turbo lint type-check test build` — verify all pass
4. Check for deprecation warnings
5. Benchmark: compare `turbo build` wall time (clean + warm cache) before/after
6. Review [Turborepo upgrade guide](https://turbo.build/repo/docs/crafting-your-repository/upgrading)

**Acceptance Criteria:**

- `turbo` updated to current stable in root devDependencies
- `pnpm turbo lint type-check test build` succeeds
- No deprecation warnings from Turbo config

**Files:**

- Fix: root `package.json` — update `turbo` devDependency
- Create: `docs/tooling/turborepo.md` — configuration and upgrade documentation

**Completion Notes (2026-02-14):**

- Upgraded turbo 2.2.3 → 2.8.9 via `pnpm up turbo@latest -D -w`
- `turbo.json` already uses `tasks` (not deprecated `pipeline`); no config changes required
- No Turborepo deprecation warnings observed
- Full pipeline (lint, type-check, build, test) has pre-existing failures in @repo/utils (ESLint), @repo/ui (missing @typescript-eslint), @repo/integrations (tsconfig paths, CSP types) — see Wave 0 Batch B/C tasks
- Turborepo 2.8.9 orchestrates correctly; cache hits confirmed; see `docs/tooling/turborepo.md`

---

#### 0.11 Enforce Monorepo Boundaries

**Priority:** CRITICAL | **Effort:** 2 hrs | **Dependencies:** 0.2

**Status:** [x] COMPLETED | **Assigned To:** [Composer] | **Completed:** [2026-02-14]

**What:** Prevent cross-package architecture drift by enforcing import and dependency boundaries. Template code should not import internal feature implementation files directly.

**Implementation Summary:**

- Created `docs/architecture/module-boundaries.md` with dependency direction matrix and supported entrypoints
- Added `./env` → `./env/index.ts` to @repo/infra exports (was missing; hair-salon imports from `@repo/infra/env`)
- Created `packages/config/eslint-config/boundaries.js` with `no-restricted-imports` patterns: `@repo/*/src/*`, `**/packages/**`, `**/templates/**`
- Merged boundary rules into `@repo/eslint-config` (next.js and library.js) — lint step enforces boundaries
- Added `./boundaries` export to @repo/eslint-config package.json
- CI lint step already fails on boundary violations; added workflow comment for clarity
- Created `docs/adr/0002-module-boundaries-eslint.md` for architectural decision record

**Acceptance Criteria:**

- [x] Deep imports like `@repo/*/src/*` blocked via ESLint
- [x] Architectural dependency matrix documented in module-boundaries.md
- [x] CI fails on boundary violations (via existing `pnpm lint`)

**Files:**

- Created: `docs/architecture/module-boundaries.md`
- Created: `packages/config/eslint-config/boundaries.js`
- Created: `docs/adr/0002-module-boundaries-eslint.md`
- Update: `packages/infra/package.json` (./env export), `packages/config/eslint-config/package.json` (./boundaries export)
- Update: `packages/config/eslint-config/next.js`, `library.js` (boundary rules)
- Update: `.github/workflows/ci.yml` (comment)

---

#### 0.13 Strengthen CI Quality Gates

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** 0.3

**Status:** [x] COMPLETED | **Assigned To:** [Composer] | **Completed:** [2026-02-14]

**What:** Ensure every PR runs consistent checks: type safety, tests, build, lint, affected packages. Deliver Wave 0 baseline gate first, then extend after Task 2.21.

**Implementation Summary:**

- Split CI into `quality-gates` (blocking) and `quality-audit` (informative, parallel)
- PRs use `--filter="...[origin/main]"` for affected-package optimization; push runs full pipeline
- Added `nightly.yml` for daily full-repo validation (02:00 UTC + workflow_dispatch)
- Created `docs/ci/required-checks.md` with branch protection mapping
- Created `docs/adr/0003-ci-quality-gates.md` for architectural decision record
- turbo.json already defines lint/type-check/test/build for all packages (no change needed)

**Acceptance Criteria:**

- [x] PR CI runs lint/type-check/test/build with clear pass/fail gates
- [x] Affected-package path for speed; nightly full run configured
- [x] Required checks documentation matches branch protection config

**Note:** Pre-existing lint (@repo/utils) and test (env schema) failures remain; CI structure is complete.

**Files:**

- Update: `.github/workflows/ci.yml`
- Create: `.github/workflows/nightly.yml`
- Create: `docs/ci/required-checks.md`
- Create: `docs/adr/0003-ci-quality-gates.md`

---

#### 0.16 Fix Dockerfile Standalone Output

**Priority:** HIGH | **Effort:** 30 min | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** `templates/hair-salon/next.config.js:5` has `output: 'standalone'` commented out, but `Dockerfile:38` uses `COPY --from=builder .next/standalone ./`. Docker builds will fail with file-not-found.

**Steps:**

1. Re-enable `output: 'standalone'` in `next.config.js` (preferred for Docker deploys)
2. OR: Rewrite Dockerfile to not depend on standalone output
3. Verify Docker build succeeds: `docker build -t test .`

**Files:**

- Fix: `templates/hair-salon/next.config.js` OR `templates/hair-salon/Dockerfile`

---

### Wave 0 — Deferred Evaluation Tasks

These are investigation-only tasks. They produce a decision document, not code changes.

---

#### 0.4 Evaluate Tailwind CSS v4 Migration

**Priority:** MEDIUM | **Effort:** 2 hrs (evaluation only) | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Tailwind v4.0 (released Jan 2025) is a major architectural change: CSS-first config, no `tailwind.config.js`, native cascade layers, zero-config content detection. Project uses v3.4.17.

**Produce a migration risk matrix covering:**

1. Browser support impact for client contracts (Safari 16.4+, Chrome 111+, Firefox 128+)
2. Shared preset migration complexity (`tailwind-preset.js` → CSS variables/@theme)
3. Plugin/library compatibility (Radix/shadcn patterns, prose tooling)
4. If deferred: define explicit trigger condition (e.g., "migrate after first 2 clients live")

**Files to evaluate:**

- `packages/config/tailwind-preset.js`
- `templates/hair-salon/tailwind.config.js`
- All component files using Tailwind classes

**Output:** Decision doc: migrate now / defer / hybrid pilot

---

#### 0.5 Evaluate Next.js 16 Migration

**Priority:** MEDIUM | **Effort:** 2 hrs (evaluation only) | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Next.js 16 (released Oct 2025) includes React 19.2, stabilized Turbopack for production, caching improvements. Project uses 15.5.12 (Maintenance LTS).

**Key migration concerns:**

- Turbopack is default for `next dev` and `next build`
- Async Request APIs fully enforced (`cookies`, `headers`, `params`, `searchParams` async)
- `next lint` command removed — ESLint CLI must remain explicitly wired
- Cache model changed (`cacheComponents`, `use cache`)
- Breaking changes in `next/image`, routing boundaries

**Steps:**

1. Audit current code for sync dynamic API patterns
2. Audit webpack customizations that may block Turbopack
3. Add migration readiness checklist (runtime APIs, image config, lint flow, cache)
4. Write go/no-go recommendation with risks and mitigations

**Reference:** [Next.js v16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

**Output:** Written go/no-go recommendation

---

#### 0.6 Establish Performance Baseline

**Priority:** HIGH | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Capture Core Web Vitals baseline for hair-salon template before architectural changes.

**Steps:**

1. Run Lighthouse CI on hair-salon template (local build)
2. Record LCP, INP, CLS, TTFB, FCP scores
3. Record environment details (CPU throttling, network profile, build mode)
4. Set performance budgets in `next.config.js`
5. Add `@next/bundle-analyzer` for tracking JS bundle sizes
6. Define "performance budget policy" with fail thresholds for CI

**Targets:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1

**Files:**

- Create: `docs/performance-baseline.md`
- Update: `templates/hair-salon/next.config.js` (add bundle analyzer)

---

#### 0.7 Accessibility Audit

**Priority:** HIGH | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Run automated checks and document WCAG 2.2 AA gaps before building new components.

**Steps:**

1. Run axe-core or pa11y on all hair-salon pages
2. Document compliance status per page per WCAG criterion
3. Include manual scenarios: keyboard-only nav, visible focus, modal focus trap, touch targets, form errors
4. Create reusable component-level a11y checklist for PR template
5. Verify existing ARIA attributes in @repo/ui components

**Files:**

- Create: `docs/accessibility-audit.md`

---

#### 0.12 Add Changesets and Versioning Workflow

**Priority:** HIGH | **Effort:** 2 hrs | **Dependencies:** 0.2

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Introduce deterministic package versioning and changelog generation for multi-package refactors.

**Steps:**

1. Install changesets: `pnpm add -Dw @changesets/cli`
2. Create `.changeset/config.json`
3. Create `.github/workflows/release.yml` (or extend existing CI)
4. Add scripts to root `package.json`: `changeset`, `version-packages`, `release`
5. Define release channels (stable/canary) and publish policy
6. Create `docs/release/versioning-strategy.md`

**Files:**

- Create: `.changeset/config.json`
- Create: `.github/workflows/release.yml`
- Update: root `package.json` scripts
- Create: `docs/release/versioning-strategy.md`

---

## Wave 1: Config + Feature Spine (Day 2-6)

> **Rationale:** Minimum high-value reusable features needed to launch service-business clients quickly.
>
> **Exit Gate:** Feature packages build, type-check, and pass parity tests vs template baseline.

### Track A — Config + Types

---

#### 0.8 Move @repo/shared to packages/types

**Priority:** CRITICAL | **Effort:** 1 hr | **Dependencies:** 0.2

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** `@repo/shared` lives in `templates/shared/` — anomalous location. Move to `packages/types/` for proper placement. Preserve existing SiteConfig type infrastructure (4 conversion flow types).

**Steps:**

1. Create `packages/types/package.json` (rename from `@repo/shared` to `@repo/types`)
2. Move `templates/shared/types/` → `packages/types/src/`
3. Update all imports from `@repo/shared/types` → `@repo/types`
4. Update `templates/hair-salon/site.config.ts` import
5. Update `pnpm-workspace.yaml` if needed
6. **Update `jest.config.js:93`** — change `'^@repo/shared/(.*)$': '<rootDir>/templates/shared/$1'` to new path (INT-5)
7. Create migration map documenting old → new import paths
8. Run type-check across all workspace packages
9. Delete `templates/shared/` after migration verified

**Acceptance Criteria:**

- `@repo/types` builds and is consumed by template(s) without deep imports
- No remaining production imports from `templates/shared/*`
- Type-check passes across all workspace packages
- Jest tests still pass

**Note:** Existing `SiteConfig` type already supports `booking | contact | quote | dispatch` conversion flows. Task 1.8 will EXTEND this, not replace it.

**Files:**

- Create: `packages/types/package.json`
- Move: `templates/shared/types/` → `packages/types/src/`
- Update: All `@repo/shared/types` imports
- Update: `jest.config.js`
- Delete: `templates/shared/`

---

#### 1.8 Enhance Configuration System

**Priority:** CRITICAL | **Effort:** 4 hrs (reduced — existing foundation) | **Dependencies:** 0.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** EXTEND (not rebuild) the existing `SiteConfig` type to add `industry`, `features`, and `integrations` fields. Add Zod runtime validation companion.

**Existing foundation (from @repo/shared/types/site-config.ts):**

- `SiteConfig` interface with id, name, tagline, description, url
- `NavLink`, `SocialLink`, `FooterConfig`, `ContactInfo`, `SeoDefaults`, `ThemeColors`
- `ConversionFlowConfig` discriminated union (4 types)

**New fields to add:**

```typescript
interface SiteConfig {
  // ... existing fields preserved ...
  industry:
    | 'salon'
    | 'restaurant'
    | 'law-firm'
    | 'dental'
    | 'medical'
    | 'fitness'
    | 'retail'
    | 'consulting'
    | 'realestate'
    | 'construction'
    | 'automotive'
    | 'general';
  features: {
    hero: 'centered' | 'split' | 'video' | 'carousel' | null;
    services: 'grid' | 'list' | 'tabs' | 'accordion' | null;
    team: 'grid' | 'carousel' | 'detailed' | null;
    testimonials: 'carousel' | 'grid' | 'marquee' | null;
    pricing: 'table' | 'cards' | 'calculator' | null;
    contact: 'simple' | 'multi-step' | 'with-booking' | null;
    gallery: 'grid' | 'carousel' | 'lightbox' | null;
    blog: boolean;
    booking: boolean;
    faq: boolean;
  };
  integrations: {
    analytics?: { provider: 'google' | 'plausible' | 'none'; trackingId?: string };
    crm?: { provider: 'hubspot' | 'none'; portalId?: string };
    booking?: { provider: 'internal' | 'calendly' | 'acuity' | 'none' };
    email?: { provider: 'mailchimp' | 'sendgrid' | 'none' };
    chat?: { provider: 'intercom' | 'crisp' | 'none' };
  };
  theme: {
    colors: ThemeColors;
    fonts: ThemeFonts;
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
    shadows: 'none' | 'small' | 'medium' | 'large';
  };
}
```

**Steps:**

1. Extend type in `packages/types/src/site-config.ts`
2. Create Zod schema companion: `packages/types/src/site-config.schema.ts`
3. Add build-time validation in `next.config.js` pattern
4. Verify backwards-compatibility with existing hair-salon config
5. Add type tests for invalid combinations

**Acceptance Criteria:**

- Extended type remains backwards-compatible with existing hair-salon config
- New fields have safe defaults and clear docs
- Type tests verify invalid combinations rejected at compile-time

**Files:**

- Extend: `packages/types/src/site-config.ts`
- Create: `packages/types/src/site-config.schema.ts`

---

#### 1.9 Create Industry Types Package

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Define industry-specific configurations and defaults for all 12 industries.

**Steps:**

1. Create `packages/types/src/industry.ts` — Industry type union + IndustryConfig interface
2. Create `packages/types/src/industry-configs.ts` — Default configs per industry:
   ```typescript
   export const industryConfigs: Record<Industry, IndustryConfig> = {
     salon: {
       schemaType: 'HairSalon',
       defaultFeatures: { hero: 'split', services: 'grid', team: 'grid', booking: true },
       requiredFields: ['services', 'hours', 'team'],
       defaultIntegrations: { booking: 'internal', crm: 'hubspot' },
     },
     restaurant: {
       schemaType: 'Restaurant',
       defaultFeatures: { hero: 'centered', services: 'tabs', booking: true },
       requiredFields: ['menu', 'hours', 'location'],
     },
     // ... all 12 industries
   };
   ```
3. Add Schema.org type mapping per industry
4. Add extension mechanism for custom verticals
5. Separate "required for launch" vs "recommended for optimization" fields

**Acceptance Criteria:**

- All 12 industries compile with typed defaults
- Presets can be partially overridden without breaking type safety
- SEO schema mapping documented per industry

**Files:**

- Create: `packages/types/src/industry.ts`
- Create: `packages/types/src/industry-configs.ts`
- Update: `packages/types/src/index.ts`

---

### Track B — Feature Extraction

---

#### 2.11 Create packages/features Structure

**Priority:** CRITICAL | **Effort:** 1 hr | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Create the shared features package directory structure.

**Steps:**

1. Create `packages/features/package.json` (follow `packages/ui/package.json` pattern)
2. Create `packages/features/tsconfig.json`
3. Create `packages/features/src/index.ts`
4. Create feature subdirectories:
   ```
   packages/features/src/
   ├── booking/
   ├── contact/
   ├── blog/
   ├── services/
   ├── search/
   ├── testimonials/
   ├── team/
   ├── gallery/
   ├── pricing/
   └── index.ts
   ```
5. Verify `pnpm-workspace.yaml` already references `packages/features/*`
6. Add build/lint/test scripts
7. Verify `pnpm turbo build` includes the new package

**Files:**

- Create: `packages/features/package.json`
- Create: `packages/features/tsconfig.json`
- Create: `packages/features/src/index.ts`
- Create: Feature subdirectories

---

#### 2.12 Extract Booking Feature

**Priority:** CRITICAL | **Effort:** 6 hrs | **Dependencies:** 2.11, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Move booking from template to shared package. Remove hair-salon specific hardcoding. Address 3 internal findings during extraction.

**Source files (verified):**

- `templates/hair-salon/features/booking/components/BookingForm.tsx`
- `templates/hair-salon/features/booking/lib/booking-schema.ts` (7,475 bytes)
- `templates/hair-salon/features/booking/lib/booking-actions.ts` (10,740 bytes)
- `templates/hair-salon/features/booking/lib/booking-providers.ts` (13,842 bytes)
- `templates/hair-salon/features/booking/lib/__tests__/booking-actions.test.ts`
- `templates/hair-salon/features/booking/index.ts`

**Target:** `packages/features/src/booking/`

**Sub-tasks during extraction:**

1. **Copy and refactor files** to target location
2. **Remove hardcoded SERVICE_TYPES and TIME_SLOTS** (booking-schema.ts:36-47) — derive from config:
   ```typescript
   interface BookingFeatureProps {
     services: Array<{ id: string; name: string; duration: number; price?: number }>;
     timeSlots: string[];
     providers: BookingProvider[];
     maxAdvanceDays?: number;
     onSubmit: (data: BookingData) => Promise<void>;
   }
   ```
3. **Abstract provider duplication (INT-1):** ~300 lines duplicated across 4 providers (Mindbody, Vagaro, Square, Calendly). Extract `BaseBookingProvider` or strategy pattern:
   ```typescript
   interface BookingProviderAdapter {
     readonly name: string;
     readonly apiBase: string;
     mapServiceId(serviceType: string): string;
     mapTimeSlot(slot: string): string;
     buildRequestBody(data: BookingFormData): Record<string, unknown>;
     parseResponse(json: unknown): BookingProviderResponse;
   }
   ```
4. **Derive booking schema enums from siteConfig (INT-3)** — `SERVICE_TYPES` and `TIME_SLOTS` currently duplicate `site.config.ts` values
5. Create re-export stubs at source for backward compat during transition
6. Run parity tests (Task 2.22)

**Acceptance Criteria:**

- Booking feature passes parity tests vs template baseline
- Hardcoded constants fully externalized to config/props
- Provider adapter interface supports at least internal + one external

**Files:**

- Create: `packages/features/src/booking/components/BookingForm.tsx`
- Create: `packages/features/src/booking/lib/schema.ts`
- Create: `packages/features/src/booking/lib/actions.ts`
- Create: `packages/features/src/booking/lib/providers.ts`
- Create: `packages/features/src/booking/index.ts`

---

#### 2.13 Extract Contact Feature

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** 2.11, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Move contact from template to shared package. Make fields configurable, add multi-step variant support.

**Steps:**

1. Copy `templates/hair-salon/features/contact/` → `packages/features/src/contact/`
2. Add typed field schema registry for per-client customization
3. Make validation, consent text, and field sets configurable
4. Multi-step variant: include step persistence and back-navigation
5. Submission handlers pluggable per client
6. Run parity tests

**Source:** `templates/hair-salon/features/contact/`
**Target:** `packages/features/src/contact/`

---

#### 2.15 Extract Services Feature

**Priority:** HIGH | **Effort:** 4 hrs | **Dependencies:** 2.11, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Move services from template to shared package. Make generic (not hair-salon specific).

**Source (verified):** `templates/hair-salon/features/services/` — 2 components: `ServicesOverview` (3.9KB), `ServiceDetailLayout` (8KB, significant)

**Steps:**

1. Copy to `packages/features/src/services/`
2. Make service taxonomy configurable for cross-industry naming
3. Add category organization and structured data hooks
4. Both components (overview + detail) must be extracted and configurable

**Target:** `packages/features/src/services/`

---

#### 2.20 Extract Search Feature

**Priority:** HIGH | **Effort:** 4 hrs | **Dependencies:** 2.11, 1.1 (Dialog)

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Move search from template to shared package. Search has 2 substantial components plus library code scattered across directories.

**Source files (verified):**

- `templates/hair-salon/features/search/components/SearchDialog.tsx` (6,275 bytes)
- `templates/hair-salon/features/search/components/SearchPage.tsx` (3,487 bytes)
- `templates/hair-salon/lib/search.ts` (4,487 bytes) — **needs to move INTO feature**
- `templates/hair-salon/features/search/index.ts`

**Steps:**

1. Copy files to `packages/features/src/search/`
2. Move `lib/search.ts` into the search feature directory
3. Make search index configurable (not hardcoded to hair-salon content)
4. Abstract content source (MDX, CMS, API)
5. SearchDialog should use Dialog from @repo/ui (depends on 1.1)
6. Add regression tests for ranking + highlighting behavior

**Target:** `packages/features/src/search/`

---

#### 2.14 Extract Blog Feature

**Priority:** HIGH | **Effort:** 5 hrs | **Dependencies:** 2.11, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Move blog from template to shared package. Add content source abstraction.

**Source:** `templates/hair-salon/features/blog/` (1 component: BlogPostContent.tsx, lib: blog.ts 8.4KB + blog-images.ts 1KB, test file)

**Steps:**

1. Copy to `packages/features/src/blog/`
2. Add content source adapter interface (MDX, CMS, API)
3. Add canonical slug policy and collision handling
4. Preserve categories, tags, pagination routes

**Target:** `packages/features/src/blog/`

**Note:** Search is a SEPARATE feature with its own components. Do not conflate with blog extraction.

---

### Track C — Testing Foundation

---

#### 2.21 Establish Testing Strategy

**Priority:** HIGH | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Define testing approach for all new packages. Currently 13 test files exist (9 infra, 4 template) but no UI or utility tests.

**Existing infrastructure:**

- Root: Jest 30.2.0, ts-jest, @testing-library/react, @testing-library/jest-dom
- Infra tests: Well-structured with mocks (good reference)
- Template tests: blog.test.ts, booking-actions.test.ts, env.test.ts, search.test.ts

**Steps:**

1. Define test strategy per package type (unit, integration, e2e) — create `docs/testing-strategy.md`
2. Set up Jest config for `packages/ui/` (component testing with @testing-library/react)
3. Set up Jest config for `packages/features/` (action + schema testing)
4. Create test templates (component test, server action test, schema test)
5. Add test scripts to new package.json files
6. Set coverage targets: 50% for Phase 1, 80% by Phase 6
7. Define flaky-test policy and deterministic fixture strategy

**Files:**

- Create: `docs/testing-strategy.md`
- Update: `packages/ui/package.json` (test script)
- Update: `jest.config.js` (add package paths)

---

#### 2.22 Add Feature Parity Regression Tests

**Priority:** CRITICAL | **Effort:** 5 hrs | **Dependencies:** 2.12-2.20, 2.21

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Ensure extracted features behave the same as originals before deleting template code.

**Steps:**

1. Create parity matrix mapping every extracted feature to explicit test cases
2. Prioritize business-critical paths: booking submit, lead capture, search intent
3. Mark intentional deltas explicitly to avoid false-positive regressions
4. Add parity suite as blocking CI check on extraction PRs
5. No template feature is deleted without parity test sign-off

**Coverage:**

- Booking submission/validation parity
- Search relevance and indexing parity
- Services rendering/data-shape parity
- Contact/blog workflow parity

**Files:**

- Create: `templates/hair-salon/__tests__/refactor-parity/*.test.ts`
- Create: `packages/features/src/*/__tests__/parity/*.test.ts`
- Create: `docs/testing/refactor-parity-matrix.md`

---

## Wave 2: Minimal Page Template Set (Day 6-9)

> **Rationale:** Enough pages for lead generation and appointments without waiting on full template catalog.
>
> **Exit Gate:** Page templates render from config, pass a11y and perf smoke checks.

---

#### 3.1 Create Page Templates Package

**Priority:** HIGH | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Create the shared page templates package scaffold.

**Steps:**

1. Create `packages/page-templates/package.json`
2. Create `packages/page-templates/tsconfig.json`
3. Create `packages/page-templates/src/index.ts`
4. Create `packages/page-templates/src/templates/` directory
5. Implement section registry pattern (composable, not switch-statement):
   ```typescript
   const sectionRegistry = new Map<string, React.ComponentType<any>>([
     ['hero:centered', HeroCentered],
     ['hero:split', HeroSplit],
     ['services:grid', ServiceGrid],
     // ... extensible by clients
   ]);
   ```
6. Add template contract tests for required props and section fallbacks

**Files:**

- Create: `packages/page-templates/package.json`
- Create: `packages/page-templates/tsconfig.json`
- Create: `packages/page-templates/src/index.ts`
- Create: `packages/page-templates/src/registry.ts`

---

#### 3.2 Build HomePageTemplate

**Priority:** HIGH | **Effort:** 6 hrs | **Dependencies:** 3.1, 2.1, 2.12

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Configurable homepage that assembles sections based on config. Uses section registry, not brittle switch statements.

**Steps:**

1. Create `packages/page-templates/src/templates/HomePageTemplate.tsx`
2. Implement config-driven section composition via `sectionRegistry`
3. Add config lint rule for duplicate/unknown section IDs
4. Add deterministic fallback for unknown/disabled section types
5. Pass a11y and performance smoke checks

**Template logic:**

```typescript
export function HomePageTemplate({ config }: { config: SiteConfig }) {
  const sections = config.sections || getDefaultSections(config.industry);
  return sections.map((section) => renderSection(sectionRegistry, section));
}
```

**Additional (from audit):**

- OG image route (`app/api/og/route.tsx`) must read from siteConfig instead of hardcoded scissors emoji, "Professional Hair Care", and color values (NEW-3)
- Breadcrumbs should be conditional based on route depth — not on every page (NEW-13)

---

#### 3.3 Build ServicesPageTemplate

**Priority:** HIGH | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.2, 2.15

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Services listing with grid, list, or tabs layout. Category filtering. URL-synced filter state.

**Props:**

```typescript
interface ServicesPageTemplateProps {
  services: Service[];
  layout: 'grid' | 'list' | 'tabs';
  categories?: string[];
  showPricing?: boolean;
}
```

**Files:**

- Create: `packages/page-templates/src/templates/ServicesPageTemplate.tsx`

---

#### 3.5 Build ContactPageTemplate

**Priority:** HIGH | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.10, 2.13

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Contact page with form + business info + optional map. Config-driven form variant selection.

**Props:**

```typescript
interface ContactPageTemplateProps {
  contact: ContactInfo;
  showMap: boolean;
  formVariant: 'simple' | 'multi-step' | 'with-booking';
}
```

**Files:**

- Create: `packages/page-templates/src/templates/ContactPageTemplate.tsx`

---

#### 3.8 Build BookingPageTemplate

**Priority:** HIGH | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.12

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Booking page with pre-fillable service selection. Context-aware prefill.

**Props:**

```typescript
interface BookingPageTemplateProps {
  prefilledService?: string;
  config: BookingConfig;
}
```

**Files:**

- Create: `packages/page-templates/src/templates/BookingPageTemplate.tsx`

---

## Wave 3: Client Factory (Day 9-12)

> **Rationale:** 2 production-like clients can be spun up from starter with config-only changes.
>
> **Exit Gate:** `turbo gen new-client` creates a bootable client. 2 example clients pass validation.

---

#### 5.1 Create Client Starter Template

**Priority:** CRITICAL | **Effort:** 6 hrs | **Dependencies:** 3.2, 3.3, 3.5, 3.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Minimal client template demonstrating configuration-only approach. Zero business logic — pure composition shell.

**Structure:**

```
clients/starter-template/
├── app/
│   ├── layout.tsx          # Root layout with providers + ThemeInjector
│   ├── page.tsx            # Uses HomePageTemplate
│   ├── about/page.tsx      # Uses AboutPageTemplate
│   ├── services/page.tsx   # Uses ServicesPageTemplate
│   ├── contact/page.tsx    # Uses ContactPageTemplate
│   ├── blog/page.tsx       # Uses BlogIndexTemplate
│   ├── blog/[slug]/page.tsx
│   ├── book/page.tsx       # Uses BookingPageTemplate
│   └── api/[...routes]
├── site.config.ts          # Client configuration ONLY
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

**Page pattern (thin wrapper):**

```typescript
import { HomePageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';
export default function HomePage() {
  return <HomePageTemplate config={siteConfig} />;
}
```

**Steps:**

1. Create starter directory with page shells
2. Implement `turbo gen new-client` generator (TOOL-1):
   ```
   turbo/generators/config.ts
   ```
3. Add `pnpm validate-client <path>` script (config schema check, route existence, metadata check, build smoke)
4. Include `.env.production.local.example` for deploy docs (INT-10)
5. Verify boot, lint, type-check, build pass out of the box
6. Add starter README with setup, deploy, customization quickstart

**Acceptance Criteria:**

- Starter boots and passes lint/type-check/build/test
- New client can launch with config/content changes only
- `turbo gen new-client` produces working client scaffold

**Files:**

- Create: `clients/starter-template/` (full structure above)
- Create: `turbo/generators/config.ts`
- Create: `scripts/validate-client.ts`

---

#### 5.2 Create Salon Client Example

**Priority:** MEDIUM | **Effort:** 4 hrs | **Dependencies:** 5.1, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Example client `clients/luxe-salon/` with hair-salon industry config. Demonstrates at least one non-default variation per core feature.

**Features:** Booking, Services, Team, Gallery
**Industry:** salon

---

#### 5.3 Create Restaurant Client Example

**Priority:** MEDIUM | **Effort:** 4 hrs | **Dependencies:** 5.1, 1.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Example client `clients/bistro-central/` with restaurant industry config. Demonstrates menu, reservations, location, events.

**Features:** Menu, Reservations, Location, Events
**Industry:** restaurant

---

#### 5.7 Create Migration Validation Matrix

**Priority:** HIGH | **Effort:** 3 hrs | **Dependencies:** 5.1-5.3, 3.2-3.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Page-by-page validation matrix for each client migration: route coverage, SEO metadata, analytics hooks, accessibility, conversion flow behavior.

**Validation dimensions:**

- Routes and navigation correctness
- Schema.org and SEO metadata correctness
- Form submissions and conversion events
- Mobile/desktop rendering checks
- Error states and empty states

**Files:**

- Create: `docs/migration/client-validation-matrix.md`
- Create: `docs/migration/checklists/client-go-live-checklist.md`

---

#### 6.10 Execute Final Cutover and Rollback Runbook

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** 6.3, 6.9, 5.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Define and execute final cutover from template-based to package/client architecture with tested rollback path. Lightweight launch version for Wave 3.

**Runbook must include:**

- Pre-cutover checklist and freeze window
- Backup/tagging strategy before destructive changes
- Post-cutover smoke tests and sign-off criteria
- Rollback triggers and step-by-step recovery commands
- Incident comms protocol for failed cutover

**Files:**

- Create: `docs/migration/cutover-runbook.md`
- Create: `docs/migration/rollback-plan.md`

---

# NEXT — Expand Market Readiness (After First 2 Live Clients)

---

## UI Primitives Completion

#### 1.1 Create Dialog Component

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Modal dialog for forms, confirmations, lightboxes. The overlay for "Book Now" / "Contact Us" actions.

**Technical Requirements:**

- Accessibility: Focus trapping, ARIA attributes, keyboard nav (Escape to close)
- Variants: Alert, Confirm, Custom content
- Animation: Enter/exit transitions
- Controlled/uncontrolled API (`open`, `defaultOpen`, `onOpenChange`)
- Scroll lock and portal layering strategy (avoid z-index conflicts)
- Dependencies: `@radix-ui/react-dialog`, `lucide-react`, existing Button

**Decision needed:** Use individual `@radix-ui/react-*` packages or unified `radix-ui` package (smaller dep tree, newer). Document choice in ADR.

**Code Pattern:** Follow existing Button.tsx structure with `cva` variants.

**Files:**

- Create: `packages/ui/src/components/Dialog.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.2 Create Toast Component

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Non-blocking notification banners that auto-disappear.

**Technical Requirements:**

- Auto-dismiss with pause on hover
- Stacking (multiple toasts)
- Variants: success, error, warning, info
- Positioning: top-right, top-center, bottom-right
- ARIA live regions, dedupe key support
- Dependencies: `sonner` (already in template)

**Files:**

- Create: `packages/ui/src/components/Toast.tsx`
- Create: `packages/ui/src/components/Toaster.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.3 Create Tabs Component

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Content organization with clickable tab headers. ARIA tablist pattern with roving focus.

**Technical Requirements:**

- Horizontal and vertical variants
- Controlled and uncontrolled modes
- `activationMode` (automatic/manual)
- Smooth content transitions respecting `prefers-reduced-motion`
- Dependencies: `@radix-ui/react-tabs`

**Files:**

- Create: `packages/ui/src/components/Tabs.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.4 Create Dropdown Menu Component

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Clickable button revealing action list. Full keyboard semantics and nested menu support.

**Technical Requirements:**

- Keyboard navigation (arrow keys, Enter, Escape)
- Nested submenus, separators, checkbox/radio items
- Alignment and collision handling
- Dependencies: `@radix-ui/react-dropdown-menu`

**Files:**

- Create: `packages/ui/src/components/DropdownMenu.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.5 Create Tooltip Component

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Small popup on hover/focus showing help text.

**Technical Requirements:**

- Hover and focus triggers
- Positioning: top, bottom, left, right
- Global provider for delay defaults
- Dependencies: `@radix-ui/react-tooltip`

**Files:**

- Create: `packages/ui/src/components/Tooltip.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.6 Create Popover Component

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Rich interactive overlay (more complex than tooltip). Click-outside dismissal, focus management.

**Technical Requirements:**

- Click-outside dismissal
- Focus management
- Anchored positioning with collision padding
- Dependencies: `@radix-ui/react-popover`

**Files:**

- Create: `packages/ui/src/components/Popover.tsx`
- Update: `packages/ui/src/index.ts`

---

## Marketing Components Package + Components

#### 1.7 Create Marketing Components Package

**Priority:** CRITICAL | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Set up `packages/marketing-components/` with package scaffold.

**Structure:**

```
packages/marketing-components/
├── src/
│   ├── hero/, services/, team/, testimonials/, pricing/
│   ├── stats/, cta/, faq/, gallery/, contact/
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Dependency boundaries:** May consume `@repo/ui`, `@repo/types`, `@repo/utils`. No deep imports.

---

#### 2.1 Build HeroVariants Components | **Effort:** 6 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

4 variants: HeroCentered, HeroSplit, HeroVideo, HeroCarousel. Shared `HeroProps` interface. Prioritize fast LCP.

**Files:** `packages/marketing-components/src/hero/`

---

#### 2.2 Build ServiceShowcase Components | **Effort:** 6 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

4 layouts: ServiceGrid, ServiceList, ServiceTabs (uses 1.3), ServiceAccordion. Single normalized data shape.

**Files:** `packages/marketing-components/src/services/`

---

#### 2.3 Build TeamDisplay Components | **Effort:** 5 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 layouts: TeamGrid, TeamCarousel, TeamDetailed. Profile data model supports cross-industry staffing.

**Files:** `packages/marketing-components/src/team/`

---

#### 2.4 Build Testimonial Components | **Effort:** 5 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: TestimonialCarousel, TestimonialGrid, TestimonialMarquee. Motion respects `prefers-reduced-motion`.

**Files:** `packages/marketing-components/src/testimonials/`

---

#### 2.5 Build Pricing Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.3

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: PricingTable, PricingCards, PricingCalculator. Supports one-time, recurring, and "contact us" tiers.

**Files:** `packages/marketing-components/src/pricing/`

---

#### 2.6 Build Gallery Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.1

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: ImageGrid, ImageCarousel, LightboxGallery. Progressive image quality, lightbox keyboard controls.

**Files:** `packages/marketing-components/src/gallery/`

---

#### 2.7 Build Stats Counter Component | **Effort:** 3 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Animated number counting on scroll. SSR-safe, reduced-motion fallback.

**Files:** `packages/marketing-components/src/stats/`

---

#### 2.8 Build CTA Section Components | **Effort:** 3 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

2 variants: CTABanner (full-width), CTASplit (image + text). Primary + secondary action with analytics hooks.

**Files:** `packages/marketing-components/src/cta/`

---

#### 2.9 Build FAQ Section Component | **Effort:** 4 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Accordion-style Q&A with optional search/filter. Schema.org FAQPage output mapping.

**Files:** `packages/marketing-components/src/faq/`

---

#### 2.10 Build Contact Form Variants | **Effort:** 4 hrs | **Dependencies:** 1.7

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: SimpleContactForm, MultiStepContactForm, BookingContactForm. Normalized submission contract, configurable consent.

**Files:** `packages/marketing-components/src/contact/`

---

## Feature Breadth (New Features)

#### 2.16 Create Testimonials Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.4

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Build from scratch. Data sources: config, CMS, or API (Google Reviews, Yelp). Source adapters normalize external payloads.

**Files:** `packages/features/src/testimonials/`

---

#### 2.17 Create Team Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.3

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Member profiles with social links, configurable layouts. Reusable profile card schema.

**Files:** `packages/features/src/team/`

---

#### 2.18 Create Gallery Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.6

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Image optimization, lightbox integration using Dialog. Transform preset profiles by use case.

**Files:** `packages/features/src/gallery/`

---

#### 2.19 Create Pricing Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.5

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Data-driven pricing tables, cards, calculators. Currency/locale formatting strategy centralized.

**Files:** `packages/features/src/pricing/`

---

## Template Breadth

#### 3.4 Build AboutPageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.3, 2.17

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Configurable sections: Story, Team, Mission, Values, Timeline. Trust modules (certs, awards, press).

---

#### 3.6 Build BlogIndexTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.14

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Blog listing with filters, categories, tags, SEO-friendly pagination.

---

#### 3.7 Build BlogPostTemplate | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.14

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Individual post layout with metadata, related posts, inline CTA slots, structured data hooks.

---

## Integrations Expansion

#### 4.1 Email Marketing Integrations | **Effort:** 6 hrs | **Deps:** None

**Status:** [ ] TODO | Mailchimp, SendGrid, ConvertKit. Provider adapter contracts with retry/timeout behavior.

#### 4.2 Scheduling Integrations | **Effort:** 6 hrs | **Deps:** None

**Status:** [ ] TODO | Calendly, Acuity, Cal.com. Abstracted behind one scheduling interface. Consent-based lazy loading.

#### 4.3 Chat Support Integrations | **Effort:** 5 hrs | **Deps:** None

**Status:** [ ] TODO | Intercom, Crisp, Tidio. Lazy loading, consent-gated, provider-neutral API.

#### 4.4 Review Platform Integrations | **Effort:** 5 hrs | **Deps:** None

**Status:** [ ] TODO | Google Reviews, Yelp, Trustpilot. Normalized schema with source/moderation flags.

#### 4.5 Maps Integration | **Effort:** 3 hrs | **Deps:** None

**Status:** [ ] TODO | Google Maps embed. Progressive enhancement, static-map preview for LCP.

#### 4.6 Industry Schemas Package | **Effort:** 6 hrs | **Deps:** None

**Status:** [ ] TODO | JSON-LD structured data generators for SEO. Typed, snapshot-tested, per-industry.

---

## More Client Examples

#### 5.4 Law Firm Client Example | **Effort:** 4 hrs | **Deps:** 5.1

**Status:** [ ] TODO | `clients/chen-law/`. Practice Areas, Attorneys, Case Results. Legal disclaimers.

#### 5.5 Medical Client Example | **Effort:** 4 hrs | **Deps:** 5.1

**Status:** [ ] TODO | `clients/sunrise-dental/`. Services, Doctors, Insurance, Booking.

#### 5.6 Retail Client Example | **Effort:** 4 hrs | **Deps:** 5.1

**Status:** [ ] TODO | `clients/urban-outfitters/`. Products, Locations, Lookbook.

---

# LATER — Scale, Harden, and Differentiate

---

## Cleanup & Documentation (Priority 6)

#### 6.1 Migrate Template Content | **Effort:** 4 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Move reusable hair-salon components to `@repo/marketing-components`. Define reusability rubric.

#### 6.2 Create Migration Guide | **Effort:** 3 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Document template-to-client migration: steps, breaking changes, common pitfalls. File: `docs/migration/template-to-client.md`

#### 6.3 Remove Templates Directory | **Effort:** 2 hrs | **Deps:** 6.1, 5.2-5.6

**Status:** [ ] TODO | Delete `templates/` after all clients migrated. Require migration matrix sign-off + final grep for template references.

#### 6.4 Create Component Library Documentation | **Effort:** 6 hrs | **Deps:** 1.1-1.6, 2.1-2.10

**Status:** [ ] TODO | Storybook or Markdown docs. Per-component: usage, props, accessibility, live demos, dos/don'ts.

#### 6.5 Create Configuration Reference | **Effort:** 4 hrs | **Deps:** 1.8

**Status:** [ ] TODO | Complete `site.config.ts` docs. All fields: type, default, required, examples. File: `docs/configuration/`

#### 6.6 Create Feature Documentation | **Effort:** 4 hrs | **Deps:** 2.12-2.19

**Status:** [ ] TODO | Per-feature: usage guide, config options, integration guides, API reference. State diagrams for workflows. File: `docs/features/`

#### 6.7 Create Architecture Decision Records | **Effort:** 3 hrs | **Deps:** All above

**Status:** [ ] TODO | ADRs: feature-based architecture, Radix UI, pnpm catalog, industry-agnostic design. File: `docs/adr/`

#### 6.8 Create CLI Tooling | **Effort:** 8 hrs | **Deps:** 6.3

**Status:** [ ] TODO | `pnpm create-client`, `pnpm validate-config`, `pnpm generate-component`. Scaffold tools that encode architecture standards.

#### 6.9 Remove Dead Code and Unused Dependencies | **Effort:** 3 hrs | **Deps:** 6.1, 6.3

**Status:** [ ] TODO | Post-migration hygiene. Use knip/depcheck. Validate no runtime deps accidentally removed.

---

## Cross-Cutting Governance (C.1-C.18)

#### C.1 Enforce Circular Dependency and Layering Checks | **Effort:** 2 hrs | **Deps:** 0.11

**Status:** [ ] TODO | Graph validation to block circular deps and invalid upward imports. Script: `scripts/architecture/check-dependency-graph.ts`

#### C.2 Harden pnpm Policy and Workspace Determinism | **Effort:** 2 hrs | **Deps:** 0.1, 0.2

**Status:** [ ] TODO | Align package-management policy. Document linker, peer, and workspace rules. CI validation.

#### C.3 Enable Turborepo Remote Cache | **Effort:** 2 hrs | **Deps:** 0.3, 0.13

**Status:** [ ] TODO | Remote caching for CI + local. Cache hit-rate tracking. Fallback behavior.

#### C.4 Add Multi-Track Release Strategy (Canary + Stable) | **Effort:** 3 hrs | **Deps:** 0.12

**Status:** [ ] TODO | Pre-release channels. Canary TTL, promotion checklist.

#### C.5 Implement Three-Layer Design Token Architecture | **Effort:** 6 hrs | **Deps:** 1.8

**Status:** [ ] TODO | Option/decision/component token layers. CSS files in `packages/config/tokens/`. W3C DTCG alignment. Builds on 0.14 (ThemeInjector).

#### C.6 Add Motion Primitives and Creative Interaction Standards | **Effort:** 4 hrs | **Deps:** 1.1-1.6, C.5

**Status:** [ ] TODO | Reusable entrance/emphasis/page-transition primitives. Motion budget guideline per page. `prefers-reduced-motion` alternatives.

#### C.7 Make Storybook + Visual Regression Testing Mandatory | **Effort:** 5 hrs | **Deps:** 6.4

**Status:** [ ] TODO | Component showroom + visual regression CI checks. Baseline snapshots for key components.

#### C.8 Build Experimentation Platform (A/B + Feature Flags) | **Effort:** 6 hrs | **Deps:** 1.8, 3.2, 5.1

**Status:** [ ] TODO | Deterministic assignment, variant selection, outcome instrumentation, kill-switch.

#### C.9 Add Personalization Rules Engine | **Effort:** 6 hrs | **Deps:** C.8

**Status:** [ ] TODO | Privacy-safe personalization (geo, returning visitor, campaign source). Rules-first, consent-aware.

#### C.10 Build CMS Abstraction Layer (MDX + Sanity + Storyblok) | **Effort:** 8 hrs | **Deps:** 2.14, 3.6, 3.7

**Status:** [ ] TODO | Adapter pattern for content sources. Contract tests per adapter. Fallback priority.

#### C.11 Implement Localization and RTL Foundation | **Effort:** 5 hrs | **Deps:** 5.1, 3.2-3.8

**Status:** [ ] TODO | i18n routing, locale dictionaries, RTL compatibility. Pseudo-locale testing.

#### C.12 Standardize Conversion Event Taxonomy | **Effort:** 4 hrs | **Deps:** 4.1-4.5, C.8

**Status:** [ ] TODO | Single analytics event contract (naming, payload, PII policy). Automated drift tests.

#### C.13 Add Continuous Security Program (SAST + Deps + SSRF/XSS) | **Effort:** 5 hrs | **Deps:** 0.9, 0.10

**Status:** [ ] TODO | Continuous scanning, OWASP Top 10 regression tests, triage SLAs.

#### C.14 Add Performance and Reliability SLO Framework | **Effort:** 4 hrs | **Deps:** 0.6, 0.13

**Status:** [ ] TODO | SLOs with CI gates, alert thresholds, per-client reporting.

#### C.15 Adopt Spec-Driven Development Workflow | **Effort:** 3 hrs | **Deps:** 6.7

**Status:** [ ] TODO | Feature specs before implementation. Templates in `.kiro/specs/`.

#### C.16 Add AI-Assisted Delivery Playbooks | **Effort:** 3 hrs | **Deps:** C.15

**Status:** [ ] TODO | Repeatable AI workflows for implementation, test generation, review.

#### C.17 Add Industry Compliance Feature Pack Framework | **Effort:** 4 hrs | **Deps:** 1.9, 4.6

**Status:** [ ] TODO | Medical privacy, legal disclaimers, secure upload. Composable, jurisdiction-aware packs.

#### C.18 Add Edge Personalization and Experiment Routing | **Effort:** 4 hrs | **Deps:** C.8, C.9

**Status:** [ ] TODO | Edge middleware for variant selection. Deterministic hashing, cache-aware keys.

---

## Advanced Recommendations (D.1-D.8)

#### D.1 Create Schema Governance Program | **Effort:** 4 hrs | **Deps:** C.12

**Status:** [ ] TODO | Schema versioning, compatibility classes, deprecation policy. Validation tooling.

#### D.2 Add Experimentation Statistics and Guardrails | **Effort:** 5 hrs | **Deps:** C.8

**Status:** [ ] TODO | SRM checks, minimum run windows, guardrail metrics. Standard report format.

#### D.3 Create Editorial Workflow and Preview Governance | **Effort:** 4 hrs | **Deps:** C.10

**Status:** [ ] TODO | Content lifecycle states, secure preview access, emergency rollback.

#### D.4 Create Tenant Operations and Capacity Playbook | **Effort:** 4 hrs | **Deps:** 5.1, C.17

**Status:** [ ] TODO | Onboarding/offboarding runbooks, quotas, capacity planning.

#### D.5 Establish Incident Management and Error Budget Policy | **Effort:** 4 hrs | **Deps:** C.14

**Status:** [ ] TODO | Severity matrix, postmortem template, error budget release gating.

#### D.6 Add Continuous Accessibility Gates and Rubrics | **Effort:** 4 hrs | **Deps:** 0.7, 6.4

**Status:** [ ] TODO | PR and release a11y gates, automated checks in CI, component rubric.

#### D.7 Add Ownership and Escalation Matrix | **Effort:** 2 hrs | **Deps:** None

**Status:** [ ] TODO | DRIs and escalation paths by package and domain.

#### D.8 Add Software Supply Chain Security Program | **Effort:** 4 hrs | **Deps:** C.13

**Status:** [ ] TODO | SBOM, provenance/attestations, dependency integrity in CI.

---

## Innovation Programs (E.1-E.7, F.1-F.12)

### Round 1 — Adjacency-Derived Innovation

#### E.1 Implement Perceived Performance Standards Pack | **Effort:** 4 hrs | **Deps:** 0.6, C.14

**Status:** [ ] TODO | Latency-band response patterns. Loading feedback components.

#### E.2 Create Conversion Service Blueprints | **Effort:** 4 hrs | **Deps:** 2.12, 2.13, 2.20

**Status:** [ ] TODO | Frontstage/backstage maps for booking, contact, quote, search flows.

#### E.3 Add Error-Budget Release Gate | **Effort:** 4 hrs | **Deps:** C.14, D.5

**Status:** [ ] TODO | Gate release velocity on SLO/error-budget burn. Freeze criteria.

#### E.4 Build Internal Platform Golden Paths | **Effort:** 5 hrs | **Deps:** 6.8, D.7

**Status:** [ ] TODO | Productized developer workflows with DevEx metrics.

#### E.5 Add PR/FAQ + JTBD Intake for Major Features | **Effort:** 3 hrs | **Deps:** C.15

**Status:** [ ] TODO | Customer-outcome framing before implementation.

#### E.6 Create Progressive Conversion UX Primitives | **Effort:** 4 hrs | **Deps:** C.6, 2.10, 3.5

**Status:** [ ] TODO | Step confidence, progress pacing, decision support components.

#### E.7 Add Queueing and Async Pipeline Governance | **Effort:** 4 hrs | **Deps:** E.2

**Status:** [ ] TODO | Queue fairness rules, timeout/retry policies, observability.

### Round 2 — Non-Direct-Domain Innovation

#### F.1 Create High-Reliability Preflight Checklist Program | **Effort:** 3 hrs | **Deps:** 0.13, C.13

**Status:** [ ] TODO | HRO-style preflights + near-miss capture for high-risk changes.

#### F.2 Apply Cynefin-Based Execution Modes | **Effort:** 3 hrs | **Deps:** D.7

**Status:** [ ] TODO | Classify backlog by domain (clear/complicated/complex/chaotic).

#### F.3 Add Leverage-Point Scoring for Prioritization | **Effort:** 3 hrs | **Deps:** C.1, C.12

**Status:** [ ] TODO | System leverage scoring for durable interventions over local optimizations.

#### F.4 Add Peak-End Journey Optimization Track | **Effort:** 4 hrs | **Deps:** E.6, C.12

**Status:** [ ] TODO | Instrument high-emotion peaks and completion endings.

#### F.5 Create Framing Experiment Library | **Effort:** 4 hrs | **Deps:** C.8, D.2

**Status:** [ ] TODO | Reusable, ethically bounded framing variants for offers/CTAs.

#### F.6 Add Participatory Personalization Patterns | **Effort:** 4 hrs | **Deps:** C.9

**Status:** [ ] TODO | Low-friction co-creation moments (IKEA effect).

#### F.7 Create Wayfinding and Information Hierarchy Standards | **Effort:** 3 hrs | **Deps:** 3.2, 3.3, 3.5

**Status:** [ ] TODO | Urban wayfinding principles applied to route architecture and navigation.

#### F.8 Add Statistical Process Control for Delivery Quality | **Effort:** 5 hrs | **Deps:** C.14

**Status:** [ ] TODO | Control-chart monitoring for build variance, flake rate, regressions.

#### F.9 Add Mission-Command Governance for Parallel Execution | **Effort:** 3 hrs | **Deps:** D.7, C.16

**Status:** [ ] TODO | Centralized intent + decentralized execution model.

#### F.10 Add Portfolio Kanban WIP Policy | **Effort:** 3 hrs | **Deps:** C.1, D.7

**Status:** [ ] TODO | WIP limits and classes of service across refactor lanes.

#### F.11 Add Knowledge-Conversion System | **Effort:** 3 hrs | **Deps:** 6.4, 6.6, 6.7

**Status:** [ ] TODO | Tacit-to-explicit knowledge conversion (patterns, playbooks, ADRs).

#### F.12 Add Service Recovery and Failure-Response UX Standard | **Effort:** 4 hrs | **Deps:** E.1, F.1

**Status:** [ ] TODO | Trust recovery after failed interactions. Message templates by severity.

---

## Future AOS Layers (Phase 7+)

### Phase 7: AI & Intelligence Layer (Weeks 13-16)

#### 7.1 AI Content Engine | **Effort:** 12 hrs | **Deps:** 1.8

**Status:** [ ] TODO | Generative AI for content creation/optimization. SEO descriptions, image generation, A/B variants. Uses OpenAI API, Vercel AI SDK.

#### 7.2 LLM Gateway | **Effort:** 8 hrs | **Deps:** None

**Status:** [ ] TODO | Unified multi-provider interface (OpenAI, Anthropic, Google). Automatic fallback, token tracking.

#### 7.3 Agent Orchestration (MVP) | **Effort:** 16 hrs | **Deps:** 7.2

**Status:** [ ] TODO | Simple trigger-based agents. Content SEO optimization on draft, structured data on publish.

### Phase 8: Content & Asset Layer (Weeks 17-20)

#### 8.1 Visual Page Builder | **Effort:** 20 hrs | **Deps:** 3.2

**Status:** [ ] TODO | Storyblok-like visual editor. Drag-drop, real-time preview, save/restore layouts.

#### 8.2 Digital Asset Management (DAM) | **Effort:** 12 hrs | **Deps:** None

**Status:** [ ] TODO | Asset management with AI tagging, format conversion (WebP, AVIF), rights tracking.

### Phase 9: Marketing Operations (Weeks 21-24)

#### 9.1 Campaign Orchestration (MVP) | **Effort:** 24 hrs | **Deps:** 1.8, 7.3

**Status:** [ ] TODO | Campaign workflow automation. Task dependencies, approval chains, resource allocation.

### Phase 10: Infrastructure & Multi-Tenancy (Weeks 25-28)

#### 10.1 Advanced Multi-Tenancy | **Effort:** 16 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Full SaaS multi-tenant isolation. Automated provisioning, per-tenant feature flags, custom domain SSL.

---

# Reference Material

---

## Code Patterns & Templates

### Metaheader Template (Use for EVERY new file)

```typescript
// File: [FILE_PATH]  [TRACE:FILE=[DOT_NOTATION_PATH]]
// Purpose: [One sentence describing what this file does]
//
// Exports / Entry: [What this file exports]
// Used by: [What uses this file]
//
// Invariants:
// - [Rule 1]
// - [Rule 2]
//
// Status: @public or @internal
// Features:
// - [FEAT:CATEGORY] Description
```

### Component Pattern Template

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as RadixComponent from '@radix-ui/react-[component]';
import { cn } from '@repo/utils';
import { forwardRef } from 'react';

const [component]Variants = cva("base-classes", {
  variants: {
    variant: { default: "variant-classes" },
    size: { default: "size-classes" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface [Component]Props
  extends React.ComponentPropsWithoutRef<typeof RadixComponent.Root>,
    VariantProps<typeof [component]Variants> {}

export const [Component] = forwardRef<
  React.ElementRef<typeof RadixComponent.Root>,
  [Component]Props
>(({ className, variant, size, ...props }, ref) => (
  <RadixComponent.Root
    ref={ref}
    className={cn([component]Variants({ variant, size }), className)}
    {...props}
  />
));
[Component].displayName = "[Component]";
```

### Package.json Template

```json
{
  "name": "@repo/[package-name]",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/utils": "workspace:*",
    "@repo/config": "workspace:*"
  },
  "peerDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "catalog:"
  }
}
```

### Feature Package Structure

```typescript
// packages/features/src/[feature]/index.ts
export { [Feature]Form } from './components/[Feature]Form';
export { [feature]Schema, type [Feature]Data } from './lib/schema';
export { submit[Feature] } from './lib/actions';
export { [FEATURE]_PROVIDERS } from './lib/providers';
```

---

## File Reference Guide

| Task                   | Must Read Files                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **UI Components**      | `packages/ui/src/components/Button.tsx`, `Input.tsx`, `Accordion.tsx`                                        |
| **Configuration**      | `packages/types/src/site-config.ts` (post-0.8), `templates/hair-salon/site.config.ts`, `pnpm-workspace.yaml` |
| **Feature Extraction** | `templates/hair-salon/features/booking/` (most complete: schema+actions+providers+test)                      |
| **Search Feature**     | `features/search/components/` (SearchDialog, SearchPage), `lib/search.ts` (in template root)                 |
| **Services Feature**   | `features/services/components/` (ServicesOverview + ServiceDetailLayout)                                     |
| **Metaheaders**        | Any file in `packages/ui/src/components/`                                                                    |
| **Package Setup**      | `packages/ui/package.json`, `packages/infra/package.json`                                                    |
| **Testing**            | `packages/infra/__tests__/` (9 files), `templates/hair-salon/lib/__tests__/` (2 files)                       |
| **Env Validation**     | `packages/infra/env/schemas/` (7 Zod schemas)                                                                |
| **Security**           | `packages/infra/security/csp.ts` (nonce generation)                                                          |
| **Shared Types**       | `packages/types/src/site-config.ts` (SiteConfig, ConversionFlowConfig)                                       |

### Radix UI Primitives

> shadcn/ui now uses the unified `radix-ui` package. Consider for fewer deps/simpler imports. Decision should be documented in ADR.

| Component | Individual Package              | Unified    | Used For        |
| --------- | ------------------------------- | ---------- | --------------- |
| Dialog    | `@radix-ui/react-dialog`        | `radix-ui` | Modal, Lightbox |
| Toast     | `sonner` (already installed)    | —          | Notifications   |
| Tabs      | `@radix-ui/react-tabs`          | `radix-ui` | Tabbed content  |
| Dropdown  | `@radix-ui/react-dropdown-menu` | `radix-ui` | Menus           |
| Tooltip   | `@radix-ui/react-tooltip`       | `radix-ui` | Help text       |
| Popover   | `@radix-ui/react-popover`       | `radix-ui` | Rich overlays   |

### Existing Dependencies (Already in Template)

- `react-hook-form` + `@hookform/resolvers` (3.9.1) — Forms with Zod
- `zod` (3.22.4) — Validation schemas
- `sonner` (^2.0.7) — Toast notifications
- `lucide-react` (0.344.0) — Icons
- `clsx` (2.1.1) + `tailwind-merge` (2.6.1) — Class merging (in @repo/utils)
- `@upstash/ratelimit` (2.0.5) + `@upstash/redis` (1.34.3) — Rate limiting
- `next-mdx-remote` (5.0.0) — MDX rendering
- `gray-matter` (4.0.3) — Frontmatter parsing
- `date-fns` (^4.1.0) — Date formatting
- `reading-time` (1.5.0) — Blog read time
- `rehype-pretty-code` (0.14.1) + `rehype-slug` (6.0.0) + `remark-gfm` (4.0.0) — MDX plugins
- `@sentry/nextjs` (10.38.0) — Error tracking

---

## Success Criteria

### Phase Gates

**After Wave 0 (Day 2):**

- [ ] No config file conflicts (.npmrc/.pnpmrc reconciled)
- [ ] Workspace globs synced
- [ ] Turborepo upgraded to latest stable
- [ ] All known bugs fixed (0.14-0.32)
- [ ] Tooling installed (knip, syncpack, export validation)
- [ ] CI quality gates enforced
- [ ] `pnpm install && pnpm turbo lint type-check build test` green

**After Wave 1 (Day 6):**

- [ ] @repo/types with enhanced SiteConfig + 12 industry configs
- [ ] Core features extracted (booking, contact, services, search)
- [ ] Testing strategy established with parity suite
- [ ] Feature packages build and type-check independently

**After Wave 2 (Day 9):**

- [ ] Minimum page template set (Home, Services, Contact, Booking)
- [ ] Config-driven section composition working
- [ ] Templates pass a11y and performance smoke checks

**After Wave 3 (Day 12):**

- [ ] Client starter template bootable via `turbo gen new-client`
- [ ] 2 example clients validated end-to-end
- [ ] Migration validation matrix complete
- [ ] Cutover/rollback runbook documented

### Definition of Done (End of Week 12)

- [ ] **No templates directory exists**
- [ ] **At least 5 example clients** demonstrating different industries
- [ ] **All features extracted** to `packages/features/` (9 features)
- [ ] **Component library has 20+ components** (14 UI + 10 marketing + variants)
- [ ] **Configuration-driven** — new client requires only `site.config.ts`
- [ ] **Documentation complete** — onboard new developer in < 30 minutes
- [ ] **All tests passing** — `pnpm build && pnpm test` green
- [ ] **No performance regression** — CWV scores equal or better than baseline

### Quality Gates

- [ ] **Accessibility:** WCAG 2.2 AA (automated + manual)
- [ ] **Performance:** LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **Security:** CSP with nonce, security headers, privacy compliance
- [ ] **Type Safety:** TypeScript strict mode, no `any` types, all exports typed
- [ ] **Test Coverage:** > 50% Phase 1, > 80% packages/ui + packages/features by Phase 6
- [ ] **Bundle Size:** JS < 200KB, CSS < 50KB per client page

---

## Risk Mitigation

| Risk                        | Mitigation                                                |
| --------------------------- | --------------------------------------------------------- |
| **Migration Risk**          | Keep template functional until all clients migrated       |
| **Breaking Changes**        | Semantic versioning for packages (changesets)             |
| **Scope Creep**             | Strict wave adherence, defer nice-to-haves to NEXT/LATER  |
| **Testing Gap**             | Add tests during extraction; 50% target for Phase 1       |
| **Tailwind v4 Churn**       | Evaluate in 0.4; defer if high risk, document ADR         |
| **Next.js 16 Compat**       | Evaluate in 0.5; stay on 15 LTS if stability is priority  |
| **Config Drift**            | Wave 0 fixes + syncpack + catalog codemod                 |
| **Dep Misplacement**        | Audit all package.json during extraction (0.9 pattern)    |
| **Performance Regression**  | Baseline in 0.6; measure after each wave                  |
| **Theme Not Wired**         | 0.14 (ThemeInjector) fixes the broken config→CSS pipeline |
| **Turbo Cache Correctness** | 0.29 (globalEnv) prevents incorrect cache hits            |
| **Node Version Lock**       | 0.28 relaxes engine to >=22 (LTS)                         |

---

## Scripted Execution Model

```bash
# Wave gate validation commands
pnpm program:wave0    # validates repo integrity tasks and gates
pnpm program:wave1    # runs feature extraction checks + parity tests
pnpm program:wave2    # validates template assembly and route integrity
pnpm program:wave3    # spins starter/client verification and smoke tests

# Health check (after Wave 0)
pnpm health           # runs all validation checks in one command

# Client operations
turbo gen new-client  # scaffold new client from starter template
pnpm validate-client <path>  # config schema + route + metadata + build smoke
```

---

## Quick Command Reference

```bash
pnpm install                              # Install all dependencies
pnpm --filter @repo/ui add @radix-ui/react-dialog  # Add dep to specific package
pnpm -r run build                         # Run build in all packages
pnpm --filter "...[origin/main]" run build # Build changed packages only
pnpm turbo build                          # Build with Turborepo
pnpm turbo lint type-check test build     # Full CI check locally
```

---

## Program Cadence

- **Daily:** Execute NOW lanes with WIP limit of 1 in-progress task per lane
- **Twice weekly:** Unblock review + dependency review across lanes
- **Weekly release train:** Ship from completed NOW tasks only; defer NEXT/LATER unless blocking

---

_TODO Last Updated: February 14, 2026_
_Migrated from OLDTODO.md with: 3 audit passes consolidated, all findings folded into tasks, tasks broken down for execution, wave-based priority ordering_
