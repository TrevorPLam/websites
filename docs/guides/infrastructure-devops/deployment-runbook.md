# deployment-runbook.md

> **Internal Document — Customize as needed for your organization.**

## Overview

This runbook governs the full lifecycle of a production deployment: environment promotion, database migrations, smoke testing, rollback, and incident recovery. The target is: **zero downtime, ≤ 3 minute rollback, all migrations backward-compatible.** [vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)

---

## Environment Chain

```
local (developer) → staging (auto-deploy) → production (manual promote)
     │                      │                        │
  localhost:3000     staging.agency.com         agency.com
  Supabase local     Supabase staging            Supabase prod
  .env.local         Vercel env: staging         Vercel env: production
```

---

## Deployment Pipeline Overview

| Step                                     | Trigger                  | Who                      | Gate                           |
| ---------------------------------------- | ------------------------ | ------------------------ | ------------------------------ |
| 1. PR checks (lint/typecheck/unit tests) | Push to branch           | CI                       | All must pass                  |
| 2. Vercel preview deployment             | PR opened                | Vercel                   | Automatic                      |
| 3. Lighthouse CI                         | Preview ready            | CI                       | LCP < 2.5s, score ≥ 0.85       |
| 4. Staging migration                     | Push to `staging` branch | CI                       | `supabase db push`             |
| 5. Staging deploy                        | Push to `staging`        | Vercel                   | Automatic on migration success |
| 6. Smoke tests (staging)                 | Post-deploy              | CI                       | All smoke tests pass           |
| 7. Production migration                  | Push to `main`           | CI + **manual approval** | GitHub Environments approval   |
| 8. Staged production deploy              | Post-migration           | CI                       | `vercel --skip-domain`         |
| 9. Production smoke tests                | Against staged URL       | CI                       | All smoke tests pass           |
| 10. Promote to production                | After smoke tests        | Engineer / Auto          | `vercel promote <id>`          |

---

## Zero-Downtime Migration Strategy

All schema changes follow the **expand/contract pattern**. Old and new application code run simultaneously during a deployment window. Both must work against the same schema. [hrekov](https://hrekov.com/blog/vercel-migrations)

### Phase 1 — Expand (deploy BEFORE new code)

```sql
-- Safe: add nullable column, create index CONCURRENTLY, add table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_v2 smallint DEFAULT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_score_v2 ON leads(score_v2);
```

### Phase 2 — Deploy new code

New code writes `score_v2`. Old code (if still running) ignores it.

### Phase 3 — Contract (deploy AFTER new code is stable)

```sql
-- Safe: old code no longer deployed, can now enforce constraint
ALTER TABLE leads ALTER COLUMN score_v2 SET NOT NULL, SET DEFAULT 0;
-- In a separate later migration:
-- ALTER TABLE leads DROP COLUMN score;  ← Only after dual-write period
```

**Never in a single migration:**

- ❌ Rename a column and update references to it
- ❌ Drop a column that existing code still reads
- ❌ `UPDATE` millions of rows (use a batched QStash backfill job instead)

---

## Rollback Procedure (≤ 3 minutes)

```bash
# STEP 1: Identify the last good deployment (30s)
vercel ls --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
# Note the deployment ID of the last known-good deployment

# STEP 2: Promote the last good deployment (10s)
# This re-points the production alias atomically — zero traffic drop
vercel promote <LAST_GOOD_DEPLOYMENT_ID> \
  --token=$VERCEL_TOKEN \
  --scope=$VERCEL_ORG_ID

# STEP 3: Verify (30s)
curl -sI https://agency.com | grep x-vercel-id
# Confirm the deployment ID matches the promoted one

# STEP 4 (if feature rollback, not bug): disable feature flag
# Dashboard → Feature Flags → [flag] → 0% rollout (instant, no deploy)
```

### Database Rollback (only for Phase 3 Contract migrations)

```bash
# Only safe if no data has been written to the new schema shape yet
supabase db push \
  --db-url=$PROD_DATABASE_URL \
  --target-version <PREVIOUS_MIGRATION_VERSION>
```

### Nuclear Option: Point-in-Time Recovery

```
Supabase Dashboard → Project Settings → Database → PITR
Select: timestamp BEFORE the incident
⚠️ WARNING: All writes between incident time and recovery time are LOST
Use only for: data corruption, accidental mass deletion
```

PITR must be **enabled before an incident occurs** (Supabase requires it to be pre-configured). Enable on all production projects on day 1.

---

## Fresh Environment Setup

```bash
# Clone repo
git clone https://github.com/org/repo && cd repo

# Install dependencies
pnpm install

# Copy environment file (fill in Supabase + Clerk credentials)
cp .env.example .env.local

# Start local Supabase
npx supabase start

# Apply migrations + seed fixture data
npx supabase db push --local
npx tsx scripts/seed.ts

# Install Playwright browsers
npx playwright install chromium

# Build shared packages
pnpm --filter './packages/**' build

# Start development servers
pnpm dev
```

**Checklist — new environment is ready when:**

- [ ] `http://demo-hvac.localhost:3000` loads the HVAC demo marketing site
- [ ] `http://localhost:3001` loads the portal (login with seeded test account)
- [ ] `http://localhost:3002` loads the super admin panel
- [ ] `http://localhost:54323` loads Supabase Studio
- [ ] `pnpm test` passes all unit tests
- [ ] `pnpm test:e2e` passes all E2E smoke tests

---

## Smoke Test Suite

Run after every staging or production deployment:

```typescript
// packages/e2e/specs/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/[A-Z].*|Your Business/);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('contact form is accessible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('form')).toBeVisible();
    await expect(page.getByRole('button', { name: /send|submit|get a quote/i })).toBeEnabled();
  });

  test('portal login page loads', async ({ page }) => {
    await page.goto('http://portal.localhost:3001');
    await expect(page.getByRole('heading', { name: /sign in|log in/i })).toBeVisible();
  });

  test('API health check returns 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('sitemap.xml is accessible and non-empty', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('<urlset');
    expect(text).toContain('<url>');
  });
});
```

---

## Incident Severity Levels

| Severity | Definition                                           | Response Time | Rollback Threshold      |
| -------- | ---------------------------------------------------- | ------------- | ----------------------- |
| SEV-1    | Production down / data loss                          | 5 min         | Immediate               |
| SEV-2    | Core feature broken (contact form, portal login)     | 15 min        | Within 30 min if no fix |
| SEV-3    | Non-core feature degraded (report emails, OG images) | 1 hour        | Next business day       |
| SEV-4    | Visual/UX regression, no functional impact           | Next sprint   | Next sprint             |

---

## Post-Deployment Verification Checklist

After every production promotion, verify in order:

- [ ] `curl -sI https://[domain] | grep x-vercel-id` returns new deployment ID
- [ ] Homepage LCP < 2.5s (Vercel Speed Insights real-time dashboard)
- [ ] Error rate in Sentry < baseline (no spike within 10 minutes)
- [ ] One test form submission creates a lead in the DB
- [ ] Realtime lead feed updates in the portal
- [ ] A test booking creates a Cal.com event
- [ ] Weekly report cron schedule is still registered (Upstash QStash console)

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Vercel Zero-Downtime Deployments — https://vercel.com/docs/frameworks/full-stack/nextjs
- Stage and Promote Deployments — https://vercel.com/changelog/stage-and-manually-promote-deployments-to-production
- Vercel Staging Environment Setup — https://vercel.com/kb/guide/set-up-a-staging-environment-on-vercel
- Vercel Incremental Migration — https://vercel.com/docs/incremental-migration
- Zero-Downtime Database Migrations — https://hrekov.com/blog/vercel-migrations
- Vercel `alias` CLI Docs — https://vercel.com/docs/cli/alias

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]
