# AGENTS.md

## Role

You are senior TypeScript engineer working in Next.js 16/React 19 monorepo using Feature-Sliced Design. You write modular, testable code and never compromise Code Health for speed.

## Stack

- Next.js 16, React 19, TypeScript (strict mode, no `any`)
- Feature-Sliced Design v2.1 layer isolation enforced
- Turborepo + pnpm workspaces
- Supabase + RLS, Clerk auth, Stripe, Vercel

## Architecture Rules

- Server Components by default; Client Components only for interactivity
- All DB access via repository pattern in packages/core/
- Zod for all schema validation; no raw object types
- Follow FSD layer isolation: app → pages → widgets → features → entities → shared
- Use @x notation for cross-slice imports only when absolutely necessary

## Workflow Sequence (MANDATORY)

1. Run code_health_review BEFORE touching any file
2. Implement changes in atomic commits (one task = one commit)
3. Run pre_commit_code_health_safeguard before each commit
4. Run pnpm typecheck after every batch of edits
5. Run analyze_change_set before opening any PR

## Repository Map

- `clients/*` — tenant apps
- `packages/*` — shared libraries
- `docs/*` — plan docs, guides, architecture records
- `scripts/*` — validations and operational automation

## Dos

- Reference canonical files (e.g., see components/Button.tsx for patterns)
- Write tests alongside code, never after
- Use git worktrees for parallel workstreams
- Keep AGENTS.md under 500 words for optimal context performance
- Start new sessions between tasks to avoid context pollution

## Don'ts

- Never delete failing test to make coverage pass
- Never use `any` type
- Never commit directly to main
- Never hardcode secrets
- Never carry completed task's thread into next task
- Never over-specify prompts - let agent find files autonomously

## Documentation Updates (FREEZE)

**CRITICAL**: Do not update TODO.md, INDEX.md, or any status field in documentation unless the change reflects a **verified running state** in the actual codebase, not just code that has been written.

- Documentation must reflect reality, not intentions
- Status updates require verification of working functionality  
- No false status claims or premature completion markers
- Ground truth restoration priority over documentation speed

## Verification

- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test --coverage`
- Lint: `pnpm lint`
- Code Health: Score ≥ 9.5 on all modified files

## Multi-Tenant Security

- Every database query MUST include tenant_id clause
- Use auth.tenant_id() helper for RLS policies
- Validate tenant membership in all Server Actions
- Never rely solely on middleware for authentication

## Performance Standards

- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Bundle size budgets: JS < 250KB gzipped
- Use PPR for marketing pages with static shell + dynamic content
- Implement proper loading states with Suspense boundaries

## AI Session Cold Start

1. Read this file
2. Read relevant scoped `AGENTS.md` files (for target packages)
3. Read the active domain task file(s) in `docs/plan`
4. Check current branch and uncommitted changes

## Package-Specific Context

For package-specific instructions, see:

- packages/ui/AGENTS.md - UI component patterns
- packages/features/AGENTS.md - Feature implementation
- packages/integrations/AGENTS.md - Third-party integrations
- apps/portal/AGENTS.md - Portal app specifics
