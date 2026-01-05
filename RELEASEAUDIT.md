# RELEASEAUDIT.md — Release Audit & Checklist

Document Type: Audit Runbook
Last Updated: 2026-01-07
Precedence: `CODEBASECONSTITUTION.md` → `READMEAI.md` → `TODO.md` → this document
Owner: AGENT

Purpose: Ship changes safely and repeatably without relying on CI/GitHub Actions.

## AGENT execution (runbook)
Inputs to inspect:
- `TODO.md / TODOCOMPLETED.md`
- `CHANGELOG.md`
- `Deployment configs (env.example, next.config.mjs, middleware, etc.)`
- `docs/ops/ and docs/workflows/ references`

Execution steps:
1) Define release scope and version (SemVer or date-based) with explicit inclusions/exclusions.
2) Perform backlog hygiene: completed tasks moved, no task leakage in docs/config.
3) Run risk review: list potential breakpoints, affected roles, rollback plan.
4) Confirm secrets/config safety: no secrets committed; env changes documented.
5) Validate data/migration impacts (if applicable) and outline recovery.
6) Conduct manual smoke tests aligned to scope (UI/API flows) and document results.
7) Update CHANGELOG.md and append a release record summary here.

Stop conditions:
- If any P0 blocker is found, stop and write a “BLOCKED” release record with required fixes as P0 tasks.

Required outputs:
- Release record appended to this document.
- CHANGELOG.md updated with scope and risks.
- Tasks added/updated in TODO.md for any gaps.

---

## Summary (append-only)
> Append a dated summary after each run. Do not delete old summaries.

### 2026-01-07 — Summary
- Agent: AGENT
- Scope: UNKNOWN (not yet run)
- Findings:
  - (none)
- Tasks created/updated:
  - (none)
- Questions for Trevor:
  - (none)

---

## Legacy guidance (preserved)
- The previous RELEASE_CHECKLIST.md remains available with detailed phased steps and should be consulted alongside this runbook.
