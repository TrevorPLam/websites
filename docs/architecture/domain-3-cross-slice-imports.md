# Domain 3 — Cross-Slice Imports (`@x`) Guidance

## Intent

`@x` notation is used for explicit, reviewable cross-slice imports where normal layer boundaries are intentionally traversed.

## Rules

1. Prefer local slice composition first.
2. Use `@x` only when sharing through public API is insufficient.
3. Keep `@x` imports narrow and documented in code review.
4. Avoid chaining `@x` imports through multiple slices.

## Review Checklist

- Is a public API export an alternative?
- Is the dependency direction still compliant with FSD layering?
- Is the import stable and versioned through a package boundary?
