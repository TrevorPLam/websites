# Agent instructions for marketing-websites

**Full context:** [CLAUDE.md](CLAUDE.md). This file is a short briefing; use it with the doc map below.

---

## Task execution non-negotiables

Full checklist: [.context/RULES.md](.context/RULES.md#task-execution-non-negotiables). Before any task: read [THEGOAL.md](THEGOAL.md).

1. THEGOAL alignment 2. **Evolution alignment:** Read [NEW.md](NEW.md) and [evolution-roadmap](docs/architecture/evolution-roadmap.md) for phase/week sequencing before major feature work 3. Research (02/2026 basics, best practices) 4. Code/examples from research + implementation 5. Refactor tasks if research contradicts current patterns 6. QA: isolation → related files → full codebase 7. Testing/validation (required) 8. Documentation (required) 9. New tasks if needed 10. Lessons learned → tasks/docs 11. Commit & push

---

## Doc map

| Resource                               | Purpose                                 |
| -------------------------------------- | --------------------------------------- |
| [.context/MAP.md](.context/MAP.md)     | Concept → file mapping (semantic index) |
| [.context/RULES.md](.context/RULES.md) | Guardrails, conventions, anti-patterns  |
| [llms.txt](llms.txt)                   | AI documentation index                  |
| [CONTRIBUTING.md](CONTRIBUTING.md)     | PR and commit workflow                  |
| [docs/README.md](docs/README.md)       | Documentation hub (Diátaxis)            |

---

## Build & test

- **Install:** `pnpm install`
- **Dev (prefer during iteration):** `pnpm dev` or `pnpm --filter @clients/testing-not-a-client dev` (testing template on port **3101**). Prefer dev over `pnpm build` while iterating.
- **Quality:** `pnpm lint`, `pnpm type-check`, `pnpm test`
- **Validation:** `pnpm validate-exports`, `pnpm validate-client [path]` (e.g. `clients/luxe-salon`), optionally `pnpm validate-docs`
- **Full build:** `pnpm build` (use when verifying CI or before release)

---

## Architecture

- **CaCA:** Single source of truth is `site.config.ts` per client. No hardcoded client values in components.
- **Layers:** L0 = `@repo/infra`, `@repo/integrations-*`; L2 = `@repo/ui`, `@repo/features`, `@repo/types`, `@repo/utils`; L3 = `clients/*`.
- **Dependencies:** `clients/` → `@repo/*` only, via **public exports**. Never: packages → clients, clients → clients, or deep internal imports (e.g. `@repo/infra/src/internal`).
- **Versions:** pnpm **10.29.2** (strict), Node **≥22**. Use `pnpm-workspace.yaml` catalog when available.

---

## Code style

- **TypeScript:** Strict mode, no `any`; handle `noUncheckedIndexedAccess` (array/object access may be `undefined`).
- **React:** Functional components and hooks only; use Server Components where possible.
- **Styling:** Tailwind CSS 4 with `cn()` from `@repo/utils`.
- **Lint:** ESLint 9 flat config (`eslint.config.mjs`); Prettier: single quotes, printWidth 100, trailing comma es5.
- **Packages:** Add file headers and export via package `index.ts`; run `validate-exports` after changes.

---

## Validation chain (before commit)

1. `pnpm lint`
2. `pnpm type-check`
3. `pnpm test`
4. `pnpm validate-exports`
5. For client changes: `pnpm validate-client [path]`
6. Optional: `pnpm validate-docs`

---

## Gotchas

- **pnpm:** Must be exactly 10.29.2 (enforced by `packageManager`).
- **Imports:** Use package public exports only; no deep paths.
- **Cross-client:** No imports between clients.
- **@repo/ui:** React is a peer dependency; do not add React as a direct dependency there.
- **Env:** Supabase, Upstash Redis, and booking providers require **both** variables in a pair (or neither).
- **Starter port:** 3101.

---

## Security & PR

- No hardcoded secrets; use environment variables and schemas in `packages/infra/env/schemas/`.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for PR and commit guidelines.
- Run quality gates before pushing.

---

## Methodology

- **CaCA-first:** Prefer changes via `site.config.ts` and feature flags over new client-specific code.
- **Validate after changes:** Run relevant `validate-*` and `type-check` after touching exports or client config.
- **Single source of truth:** CLAUDE.md and .context/RULES.md are canonical; this file is a briefing that links to them.

---

## Platform discovery

| Platform    | Primary file(s)                                                     | Additional            |
| ----------- | ------------------------------------------------------------------- | --------------------- |
| Cursor      | `AGENTS.md` (root)                                                  | `.cursor/rules/*.mdc` |
| Codex       | `AGENTS.md` (root), `AGENTS.override.md` (nested)                   | —                     |
| Windsurf    | `AGENTS.md` (root + nested in clients/, packages/)                  | `.windsurf/rules/`    |
| Claude Code | `CLAUDE.md` (root)                                                  | `.claude/rules/*.md`  |
| Qwen Code   | `QWEN.md`, `AGENTS.md` (via `.qwen/settings.json` context.fileName) | `.qwen/skills/`       |

Keep this file under ~150 lines for agent effectiveness.
