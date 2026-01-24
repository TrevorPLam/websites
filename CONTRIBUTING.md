# Contributing Guide

Thank you for contributing to **your-dedicated-marketer**. This project uses a governance-first workflow stored under [`.repo/`](.repo/).

## 1) Prerequisites

- Node.js **20+**
- npm **10+**

## 2) Setup

Install dependencies with the manifest-approved command:

```bash
npm ci --legacy-peer-deps
```

## 3) Task Workflow (Required)

This repository enforces **one active task at a time**.

### Read order before any work

1. [`.repo/tasks/TODO.md`](.repo/tasks/TODO.md)
2. [`.repo/repo.manifest.yaml`](.repo/repo.manifest.yaml)
3. [`.repo/agents/QUICK_REFERENCE.md`](.repo/agents/QUICK_REFERENCE.md)

### Task lifecycle

- Work only on the task in `TODO.md`.
- When the task is complete:
  1. Mark all acceptance criteria as complete (`[x]`).
  2. Add `Completed: YYYY-MM-DD`.
  3. Move the entire task block to [`.repo/tasks/ARCHIVE.md`](.repo/tasks/ARCHIVE.md) (prepend to top).
  4. Promote the highest-priority item from [`.repo/tasks/BACKLOG.md`](.repo/tasks/BACKLOG.md) into `TODO.md` and set status to `In Progress`.

## 4) Development Guidelines

- Prefer small, focused changes.
- Follow existing patterns and naming.
- Do **not** wrap imports in try/catch blocks.

## 5) Testing & Verification (Manifest Commands Only)

Run the required make targets before opening a PR and before committing:

```bash
make lint
make test
make verify
```

> Do not guess alternative commands. Use the manifest-approved workflow.

## 6) Governance Logs (Non-doc Changes)

For any change that is not doc-only, generate both logs:

```bash
./scripts/generate-trace-log.sh TASK-XXX "brief intent"
./scripts/generate-agent-log.sh TASK-XXX "brief action"
```

Then update the generated files under:

- [`.repo/traces/`](.repo/traces/)
- [`.repo/logs/`](.repo/logs/)

Include filepaths, commands run, evidence, and any risks or follow-ups.

## 7) Pull Request Requirements

PRs must follow the repository template and governance policies:

- PR template: [`.repo/templates/PR_TEMPLATE.md`](.repo/templates/PR_TEMPLATE.md)
- PR review checklist: [`.repo/agents/checklists/pr-review.md`](.repo/agents/checklists/pr-review.md)
- Quality gates: [`.repo/policy/QUALITY_GATES.md`](.repo/policy/QUALITY_GATES.md)
- HITL policy: [`.repo/policy/HITL.md`](.repo/policy/HITL.md)

Every PR should clearly state:

- What changed
- Why it changed
- Which files were touched (with filepaths)
- What verification was run
- Risks and rollback plan

## 8) CODEOWNERS

Code ownership and reviewer routing are defined in [`.github/CODEOWNERS`](.github/CODEOWNERS).
