# Marketing Monorepo — AI Agent Master Context

## Overview

- Multi-tenant, multi-site Next.js 16 marketing platform.
- Architecture baseline: Feature-Sliced Design (FSD) v2.1.

## Stack

- **Framework**: Next.js 16.1.5 with App Router
- **UI**: React 19.0.0 with Server Components
- **Language**: TypeScript 5.9.3 (strict mode)
- **Styling**: Tailwind CSS v4
- **Build**: Turborepo 2.8.10 + pnpm 10.29.2
- **Database**: Supabase (PostgreSQL + Realtime)
- **Cache**: Upstash Redis
- **Analytics**: Tinybird
- **Monitoring**: Sentry + OpenTelemetry

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

## Related Documentation

- **[README.md](README.md)** - Project overview and quick start
- **[INDEX.md](INDEX.md)** - Complete repository index
- **[DESIGN.md](DESIGN.md)** - Design philosophy and architecture
- **[CODEMAP.md](CODEMAP.md)** - Code navigation and diagrams
- **[TODO.md](TODO.md)** - Task tracking and progress
