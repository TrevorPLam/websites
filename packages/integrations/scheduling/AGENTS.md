# packages/integrations/scheduling — AI Agent Context

## Scope

Applies to `packages/integrations/scheduling/**`.

## Purpose

- Maintain package-level boundaries and stable public exports.
- Keep changes aligned with Domain 3 FSD architecture requirements.

## Structure Guidance

- Prefer `src/` as implementation root.
- Keep internals private; export through `src/index.ts` only.
- Avoid deep imports from other packages.

## QA Checklist

1. Run package-local lint/tests when available.
2. Verify exports and type checks for touched files.
3. Update relevant task docs when behavior or structure changes.
