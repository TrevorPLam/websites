# Domain 3 — FSD Layer Architecture Baseline

## Canonical Layer Order

`app → pages → widgets → features → entities → shared`

## Dependency Direction

- Imports must flow from left to right in the canonical order above.
- Lower layers MUST NOT import from higher layers.
- Cross-slice imports require explicit intent and must be minimized.

## Package Mapping (Current Repo)

- `packages/infra` and `packages/integrations/*`: foundational shared/infrastructure capabilities.
- `packages/ui`, `packages/features`, `packages/types`, `packages/utils`: reusable UI/business layers.
- `clients/*`: experience layer consuming packages.

## Enforcement

- Architectural rules are represented in `steiger.config.ts`.
- CI check command: `pnpm lint:fsd`.
