# PROJECT_STATUS.md — Working Status & Decisions

Document Type: Operations
Canonical Status: Canonical
Owner: Trevor
Audience: Humans + agents
Last Updated: 2026-01-21

## Purpose
A lightweight place to record the current state of the project, major decisions, and open questions.
This is not a task list; tasks belong in `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md`.

## Current snapshot
- Phase: Phase 0 Complete / Ready for Phase 1 (Lead Capture)
- Environment: Next.js 15.5.2 (Downgraded from 16), Cloudflare Pages Adapter Installed.
- Last known “green” state (commit/tag): T-052 completion (Pages build passes locally).
- Key risks: 
    - Next.js 15.x lock-in: `@cloudflare/next-on-pages` has peer dependency conflicts with Next.js 16.
    - Edge Runtime limitations: `fs` usage required explicitly marking some routes as `force-static`.
- Testing posture: Added E2E coverage for contact submission success, rate limiting, and search empty state; configured Vitest coverage thresholds.
- Testing posture (open): Lighthouse mobile baselines remain blocked locally because npm registry access returns 403 in this environment.
- Legal: Placeholder privacy and terms pages now exist for launch readiness.
- Analytics: GA4 script injection and contact form conversion tracking are wired (env + consent gated).
- Audit intake: WRONG.md audit issues have been translated into actionable TODO tasks with priority mapping (critical → P0, major → P1, medium → P2, minor/dead-code → P3).

## Decisions (append-only)
Use this format:

- Date: 2026-01-22
  - Decision: Documentation governance structure verified and archive organized
  - Why: Ensure all open tasks from docs are integrated into P0-P3TODO.md and documentation is properly archived per governance standards
  - Alternatives considered: (N/A - this was an audit/verification task)
  - Trade-offs: None
  - Follow-up (task IDs in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md): T-145 (P3, inline TODO audit)

- Date: 2026-01-07
  - Decision: Downgrade to Next.js 15.5.2 and ESLint 9.
  - Why: `@cloudflare/next-on-pages` adapter did not strictly support Next.js 16, causing peer dependency install failures and runtime build issues.
  - Alternatives considered: Forcing peer deps (failed at runtime), Custom build adapter (too high effort).
  - Trade-offs: Cannot use Next.js 16 features until Cloudflare adapter updates.
  - Follow-up (task IDs in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md): None immediately, but monitor Cloudflare updates.

- Date: 2026-01-07
  - Decision: Use manual `archive/eslint.config.mjs` style configuration.
  - Why: The `next lint` CLI command was broken in the mixed version environment (Next 15 + new ESLint).
  - Alternatives considered: Fixing `next lint`.
  - Trade-offs: Usage of `eslint .` instead of `next lint` in scripts.

- Date: 2026-01-07
  - Decision: Mark `feed.xml` and `search` routes as `dynamic = 'force-static'`.
  - Why: They use `fs` (via `lib/blog.ts`) which is not available in the Cloudflare Edge Runtime unless pre-rendered at build time.
  - Follow-up (task IDs in P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md): N/A

## Open questions
- Q:
  - Context:
  - Needed input:
  - Task (BLOCKED) ID:

