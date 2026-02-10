<!--
/**
 * @file BACKLOG.md
 * @role docs
 * @summary Queued tasks awaiting promotion to active TODO.
 *
 * @entrypoints
 * - Task prioritization and planning
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - TASK_WORKFLOW.md (workflow definition)
 * - DEFINITION_OF_DONE.md (quality standards)
 *
 * @used_by
 * - Developers, maintainers, automated agents
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: new tasks from reflection phase
 * - outputs: tasks promoted to TODO.md
 *
 * @invariants
 * - Tasks are prioritized (High|Medium|Low)
 * - No duplicates
 * - Dependencies are documented
 *
 * @gotchas
 * - Backlog can grow faster than completion rate
 * - Regular cleaning prevents staleness
 *
 * @issues
 * - None identified
 *
 * @opportunities
 * - Add task estimation
 * - Add task categorization
 * - Implement automated prioritization
 *
 * @verification
 * - Review: Tasks align with project goals
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Task Backlog

## Overview

This file contains tasks queued for future work. Tasks are promoted to [TODO.md](./TODO.md) based on priority, dependencies, and available capacity.

## Backlog Health

**Last Cleaned:** 2026-02-10
**Total Tasks:** 0
**High Priority:** 0
**Medium Priority:** 0
**Low Priority:** 0

## Promotion Guidelines

See [docs/TASK_WORKFLOW.md](./docs/TASK_WORKFLOW.md) section 3 for promotion rules.

**Criteria for promotion:**

1. High leverage (unblocks other work)
2. Risk reduction (security, stability)
3. Correctness (bug fixes)
4. Value (user-visible improvements)

## High Priority

Tasks that should be promoted next. These typically:

- Fix critical bugs
- Address security vulnerabilities
- Unblock other high-value work
- Reduce significant technical debt

---

(No high priority tasks currently)

---

## Medium Priority

Tasks that provide value but are not urgent. These typically:

- Improve existing features
- Add moderate value
- Reduce moderate technical debt
- Improve developer experience

---

(No medium priority tasks currently)

---

## Low Priority

Tasks that are nice-to-have but not critical. These typically:

- Minor improvements
- Refactoring without immediate benefit
- Future enhancements
- Exploratory work

---

(No low priority tasks currently)

---

## Template for New Tasks

Use this template when adding tasks to backlog:

```markdown
### Task: [Task Title]

**Priority:** [High|Medium|Low]
**Created:** [YYYY-MM-DD]
**Dependencies:** [List dependencies or "None"]
**Category:** [Bug|Feature|Refactor|Docs|Test|Chore]

**Description:**
[Clear description of what needs to be done]

**Rationale:**
[Why this task is needed and why it's important]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]

**Files to Modify:**
- [file1.ts]
- [file2.tsx]

**Verification:**
[How to verify this works]

**Estimated Complexity:** [High|Medium|Low]

**Notes:**
[Any additional context, constraints, or considerations]
```

## Backlog Maintenance

### Weekly Tasks

- [ ] Review all backlog items
- [ ] Remove duplicates
- [ ] Archive obsolete items
- [ ] Update priorities
- [ ] Split large tasks
- [ ] Verify dependencies
- [ ] Update backlog health metrics

### Monthly Tasks

- [ ] Major backlog cleanup
- [ ] Reassess all priorities
- [ ] Consolidate related tasks
- [ ] Remove stale items (>6 months)
- [ ] Review against project goals

## Archived / Obsolete Tasks

Tasks that are no longer relevant or have been superseded:

---

(No archived backlog tasks currently)

---

## Related Documentation

- [TODO.md](./TODO.md) - Active tasks
- [ARCHIVE.md](./ARCHIVE.md) - Completed tasks
- [docs/TASK_WORKFLOW.md](./docs/TASK_WORKFLOW.md) - Task workflow
- [docs/DEFINITION_OF_DONE.md](./docs/DEFINITION_OF_DONE.md) - Quality checklist
