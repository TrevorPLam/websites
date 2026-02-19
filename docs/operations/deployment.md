<!--
/**
 * @file docs/operations/deployment.md
 * @role docs
 * @summary Production deployment process and procedures.
 *
 * @entrypoints
 * - Deployment documentation for production releases
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - CI/CD workflows
 * - Environment configuration
 * - Database migrations
 *
 * @used_by
 * - Release engineers
 * - DevOps team
 * - CI/CD pipeline
 *
 * @runtime
 * - environment: production, staging
 * - side_effects: Deploys applications
 *
 * @data_flow
 * - inputs: Code changes, configuration
 * - outputs: Deployed applications
 *
 * @invariants
 * - All deployments must pass CI checks
 * - Staging must be tested before production
 * - Rollback plan must be ready
 *
 * @status
 * - confidence: medium
 * - last_audited: 2026-02-19
 */
-->

# Deployment Process

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [CI Workflow](../../.github/workflows/ci.yml), [Operational Runbooks](./runbooks.md)

---

## Overview

This document describes the deployment process for marketing-websites monorepo clients. All deployments follow a standardized process to ensure reliability and consistency.

## Deployment Architecture

### Environments

1. **Development** - Local development (ports 3101+)
2. **Staging** - Pre-production testing (auto-deploy from `develop`)
3. **Production** - Live client sites (auto-deploy from `main`)

### Deployment Platforms

- **Vercel** - Primary platform (Next.js optimized)
- **Docker** - Containerized deployments (starter-template only)
- **Self-hosted** - Custom infrastructure (if needed)

## Pre-Deployment Checklist

### Code Quality

- [ ] All CI checks passing (`quality-gates` job)
- [ ] Code reviewed and approved
- [ ] No merge conflicts
- [ ] Tests passing (`pnpm test`)
- [ ] Type checking passing (`pnpm type-check`)
- [ ] Linting passing (`pnpm lint`)

### Configuration

- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Feature flags set correctly
- [ ] Third-party integrations verified

### Documentation

- [ ] CHANGELOG updated (if applicable)
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

## Deployment Workflow

### 1. Development → Staging

**Trigger:** Push to `develop` branch

**Process:**
1. CI runs quality gates
2. Vercel auto-deploys to staging
3. Smoke tests run automatically
4. Performance audit runs (Lighthouse CI)

**Verification:**
```bash
# Check staging deployment
# Verify all features work
# Review performance metrics
```

### 2. Staging → Production

**Trigger:** Merge `develop` → `main` (or direct push to `main`)

**Process:**
1. CI runs full quality gates
2. Vercel auto-deploys to production
3. Post-deployment checks run

**Manual Promotion (if needed):**
```bash
# Vercel CLI
vercel --prod --yes

# Or promote via Vercel dashboard
```

### 3. Hotfix Deployment

**Trigger:** Direct push to `main` (emergency fixes only)

**Process:**
1. Create hotfix branch from `main`
2. Apply fix and test locally
3. Merge to `main` (bypass staging if urgent)
4. Monitor closely post-deployment

## Vercel Deployment

### Automatic Deployment

Vercel automatically deploys:
- **Staging:** Every push to `develop`
- **Production:** Every push to `main`

### Configuration

Each client has its own Vercel project:
- **Root Directory:** `clients/[client-name]`
- **Framework:** Next.js
- **Build Command:** `pnpm build` (from root)
- **Output Directory:** `.next`

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_*` - Public variables
- `SUPABASE_*` - Database credentials
- `HUBSPOT_*` - CRM integration
- `SENTRY_*` - Error tracking

## Docker Deployment

### Building Image

```bash
# Build from monorepo root
docker build -f clients/starter-template/Dockerfile -t starter-template .

# Tag for registry
docker tag starter-template [registry]/starter-template:[tag]
```

### Running Container

```bash
# Run locally
docker run -p 3101:3101 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3101 \
  starter-template

# Production (with env file)
docker run -d \
  --env-file .env.production.local \
  -p 3101:3101 \
  starter-template
```

## Post-Deployment Verification

### Immediate Checks

1. **Site Accessibility**
   ```bash
   curl https://[client-domain].com
   # Should return 200 OK
   ```

2. **Critical Pages**
   - [ ] Homepage loads
   - [ ] Contact form works
   - [ ] Booking flow (if enabled)
   - [ ] Blog pages (if enabled)

3. **Monitoring**
   - [ ] Check Sentry for errors
   - [ ] Review Vercel analytics
   - [ ] Verify performance metrics

### Performance Verification

```bash
# Run Lighthouse audit
# Check Core Web Vitals
# Verify bundle sizes
```

### Rollback Plan

If issues detected:
1. Identify last known good deployment
2. Rollback via Vercel dashboard or CLI
3. Document incident
4. Plan fix for next deployment

## Database Migrations

### Pre-Deployment

1. **Test Migration Locally**
   ```bash
   supabase migration up
   ```

2. **Review Migration SQL**
   ```bash
   cat supabase/migrations/[timestamp]_*.sql
   ```

### Deployment

1. **Staging First**
   ```bash
   supabase db push --db-url [staging-url]
   ```

2. **Verify in Staging**
   - [ ] Schema changes applied
   - [ ] Data integrity maintained
   - [ ] Queries work correctly

3. **Production**
   ```bash
   supabase db push --db-url [production-url]
   ```

### Rollback

```bash
# Revert migration
supabase migration down

# Or restore from backup
```

## Monitoring

### Key Metrics

- **Error Rate** - Sentry dashboard
- **Response Time** - Vercel Analytics
- **Uptime** - Vercel Status Page
- **Performance** - Lighthouse CI reports

### Alerts

Configure alerts for:
- High error rates (>1%)
- Slow response times (>2s)
- Deployment failures
- Database connection issues

## Troubleshooting

### Deployment Failures

1. **Check Build Logs**
   ```bash
   # Vercel dashboard → Deployments → Logs
   ```

2. **Common Issues**
   - Environment variables missing
   - Build timeout (increase in Vercel settings)
   - Dependency conflicts

3. **Fix and Redeploy**
   ```bash
   # Fix issue
   # Push to trigger new deployment
   ```

### Performance Issues

See [Operational Runbooks](./runbooks.md#performance-issues)

---

## Related Documentation

- [Operational Runbooks](./runbooks.md)
- [CI/CD Workflows](../../.github/workflows)
- [Environment Variables](../getting-started/environment-variables.md)
