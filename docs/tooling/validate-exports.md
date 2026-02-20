# validate-exports — Export Map Validation

**Last Updated:** 2026-02-14  
**Related Tasks:** 0.19, 0.10, 0.11 (module-boundaries)  
**Related Docs:** `docs/architecture/module-boundaries.md`  
**AI/Assistant Notes:** Script prevents latent BUG-1-style issues where `package.json` exports reference non-existent files.

## Purpose

Validates that every entry in every workspace `package.json` `exports` field resolves to an actual file on disk. Catches typos, wrong paths, and stale exports that would cause runtime `module not found` errors.

**Prevents:** Broken export paths like `"./security/create-middleware": "./security/create-middleware.ts"` when the file actually lives at `middleware/create-middleware.ts`.

## Usage

```bash
# Validate all workspace package exports (CI step)
pnpm validate-exports
```

- **Exit code 0:** All exports resolve to existing files
- **Exit code 1:** One or more broken exports; script prints package name, export key, target path, and resolved absolute path

## Scope

Scans workspace roots per `pnpm-workspace.yaml`:

- `packages/*`
- `packages/config/*`
- `packages/integrations/*`
- `clients/*`

Packages without an `exports` field are skipped.

## Supported Export Structures

| Format | Example | Validation |
|--------|---------|------------|
| Simple string | `".": "./index.ts"` | Resolves `./index.ts` relative to package dir |
| Subpath | `"./client": "./index.client.ts"` | Same |
| Conditional | `".": { "import": "./x.mjs", "default": "./x.js" }` | All condition values validated |
| Nested conditional | `".": { "node": { "import": "./x.mjs" } }` | Recursively extracts paths |

Paths must start with `./`. Non-path condition keys (e.g., `"node"`, `"browser"`) are not treated as file paths.

## CI Integration

Runs as a **blocking** step after type-check and before syncpack. PRs must pass `pnpm validate-exports` to merge.

```yaml
# .github/workflows/ci.yml
- name: Validate exports
  run: pnpm validate-exports
```

## Interpreting Results

| Output | Action |
|--------|--------|
| `✔ All package.json exports resolve to existing files` | No action |
| `✗ packages/X/package.json (name)`<br>`  - ./key → ./path (file not found)` | Fix the export: correct the path or create the file |
| `Resolved: /absolute/path` | Use this path to locate the expected file or confirm it's missing |

## Implementation Details

- **Script:** `scripts/validate-exports.js` (Node.js, no dependencies)
- **Pattern:** Matches `validate-workspaces.js` — plain JS, `fs`/`path` only
- **Discovery:** Recursive walk of workspace roots, skips `node_modules` and dot-prefixed dirs

## References

- [Node.js package.json exports field](https://nodejs.org/api/packages.html#package-entry-points)
- [validate-package-exports (npm)](https://www.npmjs.com/package/validate-package-exports) — Alternative CLI tool
- Task 0.10: Fix Broken Infra Export Path (original bug this prevents)
