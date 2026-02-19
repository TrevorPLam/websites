---
last_updated: 2026-02-14
status: evaluation
owner: engineering
summary: Next.js 16 migration readiness assessment (go/no-go) for marketing-websites monorepo.
---

# Next.js 16 Migration Evaluation

## Executive Summary (Decision)

**Recommendation:** Conditional GO (pilot) once readiness checklist below is satisfied. No hard blockers found; main
risks are async Request API audits, Turbopack production parity, and cache model changes. Keep rollout behind branch
and preview gates; defer default switch until pilot success.

## Scope & Evidence

- Current version: Next.js 15.5.12 (Maintenance LTS) @ `clients/starter-template` (app router).
- Node engines: `>=22.0.0` (meets Next 16 requirement ≥18.17).
- Tooling: Turborepo 2.8.9, Tailwind v4 migrated, React 19 already in catalog, TypeScript 5.7.
- No custom webpack overrides; `next.config.js` minimal (standalone output, transpilePackages, poweredByHeader:
  false).
- Request APIs: sampled usages already `await headers()` in server components (e.g., booking actions, layout),
  aligning with Next 16 async requirement.

## Key Changes in Next.js 16 (2026 context)

- **Turbopack default** for `next dev` and `next build`; webpack fallback retained but discouraged.
- **Async Request APIs enforced** (`headers`, `cookies`, `params`, `searchParams`); sync access removed.
- **Cache model updates** (route/data caches; `cacheComponents`, `use cache`); invalidations more explicit.
- **`next lint` removed**; must use ESLint CLI (already enforced via pnpm scripts).
- **Image & routing tweaks**: stricter `next/image` prop validation; parallel/route groups unaffected if standard
  patterns are used.

## Compatibility Assessment

- **Runtime/Platform:** Node 22 LTS compliant. No custom server/edge runtime code detected beyond middleware + CSP.
- **Build/Transpile:** `transpilePackages` list explicit; verify it matches any new packages post-migration. No custom
  webpack = low friction for Turbopack.
- **Request APIs:** Need full audit to confirm no sync usages remain (search for `UnsafeUnwrappedHeaders`,
  `headers()` without await, `cookies()` sync).
- **ESLint/Linting:** Already CLI-based; no action required when `next lint` disappears.
- **Cache/ISR:** Uses `revalidatePath` in booking actions; no custom data cache hooks. Should review any `fetch`
  caching semantics after upgrade.
- **Images/Fonts:** Uses `next/font` (Inter, IBM Plex) and no custom `next/image` configs; low risk.
- **Third-party:** Sentry (@sentry/nextjs) compatible with Next 16 (10.38.0 supports 15/16). Re-verify after
  upgrade.

## Risks & Mitigations

- **Turbopack parity gaps:**
  - Mitigation: add `NEXT_TELEMETRY_DISABLED=1` for consistent builds; run `next build --turbo` and compare
    outputs; keep `TURBOPACK=0` fallback for CI until parity proven.
- **Async Request API regressions:**
  - Mitigation: repo-wide codemod/search to enforce `await headers()/cookies()`; add ESLint rule
    (`no-restricted-imports` with fixer) or TS lint for `UnsafeUnwrappedHeaders` markers.
- **Cache semantics changes:**
  - Mitigation: document cache expectations; add tests around ISR/`revalidatePath` flows
    (booking/OG routes/sitemap).
- **Performance variance:**
  - Mitigation: run Lighthouse/INP baseline pre/post (ties to Task 0.6); enable `@next/bundle-analyzer` during
    pilot to detect size drift.
- **CI stability:**
  - Mitigation: pin `next@16.x` via catalog; run full pipeline with `--filter="...[origin/main]"` and one full run
    nightly.

## Readiness Checklist (must-pass before upgrade PR)

1. ✅ Node engines align (>=22).
2. 🔲 Repo-wide audit: no sync `headers/cookies/params/searchParams`; zero `UnsafeUnwrappedHeaders`.
3. 🔲 Turbopack parity: `next build --turbo` succeeds; compare bundle size/timings vs webpack baseline.
4. 🔲 Performance baseline captured (Task 0.6) and compared post-upgrade.
5. 🔲 Sentry smoke test (client + server) on preview; error events received.
6. 🔲 Cache behavior verified for ISR routes (sitemap, robots, OG image) and `revalidatePath` flows (booking).
7. 🔲 CI green (lint, type-check, test, build) with Next 16; no new boundary violations.

## Upgrade Plan (pilot-first)

1. Create feature branch `upgrade/next16` and pin `next` (catalog: latest 16.x) plus align `@types/react` if
   required.
2. Run Next codemod for async headers/cookies; manually fix remaining sites.
3. Execute full pipeline: `pnpm turbo lint type-check test build --filter="...[origin/main]"`; add `TURBOPACK=0`
   fallback if needed.
4. Run `next build --turbo` and preview deploy; validate pages (home, services, book, blog, api/og, sitemap,
   robots).
5. Capture Lighthouse/INP metrics pre/post; track bundle analyzer diff.
6. Verify Sentry plus CSP nonce and middleware still working.
7. If parity confirmed, enable Turbopack in CI; otherwise keep webpack fallback while on Next 16.
8. Document outcomes in this file and in release notes.

## Go/No-Go Decision Framework

- **GO (pilot):** All checklist items met; no P0 regressions; perf within ±5% or better; Sentry plus CSP validated.
- **NO-GO:** Any build breaks without feasible workaround, Turbopack parity gaps affecting prod routes, or INP/LCP
  regressions beyond budgets.

## Post-Migration Actions

- Freeze webpack fallback when Turbopack parity proven; remove temporary flags.
- Add guardrail lint for async Request API usage to prevent regressions.
- Update docs/ci required-checks to note Next 16 baseline; add troubleshooting for Turbopack cache issues.
- Monitor OWASP 2027 items: ensure SSRF protections unchanged, CSP nonce intact, dependency scan passes.
