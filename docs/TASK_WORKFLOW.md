<!--
/**
 * @file TASK_WORKFLOW.md
 * @role docs
 * @summary Task management workflow and lifecycle documentation.
 *
 * @entrypoints
 * - Primary reference for task execution process
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - TODO.md (active tasks)
 * - BACKLOG.md (queued tasks)
 * - ARCHIVE.md (completed tasks)
 *
 * @used_by
 * - Developers, maintainers, and automated agents
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: task requirements and specifications
 * - outputs: structured workflow guidance
 *
 * @invariants
 * - All tasks must follow the same lifecycle
 * - Quality gates are mandatory, not optional
 *
 * @gotchas
 * - Skipping documentation or reflection steps creates technical debt
 * - Not updating backlog means losing context for future work
 *
 * @issues
 * - None identified
 *
 * @opportunities
 * - Automate task promotion and archival
 * - Add task metrics and analytics
 *
 * @verification
 * - Validated: Workflow aligns with quality gates
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Task Management Workflow

## Overview

This document defines the task management workflow for the Hair Salon repository. The workflow ensures quality, maintains documentation, and keeps the backlog healthy.

**Goal:** Execute as many tasks as possible per session while maintaining quality gates and keeping the system clean (docs + backlog + archive).

## Workflow Principles

1. **Quality over quantity** - Don't compromise quality to complete more tasks
2. **Document everything** - Future agents and developers need context
3. **Reflect and expand** - Every task creates follow-up opportunities
4. **Keep backlog clean** - Remove duplicates, split large tasks, prioritize

## Task Files

- **TODO.md** - Active tasks currently in progress or ready to start
- **BACKLOG.md** - Queued tasks awaiting promotion
- **ARCHIVE.md** - Completed tasks with session notes

## 1. Session Scope & Batch Size

### Planning

- Review TODO.md for active tasks
- Determine batch size based on task complexity
- Aim for maximum tasks that can meet Definition of Done
- If quality would drop, execute fewer tasks and document why

### Guidelines

- Prefer more tasks only if each can still meet quality standards
- Complex tasks: 1-3 per session
- Simple tasks: 3-5 per session
- Mixed complexity: Balance accordingly

### Success Criteria

- All tasks in batch meet Definition of Done
- No shortcuts or skipped steps
- Documentation is complete
- Tests pass and code quality maintained

## 2. Per-Task Lifecycle

Execute this loop for each task in the batch:

### A. Execute

**Objective:** Implement the task exactly as specified.

**Steps:**

1. Read task specification completely
2. Understand acceptance criteria
3. Identify impacted files and systems
4. Implement changes following coding standards
5. Handle edge cases and error conditions

**If task is too large/unclear:**

- Split into smaller, well-defined tasks
- Add subtasks to TODO.md
- Proceed with smallest valid unit
- Document split rationale

**Outputs:**

- Code changes implementing the task
- All acceptance criteria addressed

### B. Verify

**Objective:** Prove the implementation works and meets quality standards.

**Steps:**

1. **Run relevant checks:**
   - Unit tests: `pnpm test`
   - Type checking: `pnpm type-check`
   - Linting: `pnpm lint`
   - Build: `pnpm build`
   - Security scan (if applicable)

2. **Add verification if missing:**
   - If no automated checks exist, add minimum viable verification
   - Even a smoke test is better than no test
   - Document why full testing is deferred (if applicable)

3. **Manual testing:**
   - Run the application: `pnpm dev`
   - Exercise new code paths
   - Verify UI changes visually
   - Test edge cases manually

4. **Fix issues:**
   - Address all test failures
   - Fix all linting errors
   - Resolve type errors
   - Handle security vulnerabilities

**Outputs:**

- All automated checks pass
- Manual verification complete
- Screenshots (for UI changes)
- Test coverage for new code (or explicit follow-up task)

### C. Document

**Objective:** Update all applicable documentation so future developers have context.

**Required documentation updates:**

1. **Meta headers** (for code files):
   ```typescript
   /**
    * @file <filename>
    * @role <app|lib|config|docs>
    * @summary <one-line purpose>
    *
    * @entrypoints
    * - <how this file is accessed>
    *
    * @exports
    * - <key exports>
    *
    * @depends_on
    * - <critical dependencies>
    *
    * @used_by
    * - <consumers of this file>
    *
    * @runtime
    * - environment: <node|browser|edge>
    * - side_effects: <any side effects>
    *
    * @data_flow
    * - inputs: <what data comes in>
    * - outputs: <what data goes out>
    *
    * @invariants
    * - <conditions that must always be true>
    *
    * @gotchas
    * - <common pitfalls>
    *
    * @issues
    * - <known issues>
    *
    * @opportunities
    * - <potential improvements>
    *
    * @verification
    * - <how to verify this works>
    *
    * @status
    * - confidence: <high|medium|low>
    * - last_audited: <YYYY-MM-DD>
    */
   ```

2. **Inline commentary** (only for non-obvious logic):
   - Why, not what
   - Complex algorithms
   - Non-obvious workarounds
   - Security considerations
   - Performance optimizations

3. **User/developer docs** (in /docs/):
   - API documentation
   - Integration guides
   - Configuration instructions
   - Architecture decisions

**Outputs:**

- Meta headers updated or added
- Inline comments for complex logic
- /docs/ updated as needed
- INDEX.md updated if new files added

### D. Reflect & Expand Backlog

**Objective:** Capture follow-up work and improvements.

**Analysis questions:**

1. **What else needs fixing?**
   - Edge cases not handled
   - Error handling gaps
   - Performance issues
   - Accessibility concerns

2. **What's missing?**
   - Test coverage gaps
   - Missing documentation
   - Observability/logging
   - Monitoring/alerts

3. **What could be better?**
   - Refactoring opportunities
   - Simplification possibilities
   - Performance optimizations
   - User experience improvements

4. **What's next?**
   - Related features
   - Complementary functionality
   - Integration opportunities
   - Technical debt reduction

**Outputs:**

- New tasks added to BACKLOG.md
- Each task includes:
  - Clear description
  - Rationale (why it's needed)
  - Priority (high/medium/low)
  - Dependencies (if any)

## 3. Promotion Rules (Backlog → Todo)

### When to Promote

- Active batch has fewer than target size
- Current tasks are blocked
- High-priority tasks become available
- Dependencies are resolved

### Before Promoting

1. **Clean the backlog:**
   - Remove duplicates
   - Archive obsolete items
   - Update stale descriptions
   - Verify dependencies

2. **Split large tasks:**
   - Break into session-sized units
   - Each subtask should be completable in one session
   - Maintain logical grouping
   - Add clear acceptance criteria

3. **Prioritize:**
   - High leverage: Unblocks other work
   - Risk reduction: Addresses security, stability
   - Correctness: Fixes bugs, improves reliability
   - Value: Delivers user-visible improvements

### Promotion Process

1. Review BACKLOG.md
2. Identify highest-priority tasks
3. Verify prerequisites are met
4. Move to TODO.md
5. Add to current session batch

## 4. Archival & Session Notes

### When to Archive

- Task is fully complete (meets Definition of Done)
- Task is abandoned (document why)
- Task is superseded (link to replacement)

### Required Session Notes

For each archived task, include:

1. **What changed:**
   - Files/modules touched
   - Key code modifications
   - Configuration updates
   - Dependencies added/removed

2. **Why it changed:**
   - Original intent/problem
   - Design decisions
   - Tradeoffs made
   - Alternative approaches considered

3. **How it was verified:**
   - Commands run and results
   - Manual testing performed
   - Screenshots/evidence
   - Known limitations

4. **Follow-up tasks:**
   - New tasks created
   - Rationale for each
   - Priority assignments
   - Dependencies noted

5. **Known limitations/risks:**
   - Edge cases not handled
   - Performance considerations
   - Security implications
   - Browser/platform limitations

### Archival Process

1. Ensure task meets Definition of Done
2. Write comprehensive session notes
3. Move from TODO.md to ARCHIVE.md
4. Include completion date
5. Link related follow-up tasks

## 5. Definition of Done (Quality Gate)

A task is "done" ONLY when:

### ✅ Implementation Complete

- [ ] All acceptance criteria met
- [ ] Code follows project conventions
- [ ] Edge cases handled
- [ ] Error handling implemented

### ✅ Verification Complete

- [ ] All relevant tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Manual testing complete
- [ ] Security scan passes (if applicable)
- [ ] If verification missing, follow-up task created with rationale

### ✅ Documentation Updated

- [ ] Meta headers updated/added
- [ ] Inline comments for complex logic
- [ ] /docs/ updated (if applicable)
- [ ] INDEX.md updated (if new files)
- [ ] API documentation complete
- [ ] Configuration documented

### ✅ Backlog Expanded

- [ ] Follow-up tasks identified
- [ ] New tasks added to BACKLOG.md
- [ ] Priorities assigned
- [ ] Dependencies noted

### ✅ Task Archived

- [ ] Session notes written
- [ ] Task moved to ARCHIVE.md
- [ ] Completion date added
- [ ] Links to follow-ups included

## Templates

### Task Template

```markdown
### Task: [Task Title]

