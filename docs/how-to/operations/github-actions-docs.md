---
title: "GitHub Actions: Caching, Artifacts, and Workflow Optimization"
description: "GitHub Actions provides powerful features for optimizing workflow performance and sharing data between jobs. This guide covers dependency caching, artifact passing, and debugging techniques based on o..."
domain: operations
type: how-to
layer: global
audience: ["developer", "devops"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["operations", "github", "actions:", "caching,"]
legacy_path: "infrastructure-devops\github-actions-docs.md"
---
# GitHub Actions: Caching, Artifacts, and Workflow Optimization

## Introduction

GitHub Actions provides powerful features for optimizing workflow performance and sharing data between jobs. This guide covers dependency caching, artifact passing, and debugging techniques based on official GitHub documentation .

## 1. Dependency Caching with actions/cache

When workflows run on GitHub-hosted runners, each job starts in a clean virtual environment. Caching dependencies prevents repeated downloads and significantly speeds up workflows .

### 1.1 Basic Cache Action Usage

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Cache NPM dependencies
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-npm-
```

### 1.2 Cache Parameters

| Parameter      | Description                                                     | Required |
| -------------- | --------------------------------------------------------------- | -------- |
| `key`          | Unique identifier created when saving and searching for a cache | Yes      |
| `path`         | File path on the runner to cache or search                      | Yes      |
| `restore-keys` | Alternative keys to try if the exact key isn't found            | No       |

### 1.3 Cache Key Strategies

**Using hashFiles for lockfile-based keys:**

```yaml
key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

**Including OS and dependency manager:**

```yaml
key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Multiple fallback keys:**

```yaml
restore-keys: |
  ${{ runner.os }}-node-
  ${{ runner.os }}-
```

### 1.4 Built-in Caching in setup-\* Actions

Many official setup actions include caching options :

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'npm' # Automatically caches ~/.npm
```

## 2. 2026 Cache Service Enhancements

### 2.1 New Cache Backend Service

GitHub Actions has completely rewritten the cache backend service for improved performance and reliability :

- **New v2 APIs**: All cache operations now use the new service APIs
- **Improved performance**: 40% faster cache operations on average
- **Better reliability**: Enhanced error handling and retry mechanisms
- **Enhanced security**: Improved isolation and access controls

### 2.2 Version Requirements

**Important changes:**

- `actions/cache@v5` requires Node.js 24 runtime and Actions Runner 2.327.1+
- Legacy service sunset on February 1, 2025
- Upgrade to v4.2.0 or v3.4.0 for pinned SHAs

**Migration example:**

```yaml
# Before
- uses: actions/cache@v3

# After
- uses: actions/cache@v5
```

### 2.3 Enhanced Cache Features

**Granular cache control:**

```yaml
# Separate restore and save actions
- uses: actions/cache/restore@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

- name: Install dependencies
  run: npm ci

- uses: actions/cache/save@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

**Cross-OS caching:**

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    enableCrossOs: true # Opt-in feature for cross-OS sharing
```

**Fail on cache miss:**

```yaml
- uses: actions/cache/restore@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    fail-on-cache-miss: true # Exit workflow if cache miss occurs
```

## 3. Passing Artifacts Between Jobs

Artifacts allow you to share data between jobs in the same workflow and persist data after workflow completion .

### 3.1 Uploading Artifacts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello World" > file.txt

      - uses: actions/upload-artifact@v4
        with:
          name: my-artifact
          path: file.txt
          retention-days: 5 # Optional: days to keep artifact
          compression-level: 6 # Optional: compression level (0-9)
```

### 3.2 Downloading Artifacts in Dependent Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello World" > file.txt
      - uses: actions/upload-artifact@v4
        with:
          name: file
          path: file.txt

  test:
    runs-on: ubuntu-latest
    needs: build # Waits for build job to complete
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: file

      - run: cat file.txt
```

### 3.3 Advanced Artifact Patterns

**Download multiple artifacts with pattern matching:**

```yaml
- uses: actions/download-artifact@v4
  with:
    path: artifacts/
    pattern: test-results-* # Download all matching artifacts
    merge-multiple: true # Merge into one directory
```

**Artifact expiration and cleanup:**

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build-results
    path: dist/
    retention-days: 30 # Custom retention period
    if-no-files-found: warn # Behavior when no files found
```

### 3.4 Artifact Lifecycle

- Artifacts are **tied to a specific workflow run**
- Visible in the GitHub Actions UI under the run summary
- Can be downloaded manually by users
- Automatically expire after retention period (default: 90 days)

## 4. Debugging Workflows

### 4.1 Enabling Diagnostic Logging

Set repository secrets to enable detailed logging :

| Secret                 | Purpose                          |
| ---------------------- | -------------------------------- |
| `ACTIONS_RUNNER_DEBUG` | Enable runner diagnostic logging |
| `ACTIONS_STEP_DEBUG`   | Enable step diagnostic logging   |

Both secrets require `true` as their value and need admin access to set.

### 4.2 Viewing Logs in GitHub UI

1. Navigate to repository **Actions** tab
2. Select the workflow
3. Choose the specific workflow run
4. Click on a job to view its logs
5. Expand individual steps for detailed output

**Filtering failed runs:**
Use the Status filter after selecting a workflow to show only failed runs .

### 4.3 Accessing Logs via REST API

```bash
# Download logs archive for a specific run
GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs
```

Anyone with read access can use this endpoint. For private repositories, use a token with `repo` scope .

### 4.4 Advanced Debugging Features

**Workflow timing visualization:**

```yaml
# Enable timing information
name: CI with Timing
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout with timing
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      # ... other steps
```

**Step-level debugging:**

```yaml
- name: Debug step
  run: |
    echo "Runner OS: ${{ runner.os }}"
    echo "Runner Arch: ${{ runner.arch }}"
    echo "Workspace: ${{ github.workspace }}"
  if: always() # Run even if previous steps fail
```

## 5. GitHub App Authentication

### 5.1 Installation Tokens

When authenticating as a GitHub App installation, use installation access tokens :

```bash
curl --request GET \
  --url "https://api.github.com/meta" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer INSTALLATION_ACCESS_TOKEN"
```

### 5.2 Git Access with Installation Tokens

For HTTP-based Git operations :

```bash
git clone https://x-access-token:TOKEN@github.com/owner/repo.git
```

Requirements:

- App must have `Contents` repository permission
- Token replaces password in HTTPS URL

## 6. 2026 Pricing and Cost Optimization

### 6.1 Pricing Changes Impact

GitHub Actions' pricing changes in 2026 make caching crucial for cost management :

- **Free tier reductions**: Fewer free minutes for public repositories
- **Paid tier increases**: Higher per-minute costs for private repositories
- **Artifact storage costs**: New charges for artifact storage and transfer

### 6.2 Cost Optimization Strategies

**Effective caching:**

```yaml
- name: Cache dependencies
  uses: actions/cache@v5
  with:
    path: |
      ~/.npm
      ~/.cache/pnpm
    key: ${{ runner.os }}-deps-${{ hashFiles('**/lockfiles') }}
    restore-keys: |
      ${{ runner.os }}-deps-
```

**Artifact optimization:**

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build-artifacts
    path: dist/
    retention-days: 7 # Shorter retention to reduce costs
    compression-level: 9 # Maximum compression
```

**Parallel job optimization:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      # ... test steps
```

## 7. Best Practices

### 7.1 Cache Optimization

1. **Use specific keys**: Include lockfile hashes to invalidate cache on dependency changes
2. **Provide restore-keys**: Allow partial cache matches when exact key misses
3. **Cache only what's necessary**: Avoid caching large, frequently changing files
4. **Leverage built-in caching**: Use `cache` parameter in setup actions when available
5. **Upgrade to v5**: Use latest cache action for improved performance

### 7.2 Artifact Management

1. **Set retention periods**: Use `retention-days` to automatically clean up old artifacts
2. **Use meaningful names**: Artifact names should clearly identify their content
3. **Consider storage limits**: GitHub provides limited artifact storage; clean up when possible
4. **Use needs for dependencies**: Ensure jobs requiring artifacts wait for upload jobs
5. **Optimize compression**: Use appropriate compression levels for different artifact types

### 7.3 Debugging Strategy

1. Start with default logs
2. Enable step debug logging for detailed failure analysis
3. Use runner debug logging for infrastructure issues
4. Download logs archive for offline analysis
5. Use timing visualization to identify performance bottlenecks

### 7.4 Cost Management

1. **Implement comprehensive caching** to reduce compute minutes
2. **Optimize artifact retention** to minimize storage costs
3. **Use parallel jobs** strategically to reduce overall runtime
4. **Monitor usage metrics** regularly to identify optimization opportunities
5. **Consider self-hosted runners** for high-volume workloads

---

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

## Overview

[Add content here]

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]