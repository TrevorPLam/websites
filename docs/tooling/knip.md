# Knip — Dead Code & Dependency Detection

**Last Updated:** 2026-02-14  
**Related Tasks:** 0.17

## Purpose

[Knip](https://knip.dev/) finds unused files, exports, dependencies, and type-only issues in JavaScript/TypeScript monorepos. It would have automatically detected the duplicate `cn()` (Task 0.21), broken export paths (Task 0.10), and stale dependencies (Task 0.27).

## Usage

```bash
pnpm knip
```

Exit code 1 indicates issues found. Use `--debug` for verbose workspace and plugin resolution.

## Configuration

- **`knip.config.ts`** — Root configuration (TypeScript for typed config)
- Workspaces auto-detected from `pnpm-workspace.yaml`
- Plugins auto-enabled for Next.js, Jest, ESLint based on project structure

### Key Settings

| Setting                   | Purpose                                                               |
| ------------------------- | --------------------------------------------------------------------- |
| `ignoreDependencies`      | Tooling deps used by config loaders (eslint, jest-environment-jsdom)  |
| `ignoreExportsUsedInFile` | Treat interfaces/types as internal when only used in same file        |
| `ignoreIssues`            | Per-file overrides (e.g. config files that export for tooling)        |
| `ignoreUnresolved`        | JSDoc type-only imports (e.g. `@type {import('tailwindcss').Config}`) |

### Rules

- `classMembers: "warn"` — Class members may be used for reflection/DTOs
- `types: "warn"` — Exported types may be consumed externally

## CI Integration

Knip runs in CI as a **non-blocking** step (`continue-on-error: true`). After tuning ignores and fixing critical issues, promote to blocking by removing `continue-on-error`.

## Interpreting Results

| Issue Type            | Action                                                 |
| --------------------- | ------------------------------------------------------ |
| Unused files          | Delete or add to entry patterns                        |
| Unused dependencies   | Remove from package.json or add to ignoreDependencies  |
| Unlisted dependencies | Add to package.json (or ignoreUnresolved if type-only) |
| Unused exports        | Remove, or tag with `@internal` / `@lintignore`        |
| Duplicate exports     | Consolidate (e.g. `export default` + named export)     |

## References

- [Knip Configuration](https://knip.dev/reference/configuration)
- [Monorepos & Workspaces](https://knip.dev/features/monorepos-and-workspaces)
- [Handling Issues](https://knip.dev/guides/handling-issues)
