# Migration Map: @repo/shared → @repo/types

## Summary

- Objective: Relocate the shared SiteConfig types from `templates/shared` to a dedicated workspace package
  `packages/types` while preserving all consumers.
- Current state: `@repo/types` exists with SiteConfig + Zod schema; all template imports point to `@repo/types`; Jest
  alias updated.
- Outcome: No remaining references to `templates/shared/*`; package is workspace-scoped and versioned; ready for future
  industry/type expansions.

## Old → New Paths

| Scope              | Old import                                               | New import                                                | Notes                                  |
| ------------------ | -------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------- |
| Types entrypoint   | `@repo/shared/types`                                     | `@repo/types`                                             | Barrel exports SiteConfig + flow types |
| Site config schema | (none)                                                   | `@repo/types/site-config`                                 | Zod schema co-located                  |
| Site config schema | (none)                                                   | `@repo/types/site-config-schema`                          | Zod schema co-located (alias)          |
| Jest alias         | `'^@repo/shared/(.*)$': '<rootDir>/templates/shared/$1'` | `'^@repo/types/(.*)$': '<rootDir>/packages/types/src/$1'` | Implemented in `jest.config.js`        |

## Compatibility & Safety

- Backward compatibility: Public types unchanged; discriminated union for `conversionFlow` retained
  (booking/contact/quote/dispatch).
- Workspace wiring: `package.json` and `pnpm-workspace.yaml` include `packages/types`; exports map provides both `.`
  and specific site-config paths.
- Tooling: Jest moduleNameMapper updated; TypeScript resolves via workspace paths; no deep imports required.
- Security & integrity: Package is private and contains only types/schemas (no runtime side effects). Maintains
  supply-chain hygiene within monorepo.

## Verification

- Grep confirms no remaining `@repo/shared` or `templates/shared` imports in code.
- `jest.config.js` aliases point to `@repo/types` sources.
- No code was moved in this pass; only documentation/status updates were required because migration already exists in
  repo state.

## Forward Work (related tasks)

- Task 1.8: Extend `SiteConfig` (industry/features/integrations) atop current `@repo/types` package.
- Task 1.9: Add industry presets using the existing `@repo/types` package for shared distribution.
- Consider adding `@repo/types` publish/pack tests in CI to guarantee export map integrity (complements
  `validate-exports`).
