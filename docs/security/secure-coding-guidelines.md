# Secure Coding Guidelines

These guidelines define secure-by-default practices for this monorepo.

## General

- Treat all user-controlled and third-party input as untrusted.
- Prefer explicit typing and schema validation for boundaries.
- Keep tenant identity explicit in queries, cache keys, and logs.

## TypeScript/Node

- Use validated DTOs at server boundaries.
- Avoid dynamic `eval`, `Function`, or unsafe command execution.
- Use parameterized queries through approved data clients.
- Redact secrets and PII from structured logs.

## Front-end

- Avoid rendering untrusted HTML; sanitize when unavoidable.
- Keep auth/session checks server-side where possible.
- Avoid leaking internal identifiers in public analytics payloads.

## Supply chain and tooling

- Keep dependencies up to date and address high/critical advisories quickly.
- Run SAST and dependency scanning in CI before merge.
- Require review for changes touching auth, crypto, or multi-tenant isolation.
