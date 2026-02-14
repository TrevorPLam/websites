# Websites Platform — Implementation Plan

> **Philosophy**: Share infrastructure, not design. Every client site is unique and distinct.
> **Architecture**: Packages = the platform. Client apps = unique compositions on that platform.
> **Last updated**: 2026-02-14
> **Reference**: [Codebase Analysis Report](./docs/CODEBASE_ANALYSIS_REPORT.md) > **Archive**: [ARCHIVE.md](./ARCHIVE.md) - Completed tasks and milestones
>
> **Format**: Each task is markable `- [ ]`. Declares **Type**, **Risk**, **Paths**, **Governance**, **Depends on**, **Tests**, **Verify**, and where applicable: **Code**, **Script**, **Steps**, **Affects**, or **Boundary**.

---

## Agent Execution Protocol

**Read this section before executing ANY task.**

### Pre-Task Checklist

1. **Read `ai/AGENT_SYSTEM.md`** — constitutional rules that override all other guidance
2. **Read the task's `Governance` field** — open and read each linked `ai/` document before writing code
3. **Read the current source files** listed in `Paths` — confirm they exist and match expected state
4. **Check `Depends on`** — verify prerequisite tasks are complete (check git log or file state)
5. **Check `Requires`** — verify pre-conditions are met (packages installed, files exist, env set)

### During-Task Rules

- **Type = EDIT**: Modify only the specific code region described. Do NOT reformat, reorganize, or change surrounding code.
- **Type = CREATE**: Create the file with exact content specified. Ensure parent directories exist.
- **Type = DELETE**: Remove only the specified file/code. Update any imports referencing it.
- **Type = RUN**: Execute the command and capture output. Only proceed if exit code is 0.
- **Type = MULTI_FILE**: Execute steps in the numbered order. Verify after each step if indicated.
- **Type = MOVE**: Copy to new location first, update all imports, verify builds, then delete original.

### Post-Task Checklist

1. Run every command in `Verify` — all must exit 0
2. If `Tests` specifies creating/updating tests, write them and ensure they pass
3. If `Affects` lists files, spot-check they still compile/function
4. Check `ai/checklists/pre-pr-checklist.md` items relevant to the change type

### Task Field Reference

| Field          | Required      | Description                                                                                  |
| -------------- | ------------- | -------------------------------------------------------------------------------------------- |
| **Type**       | Yes           | `EDIT`, `CREATE`, `DELETE`, `RUN`, `MULTI_FILE`, `MOVE`                                      |
| **Risk**       | Yes           | `low` (single-line/config), `medium` (multi-file/behavioral), `high` (architecture/breaking) |
| **Paths**      | Yes           | Explicit file paths — no wildcards for <3 files                                              |
| **Governance** | Yes           | Applicable `ai/` documents to read before executing                                          |
| **Depends on** | If any        | Task IDs that must be complete first                                                         |
| **Requires**   | If any        | Pre-conditions: packages, files, env, tools                                                  |
| **Tests**      | Yes           | `none`, `verify-existing`, `create <path> covering [scenarios]`, or `update <path>`          |
| **Verify**     | Yes           | Commands to run. Multi-level: syntax (`pnpm type-check`) + behavior (specific checks)        |
| **Steps**      | If complex    | Numbered sub-operations for multi-step tasks                                                 |
| **Affects**    | If any        | Other files/tests/packages that may break                                                    |
| **Code**       | If helpful    | Before/After code blocks showing exact changes                                               |
| **Script**     | If applicable | Shell commands to execute                                                                    |
| **Boundary**   | If needed     | What NOT to change                                                                           |

---

## Sprint Governance Map

Each sprint has mandatory `ai/` documents that apply to ALL tasks within it. Agents MUST read the sprint-level governance docs in addition to per-task `Governance` refs.

| Sprint | Mandatory Governance Documents                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **0**  | `ai/AGENT_SYSTEM.md`, `ai/checklists/pre-pr-checklist.md` ✅ **COMPLETED**                                                  |
| **1**  | `ai/security/security-standards.md`, `ai/checklists/security-checklist.md`, `ai/references/nextjs-god-tier.md` §5           |
| **2**  | `ai/testing/testing-doctrine.md`, `ai/testing/test-patterns.md`, `ai/checklists/performance-checklist.md`                   |
| **3**  | `ai/patterns/integration-adapter-pattern.md`, `ai/AGENT_SYSTEM.md` §A1                                                      |
| **4**  | `ai/decisions/001-architecture-decisions.md`                                                                                |
| **5**  | `ai/references/nextjs-god-tier.md` (full document), `ai/checklists/pre-pr-checklist.md`                                     |
| **6**  | `ai/design/design-system.md`, `ai/design/design-tokens.md`, `ai/checklists/accessibility-checklist.md`                      |
| **7**  | `ai/patterns/integration-adapter-pattern.md`, `ai/testing/testing-doctrine.md`                                              |
| **8**  | `ai/checklists/performance-checklist.md`, `ai/checklists/accessibility-checklist.md`, `ai/performance/lighthouse-budget.md` |
| **9**  | `ai/AGENT_SYSTEM.md` §A (all rules), `ai/testing/test-patterns.md`                                                          |
| **10** | `ai/security/security-standards.md` §Logging, `ai/references/nextjs-god-tier.md` §6                                         |
| **11** | `ai/AGENT_SYSTEM.md` §E (documentation)                                                                                     |

---

## Sprint 1 — Security Hardening & Missing Infrastructure

**Goal**: Fix all critical security gaps. Add missing infra components.
**Estimated effort**: 1–3 days
**Depends on**: Sprint 0 ✅ **COMPLETED**
**Sprint governance**: `ai/security/security-standards.md`, `ai/checklists/security-checklist.md`, `ai/references/nextjs-god-tier.md` §5

### 1.1 Fix Booking Flow Security

- [ ] **1.1.1** Use `getValidatedClientIp` instead of raw `x-forwarded-for`

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Validation, `ai/references/nextjs-god-tier.md` §5.3
  - **Replace**:
    ```ts
    // REMOVE:
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    // ADD:
    import { getValidatedClientIp } from '@repo/infra/security/request-validation';
    const clientIp = await getValidatedClientIp(headersList, {
      environment: validatedEnv.NODE_ENV,
    });
    ```
  - **Tests**: create `templates/websites/features/booking/lib/__tests__/booking-actions.test.ts` covering: valid IP extraction, spoofed header rejection, fallback to 'unknown'
  - **Affects**: Rate limiting behavior (uses IP as identifier)
  - **Verify**: `pnpm type-check` passes; IP is validated and sanitized; no raw header access
  - **Boundary**: Only modify the IP extraction lines. Do not change rate limit logic or booking business logic.

- [ ] **1.1.2** Replace `btoa` hashing with SHA-256

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Sanitization
  - **Replace**:
    ```ts
    // REMOVE:
    hashIp: (value: string) => btoa(value).substring(0, 16),
    // ADD — remove the hashIp option entirely; the default checkRateLimit uses salted SHA-256 from @repo/infra
    ```
  - **Tests**: update `templates/websites/features/booking/lib/__tests__/booking-actions.test.ts` — verify hashed IP is not base64-decodable
  - **Verify**: Rate limiting uses cryptographic hashing; `btoa` no longer appears in booking-actions.ts

- [ ] **1.1.3** Add CSRF / origin validation to booking

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy, `ai/references/nextjs-god-tier.md` §5.4
  - **Add before booking logic**:
    ```ts
    import { getBlockedSubmissionResponse } from '@/lib/actions/helpers';
    const blocked = getBlockedSubmissionResponse(headersList, formData);
    if (blocked) return blocked;
    ```
  - **Tests**: create test covering: cross-origin request rejected, same-origin request allowed, honeypot field triggers block
  - **Verify**: Booking submission rejects cross-origin requests

- [ ] **1.1.4** Replace `console.*` with structured logger

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4, `ai/security/security-standards.md` §Logging
  - **Steps**:
    1. Add import: `import { logger } from '@repo/infra';`
    2. Replace all `console.log(...)` with `logger.info(...)` — use structured context objects
    3. Replace all `console.error(...)` with `logger.error(...)` — ensure no PII in log messages
  - **Tests**: verify-existing
  - **Verify**: `grep -r "console\." templates/*/features/booking/lib/booking-actions.ts` returns 0 results

- [ ] **1.1.5** Sanitize booking form fields before storage

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/websites/features/booking/lib/booking-schema.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-schema.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Sanitization, §XSS Prevention
  - **Action**: Call `escapeHtml()` / `sanitizeInput()` on user inputs before storing; call `sanitizeNotes()` on notes field
  - **Tests**: create test covering: HTML tags stripped from name/email/phone, script injection in notes blocked, clean input passes through unchanged
  - **Verify**: No raw HTML stored in booking data

- [ ] **1.1.7** Add auth/authorization for `getBookingDetails` (IDOR fix)

  - **Type**: EDIT
  - **Risk**: high
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Authentication, `ai/references/nextjs-god-tier.md` §9.2 (forbidden/unauthorized)
  - **Issue**: Any caller with a booking ID can retrieve details — no ownership check (L274–288)
  - **Tests**: create test covering: owner can access, non-owner gets 403, missing booking gets 404
  - **Verify**: Only the booking owner (or admin) can access details

- [ ] **1.1.8** Add CSRF to `confirmBooking` and `cancelBooking`

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy
  - **Action**: Apply same `getBlockedSubmissionResponse` pattern as submitBookingRequest (L174–270)
  - **Tests**: update booking tests — verify CSRF rejection on confirm/cancel
  - **Verify**: State-changing booking endpoints reject cross-origin requests

- [ ] **1.1.9** Configure `allowedOrigins` for edge CSRF in middleware

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/middleware.ts`, `templates/plumber/middleware.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy, `ai/patterns/middleware-pattern.md`, `ai/references/nextjs-god-tier.md` §5.2, §5.4
  - **Action**: Pass `allowedOrigins` array to `createMiddleware()` options
  - **Tests**: create `templates/websites/lib/__tests__/middleware.test.ts` covering: allowed origin passes, unknown origin rejected, missing origin header handled
  - **Verify**: Middleware rejects unknown origins

### 1.2 Activate Distributed Rate Limiting

- [ ] **1.2.1** Pass Upstash env to `checkRateLimit` call chain

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/lib/actions/submit.ts`, `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/lib/actions/submit.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/references/nextjs-god-tier.md` §5.3
  - **Issue**: `checkRateLimit` never receives env, so Upstash Redis is never used (D8)
  - **Tests**: create integration test with mocked Upstash — verify Redis path is taken when env vars present
  - **Affects**: `packages/infra/security/rate-limit.ts` (must accept env param)
  - **Verify**: When `UPSTASH_REDIS_REST_URL` is set, rate limiting uses Redis (not in-memory)

- [ ] **1.2.2** Add rate limiting to `confirmBooking`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `confirmBooking` has no rate limiting — can be called unlimited times
  - **Tests**: update booking tests — verify rapid confirm calls return rate limit error
  - **Verify**: Rapid confirm calls are throttled

- [ ] **1.2.3** Add rate limiting to `cancelBooking`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `cancelBooking` has no rate limiting — can be called unlimited times
  - **Tests**: update booking tests — verify rapid cancel calls return rate limit error
  - **Verify**: Rapid cancel calls are throttled

- [ ] **1.2.4** Add rate limiting to `getBookingDetails`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/websites/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `getBookingDetails` has no rate limiting — enumeration possible
  - **Tests**: update booking tests — verify rapid detail queries return rate limit error
  - **Verify**: Rapid detail queries are throttled

### 1.3 Create Sentry Configuration Files

- [ ] **1.3.4** Wrap `next.config.js` with `withSentryConfig`

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `templates/websites/next.config.js`
  - **Governance**: `ai/references/nextjs-god-tier.md` §5.1 (Sentry + Next.js integration)
  - **Requires**: 0.2.1 (Sentry v10+ installed), 1.3.1, 1.3.2
  - **Tests**: none
  - **Verify**: Source maps uploaded to Sentry in production builds; `pnpm build` succeeds

### 1.5 Security Micro-Hardening

- [ ] **1.5.1** Sanitize API error text before throwing — strip internal details

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/websites/features/hubspot/lib/hubspot-client.ts`, `templates/websites/features/supabase/lib/supabase-leads.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/supabase/lib/supabase-leads.ts`
  - **Governance**: `ai/security/security-standards.md` §Error Message Exposure Rules
  - **Issue**: Raw API error text propagated in thrown errors may contain internal server details (L108, L36)
  - **Fix**: Wrap error text in a generic message; log original error server-side only
  - **Tests**: create tests covering: thrown error contains generic message, original error logged via logger
  - **Verify**: Error messages surfaced to callers contain no internal API details

