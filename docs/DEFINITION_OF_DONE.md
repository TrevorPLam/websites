<!--
/**
 * @file DEFINITION_OF_DONE.md
 * @role docs
 * @summary Comprehensive quality checklist for task completion.
 *
 * @entrypoints
 * - Used before archiving any task
 * - Referenced during code reviews
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - TASK_WORKFLOW.md (parent workflow)
 *
 * @used_by
 * - Developers, maintainers, automated agents
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: completed task
 * - outputs: quality validation
 *
 * @invariants
 * - All items must be checked before archiving
 * - No exceptions unless explicitly documented
 *
 * @gotchas
 * - Easy to skip items under time pressure
 * - All checklist items are mandatory
 *
 * @issues
 * - None identified
 *
 * @opportunities
 * - Add automated checklist validation
 * - Create CI/CD gates based on checklist
 *
 * @verification
 * - Validated: Aligns with workflow requirements
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Definition of Done

## Overview

This document provides a comprehensive checklist to determine if a task is truly "done" and ready for archival. **Every item must be checked** before moving a task to ARCHIVE.md.

## Quick Reference

A task is done when:

1. ✅ Implementation is complete and meets all criteria
2. ✅ Verification passes (tests, lint, build, security)
3. ✅ Documentation is updated (code, inline, /docs/)
4. ✅ Backlog is expanded with follow-ups
5. ✅ Session notes are written
6. ✅ Task is archived with completion date

## Detailed Checklist

### 1. Implementation Complete

#### Code Quality

- [ ] All acceptance criteria met
- [ ] Code follows project style guide
- [ ] No hardcoded values (use constants/config)
- [ ] No commented-out code
- [ ] No console.log() or debugging statements
- [ ] No TODO comments without backlog tasks
- [ ] Proper error handling implemented
- [ ] Input validation present
- [ ] Edge cases handled

#### Functionality

- [ ] Feature works as specified
- [ ] All user stories addressed
- [ ] UI/UX meets requirements (if applicable)
- [ ] Accessibility requirements met (if applicable)
- [ ] Performance is acceptable
- [ ] No regressions in existing features

#### Standards

- [ ] TypeScript types are correct and strict
- [ ] No `any` types without justification
- [ ] Proper async/await usage
- [ ] No promise rejections unhandled
- [ ] Security best practices followed
- [ ] No sensitive data in code

### 2. Verification Complete

#### Automated Tests

- [ ] All tests pass: `pnpm test`
- [ ] New tests added for new code
- [ ] Test coverage maintained or improved
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases tested
- [ ] Error conditions tested

**If tests are missing:**

- [ ] Follow-up task created in BACKLOG.md
- [ ] Rationale documented in session notes
- [ ] Timeline for adding tests specified

#### Type Checking

- [ ] TypeScript check passes: `pnpm type-check`
- [ ] No type errors
- [ ] No implicit `any` types
- [ ] Proper generics usage
- [ ] Type imports/exports correct

#### Linting

- [ ] ESLint passes: `pnpm lint`
- [ ] No linting errors
- [ ] No linting warnings (or justified)
- [ ] Code formatting consistent
- [ ] Prettier applied (if used)

#### Build

- [ ] Production build succeeds: `pnpm build`
- [ ] No build warnings
- [ ] Bundle size acceptable
- [ ] No circular dependencies
- [ ] All imports resolve correctly

#### Security

- [ ] Security scan passes (if applicable)
- [ ] No new vulnerabilities introduced
- [ ] Dependencies are up to date
- [ ] No secrets in code
- [ ] Input sanitization present
- [ ] XSS prevention in place (for web)
- [ ] CSRF protection (if needed)
- [ ] SQL injection prevention (if database)

#### Manual Verification

- [ ] Development server runs: `pnpm dev`
- [ ] New code paths exercised
- [ ] UI tested in browser (if applicable)
- [ ] Mobile responsive (if web UI)
- [ ] Cross-browser tested (if needed)
- [ ] Keyboard navigation works (if UI)
- [ ] Screen reader compatible (if UI)
- [ ] Error states tested
- [ ] Loading states tested
- [ ] Empty states tested

**Visual Changes:**

- [ ] Screenshots taken
- [ ] Screenshots documented in session notes
- [ ] Visual regression check (if tooling exists)

### 3. Documentation Updated

#### Meta Headers (for code files)

- [ ] @file header present
- [ ] @role specified (app|lib|config|docs)
- [ ] @summary is clear and accurate
- [ ] @entrypoints documented
- [ ] @exports listed
- [ ] @depends_on updated
- [ ] @used_by updated
- [ ] @runtime documented
- [ ] @data_flow specified
- [ ] @invariants listed
- [ ] @gotchas documented
- [ ] @issues noted
- [ ] @opportunities listed
- [ ] @verification steps included
- [ ] @status updated with date

**Example:**

```typescript
/**
 * @file utils.ts
 * @role lib
 * @summary Shared utility functions for data transformation
 * ...
 */
