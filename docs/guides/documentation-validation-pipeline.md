# Documentation Validation Pipeline Guide

## Pipeline Architecture

A complete documentation validation pipeline operates in layers, each catching a different class of problem. The basic workflow (Guide 2) handles syntax and broken links. The full pipeline adds prose quality enforcement, structured front matter validation, accessibility linting, and automated reporting.[17][3]

```
Commit/PR
    │
    ├── Layer 1: Pre-commit hooks (local, fast, < 2s)
    │     ├── markdownlint-cli2 (syntax)
    │     ├── cspell (spelling)
    │     └── prettier --check (formatting)
    │
    ├── Layer 2: CI Validation (remote, thorough)
    │     ├── markdownlint (full repo scan)
    │     ├── lychee (all links, including external)
    │     ├── vale (prose style)
    │     └── cspell (full repo)
    │
    ├── Layer 3: Build/Render Verification
    │     ├── Attempt to build docs site (Docusaurus/MkDocs/Sphinx)
    │     └── Check for broken internal references
    │
    └── Layer 4: Reporting & Notifications
          ├── PR annotation (inline comments on failures)
          └── Summary report artifact
```

## Vale Prose Linting Setup

Vale enforces writing style rules — it catches passive voice, weasel words, inconsistent terminology, and prose that violates your chosen style guide:[18][17]

```bash
# Install Vale
brew install vale                    # macOS
choco install vale                   # Windows
pip install vale                     # Cross-platform via pip wrapper
```

```ini
# .vale.ini
StylesPath = .vale/styles

MinAlertLevel = suggestion

Packages = Google, Microsoft, alex

[*.{md,mdx,txt}]
BasedOnStyles = Vale, Google

# Override specific rules
Vale.Repetition = NO
Google.Parens = NO
Google.Exclamation = warning         # Exclamation points → warning, not error
```

```bash
# Download the style packages specified in .vale.ini
vale sync
```

Vale style packages available: `Google`, `Microsoft`, `write-good`, `alex` (inclusive language), `Joblint`, `proselint`.[17]

## Pre-Commit Hooks with Husky + lint-staged

Pre-commit hooks prevent bad docs from ever being committed, making CI faster by reducing failures:[19]

```bash
# Install
npm install -D husky lint-staged
npx husky init
```

```json
// package.json — add to scripts and lint-staged config
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "**/*.{md,mdx}": [
      "markdownlint-cli2",
      "cspell --no-must-find-files"
    ],
    "**/*.md": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
npx lint-staged
```

## Full CI Pipeline YAML

```yaml
# .github/workflows/docs-validate-full.yml
name: "Documentation Validation Pipeline"

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: docs-pipeline-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ── Job 1: Fast syntax checks ──────────────────────────────────────────────
  lint-and-spell:
    name: "Lint & Spell Check"
    runs-on: ubuntu-latest
    outputs:
      markdown-outcome: ${{ steps.mdlint.outcome }}
      spell-outcome: ${{ steps.spell.outcome }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Markdown lint
        id: mdlint
        uses: DavidAnson/markdownlint-cli2-action@v16
        continue-on-error: true
        with:
          globs: "**/*.md !node_modules !CHANGELOG.md"

      - name: Spell check
        id: spell
        uses: streetsidesoftware/cspell-action@v6
        continue-on-error: true
        with:
          files: "**/*.md"
          config: ".cspell.json"

      - name: Fail if any check failed
        if: steps.mdlint.outcome == 'failure' || steps.spell.outcome == 'failure'
        run: |
          echo "One or more checks failed:"
          echo "  markdownlint: ${{ steps.mdlint.outcome }}"
          echo "  cspell:       ${{ steps.spell.outcome }}"
          exit 1

  # ── Job 2: Prose style ────────────────────────────────────────────────────
  prose-style:
    name: "Prose Style (Vale)"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Vale lint
        uses: errata-ai/vale-action@reviewdog
        with:
          files: docs/
          reporter: github-pr-review       # Posts inline PR comments
          fail_on_error: true
          vale_flags: "--minAlertLevel=error"

  # ── Job 3: Link checking ──────────────────────────────────────────────────
  links:
    name: "Link Check"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check links
        uses: lycheeverse/lychee-action@v2
        with:
          args: '--config .lychee.toml --verbose "**/*.md"'
          output: ./lychee-report.md

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: link-check-report-${{ github.run_id }}
          path: ./lychee-report.md
          retention-days: 30

  # ── Job 4: Docs build verification ───────────────────────────────────────
  build-verify:
    name: "Docs Build"
    runs-on: ubuntu-latest
    needs: [lint-and-spell]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: npm run docs:build
        env:
          NODE_ENV: production

  # ── Job 5: Summary report ─────────────────────────────────────────────────
  report:
    name: "Pipeline Summary"
    runs-on: ubuntu-latest
    needs: [lint-and-spell, prose-style, links, build-verify]
    if: always()
    steps:
      - name: Post summary
        run: |
          echo "## Documentation Pipeline Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Check | Status |" >> $GITHUB_STEP_SUMMARY
          echo "|-------|--------|" >> $GITHUB_STEP_SUMMARY
          echo "| Lint & Spell | ${{ needs.lint-and-spell.result }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Prose Style  | ${{ needs.prose-style.result }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Links        | ${{ needs.links.result }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Docs Build   | ${{ needs.build-verify.result }} |" >> $GITHUB_STEP_SUMMARY
```

## CODEOWNERS for Documentation

Require explicit approval from doc owners before merging documentation changes:

```gitignore
# .github/CODEOWNERS
# Global default
*               @your-org/engineering

# Documentation requires doc team review
/docs/          @your-org/docs-team
*.md            @your-org/docs-team
README.md       @your-org/engineering @your-org/docs-team

# CI workflows require platform team review
/.github/workflows/  @your-org/platform-team
```

## Front Matter Validation

If your docs use front matter (Jekyll, Docusaurus, Hugo), validate it in CI:

```yaml
- name: Validate front matter
  run: |
    npx --yes @stefanprobst/validate-frontmatter \
      --schema docs/frontmatter-schema.json \
      "docs/**/*.md"
```

```json
// docs/frontmatter-schema.json
{
  "type": "object",
  "required": ["title", "description"],
  "properties": {
    "title": { "type": "string", "minLength": 5 },
    "description": { "type": "string", "minLength": 20 },
    "sidebar_position": { "type": "number" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "last_updated": { "type": "string", "format": "date" }
  }
}
```

## References

[17] Vale documentation - https://vale.sh/
[3] GitHub Actions documentation - https://docs.github.com/en/actions
[18] Google Style Guide for Vale - https://github.com/errata-ai/Google-style-guide
[19] Husky documentation - https://typicode.github.io/husky/
