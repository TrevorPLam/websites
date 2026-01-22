# P1TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **P1TODO.md**
Other Priority Files: `P0TODO.md`, `P2TODO.md`, `P3TODO.md`

This file is the single source of truth for P1 actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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

## 🟠 PHASE 1: Lead Capture Pipeline (Supabase + HubSpot) (P1)
> Replace email delivery with DB + CRM while preserving spam controls.

### T-080: Store leads in Supabase with suspicion metadata
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-12
Context:
- Replace email delivery with Supabase lead storage
- Must preserve current UX contract in `submitContactForm`
- Save suspicious submissions but flag them for later review
Acceptance Criteria:
- [ ] T-080.1: Insert lead into Supabase with `is_suspicious` + `suspicion_reason`
- [ ] T-080.2: Store submission metadata needed for downstream HubSpot sync
- [ ] T-080.3: Preserve current `submitContactForm` success/error UX contract
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-054, T-079
Effort: M

### T-081: Sync leads to HubSpot and record sync status
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Blockers: None (depends on T-080 implementation)
Completed: 2026-01-12
Context:
- Lead submissions should upsert into HubSpot CRM by email
- HubSpot failures must not break UX; retry should be possible
Acceptance Criteria:
- [ ] T-081.1: Upsert HubSpot contact by email and store HubSpot IDs in Supabase
- [ ] T-081.2: If HubSpot fails, return success and mark lead `hubspot_sync_status = 'needs_sync'`
- [ ] T-081.3: Store HubSpot sync attempt metadata for observability
References:
- /lib/actions.ts
- /lib/env.ts
Dependencies: T-055, T-080
Effort: M

### T-117: Harden HubSpot + Supabase response validation
Priority: P1
Type: BUG
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-21
Context:
- Audit BUG-006/007 shows array access and ID validation gaps in external responses.
- Invalid responses should be handled gracefully with explicit errors.
Acceptance Criteria:
- [x] T-117.1: Verify HubSpot search responses are arrays before indexing.
- [x] T-117.2: Validate Supabase insert responses to ensure IDs are valid strings.
- [x] T-117.3: Add tests for malformed HubSpot/Supabase responses.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-118: Extract rate limiting module from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit notes the `lib/actions.ts` god object and rate limiter initialization complexity.
- Rate limiting should be isolated and testable.
Acceptance Criteria:
- [ ] T-118.1: Move rate limiter initialization and helpers into a dedicated module.
- [ ] T-118.2: Update server actions to consume the new module.
- [ ] T-118.3: Add unit tests for rate limiter behavior.
References:
- /lib/actions.ts
- /lib (new module)
- /WRONG.md
Dependencies: None
Effort: M

### T-119: Extract validation + security helpers from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit highlights deep nesting and mixed concerns for IP/CSRF validation.
- Validation logic should be reusable and easier to audit.
Acceptance Criteria:
- [ ] T-119.1: Extract CSRF validation, IP parsing, and header validation into a dedicated module.
- [ ] T-119.2: Update actions to call the new validation helpers.
- [ ] T-119.3: Add tests for invalid/edge-case header and IP inputs.
References:
- /lib/actions.ts
- /lib (new module)
- /WRONG.md
Dependencies: None
Effort: M

### T-120: Extract persistence + CRM adapters from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags direct fetch calls and duplicate Supabase header building.
- External integrations should be isolated behind adapters.
Acceptance Criteria:
- [ ] T-120.1: Create Supabase lead repository module with shared header builder.
- [ ] T-120.2: Create HubSpot adapter module to avoid direct fetch usage in actions.
- [ ] T-120.3: Update submit flow to use adapters and add adapter tests/mocks.
References:
- /lib/actions.ts
- /lib (new modules)
- /WRONG.md
Dependencies: T-118, T-119
Effort: M

### T-121: Create contact form orchestration layer
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit highlights submitContactForm complexity, multiple dependencies, and action file size.
- Orchestration should reduce coupling and clarify flow.
Acceptance Criteria:
- [ ] T-121.1: Create a focused orchestration module that composes validation, rate limiting, and persistence.
- [ ] T-121.2: Reduce `lib/actions.ts` size and responsibilities to a thin entry point.
- [ ] T-121.3: Replace magic strings/identifiers with shared helpers or types.
- [ ] T-121.4: Add integration tests covering success, validation error, and HubSpot failure flows.
References:
- /lib/actions.ts
- /lib (new modules)
- /WRONG.md
Dependencies: T-118, T-119, T-120
Effort: L

### T-122: Refactor Navigation component complexity
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags Navigation as a god component with focus trap and active link complexity.
- Bugs include memory leak and path normalization edge cases.
Acceptance Criteria:
- [ ] T-122.1: Extract focus trap and key handling into a reusable hook.
- [ ] T-122.2: Fix event listener cleanup to prevent memory leaks.
- [ ] T-122.3: Normalize active link logic to handle edge cases.
- [ ] T-122.4: Add tests for focus trap and active link behavior.
References:
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-123: Refactor ContactForm component for DRY + separation
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags ContactForm for repetition and feature envy of server actions.
- Form behavior should be centralized in a hook or helper.
Acceptance Criteria:
- [ ] T-123.1: Extract repeated input field rendering into a shared component or config map.
- [ ] T-123.2: Move submit logic into a dedicated hook/service to reduce UI coupling.
- [ ] T-123.3: Add/update unit tests for the refactored component and hook.
References:
- /components/ContactForm.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-124: Refactor logger sanitization and record building
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit calls out sanitizeValue complexity, sensitive key checks, and buildLogRecord complexity.
- Logging must remain safe while reducing complexity.
Acceptance Criteria:
- [ ] T-124.1: Split sanitizeValue into smaller helpers covering object/array cases.
- [ ] T-124.2: Harden sensitive key detection with clearer rule set and tests.
- [ ] T-124.3: Simplify buildLogRecord and update related tests.
References:
- /lib/logger.ts
- /__tests__/lib/logger.test.ts
- /WRONG.md
Dependencies: None
Effort: M

### T-125: Refactor middleware for clarity and guardrails
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags middleware size, magic numbers, and NaN content-length handling.
- Middleware should be simpler and safer.
Acceptance Criteria:
- [ ] T-125.1: Extract security header configuration into helper(s).
- [ ] T-125.2: Guard against NaN content-length values in size checks.
- [ ] T-125.3: Replace magic numbers with named constants and update docs/tests.
References:
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: M

### T-126: Streamline environment validation structure
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags `lib/env.ts` as overlong with mixed concerns.
- Validation logic should be easier to scan and maintain.
Acceptance Criteria:
- [ ] T-126.1: Extract schema and production checks into focused helpers/modules.
- [ ] T-126.2: Preserve existing validation behavior and tests.
- [ ] T-126.3: Update docs to reflect the new structure.
References:
- /lib/env.ts
- /WRONG.md
Dependencies: None
Effort: M
