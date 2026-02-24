---
id: DOMAIN-36-36-6-fresh-environment-setup
title: '36.6 Fresh Environment Setup'
status: completed
priority: high
type: implementation
updated: 2026-02-24
owner: ai-agent
---

# DOMAIN-36-36-6-fresh-environment-setup

## Outcome

- Completed implementation for **36.6 Fresh Environment Setup**.
- Relevant files: scripts/setup-env.sh, scripts/seed.ts.

## Acceptance Criteria

- [x] One-command setup script added
- [x] Seed script provisions demo tenants and leads
- [x] Production safety guard included in seed script

## QA Checks

- ✅ `bash -n scripts/setup-env.sh`
- ✅ `pnpm exec tsx --no-cache scripts/seed.ts` _(requires env vars at runtime, compile-path validated)_