**Priority:** [High|Medium|Low]
**Status:** [Todo|In Progress|Done|Blocked]
**Dependencies:** [List dependencies or "None"]

**Description:**
[Clear description of what needs to be done]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]

**Files to Modify:**
- [file1.ts]
- [file2.tsx]

**Verification:**
- [How to verify this works]

**Notes:**
[Any additional context, constraints, or considerations]
```

### Session Notes Template

```markdown
### [Task Title] - Completed [YYYY-MM-DD]

**What Changed:**
- Files touched: [list]
- Key modifications: [summary]
- Dependencies: [added/removed/updated]

**Why:**
- Intent: [original problem]
- Decision rationale: [key decisions]
- Tradeoffs: [what was sacrificed]

**Verification:**
- Commands: [commands run]
- Results: [summary of results]
- Manual tests: [what was tested]
- Screenshots: [if applicable]

**Follow-ups Created:**
1. [Task 1] - [rationale] - [priority]
2. [Task 2] - [rationale] - [priority]

**Limitations/Risks:**
- [Known limitation 1]
- [Known risk 1]

**Session Context:**
- Time spent: [estimate]
- Complexity: [High|Medium|Low]
- Challenges: [key challenges faced]
```

## Best Practices

### Do's

- ✅ Read entire task specification before starting
- ✅ Break large tasks into smaller units
- ✅ Write tests before or alongside code
- ✅ Document as you go, not after
- ✅ Commit frequently with clear messages
- ✅ Ask for clarification when unclear
- ✅ Update backlog immediately after completion
- ✅ Write detailed session notes

### Don'ts

- ❌ Skip documentation to "save time"
- ❌ Ignore test failures in unrelated areas
- ❌ Make changes outside task scope
- ❌ Leave TODOs in code without backlog tasks
- ❌ Assume future you will remember context
- ❌ Skip manual testing for UI changes
- ❌ Commit broken code
- ❌ Archive incomplete tasks

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     SESSION START                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Plan Batch Size       │
         │ Review TODO.md        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ FOR EACH TASK:        │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │ A. EXECUTE            │
         │ - Implement changes   │
         │ - Handle edge cases   │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │ B. VERIFY             │
         │ - Run tests           │
         │ - Manual testing      │
         │ - Fix issues          │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │ C. DOCUMENT           │
         │ - Meta headers        │
         │ - Inline comments     │
         │ - /docs/ updates      │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │ D. REFLECT            │
         │ - Identify follow-ups │
         │ - Add to backlog      │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │ Check Definition of   │
         │ Done                  │
         └───────────┬───────────┘
                     │
                     ▼
              ┌──────────┐
         ┌────┤ Done?    │────┐
         │    └──────────┘    │
        Yes                   No
         │                     │
         ▼                     ▼
    ┌─────────┐          ┌─────────┐
    │ ARCHIVE │          │ Fix/    │
    │ + Notes │          │ Complete│
    └────┬────┘          └────┬────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ More tasks in batch?  │
         └───────────┬───────────┘
                     │
              ┌──────┴──────┐
             Yes            No
              │              │
              └──────┬───────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Promote from BACKLOG  │
         │ if needed             │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │    SESSION END        │
         │ - Review archives     │
         │ - Update docs         │
         └───────────────────────┘
```

## Metrics & Success

### Task Metrics

Track these metrics to improve workflow:

- Tasks completed per session
- Average time per task
- Tasks requiring rework
- Follow-up tasks per completed task
- Documentation coverage

### Quality Metrics

- Test coverage maintained/improved
- Build stability
- Linting violations
- Type errors
- Security vulnerabilities

### Process Metrics

- Backlog size and age
- Task cycle time
- Time spent on verification
- Time spent on documentation

## Continuous Improvement

### Retrospective Questions

After each session:

1. What went well?
2. What could be improved?
3. Were quality standards maintained?
4. Is documentation sufficient?
5. Is backlog healthy?

### Process Updates

- Review workflow quarterly
- Update templates based on experience
- Add tooling to automate steps
- Refine quality gates as needed

## Related Documentation

- [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) - Detailed quality checklist
- [TODO.md](../TODO.md) - Active tasks
- [BACKLOG.md](../BACKLOG.md) - Queued tasks
- [ARCHIVE.md](../ARCHIVE.md) - Completed tasks with notes
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [INDEX.md](../INDEX.md) - Repository index
