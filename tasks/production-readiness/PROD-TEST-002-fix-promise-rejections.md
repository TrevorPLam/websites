---
id: PROD-TEST-002-fix-promise-rejections
title: Fail tests on unhandled promise rejections in shared setup.
status: completed
priority: high
type: implementation
created: 2026-02-24
updated: 2026-02-24
completed: 2026-02-24
owner: ai-agent
---

## Objective

Fail tests on unhandled promise rejections in shared setup.

## Implementation Notes

- Completed as part of the 10-task execution batch.
- Updated related configuration/code and TODO tracking.

## QA Evidence

- `pnpm tokens:generate`
- `pnpm validate:fsd`
- `pnpm test -- --runInBand`
