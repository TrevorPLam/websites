# marketing-websites — Qwen Code context

**Full context:** [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md). This file is loaded via `context.fileName` in `.qwen/settings.json`.

---

## Build & test

- `pnpm install`, `pnpm dev` (or `pnpm --filter @clients/starter-template dev` for starter, port 3101)
- `pnpm lint`, `pnpm type-check`, `pnpm test`
- `pnpm validate-exports`, `pnpm validate-client [path]`

---

## Architecture

- CaCA: `site.config.ts` drives all client behavior
- Layers: L0 (infra), L2 (ui, features, types, utils), L3 (clients)
- clients → @repo/\* only; public exports only; pnpm 10.29.2, Node ≥22

---

## Task non-negotiables

Before any task: read THEGOAL.md and NEW.md/evolution-roadmap.md for phase sequencing. Full checklist in .context/RULES.md. Key: research (02/2026), examples, 3-pass QA, testing required, documentation required, commit & push.

---

## Gotchas

- pnpm exactly 10.29.2; no deep imports; paired env vars (Supabase, Upstash, booking); starter port 3101