```

#### Inline Comments

- [ ] Complex logic explained
- [ ] Non-obvious decisions documented
- [ ] "Why" not "what" comments
- [ ] Algorithm explanations present
- [ ] Performance considerations noted
- [ ] Security considerations noted
- [ ] Workaround explanations included

**Only add comments when:**

- Logic is non-obvious
- Business rules are complex
- Performance optimization is critical
- Security is a concern
- Workaround is necessary

#### Documentation Files

- [ ] /docs/ updated (if applicable)
- [ ] API documentation updated
- [ ] Configuration guide updated
- [ ] Integration guide updated
- [ ] Architecture docs updated
- [ ] README updated (if needed)
- [ ] CONTRIBUTING.md updated (if needed)

#### Repository Index

- [ ] INDEX.md updated (if new files)
- [ ] File Atlas section updated
- [ ] Links verified
- [ ] Descriptions accurate

### 4. Backlog Expanded

#### Analysis Complete

- [ ] Impact of change analyzed
- [ ] Related work identified
- [ ] Improvement opportunities noted
- [ ] Technical debt recorded
- [ ] Performance optimization opportunities noted
- [ ] Security hardening opportunities noted

#### Follow-up Tasks Created

- [ ] New tasks added to BACKLOG.md
- [ ] Each task has clear description
- [ ] Priority assigned (High|Medium|Low)
- [ ] Dependencies documented
- [ ] Rationale provided
- [ ] Acceptance criteria included

**Task Categories:**

- [ ] Bug fixes identified
- [ ] Missing tests noted
- [ ] Documentation gaps listed
- [ ] Refactoring opportunities recorded
- [ ] Feature enhancements proposed
- [ ] Performance improvements suggested
- [ ] Security improvements suggested
- [ ] Accessibility improvements noted

### 5. Session Notes Written

#### What Changed

- [ ] All modified files listed
- [ ] Key code changes summarized
- [ ] Configuration changes documented
- [ ] Dependencies added/removed listed
- [ ] Database migrations (if any)
- [ ] Environment variables (if any)

#### Why Changed

- [ ] Original problem/requirement stated
- [ ] Design decisions explained
- [ ] Alternative approaches considered
- [ ] Tradeoffs documented
- [ ] Constraints acknowledged

#### Verification Details

- [ ] Commands run documented
- [ ] Test results summarized
- [ ] Manual testing steps listed
- [ ] Screenshots included (if UI)
- [ ] Performance metrics (if relevant)

#### Follow-ups

- [ ] All new backlog tasks referenced
- [ ] Rationale for each provided
- [ ] Priorities justified
- [ ] Dependencies explained

#### Limitations & Risks

- [ ] Known limitations documented
- [ ] Edge cases not handled listed
- [ ] Performance considerations noted
- [ ] Security considerations noted
- [ ] Browser/platform limitations noted
- [ ] Future work suggested

#### Session Context

- [ ] Estimated time spent noted
- [ ] Complexity rating (High|Medium|Low)
- [ ] Key challenges documented
- [ ] Lessons learned noted

### 6. Task Archived

#### Archive Entry

- [ ] Task moved from TODO.md to ARCHIVE.md
- [ ] Completion date added (YYYY-MM-DD format)
- [ ] Session notes included
- [ ] Links to follow-up tasks included
- [ ] Task status changed to "Completed"

#### Cleanup

- [ ] TODO.md updated
- [ ] No stale references
- [ ] Related tasks linked
- [ ] Dependencies updated

## Exemptions & Special Cases

### Exemption Documentation

If any checklist item cannot be completed:

- [ ] Reason documented in session notes
- [ ] Follow-up task created in BACKLOG.md
- [ ] Timeline for completion specified
- [ ] Risk assessment completed
- [ ] Approval obtained (if required)

### Common Exemptions

1. **Testing:** Sometimes full test coverage cannot be added immediately
   - Document why (legacy code, test infrastructure missing)
   - Create follow-up task with priority
   - Include minimal smoke test if possible

2. **Documentation:** Some documentation may be deferred
   - Only for internal/experimental code
   - Must have follow-up task
   - Basic inline comments still required

3. **Performance:** Some optimizations may be deferred
   - Document performance baseline
   - Set acceptable thresholds
   - Create optimization task with metrics

### Emergency Fixes

For critical security or production issues:

- [ ] Minimum verification completed
- [ ] Fix deployed/committed
- [ ] Full checklist follow-up task created immediately
- [ ] Post-incident review scheduled
- [ ] Lessons learned documented

## Quality Gate Enforcement

### Pre-Commit

Before committing code:

- [ ] Code compiles
- [ ] Linting passes
- [ ] Formatting applied
- [ ] No debug statements

### Pre-Push

Before pushing to remote:

- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] Commit message clear
- [ ] Related tasks updated

### Pre-Archive

Before archiving task:

- [ ] **ALL** checklist items complete
- [ ] Session notes comprehensive
- [ ] Follow-ups created
- [ ] Documentation updated

## Validation Commands

Use these commands to validate checklist items:

```bash
# Run all quality checks
pnpm test           # Tests
pnpm type-check     # TypeScript
pnpm lint           # ESLint
pnpm build          # Production build
pnpm format:check   # Code formatting

