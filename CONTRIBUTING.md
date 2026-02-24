# Contributing Guide

Thanks for contributing to the Marketing Monorepo.

## Development prerequisites

- Node.js >= 22
- pnpm 10.29.2
- Read `AGENTS.md`, `README.md`, `DESIGN.md`, and `TODO.md` before significant changes.

## Architecture rules

- Follow Feature-Sliced Design boundaries: `app → pages → widgets → features → entities → shared`.
- Prefer package public exports (`index.ts`) and avoid deep imports.
- Keep tenant isolation explicit in data-access code.
- Use approved validation and server action wrappers for input handling.

## Workflow

1. Create a branch from `develop`.
2. Pick tasks from `TODO.md` and reference task IDs in commits and PRs.
3. Implement in small, reviewable commits.
4. Run focused QA for changed scope.
5. Update relevant task files and `TODO.md`.

## Code standards

- Use strict TypeScript and avoid `any` unless justified and documented.
- Write comments that explain **why**, not obvious **what**.
- Follow `docs/guides/best-practices/docstring-standards.md` for docstrings.
- Use Conventional Comments in reviews.

## File header requirements

- Add standard file headers to new source files and major rewrites.
- Template: `docs/guides/best-practices/file-header-template.md`.
- Include metadata fields such as `@security`, `@adr`, and `@requirements` where applicable.

## Commit style

Use Conventional Commits:

- `feat:` for features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for non-functional structural improvements
- `test:` for test additions/changes
- `chore:` for maintenance

## Pull request expectations

- Use `.github/PULL_REQUEST_TEMPLATE.md`.
- Link related issue/task IDs.
- Document scope, risks, and rollback notes.
- Add screenshots for visual UI changes.

## Required local checks

Run at minimum:

```bash
pnpm format:check
pnpm lint
pnpm type-check
pnpm test
pnpm validate-docs
```

Run additional checks when relevant:

```bash
pnpm validate-exports
pnpm validate:configs
pnpm validate-all-clients
pnpm test:e2e
```

## Security and compliance

- Never commit secrets; use environment variables and tenant-scoped configuration.
- Follow `SECURITY.md` for vulnerability disclosure.
- Ensure GDPR/privacy-sensitive changes include auditability and deletion paths when required.

## Documentation requirements

- Keep docs in version control and update them with code changes.
- Prefer Markdown and include cross-links to related architecture/task docs.
- Add or update task files under `tasks/` as work is completed.

## Getting help

- Open a GitHub issue using the provided templates.
- For security concerns, follow the private disclosure process in `SECURITY.md`.
