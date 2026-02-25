# GitHub Actions Documentation Validation Guide

## Why Automate Doc Validation

Documentation quality degrades over time through link rot, inconsistent formatting, and typos that slip through human review. Automating validation in CI provides the same safety net for prose that linting provides for code — catching issues at the point of change rather than after publication. This guide covers the baseline workflow you can implement today.[3]

## Toolchain Overview

| Tool | Role | Config File |
|------|------|-------------|
| `markdownlint-cli2` | Markdown syntax & style rules | `.markdownlint.jsonc` |
| `lychee` | Broken link detection (local + remote) | `.lychee.toml` |
| `cspell` | Spell checking with custom word lists | `.cspell.json` |
| `vale` (optional) | Prose style enforcement (tone, grammar) | `.vale.ini` |

## Markdownlint Configuration

Markdownlint enforces consistent Markdown formatting. Configure it at repo root:[4]

```jsonc
// .markdownlint.jsonc
{
  "default": true,
  "MD013": false,           // Disable line-length (too strict for docs)
  "MD033": {                // Allow specific HTML tags
    "allowed_elements": ["details", "summary", "kbd", "br"]
  },
  "MD041": false,           // First line doesn't need to be H1
  "MD024": {                // Allow duplicate headings in different sections
    "siblings_only": true
  },
  "MD046": {                // Code block style
    "style": "fenced"
  }
}
```

## Lychee Link Checker Configuration

Lychee is significantly faster than other link checkers because it parallelizes requests and handles both local relative links and external URLs:[5]

```toml
# .lychee.toml
# Timeout per request (seconds)
timeout = 20

# Max concurrent requests
max_concurrency = 64

# Retry failed requests
max_retries = 3

# Follow redirects
no_ignore = false

# Exclude patterns (anchors, localhost, private networks)
exclude = [
  "^https://localhost",
  "^http://127\\.0\\.0\\.1",
  "^https://example\\.com",
  "^mailto:",
  "#.*",                    # Skip anchor-only links
]

# Accept these status codes as "OK" (some sites return 206 for partial content)
accept = ["200..=206", "429"]

# Exclude files
exclude_path = [
  "node_modules",
  ".git",
  "CHANGELOG.md",           # Changelogs often reference old PRs/issues
]
```

## CSpell Configuration

```json
// .cspell.json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "repo", "repos", "monorepo", "monorepos",
    "semver", "pyproject", "toml",
    "markdownlint", "lychee", "cspell",
    "frontmatter", "devcontainer",
    "kubectl", "npx", "uvx"
  ],
  "ignorePaths": [
    "node_modules/**",
    "**/*.min.js",
    "CHANGELOG.md"
  ],
  "dictionaries": ["en_US", "companies", "softwareTerms"],
  "overrides": [
    {
      "filename": "**/*.md",
      "ignoreRegExpList": [
        "`[^`]+`",           // Ignore inline code
        "```[\\s\\S]+?```"   // Ignore code blocks
      ]
    }
  ]
}
```

## Full GitHub Actions Workflow (Today)

```yaml
# .github/workflows/docs-validate-basic.yml
name: "Docs Validation"

on:
  push:
    branches: [main, develop]
    paths:
      - "**/*.md"
      - "**/*.mdx"
      - ".markdownlint.jsonc"
      - ".lychee.toml"
      - ".cspell.json"
  pull_request:
    paths:
      - "**/*.md"
      - "**/*.mdx"

# Cancel in-progress runs for the same PR/branch
concurrency:
  group: docs-validate-${{ github.ref }}
  cancel-in-progress: true

jobs:
  markdown-lint:
    name: "Markdown Lint"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run markdownlint-cli2
        uses: DavidAnson/markdownlint-cli2-action@v16
        with:
          globs: |
            **/*.md
            **/*.mdx
            !node_modules
            !CHANGELOG.md

  link-check:
    name: "Link Check"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Lychee
        id: lychee
        uses: lycheeverse/lychee-action@v2
        with:
          args: >
            --config .lychee.toml
            --verbose
            --no-progress
            "**/*.md"
          failIfEmpty: false
          # Write a report to a file for upload
          output: ./lychee/out.md

      - name: Upload link check report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lychee-link-report
          path: ./lychee/out.md
          retention-days: 7

  spell-check:
    name: "Spell Check"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run CSpell
        uses: streetsidesoftware/cspell-action@v6
        with:
          files: "**/*.md"
          config: ".cspell.json"
          incremental_files_only: true   # Only check changed files on PRs
          strict: true
```

## Enforcing the Workflow as a Gate

In your repository settings, navigate to **Settings → Branches → Branch protection rules** and add:

- Required status checks: `Markdown Lint`, `Link Check`, `Spell Check`
- Enable "Require branches to be up to date before merging"
- Enable "Do not allow bypassing the above settings" for production branches

This transforms the validation workflow from advisory to mandatory.[3]

## References

[3] GitHub Actions documentation - https://docs.github.com/en/actions
[4] markdownlint-cli2 documentation - https://github.com/DavidAnson/markdownlint-cli2
[5] lychee link checker - https://github.com/lycheeverse/lychee
