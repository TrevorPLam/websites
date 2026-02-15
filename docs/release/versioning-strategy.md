---
last_updated: 2026-02-14
status: adopted
owner: platform
---

# Versioning & Release Strategy (Changesets)

## Overview

We use [Changesets](https://github.com/changesets/changesets) to drive semantic versioning and changelog
generation across the monorepo. Stable releases are cut from `main`; canary pre-releases come from
`develop`.

## Commands

- `pnpm changeset` — create a changeset (select bump type per package).
- `pnpm version-packages` — apply pending changesets, bump versions, update lockfile.
- `pnpm release` — publish updated packages to the registry.

## Branching & Channels

- **Stable:** `main` → publishes with the default `latest` tag.
- **Canary:** `develop` → publishes with the `canary` tag using pre mode for commit-scoped builds.

## CI Workflow

- `.github/workflows/release.yml`
  - `changesets` job: on `main`/`develop`, creates a release PR or publishes when changesets exist.
  - `canary` job: on `develop`, enters pre mode (`canary`), versions, installs, publishes with `--tag
canary`, then exits pre mode.

## Registry & Access

- `access: "restricted"` (scoped, private by default). Flip to `public` before first public publish if required.
- Requires secrets: `NPM_TOKEN` (publish), `GITHUB_TOKEN` (PR automation).

## Policies

- Every change that affects runtime or public API must include a changeset (enforced in review).
- Prefer **patch** for internal refactors, **minor** for additive changes, **major** for breaking changes
  (documented in PR).
- Changelogs are generated per package; keep human-friendly summaries.

## How to cut a release locally

1. `pnpm changeset` (or reuse pending sets)
2. `pnpm version-packages`
3. `pnpm test && pnpm lint && pnpm type-check`
4. `pnpm release` (requires `NPM_TOKEN`)

## Troubleshooting

- Missing secret → workflow fails at publish; add `NPM_TOKEN` with `automation` scope.
- Pre mode stuck → run `pnpm changeset pre exit` on `develop` to reset.
- Lockfile drift after versioning → re-run `pnpm install --no-frozen-lockfile` and commit the lockfile.

## References

- ANALYSIS_ENHANCED.md §1.2 (workspace config)
- TODO.md Task 0.12
- RESEARCH_ENHANCED.md §1.2 (2026 tooling landscape)