- [ ] **1.5.2** Guard `response.json()` with specific `SyntaxError` catch

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/websites/features/hubspot/lib/hubspot-client.ts`, `templates/websites/features/supabase/lib/supabase-leads.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/supabase/lib/supabase-leads.ts`
  - **Governance**: `ai/security/security-standards.md` §Error Message Exposure Rules
  - **Issue**: `response.json()` can throw `SyntaxError` on malformed JSON — no specific handling
  - **Fix**:
    ```ts
    let data;
    try {
      data = await response.json();
    } catch (err) {
      if (err instanceof SyntaxError) {
        logger.error('Malformed JSON response from API', { status: response.status });
        throw new Error('External service returned invalid response');
      }
      throw err;
    }
    ```
  - **Tests**: create test — mock fetch to return non-JSON body, verify SyntaxError caught and generic error thrown
  - **Verify**: Malformed JSON response returns a clear error, not an unhandled exception

---

## Phase 1 — Core Site MVP

**Current Status**: 🔄 **80% COMPLETE** - 4/5 core features implemented

### Definition of Done

- [x] **Blog System**: MDX parsing, category filtering, metadata validation ✅ **IMPLEMENTED**
- [x] **Contact Form**: Schema, validation, submission, spam protection ✅ **IMPLEMENTED**
- [x] **Search Functionality**: Full-text search across pages and content ✅ **IMPLEMENTED**
- [x] **Booking System**: Appointment scheduling, confirmation, management ✅ **IMPLEMENTED**
- [ ] **Blog Content**: Sample posts and content directory ⚠️ **MISSING**

### Missing Task

- [ ] **Blog: Content Creation and Directory Setup**

  - **Type**: CREATE
  - **Risk**: low
  - **Paths**: `templates/websites/content/blog/`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2 (content validation)
  - **Issue**: Blog system implemented but no content directory or sample posts
  - **Action**: Create `content/blog/` directory with sample MDX posts covering different categories
  - **Tests**: verify blog pages render with actual content
  - **Verify**: Blog displays sample posts correctly; category filtering works

---

## Future Sprints (Planned)

### Sprint 2 — Testing & Performance

### Sprint 3 — Integration Patterns

### Sprint 4 — Architecture Decisions

### Sprint 5 — Production Optimization

### Sprint 6 — Design System

### Sprint 7 — Advanced Testing

### Sprint 8 — Performance & Accessibility

### Sprint 9 — Final Polish

### Sprint 10 — Observability

### Sprint 11 — Documentation

---

_For completed Sprint 0 tasks and historical achievements, see [ARCHIVE.md](./ARCHIVE.md)_

---

## Agent Execution Protocol

**Read this section before executing ANY task.**

### Pre-Task Checklist

1. **Read `ai/AGENT_SYSTEM.md`** — constitutional rules that override all other guidance
2. **Read the task's `Governance` field** — open and read each linked `ai/` document before writing code
3. **Read the current source files** listed in `Paths` — confirm they exist and match expected state
4. **Check `Depends on`** — verify prerequisite tasks are complete (check git log or file state)
5. **Check `Requires`** — verify pre-conditions are met (packages installed, files exist, env set)

### During-Task Rules

- **Type = EDIT**: Modify only the specific code region described. Do NOT reformat, reorganize, or change surrounding code.
- **Type = CREATE**: Create the file with exact content specified. Ensure parent directories exist.
- **Type = DELETE**: Remove only the specified file/code. Update any imports referencing it.
- **Type = RUN**: Execute the command and capture output. Only proceed if exit code is 0.
- **Type = MULTI_FILE**: Execute steps in the numbered order. Verify after each step if indicated.
- **Type = MOVE**: Copy to new location first, update all imports, verify builds, then delete original.

### Post-Task Checklist

1. Run every command in `Verify` — all must exit 0
2. If `Tests` specifies creating/updating tests, write them and ensure they pass
3. If `Affects` lists files, spot-check they still compile/function
4. Check `ai/checklists/pre-pr-checklist.md` items relevant to the change type

### Task Field Reference

| Field          | Required      | Description                                                                                  |
| -------------- | ------------- | -------------------------------------------------------------------------------------------- |
| **Type**       | Yes           | `EDIT`, `CREATE`, `DELETE`, `RUN`, `MULTI_FILE`, `MOVE`                                      |
| **Risk**       | Yes           | `low` (single-line/config), `medium` (multi-file/behavioral), `high` (architecture/breaking) |
| **Paths**      | Yes           | Explicit file paths — no wildcards for <3 files                                              |
| **Governance** | Yes           | Applicable `ai/` documents to read before executing                                          |
| **Depends on** | If any        | Task IDs that must be complete first                                                         |
| **Requires**   | If any        | Pre-conditions: packages, files, env, tools                                                  |
| **Tests**      | Yes           | `none`, `verify-existing`, `create <path> covering [scenarios]`, or `update <path>`          |
| **Verify**     | Yes           | Commands to run. Multi-level: syntax (`pnpm type-check`) + behavior (specific checks)        |
| **Steps**      | If complex    | Numbered sub-operations for multi-step tasks                                                 |
| **Affects**    | If any        | Other files/tests/packages that may break                                                    |
| **Code**       | If helpful    | Before/After code blocks showing exact changes                                               |
| **Script**     | If applicable | Shell commands to execute                                                                    |
| **Boundary**   | If needed     | What NOT to change                                                                           |

---

## Sprint Governance Map

Each sprint has mandatory `ai/` documents that apply to ALL tasks within it. Agents MUST read the sprint-level governance docs in addition to per-task `Governance` refs.

| Sprint | Mandatory Governance Documents                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **0**  | `ai/AGENT_SYSTEM.md`, `ai/checklists/pre-pr-checklist.md`                                                                   |
| **1**  | `ai/security/security-standards.md`, `ai/checklists/security-checklist.md`, `ai/references/nextjs-god-tier.md` §5           |
| **2**  | `ai/testing/testing-doctrine.md`, `ai/testing/test-patterns.md`, `ai/checklists/performance-checklist.md`                   |
| **3**  | `ai/patterns/integration-adapter-pattern.md`, `ai/AGENT_SYSTEM.md` §A1                                                      |
| **4**  | `ai/decisions/001-architecture-decisions.md`                                                                                |
| **5**  | `ai/references/nextjs-god-tier.md` (full document), `ai/checklists/pre-pr-checklist.md`                                     |
| **6**  | `ai/design/design-system.md`, `ai/design/design-tokens.md`, `ai/checklists/accessibility-checklist.md`                      |
| **7**  | `ai/patterns/integration-adapter-pattern.md`, `ai/testing/testing-doctrine.md`                                              |
| **8**  | `ai/checklists/performance-checklist.md`, `ai/checklists/accessibility-checklist.md`, `ai/performance/lighthouse-budget.md` |
| **9**  | `ai/AGENT_SYSTEM.md` §A (all rules), `ai/testing/test-patterns.md`                                                          |
| **10** | `ai/security/security-standards.md` §Logging, `ai/references/nextjs-god-tier.md` §6                                         |
| **11** | `ai/AGENT_SYSTEM.md` §E (documentation)                                                                                     |

---

## Sprint 0 — Unblock CI & Fix Critical Issues

**Goal**: Get CI green. Fix security vulnerabilities. Fix Docker. Everything else depends on this.
**Estimated effort**: <1 day
**Depends on**: nothing
**Sprint governance**: `ai/AGENT_SYSTEM.md`, `ai/checklists/pre-pr-checklist.md`
**Can be largely scripted — run sequentially.**

### 0.1 Fix TypeScript Errors Blocking CI

- [x] **0.1.1** Fix `TS2451` and `TS7006` in hair-salon test files ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/blog/__tests__/blog.test.ts`, `templates/hair-salon/lib/__tests__/search.test.ts`, `templates/plumber/features/blog/__tests__/blog.test.ts`, `templates/plumber/lib/__tests__/search.test.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2 (input validation / type safety)
  - **Issue**: Block-scoped variable redeclaration (`path`, `templateRoot`, `originalCwd`, `getAllPosts`) and implicit `any` on callback params
  - **Fix**: Renamed conflicting variables with unique prefixes; added explicit types to all callback parameters
  - **Tests**: verify-existing — `pnpm build` passes after fixes
  - **Verify**: `pnpm run type-check` exits 0 ✅
  - **Boundary**: Only renamed conflicting variable declarations and added type annotations. Did not refactor test logic.
  - **Evidence**: TypeScript compilation passes with 0 errors; build successful for both templates

  ```ts
  // Before (blog.test.ts)
  const path = require('path');  // conflicts with @types/node global
  posts.forEach((post) => { ... });  // implicit any

  // After
  const testPath = require('path');
  posts.forEach((post: { slug: string; title: string }) => { ... });
  ```

- [x] **0.1.2** Verify plumber has same test issues and fix if present ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/plumber/features/blog/__tests__/blog.test.ts`, `templates/plumber/lib/__tests__/search.test.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Depends on**: 0.1.1 (use same fix pattern)
  - **Tests**: verify-existing
  - **Verify**: `pnpm run type-check` passes for both templates ✅
  - **Evidence**: Applied same fixes as hair-salon template; TypeScript compilation passes for both templates

### 0.2 Upgrade Sentry to Fix High-Severity Vulnerability

- [ ] **0.2.1** Upgrade `@sentry/nextjs` from 8.0.0 to latest stable (10.38.0+)

  - **Type**: RUN
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`, `packages/infra/package.json`
  - **Governance**: `ai/references/nextjs-god-tier.md` §5.1 (CVE patch matrix), `ai/security/security-standards.md`
  - **Depends on**: none
  - **Script**:
    ```bash
    pnpm --filter=@templates/hair-salon add @sentry/nextjs@latest
    pnpm --filter=@templates/plumber add @sentry/nextjs@latest
    pnpm --filter=@repo/infra add -D @sentry/nextjs@latest
    ```
  - **Then run**: `npx @sentry/migr8@latest` to auto-fix deprecated API usage
  - **Migration notes**: 8→9 removes some APIs (`BaseClient` → `Client`); 9→10 upgrades OpenTelemetry to v2
  - **Tests**: verify-existing — `pnpm test` must pass after migration
  - **Affects**: `packages/infra/sentry/*.ts`, any file importing from `@sentry/nextjs`
  - **Verify**: `pnpm audit --audit-level high` no longer fails on rollup or @sentry/browser; `pnpm build` passes

- [ ] **0.2.2** Update `@repo/infra` peer dependency range

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/package.json`
  - **Governance**: none beyond sprint-level
  - **Change**: `"@sentry/nextjs": ">=8.0.0"` → `"@sentry/nextjs": ">=10.0.0"`
  - **Tests**: none
  - **Verify**: `pnpm install` succeeds with no peer dep warnings for Sentry

### 0.3 Upgrade Next.js to Patch 4 Moderate CVEs

- [ ] **0.3.1** Upgrade `next` to 15.5.12 (latest stable v15 patch)

  - **Type**: RUN
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`
  - **Governance**: `ai/references/nextjs-god-tier.md` §Version Context (15.x = Maintenance LTS until Oct 2026; confirms CVE‑2025‑29927 patched in >=15.2.3, CVE‑2025‑66478 patched in 15.5.7+)
  - **Script**:
    ```bash
    pnpm --filter=@templates/hair-salon add next@15.5.12 eslint-config-next@15.5.12
    pnpm --filter=@templates/plumber add next@15.5.12 eslint-config-next@15.5.12
    ```
  - **Also update**: `packages/infra/package.json` peer dep to `"next": "^15.5.0"`
  - **Tests**: verify-existing — `pnpm test` and `pnpm build` must pass
  - **Affects**: All page routes (async params/searchParams behavior may change — see God Tier §1.1)
  - **Verify**: `pnpm audit` shows 0 high, 0 moderate for `next`; `pnpm build` passes both templates
  - **Note**: Next.js 16.1.x is now Latest Stable (see `ai/references/nextjs-god-tier.md`). After Sprint 0, evaluate upgrading to 16.x in Sprint 5 instead of staying on 15.x maintenance.

### 0.4 Fix Docker Build

- [x] **0.4.1** Add `output: 'standalone'` to `next.config.js` (both templates) ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/next.config.js`, `templates/plumber/next.config.js`
  - **Governance**: none beyond sprint-level
  - **Code**:
    ```js
    const nextConfig = {
      output: 'standalone', // ← ADD THIS
      transpilePackages: ['@repo/ui', '@repo/utils', '@repo/infra', '@repo/shared'],
      // ... rest unchanged
    };
    ```
  - **Also fix**: Add `@repo/infra` and `@repo/shared` to `transpilePackages` (currently missing)
  - **Tests**: none
  - **Affects**: Docker build, `.next/` output structure
  - **Verify**: `pnpm build` produces `.next/standalone/` directory
  - **Boundary**: Only add `output` and update `transpilePackages`. Do not change any other config options.

- [x] **0.4.2** Create `.dockerignore` ✅ **COMPLETED 2026-02-14**

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `.dockerignore`
  - **Governance**: none beyond sprint-level
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
  - **Tests**: none
  - **Verify**: `docker build` context is significantly smaller

- [x] **0.4.3** Pin pnpm version in Dockerfile, add non-root user, add HEALTHCHECK _(completed 2026-02-14: pinned pnpm@10.29.2 via corepack, added nodejs/nextjs non-root user, added HEALTHCHECK using /api/health endpoint)_

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `templates/hair-salon/Dockerfile`
  - **Governance**: none beyond sprint-level
  - **Steps**:
    1. Pin `pnpm` version in `corepack enable && corepack prepare pnpm@10.29.2 --activate`
    2. Add `RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs`
    3. Add `USER nextjs` before CMD
    4. Add `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000/api/health || exit 1`
  - **Tests**: none
  - **Depends on**: 1.6.1 (health endpoint must exist for HEALTHCHECK)
  - **Verify**: `docker build -f templates/hair-salon/Dockerfile .` succeeds

### 0.5 Version Alignment via pnpm Catalogs

- [x] **0.5.1** Add catalog to `pnpm-workspace.yaml` ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `pnpm-workspace.yaml`
  - **Governance**: none beyond sprint-level
  - **Code**:

    ```yaml
    packages:
      - 'packages/*'
      - 'packages/config/*'
      - 'templates/*'
      - 'clients/*'

    catalog:
      next: '15.5.12'
      react: '19.2.4'
      react-dom: '19.2.4'
      typescript: '5.9.3'
      '@sentry/nextjs': '^10.0.0'
      '@types/node': '^24.0.0'
      '@types/react': '^19.2.0'
      '@types/react-dom': '^19.2.0'
      zod: '^3.23.0'
      eslint: '^9.18.0'
    ```

  - **Then**: Update all `package.json` files to use `"catalog:"` for these deps
  - **Affects**: Every `package.json` in the monorepo
  - **Tests**: verify-existing — all existing tests must pass after version alignment
  - **Verify**: `pnpm install` succeeds; `pnpm outdated` shows consistent versions

- [ ] **0.5.2** Upgrade `@types/node` to match `engines.node >= 24`

  - **Type**: MULTI_FILE
  - **Risk**: low
  - **Paths**: All `package.json` files referencing `@types/node`
  - **Governance**: none beyond sprint-level
  - **Steps**:
    1. Change `@types/node` to `catalog:` in each `package.json` (resolves to `^24.0.0`)
    2. Run `pnpm install`
  - **Tests**: verify-existing
  - **Verify**: `pnpm run type-check` passes

### 0.6 Verify CI is Green

- [ ] **0.6.1** Run full CI pipeline locally

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/checklists/pre-pr-checklist.md`
  - **Command**: `pnpm lint; pnpm type-check; pnpm build; pnpm test; pnpm audit --audit-level high`
  - **Tests**: verify-existing
  - **Verify**: All exit 0

---

## Sprint 1 — Security Hardening & Missing Infrastructure

**Goal**: Fix all critical security gaps. Add missing infra components.
**Estimated effort**: 1–3 days
**Depends on**: Sprint 0
**Sprint governance**: `ai/security/security-standards.md`, `ai/checklists/security-checklist.md`, `ai/references/nextjs-god-tier.md` §5

### 1.1 Fix Booking Flow Security

- [ ] **1.1.1** Use `getValidatedClientIp` instead of raw `x-forwarded-for`

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Validation, `ai/references/nextjs-god-tier.md` §5.3
  - **Replace**:
    ```ts
    // REMOVE:
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    // ADD:
    import { getValidatedClientIp } from '@repo/infra/security/request-validation';
    const clientIp = await getValidatedClientIp(headersList, {
      environment: validatedEnv.NODE_ENV,
    });
    ```
  - **Tests**: create `templates/hair-salon/features/booking/lib/__tests__/booking-actions.test.ts` covering: valid IP extraction, spoofed header rejection, fallback to 'unknown'
  - **Affects**: Rate limiting behavior (uses IP as identifier)
  - **Verify**: `pnpm type-check` passes; IP is validated and sanitized; no raw header access
  - **Boundary**: Only modify the IP extraction lines. Do not change rate limit logic or booking business logic.

- [ ] **1.1.2** Replace `btoa` hashing with SHA-256

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Sanitization
  - **Replace**:
    ```ts
    // REMOVE:
    hashIp: (value: string) => btoa(value).substring(0, 16),
    // ADD — remove the hashIp option entirely; the default checkRateLimit uses salted SHA-256 from @repo/infra
    ```
  - **Tests**: update `templates/hair-salon/features/booking/lib/__tests__/booking-actions.test.ts` — verify hashed IP is not base64-decodable
  - **Verify**: Rate limiting uses cryptographic hashing; `btoa` no longer appears in booking-actions.ts

- [ ] **1.1.3** Add CSRF / origin validation to booking

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy, `ai/references/nextjs-god-tier.md` §5.4
  - **Add before booking logic**:
    ```ts
    import { getBlockedSubmissionResponse } from '@/lib/actions/helpers';
    const blocked = getBlockedSubmissionResponse(headersList, formData);
    if (blocked) return blocked;
    ```
  - **Tests**: create test covering: cross-origin request rejected, same-origin request allowed, honeypot field triggers block
  - **Verify**: Booking submission rejects cross-origin requests

- [ ] **1.1.4** Replace `console.*` with structured logger

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4, `ai/security/security-standards.md` §Logging
  - **Steps**:
    1. Add import: `import { logger } from '@repo/infra';`
    2. Replace all `console.log(...)` with `logger.info(...)` — use structured context objects
    3. Replace all `console.error(...)` with `logger.error(...)` — ensure no PII in log messages
  - **Tests**: verify-existing
  - **Verify**: `grep -r "console\." templates/*/features/booking/lib/booking-actions.ts` returns 0 results

- [ ] **1.1.5** Sanitize booking form fields before storage

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/hair-salon/features/booking/lib/booking-schema.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-schema.ts`
  - **Governance**: `ai/security/security-standards.md` §Input Sanitization, §XSS Prevention
  - **Action**: Call `escapeHtml()` / `sanitizeInput()` on user inputs before storing; call `sanitizeNotes()` on notes field
  - **Tests**: create test covering: HTML tags stripped from name/email/phone, script injection in notes blocked, clean input passes through unchanged
  - **Verify**: No raw HTML stored in booking data

- [x] **1.1.6** Make booking IDs non-guessable ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md`
  - **Issue**: Currently `booking_${Date.now()}_${random}` — sequential and predictable
  - **Fix**:
    ```ts
    // REMOVE:
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // ADD:
    const bookingId = crypto.randomUUID();
    ```
  - **Tests**: update booking tests — verify ID format is UUID v4
  - **Verify**: Booking IDs are opaque UUIDs; `grep "Date.now" booking-actions.ts` returns 0 matches in ID generation

- [ ] **1.1.7** Add auth/authorization for `getBookingDetails` (IDOR fix)

  - **Type**: EDIT
  - **Risk**: high
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Authentication, `ai/references/nextjs-god-tier.md` §9.2 (forbidden/unauthorized)
  - **Issue**: Any caller with a booking ID can retrieve details — no ownership check (L274–288)
  - **Tests**: create test covering: owner can access, non-owner gets 403, missing booking gets 404
  - **Verify**: Only the booking owner (or admin) can access details

- [ ] **1.1.8** Add CSRF to `confirmBooking` and `cancelBooking`

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy
  - **Action**: Apply same `getBlockedSubmissionResponse` pattern as submitBookingRequest (L174–270)
  - **Tests**: update booking tests — verify CSRF rejection on confirm/cancel
  - **Verify**: State-changing booking endpoints reject cross-origin requests

- [ ] **1.1.9** Configure `allowedOrigins` for edge CSRF in middleware

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/middleware.ts`, `templates/plumber/middleware.ts`
  - **Governance**: `ai/security/security-standards.md` §CSRF Policy, `ai/patterns/middleware-pattern.md`, `ai/references/nextjs-god-tier.md` §5.2, §5.4
  - **Action**: Pass `allowedOrigins` array to `createMiddleware()` options
  - **Tests**: create `templates/hair-salon/lib/__tests__/middleware.test.ts` covering: allowed origin passes, unknown origin rejected, missing origin header handled
  - **Verify**: Middleware rejects unknown origins

### 1.2 Activate Distributed Rate Limiting

- [ ] **1.2.1** Pass Upstash env to `checkRateLimit` call chain

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/lib/actions/submit.ts`, `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/lib/actions/submit.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/references/nextjs-god-tier.md` §5.3
  - **Issue**: `checkRateLimit` never receives env, so Upstash Redis is never used (D8)
  - **Tests**: create integration test with mocked Upstash — verify Redis path is taken when env vars present
  - **Affects**: `packages/infra/security/rate-limit.ts` (must accept env param)
  - **Verify**: When `UPSTASH_REDIS_REST_URL` is set, rate limiting uses Redis (not in-memory)

- [ ] **1.2.2** Add rate limiting to `confirmBooking`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `confirmBooking` has no rate limiting — can be called unlimited times
  - **Tests**: update booking tests — verify rapid confirm calls return rate limit error
  - **Verify**: Rapid confirm calls are throttled

