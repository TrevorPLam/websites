# CODEAUDIT.md — Code Audit (Task Factory)

Document Type: Audit Runbook
Last Updated: 2026-01-05
Precedence: `CODEBASECONSTITUTION.md` → `READMEAI.md` → `TODO.md` → this document
Owner: AGENT

Purpose: Convert code and doc findings into small, executable tasks with clear acceptance criteria.

## AGENT execution (runbook)
Inputs to inspect:
- `Repository tree`
- `TODO.md / TODOCOMPLETED.md`
- `Open TODO/FIXME markers in code`
- `docs/ and specs/ for mismatches`

Execution steps:
1) Scan for actionable TODO/FIXME/HACK notes and convert them into tasks in TODO.md (replace with task IDs when appropriate).
2) Identify hotspots: large files, duplicated logic, inconsistent patterns that slow agents.
3) Map critical flows (auth, payments, booking/creation, admin) to ensure each has explicit tasks/tests where needed.
4) Deduplicate tasks and ensure each task references exact files/paths.

Stop conditions:
- If you discover a P0 security issue, stop and create a P0 task under SECURITYAUDIT.md (do not continue scanning).

Required outputs:
- Update/create tasks in TODO.md.
- Append a run summary to this document.

## Task writing rules
- Tasks must be created/updated in `TODO.md` using the required schema.
- If a task is ambiguous, set **Status: BLOCKED** and add a question in the task Context.
- Do not invent repo facts. If evidence is missing, write **UNKNOWN** and cite what you checked.

---

## Summary (append-only)
> Append a dated summary after each run. Do not delete old summaries.

### 2026-01-06 — Summary
- Agent: AGENT (GitHub Copilot)
- Scope: Full repository scan (code files, specs, docs)
- Findings:
  - No TODO/FIXME/HACK markers found in code
  - Largest files are reasonable size: pricing page (295 lines), about page (281 lines), case studies detail (247 lines), actions (232 lines)
  - No duplicated code patterns identified
  - Critical flows mapped: Contact form with rate limiting, input validation, and sanitization (✅)
  - No auth flows (marketing site by design)
  - No payment flows
  - Codebase is clean and well-structured for its scale
- Tasks created/updated:
  - None (code quality is good)
- Questions for Trevor:
  - (none)

### 2026-01-05 — Summary
- Agent: AGENT
- Scope: UNKNOWN (not yet run)
- Findings:
  - (none)
- Tasks created/updated:
  - (none)
- Questions for Trevor:
  - (none)

### 2026-01-07 — Summary
- Agent: GitHub Copilot
- Scope: Codebase scan (app/, components/, lib/)
- Findings:
  - ✅ **No Code TODOs**: The codebase is clean of executable comments.
  - ✅ **Hotspots**: Largest files (`lib/actions.ts`, `app/pricing/page.tsx`) are < 500 lines and well-structured.
  - ✅ **Critical Flows**:
    - Contact Form: Currently uses Resend (Email). `TODO.md` correctly tracks `T-053` (P1) to migrate this to Supabase + HubSpot (No Email) as per goals.
    - Search: `lib/search.ts` is simple and maintainable.
  - ✅ **Context**: Local `AGENTS.md` files are present and helpful.
- Tasks created/updated:
  - (none) — Existing tasks in `TODO.md` cover the known architectural gaps.
- Questions for Trevor:
  - (none)

### 2026-01-10 — Summary
- Agent: AGENT
- Scope: Code TODO/FIXME scan (lib/, tests/)
- Findings:
  - Converted sanitize URL TODO into implemented helper + tests.
  - Replaced contact-form migration TODO comment with task references (T-080/T-081/T-082).
- Tasks created/updated:
  - T-083 (URL sanitization helper, DONE)
- Questions for Trevor:
  - (none)
