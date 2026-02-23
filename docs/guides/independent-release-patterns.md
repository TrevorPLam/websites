# Independent Release Patterns with Changesets

## Introduction

Modern monorepos often require multiple release channels to serve different audiences and use cases. Changesets provides a flexible foundation for implementing independent release patterns, including stable production releases, canary (nightly) releases, and on-demand snapshot releases for testing .

## 1. The Three-Channel Model

Most organizations adopt a three-channel release strategy:

| Channel      | Audience                            | Version Format                    | Trigger                          |
| ------------ | ----------------------------------- | --------------------------------- | -------------------------------- |
| **Stable**   | Production users                    | Standard SemVer (e.g., `5.111.0`) | Merging Version Packages PR      |
| **Canary**   | Early adopters, integration testing | `0.0.0-canary-YYYYMMDDHHMMSS`     | Every push to main               |
| **Snapshot** | PR testing                          | `0.0.0-snapshot-feature-name`     | Comment on PR (`!snapshot name`) |

## 2. Stable Releases

### 2.1 Workflow

Stable releases follow the standard Changesets workflow :

1. Developers create changesets with their PRs
2. Changesets accumulate on the main branch
3. The Changesets GitHub Action creates/updates a "Version Packages" PR
4. Team reviews and merges the Version Packages PR
5. Merging triggers publication to npm with the `latest` tag

### 2.2 Configuration

```json
// .changeset/config.json
{
  "baseBranch": "main",
  "changelog": "@changesets/changelog-github",
  "access": "public",
  "updateInternalDependencies": "patch"
}
```

### 2.3 Release Script

```json
// package.json
{
  "scripts": {
    "release": "turbo run build && changeset publish"
  }
}
```

The `changeset publish` command:

- Publishes packages with the `latest` dist-tag
- Creates git tags for new versions
- Pushes tags to GitHub
- Uses npm provenance for secure publishing

## 3. Canary Releases

Canary releases provide continuous pre-releases from every commit to main, enabling testing of unreleased features .

### 3.1 Version Format

Canary versions use timestamp-based identifiers:

```
0.0.0-canary-YYYYMMDDHHMMSS
```

Example: `@clerk/clerk-js@0.0.0-canary-20250115123456`

### 3.2 Configuration

In `.changeset/config.json`, configure snapshot settings:

```json
{
  "snapshot": {
    "useCalculatedVersion": true,
    "prereleaseTemplate": "alpha-{commit}"
  }
}
```

The `prereleaseTemplate` determines the format:

- `alpha-{commit}`: `3.0.0-alpha-a1b2c3d`
- `canary-{timestamp}`: `3.0.0-canary-20250115123456`

### 3.3 2026 Canary Enhancements

**Advanced Canary Features:**

```json
{
  "snapshot": {
    "useCalculatedVersion": true,
    "prereleaseTemplate": "canary-{timestamp}",
    "updateInternalDependencies": "patch",
    "ignore": ["@scope/internal"]
  }
}
```

**New 2026 Capabilities:**

- **Intelligent version calculation**: Better dependency resolution for snapshots
- **Custom templates**: Enhanced template variables and formatting
- **Selective publishing**: Configure which packages get canary releases
- **Performance optimization**: Faster snapshot generation for large monorepos

### 3.4 Canary Workflow

```yaml
# .github/workflows/release-canary.yml
name: Canary Release
on:
  push:
    branches: [main]

jobs:
  canary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run build

      - name: Canary Release
        run: |
          npx changeset version --snapshot canary
          npx changeset publish --tag canary
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 3.5 Key Differences from Stable

- **`--snapshot` flag**: Generates snapshot version numbers based on the template
- **`--tag canary`**: Publishes with the `canary` dist-tag instead of `latest`
- **No Version Packages PR**: Canary releases happen immediately on push

## 4. Snapshot Releases

Snapshot releases are on-demand pre-releases triggered from pull requests, enabling testing of PR changes before merge .

### 4.1 Trigger Mechanism

Snapshot releases are triggered by commenting on a PR:

```
!snapshot feature-name
```

### 4.2 2026 Snapshot Enhancements

**Enhanced Trigger Options:**

```bash
!snapshot feature-name          # Basic snapshot
!snapshot feature-name --force  # Force override existing
!snapshot feature-name --test   # Test mode (no publish)
```

**Advanced Features:**

- **Custom version templates**: Per-PR version formatting
- **Dependency validation**: Ensure snapshot dependencies are valid
- **Artifact retention**: Configurable retention periods for snapshots
- **Access control**: Enhanced permissions for snapshot triggers

### 4.3 Workflow Implementation

```yaml
# .github/workflows/release-snapshot.yml
name: Snapshot Release
on:
  issue_comment:
    types: [created]

jobs:
  snapshot:
    if: |
      github.event.issue.pull_request &&
      startsWith(github.event.comment.body, '!snapshot')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: refs/pull/${{ github.event.issue.number }}/head

      - name: Parse snapshot name
        id: parse
        run: |
          COMMENT="${{ github.event.comment.body }}"
          NAME=$(echo "$COMMENT" | cut -d' ' -f2)
          FLAGS=$(echo "$COMMENT" | cut -d' ' -f3-)
          echo "name=$NAME" >> $GITHUB_OUTPUT
          echo "flags=$FLAGS" >> $GITHUB_OUTPUT

      - name: Check permissions
        if: |
          !(github.event.comment.author_association == 'MEMBER' || 
            github.event.comment.author_association == 'OWNER')
        run: exit 1

      - name: Create snapshot release
        run: |
          npx changeset version --snapshot ${{ steps.parse.outputs.name }}
          npx changeset publish --tag snapshot ${{ steps.parse.outputs.flags }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Update PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const commentBody = `📦 Snapshot release published!\n\n` +
              `Package versions will be available as @scope/package@0.0.0-snapshot-${{ steps.parse.outputs.name }}`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: commentBody
            });