- [ ] **1.2.3** Add rate limiting to `cancelBooking`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `cancelBooking` has no rate limiting — can be called unlimited times
  - **Tests**: update booking tests — verify rapid cancel calls return rate limit error
  - **Verify**: Rapid cancel calls are throttled

- [ ] **1.2.4** Add rate limiting to `getBookingDetails`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`
  - **Governance**: `ai/security/security-standards.md` §Rate Limiting, `ai/AGENT_SYSTEM.md` §C3
  - **Issue**: `getBookingDetails` has no rate limiting — enumeration possible
  - **Tests**: update booking tests — verify rapid detail queries return rate limit error
  - **Verify**: Rapid detail queries are throttled

### 1.3 Create Sentry Configuration Files

- [x] **1.3.1** Create `sentry.client.config.ts` for hair-salon _(completed 2026-02-14: created with PII sanitization via sanitizeSentryEvent beforeSend, env-aware tracesSampleRate, replay config)_

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `templates/hair-salon/sentry.client.config.ts`
  - **Governance**: `ai/security/security-standards.md` §Logging, `ai/references/nextjs-god-tier.md` §5.1 (ensure patched Sentry version)
  - **Requires**: 0.2.1 complete (Sentry upgraded to v10+)
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

  - **Tests**: verify-existing — `pnpm build` must pass; manually verify Sentry initializes in dev
  - **Verify**: Sentry initializes in dev; events have PII stripped

- [x] **1.3.2** Create `sentry.server.config.ts` for hair-salon _(completed 2026-02-14: created with sanitizeSentryEvent beforeSend, env-aware tracesSampleRate)_

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `templates/hair-salon/sentry.server.config.ts`
  - **Governance**: `ai/security/security-standards.md` §Logging
  - **Requires**: 0.2.1 complete
  - **Code**:

    ```ts
    import * as Sentry from '@sentry/nextjs';
    import { sanitizeSentryEvent } from '@repo/infra/sentry/sanitize';

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend: sanitizeSentryEvent,
    });
    ```

  - **Tests**: none
  - **Verify**: Server-side errors captured with PII redacted

- [x] **1.3.3** Fix Sentry DSN variable mismatch _(completed 2026-02-14: renamed SENTRY*DSN to NEXT_PUBLIC_SENTRY_DSN in env schema, validate.ts, and all JSDoc references — client-side access requires NEXT_PUBLIC* prefix)_

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/env/schemas/sentry.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4 (env access rules)
  - **Issue**: Schema uses `SENTRY_DSN` but runtime checks `NEXT_PUBLIC_SENTRY_DSN`
  - **Steps**:
    1. Read current schema to confirm mismatch
    2. Rename to `NEXT_PUBLIC_SENTRY_DSN` in schema (client-side access requires `NEXT_PUBLIC_` prefix)
    3. Update any references in `packages/infra/sentry/*.ts`
  - **Affects**: `packages/infra/sentry/client.ts`, `packages/infra/sentry/server.ts`
  - **Tests**: verify-existing — env validation tests must pass
  - **Verify**: Variable names are consistent across schema and runtime usage

- [ ] **1.3.4** Wrap `next.config.js` with `withSentryConfig`

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `templates/hair-salon/next.config.js`
  - **Governance**: `ai/references/nextjs-god-tier.md` §5.1 (Sentry + Next.js integration)
  - **Requires**: 0.2.1 (Sentry v10+ installed), 1.3.1, 1.3.2
  - **Tests**: none
  - **Verify**: Source maps uploaded to Sentry in production builds; `pnpm build` succeeds

- [x] **1.3.5** Copy Sentry config to plumber template _(completed 2026-02-14: created sentry.client.config.ts and sentry.server.config.ts for plumber with identical patterns)_

  - **Type**: CREATE
  - **Risk**: low
  - **Paths**: `templates/plumber/sentry.client.config.ts`, `templates/plumber/sentry.server.config.ts`
  - **Governance**: none beyond sprint-level
  - **Depends on**: 1.3.1, 1.3.2
  - **Steps**:
    1. Copy `templates/hair-salon/sentry.client.config.ts` → `templates/plumber/sentry.client.config.ts`
    2. Copy `templates/hair-salon/sentry.server.config.ts` → `templates/plumber/sentry.server.config.ts`
    3. Update `templates/plumber/next.config.js` with `withSentryConfig` wrapper
  - **Tests**: none
  - **Verify**: Both templates have working Sentry with PII sanitization

### 1.4 Add Error Recovery Pages

- [x] **1.4.1** Create `app/error.tsx` (route-level error boundary) ✅ **COMPLETED 2026-02-14**

  - **Type**: CREATE
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/error.tsx`, `templates/plumber/app/error.tsx`
  - **Governance**: `ai/references/nextjs-god-tier.md` §4.2 (error page pattern), §9.1 (unstable_rethrow), `ai/design/design-system.md`
  - **Code**:

    ```tsx
    'use client';

    import * as Sentry from '@sentry/nextjs';
    import { useEffect } from 'react';

    export default function Error({
      error,
      reset,
    }: {
      error: Error & { digest?: string };
      reset: () => void;
    }) {
      useEffect(() => {
        Sentry.captureException(error);
      }, [error]);

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">We&apos;re sorry for the inconvenience.</p>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      );
    }
    ```

  - **Tests**: create `templates/hair-salon/app/__tests__/error.test.tsx` — verify renders, verify reset callback fires, verify Sentry.captureException called
  - **Verify**: Rendering errors show recovery UI; Sentry captures the error

- [x] **1.4.2** Create `app/global-error.tsx` (root layout error boundary) ✅ **COMPLETED 2026-02-14**

  - **Type**: CREATE
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/global-error.tsx`, `templates/plumber/app/global-error.tsx`
  - **Governance**: `ai/references/nextjs-god-tier.md` §4.2
  - **Code**:

    ```tsx
    'use client';

    export default function GlobalError({
      error,
      reset,
    }: {
      error: Error & { digest?: string };
      reset: () => void;
    }) {
      return (
        <html>
          <body>
            <div
              style={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h2>Something went wrong</h2>
              <button onClick={reset}>Try again</button>
            </div>
          </body>
        </html>
      );
    }
    ```

  - **Tests**: none (global-error is a last-resort fallback)
  - **Verify**: Root-level errors show minimal recovery page

### 1.5 Security Micro-Hardening

- [ ] **1.5.1** Sanitize API error text before throwing — strip internal details

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/hubspot/lib/hubspot-client.ts`, `templates/hair-salon/features/supabase/lib/supabase-leads.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/supabase/lib/supabase-leads.ts`
  - **Governance**: `ai/security/security-standards.md` §Error Message Exposure Rules
  - **Issue**: Raw API error text propagated in thrown errors may contain internal server details (L108, L36)
  - **Fix**: Wrap error text in a generic message; log original error server-side only
  - **Tests**: create tests covering: thrown error contains generic message, original error logged via logger
  - **Verify**: Error messages surfaced to callers contain no internal API details

- [ ] **1.5.2** Guard `response.json()` with specific `SyntaxError` catch

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/hubspot/lib/hubspot-client.ts`, `templates/hair-salon/features/supabase/lib/supabase-leads.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/supabase/lib/supabase-leads.ts`
  - **Governance**: `ai/security/security-standards.md` §Error Message Exposure Rules
  - **Issue**: `response.json()` can throw `SyntaxError` on malformed JSON — no specific handling
  - **Fix**:
    ```ts
    let data;
    try {
      data = await response.json();
    } catch (err) {
      if (err instanceof SyntaxError) {
        logger.error('Malformed JSON response from API', { status: response.status });
        throw new Error('External service returned invalid response');
      }
      throw err;
    }
    ```
  - **Tests**: create test — mock fetch to return non-JSON body, verify SyntaxError caught and generic error thrown
  - **Verify**: Malformed JSON response returns a clear error, not an unhandled exception

- [x] **1.5.3** Ensure `X-Debug-Info: enabled` header cannot leak to production ✅ **COMPLETED 2026-02-14** (verified: gated behind `environment === 'development'`)

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/security/security-headers.ts`
  - **Governance**: `ai/security/security-standards.md` §Allowed Headers
  - **Issue**: Debug header added in development (L129–132) — verify it's stripped in production
  - **Tests**: create test — verify header absent when `NODE_ENV=production`
  - **Verify**: Production response headers do not include `X-Debug-Info`

- [x] **1.5.4** Add `poweredByHeader: false` to `next.config.js` ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/next.config.js`, `templates/plumber/next.config.js`
  - **Governance**: `ai/security/security-standards.md`
  - **Issue**: Next.js default `X-Powered-By: Next.js` header discloses tech stack
  - **Code**:
    ```js
    const nextConfig = {
      poweredByHeader: false, // ← ADD THIS
      // ... existing config
    };
    ```
  - **Tests**: none
  - **Verify**: Production response headers do not include `X-Powered-By`

- [ ] **1.5.5** Strengthen notes field regex beyond `^[^<>]*$`

  - **Type**: EDIT
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-schema.ts`, `templates/plumber/features/booking/lib/booking-schema.ts`
  - **Governance**: `ai/security/security-standards.md` §XSS Prevention, §Input Sanitization
  - **Issue**: Regex blocks `<>` but not all XSS vectors (event handlers in re-rendered contexts) (L88)
  - **Fix**: Replace regex with allowlist-based sanitization:
    ```ts
    // REMOVE:
    notes: z.string().max(500).regex(/^[^<>]*$/, 'Notes cannot contain HTML').optional(),
    // ADD:
    notes: z.string().max(500).optional().transform(val => val ? sanitizeInput(val) : val),
    ```
  - **Requires**: `sanitizeInput` imported from `@repo/infra/security/sanitize`
  - **Tests**: create test covering: script tags stripped, event handlers stripped, normal text preserved, unicode preserved
  - **Verify**: Notes field rejects script injection vectors

- [x] **1.5.6** Add MDX content rendering safety layer _(completed 2026-02-14: added SECURITY NOTE to BlogPostContent.tsx in both templates documenting rehype-sanitize requirement if content source becomes user-editable)_

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/blog/components/BlogPostContent.tsx`, `templates/plumber/features/blog/components/BlogPostContent.tsx`
  - **Governance**: `ai/security/security-standards.md` §XSS Prevention
  - **Issue**: MDX via `next-mdx-remote` is safe with static files, but if content source ever becomes user-editable, it's a risk
  - **Action**: Add a JSDoc comment documenting the security constraint; consider adding `rehype-sanitize` plugin
  - **Tests**: none
  - **Verify**: MDX pipeline has documented security boundary

- [x] **1.5.7** Add `maxDepth` parameter to `sanitizeLogContext` to prevent stack overflow ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/logger/index.ts`
  - **Governance**: `ai/security/security-standards.md`
  - **Issue**: No recursion depth limit — stack overflow risk on deeply nested objects
  - **Fix**: Add `maxDepth = 10` param; return `'[too deep]'` when exceeded
  - **Tests**: create `packages/infra/logger/__tests__/sanitize-depth.test.ts` covering: normal objects pass through, 15-level deep object truncated at depth 10, circular reference handled
  - **Verify**: Deeply nested log contexts don't crash

- [x] **1.5.8** Strip internal file paths from `error.stack` in logger output ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/logger/index.ts`
  - **Governance**: `ai/security/security-standards.md` §Error Message Exposure Rules, §Logging
  - **Issue**: Logger includes `error.stack` which may contain internal server paths (L165–179)
  - **Fix**: In production, replace absolute paths with relative or redact entirely
  - **Tests**: create test — verify stack trace redacted when `NODE_ENV=production`
  - **Verify**: Production log output doesn't reveal internal file paths

### 1.6 Add Health Check Endpoint

- [x] **1.6.1** Create `/api/health` route ✅ **COMPLETED 2026-02-14**

  - **Type**: CREATE
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/api/health/route.ts`, `templates/plumber/app/api/health/route.ts`
  - **Governance**: `ai/patterns/api-route-pattern.md`, `ai/references/nextjs-god-tier.md` §1
  - **Code**:
    ```ts
    import { NextResponse } from 'next/server';
    export async function GET() {
      return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
    ```
  - **Tests**: create `templates/hair-salon/app/api/health/__tests__/route.test.ts` — verify returns 200, verify JSON shape
  - **Verify**: `curl localhost:3100/api/health` returns `{"status":"ok"}`

### 1.7 Create `.env.example`

- [x] **1.7.1** Document all required and optional environment variables ✅ **COMPLETED 2026-02-14**

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `.env.example`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4 (env access rules)
  - **Steps**:
    1. Read all files in `packages/infra/env/schemas/*.ts` to extract variable names
    2. Categorize as required vs optional
    3. Add placeholder values with comments explaining each
  - **Source**: Aggregate from `packages/infra/env/schemas/*.ts`
  - **Tests**: none
  - **Verify**: New developer can copy `.env.example` → `.env.local` and start developing

---

## Sprint 2 — Package Quality & Boundaries

**Goal**: Fix all package boundary issues. Make the platform solid.
**Estimated effort**: 3–5 days
**Depends on**: Sprint 0
**Sprint governance**: `ai/testing/testing-doctrine.md`, `ai/testing/test-patterns.md`, `ai/checklists/performance-checklist.md`

### 2.1 Fix Package Boundaries

- [x] **2.1.1** Add `packages/integrations/*` to pnpm workspace ✅ **COMPLETED 2026-02-14** (added to pnpm-workspace.yaml)

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `pnpm-workspace.yaml`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A1
  - **Add**: `'packages/integrations/*'` to packages array
  - **Tests**: none
  - **Affects**: All integration packages will be recognized by pnpm
  - **Verify**: `pnpm install`; `@repo/integrations-supabase` is recognized

- [x] **2.1.2** Declare `@repo/infra` subpath exports in `package.json` ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `packages/infra/package.json`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A1
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
  - **Steps**:
    1. Grep all `from '@repo/infra/` imports across templates to discover required subpaths
    2. Add all discovered subpaths to exports map
    3. Run `pnpm install` to re-link
  - **Tests**: verify-existing — `pnpm build` must pass for both templates
  - **Affects**: Every file importing from `@repo/infra/*` — verify all resolve correctly
  - **Verify**: All template imports of `@repo/infra/*` resolve correctly

### 2.2 Fix Linting Infrastructure

- [x] **2.2.1** Add ESLint config to `packages/ui` _(completed 2026-02-14: created eslint.config.mjs extending @repo/eslint-config/library.js, added @repo/eslint-config devDependency)_

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/eslint.config.mjs`
  - **Governance**: `ai/AGENT_SYSTEM.md` §E
  - **Also add**: `"@repo/eslint-config": "workspace:*"` to devDependencies in `packages/ui/package.json`
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/ui lint` runs and passes (or shows real issues)

- [x] **2.2.2** Add ESLint config to `packages/utils` _(completed 2026-02-14: created eslint.config.mjs extending @repo/eslint-config/library.js, added @repo/eslint-config devDependency)_

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/utils/eslint.config.mjs`
  - **Governance**: `ai/AGENT_SYSTEM.md` §E
  - **Same pattern as 2.2.1**: Add `"@repo/eslint-config": "workspace:*"` to devDependencies
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/utils lint` runs and passes

### 2.3 Fix Testing Infrastructure

- [ ] **2.3.1** Fix root Jest config for multi-template support

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `jest.config.js`
  - **Governance**: `ai/testing/testing-doctrine.md`, `ai/testing/test-patterns.md`
  - **Issue**: `moduleNameMapper` hardcoded to `templates/hair-salon/$1`; plumber tests broken (D24)
  - **Options**:
    - A) Per-package Jest configs (preferred): Each template gets its own `jest.config.js` with correct `@/*` mapping; root runs via Turbo `turbo run test`
    - B) Fix root config to detect which template a test belongs to
  - **Steps** (Option A):
    1. Create `templates/hair-salon/jest.config.js` with correct moduleNameMapper for `@/*`
    2. Create `templates/plumber/jest.config.js` with correct moduleNameMapper
    3. Create `packages/infra/jest.config.js`
    4. Update root `jest.config.js` to use `projects` array or remove in favor of Turbo
  - **Tests**: verify-existing — all tests must still pass
  - **Verify**: `pnpm test` runs tests for both templates correctly

- [x] **2.3.2** Remove unused `jest.helpers.ts` _(completed 2026-02-14: deleted root jest.helpers.ts — functions were unused, root jest.config.js uses jest.setup.js instead)_

  - **Type**: DELETE
  - **Risk**: low
  - **Path**: `jest.helpers.ts`
  - **Governance**: none
  - **Issue**: 146-line file that is never imported
  - **Tests**: verify-existing
  - **Verify**: `pnpm test` still passes after removal

- [ ] **2.3.3** Add `testEnvironment` override for component tests

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `jest.config.js` (or per-package configs from 2.3.1)
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Issue**: Root config uses `testEnvironment: 'node'` — prevents DOM-based component tests; `jest-environment-jsdom` is installed but unused
  - **Fix**: Set `testEnvironment: 'jsdom'` for files matching `**/components/**/*.test.{ts,tsx}` via `projects` config
  - **Tests**: none (enables future component tests)
  - **Verify**: Component tests can use `render`, `screen`, etc.

- [ ] **2.3.4** Add `packages/infra/**` and `templates/plumber/**` to `collectCoverageFrom`

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `jest.config.js`
  - **Governance**: `ai/testing/testing-doctrine.md` §Coverage Targets
  - **Issue**: Coverage only collects from `templates/hair-salon` — infra and plumber gaps invisible
  - **Tests**: none
  - **Verify**: `pnpm test --coverage` reports coverage for all packages

- [ ] **2.3.5** Route root `test` script through Turbo instead of direct Jest

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: Root `package.json`
  - **Governance**: `ai/testing/testing-doctrine.md` §CI Pipeline
  - **Issue**: Root `"test": "jest --maxWorkers=50%"` runs Jest globally, NOT via Turbo — Turbo `test` task never exercised from CI
  - **Fix**: Change to `"test": "turbo run test"` and add `test` script to each package
  - **Affects**: CI pipeline, all package.json files
  - **Tests**: verify-existing
  - **Verify**: `pnpm test` invokes Turbo which runs per-package test configs

- [x] **2.3.6** Remove duplicate `sanitize.test.ts` from hair-salon template _(completed 2026-02-14: deleted templates/hair-salon/lib/**tests**/sanitize.test.ts and templates/plumber/lib/**tests**/sanitize.test.ts — canonical tests exist at packages/infra/**tests**/sanitize.test.ts)_

  - **Type**: DELETE
  - **Risk**: low
  - **Paths**: `templates/hair-salon/lib/__tests__/sanitize.test.ts`
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Issue**: 59 tests run twice — identical to `packages/infra/security/__tests__/sanitize.test.ts`
  - **Tests**: verify-existing — total test count decreases by 59 but coverage unchanged
  - **Verify**: Tests run once from `packages/infra`; coverage unchanged

