# pnpm Configuration

**Last Updated:** 2026-02-14  
**Related Tasks:** 0.1, 0.2, C.2

## Node Linker Strategy

This project uses `node-linker=pnpm` (symlink-based resolution) as configured in `.pnpmrc`.

### Why not `hoisted`?

| Concern                    | `hoisted`                                 | `pnpm` (symlink)                             |
| -------------------------- | ----------------------------------------- | -------------------------------------------- |
| Phantom dependencies       | Allows undeclared imports                 | Strictly enforced                            |
| Workspace isolation        | Weak — packages can access siblings' deps | Strong — only declared deps visible          |
| Peer dependency resolution | Ambiguous in monorepos                    | Explicit via `strict-peer-dependencies=true` |
| Disk usage                 | Duplicates across packages                | Content-addressable store (deduped)          |
| CI reproducibility         | Depends on hoist order                    | Deterministic symlink graph                  |

### Configuration Files

- **`.pnpmrc`** — Authoritative pnpm settings (node-linker, peer deps, recursive install)
- **`.npmrc`** — Registry URL only; node-linker line was removed in Task 0.1 to resolve conflict
- **`pnpm-workspace.yaml`** — Workspace package globs + version catalog

### Workspace Policy

- All workspace changes must update both `package.json` workspaces AND `pnpm-workspace.yaml` in the same PR
- Use `catalog:` protocol for shared dependency versions (see `pnpm-workspace.yaml` catalog section);
  **all workspace package.json files are now aligned to catalog as of 2026-02-14**
- Run `pnpm -r list --depth -1` to verify workspace package discovery after changes
- Preferred hardening: add `catalogMode=strict` to `.npmrc` to prevent non-catalog versions (optional once teams agree)
- **syncpack** (see `docs/tooling/syncpack.md`) enforces consistency for non-catalog dependencies; run `pnpm syncpack:check` after adding deps
- **validate-exports** (see `docs/tooling/validate-exports.md`) verifies all package.json export paths resolve to existing files; run `pnpm validate-exports` before adding new exports

### Windows Notes

If path-length warnings appear on Windows:

```ini
# Add to .pnpmrc
virtual-store-dir=.pnpm-store
```

This shortens the virtual store path to avoid Windows MAX_PATH (260 char) limitations.
