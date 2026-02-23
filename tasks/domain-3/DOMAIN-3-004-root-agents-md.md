---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-004
title: 'Update root AGENTS.md master context file'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-004-root-agents-md
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-3-004 · Update root AGENTS.md master context file

## Objective

Update the root AGENTS.md file to follow section 3.8 specification with <60 lines limit, providing AI agents with master context for the entire monorepo, quick start commands, repository structure, and key files.

---

## Context

**Codebase area:** Root directory — master AI agent context

**Related files:** CLAUDE.md, per-package AGENTS.md files, all package directories

**Dependencies:** Existing repository structure, package information, FSD architecture

**Prior work:** Basic documentation exists but doesn't follow section 3.8 specification

**Constraints:** Must maintain <60 lines for AI agent context efficiency

---

## Tech Stack

| Layer               | Technology                      |
| ------------------- | ------------------------------- |
| Documentation       | Markdown with structured format |
| Context Management  | AI agent master context pattern |
| Repository Analysis | Dynamic content generation      |

---

## Acceptance Criteria

- [ ] **[Agent]** Update root AGENTS.md to follow section 3.8 specification exactly
- [ ] **[Agent]** Keep file under 60 lines for AI context efficiency
- [ ] **[Agent]** Include monorepo overview with key stack information
- [ ] **[Agent]** Add quick start commands for common operations
- [ ] **[Agent]** Include repository structure with key directories
- [ ] **[Agent]** Add key files and their purposes
- [ ] **[Agent]** Include FSD architecture overview
- [ ] **[Agent]** Reference configuration-as-code philosophy
- [ ] **[Agent]** Reference per-package AGENTS.md files
- [ ] **[Agent]** Test AI agent context loading efficiency
- [ ] **[Human]** Verify AGENTS.md provides comprehensive master context

---

## Implementation Plan

- [ ] **[Agent]** **Backup existing AGENTS.md** — Save current version for reference
- [ ] **[Agent]** **Analyze repository structure** — Gather current package and directory information
- [ ] **[Agent]** **Extract key stack information** — Compile current technology stack
- [ ] **[Agent]** **Create new AGENTS.md** — Follow section 3.8 template with <60 lines
- [ ] **[Agent]** **Add quick start commands** — Include essential pnpm commands
- [ ] **[Agent]** **Document repository structure** — Key directories and their purposes
- [ ] **[Agent]** **Include key files** — Important configuration and entry points
- [ ] **[Agent]** **Add FSD overview** — Brief FSD v2.1 architecture explanation
- [ ] **[Agent]** **Test context loading** — Verify AI agents can read efficiently

> ⚠️ **Agent Question**: Ask human before proceeding if any critical information should be included in master context.

---

## Commands

```bash
# Test AGENTS.md line count
wc -l AGENTS.md

# Test context loading
cat AGENTS.md

# Verify repository structure
find . -maxdepth 2 -type d | head -20

# Check package count
find packages/ -maxdepth 1 -type d | wc -l
```

---

## Code Style

````markdown
# Marketing Monorepo — AI Agent Master Context

## Overview

Multi-tenant, multi-site Next.js 16 marketing platform. 1-1,000 client sites from single codebase.

**Stack:** Next.js 16, React 19, Tailwind v4, Supabase, Turborepo 2.7, pnpm 10.x, FSD v2.1

## Quick Start

```bash
pnpm install            # Install dependencies
pnpm dev                # Start all dev servers
pnpm build              # Build all packages
pnpm test               # Run all tests
```
````

## Repository Structure

- `apps/admin/` — Internal admin dashboard
- `apps/portal/` — Client white-label portal
- `sites/*/` — Client marketing sites (1-1,000+)
- `packages/*/` — Shared libraries (15+ packages)
- `e2e/` — End-to-end tests (Playwright)

## Key Files

- `pnpm-workspace.yaml` — Workspace + catalog config
- `turbo.jsonc` — Task orchestration
- `sites/*/site.config.ts` — Single source of truth for each client
- `CLAUDE.md` — Sub-agent definitions

## FSD Architecture

All packages use FSD layers: `app → pages → widgets → features → entities → shared`
Cross-slice imports via `@x` notation (linted by Steiger).

## Configuration-as-Code

Every client site defined by `site.config.ts` (Zod-validated). Change config → re-deploy.

## Per-Package Context

See `packages/[package-name]/AGENTS.md` for package-specific context.

```

**Master context principles:**

- Keep under 60 lines for AI agent efficiency
- Focus on most important information for navigation
- Include practical commands and structure overview
- Reference per-package context for detailed information
- Update regularly to stay current with repository changes

---

## Boundaries

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 3.8 specification; maintain <60 lines; include essential context; reference per-package AGENTS.md files                                            |
| ⚠️ **Ask first** | Adding detailed implementation guides; including sensitive configuration; changing template structure; adding extensive package lists                              |
| 🚫 **Never**     | Exceed 60 line limit; include API keys or secrets; add detailed code examples; include implementation details better suited to per-package AGENTS.md files                |

---

## Success Verification

- [ ] **[Agent]** Run `wc -l AGENTS.md` — file is under 60 lines
- [ ] **[Agent]** Test context loading — AI agents can read and understand master context
- [ ] **[Agent]** Verify content completeness — All essential information included
- [ ] **[Agent]** Check references — Per-package AGENTS.md files properly referenced
- [ ] **[Agent]** Test quick start commands — Commands work as documented
- [ ] **[Human]** Review AGENTS.md — Provides excellent master context for AI work
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Line count limits:** Ensure file doesn't exceed 60 lines for AI context efficiency
- **Content prioritization:** Focus on most important information for AI agents
- **Command accuracy:** Ensure all documented commands work correctly
- **Reference accuracy:** Ensure per-package references are correct
- **Maintenance:** Keep file updated as repository structure evolves

---

## Out of Scope

- Detailed package documentation in master AGENTS.md
- Implementation guides and code examples
- Performance optimization details
- Security configuration information
- Individual package troubleshooting guides

---

## References

- [Section 3.8 Root AGENTS.md Master](docs/plan/domain-3/3.8-root-agentsmd-master.md)
- [Section 3.7 Per-Package AGENTS.md Stubs](docs/plan/domain-3/3.7-per-package-agentsmd-stubs.md)
- [Section 3.10 Cold-Start Checklist](docs/plan/domain-3/3.10-cold-start-checklist-for-ai-agent-sessions.md)
```
