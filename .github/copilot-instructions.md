# Copilot Instructions

## AI Docstring Suggestions (DOMAIN-37-1-11)

Use AI completion for docstrings in TypeScript/JavaScript files with this workflow:

1. Add the `repo-doc` snippet from `.vscode/repo.code-snippets`.
2. Trigger Copilot inline suggestion to expand parameter and return descriptions.
3. Keep generated text aligned with `docs/guides/best-practices/docstring-standards.md`.
4. Review generated content for tenant-isolation and security accuracy before commit.

Prompt pattern for stronger suggestions:

```text
Generate a concise TSDoc block for this export. Explain intent, security boundaries, params, and return behavior.
```