### 2.4 Performance Quick Wins

- [ ] **2.4.1** Add `unstable_cache` for blog data

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/blog/lib/blog.ts`, `templates/plumber/features/blog/lib/blog.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`, `ai/references/nextjs-god-tier.md` §1.2 (caching model)
  - **Replace**: `cache(readAllPosts)` → `unstable_cache(readAllPosts, ['blog-all-posts'], { revalidate: 3600 })`
  - **Tests**: verify-existing
  - **Verify**: Blog data cached across requests (not re-read from filesystem each time)

- [ ] **2.4.1b** Add `unstable_cache` for search index

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/lib/search.ts`, `templates/plumber/lib/search.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`, `ai/references/nextjs-god-tier.md` §1.2
  - **Issue**: `getSearchIndex`/`buildSearchIndex` only uses React `cache()` — deduplicates per-request but rebuilds every request
  - **Replace**: Wrap with `unstable_cache(buildSearchIndex, ['search-index'], { revalidate: 3600, tags: ['search'] })`
  - **Tests**: verify-existing
  - **Verify**: Search index cached across requests

- [ ] **2.4.2** Add fetch timeouts to external API calls

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/hubspot/lib/hubspot-client.ts`, `templates/hair-salon/features/supabase/lib/supabase-leads.ts`, `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/supabase/lib/supabase-leads.ts`, `templates/plumber/features/booking/lib/booking-providers.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Add**: `signal: AbortSignal.timeout(10_000)` to all `fetch()` calls
  - **Tests**: create test — mock slow fetch, verify AbortError thrown after 10s
  - **Verify**: External API calls fail gracefully after 10 seconds instead of hanging

- [ ] **2.4.3** Add periodic cleanup to `InMemoryRateLimiter`

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/security/rate-limit.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Issue**: `limits` Map grows without bound (D20)
  - **Tests**: create test — add 1000 entries, wait for cleanup interval, verify old entries removed
  - **Verify**: Old entries are cleaned up periodically

### 2.5 DX Improvements

- [ ] **2.5.1** Create `.env.example` (if not done in 1.7)

  - **Type**: CREATE
  - **Risk**: low
  - **Depends on**: 1.7.1
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4
  - **Tests**: none
  - **Verify**: File exists with all env vars documented

- [ ] **2.5.2** Enable Turbo remote caching

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: none
  - **Commands**: `npx turbo login` → `npx turbo link`
  - **CI**: Add `TURBO_TOKEN` and `TURBO_TEAM` to GitHub Actions secrets
  - **Path**: `.github/workflows/ci.yml` — ensure `turbo` commands use remote cache
  - **Tests**: none
  - **Verify**: Second CI run shows cache hits

- [x] **2.5.3** Add `type-check` scripts to `@repo/ui` and `@repo/utils` ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `packages/ui/package.json`, `packages/utils/package.json`
  - **Governance**: `ai/testing/testing-doctrine.md` §CI Pipeline
  - **Issue**: TS errors in these packages only caught when templates build — no standalone verification
  - **Add**: `"type-check": "tsc --noEmit"` to scripts
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/ui type-check` works

- [ ] **2.5.4** Add lint and type-check scripts to `@repo/shared`

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `templates/shared/package.json`
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Issue**: Package completely unverified by CI
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/shared lint` and `type-check` work

- [ ] **2.5.5** Add per-package `test` scripts for Turbo orchestration

  - **Type**: MULTI_FILE
  - **Risk**: low
  - **Paths**: All `packages/*/package.json`, `templates/*/package.json`
  - **Governance**: `ai/testing/testing-doctrine.md` §CI Pipeline
  - **Issue**: No package has its own test script — all testing runs via root Jest
  - **Tests**: verify-existing
  - **Verify**: `turbo run test` discovers and runs tests per-package

- [x] **2.5.6** Add ESLint config to `@repo/infra` _(completed 2026-02-14: created eslint.config.mjs extending @repo/eslint-config/library.js with console allow for logging internals)_

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/infra/eslint.config.mjs`
  - **Governance**: `ai/AGENT_SYSTEM.md` §E
  - **Issue**: Lint runs with undefined config
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/infra lint` runs with proper rules

- [ ] **2.5.7** Add ESLint config to `@repo/integrations-supabase`

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/integrations/supabase/eslint.config.mjs`
  - **Governance**: `ai/AGENT_SYSTEM.md` §E
  - **Depends on**: 2.1.1 (package in workspace)
  - **Tests**: none
  - **Verify**: `pnpm --filter=@repo/integrations-supabase lint` runs

### 2.6 Docker Compose Fixes

- [x] **2.6.1** Fix `NODE_ENV=development` in `docker-compose.yml` ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: Production image runs with development env — defeats purpose
  - **Fix**: Change to `NODE_ENV=production`
  - **Tests**: none
  - **Verify**: Container starts in production mode

- [x] **2.6.2** Remove volume mount that overrides built files ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: Volume mount of source code overrides the built `.next` directory
  - **Fix**: Remove the volume mount; use `docker cp` or bind mounts only for config
  - **Tests**: none
  - **Verify**: Container uses built output, not source

- [x] **2.6.3** Add `.env_file` directive ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: No env vars injected into container — requires manual `-e` flags
  - **Fix**: Add `env_file: .env.production.local`
  - **Tests**: none
  - **Verify**: Container reads env vars from file

- [x] **2.6.4** Add restart policy and resource limits ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: No `restart: unless-stopped`, no memory/CPU limits
  - **Tests**: none
  - **Verify**: Container auto-restarts after crash

- [x] **2.6.5** Remove deprecated `version: '3.8'` key ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: `version` key deprecated in Compose v2+
  - **Tests**: none
  - **Verify**: `docker compose config` parses without deprecation warnings

- [x] **2.6.6** Add services for all active templates/apps ✅ **COMPLETED 2026-02-14** (added plumber service)

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `docker-compose.yml`
  - **Governance**: none
  - **Issue**: Only `hair-salon` service defined — plumber (and future `apps/*`) not included
  - **Fix**: Add service definitions for each active template/app; parameterize common config
  - **Tests**: none
  - **Verify**: `docker compose up` starts all configured services

- [ ] **2.6.7** Optimize Dockerfile `COPY` to only include needed packages

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `templates/hair-salon/Dockerfile`
  - **Governance**: none
  - **Issue**: Copies ALL packages including irrelevant ones — increases build context (L8)
  - **Fix**: Use multi-stage build with `pnpm deploy --filter=@templates/hair-salon`
  - **Tests**: none
  - **Verify**: Docker image size is significantly smaller

### 2.7 CI Pipeline Hardening

- [x] **2.7.1** Fix SBOM workflow artifact upload ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `.github/workflows/sbom-generation.yml`
  - **Governance**: none
  - **Issue**: References `pnpm-audit-results.json` that `pnpm audit` doesn't produce — artifact upload is empty
  - **Fix**: Use `pnpm audit --json > pnpm-audit-results.json` to generate actual file
  - **Tests**: none
  - **Verify**: SBOM workflow produces non-empty artifact

- [x] **2.7.2** Add CI concurrency to cancel stale runs ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `.github/workflows/ci.yml`
  - **Governance**: none
  - **Issue**: No concurrency configured — multiple runs for same PR waste resources
  - **Code**:
    ```yaml
    concurrency:
      group: ci-${{ github.ref }}
      cancel-in-progress: true
    ```
  - **Tests**: none
  - **Verify**: Pushing to same PR cancels previous CI run

- [x] **2.7.3** Make GitGuardian secret scan graceful when API key missing ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `.github/workflows/secret-scan.yml`
  - **Governance**: `ai/security/security-standards.md` §Secrets Policy
  - **Issue**: Entire workflow fails if `GITGUARDIAN_API_KEY` not configured
  - **Fix**: Add `if: secrets.GITGUARDIAN_API_KEY != ''` condition or `continue-on-error`
  - **Tests**: none
  - **Verify**: CI doesn't fail when API key is absent

- [x] **2.7.4** Add `continue-on-error` for non-critical CI steps ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `.github/workflows/ci.yml`
  - **Governance**: none
  - **Issue**: SBOM/audit step failure stops entire pipeline
  - **Fix**: Add `continue-on-error: true` to SBOM and notification steps
  - **Tests**: none
  - **Verify**: Core pipeline (lint, type-check, build, test) not blocked by auxiliary steps

---

## Sprint 3 — Complete Existing Extractions

**Goal**: Finish the in-progress package extractions from the original roadmap.
**Estimated effort**: 1–2 weeks
**Depends on**: Sprint 0 (CI green)
**Sprint governance**: `ai/patterns/integration-adapter-pattern.md`, `ai/AGENT_SYSTEM.md` §A1

### 3.1 Wire Templates to `@repo/integrations-supabase`

- [ ] **3.1.1** Update templates to import from `@repo/integrations-supabase`

  - **Type**: MULTI_FILE
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/lib/actions/submit.ts`, `templates/hair-salon/features/supabase/`, `templates/plumber/lib/actions/submit.ts`, `templates/plumber/features/supabase/`
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`
  - **Depends on**: 2.1.1 (package in workspace)
  - **Steps**:
    1. Update import paths from `@/features/supabase/...` to `@repo/integrations-supabase`
    2. Verify API compatibility between local and package versions
    3. Run `pnpm build` for both templates
  - **Tests**: verify-existing
  - **Verify**: `pnpm build` both; Supabase lead insert works

- [ ] **3.1.2** Delete duplicated `features/supabase/` from templates

  - **Type**: DELETE
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/features/supabase/`, `templates/plumber/features/supabase/`
  - **Governance**: none
  - **Depends on**: 3.1.1
  - **Tests**: verify-existing
  - **Verify**: No `features/supabase` dir in templates; builds pass

### 3.2 Extract HubSpot Integration

- [ ] **3.2.1** Create `packages/integrations/hubspot/`

  - **Type**: CREATE
  - **Risk**: medium
  - **Path**: `packages/integrations/hubspot/package.json`
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`, `ai/examples/perfect-adapter.ts`
  - **Source**: `templates/hair-salon/features/hubspot/`, `templates/hair-salon/lib/actions/hubspot.ts`
  - **Steps**:
    1. Create `packages/integrations/hubspot/` directory
    2. Create `package.json` with name `@repo/integrations-hubspot`, workspace deps
    3. Move client, types, sync logic from template
    4. Create `tsconfig.json` extending base config
  - **Tests**: move existing tests from template to package
  - **Verify**: `pnpm install`; package builds

- [ ] **3.2.2** Move client, sync logic, types

  - **Type**: MOVE
  - **Risk**: medium
  - **Paths**: `packages/integrations/hubspot/client.ts`, `packages/integrations/hubspot/sync.ts`, `packages/integrations/hubspot/types.ts`
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`
  - **Depends on**: 3.2.1
  - **Tests**: verify-existing — retry/upsert logic tests must pass in new location
  - **Verify**: Retry/upsert logic preserved; templates import from package

- [ ] **3.2.3** Update templates and delete duplicated feature

  - **Type**: MULTI_FILE
  - **Risk**: medium
  - **Governance**: none
  - **Depends on**: 3.2.2
  - **Steps**:
    1. Update `templates/hair-salon/lib/actions/hubspot.ts` to import from `@repo/integrations-hubspot`
    2. Same for `templates/plumber/lib/actions/hubspot.ts`
    3. Delete `templates/hair-salon/features/hubspot/`
    4. Delete `templates/plumber/features/hubspot/`
  - **Tests**: verify-existing
  - **Verify**: `pnpm build` both; no `features/hubspot` in templates

### 3.3 Extract Booking Providers

- [ ] **3.3.1** Create `packages/integrations/booking-providers/`

  - **Type**: CREATE
  - **Risk**: high
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`
  - **Source**: `templates/hair-salon/features/booking/lib/booking-providers.ts`
  - **Refactor**: Use registry/plugin pattern instead of closed factory (fixes D23)
  - **Steps**:
    1. Create `packages/integrations/booking-providers/` directory structure
    2. Create `package.json` with name `@repo/integrations-booking-providers`
    3. Create `registry.ts` with open registry pattern:
       ```ts
       const providerRegistry = new Map<string, BookingProvider>();
       export function registerProvider(name: string, provider: BookingProvider) {
         providerRegistry.set(name, provider);
       }
       export function getProvider(name: string): BookingProvider | undefined {
         return providerRegistry.get(name);
       }
       ```
    4. Move individual provider implementations from template
    5. Export types and registry from package index
  - **Tests**: create `packages/integrations/booking-providers/__tests__/registry.test.ts` — register, retrieve, unknown provider returns undefined
  - **Verify**: Providers are extensible without modifying source; `pnpm build` passes

### 3.4 Extract Analytics

- [ ] **3.4.1** Create `packages/integrations/analytics/`

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`
  - **Source**: `templates/hair-salon/features/analytics/`
  - **Steps**:
    1. Create `packages/integrations/analytics/` directory
    2. Create `package.json` with name `@repo/integrations-analytics`
    3. Move tracking, consent management (GDPR), Vercel analytics helpers
    4. Update template imports
  - **Include**: Tracking, consent management (GDPR), Vercel analytics helpers
  - **Tests**: move existing tests; verify consent logic works
  - **Verify**: `pnpm build`; analytics consent works

---

## Sprint 4 — Architecture Evolution (Platform Model)

**Goal**: Restructure repo from template-centric to platform-centric.
**Estimated effort**: 1 week
**Depends on**: Sprint 3
**Sprint governance**: `ai/decisions/001-architecture-decisions.md`

### 4.1 Restructure Directories

- [ ] **4.1.1** Create `apps/` directory for client sites

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Command**: `mkdir apps`
  - **Update**: `pnpm-workspace.yaml` — add `'apps/*'`
  - **Tests**: none
  - **Verify**: `pnpm install` succeeds with new workspace path

- [ ] **4.1.2** Move templates to `reference/` (or keep as `templates/` but clearly marked)

  - **Type**: MULTI_FILE
  - **Risk**: high
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Decision**: Either rename `templates/` → `reference/` or add a `README.md` to `templates/` explaining they are reference implementations, not starting points for clients
  - **Affects**: `pnpm-workspace.yaml`, `turbo.json`, `.github/workflows/ci.yml`, all documentation, Dockerfile paths
  - **Tests**: verify-existing — all builds and tests must pass after rename
  - **Verify**: `pnpm build` passes; CI still works

- [ ] **4.1.3** Deprecate `templates/plumber`

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Issue**: Incomplete fork with hair-salon content (73% identical). Maintaining two near-identical templates pushes toward sameness.
  - **Action**: Add deprecation notice to `templates/plumber/README.md`; optionally move to `archive/plumber`
  - **Tests**: none
  - **Verify**: Team agrees on deprecation plan

- [ ] **4.1.4** Fix plumber content that still references hair salon (if not deprecating immediately)

  - **Type**: MULTI_FILE
  - **Risk**: medium
  - **Governance**: none
  - **Paths**:
    - `templates/plumber/lib/env.public.ts` — defaults to `'Hair Salon Template'`
    - `templates/plumber/features/blog/lib/blog.ts` — retains `'Hair Care'` default category
    - `templates/plumber/app/layout.tsx` — SEO keywords include `'hair salon'`, `'haircut'`
    - `templates/plumber/components/InstallPrompt.tsx` — copy says "hair salon services"
    - `templates/plumber/app/services/*/` — renders haircuts, coloring, treatments
    - `templates/plumber/components/Hero.tsx`, `ValueProps.tsx`, `SocialProof.tsx`, `FinalCTA.tsx` — hair salon marketing copy
    - `templates/plumber/features/booking/lib/booking-schema.ts` — uses `SERVICE_TYPES` with hair-salon services
    - `templates/plumber/features/booking/lib/booking-providers.ts` — references salon platforms (Mindbody, Vagaro, Square)
    - `templates/plumber/eslint.config.mjs` — comment says "hair salon template"
  - **Issue**: Plumber is supposed to be a plumbing template but contains hair salon content everywhere
  - **Tests**: none
  - **Verify**: No hair salon references remain in plumber template

### 4.2 Create Client Site Scaffold

- [ ] **4.2.1** Document the "new client site" process

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `docs/NEW_CLIENT_SITE.md`
  - **Governance**: none
  - **Content**: Step-by-step for starting a new client app that composes packages
  - **Sections**: Init Next.js app → add workspace deps → configure `site.config.ts` → build unique pages
  - **Tests**: none
  - **Verify**: A developer can follow the doc to create a new client site

- [ ] **4.2.2** Create a minimal client site scaffold (optional)

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `apps/_scaffold/`
  - **Governance**: `ai/references/nextjs-god-tier.md` §1 (API factory), §4 (pages/metadata)
  - **Contains**: Bare `package.json` with platform deps, `next.config.js`, `site.config.ts` skeleton, `middleware.ts` using `createMiddleware`, `app/layout.tsx`, `app/page.tsx`
  - **Note**: This is NOT a template to copy — it's the minimal wiring to get platform packages working
  - **Tests**: none
  - **Verify**: `pnpm build` succeeds for scaffold app

### 4.3 CI/CD for Multi-App

- [ ] **4.3.1** Update CI to handle `apps/*` alongside `templates/*`

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `.github/workflows/ci.yml`
  - **Governance**: none
  - **Add**: Turbo filter for affected builds: `turbo run build --filter=...[HEAD^1]`
  - **Tests**: none
  - **Verify**: CI only builds changed apps/packages

- [ ] **4.3.2** Parallelize CI jobs

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `.github/workflows/ci.yml`
  - **Governance**: none
  - **Change**: Run lint, type-check, test as parallel jobs (not sequential steps)
  - **Tests**: none
  - **Verify**: CI completes faster

---

## Sprint 5 — Major Dependency Upgrades

**Goal**: Modernize the dependency stack.
**Estimated effort**: 1–2 weeks (can be done incrementally)
**Depends on**: Sprint 0 (CI green), Sprint 2 (package boundaries fixed)
**Sprint governance**: `ai/references/nextjs-god-tier.md` (full document), `ai/checklists/pre-pr-checklist.md`

> **God Tier Context**: As of Feb 2026, Next.js 16.1.x is Latest Stable (LTS until Oct 2027) and Next.js 15.x is Maintenance LTS (until Oct 2026). React 19.2.x is latest stable. Sprint 0 targets 15.5.12 as a safe patch. This sprint evaluates further upgrades. Key new features in 16.x: `proxy.ts` replaces `middleware.ts`, React Compiler is stable, Cache Components/PPR stable, `after()` API stable.

### 5.1 Upgrade TypeScript (Low Risk)

- [ ] **5.1.1** Upgrade to TypeScript 5.9.3

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/references/nextjs-god-tier.md` §Version Context
  - **Command**: Update catalog in `pnpm-workspace.yaml`; `pnpm install`
  - **New features**: `import defer` support, better hovers, perf improvements
  - **Tests**: verify-existing
  - **Verify**: `pnpm type-check` passes

### 5.2 Upgrade Turbo (Low Risk)

- [ ] **5.2.1** Upgrade to Turbo 2.8.8

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: none
  - **Command**: `pnpm add -D -w turbo@latest`
  - **Tests**: verify-existing
  - **Verify**: `pnpm build` passes; remote caching works

### 5.3 Upgrade React (Low Risk)

- [ ] **5.3.1** Upgrade React and React DOM to 19.2.4

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/references/nextjs-god-tier.md` §Version Context, §5.1 (CVE-2025-55182 React2Shell — ensure React >=19.2.1)
  - **Command**: Update catalog; `pnpm install`
  - **Tests**: verify-existing
  - **Verify**: `pnpm build` passes; no runtime regressions
  - **Note**: React 19.2.4 includes patches for CVE-2025-55182 (React2Shell). Verify version is at least 19.2.1.

### 5.4 Upgrade Tailwind CSS to v4 (High Risk — Plan Carefully)

- [ ] **5.4.1** Run automated migration tool

  - **Type**: RUN
  - **Risk**: high
  - **Governance**: `ai/design/design-system.md`, `ai/design/design-tokens.md`
  - **Command**: `npx @tailwindcss/upgrade` (in each template directory)
  - **Key changes**:
    - `tailwind.config.js` → CSS-based `@theme` directives
    - `@tailwind base/components/utilities` → CSS imports
    - PostCSS config changes
    - Some utility class renames
  - **Affects**: Every component using Tailwind classes, `packages/config/tailwind-preset.js`, `packages/ui/src/**`
  - **Tests**: verify-existing + visual regression testing recommended
  - **Verify**: All pages render correctly; no missing styles

- [ ] **5.4.2** Update `packages/ui` for Tailwind v4

  - **Type**: MULTI_FILE
  - **Risk**: high
  - **Governance**: `ai/design/design-system.md`, `ai/design/design-tokens.md`
  - **Depends on**: 5.4.1
  - **Tests**: verify-existing + component visual check
  - **Verify**: All UI components render correctly with new Tailwind

- [ ] **5.4.3** Update `tailwind-merge` to v3

  - **Type**: RUN
  - **Risk**: medium
  - **Governance**: none
  - **Required for**: Tailwind v4 class format compatibility
  - **Depends on**: 5.4.1
  - **Affects**: `packages/utils/src/cn.ts`
  - **Tests**: verify-existing
  - **Verify**: `cn()` utility works correctly

### 5.5 Upgrade Zod to v4 (Medium Risk)

- [ ] **5.5.1** Run codemod and upgrade

  - **Type**: RUN
  - **Risk**: medium
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2 (Zod validation mandatory)
  - **Command**: `npx zod-v3-to-v4` then `pnpm add zod@^4.0.0` via catalog
  - **Key changes**: `message` param → `error` param; `errorMap` → `error`
  - **Affects**: All env schemas in `packages/infra/env/schemas/`, all form schemas in `templates/*/features/*/lib/*-schema.ts`
  - **Tests**: verify-existing — all validation tests must pass
  - **Verify**: `pnpm type-check` and `pnpm build` pass; env validation still works

### 5.6 Upgrade ESLint to v10 (Medium Risk)

- [ ] **5.6.1** Upgrade ESLint and plugins

  - **Type**: RUN
  - **Risk**: medium
  - **Governance**: none
  - **Command**: Update catalog to `eslint: "^10.0.0"`; upgrade `@typescript-eslint/*` to compatible versions
  - **Key change**: `.eslintrc.*` completely removed (repo already uses flat config)
  - **Tests**: verify-existing
  - **Verify**: `pnpm lint` passes; ESLint 10's per-file config lookup works correctly in monorepo

### 5.7 Upgrade `next-mdx-remote` to v6 (Medium Risk)

- [ ] **5.7.1** Upgrade `next-mdx-remote` from 5.0.0 to 6.0.0

  - **Type**: RUN
  - **Risk**: medium
  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`
  - **Governance**: none
  - **Breaking changes**: Check migration guide for API changes in MDX rendering
  - **Affects**: `templates/*/features/blog/components/BlogPostContent.tsx`
  - **Tests**: verify-existing — blog post rendering must work
  - **Verify**: Blog posts render correctly; MDX plugins still work

### 5.8 Minor & Patch Dependency Upgrades (Low Risk — Batch)

- [ ] **5.8.1** Batch upgrade minor/patch dependencies via catalog

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/references/nextjs-god-tier.md` §Version Context
  - **Paths**: `pnpm-workspace.yaml` (catalog), all `package.json` files
  - **Upgrades**:
    - `react-hook-form` 7.55.0 → 7.71.1
    - `lucide-react` 0.344.0 → 0.564.0
    - `prettier` 3.2.5 → 3.8.1
    - `@typescript-eslint/*` 8.19.1 → 8.55.0
    - `postcss` 8.4.49 → 8.5.6
    - `@upstash/redis` 1.34.3 → 1.36.2
    - `@upstash/ratelimit` 2.0.5 → 2.0.8
    - `@types/react` 19.0.2 → 19.2.14
    - `@types/react-dom` 19.0.2 → 19.2.3
    - `@eslint/eslintrc` 3.2.0 → 3.3.3
    - `autoprefixer` 10.4.20 → 10.4.24
    - `remark-gfm` 4.0.0 → 4.0.1
    - `eslint-config-next` 15.2.9 → latest v15 stable
    - `@hookform/resolvers` — stay on v3 for now (react-hook-form v8 still beta)
  - **Script**:
    ```bash
    pnpm update --recursive --latest
    ```
  - **Tests**: verify-existing
  - **Verify**: `pnpm build` and `pnpm test` pass for all templates

