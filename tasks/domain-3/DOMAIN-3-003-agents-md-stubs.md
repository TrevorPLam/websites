---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-003
title: 'Create per-package AGENTS.md stubs for AI context'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-003-agents-md-stubs
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-3-003 · Create per-package AGENTS.md stubs for AI context

## Objective

Create AGENTS.md stub files (40-60 lines each) for every package following the template from section 3.7, providing AI agents with package-specific context, key entry points, FSD layer structure, and common tasks.

---

## Context

**Codebase area:** All packages/ directories — AI context documentation

**Related files:** Root AGENTS.md, CLAUDE.md, all package directories

**Dependencies:** Existing package structure, FSD layer organization, package exports

**Prior work:** Root AGENTS.md exists but per-package context is missing

**Constraints:** Must follow 40-60 line limit for efficient AI agent context loading

---

## Tech Stack

| Layer               | Technology                            |
| ------------------- | ------------------------------------- |
| Documentation       | Markdown files with structured format |
| Context Management  | AI agent context injection pattern    |
| Template Generation | Automated stub creation scripts       |

---

## Acceptance Criteria

- [ ] **[Agent]** Create AGENTS.md file for every package in packages/
- [ ] **[Agent]** Follow section 3.7 template structure exactly (40-60 lines)
- [ ] **[Agent]** Include purpose, key entry points, FSD layer structure for each package
- [ ] **[Agent]** Add dependencies (external and internal) for each package
- [ ] **[Agent]** Include common tasks and TODOs for each package
- [ ] **[Agent]** Add last updated date and maintainer
- [ ] **[Agent]** Ensure files are 40-60 lines maximum for AI context efficiency
- [ ] **[Agent]** Verify all packages have AGENTS.md files
- [ ] **[Agent]** Test AI context loading pattern
- [ ] **[Human]** Verify AGENTS.md files provide useful context for AI agents

---

## Implementation Plan

- [ ] **[Agent]** **Identify all packages** — List all packages in packages/ directory
- [ ] **[Agent]** **Create template** — Use section 3.7 template as base
- [ ] **[Agent]** **Generate AGENTS.md for UI package** — Create context for packages/ui/
- [ ] **[Agent]** **Generate AGENTS.md for features package** — Create context for packages/features/
- [ ] **[Agent]** **Generate AGENTS.md for other packages** — Create context for all remaining packages
- [ ] **[Agent]** **Customize content** — Add package-specific information for each
- [ ] **[Agent]** **Validate line counts** — Ensure all files are 40-60 lines
- [ ] **[Agent]** **Test context loading** — Verify AI agents can load context efficiently
- [ ] **[Agent]** **Update root AGENTS.md** — Reference per-package AGENTS.md files

> ⚠️ **Agent Question**: Ask human before proceeding if any packages have special context requirements.

---

## Commands

```bash
# List all packages
find packages/ -maxdepth 1 -type d | grep -v "^packages/$"

# Test AGENTS.md creation
find packages/ -name "AGENTS.md" | wc -l

# Validate line counts
find packages/ -name "AGENTS.md" -exec wc -l {} \;

# Test context loading pattern
cat packages/ui/AGENTS.md
cat packages/features/AGENTS.md
```

---

## Code Style

```markdown
# UI Package Agent Context

## Purpose

Design system + marketing components with FSD v2.1 architecture.

## Key Entry Points

- `src/index.ts` — Public API exports for all components
- `src/shared/ui/` — UI primitives (Button, Card, Input)
- `src/features/` — Business logic components

## FSD Layer Structure

- `shared/` — UI primitives and utilities
- `entities/` — Domain models (Lead, User, Tenant)
- `features/` — Business logic (contact-form, navigation)
- `widgets/` — Complex UI compositions (header, footer)

## Dependencies

- **External:** @radix/ui, tailwindcss, class-variance-authority
- **Internal:** @repo/types, @repo/utils

## Common Tasks

- **Add new component:** Create in appropriate FSD layer, export via index.ts
- **Update styling:** Modify Tailwind classes or CSS variables
- **Run tests:** `pnpm test --filter="@repo/ui"`

## TODOs

- [ ] Migrate remaining components to FSD structure
- [ ] Add Storybook stories for all components

## Last Updated

2026-02-23 by AI Agent
```

**AGENTS.md principles:**

- Keep files 40-60 lines for AI context efficiency
- Focus on most important information for AI agents
- Include practical examples and common tasks
- Maintain consistent structure across all packages
- Update regularly to stay current with package changes

---

## Boundaries

| Tier             | Scope                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create AGENTS.md for all packages; follow 3.7 template; maintain 40-60 line limit; include practical context for AI agents                                |
| ⚠️ **Ask first** | Adding sensitive information to AGENTS.md; changing template structure; including detailed implementation guides                                          |
| 🚫 **Never**     | Exceed 60 line limit; include sensitive API keys; add implementation details better suited to code comments; create duplicate information across packages |

---

## Success Verification

- [ ] **[Agent]** Run `find packages/ -name "AGENTS.md" | wc -l` — matches package count
- [ ] **[Agent]** Check line counts — All files between 40-60 lines
- [ ] **[Agent]** Verify template consistency — All files follow same structure
- [ ] **[Agent]** Test context loading — AI agents can read and understand context
- [ ] **[Agent]** Validate content quality — Useful information for AI agent development
- [ ] **[Human]** Review AGENTS.md files — Provide good context for AI work
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Line count limits:** Ensure files don't exceed 60 lines for AI context efficiency
- **Package-specific content:** Customize each AGENTS.md for its specific purpose
- **Sensitive information:** Never include API keys or secrets in AGENTS.md
- **Maintenance:** Keep files updated as packages evolve
- **Template consistency:** Maintain same structure across all packages

---

## Out of Scope

- Detailed implementation guides in AGENTS.md
- Code examples and snippets
- Performance optimization details
- Security configuration information

---

## References

- [Section 3.7 Per-Package AGENTS.md Stubs](docs/plan/domain-3/3.7-per-package-agentsmd-stubs.md)
- [Section 3.8 Root AGENTS.md Master](docs/plan/domain-3/3.8-root-agentsmd-master.md)
- [AI Agent Context Pattern](docs/plan/domain-3/3.10-cold-start-checklist-for-ai-agent-sessions.md)
