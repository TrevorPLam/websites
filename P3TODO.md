# P3TODO.md - Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
Task Truth Source: **P3TODO.md**
Other Priority Files: `P0TODO.md`, `P1TODO.md`, `P2TODO.md`

This file is the single source of truth for P3 actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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

## 🟢 PHASE 3: Backlog & Tech Debt (P3)

### T-134: Normalize naming conventions and vague identifiers
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags inconsistent case conventions and vague/abbreviated names.
- Clear naming improves maintainability and onboarding.
Acceptance Criteria:
- [ ] T-134.1: Identify inconsistent casing and abbreviations in core modules.
- [ ] T-134.2: Rename identifiers with clear, consistent conventions.
- [ ] T-134.3: Update tests and docs affected by renames.
References:
- /lib/actions.ts
- /components/ContactForm.tsx
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-135: Add barrel exports where missing
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags missing barrel exports for clearer import boundaries.
- Index files improve discoverability and reduce import churn.
Acceptance Criteria:
- [ ] T-135.1: Identify directories with repeated deep imports.
- [ ] T-135.2: Add index files that export public APIs only.
- [ ] T-135.3: Update imports to use the barrel exports where appropriate.
References:
- /components
- /lib
- /WRONG.md
Dependencies: None
Effort: S

### T-136: Replace generic error returns with specific messages
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit notes generic error returns reduce debugging clarity.
- Errors should be user-safe but specific internally.
Acceptance Criteria:
- [ ] T-136.1: Identify generic error responses in core flows.
- [ ] T-136.2: Improve error messaging with safe, specific user + log context.
- [ ] T-136.3: Add tests covering improved error paths.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-137: Normalize import ordering across codebase
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags inconsistent import ordering.
- Consistent ordering improves readability and reduces merge noise.
Acceptance Criteria:
- [ ] T-137.1: Define import ordering standard (external, internal, relative).
- [ ] T-137.2: Apply ordering in affected files and update lint rules if needed.
References:
- /eslint.config.mjs
- /WRONG.md
Dependencies: None
Effort: S

### T-144: Decide fate of unused blog utility helpers
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-007 notes getFeaturedPosts/getPostsByCategory are unused but possibly future-facing.
- Decision should be explicit to avoid drift.
Acceptance Criteria:
- [ ] T-144.1: Confirm no production usage of the helpers.
- [ ] T-144.2: Decide to remove or keep with clear documentation of intent.
- [ ] T-144.3: Update tests/docs based on the decision.
References:
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-145: Audit and document inline code TODOs
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Problem statement requires auditing inline code TODOs to determine if they represent actionable tasks
- Initial scan shows only 2 inline TODOs (both are example placeholders like "G-XXXX")
- Need comprehensive audit to identify any actionable inline TODOs vs documentation placeholders
- Note: This task is about auditing, not automatically integrating - integration decisions come after audit
Acceptance Criteria:
- [ ] T-145.1: Run comprehensive search for inline TODO/FIXME/HACK/XXX comments in all source files (.ts, .tsx, .js, .jsx, etc.) using: `grep -r "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -n`
- [ ] T-145.2: Categorize findings as: actionable tasks, documentation placeholders, or historical notes
- [ ] T-145.3: Document findings in /docs/INLINE_TODO_AUDIT.md with exact counts and examples
- [ ] T-145.4: Create tasks in P0-P3TODO.md only for actionable inline TODOs requiring work (if any found)
References:
- All .ts, .tsx, .js, .jsx files in codebase
- /docs/INLINE_TODO_AUDIT.md (to be created)
Dependencies: None
Effort: S

_Completed (moved to TODOCOMPLETED.md on 2026-01-21): T-139, T-140, T-141, T-142, T-143._
