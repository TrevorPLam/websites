# Requirements Synthesis Workflow

## Goal

Convert open TODO tasks into normalized requirement records and detect overlap early.

## Inputs

- `TODO.md`
- `docs/plan/**`

## Outputs

- `docs/plan/domain-37/requirements-synthesis.json`
- conflict report from `scripts/ai/flag-requirement-conflicts.mjs`

## Commands

- `pnpm ai:synthesize-requirements`
- `pnpm ai:flag-conflicts`
