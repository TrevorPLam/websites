---
id: PROD-TEST-001-fix-test-timeouts
title: Increase Vitest timeouts and configure fake timers for async stability.
status: completed
priority: high
type: implementation
created: 2026-02-24
updated: 2026-02-24
completed: 2026-02-24
owner: ai-agent
---

## Objective

Increase Vitest timeouts and configure fake timers for async stability.

## Implementation Notes

- Completed as part of the 10-task execution batch.
- Updated related configuration/code and TODO tracking.

## QA Evidence

- `pnpm tokens:generate`
- `pnpm validate:fsd`
- `pnpm test -- --runInBand`
