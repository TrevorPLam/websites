# docs/ARCHIVE — Documentation Archive

**Last Updated:** 2026-01-22  
**Purpose:** Store deprecated, superseded, or historical documentation files

## Archive Organization

This directory contains documentation that is no longer active but preserved for historical reference.

### Subdirectories

- **`2026/`** - Time-based archives for 2026 (e.g., security reviews, audits)
- **`ops/`** - Historical operations documentation (e.g., old deployment guides)
- **`product/`** - Historical product documentation (e.g., development roadmaps)

### Files in Root Archive

| File | Archived Date | Reason | Superseded By |
|------|---------------|--------|---------------|
| `AGENTS.md` | 2026-01-21 | Moved to root | `/AGENTS.md` |
| `CODEAUDIT.md` | 2026-01-21 | Historical audit | `/CODEAUDIT.md` (active) |
| `CODEBASECONSTITUTION.md` | 2026-01-21 | Moved to root | `/CODEBASECONSTITUTION.md` |
| `CODE_AUDIT.md` | 2026-01-21 | Historical audit | Consolidated into `WRONG.md` |
| `DEPENDENCYAUDIT.md` | 2026-01-21 | Historical audit | `/DEPENDENCYAUDIT.md` (active) |
| `DEPENDENCY_HEALTH.md` | 2026-01-21 | Historical snapshot | Current status in `/PROJECT_STATUS.md` |
| `DOCSAUDIT.md` | 2026-01-21 | Historical audit | `/DOCSAUDIT.md` (active) |
| `DOCS_ROOT.md` | 2026-01-21 | Old index | `/docs/DOCS_INDEX.md` |
| `README-OLD.md` | 2026-01-03 | Old README | `/docs/start-here/README.md` |
| `RELEASEAUDIT.md` | 2026-01-21 | Historical audit | `/RELEASEAUDIT.md` (active) |
| `RELEASE_CHECKLIST.md` | 2026-01-21 | Old checklist | `/docs/LAUNCH-SMOKE-TEST.md` |
| `SECURITYAUDIT.md` | 2026-01-21 | Historical audit | `/SECURITYAUDIT.md` (active) |
| `SECURITY_REVIEW.md` | 2026-01-21 | Historical review | Consolidated into `/SECURITYAUDIT.md` |
| `TODOCOMPLETED.md` | 2026-01-21 | Old completed tasks | `/TODOCOMPLETED.md` (active) |
| `TODO_COMPLETED.md` | 2026-01-21 | Duplicate archive | `/TODOCOMPLETED.md` (active) |

## Archive Policy

Documents are archived when:
1. They are superseded by newer versions in the active documentation
2. They represent historical snapshots no longer relevant to current operations
3. They contain information moved to the root or other canonical locations
4. They are audits, reports, or summaries that have been completed and replaced

## Accessing Active Documentation

For current documentation, see:
- **Root**: `/READMEAI.md` (governance entry point)
- **Docs Index**: `/docs/DOCS_INDEX.md`
- **Task Truth Sources**: `/P0TODO.md`, `/P1TODO.md`, `/P2TODO.md`, `/P3TODO.md`
- **Project Status**: `/PROJECT_STATUS.md`

## Archive Retention

Archives are kept indefinitely for:
- Historical reference
- Audit trail purposes
- Understanding past decisions and their context

Do not delete archived files unless explicitly approved by the repository owner.