- [ ] **5.8.2** Fix `@eslint/plugin-kit` ReDoS vulnerability (low severity, dev-only)

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/security/security-standards.md`
  - **Command**: `pnpm update @eslint/plugin-kit --recursive`
  - **Tests**: none
  - **Verify**: `pnpm audit` shows no `@eslint/plugin-kit` vulnerability

- [ ] **5.8.3** Evaluate replacing `rehype-pretty-code` with lighter `rehype-highlight`

  - **Type**: EDIT
  - **Risk**: medium
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Paths**: `templates/hair-salon/package.json`, `templates/plumber/package.json`, blog MDX pipeline
  - **Issue**: `rehype-pretty-code` pulls `shiki` (~30MB) — `rehype-highlight` is ~300KB
  - **Trade-off**: `shiki` has better syntax fidelity; only switch if bundle size is a concern
  - **Tests**: verify-existing — blog code blocks must render correctly
  - **Verify**: Blog code blocks render correctly with replacement (if chosen)

- [ ] **5.8.4** Configure Sentry to exclude unused OpenTelemetry instrumentations

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Paths**: `templates/hair-salon/next.config.js`, `templates/plumber/next.config.js`
  - **Issue**: Sentry pulls 13+ unused instrumentations (Express, Fastify, Prisma, etc.) — harms tree-shaking
  - **Fix**: Add unused packages to `serverExternalPackages` or Sentry's `excludeServerPackages`
  - **Tests**: none
  - **Verify**: Build warnings for unused instrumentations disappear; bundle size reduced

### 5.9 Evaluate Next.js 16 Upgrade (NEW — from God Tier Reference)

- [ ] **5.9.1** Evaluate Next.js 16.x upgrade feasibility

  - **Type**: RUN
  - **Risk**: high
  - **Governance**: `ai/references/nextjs-god-tier.md` (full document — §1.3 proxy.ts migration, §8 React Compiler, §4.3 PPR/Cache Components)
  - **Depends on**: Sprint 0 complete, Sprint 2 complete
  - **Steps**:
    1. Review God Tier §1.3 — `middleware.ts` → `proxy.ts` migration path
    2. Review God Tier §8 — React Compiler (automatic memoization, removes need for `useMemo`/`useCallback`)
    3. Review God Tier §4.3 — Cache Components / PPR stability
    4. Test upgrade on hair-salon template in a branch: `pnpm --filter=@templates/hair-salon add next@16`
    5. Document breaking changes and migration effort
  - **Tests**: full test suite on upgraded branch
  - **Verify**: Document created at `docs/NEXTJS_16_EVALUATION.md` with go/no-go recommendation

---

## Sprint 6 — UI Component Library Enhancement

**Goal**: Build out the design system primitives that enable unique client sites.
**Estimated effort**: 2–4 weeks
**Depends on**: Sprint 0 (CI green)
**Sprint governance**: `ai/design/design-system.md`, `ai/design/design-tokens.md`, `ai/checklists/accessibility-checklist.md`
**Note**: This can run in parallel with Sprints 1–4.

### 6.1 Audit & Foundation

- [ ] **6.1.1** Audit current 8 UI components (Button, Card, Container, Section, Input, Select, Textarea, Accordion)

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/design/design-system.md`, `ai/design/design-tokens.md`, `ai/checklists/accessibility-checklist.md`
  - **Steps**:
    1. Review each component against design tokens (are they using CSS vars from `ai/design/design-tokens.md`?)
    2. Check a11y: keyboard nav, ARIA attributes, focus indicators, contrast ratios
    3. Check prop API consistency across components
    4. Document findings in `docs/UI_AUDIT.md`
  - **Tests**: none
  - **Verify**: Audit document created with actionable findings

- [ ] **6.1.2** Evaluate Radix UI or shadcn/ui as headless a11y layer

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/design/design-system.md`, `ai/decisions/002-technology-decisions.md`
  - **Tests**: none
  - **Verify**: Decision documented in `ai/decisions/003-ui-primitives-decision.md`

- [ ] **6.1.3** Add per-component exports for tree-shaking (`package.json` exports field)

  - **Type**: EDIT
  - **Risk**: medium
  - **Path**: `packages/ui/package.json`
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Tests**: verify-existing — `pnpm build` must pass for all templates
  - **Affects**: All files importing from `@repo/ui`
  - **Verify**: Bundle analysis shows only imported components included

- [ ] **6.1.4** Add ESLint config and unit tests to `packages/ui` (blocked by 2.2.1)

  - **Type**: MULTI_FILE
  - **Risk**: low
  - **Governance**: `ai/testing/testing-doctrine.md` §Coverage by Module Type (Components: 85%)
  - **Depends on**: 2.2.1
  - **Tests**: create tests for all 8 existing components — render, props, a11y assertions
  - **Verify**: `pnpm --filter=@repo/ui test` passes with >=85% coverage

### 6.2 Content Primitives

> **Governance for all 6.2–6.8 tasks**: `ai/design/design-system.md` (component structure), `ai/design/design-tokens.md` (colors, spacing, typography), `ai/checklists/accessibility-checklist.md` (WCAG 2.2 AA), `ai/AGENT_SYSTEM.md` §D (a11y rules). Every component MUST: use design tokens via CSS variables, support keyboard navigation, include ARIA attributes, have >=85% test coverage, export types.

- [ ] **6.2.1** Badge

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/src/Badge/Badge.tsx`
  - **Governance**: Sprint-level (see above)
  - **Tests**: create `packages/ui/src/Badge/__tests__/Badge.test.tsx` — render variants, a11y role
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.2.2** Avatar + AvatarGroup

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/src/Avatar/`
  - **Governance**: Sprint-level
  - **Tests**: create tests — image load, fallback initials, group overflow count
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.2.3** Divider

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/src/Divider/Divider.tsx`
  - **Governance**: Sprint-level
  - **Tests**: create test — render, orientation prop, aria-role=separator
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.2.4** Image (Next.js wrapper)

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/src/Image/Image.tsx`
  - **Governance**: Sprint-level, `ai/AGENT_SYSTEM.md` §B4 (image optimization), `ai/references/nextjs-god-tier.md` §4.1 (Image usage)
  - **Tests**: create test — render, alt text required, priority prop forwarded
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.2.5** VisuallyHidden

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `packages/ui/src/VisuallyHidden/VisuallyHidden.tsx`
  - **Governance**: Sprint-level, `ai/checklists/accessibility-checklist.md`
  - **Tests**: create test — element present in DOM, visually hidden via CSS, screen reader accessible
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.3 Layout Primitives

- [ ] **6.3.1** Stack / VStack — `packages/ui/src/Stack/Stack.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — gap prop, direction, align/justify
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.3.2** Inline / HStack — `packages/ui/src/Inline/Inline.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — gap, wrap, align
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.3.3** Grid — `packages/ui/src/Grid/Grid.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — columns, gap, responsive
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.3.4** AspectRatio — `packages/ui/src/AspectRatio/AspectRatio.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create test — ratio prop, child rendering
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.4 Input Primitives

- [ ] **6.4.1** Checkbox — `packages/ui/src/Checkbox/Checkbox.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level, `ai/AGENT_SYSTEM.md` §D3
  - **Tests**: create tests — checked state, onChange, label association, keyboard toggle
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.4.2** Radio + RadioGroup — `packages/ui/src/Radio/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level, `ai/AGENT_SYSTEM.md` §D3
  - **Tests**: create tests — group selection, keyboard arrow navigation, aria-checked
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.4.3** Switch — `packages/ui/src/Switch/Switch.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — toggle, aria-checked, keyboard
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.4.4** DatePicker — `packages/ui/src/DatePicker/DatePicker.tsx`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level
  - **Tests**: create tests — date selection, min/max bounds, keyboard nav, a11y
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.4.5** FileUpload — `packages/ui/src/FileUpload/FileUpload.tsx`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level, `ai/security/security-standards.md` §File Upload Security
  - **Tests**: create tests — file type validation, size limit, drag-and-drop, a11y
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.5 Feedback Components

