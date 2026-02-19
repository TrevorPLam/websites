# Client-specific agent instructions

**Scope:** Files in `clients/**`. Root [AGENTS.md](../AGENTS.md) applies globally. Task non-negotiables: [.context/RULES.md](../.context/RULES.md#task-execution-non-negotiables).

---

## Creating a new client

1. Copy `clients/starter-template/` to `clients/<name>/`
2. Update `package.json` name to `@clients/<name>`
3. Modify `site.config.ts` only — no hardcoded client values in components
4. Copy `.env.example` to `.env.local` and configure
5. Use a unique port (e.g. `--port 3102` for second client)
6. Run `pnpm validate-client clients/<name>`

---

## Rules

- **CaCA only:** All client-specific behavior via `site.config.ts` (theme, nav, features, integrations, SEO)
- **No cross-client imports:** Never import from another client
- **Dependencies:** Use `@repo/*` packages via public exports only
- **Validation:** Run `pnpm validate-client [path]` before commit

---

## Starter template (port 3101)

Golden path: `clients/starter-template`. Dev: `pnpm --filter @clients/starter-template dev`
