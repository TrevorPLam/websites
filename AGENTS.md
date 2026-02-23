# Marketing Monorepo — AI Agent Master Context

## Overview

- Multi-tenant, multi-site Next.js 16 marketing platform.
- Architecture baseline: Feature-Sliced Design (FSD) v2.1.

## Stack

- Next.js 16, React 19, Tailwind CSS v4
- Turborepo, pnpm, TypeScript
- Supabase, Upstash, Tinybird

## Repository Map

- `clients/*` — tenant apps
- `packages/*` — shared libraries
- `docs/*` — plan docs, guides, architecture records
- `scripts/*` — validations and operational automation

## Core Rules

- Respect FSD layers: `app → pages → widgets → features → entities → shared`.
- Prefer public exports (`index.ts`), avoid deep internal imports.
- Use `@x` notation for cross-slice imports where required.
- Keep changes scoped and update plan + TODO artifacts.

## Security Baseline

- Use approved server action wrappers and input validation.
- Keep tenant isolation explicit in data access paths.
- Avoid leaking secrets in logs and docs.

## Quality Workflow

- Run focused QA for each completed task.
- Run a final QA sweep before commit.
- Update task docs and `TODO.md` to reflect status.

## AI Session Cold Start

1. Read this file.
2. Read relevant scoped `AGENTS.md` files (for target packages).
3. Read the active domain task file(s) in `docs/plan`.
4. Check current branch and uncommitted changes.

## Useful Commands

- `pnpm lint`
- `pnpm test`
- `pnpm validate-docs`
- `pnpm validate:configs`
