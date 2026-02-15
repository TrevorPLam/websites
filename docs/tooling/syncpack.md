# Syncpack — Dependency Version Consistency

**Last Updated:** 2026-02-14  
**Related Tasks:** 0.18, 0.27  
**AI/Assistant Notes:** Syncpack v13 used for stability; v14 alpha available with `lint`/`fix` commands.

## Purpose

[Syncpack](https://syncpack.dev/) ensures consistent dependency versions across JavaScript monorepos. It would have caught the zod version mismatch (catalog `^3.22.0` vs infra `^3.23.0`), React not using catalog (Task 0.27), and other version drift.

## Usage

```bash
# Check for version mismatches (CI blocking)
pnpm syncpack:check

# Auto-fix mismatches
pnpm syncpack:fix
```

Exit code 1 indicates mismatches found. Use `syncpack:fix` to autofix most issues.

## Configuration

- **`.syncpackrc.json`** — Root configuration
- Uses pnpm workspace discovery from `pnpm-workspace.yaml`
- Version groups configured for pnpm catalog and workspace protocol

### Version Groups (Ignored)

| Group                               | Purpose                                               |
| ----------------------------------- | ----------------------------------------------------- |
| `@repo/**`                          | Workspace packages — always use `workspace:*`         |
| `unsupported`, `workspace-protocol` | pnpm `catalog:` — versions from `pnpm-workspace.yaml` |
| `local`                             | Local workspace references                            |

These are excluded from mismatch checking because pnpm handles them via catalog and workspace protocol.

### Semver Groups

- **Peer dependencies:** Use `^` range for flexibility (consumers can resolve within range)

### What Syncpack Enforces

- Same version or compatible range for each dependency across packages
- Consistent semver format (exact vs `^` vs `~`) per dependency type
- No version drift when adding new packages

## CI Integration

Syncpack runs as a **blocking** check after type-check and before build. PRs must pass `pnpm syncpack:check` to merge.

## Interpreting Results

| Status                  | Action                                                          |
| ----------------------- | --------------------------------------------------------------- |
| `HighestSemverMismatch` | Use `syncpack:fix` — one package has exact, another has range   |
| `SemverRangeMismatch`   | Use `syncpack:fix` — different range formats (e.g. `>=` vs `^`) |
| `UnsupportedMismatch`   | Usually `catalog:` — ensure version group ignores it            |
| `LocalPackageMismatch`  | Workspace dep — ensure `@repo/**` is ignored                    |

## Relation to pnpm Catalog

- **Catalog** (`pnpm-workspace.yaml` catalog + `catalog:` in package.json) is the source of truth for shared versions
- **Syncpack** enforces consistency for dependencies _not_ using catalog
- When adding a new package, prefer `catalog:` for dependencies in the catalog
- Run `pnpm syncpack:check` after adding dependencies to catch drift

## References

- [Syncpack Documentation](https://syncpack.dev/)
- [Version Groups](https://syncpack.dev/version-groups/)
- [pnpm Catalog](https://pnpm.io/catalogs) — see `docs/tooling/pnpm.md`
