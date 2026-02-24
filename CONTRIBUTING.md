# Contributing Guide

## Coding standards

- Follow Feature-Sliced Design boundaries: `app → pages → widgets → features → entities → shared`.
- Prefer package public exports and avoid deep imports.
- Use strict TypeScript patterns and avoid `any` unless justified.

## File headers

- Add the standard header to all new source files and major rewrites.
- Use the template in `docs/guides/best-practices/file-header-template.md`.
- Include `@security`, `@adr`, and `@requirements` metadata where applicable.

## Comments and docstrings

- Write comments that explain _why_, not obvious _what_.
- Keep docstrings concise and maintainable.
- Ensure security-sensitive behavior is documented close to implementation.

## Code review comments

- Use Conventional Comments.
- See `docs/guides/best-practices/conventional-comments.md` for the required prefixes and examples.

## Formatting and linting

- Run formatters and linters before pushing.
- CI and pre-commit hooks enforce formatting, linting, and header quality checks.
