# GitHub Actions Workflows

This directory contains GitHub Actions workflows that are **disabled by default** to control costs.

## Enabling Workflows

To enable CI workflows:

1. **Enable GitHub Actions** in your repository settings:
   - Go to Settings → Actions → General
   - Under "Workflow permissions", select "Read and write permissions"
   - Under "Allow GitHub Actions to create and approve pull requests", enable if needed

2. **Copy workflows to `.github/workflows/`**:
   ```bash
   # Copy the CI workflow
   cp githubactions/workflows/ci.yml .github/workflows/ci.yml
   
   # Or copy all workflows at once
   cp -r githubactions/workflows/* .github/workflows/
   ```

3. **Commit and push**:
   ```bash
   git add .github/workflows/
   git commit -m "Enable CI workflows"
   git push
   ```

4. **Verify** the workflow runs on your next PR or push to main.

## Disabling Workflows

To disable workflows (to stop CI runs and reduce costs):

1. **Remove workflows from `.github/workflows/`**:
   ```bash
   rm .github/workflows/*.yml
   git add .github/workflows/
   git commit -m "Disable CI workflows"
   git push
   ```

2. **Or disable GitHub Actions entirely** in repository settings:
   - Go to Settings → Actions → General
   - Under "Actions permissions", select "Disable Actions"

## Available Workflows

### `ci.yml`
Runs on every PR and push to main:
- Type checking (`npm run type-check`)
- Linting (`npm run lint`)
- Unit tests (`npm run test`)
- Build verification (`npm run build`)

Fails if any step fails, preventing broken code from merging.

## Cost Control

- Workflows are stored here but **not active** until copied to `.github/workflows/`
- This prevents accidental CI runs and associated costs
- Review workflow files before enabling to understand what they do
- Consider using branch protection rules to require CI checks (see T-091)
