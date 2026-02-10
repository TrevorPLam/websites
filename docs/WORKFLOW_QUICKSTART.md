<!--
/**
 * @file WORKFLOW_QUICKSTART.md
 * @role docs
 * @summary Quick reference guide for task workflow.
 *
 * @entrypoints
 * - Quick lookup during development
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/TASK_WORKFLOW.md (complete documentation)
 *
 * @used_by
 * - Developers, automated agents
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: task workflow requirements
 * - outputs: quick reference commands
 *
 * @invariants
 * - Must align with full workflow documentation
 *
 * @gotchas
 * - This is a quick reference, not complete documentation
 *
 * @issues
 * - None identified
 *
 * @opportunities
 * - Add task checklists
 * - Add automation scripts
 *
 * @verification
 * - Validated: Commands align with project setup
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Task Workflow Quick Reference

## 📋 Quick Links

- **Full documentation:** [docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md)
- **Quality checklist:** [docs/DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)
- **Active tasks:** [TODO.md](TODO.md)
- **Task queue:** [BACKLOG.md](BACKLOG.md)
- **Completed:** [ARCHIVE.md](ARCHIVE.md)

## 🔄 Task Lifecycle (30 seconds)

```
Execute → Verify → Document → Reflect → Archive
```

1. **Execute** - Implement the task
2. **Verify** - Run tests, lint, build
3. **Document** - Update code comments and docs
4. **Reflect** - Add follow-ups to backlog
5. **Archive** - Write session notes, move to ARCHIVE.md

## ✅ Quick Verification

```bash
# Run all quality checks
pnpm test           # Tests
pnpm type-check     # TypeScript
pnpm lint           # ESLint
pnpm build          # Production build
pnpm format:check   # Formatting

# Start dev server for manual testing
pnpm dev
```

## 📝 Task Is Done When...

- [ ] All acceptance criteria met
- [ ] All tests pass
- [ ] No type errors
- [ ] No lint errors
- [ ] Build succeeds
- [ ] Manual testing complete
- [ ] Meta headers updated
- [ ] Documentation updated
- [ ] Follow-up tasks in BACKLOG.md
- [ ] Session notes written
- [ ] Task moved to ARCHIVE.md

## 📄 Meta Header Template

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
 * - <dependencies>
 *
 * @used_by
 * - <consumers>
 *
 * @runtime
 * - environment: <node|browser|edge>
 * - side_effects: <any side effects>
 *
 * @data_flow
 * - inputs: <data in>
 * - outputs: <data out>
 *
 * @invariants
 * - <must be true>
 *
 * @gotchas
 * - <pitfalls>
 *
 * @issues
 * - <known issues>
 *
 * @opportunities
 * - <improvements>
 *
 * @verification
 * - <how to verify>
 *
 * @status
 * - confidence: <high|medium|low>
 * - last_audited: <YYYY-MM-DD>
 */
```

## 📋 Task Template

```markdown
### Task: [Task Title]

**Priority:** [High|Medium|Low]
**Status:** [Todo|In Progress|Done]
**Dependencies:** [List or "None"]

**Description:**
[What needs to be done]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Files to Modify:**
- file1.ts
- file2.tsx

**Verification:**
[How to verify]

**Notes:**
[Additional context]
```

## 📝 Session Notes Template

```markdown
### [Task Title] - Completed [YYYY-MM-DD]

**What Changed:**
- Files: [list]
- Modifications: [summary]

**Why:**
- Intent: [problem]
- Decisions: [rationale]

**Verification:**
- Commands: [what was run]
- Results: [summary]

**Follow-ups:**
1. [Task] - [rationale] - [priority]

**Limitations:**
- [Known limitation 1]
```

## 🚀 Common Commands

### Starting a Task

```bash
# Pull latest
git pull

# Check active tasks
cat TODO.md

# Start work
git checkout -b feat/task-name
```

### During Development

```bash
# Quick check
pnpm lint && pnpm type-check

# Run tests
pnpm test

# Manual test
pnpm dev
```

### Before Committing

```bash
# Full verification
pnpm test
pnpm type-check
pnpm lint
pnpm build

# Format code
pnpm format

# Check git status
git status
git diff
```

### Completing a Task

1. Verify Definition of Done checklist
2. Write session notes
3. Move task from TODO.md to ARCHIVE.md
4. Add follow-ups to BACKLOG.md
5. Commit and push

```bash
git add .
git commit -m "feat: descriptive message"
git push
```

## 📊 File Organization

```
Repository Root
├── TODO.md                          # Active tasks
├── BACKLOG.md                       # Queued tasks
├── ARCHIVE.md                       # Completed with notes
├── docs/
│   ├── TASK_WORKFLOW.md            # Full workflow docs
│   ├── DEFINITION_OF_DONE.md       # Quality checklist
│   └── ...
└── ...
```

## ⚡ Pro Tips

1. **Read the full task** before starting
2. **Break large tasks** into smaller units
3. **Document as you go**, not after
4. **Test continuously**, not at the end
5. **Write clear commit messages**
6. **Update backlog immediately** after completion
7. **Write detailed session notes** while context is fresh

## 🚫 Common Mistakes

- ❌ Skipping verification steps
- ❌ Not updating documentation
- ❌ Forgetting to add follow-up tasks
- ❌ Writing incomplete session notes
- ❌ Not running all quality checks
- ❌ Making changes outside task scope

## 🆘 Need Help?

- **Full documentation:** [docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md)
- **Quality checklist:** [docs/DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)
- **Contributing guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Repository index:** [INDEX.md](INDEX.md)
