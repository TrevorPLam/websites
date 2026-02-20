# marketing-websites Workspace Rules

Plain markdown rules for Windsurf Cascade. See [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md) for full context.

## Task Execution Non-Negotiables

Before any task: read [THEGOAL.md](../../THEGOAL.md) and [NEW.md](../../NEW.md) / [evolution-roadmap.md](../../docs/architecture/evolution-roadmap.md) for phase sequencing. Full checklist: [.context/RULES.md](../../.context/RULES.md).

1. THEGOAL alignment | 2. Research (02/2026) | 3. Examples from research + code | 4. Refactor tasks if research contradicts | 5. QA: isolation → related → full codebase | 6. Testing required | 7. Documentation required | 8. New tasks if needed | 9. Lessons learned | 10. Commit & push

## Architecture

- CaCA: `site.config.ts` drives all client behavior. No hardcoded client values.
- Layers: L0 (infra), L2 (ui, features, types, utils), L3 (clients)
- Clients → @repo/\* only; never packages → clients; never clients → clients
- Public exports only; no deep internal imports

## Commands

- `pnpm install`, `pnpm dev` (prefer over build during iteration)
- `pnpm lint`, `pnpm type-check`, `pnpm test`
- `pnpm validate-exports`, `pnpm validate-client [path]`
- Starter: `pnpm --filter @clients/starter-template dev` (port 3101)

## Conventions

- TypeScript strict; React functional + Server Components; Tailwind + cn()
- pnpm 10.29.2, Node ≥22
- Run validate-exports after touching package exports
- Run validate-client for client changes
