# Documentation Governance Standard

## Purpose

Defines repository rules for treating documentation as versioned, reviewable code.

## Scope

- Applies to all files under `docs/`, root markdown docs, and `.github` templates.
- Applies to all contributors and automated agents.

## Requirements

1. **Version control required**: all documentation changes must be committed via Git with review.
2. **Plain-text first**: docs must use `.md`, `.mdx`, `.txt`, `.yml`, or `.yaml`.
3. **Folder structure compliance**: new docs must follow `docs/README.md` sections.
4. **Living docs**: code changes that alter behavior must update related docs in the same PR.
5. **Publishability**: docs must pass `pnpm docs:quality` and docs-site build checks.

## Task mapping

- DOMAIN-37-2-1 move-docs-to-version-control
- DOMAIN-37-2-2 use-plain-text-formats
- DOMAIN-37-2-5 commit-to-living-documentation
