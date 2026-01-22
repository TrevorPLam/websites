# P2TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-22
Task Truth Source: **P2TODO.md**
Other Priority Files: `P0TODO.md`, `P1TODO.md`, `P3TODO.md`

This file is the single source of truth for P2 actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (from chat)
- Site: High-performance marketing site for "Your Dedicated Marketer"
- Hosting: Cloudflare Pages (GitHub integration)
- Standard: Diamond Standard (performance, accessibility, observability, testing)
- Keep: Sentry, PWA, Search
- Contact flow: Store lead in Supabase (server-only) + sync to HubSpot CRM
- No email sending
- Save suspicious submissions but flag them (suspicious = too many requests)
- Required fields: Name, Email, Phone
- UX: Return success even if HubSpot sync fails (best-effort)

## Task Schema (Required)
- **ID**: `T-###` (unique, sequential)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `SECURITY | RELEASE | DEPENDENCY | DOCS | QUALITY | BUG | FEATURE | CHORE`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW | DONE`
- **Blockers**: `None` or a short description of what prevents progress
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist (broken into subtasks T-###.#)
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `XS | S | M | L | XL` (XS = < 30 min, S = < 2 hr, M = < 4 hr, L = < 1 day, XL = > 1 day)

### Priority Meaning
- **P0**: BLOCKS BUILD or causes security/data loss — fix immediately
- **P1**: High impact; do within 7 days
- **P2**: Important but not urgent; do within 30 days
- **P3**: Backlog/tech debt; do when convenient

### Ownership Rule
- **Owner: AGENT** — task can be executed by Codex/Claude Code/Copilot in-repo
- **Owner: Trevor** — requires external actions (provider dashboards, DNS, billing, approvals)

## Task Assessment Notes (2026-01-21)
- Reviewed existing tasks (T-080 through T-107); priorities align with release blockers and lead-capture requirements, so no priority corrections were required.
- Added audit-derived tasks from `WRONG.md` with priorities mapped to the audit severity: CRITICAL → P0, HIGH/MAJOR → P1, MEDIUM → P2, MINOR/DEAD-CODE → P3.

## Prompt Scaffold (Required for AGENT-owned tasks in this file)
Prompt Scaffold (Required for AGENT-owned tasks)
Role: Who the agent should act as (e.g., senior engineer, docs editor).
Goal: What “done” means in one sentence.
Non-Goals: Explicit exclusions to prevent scope creep.
Context: Relevant files, prior decisions, and why the task exists.
Constraints: Tooling, style, security, and architecture rules to follow.
Examples: Expected input/output or format examples when applicable.
Validation: Exact verification steps (tests, lint, build, manual checks).
Output Format: Required response format or artifacts.
Uncertainty: If details are missing, mark UNKNOWN and cite what was checked.

Task Prompt Template (paste into each task)
Role:
Goal:
Non-Goals:
Context:
Constraints:
Examples:
Validation:
Output Format:
Uncertainty:

---

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed; npm registry access is blocked (403) in this environment, so `npm install -g lighthouse` fails.
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
Acceptance Criteria:
- [x] T-058.1: Add a local Lighthouse config and script
- [ ] T-058.2: Capture baseline metrics for mobile (home/services/pricing/contact)
- [x] T-058.3: Define budgets as regression guards (not arbitrary hard fails)
- [x] T-058.4: Document targets in `/docs/OBSERVABILITY.md`
References:
- /docs/OBSERVABILITY.md
- /package.json
Dependencies: None
Effort: M

### T-070: Monitor and fix transitive build-tool vulnerabilities
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates; npm registry access in this environment returns 403 (confirmed via `npm view` and `scripts/npm-registry-check.mjs`, 2026-01-20).
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
- [x] T-070.3: Run `npm run check:npm-registry` and record the registry access result
References:
- /package.json
Dependencies: None
Effort: S

### T-101: Performance verification baseline (Lighthouse)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: BLOCKED
Blockers: T-058 is BLOCKED (Lighthouse CLI not installed).
Context:
- Capture baseline metrics for key pages
Acceptance Criteria:
- [ ] T-101.1: Run Lighthouse on Home and Contact (mobile)
- [ ] T-101.2: Record Performance/Accessibility/SEO scores in /docs/OBSERVABILITY.md
- [ ] T-101.3: Note top offenders for follow-up fixes
References:
- /docs/OBSERVABILITY.md
Dependencies: T-058
Effort: XS

### T-102: Accessibility validation (keyboard + focus)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: DONE
Blockers: None
Completed: 2026-01-11
Context:
- Confirm no obvious accessibility blockers before scaling
Acceptance Criteria:
- [x] T-102.1: Keyboard-only test (nav, menu, contact form)
- [x] T-102.2: Confirm focus visibility and order
- [x] T-102.3: Record results in /docs/ACCESSIBILITY.md
References:
- /docs/ACCESSIBILITY.md
- /components/Navigation.tsx
Dependencies: None
Effort: XS

### T-130: Fix blog structured data image references
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-016 indicates structured data points to non-existent images.
- Invalid image URLs reduce SEO quality.
Acceptance Criteria:
- [ ] T-130.1: Ensure structured data uses existing image assets or omit image when unavailable.
- [ ] T-130.2: Add tests or build checks to catch missing image references.
References:
- /components/BlogPostContent.tsx
- /WRONG.md
Dependencies: None
Effort: S

### T-131: Correct IP hashing + empty IP handling
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-017/018 identify wrong salt variable usage and empty IP handling.
- IP hashing should be deterministic and safe.
Acceptance Criteria:
- [ ] T-131.1: Fix salt variable usage in IP hashing.
- [ ] T-131.2: Handle empty IP strings without returning misleading `unknown`.
- [ ] T-131.3: Add tests for empty/invalid IP inputs.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-132: Introduce typed identifiers for email/IP rate limits
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags primitive string identifiers for email/IP (risk of mix-ups).
- Typed identifiers improve clarity and safety.
Acceptance Criteria:
- [ ] T-132.1: Add branded types or wrapper helpers for email/IP identifiers.
- [ ] T-132.2: Update rate limit checks to use the new types/helpers.
- [ ] T-132.3: Add tests covering identifier creation and usage.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: T-118
Effort: S

_Completed (moved to TODOCOMPLETED.md on 2026-01-21): T-112, T-128, T-129, T-133._
_Completed (moved to TODOCOMPLETED.md on 2026-01-20): T-108, T-109._