- [ ] **6.5.1** Toast (wrap Sonner) — `packages/ui/src/Toast/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — show/dismiss, variants, auto-dismiss timer, a11y live region
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.5.2** Alert — `packages/ui/src/Alert/Alert.tsx`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — variants (info/success/warning/error), dismiss, aria-role=alert
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.5.3** Dialog/Modal — `packages/ui/src/Dialog/`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level, `ai/checklists/accessibility-checklist.md`
  - **Tests**: create tests — open/close, focus trap, escape key, aria-modal, backdrop click
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.5.4** Drawer — `packages/ui/src/Drawer/Drawer.tsx`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level
  - **Tests**: create tests — open/close, slide direction, focus trap
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.5.5** Tooltip + Popover — `packages/ui/src/Tooltip/`, `Popover/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — hover trigger, click trigger, positioning, aria-describedby
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.5.6** Skeleton + Spinner — `packages/ui/src/Skeleton/`, `Spinner/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Tests**: create tests — render, aria-busy, reduced motion support
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.6 Compositions

- [ ] **6.6.1** FormField (label + input + helper + error) — `packages/ui/src/FormField/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level, `ai/AGENT_SYSTEM.md` §D3
  - **Tests**: create tests — label association, error display, helper text, required indicator
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.6.2** NavigationMenu — `packages/ui/src/NavigationMenu/`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level, `ai/AGENT_SYSTEM.md` §D2
  - **Tests**: create tests — keyboard nav, active state, mobile collapse, aria
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.6.3** MobileMenu — `packages/ui/src/MobileMenu/`

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level
  - **Tests**: create tests — open/close, focus trap, body scroll lock
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.6.4** Breadcrumb (with JSON-LD) — `packages/ui/src/Breadcrumb/`

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level, `ai/marketing/structured-data.md`
  - **Tests**: create tests — render items, JSON-LD output, aria-current on last item
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.6.5** Tabs, Pagination, Table — `packages/ui/src/Tabs/`, etc.

  - **Type**: CREATE | **Risk**: medium | **Governance**: Sprint-level
  - **Tests**: create tests for each — keyboard nav, ARIA roles, state management
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.7 Hooks

- [ ] **6.7.1** useMediaQuery, useScrollPosition, useDebounce, useClickOutside, useReducedMotion

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Path**: `packages/ui/src/hooks/`
  - **Tests**: create tests for each hook — mock window/media queries
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.7.2** useFocusTrap, useIntersectionObserver

  - **Type**: CREATE | **Risk**: low | **Governance**: Sprint-level
  - **Path**: `packages/ui/src/hooks/`
  - **Tests**: create tests — focus containment, intersection callbacks
  - **Verify**: `pnpm --filter=@repo/ui test` passes

### 6.8 Accessibility (WCAG 2.2 AA)

- [ ] **6.8.1** SkipToContent — `packages/ui/src/SkipToContent/`

  - **Type**: CREATE | **Risk**: low | **Governance**: `ai/checklists/accessibility-checklist.md`
  - **Tests**: create test — visible on focus, navigates to main content
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.8.2** FocusTrap — `packages/ui/src/FocusTrap/`

  - **Type**: CREATE | **Risk**: low | **Governance**: `ai/checklists/accessibility-checklist.md`
  - **Tests**: create test — tab cycles within trap, escape releases
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.8.3** LiveRegion — `packages/ui/src/LiveRegion/`

  - **Type**: CREATE | **Risk**: low | **Governance**: `ai/checklists/accessibility-checklist.md`
  - **Tests**: create test — aria-live attribute, polite/assertive modes
  - **Verify**: `pnpm --filter=@repo/ui test` passes

- [ ] **6.8.4** Audit all components — visible focus, 24×24px touch targets, aria attributes

  - **Type**: RUN | **Risk**: low | **Governance**: `ai/checklists/accessibility-checklist.md`
  - **Tests**: create axe-core test suite for all components
  - **Verify**: Zero axe violations

---

## Sprint 7 — Feature Packages

**Goal**: Extract reusable feature logic (not UI, not layout — just logic).
**Estimated effort**: 2–3 weeks
**Depends on**: Sprint 3
**Sprint governance**: `ai/patterns/integration-adapter-pattern.md`, `ai/testing/testing-doctrine.md`

### 7.1 `packages/features/contact/`

- [ ] **7.1.1** Create package with schema, server action, integrations composition

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`, `ai/references/nextjs-god-tier.md` §3 (forms with React 19 Actions)
  - **Steps**:
    1. Create `packages/features/contact/` directory
    2. Create `package.json`, `tsconfig.json`
    3. Move schema from `templates/hair-salon/features/contact/lib/contact-schema.ts`
    4. Move server action logic (Zod validation, rate limiting, integration dispatch)
    5. Export composable pieces: schema, action creator, types
  - **Tests**: move and update existing tests
  - **Verify**: `pnpm build`; contact form submission works

- [ ] **7.1.2** Keep form UI in client apps (each client designs their own contact form)

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Tests**: verify-existing
  - **Verify**: UI component remains in template; imports logic from package

- [ ] **7.1.3** Update reference template to use feature package

  - **Type**: EDIT
  - **Risk**: medium
  - **Governance**: none
  - **Depends on**: 7.1.1
  - **Tests**: verify-existing
  - **Verify**: `pnpm build`; contact form submission works end-to-end

### 7.2 `packages/features/booking/`

- [ ] **7.2.1** Create package with schema, server action, provider integration

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`, `ai/references/nextjs-god-tier.md` §3
  - **Tests**: create comprehensive tests — schema validation, action states, provider dispatch
  - **Verify**: Package builds and exports correctly

- [ ] **7.2.2** **Replace in-memory Map with Supabase persistence** (fixes D5)

  - **Type**: EDIT
  - **Risk**: high
  - **Governance**: `ai/patterns/integration-adapter-pattern.md`
  - **Issue**: Bookings stored in `Map` — lost on server restart
  - **Tests**: create integration tests with mocked Supabase — CRUD operations, concurrent access
  - **Verify**: Bookings persist across restarts

- [ ] **7.2.3** Update reference template

  - **Type**: EDIT
  - **Risk**: medium
  - **Depends on**: 7.2.1, 7.2.2
  - **Tests**: verify-existing
  - **Verify**: `pnpm build`; booking flow works

### 7.3 `packages/features/blog/`

- [ ] **7.3.1** Create package with MDX utilities, reading time, frontmatter parsing

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: none
  - **Tests**: create tests — frontmatter parsing, reading time calculation, slug generation
  - **Verify**: Package builds

- [ ] **7.3.2** Keep blog layout/design in client apps

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Tests**: verify-existing
  - **Verify**: Blog pages render; tests pass

### 7.4 `packages/features/search/`

- [ ] **7.4.1** Create package with index builder, search logic

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: none
  - **Tests**: create tests — index building, search ranking, empty query handling
  - **Verify**: Package builds

- [ ] **7.4.2** Keep search UI in client apps

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Tests**: verify-existing
  - **Verify**: Search works across blog and pages

---

## Sprint 8 — Production Readiness

**Goal**: Testing, performance, SEO, documentation.
**Estimated effort**: 2–4 weeks
**Depends on**: Sprints 1–4
**Sprint governance**: `ai/checklists/performance-checklist.md`, `ai/checklists/accessibility-checklist.md`, `ai/performance/lighthouse-budget.md`

### 8.1 Testing — Unit & Integration

- [ ] **8.1.1** Unit tests for all `packages/infra` exports

  - **Type**: CREATE
  - **Risk**: low
  - **Governance**: `ai/testing/testing-doctrine.md` §Coverage Targets (Utilities: 100%, Middleware: 95%), `ai/testing/test-patterns.md`
  - **Steps** — create tests for each:
    - [ ] `sanitizeHtml`, `sanitizeInput`, `validateAndSanitize`
    - [ ] `log()` generic function in logger
    - [ ] `CSP_REPORT_TO_HEADER`, `CSP_REPORT_ONLY_HEADER`
    - [ ] `runWithRequestId`, `getRequestId`
    - [ ] `withServerSpan`
    - [ ] `sanitizeSentryEvent`
  - **Tests**: create `packages/infra/**/__tests__/*.test.ts` for each module
  - **Verify**: `pnpm --filter=@repo/infra test --coverage` shows >=95%

- [ ] **8.1.2** Unit tests for `getBlockedSubmissionResponse` (CSRF + honeypot)

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `templates/hair-salon/lib/actions/__tests__/helpers.test.ts`
  - **Governance**: `ai/testing/testing-doctrine.md`, `ai/security/security-standards.md`
  - **Tests**: create covering: cross-origin blocked, honeypot triggered, valid request passes
  - **Verify**: Tests pass

- [ ] **8.1.3** Unit tests for `buildSanitizedContactData` (sanitization pipeline)

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `templates/hair-salon/lib/actions/__tests__/helpers.test.ts`
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Tests**: create covering: HTML stripped, XSS vectors neutralized, valid data preserved
  - **Verify**: Tests pass

- [ ] **8.1.4** Integration tests for `submitContactForm` server action

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/testing/testing-doctrine.md` §Integration Tests, `ai/testing/test-patterns.md`
  - **Tests**: create with mocked Supabase, HubSpot, rate limit — success path, rate limit path, validation error path, integration failure path
  - **Verify**: Tests pass

- [ ] **8.1.5** Integration tests for booking server actions

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Tests**: create covering `submitBookingRequest`, `confirmBooking`, `cancelBooking`, `getBookingDetails` — success, validation errors, rate limiting, CSRF rejection
  - **Verify**: Tests pass

- [ ] **8.1.6** Integration tests for Upstash distributed rate limiting path

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/testing/testing-doctrine.md`
  - **Issue**: Only in-memory path tested; Upstash path never exercised
  - **Tests**: create with mocked Upstash Redis — limit exceeded, limit allowed, Redis connection failure fallback
  - **Verify**: Tests pass

- [ ] **8.1.7** Component tests for critical UI

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/testing/testing-doctrine.md` §Coverage by Module Type (Components: 85%)
  - **Depends on**: 2.3.3 (jsdom test environment)
  - **Components**: ContactForm, BookingForm, Navigation, Footer, ErrorBoundary, SearchDialog
  - **Tests**: create tests — render, user interaction, form submission, a11y
  - **Verify**: Component test coverage >=85%

- [ ] **8.1.8** E2E with Playwright for critical flows

  - **Type**: CREATE
  - **Risk**: medium
  - **Governance**: `ai/testing/testing-doctrine.md` §E2E
  - **Tests**: create Playwright tests — form submit, mobile nav, keyboard nav, booking flow
  - **Verify**: All E2E tests pass

- [ ] **8.1.9** axe-core accessibility testing in E2E

  - **Type**: CREATE
  - **Risk**: low
  - **Governance**: `ai/checklists/accessibility-checklist.md`
  - **Tests**: add `@axe-core/playwright` to E2E tests — zero violations on all pages
  - **Verify**: All pages pass axe audit

### 8.2 Performance

- [ ] **8.2.1** Move CSP nonce generation from layout to middleware (enables static generation) (D18)

  - **Type**: EDIT
  - **Risk**: high
  - **Paths**: `templates/hair-salon/app/layout.tsx`, `templates/plumber/app/layout.tsx`, `packages/infra/security/create-middleware.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`, `ai/references/nextjs-god-tier.md` §5.6 (CSP trade-off: nonce forces dynamic)
  - **Issue**: `headers()` call in root layout forces ALL 12+ static pages to render dynamically on every request
  - **Fix**: Generate nonce in middleware, pass via request header; layout reads from header
  - **Affects**: Every page — all become eligible for static generation
  - **Tests**: create test — verify nonce present in response, verify static pages served statically
  - **Verify**: Static pages are actually served statically (no `x-nextjs-cache: MISS` on every request)

- [ ] **8.2.2** Dynamic import heavy components below fold (`next/dynamic`)

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/page.tsx`, `templates/hair-salon/app/contact/page.tsx`, `templates/hair-salon/app/book/page.tsx`, `templates/plumber/app/page.tsx`, `templates/plumber/app/contact/page.tsx`, `templates/plumber/app/book/page.tsx`
  - **Governance**: `ai/checklists/performance-checklist.md`, `ai/performance/lighthouse-budget.md`
  - **Components**: ContactForm, BookingForm, SocialProof, FinalCTA
  - **Tests**: verify-existing
  - **Verify**: Lighthouse performance score improves; main bundle smaller

- [ ] **8.2.3** Core Web Vitals audit — LCP <2.5s, INP <200ms, CLS <0.1

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/performance/lighthouse-budget.md`, `ai/performance/performance-doctrine.md`
  - **Tests**: none
  - **Verify**: All pages meet CWV thresholds

- [ ] **8.2.4** Tree-shaking verification for `packages/ui`

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Tests**: none
  - **Verify**: Bundle analysis shows only imported UI components included

- [ ] **8.2.5** Switch blog to async file reads (`fs.promises.readdir` + `Promise.all`)

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/features/blog/lib/blog.ts`, `templates/plumber/features/blog/lib/blog.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Issue**: `fs.readFileSync` blocks event loop on every request (L138,141,147)
  - **Tests**: verify-existing — blog tests must pass
  - **Verify**: Blog data loaded asynchronously; no sync I/O in production

- [ ] **8.2.6** Add ISR (`revalidate`) to content-heavy routes

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/blog/page.tsx`, `templates/hair-salon/app/services/*/page.tsx`, `templates/plumber/app/blog/page.tsx`, `templates/plumber/app/services/*/page.tsx`
  - **Governance**: `ai/references/nextjs-god-tier.md` §1.2 (caching model), `ai/checklists/performance-checklist.md`
  - **Issue**: No ISR used on any route — all content re-rendered per request
  - **Tests**: none
  - **Verify**: Blog and service pages serve stale-while-revalidate responses

- [x] **8.2.7** Remove `React.memo` from Server Components ✅ **COMPLETED 2026-02-14**

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/components/SocialProof.tsx`, `templates/hair-salon/components/ValueProps.tsx`, `templates/plumber/components/SocialProof.tsx`, `templates/plumber/components/ValueProps.tsx`
  - **Governance**: `ai/references/nextjs-god-tier.md` §8 (React Compiler handles memoization)
  - **Issue**: `React.memo` has no effect on Server Components — adds confusion
  - **Tests**: verify-existing
  - **Verify**: Components render identically without `memo` wrapper

- [ ] **8.2.8** Build `allowedSet` once at middleware creation time

  - **Type**: EDIT
  - **Risk**: low
  - **Path**: `packages/infra/security/create-middleware.ts`
  - **Governance**: `ai/checklists/performance-checklist.md`
  - **Issue**: `allowedSet` rebuilt from `allowedOrigins` array on EVERY request (L72–74)
  - **Fix**: Close over a pre-built `Set` in the middleware closure
  - **Tests**: verify-existing
  - **Verify**: No per-request `Set` allocation

- [ ] **8.2.9** Verify Zod not bundled into unnecessary client chunks

  - **Type**: RUN
  - **Risk**: low
  - **Governance**: `ai/checklists/performance-checklist.md`, `ai/performance/lighthouse-budget.md`
  - **Issue**: Zod should only appear in form bundles, not global client JS
  - **Tests**: none
  - **Verify**: `next build` bundle analysis shows Zod only in contact/booking chunks

- [ ] **8.2.10** Configure `images.remotePatterns` in `next.config.js`

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/next.config.js`, `templates/plumber/next.config.js`
  - **Governance**: `ai/references/nextjs-god-tier.md` §4.1 (Image usage)
  - **Issue**: No remote patterns configured — OG images reference external URLs
  - **Tests**: none
  - **Verify**: `next/image` can load external images without errors

- [ ] **8.2.11** Add `placeholder="blur"` to Hero images

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/components/Hero.tsx`, `templates/plumber/components/Hero.tsx`
  - **Governance**: `ai/AGENT_SYSTEM.md` §B4, `ai/checklists/performance-checklist.md`
  - **Tests**: none
  - **Verify**: Hero image shows blurred preview during load

- [ ] **8.2.12** Use `next/image` when real images added to Gallery/Team pages

  - **Type**: EDIT
  - **Risk**: low
  - **Paths**: `templates/hair-salon/app/gallery/page.tsx`, `templates/hair-salon/app/team/page.tsx`, `templates/plumber/app/gallery/page.tsx`, `templates/plumber/app/team/page.tsx`
  - **Governance**: `ai/AGENT_SYSTEM.md` §B4, `ai/references/nextjs-god-tier.md` §4.1
  - **Issue**: Placeholder `<div>` used — must use `next/image` with `sizes` and `placeholder="blur"` when real images added
  - **Tests**: none
  - **Verify**: Real images use optimized Next.js image component

### 8.3 SEO

- [ ] **8.3.1** JSON-LD generators for LocalBusiness, Article, FAQ, BreadcrumbList

  - **Type**: CREATE
  - **Risk**: low
  - **Governance**: `ai/marketing/structured-data.md`, `ai/patterns/seo-pattern.md`
  - **Tests**: create tests — validate JSON-LD output against Schema.org
  - **Verify**: Google Rich Results Test passes

- [ ] **8.3.2** Auto sitemap and robots via Next.js Metadata API

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/patterns/seo-pattern.md`
  - **Tests**: none
  - **Verify**: `/sitemap.xml` and `/robots.txt` serve correct content

- [ ] **8.3.3** Dynamic OG image generation

  - **Type**: EDIT
  - **Risk**: low
  - **Governance**: `ai/patterns/seo-pattern.md`, `ai/references/nextjs-god-tier.md` §4.1
  - **Tests**: none
  - **Verify**: OG images generated for each page; social media previews work

### 8.4 Documentation

- [ ] **8.4.1** `docs/NEW_CLIENT_SITE.md` — step-by-step guide

  - **Type**: CREATE | **Risk**: low | **Governance**: none
  - **Tests**: none | **Verify**: Developer can follow guide successfully

