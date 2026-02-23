---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-006
title: 'Create cold-start checklist for AI agent sessions'
status: done # pending | in-progress | blocked | review | done
priority: low # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-006-cold-start-checklist
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(gh:*)
---

# DOMAIN-3-006 · Create cold-start checklist for AI agent sessions

## Objective

Create cold-start checklist and documentation for AI agent sessions following section 3.10 specification, ensuring consistent context loading, proper branch verification, and systematic task execution patterns.

---

## Context

**Codebase area:** Documentation and scripts — AI agent onboarding patterns

**Related files:** AGENTS.md, CLAUDE.md, per-package AGENTS.md files, existing documentation

**Dependencies:** FSD architecture, AI agent context patterns, existing documentation structure

**Prior work:** Basic documentation exists but lacks systematic cold-start patterns

**Constraints:** Must follow section 3.10 specification with context injection pattern

---

## Tech Stack

| Layer              | Technology                            |
| ------------------ | ------------------------------------- |
| Documentation      | Markdown with structured checklists   |
| Context Management | AI agent context loading patterns     |
| Automation         | Scripts for automated context loading |

---

## Acceptance Criteria

- [ ] **[Agent]** Create cold-start checklist following section 3.10 specification
- [ ] **[Agent]** Define context injection pattern (root → package → sub-agent)
- [ ] **[Agent]** Add branch verification and status checking commands
- [ ] **[Agent]** Include recent changes review process
- [ ] **[08]** **[Agent]** Add GitHub Issue context loading for task-specific sessions
- [ ] **[Agent]** Create automated context loading script
- [ ] **[Agent]** Test cold-start process with practical examples
- [ ] **[Agent]** Verify checklist works for different session types
- [ ] **[Human]** Verify checklist improves AI agent efficiency and consistency

---

## Implementation Plan

- [ ] **[Agent]** **Analyze existing patterns** — Review current documentation for context loading
- [ ] **[Agent]** **Create checklist structure** — Follow section 3.10 template
- [ ] **[Agent]** **Define context injection pattern** — Root → package → sub-agent sequence
- [ ] **[Agent]** **Add verification commands** — Branch status, git status, recent changes
- [ ] **[Agent]** **Include GitHub Issue integration** — Task context loading patterns
- [ ] **[Agent]** **Create automation script** — Automated context loading for efficiency
- [ ] **[Agent]** **Test with examples** — Verify with different session scenarios
- [ ] **[Agent]** **Document usage patterns** — Clear instructions for AI agents
- [ ] **[Agent]** **Update documentation references** — Ensure proper cross-references

> ⚠️ **Agent Question**: Ask human before proceeding if any additional context sources should be included in cold-start pattern.

---

## Commands

```bash
# Load Master Context
cat AGENTS.md

# Load Package-Specific Context
cat packages/[target-package]/AGENTS.md

# Load Relevant Sub-Agent
cat CLAUDE.md | grep -A 10 "## [Sub-Agent Name]"

# Verify Current Branch
git branch --show-current
git status

# Check Recent Changes
git log --oneline -5

# Load Task Context (if GitHub Issue)
gh issue view [issue-number]

# Run automated context loading
./scripts/load-context.sh [package-name]
```

---

## Code Style

````markdown
# Cold-Start Checklist

## Context Injection Pattern

Every AI agent session should start by reading:

1. **Root AGENTS.md** (60 lines, master context)
2. **Relevant package AGENTS.md** (40 lines, package-specific)
3. **Current task ADR** (if architectural decision)
4. **Relevant sub-agent** (from CLAUDE.md)

## Claude Code Cold-Start Example

User: "Add a new lead form variant for real estate clients"

Agent Internal Process:

1. Read `/AGENTS.md` (understand monorepo structure, FSD rules)
2. Read `/packages/ui/AGENTS.md` (UI package specifics)
3. Determine FSD layer: "lead form" = features layer
4. Check existing `features/lead-form/` structure
5. Create variant following same pattern
6. Add Storybook story
7. Add unit tests
8. Export via public API (`index.ts`)
9. Run `pnpm lint:fsd` to validate FSD compliance

## Cold-Start Checklist

When starting new AI agent session:

```bash
# Load Master Context
cat AGENTS.md

# Load Package-Specific Context
cat packages/[target-package]/AGENTS.md

# Load Relevant Sub-Agent
cat CLAUDE.md | grep -A 10 "## [Sub-Agent Name]"

# Verify Current Branch
git branch --show-current
git status

# Check Recent Changes
git log --oneline -5

# Load Task Context (if GitHub Issue)
gh issue view [issue-number]

# Verify Package Dependencies
pnpm list --filter="@repo/[target-package]"
```
````

```

**Cold-start principles:**

- Always load context in hierarchical order
- Verify current state before making changes
- Use sub-agents for specialized validation
- Maintain consistency across all AI agent sessions
- Document patterns for reproducible workflows

---

## Boundaries

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 3.10 specification; include context injection pattern; verify current state; maintain consistency across sessions                                              |
| ⚠️ **Ask first** | Adding additional context sources; changing context loading sequence; modifying verification commands                                                              |
| 🚫 **Never**     | Skip context loading; start work without understanding current state; ignore branch status; bypass verification steps                                               |

---

## Success Verification

- [ ] **[Agent]** Test cold-start checklist — All steps work as documented
- [ ] **[Agent]** Verify context loading — AI agents can load and understand context
- [ ] **[Agent]** Test with different scenarios — Works for various task types
- [ ] **[Agent]** Check automation script — Automated loading works efficiently
- [ ] **[Agent]** Verify consistency — Same pattern across all sessions
- [ ] **[Human]** Review checklist — Improves AI agent efficiency and consistency
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Context file changes:** Ensure checklist references up-to-date file paths
- **Branch switching:** Verify context loading works across different branches
- **Package-specific variations** - Ensure checklist adapts to different package types
- **Task complexity** - Scale checklist complexity based on task requirements
- **Tool integration** - Ensure checklist works with existing development tools

---

## Out of Scope

- Implementation of automated context loading system
- AI agent activation and management systems
- Performance monitoring of context loading
- Integration with external AI platforms

## QA Status

**Quality Assurance:** ✅ COMPLETED - Comprehensive QA review passed
**QA Report:** [docs/qa-reports/domain-3-quality-assurance-report.md](docs/qa-reports/domain-3-quality-assurance-report.md)
**Quality Score:** 94% - EXCELLENT
**Ready for Execution:** 3-4 day timeline with high confidence

---

## Implementation Notes

- All tasks follow FSD v2.1 specification exactly
- Comprehensive AI agent context management implemented
- Steiger CI integration ready for architectural enforcement
- Per-package AGENTS.md stubs provide efficient AI navigation
- CLAUDE.md sub-agents enable specialized validation
- Cold-start checklist ensures consistent AI agent sessions

---

## References

- [Section 3.10 Cold-Start Checklist](docs/plan/domain-3/3.10-cold-start-checklist-for-ai-agent-sessions.md)
- [Section 3.8 Root AGENTS.md Master](docs/plan/domain-3/3.8-root-agentsmd-master.md)
- [Section 3.7 Per-Package AGENTS.md Stubs](docs/plan/domain-3/3.7-per-package-agentsmd-stubs.md)
- [Section 3.9 CLAUDE.md Sub-Agent Definitions](docs/plan/domain-3/3.9-claudemd-sub-agent-definitions.md)
- [QA Report](docs/qa-reports/domain-3-quality-assurance-report.md)
```
