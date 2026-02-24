# File Header Template

This guide defines the standard header format for new and substantially modified source files.

## Scope

- Required for newly created `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.mjs`, and `*.cjs` files.
- Recommended for other text-based executable/config files when appropriate.

## Required Template

```ts
/**
 * @file path/from/repo/root.ts
 * @summary One-sentence purpose of this file.
 * @description Optional 1-3 lines with important implementation context.
 * @security Relevant security assumptions, threat model notes, or "none".
 * @adr docs/architecture/decisions/ADR-XXXX-title.md (or "none")
 * @requirements DOMAIN-X / task IDs / external compliance refs (or "none")
 */
```

## Field Guidance

- `@file`: Must match repository-relative path.
- `@summary`: Explain what the file does, not how.
- `@description`: Keep concise; include invariants only when helpful.
- `@security`: Explicitly call out sensitive data handling, authz, or tenant boundaries.
- `@adr`: Link to the relevant ADR if architectural tradeoffs are involved.
- `@requirements`: Map implementation to TODO/domain task IDs and/or compliance requirements.

## Example

```ts
/**
 * @file packages/features/src/lead-capture/model/score-lead.ts
 * @summary Calculates tenant-scoped lead score from weighted signals.
 * @description Applies deterministic rule weights and returns normalized score output.
 * @security No secrets logged; tenant isolation enforced via explicit tenantId input.
 * @adr docs/architecture/decisions/ADR-0012-lead-scoring-engine.md
 * @requirements DOMAIN-9-3, GDPR-data-minimization
 */
```