- [ ] **8.4.2** `CONTRIBUTING.md` — how to add a feature, integration, or UI component

  - **Type**: CREATE | **Risk**: low | **Governance**: none
  - **Tests**: none | **Verify**: Document is comprehensive and accurate

- [ ] **8.4.3** `docs/ARCHITECTURE.md` — platform architecture overview

  - **Type**: CREATE | **Risk**: low | **Governance**: `ai/decisions/001-architecture-decisions.md`
  - **Tests**: none | **Verify**: Accurately reflects current architecture

- [ ] **8.4.4** VS Code workspace settings and recommended extensions

  - **Type**: CREATE | **Risk**: low | **Governance**: none
  - **Tests**: none | **Verify**: `.vscode/settings.json` and `.vscode/extensions.json` created

- [ ] **8.4.5** Fix `docs/INDEX.md` and `docs/clients/README.md` references to non-existent `clients/example-client`

  - **Type**: EDIT | **Risk**: low | **Governance**: none
  - **Tests**: none | **Verify**: No broken references in docs

---

## Sprint 9 — Code Quality Sweep

**Goal**: Eliminate type assertions, magic numbers, dead code, and micro-quality issues across the codebase.
**Estimated effort**: 1–2 weeks
**Depends on**: Sprints 0–3 (so you're working on clean, extracted code)
**Sprint governance**: `ai/AGENT_SYSTEM.md` §A (all rules), `ai/testing/test-patterns.md`
**Note**: Many of these are small fixes that can be done opportunistically as you touch files.

### 9.1 Eliminate `as any` and Unsafe Type Assertions

- [ ] **9.1.1** Fix `process.env.NODE_ENV as any` bypass

  - **Type**: EDIT | **Risk**: low
  - **Paths**: `templates/hair-salon/lib/actions/submit.ts`, `templates/plumber/lib/actions/submit.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4
  - **Issue**: Casts `NODE_ENV` to `any`, bypassing type safety (L30)
  - **Fix**: Use validated env value instead of raw `process.env`
  - **Tests**: verify-existing
  - **Verify**: No `as any` on env access

- [ ] **9.1.2** Fix `limiter: any` in rate-limit.ts

  - **Type**: EDIT | **Risk**: low
  - **Path**: `packages/infra/security/rate-limit.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Core rate limiter loses type information (L166–168)
  - **Fix**: Type the limiter properly with `Ratelimit | InMemoryRateLimiter` union
  - **Tests**: verify-existing
  - **Verify**: `limiter` is fully typed

- [ ] **9.1.3** Fix `(check as any).type` unchecked property access

  - **Type**: EDIT | **Risk**: low
  - **Path**: `packages/infra/security/rate-limit.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Unchecked assertion (L420)
  - **Fix**: Add proper type guard or narrow via discriminated union
  - **Tests**: verify-existing
  - **Verify**: No `as any` in rate limit checks

- [ ] **9.1.4** Fix `prefilledService as any` in BookingForm

  - **Type**: EDIT | **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/components/BookingForm.tsx`, `templates/plumber/features/booking/components/BookingForm.tsx`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Loses form field type
  - **Fix**: Type the prop correctly via the form schema type
  - **Tests**: verify-existing
  - **Verify**: BookingForm has full type safety

- [ ] **9.1.5** Fix `validateEnv() as CompleteEnv` compile-time cast

  - **Type**: EDIT | **Risk**: medium
  - **Paths**: `templates/hair-salon/lib/env.ts`, `templates/plumber/lib/env.ts`, `packages/infra/env/validate.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Runtime-validated but compile-time cast drops inference (L56, L197–199)
  - **Fix**: Use Zod's `z.infer<>` to derive the return type
  - **Tests**: verify-existing
  - **Verify**: `validateEnv` return type is inferred, not asserted

- [ ] **9.1.6** Fix `sanitizeValue(event as JsonValue) as TEvent` double assertion

  - **Type**: EDIT | **Risk**: low
  - **Path**: `packages/infra/sentry/sanitize.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Double assertion through `unknown` (L63)
  - **Fix**: Add proper overload or generic constraint
  - **Tests**: verify-existing
  - **Verify**: Single assertion at most

- [ ] **9.1.7** Fix `validatedEnv[key as keyof typeof validatedEnv]` dynamic access

  - **Type**: EDIT | **Risk**: medium
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-providers.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A2
  - **Issue**: Dynamic key access with assertion (L265–316)
  - **Fix**: Use typed accessor function or discriminated config object
  - **Tests**: verify-existing
  - **Verify**: Provider env access is type-safe

- [ ] **9.1.8** Document `as unknown as Parameters<...>` react-hook-form workaround

  - **Type**: EDIT | **Risk**: low
  - **Paths**: `templates/hair-salon/components/ContactForm.tsx`, `templates/hair-salon/features/booking/components/BookingForm.tsx`, `templates/plumber/components/ContactForm.tsx`, `templates/plumber/features/booking/components/BookingForm.tsx`
  - **Governance**: none
  - **Issue**: Required for react-hook-form/Zod resolver type compatibility
  - **Action**: Add JSDoc comment explaining why the assertion is necessary; track for removal when react-hook-form v8 releases
  - **Tests**: none
  - **Verify**: Comment explains the workaround

### 9.2 Replace Magic Numbers with Named Constants

- [x] **9.2.1** Replace HSTS `max-age=31536000` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/security-headers.ts` | **Governance**: `ai/security/security-standards.md` | **Fix**: `const HSTS_MAX_AGE_SECONDS = 31_536_000;` | **Tests**: verify-existing | **Verify**: Constant used

- [x] **9.2.2** Replace CSP `max-age=86400` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/csp.ts` | **Governance**: `ai/security/security-standards.md` | **Fix**: `const CSP_REPORT_MAX_AGE_SECONDS = 86_400;` | **Tests**: verify-existing | **Verify**: Constant used

- [x] **9.2.3** Replace booking date range `90` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-schema.ts`, `templates/plumber/features/booking/lib/booking-schema.ts` | **Governance**: none | **Fix**: `const MAX_BOOKING_DAYS_AHEAD = 90;` | **Tests**: verify-existing | **Verify**: Constant used

- [x] **9.2.4** Replace nonce length check duplication ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/csp.ts` | **Governance**: none | **Issue**: `nonce.length < 16` duplicates `NONCE_BYTE_LENGTH = 16` | **Fix**: Use `NONCE_BYTE_LENGTH` constant consistently | **Tests**: verify-existing | **Verify**: Single source of truth

### 9.3 Remove Dead Code & Commented Code

- [x] **9.3.1** Remove all commented-out analytics code from BookingForm ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/components/BookingForm.tsx`, `templates/plumber/features/booking/components/BookingForm.tsx` | **Governance**: none | **Issue**: 5 blocks of commented `trackBookingEvent` calls (L24, L70–76, L95–102, L107–111, L119–123) | **Tests**: verify-existing | **Verify**: No commented code in BookingForm

- [x] **9.3.2** Remove commented Zod schema in booking-providers.ts — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-providers.ts` | **Governance**: none | **Issue**: Dead reference code (L4–13) | **Tests**: verify-existing | **Verify**: No commented schemas _(completed 2026-02-14: removed dead providerConfigSchema JSDoc comment from both templates)_

- [ ] **9.3.3** Replace `legacyRateLimit.checkRateLimit` with modern `limitByIp`/`limitByEmail` — **Type**: EDIT | **Risk**: medium | **Path**: `packages/infra/security/rate-limit.ts` | **Governance**: none | **Issue**: Legacy wrapper still used (L513) | **Tests**: verify-existing + update rate limit tests | **Verify**: No `legacyRateLimit` references remain

- [ ] **9.3.4** Remove or mark 12 deprecated exports across codebase — **Type**: MULTI_FILE | **Risk**: low | **Governance**: none | **Action**: Add `@deprecated` JSDoc tag on all deprecated exports | **Tests**: verify-existing | **Verify**: `pnpm lint` with `@typescript-eslint/no-deprecated` rule catches usage

- [ ] **9.3.5** Fix `bookingProviders` eager export triggering env validation at import time — **Type**: EDIT | **Risk**: medium | **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-providers.ts` | **Governance**: none | **Issue**: Module-level export eagerly validates env (L407) | **Fix**: Lazy-initialize via function call | **Tests**: verify-existing | **Verify**: Build succeeds without booking env vars set

### 9.4 Replace Direct `process.env` Access

- [ ] **9.4.1** Replace raw `process.env` access with validated env

  - **Type**: MULTI_FILE | **Risk**: medium
  - **Paths**: `templates/hair-salon/lib/actions/submit.ts`, `templates/hair-salon/features/analytics/`, `templates/hair-salon/site.config.ts`, `templates/plumber/lib/actions/submit.ts`, `templates/plumber/features/analytics/`, `templates/plumber/site.config.ts`, `packages/infra/logger/`, `packages/integrations/supabase/`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4 (FORBIDDEN: No direct env access outside schema)
  - **Issue**: Bypasses env validation — runtime errors instead of startup errors
  - **Tests**: verify-existing
  - **Verify**: `grep -r "process\.env\." --include="*.ts"` only in env schema files and `next.config.js`

### 9.5 Replace `console.*` with Structured Logger

- [ ] **9.5.1** Replace remaining `console.*` calls

  - **Type**: MULTI_FILE | **Risk**: low
  - **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/hair-salon/features/booking/lib/booking-schema.ts`, `templates/hair-salon/features/blog/lib/blog.ts`, `templates/hair-salon/lib/env.public.ts`, `templates/plumber/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-schema.ts`, `templates/plumber/features/blog/lib/blog.ts`, `templates/plumber/lib/env.public.ts`, `packages/infra/security/rate-limit.ts`
  - **Governance**: `ai/AGENT_SYSTEM.md` §A4, `ai/security/security-standards.md` §Logging
  - **Issue**: Raw console calls bypass structured logging — no PII redaction, no log levels
  - **Tests**: verify-existing
  - **Verify**: `grep -r "console\.\(log\|warn\|error\|info\)" --include="*.ts"` returns 0 results in `templates/` and `packages/`

### 9.6 Code Structure Improvements

- [ ] **9.6.1** Split `lib/actions/helpers.ts` into focused modules — **Type**: MOVE | **Risk**: medium | **Paths**: `templates/hair-salon/lib/actions/helpers.ts`, `templates/plumber/lib/actions/helpers.ts` | **Governance**: none | **Issue**: 12 exports, too many responsibilities | **Fix**: Split into `security.ts`, `formatting.ts`, `contact-builder.ts` | **Affects**: All files importing from `helpers.ts` | **Tests**: verify-existing | **Verify**: All imports updated; `pnpm build` passes

- [ ] **9.6.2** Extract shared env schema validation helper — **Type**: CREATE | **Risk**: medium | **Path**: `packages/infra/env/schema-helper.ts` | **Governance**: none | **Issue**: 7 env schema files repeat ~350 lines of duplication | **Fix**: Create `createEnvSchema()` factory | **Tests**: verify-existing | **Verify**: All 7 schema files use shared helper; `pnpm type-check` passes

- [ ] **9.6.3** Split `packages/infra/env/validate.ts` (402 lines) — **Type**: MOVE | **Risk**: medium | **Path**: `packages/infra/env/validate.ts` | **Governance**: none | **Fix**: Split into `compose.ts` and `validate.ts` | **Tests**: verify-existing | **Verify**: `pnpm type-check` passes

- [ ] **9.6.3b** Extract `processCspViolationReport` ternary chain — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/csp.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: Logic unchanged; readability improved

- [x] **9.6.4** Replace `.indexOf !== -1` with `.includes()` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Paths**: `packages/infra/security/security-headers.ts`, `packages/infra/security/sanitize.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: No `indexOf` in security files

- [x] **9.6.5** Deduplicate `SENSITIVE_KEYS` and `SENSITIVE_KEY_SUBSTRINGS` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/index.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: Single source of truth

- [ ] **9.6.6** Extract page content to data files — **Type**: MULTI_FILE | **Risk**: low | **Governance**: none | **Issue**: Pricing, team, services, gallery items hardcoded in JSX | **Fix**: Create `data/` directory per template | **Tests**: verify-existing | **Verify**: Content editable without touching components

- [ ] **9.6.7** Extract hardcoded phone number from booking page — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/app/book/page.tsx`, `templates/plumber/app/book/page.tsx` | **Governance**: none | **Fix**: Move to `site.config.ts` | **Tests**: verify-existing | **Verify**: Phone number configurable

- [ ] **9.6.8** Make static search entries derive from `siteConfig` — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/lib/search.ts`, `templates/plumber/lib/search.ts` | **Governance**: none | **Fix**: Generate from route manifest or siteConfig | **Tests**: verify-existing | **Verify**: Adding a new page auto-includes it in search

### 9.7 Performance Micro-Optimizations

- [x] **9.7.1** Fix O(n^2) string concatenation in `encodeBase64()` ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/csp.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Fix**: `Array.from(bytes, b => String.fromCharCode(b)).join('')` | **Tests**: verify-existing | **Verify**: Functionally identical

- [x] **9.7.2** Convert `ALLOWED_HTML_TAGS` and `ALLOWED_HTML_ATTRIBUTES` from Array to Set ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/sanitize.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Tests**: verify-existing | **Verify**: Sanitization tests pass

- [ ] **9.7.3** Add `Map<slug, Post>` index for blog post lookup — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/blog/lib/blog.ts`, `templates/plumber/features/blog/lib/blog.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Fix**: Build `slugMap` once; O(1) lookup | **Tests**: verify-existing | **Verify**: Blog post detail pages load correctly

- [x] **9.7.4** Pre-compile `SENSITIVE_KEY_SUBSTRINGS` regex ✅ **COMPLETED 2026-02-14** — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/index.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Fix**: Pre-compile a single `RegExp` | **Tests**: verify-existing | **Verify**: PII redaction still works

- [ ] **9.7.5** Parallelize rate limit email + IP checks with `Promise.all` — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/rate-limit.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Tests**: verify-existing | **Verify**: Rate limiting still works

- [ ] **9.7.6** Pre-filter booking providers to only call enabled ones — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-providers.ts` | **Governance**: `ai/checklists/performance-checklist.md` | **Fix**: Filter `getEnabledProviders()` before calling | **Tests**: verify-existing | **Verify**: Disabled providers not called

### 9.8 Edge-Case Handling

- [ ] **9.8.1** Fix `SERVICE_LABELS[booking.data.serviceType]` for unknown keys — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts` | **Governance**: none | **Fix**: Fallback to raw value | **Tests**: create test — unknown service type displays gracefully | **Verify**: Unknown service types display gracefully

- [ ] **9.8.2** Fix `splitName('')` returning unexpected result — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/lib/actions/helpers.ts`, `templates/plumber/lib/actions/helpers.ts` | **Governance**: none | **Fix**: Return `{ firstName: 'Unknown', lastName: '' }` or throw | **Tests**: create test — empty string, single name, full name | **Verify**: Empty name handled gracefully

- [ ] **9.8.3** Guard `validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN` — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/hubspot/lib/hubspot-client.ts`, `templates/plumber/features/hubspot/lib/hubspot-client.ts` | **Governance**: `ai/security/security-standards.md` | **Fix**: Check token exists; throw clear error if missing | **Tests**: create test — missing token throws helpful error | **Verify**: No `Bearer undefined`

- [ ] **9.8.4** Handle `FormData.get()` returning `null` — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts` | **Governance**: none | **Fix**: Coerce `null` to `''` before Zod | **Tests**: create test — missing fields produce validation errors | **Verify**: Clear validation errors

- [ ] **9.8.5** Add try/catch around `getAllPosts()` and `getSearchIndex()` in layout — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/app/layout.tsx`, `templates/plumber/app/layout.tsx` | **Governance**: `ai/references/nextjs-god-tier.md` §9.1 | **Fix**: Wrap in try/catch; fall back to empty arrays | **Tests**: create test — layout renders when blog fails | **Verify**: Layout renders even if blog/search data loading fails

- [ ] **9.8.6** Improve error handling for silently swallowed errors — **Type**: MULTI_FILE | **Risk**: low | **Paths**: `packages/infra/logger/client.ts`, `packages/infra/sentry/client.ts`, `packages/infra/security/rate-limit.ts`, `templates/hair-salon/lib/actions/supabase.ts`, `templates/hair-salon/components/ErrorBoundary.tsx`, `templates/plumber/lib/actions/supabase.ts`, `templates/plumber/components/ErrorBoundary.tsx` | **Governance**: `ai/security/security-standards.md` §Logging | **Fix**: Replace `.catch(() => {})` with `.catch(err => logger.warn('...', { error: err }))` | **Tests**: verify-existing | **Verify**: Swallowed errors now produce log entries

- [ ] **9.8.7** Log booking provider fetch/parse errors centrally — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-providers.ts` | **Governance**: `ai/security/security-standards.md` §Logging | **Tests**: verify-existing | **Verify**: Provider failures appear in logs

### 9.9 Test Quality Improvements

- [ ] **9.9.1** Convert test files from `require()` to `import` — **Type**: EDIT | **Risk**: low | **Governance**: `ai/testing/test-patterns.md` | **Paths**: All 8 test files using `require()` | **Tests**: verify-existing | **Verify**: Tests still pass; no CJS in TS test files

- [x] **9.9.2** Convert `module.exports` to `export` in env-setup files — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/env-setup.ts`, `templates/plumber/env-setup.ts` | **Governance**: `ai/testing/test-patterns.md` | **Tests**: verify-existing | **Verify**: Tests still pass _(completed 2026-02-14: CANNOT convert — these files are Jest setupFiles loaded in CJS mode. module.exports is required. Added clarifying comment instead.)_

- [ ] **9.9.3** Reduce file system test brittleness — **Type**: EDIT | **Risk**: medium | **Paths**: `templates/hair-salon/lib/__tests__/search.test.ts`, `templates/hair-salon/features/blog/__tests__/blog.test.ts`, `templates/plumber/lib/__tests__/search.test.ts`, `templates/plumber/features/blog/__tests__/blog.test.ts` | **Governance**: `ai/testing/test-patterns.md` §Mocking Policy | **Fix**: Use virtual file system mock or fixture directory | **Tests**: verify-existing | **Verify**: Tests pass regardless of working directory

---

## Sprint 10 — Observability & Tracing Enhancement

**Goal**: Full observability pipeline — logs, traces, error correlation.
**Estimated effort**: 1–2 weeks
**Depends on**: Sprint 1 (Sentry configured)
**Sprint governance**: `ai/security/security-standards.md` §Logging, `ai/references/nextjs-god-tier.md` §6 (after() API for background tasks)

### 10.1 Sentry Enhancement

- [ ] **10.1.1** Add Sentry release tagging — **Type**: EDIT | **Risk**: low | **Governance**: `ai/security/security-standards.md` §Logging | **Fix**: Set `release: process.env.VERCEL_GIT_COMMIT_SHA` | **Tests**: none | **Verify**: Sentry dashboard shows releases

- [ ] **10.1.2** Add Sentry environment filtering — **Type**: EDIT | **Risk**: low | **Governance**: `ai/security/security-standards.md` §Logging | **Tests**: none | **Verify**: Sentry dashboard filters by environment

- [ ] **10.1.3** Create `sentry.edge.config.ts` — **Type**: CREATE | **Risk**: low | **Paths**: `templates/hair-salon/sentry.edge.config.ts`, `templates/plumber/sentry.edge.config.ts` | **Governance**: `ai/references/nextjs-god-tier.md` §5 | **Tests**: none | **Verify**: Middleware errors captured

- [ ] **10.1.4** Create `instrumentation.ts` — **Type**: CREATE | **Risk**: low | **Paths**: `templates/hair-salon/instrumentation.ts`, `templates/plumber/instrumentation.ts` | **Governance**: `ai/references/nextjs-god-tier.md` §5 | **Tests**: none | **Verify**: Server-side performance data flows to Sentry

### 10.2 Distributed Tracing

- [ ] **10.2.1** Add `withServerSpan` to booking flow — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-actions.ts` | **Governance**: `ai/references/nextjs-god-tier.md` §6 (use `after()` for non-blocking logging) | **Tests**: verify-existing | **Verify**: Booking operations appear as spans

- [ ] **10.2.2** Add tracing spans to middleware — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/create-middleware.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: Middleware appears in transaction waterfall

- [ ] **10.2.3** Add tracing to blog/search data loading — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/blog/lib/blog.ts`, `templates/hair-salon/lib/search.ts`, `templates/plumber/features/blog/lib/blog.ts`, `templates/plumber/lib/search.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: Blog/search operations appear in traces

- [ ] **10.2.4** Add tracing to rate limit checks — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/security/rate-limit.ts` | **Governance**: none | **Tests**: verify-existing | **Verify**: Rate limit operations appear in traces

### 10.3 Logger Enhancement

- [ ] **10.3.1** Add `debug` log level — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/index.ts` | **Governance**: `ai/security/security-standards.md` §Logging | **Tests**: create test — debug only outputs when `LOG_LEVEL=debug` | **Verify**: `logger.debug()` available

- [ ] **10.3.2** Add log correlation with Sentry trace IDs — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/index.ts` | **Governance**: `ai/security/security-standards.md` §Logging | **Fix**: Include `Sentry.getActiveSpan()?.traceId` in log context | **Tests**: create test — trace ID present when span active | **Verify**: Log entries include trace ID

- [ ] **10.3.3** Add structured error codes — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/index.ts` | **Governance**: `ai/security/security-standards.md` §Logging | **Fix**: Add optional `code` field (e.g., `'RATE_LIMIT_EXCEEDED'`) | **Tests**: create test — error codes appear in log output | **Verify**: Error logs include machine-readable codes

### 10.4 Booking Analytics

- [ ] **10.4.1** Implement booking analytics tracking — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/components/BookingForm.tsx`, `templates/plumber/features/booking/components/BookingForm.tsx` | **Governance**: none | **Depends on**: 3.4.1 (analytics package) | **Tests**: verify-existing | **Verify**: Booking funnel events tracked

### 10.5 CSP Reporting

- [ ] **10.5.1** Configure CSP report endpoint — **Type**: EDIT | **Risk**: medium | **Paths**: `templates/hair-salon/middleware.ts`, `templates/plumber/middleware.ts`, `packages/infra/security/csp.ts` | **Governance**: `ai/security/security-standards.md` §CSP, `ai/references/nextjs-god-tier.md` §5.6 | **Fix**: Add `cspReportEndpoint` option pointing to `/api/csp-report` or Sentry CSP endpoint | **Tests**: create test — CSP violation report received and logged | **Verify**: CSP violations are reported and logged

---

## Sprint 11 — JSDoc & Internal Documentation

**Goal**: Ensure every exported function has JSDoc. Remove stale documentation references.
**Estimated effort**: 3–5 days
**Depends on**: Sprint 9 (code is clean and well-structured)
**Sprint governance**: `ai/AGENT_SYSTEM.md` §E (documentation)

### 11.1 `packages/infra` Documentation

- [ ] **11.1.1** Add function-level JSDoc to all logger exports — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/logger/` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All exported functions have JSDoc

- [ ] **11.1.2** Add function-level JSDoc to all Sentry module exports — **Type**: EDIT | **Risk**: low | **Path**: `packages/infra/sentry/*.ts` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All exported functions have JSDoc

### 11.2 Template Code Documentation

- [ ] **11.2.1** Add JSDoc to `lib/actions/helpers.ts` — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/lib/actions/helpers.ts`, `templates/plumber/lib/actions/helpers.ts` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All 12 exports have JSDoc

- [ ] **11.2.2** Add JSDoc to booking actions and providers — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/features/booking/lib/booking-actions.ts`, `templates/hair-salon/features/booking/lib/booking-providers.ts`, `templates/plumber/features/booking/lib/booking-actions.ts`, `templates/plumber/features/booking/lib/booking-providers.ts` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All exported functions have JSDoc

- [ ] **11.2.3** Add JSDoc to page components — **Type**: EDIT | **Risk**: low | **Paths**: `templates/hair-salon/components/Hero.tsx`, `templates/hair-salon/components/ValueProps.tsx`, `templates/hair-salon/components/SocialProof.tsx`, `templates/hair-salon/components/Footer.tsx`, `templates/plumber/components/Hero.tsx`, `templates/plumber/components/ValueProps.tsx`, `templates/plumber/components/SocialProof.tsx`, `templates/plumber/components/Footer.tsx` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All components have JSDoc

- [ ] **11.2.4** Add JSDoc to `@repo/ui` component props — **Type**: EDIT | **Risk**: low | **Path**: `packages/ui/src/components/` | **Governance**: `ai/AGENT_SYSTEM.md` §E | **Tests**: none | **Verify**: All component props interfaces have JSDoc descriptions

### 11.3 UI Consistency Documentation

- [ ] **11.3.1** Document which components should use `@repo/ui` primitives

  - **Type**: CREATE
  - **Risk**: low
  - **Path**: `docs/UI_MIGRATION.md`
  - **Governance**: `ai/design/design-system.md`
  - **Issue**: Several template components use raw HTML instead of `@repo/ui` equivalents:
    - `Footer` doesn't use `Container`
    - `Breadcrumbs` doesn't use `Container`
    - `ErrorBoundary` uses custom buttons instead of `@repo/ui` Button
    - `SkipToContent` has hardcoded blue focus styles instead of design tokens
    - `SearchDialog` uses raw `<input>` instead of `@repo/ui` Input
    - `SearchPage` doesn't use layout primitives; has hardcoded colors
    - `BookingForm` duplicates label pattern
    - `Accordion` has hardcoded `max-h-96`
    - `Textarea` has hardcoded `min-h-[80px]`
  - **Tests**: none
  - **Verify**: Document exists and lists all components needing migration

---

## Backlog — Future Enhancements

**Do not build until demonstrated need.**

### Infrastructure & Tooling

- [ ] **B.1** i18n — next-intl, hreflang — **Trigger**: Client needs multi-language | **Type**: CREATE | **Risk**: high | **Governance**: `ai/references/nextjs-god-tier.md`
- [ ] **B.2** CMS integration — Sanity, Storyblok, Payload — **Trigger**: Client needs content editing | **Type**: CREATE | **Risk**: high | **Governance**: `ai/patterns/integration-adapter-pattern.md`
- [ ] **B.3** AI chatbot — **Trigger**: Client requests | **Type**: CREATE | **Risk**: medium
- [ ] **B.4** A/B testing — **Trigger**: Data-driven optimization | **Type**: CREATE | **Risk**: medium
- [ ] **B.5** CLI (`pnpm create:client`) — **Trigger**: 10+ client sites | **Type**: CREATE | **Risk**: medium
- [ ] **B.6** Biome migration (replace ESLint + Prettier) — **Trigger**: DX sprint; 10-100x faster linting | **Type**: MULTI_FILE | **Risk**: high
- [ ] **B.7** Storybook or component showcase — **Trigger**: Team grows beyond 2-3 developers | **Type**: CREATE | **Risk**: medium | **Governance**: `ai/design/design-system.md`

### Architecture & Extensibility

- [ ] **B.8** Feature flag/plugin registry — **Trigger**: 5+ feature packages | **Type**: CREATE | **Risk**: high | **Governance**: `ai/decisions/001-architecture-decisions.md`
- [ ] **B.9** Kubernetes manifests, Helm charts — **Trigger**: K8s deployment needed | **Type**: CREATE | **Risk**: high
- [ ] **B.10** Circuit breaker for HubSpot API — **Trigger**: HubSpot outages causing cascading failures | **Type**: CREATE | **Risk**: medium | **Governance**: `ai/patterns/integration-adapter-pattern.md`
- [ ] **B.11** Feature flags without redeploy — **Trigger**: Frequent feature toggling | **Type**: CREATE | **Risk**: medium
- [ ] **B.12** Reduce blog → search → layout coupling — **Trigger**: Client doesn't need blog | **Type**: EDIT | **Risk**: medium
- [ ] **B.13** Provider service maps as configurable data — **Trigger**: New booking provider | **Type**: EDIT | **Risk**: low

### Observability (Advanced)

- [ ] **B.14** BetterStack for log aggregation — **Trigger**: Log volume exceeds Sentry budget | **Type**: CREATE | **Risk**: medium
- [ ] **B.15** Client-side performance tracing — **Trigger**: Client-side perf issues | **Type**: CREATE | **Risk**: medium
- [ ] **B.16** Log volume controls and sampling — **Trigger**: Log costs significant | **Type**: EDIT | **Risk**: low
- [ ] **B.17** CI failure notifications beyond GitHub defaults — **Trigger**: Team needs Slack/email alerts | **Type**: CREATE | **Risk**: low
- [ ] **B.18** Multi-Node CI matrix — **Trigger**: Supporting multiple Node.js versions | **Type**: EDIT | **Risk**: low

### Performance (Advanced)

- [ ] **B.19** `compress: false` when behind CDN — **Trigger**: Deploying behind CDN | **Type**: EDIT | **Risk**: low | **Governance**: `ai/references/nextjs-god-tier.md`
- [ ] **B.20** Cache `buildHubSpotHeaders()` per-call — **Trigger**: HubSpot perf optimization | **Type**: EDIT | **Risk**: low
- [ ] **B.21** Add `@repo/infra` and `@repo/shared` to `transpilePackages` — **Trigger**: Build perf optimization | **Type**: EDIT | **Risk**: low
- [ ] **B.22** `/search` `force-static` may be overridden by layout `headers()` — investigate after 8.2.1 | **Type**: RUN | **Risk**: low

### DevOps & CI/CD (Advanced)

- [ ] **B.23** Add CD (deployment) step to CI pipeline — **Trigger**: Ready for automated deployments | **Type**: CREATE | **Risk**: medium
- [ ] **B.24** Standardize package source directory structure (`src/` vs root) — **Trigger**: DX consistency sprint | **Type**: MULTI_FILE | **Risk**: medium
- [ ] **B.25** Co-locate env schemas with integration packages — **Trigger**: 5+ integration packages | **Type**: MOVE | **Risk**: medium

### Next.js 16 Migration (NEW — from God Tier Reference)

- [ ] **B.26** Migrate `middleware.ts` → `proxy.ts` — **Trigger**: Next.js 16 upgrade (Sprint 5.9.1 go decision) | **Type**: MOVE | **Risk**: medium | **Governance**: `ai/references/nextjs-god-tier.md` §1.3
- [ ] **B.27** Enable React Compiler — **Trigger**: Next.js 16 upgrade | **Type**: EDIT | **Risk**: low | **Governance**: `ai/references/nextjs-god-tier.md` §8 | **Note**: Removes need for manual `useMemo`/`useCallback`
- [ ] **B.28** Enable Partial Prerendering / Cache Components — **Trigger**: Next.js 16 upgrade | **Type**: EDIT | **Risk**: medium | **Governance**: `ai/references/nextjs-god-tier.md` §4.3
- [ ] **B.29** Adopt `after()` API for background tasks in server actions — **Trigger**: Next.js 15.1+ confirmed | **Type**: EDIT | **Risk**: low | **Governance**: `ai/references/nextjs-god-tier.md` §6 | **Note**: Use for analytics logging, email notifications, audit trails without blocking response

---

## Progress Tracking

| Sprint  | Description                        | Tasks |   Status    |
| :-----: | ---------------------------------- | :---: | :---------: |
|    0    | Unblock CI & Critical Fixes        |  13   |   6 done    |
|    1    | Security Hardening & Missing Infra |  30   |   14 done   |
|    2    | Package Quality & Boundaries       |  30   |   20 done   |
|    3    | Complete Existing Extractions      |   9   | Not started |
|    4    | Architecture Evolution             |   8   | Not started |
|    5    | Major Dependency Upgrades          |  17   | Not started |
|    6    | UI Component Library               |  30+  | Not started |
|    7    | Feature Packages                   |  10   | Not started |
|    8    | Production Readiness               |  30   |   1 done    |
|    9    | Code Quality Sweep                 |  45   |   13 done   |
|   10    | Observability & Tracing            |  14   | Not started |
|   11    | JSDoc & Documentation              |   8   | Not started |
| Backlog | Future Enhancements                |  29   |  As needed  |

---

## Task Format Reference (for AI Agents)

Each executable task follows this enhanced structure:

```
- [ ] **Task ID** Task title

  - **Type**: EDIT | CREATE | DELETE | RUN | MULTI_FILE | MOVE
  - **Risk**: low | medium | high
  - **Paths**: explicit file paths (no wildcards when <3 files)
  - **Governance**: applicable ai/ documents to read BEFORE executing
  - **Depends on**: Task IDs or "none"
  - **Requires**: pre-conditions (installed packages, existing files, env state)
  - **Issue**: what's wrong (if applicable)
  - **Fix** / **Action** / **Code**: what to change
  - **Steps**: numbered sub-operations (for MULTI_FILE and complex tasks)
  - **Affects**: files/tests/packages that may break as a side effect
  - **Tests**: none | verify-existing | create <path> covering [scenarios] | update <path>
  - **Verify**: commands to run — all must exit 0
  - **Boundary**: what NOT to change (for EDIT tasks where scope is critical)
```

**Type definitions**:

| Type         | Description                      | Rules                                                            |
| ------------ | -------------------------------- | ---------------------------------------------------------------- |
| `EDIT`       | Modify existing file             | Only change described region. Do not reformat surrounding code.  |
| `CREATE`     | Create new file                  | Ensure parent dirs exist. Use exact content specified.           |
| `DELETE`     | Remove file or code block        | Update all imports referencing deleted code.                     |
| `RUN`        | Execute shell command            | Capture output. Only proceed if exit 0.                          |
| `MULTI_FILE` | Coordinated changes across files | Execute Steps in order. Verify after each if indicated.          |
| `MOVE`       | Relocate code between files      | Copy first, update imports, verify builds, then delete original. |

**Risk definitions**:

| Risk     | Scope                                          | Agent behavior                                             |
| -------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `low`    | Single line/config, no behavioral change       | Execute directly                                           |
| `medium` | Multi-file or behavioral change                | Read all affected files first, verify after                |
| `high`   | Architecture, breaking changes, data loss risk | Read all files, execute step by step, verify between steps |

**Verification types**:

- `pnpm build` / `pnpm test` / `pnpm type-check` / `pnpm lint`
- Create unit test at `path` testing X
- Manual check: Y
- Lighthouse score Z

**Sprint execution order**: 0 → 1 → 2 (parallel with 1) → 3 → 4 → 5 (can overlap 4) → 6 (parallel with 3-5) → 7 → 8 → 9 (can overlap 8) → 10 (depends on 1) → 11 (depends on 9)
