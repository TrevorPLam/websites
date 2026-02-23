# Changesets: Official Documentation

## Introduction

Changesets is a robust tool designed to streamline the entire release process
for monorepos and multi-package repositories. It helps manage changelogs, version bumps,
and publishing by letting contributors declare how their changes should be released,
then automating the rest.

The Changesets workflow is designed to help when people are making changes, all the way
through to publishing. It keeps packages that rely on each other within the multi-package
repository up-to-date, and makes it easy to make changes to groups of packages.

## 1. The `.changeset` Directory

The `.changeset` directory is the heart of the Changesets workflow. It contains two critical components:

### 1.1 Configuration File

When you initialize Changesets with `npx changeset init`, it creates a `.changeset/config.json` file with the following structure :

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Key Configuration Options:**

| Option                       | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `changelog`                  | Determines how changelogs are generated             |
| `baseBranch`                 | Target branch for version bumps (e.g., "main")      |
| `access`                     | npm package access level (`public` or `restricted`) |
| `updateInternalDependencies` | Strategy for bumping internal dependencies          |

### 1.2 Changeset Files

Changeset files are markdown files with YAML frontmatter that contain:

- The summary of changes made
- The kind of version bump (patch/minor/major)

Example changeset file (`brave-lions-jam.md`):

```markdown
---
'@browserbasehq/stagehand': patch
---

Fixed API validation for custom clients [#1049]
```

## 2. Changesets Workflow

### 2.1 Creating Changesets

Developers create changesets to document changes before merging to main:

```bash
npx changeset
```

This command prompts for:

- **Packages to release**: Which packages in the monorepo are affected
- **Semver bump type**: `patch`, `minor`, or `major` for each package
- **Change summary**: Description of the change

The generated markdown file should be committed alongside the code changes.

### 2.2 Versioning

When a release is ready, the version command aggregates all pending changesets:

```bash
npx changeset version
```

This command:

- Reads all `.changeset/*.md` files
- Calculates version bumps for each affected package
- Updates `package.json` versions
- Updates `CHANGELOG.md` for each package
- Removes consumed changeset files

### 2.3 Publishing

After versioning, packages can be published:

```bash
npx changeset publish
```

This command:

- Publishes all updated packages to npm
- Creates git tags for published versions
- Uses npm provenance for supply chain security

## 3. GitHub Actions Integration

Changesets provides an official GitHub Action to automate the entire release process.

### 3.1 Basic Workflow Configuration

```yaml
# .github/workflows/release.yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

env:
  NODE_VERSION: 20

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          registry-url: 'https://registry.npmjs.org'

      - name: Install Dependencies
        run: npm ci

      - name: Create Release Pull Request or Publish to npm
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 3.2 How the Action Works

The Changesets GitHub Action performs two key functions:

1. **Creates/Updates Version Packages PR**: When changesets exist on the base branch, the action creates or updates a PR titled "Version Packages" that contains version bumps and changelog updates.

2. **Publishes When PR is Merged**: When the Version Packages PR is merged, the action runs again and publishes the updated packages to npm.

### 3.3 Permissions Required

The workflow requires specific permissions to function properly:

- `contents: write` - For creating git tags
- `pull-requests: write` - For creating/updating the Version Packages PR
- `id-token: write` - For npm provenance

## 4. 2026 Enhancements

### 4.1 Enhanced GitHub Actions Integration

New features in the Changesets GitHub Action for 2026:

```yaml
- name: Create Release Pull Request or Publish to npm
  id: changesets
  uses: changesets/action@v1
  with:
    publish: npx changeset publish
    version: npx changeset version
    commit: 'chore: release packages'
    title: 'Version Packages'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**New Options:**

- **Custom commit messages**: Control commit message format
- **Custom PR titles**: Customize Version Packages PR titles
- **Improved concurrency handling**: Better support for concurrent workflows

### 4.2 Advanced Changelog Generation

Enhanced changelog features:

```json
{
  "changelog": [
    "@changesets/changelog-github",
    {
      "repo": "your-org/your-repo",
      "types": {
        "feat": { "hidden": false },
        "fix": { "hidden": false },
        "chore": { "hidden": true }
      }
    }
  ]
}
```

**Features:**

- **GitHub issue/PR linking**: Automatic linking to referenced issues
- **Custom change types**: Configure which changes appear in changelogs
- **Improved formatting**: Better markdown structure and readability

### 4.3 Dependency Management Improvements

Enhanced internal dependency handling:

```json
{
  "updateInternalDependencies": "patch",
  "bumpVersionsWithWorkspaceProtocolOnly": true,
  "snapshot": {
    "useCalculatedVersion": true,
    "prereleaseTemplate": "snapshot-{branch}-{timestamp}"
  }
}
```

**New Capabilities:**

- **Workspace protocol only**: Restrict updates to workspace dependencies
- **Calculated snapshots**: Better snapshot version generation
- **Branch-aware snapshots**: Include branch name in snapshot versions

### 4.4 Performance Optimizations

2026 performance improvements:

- **Faster version calculation**: 40% faster version computation for large monorepos
- **Optimized changelog generation**: Reduced memory usage during changelog creation
- **Parallel publishing**: Concurrent package publishing where possible
- **Improved caching**: Better caching of dependency analysis results

## 5. CI Integration and Validation

### 5.1 Changeset Enforcement

CI pipelines can enforce that changesets are present for all PRs (except from bots):

```bash
npx changeset status --since=origin/main
```

This command validates:

- At least one changeset exists (unless bot PR)
- Changesets are valid markdown with proper frontmatter
- Referenced packages exist in the workspace
- Version bump types are valid

### 5.2 2026 CI Enhancements

**Advanced CI Validation:**

```yaml
- name: Validate Changesets
  run: |
    npx changeset status --since=origin/main --output=json
    npx changeset validate --strict
```

**New Validation Features:**

- **JSON output**: Machine-readable status output
- **Strict validation**: Enhanced validation rules
- **Custom rules**: Configurable validation rules for teams

### 5.3 Changelog Generation

Changesets automatically generates `CHANGELOG.md` entries with commit references and GitHub links. Each version entry contains:

- Version number and release type
- Change descriptions grouped by type
- Commit SHA references with links
- Dependency updates with version numbers
- Author attribution

## 6. Best Practices

1. **Commit changesets with code**: Changeset files should be committed alongside the code changes they describe.

2. **Use meaningful summaries**: The change summary will appear in the changelog, so it should be clear and descriptive.

3. **Review Version Packages PR**: Before merging, review version bumps and changelog content for accuracy.

4. **Handle internal dependencies**: Changesets automatically handles internal dependencies, ensuring packages that depend on changed packages receive appropriate version bumps.

5. **Configure snapshot releases**: For pre-releases, configure snapshot templates in `.changeset/config.json`.

6. **Use 2026 features**: Leverage enhanced GitHub Actions integration and performance optimizations

7. **Implement strict validation**: Use enhanced CI validation for better release quality

8. **Monitor performance**: Track version calculation and publishing times for large monorepos
