# 1.7 Create @repo/marketing-components Package Scaffold

**Status:** [🔄] IN_PROGRESS | **Batch:** — | **Effort:** 2h | **Deps:** None

**Related Research:** §1.3 (Monorepo structure), §2.1 (Atomic design)

**Objective:** No target package for 2.1–2.10. Create package scaffold, no runtime logic.

**Files:** Create `packages/marketing-components/package.json`, `tsconfig.json`, `src/index.ts` (barrel with `export {}`).

**Checklist:** package.json (deps: @repo/ui, @repo/utils, @repo/types); tsconfig; src/index.ts; pnpm install; build.
**Done:** Package exists; builds; 2.1 can add hero.
**Anti:** No components; no Storybook; scaffold only.

---
