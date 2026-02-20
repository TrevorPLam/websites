# Package-specific agent instructions

**Scope:** Files in `packages/**`. Root [AGENTS.md](../AGENTS.md) applies globally. Task non-negotiables: [.context/RULES.md](../.context/RULES.md#task-execution-non-negotiables).

---

## Layer model

- **L0:** `@repo/infra`, `@repo/integrations-*` — security, middleware, logging
- **L2:** `@repo/ui`, `@repo/features`, `@repo/types`, `@repo/utils` — components, business logic
- **L3:** `clients/*` — experience layer (consumes packages)

**Evolution (Phase 3+):** Capability layer — `@repo/infra/features` with `defineFeature`, `featureRegistry`. Features self-declare sections, integrations, dataContracts. See [evolution-roadmap](../docs/architecture/evolution-roadmap.md) and tasks/evol-7, evol-8.

---

## Dependency rules

- **Allowed:** `@repo/features` → `@repo/ui`, `@repo/utils`, `@repo/types`, `@repo/infra`
- **Allowed:** `@repo/ui` → `@repo/utils`, `@repo/types`
- **Forbidden:** Any package → `clients/`
- **Forbidden:** Deep imports (e.g. `@repo/infra/src/internal`) — use public exports only

---

## Adding a package

1. Create `packages/<name>/` with `package.json` name `@repo/<name>`
2. Extend `@repo/typescript-config` in `tsconfig.json`
3. Add `eslint.config.mjs` extending `@repo/eslint-config`
4. Export from `src/index.ts`
5. Declare React as `peerDependencies` if used (not direct)
6. Run `pnpm validate-exports` after adding exports

---

## File headers

Add structured comment blocks per [.context/RULES.md](../.context/RULES.md). Include `@file`, `@summary`, `@exports`, `@invariants`, `@gotchas`.

---

## Tests

- **Node env:** Server utilities, lib/, actions
- **jsdom env:** React components
- Location: `__tests__/` or co-located `*.test.ts(x)`
- Use `@testing-library/react`, `jest-axe` for UI
