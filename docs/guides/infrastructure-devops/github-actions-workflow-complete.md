# Github Actions Workflow Complete

> **Reference Documentation — February 2026**

## Overview

This document defines the complete GitHub Actions CI/CD pipeline for the monorepo, covering type checking, unit tests, build validation, bundle size enforcement, Lighthouse performance gates, E2E tests, and staged production promotion. [github](https://github.com/marketplace/actions/lighthouse-ci-action)

---

## Complete Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  PNPM_VERSION: '9'
  NODE_VERSION: '22'
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

jobs:
  # ── 1. TypeScript & Lint ──────────────────────────────────────────────────
  typecheck:
    name: TypeScript + ESLint + Steiger
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck # Runs tsc --noEmit across all packages
      - run: pnpm lint # ESLint 9 flat config
      - run: pnpm lint:arch # Steiger FSD architecture check

  # ── 2. Unit Tests ─────────────────────────────────────────────────────────
  test:
    name: Unit Tests + Coverage
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage
        env:
          NODE_ENV: test
      - uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

  # ── 3. Build ──────────────────────────────────────────────────────────────
  build:
    name: Production Build
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - name: Build (with Turborepo remote cache)
        run: pnpm build
        env:
          NODE_ENV: production
          NEXT_TELEMETRY_DISABLED: '1'
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_ROOT_DOMAIN: staging.agency.com

  # ── 4. Bundle Size ────────────────────────────────────────────────────────
  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter marketing build
        env:
          ANALYZE: 'true'
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: 'https://stub.supabase.co'
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'stub'
      - run: pnpm size-limit --json > size-report.json
        continue-on-error: true
      - uses: actions/github-script@v7
        name: Post size report comment
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('size-report.json', 'utf8'));
            const exceeded = report.filter(r => r.exceeded);
            const rows = report.map(r =>
              `| ${r.exceeded ? '❌' : '✅'} | ${r.name} | ${(r.sizeRaw/1024).toFixed(1)} KB | ${(r.limitRaw/1024).toFixed(1)} KB |`
            ).join('\n');
            const body = `## 📦 Bundle Size Report\n\n| Status | Bundle | Size | Limit |\n|--------|--------|------|-------|\n${rows}\n\n${exceeded.length ? '> ⚠️ **Limits exceeded — fix before merging**' : '> ✅ All bundles within budget'}`;
            github.rest.issues.createComment({ issue_number: context.issue.number, owner: context.repo.owner, repo: context.repo.repo, body });
      - name: Fail on exceeded budgets
        run: |
          FAILED=$(cat size-report.json | jq '[.[] | select(.exceeded == true)] | length')
          if [ "$FAILED" -gt "0" ]; then exit 1; fi

  # ── 5. E2E Tests ──────────────────────────────────────────────────────────
  e2e:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    timeout-minutes: 30
    needs: [test, build]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '${{ env.PNPM_VERSION }}' }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter e2e exec playwright install chromium
      - run: pnpm --filter e2e test
        env:
          CI: true
          PLAYWRIGHT_BASE_URL: ${{ steps.vercel-preview.outputs.url }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ github.sha }}
          path: packages/e2e/playwright-report/
          retention-days: 14

  # ── 6. Lighthouse CI ──────────────────────────────────────────────────────
  lighthouse:
    name: Lighthouse Performance Gate
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - name: Wait for Vercel Preview
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        id: vercel-preview
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 300
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      - run: pnpm add -g @lhci/cli@0.14.x
      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          LHCI_BASE_URL: ${{ steps.vercel-preview.outputs.url }}

  # ── 7. Deploy Staging ─────────────────────────────────────────────────────
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, build, bundle-size]
    if: github.ref == 'refs/heads/staging' && github.event_name == 'push'
    environment:
      name: staging
      url: https://staging.agency.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (staging)
        run: npx vercel --token=${{ secrets.VERCEL_TOKEN }} --env=staging
      - name: Smoke tests
        run: pnpm --filter e2e test:smoke
        env:
          PLAYWRIGHT_BASE_URL: https://staging.agency.com

  # ── 8. Deploy Production (staged) ─────────────────────────────────────────
  deploy-production:
    name: Stage Production Deployment
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, build, bundle-size]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production-db # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - name: Deploy (staged, no domain assignment)
        run: |
          STAGED=$(npx vercel --prod --skip-domain --token=${{ secrets.VERCEL_TOKEN }} 2>&1 | tail -1)
          echo "STAGED_URL=$STAGED" >> $GITHUB_ENV
      - name: Run smoke tests against staged URL
        run: pnpm --filter e2e test:smoke
        env:
          PLAYWRIGHT_BASE_URL: ${{ env.STAGED_URL }}
      - name: Notify team (promote manually in Vercel dashboard)
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_DEPLOYMENTS }} \
            -H 'Content-type: application/json' \
            -d '{"text":"🚀 Production staged: ${{ env.STAGED_URL }} — promote when ready"}'
```

---

## References

- GitHub Actions Workflow Syntax — https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions
- Lighthouse CI Action — https://github.com/marketplace/actions/lighthouse-ci-action
- Monitoring with Lighthouse CI — https://softwarehouse.au/blog/monitoring-performance-with-lighthouse-ci-in-github-actions/
- Vercel Staging Environments — https://vercel.com/kb/guide/set-up-a-staging-environment-on-vercel

---
