# Docstring Standards

This guide defines the selected docstring standards used across the monorepo.

## Standards by language

- **TypeScript / JavaScript**: Use **TSDoc-compatible JSDoc** block comments (`/** ... */`).
- **Shell scripts**: Use concise `#` comments at file and function level.
- **Markdown docs**: Prefer section headings and short rationale bullets rather than inline prose comments.

## Required conventions (TS/JS)

1. Public exported functions, classes, and hooks must include a docstring.
2. Docstrings should explain intent and behavior, not restate syntax.
3. Include `@param` for non-trivial inputs and `@returns` for non-void behavior.
4. Keep comments current with implementation changes.

## Example

```ts
/**
 * Resolves tenant-safe metadata for the current site request.
 *
 * @param tenantId Tenant identifier used for data boundary enforcement.
 * @returns Metadata payload for SEO and rendering.
 */
export function resolveTenantMetadata(tenantId: string) {
  // implementation
}
```

## Enforcement

- Local pre-commit runs `pnpm verify:docstrings` on staged JS/TS files.
- CI should include `pnpm verify:docstrings` in quality pipelines.
