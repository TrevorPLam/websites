---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-005
title: 'Create CLAUDE.md sub-agent definitions'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-005-claude-sub-agents
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-3-005 · Create CLAUDE.md sub-agent definitions

## Objective

Create CLAUDE.md file with sub-agent definitions following section 3.9 specification, defining specialized AI agents for FSD enforcement, accessibility auditing, RLS validation, and performance monitoring.

---

## Context

**Codebase area:** Root directory — AI sub-agent definitions

**Related files:** AGENTS.md, per-package AGENTS.md files, existing documentation

**Dependencies:** FSD v2.1 architecture, accessibility standards, security requirements, performance budgets

**Prior work:** Basic documentation exists but lacks structured sub-agent definitions

**Constraints:** Must follow section 3.9 specification with specific agent roles and rules

---

## Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| AI Agents     | Claude Code sub-agent definitions          |
| Documentation | Markdown with structured agent definitions |
| Validation    | Automated rule enforcement patterns        |

---

## Acceptance Criteria

- [ ] **[Agent]** Create CLAUDE.md following section 3.9 specification exactly
- [ ] **[Agent]** Define FSD Enforcer sub-agent with FSD v2.1 rules
- [ ] **[Agent]** Define A11y Auditor sub-agent for WCAG 2.2 compliance
- [ ] **[Agent]** Define RLS Validator sub-agent for Supabase security
- [ ] **[Agent]** Define Performance Guardian sub-agent for optimization
- [ ] **[Agent]** Include triggers, rules, and validation patterns for each sub-agent
- [ ] **[Agent]** Add integration patterns with existing tools and workflows
- [ ] **[Agent]** Test sub-agent definitions with practical examples
- [ ] **[Agent]** Verify agents can be referenced and used effectively
- [ ] **[Human]** Verify CLAUDE.md provides comprehensive sub-agent definitions

---

## Implementation Plan

- [ ] **[Agent]** **Analyze existing documentation** — Review current docs for sub-agent patterns
- [ ] **[Agent]** **Create CLAUDE.md structure** — Follow section 3.9 template
- [ ] **[Agent]** **Define FSD Enforcer** — Add FSD v2.1 rule enforcement patterns
- [ ] **[Agent]** **Define A11y Auditor** — Add WCAG 2.2 compliance rules
- [ ] **[Agent]** **Define RLS Validator** — Add Supabase security validation
- [ ] **[Agent]** **Define Performance Guardian** — Add performance monitoring rules
- [ ] **[Agent]** **Add integration examples** — Include practical usage patterns
- [ ] **[Agent]** **Test sub-agent definitions** — Verify with practical scenarios
- [ ] **[Agent]** **Update documentation references** — Ensure proper cross-references

> ⚠️ **Agent Question**: Ask human before proceeding if any additional sub-agents are needed beyond the four specified in section 3.9.

---

## Commands

```bash
# Test CLAUDE.md creation
cat CLAUDE.md

# Verify sub-agent definitions
grep -A 10 "## \[Sub-Agent Name\]" CLAUDE.md

# Test FSD Enforcer rules
# (Would be implemented when agent is active)

# Test A11y Auditor rules
# (Would be implemented when agent is active)
```

---

## Code Style

```markdown
# Claude Code Sub-Agents

## FSD Enforcer

**Role:** Enforce Feature-Sliced Design architecture rules.
**Triggers:** When creating/modifying files in `src/` directories.
**Rules:**

1. Verify correct layer placement (features can't import from pages)
2. Ensure `@x` notation for cross-slice imports
3. Check `index.ts` exports (public API)
4. Flag `insignificant-slice` violations (< 3 files)

## A11y Auditor

**Role:** Ensure WCAG 2.2 AA compliance.
**Triggers:** When creating/modifying UI components.
**Rules:**

1. Verify semantic HTML (`<button>` not `<div onClick>`)
2. Check color contrast (4.5:1 normal text, 3:1 large text)
3. Ensure keyboard navigation (tab order, focus indicators)
4. Validate ARIA attributes (aria-label, aria-describedby)
5. Check target size (24x24px minimum per 2.5.8)

## RLS Validator

**Role:** Verify Supabase Row-Level Security policies.
**Triggers:** When creating/modifying database queries.
**Rules:**

1. All queries include tenant isolation (WHERE tenantId = auth.tenantId())
2. No raw SQL without RLS policy
3. Flag missing composite indexes for RLS columns

## Performance Guardian

**Role:** Prevent performance regressions.
**Triggers:** When modifying components, adding dependencies.
**Rules:**

1. Check bundle size against budgets (.size-limit.json)
2. Verify `use cache` for static data
3. Flag missing `loading.tsx` for dynamic routes
4. Ensure images use `next/image` with optimization
```

**Sub-agent principles:**

- Each agent has specific role and trigger conditions
- Rules are actionable and verifiable
- Integration with existing tooling and workflows
- Focus on prevention rather than detection
- Clear boundaries and responsibilities

---

## Boundaries

| Tier             | Scope                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 3.9 specification; define all four sub-agents; include triggers and rules; integrate with existing workflows                             |
| ⚠️ **Ask first** | Adding additional sub-agents beyond specification; changing agent responsibilities; modifying rule severity levels                                      |
| 🚫 **Never**     | Create agents without clear rules; ignore integration with existing tools; duplicate functionality across agents; break existing documentation patterns |

---

## Success Verification

- [ ] **[Agent]** Run `cat CLAUDE.md` — file follows section 3.9 structure
- [ ] **[Agent]** Verify sub-agent definitions — All four agents properly defined
- [ ] **[Agent]** Check rule completeness — Each agent has actionable rules
- [ ] **[Agent]** Test trigger conditions — Agent activation logic is clear
- [ ] **[Agent]** Validate integration patterns — Agents work with existing tools
- [ ] **[Human]** Review CLAUDE.md — Provides comprehensive sub-agent definitions
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Rule specificity:** Ensure rules are specific enough to be actionable
- **Trigger conditions:** Make agent activation logic clear and reliable
- **Integration complexity:** Ensure agents can integrate with existing workflows
- **Rule conflicts:** Avoid overlapping responsibilities between agents
- **Maintenance:** Keep CLAUDE.md updated as rules and tools evolve

---

## Out of Scope

- Implementation of agent logic (only definitions)
- Automated agent activation systems
- Performance monitoring of agent execution
- Custom agent development tools

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

- [Section 3.9 CLAUDE.md Sub-Agent Definitions](docs/plan/domain-3/3.9-claudemd-sub-agent-definitions.md)
- [Section 3.10 Cold-Start Checklist](docs/plan/domain-3/3.10-cold-start-checklist-for-ai-agent-sessions.md)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [QA Report](docs/qa-reports/domain-3-quality-assurance-report.md)