# Run everything in parallel (if supported)
pnpm run-p test type-check lint build

# Development verification
pnpm dev            # Start dev server
```

## Review Checklist

Before archiving, do a final review:

### Code Review

- [ ] Changes are minimal and focused
- [ ] No unrelated changes included
- [ ] Code is readable and maintainable
- [ ] Naming is clear and consistent
- [ ] Complexity is justified

### Documentation Review

- [ ] All documentation is accurate
- [ ] Examples are correct
- [ ] Links work
- [ ] Formatting is consistent
- [ ] Spelling/grammar checked

### Process Review

- [ ] Workflow followed correctly
- [ ] All steps completed
- [ ] Quality gates passed
- [ ] Backlog updated
- [ ] Archive complete

## Metrics Tracking

Track these metrics to ensure quality:

### Per Task

- Time to complete checklist: _____ minutes
- Checklist items failed first time: _____
- Follow-up tasks created: _____

### Per Session

- Tasks completed: _____
- Average checklist time: _____ minutes
- Total follow-ups created: _____
- Quality gate failures: _____

## Tips for Success

### Do's ✅

- Review checklist before starting task
- Check items as you complete them
- Don't rush the process
- Document everything thoroughly
- Ask for help when unsure
- Use automation where possible

### Don'ts ❌

- Skip items to "save time"
- Check items you haven't completed
- Archive incomplete tasks
- Defer documentation indefinitely
- Ignore test failures
- Rush through verification

## Related Documentation

- [TASK_WORKFLOW.md](./TASK_WORKFLOW.md) - Complete workflow process
- [TODO.md](../TODO.md) - Active tasks
- [BACKLOG.md](../BACKLOG.md) - Queued tasks
- [ARCHIVE.md](../ARCHIVE.md) - Completed tasks
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