```

### 4.4 Access Control

For security, snapshot releases should be restricted:

```yaml
- name: Check permissions
  if: |
    !(github.event.comment.author_association == 'MEMBER' || 
      github.event.comment.author_association == 'OWNER')
  run: exit 1
```

### 4.5 Version Format

```
0.0.0-snapshot-feature-name
```

Or with commit hash:

```
3.0.0-snapshot-feature-name-a1b2c3d
```

## 5. Dependency Propagation

### 5.1 Internal Dependencies

When a changeset affects a package, Changesets automatically determines which dependent packages need version bumps .

**Dependency Resolution Rules:**

| Rule                    | Description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| Direct Dependencies     | Package bumped at level X causes direct dependents to bump at level X or higher |
| Transitive Dependencies | Changes propagate through the dependency tree                                   |
| Workspace Protocol      | Internal dependencies use `workspace:^` in package.json                         |
| Version Alignment       | All packages maintain compatible version constraints                            |

### 5.2 2026 Dependency Enhancements

**Advanced Dependency Management:**

```json
{
  "updateInternalDependencies": "patch",
  "bumpVersionsWithWorkspaceProtocolOnly": true,
  "linked": ["@scope/ui", "@scope/themes"],
  "fixed": ["@scope/core"]
}
```

**New Features:**

- **Workspace-only updates**: Restrict internal dependency updates to workspace protocol
- **Linked packages**: Groups of packages that should always version together
- **Fixed packages**: Packages that maintain the same version across releases
- **Smart dependency resolution**: Better handling of complex dependency graphs

### 5.3 Example

When `@clerk/shared` receives a minor bump to `3.36.0`, all dependent packages automatically receive patch bumps:

```json
{
  "dependencies": {
    "@clerk/shared": "^3.36.0"
  }
}
```

### 5.4 Configuration Options

The `updateInternalDependencies` setting in `.changeset/config.json` controls this behavior:

- `"patch"` (default): Update internal dependencies when the bumped version is at least patch
- `"minor"`: Update internal dependencies only when the bumped version is at least minor
- `"major"`: Update internal dependencies only when the bumped version is major

## 6. 2026 Release Automation Enhancements

### 6.1 Advanced GitHub Actions Integration

**Enhanced Workflow Features:**

```yaml
- name: Enhanced Release
  uses: changesets/action@v1
  with:
    publish: npx changeset publish
    version: npx changeset version
    commit: 'chore: release packages'
    title: 'Version Packages'
    createGithubReleases: true
    generateReleaseNotes: true
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**New Capabilities:**

- **Automatic GitHub Releases**: Create GitHub releases with changelogs
- **Release Notes Generation**: Automated release notes from changesets
- **Custom Commit Messages**: Configurable commit message formats
- **Parallel Publishing**: Concurrent package publishing for speed

### 6.2 Multi-Registry Support

**Publish to Multiple Registries:**

```yaml
- name: Multi-Registry Publish
  run: |
    # Publish to npm
    npx changeset publish --registry https://registry.npmjs.org

    # Publish to GitHub Packages
    npx changeset publish --registry https://npm.pkg.github.com

    # Publish to private registry
    npx changeset publish --registry https://npm.company.com
```

### 6.3 Release Validation

**Enhanced Validation Pipeline:**

```yaml
- name: Validate Release
  run: |
    # Check package integrity
    npx changeset pre-enter

    # Validate version consistency
    npx changeset status --output=json

    # Check for breaking changes
    npx changeset detect-breaking

    # Validate dependencies
    npx changeset validate-dependencies
```

## 7. Best Practices

### 7.1 Version Strategy

1. **Start with 0.1.0**: Begin initial development at `0.1.0` and increment minor for each release
2. **Release 1.0.0 when stable**: If software is in production, it should be `1.0.0`
3. **Use pre-release identifiers**: For unstable versions, use `-alpha`, `-beta`, `-rc` suffixes
4. **Semantic versioning**: Follow SemVer 2.0.0 specification strictly

### 7.2 Release Channel Hygiene

| Channel  | When to Use                            | Retention          |
| -------- | -------------------------------------- | ------------------ |
| Stable   | Merged, reviewed, ready for production | Permanent          |
| Canary   | Every commit to main                   | Overwrite previous |
| Snapshot | PR testing, on-demand                  | Ephemeral          |

### 7.3 Changelog Management

- Group changes by type (Major/Minor/Patch)
- Link to PRs and commits
- Credit contributors
- Include migration notes for breaking changes

### 7.4 2026 Best Practices

**Modern Release Management:**

1. **Automated validation**: Use enhanced CI validation for all releases
2. **Multi-registry support**: Publish to multiple registries when needed
3. **Security scanning**: Integrate security scans into release pipeline
4. **Performance monitoring**: Track release performance and success rates
5. **Rollback procedures**: Have automated rollback capabilities for critical issues

### 7.5 Concurrency Control

Prevent simultaneous releases with GitHub Actions concurrency:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This ensures only one release process runs at a time per branch .

### 7.6 Monitoring and Observability

**Release Metrics Tracking:**

```yaml
- name: Track Release Metrics
  run: |
    # Track release success rates
    npx changeset metrics --output=json

    # Monitor package downloads
    npx changeset analytics --period=24h

    # Check dependency health
    npx changeset health-check
```

**Key Metrics to Monitor:**

- Release success/failure rates
- Time to publish after version bump
- Package download rates by channel
- Dependency resolution performance
- User adoption rates for new versions
