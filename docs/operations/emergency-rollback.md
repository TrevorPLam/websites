# Emergency Rollback Procedures

> **Deployment Rollback & System Recovery**  
> **Version**: 1.0  
> **Last Updated**: 2026-02-25  
> **Owner**: DevOps Team

## Overview

This document provides step-by-step procedures for emergency rollback of bad deployments, system failures, and critical incidents. Target rollback time: ≤ 3 minutes.

## 🚨 Immediate Rollback (≤ 3 minutes)

### Vercel Deployment Rollback

#### Step 1: Identify Last Good Deployment (30 seconds)

```bash
# List recent production deployments
vercel ls --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID

# Look for:
# - Deployment ID (e.g., dpl_abc123def456)
# - Deployment time
# - Status: READY
# - URL matches current production

# Example output:
# dpl_abc123def456    prod    https://agency.com    READY    2026-02-25T10:30:00Z
# dpl_xyz789uvw012    prod    https://agency.com    READY    2026-02-25T09:15:00Z  ← LAST GOOD
# dpl_def345ghi678    prod    https://agency.com    READY    2026-02-25T08:00:00Z
```

#### Step 2: Promote Last Good Deployment (10 seconds)

```bash
# Promote the last known-good deployment
vercel promote dpl_xyz789uvw012 \
  --token=$VERCEL_TOKEN \
  --scope=$VERCEL_ORG_ID

# This atomically re-points the production alias
# Zero traffic drop during promotion
```

#### Step 3: Verify Rollback (30 seconds)

```bash
# Check current deployment
curl -sI https://agency.com | grep x-vercel-id
# Should show the promoted deployment ID

# Test critical endpoints
curl -s https://agency.com/api/health
curl -s https://agency.com/api/auth/test

# Verify application functionality
curl -s https://agency.com | grep -i "title\|agency"
```

#### Step 4: Monitor & Validate

```bash
# Monitor error rates
curl -s "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/issues/" \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" | jq '.[0:5]'

# Check application logs
vercel logs dpl_xyz789uvw012 --follow --token=$VERCEL_TOKEN
```

### Database Migration Rollback

#### Phase 1 Contract Migrations Only

```bash
# WARNING: Only safe for Phase 3 (contract) migrations
# Phase 1 (expand) and Phase 2 (deploy) cannot be safely rolled back

# Check migration status
supabase db list --local

# Rollback to previous migration
supabase db push \
  --db-url=$PROD_DATABASE_URL \
  --target-version <PREVIOUS_MIGRATION_VERSION>

# Verify rollback success
supabase db diff --schema public
# Should show no differences from target version
```

#### Point-in-Time Recovery (Nuclear Option)

```bash
# WARNING: All data after recovery point will be LOST
# Use only for data corruption or accidental mass deletion

# 1. Navigate to Supabase Dashboard
# 2. Project Settings → Database → Point-in-Time Recovery
# 3. Select timestamp BEFORE the bad migration
# 4. Confirm recovery operation
# 5. Wait for recovery completion
# 6. Verify data integrity
```

### Feature Flag Rollback

#### Instant Feature Disable

```bash
# Method 1: LaunchDarkly Dashboard
# Navigate to: https://app.launchdarkly.com
# Project → [Project] → Flags → [Flag Name]
# Set to: 0% rollout (instant, no deployment)

# Method 2: LaunchDarkly API
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/{project_key}/{feature_key}" \
  -H "Authorization: Bearer $LD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "on": false,
    "variations": [
      {"variation": false, "weight": 100}
    ]
  }'

# Method 3: Environment Variable (if applicable)
vercel env add FEATURE_FLAG_ENABLED .env-production value=false
vercel restart --prod
```

## 🔧 System-Specific Rollbacks

### Authentication System Rollback

#### Clerk Configuration Rollback

```bash
# Check recent auth configuration changes
git log --oneline -10 --grep="clerk\|auth"

# Rollback environment variables
vercel env ls .env.production --scope=$VERCEL_ORG_ID | grep CLERK

# Reset to previous values
vercel env add CLERK_PUBLISHABLE_KEY .env-production value=pk_test_previous_key
vercel env add CLERK_SECRET_KEY .env-production value=sk_test_previous_key
vercel env add CLERK_WEBHOOK_SECRET .env-production value=whsec_previous_secret

# Restart application
vercel restart --prod
```

#### JWT Key Issues

```bash
# If JWT keys are causing authentication failures
# 1. Restore previous JWT keys from backup
# 2. Update environment variables
vercel env add CLERK_JWT_PUBLIC_KEY .env-production value="previous_public_key"

# 3. Clear session cache
redis-cli FLUSHDB  # WARNING: Clears all cache

# 4. Restart application
vercel restart --prod
```

### Payment System Rollback

#### Stripe Integration Rollback

```bash
# Check recent Stripe-related changes
git log --oneline -10 --grep="stripe\|payment"

# Rollback webhook endpoints
curl -X GET "https://api.stripe.com/v1/webhook_endpoints" \
  -u "sk_test_...:$STRIPE_SECRET_KEY"

# Disable problematic webhooks
curl -X POST "https://api.stripe.com/v1/webhook_endpoints/{webhook_id}" \
  -u "sk_test_...:$STRIPE_SECRET_KEY" \
  -d "disabled=true"

# Restore previous API version
vercel env add STRIPE_API_VERSION .env-production value="2023-10-16"
```

### Database Connection Issues

#### Connection Pool Reset

```bash
# Restart connection pool via Supabase Dashboard
# 1. Navigate to project settings
# 2. Database → Connection Pooling
# 3. Click "Reset Pool"

# Or via SQL (if accessible)
SELECT pg_reload_conf();

# Restart application servers
vercel restart --prod
```

## 📊 Rollback Validation

### Critical Functionality Tests

```bash
# Smoke test script
#!/bin/bash
# rollback_validation.sh

echo "🔍 Running rollback validation tests..."

# Test 1: Homepage loads
if curl -s https://agency.com | grep -q "<title>"; then
  echo "✅ Homepage loads successfully"
else
  echo "❌ Homepage failed to load"
  exit 1
fi

# Test 2: API health check
if curl -s https://agency.com/api/health | grep -q '"status":"ok"'; then
  echo "✅ API health check passed"
else
  echo "❌ API health check failed"
  exit 1
fi

# Test 3: Authentication endpoint
if curl -s https://agency.com/api/auth/test | grep -q "auth.*ok"; then
  echo "✅ Authentication endpoint working"
else
  echo "❌ Authentication endpoint failed"
  exit 1
fi

# Test 4: Database connectivity
if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "✅ Database connectivity working"
else
  echo "❌ Database connectivity failed"
  exit 1
fi

# Test 5: Error rates acceptable
ERROR_COUNT=$(curl -s "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/issues/" \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" | jq '. | length')

if [ "$ERROR_COUNT" -lt 5 ]; then
  echo "✅ Error rates acceptable ($ERROR_COUNT errors)"
else
  echo "⚠️ High error count ($ERROR_COUNT errors)"
fi

echo "✅ Rollback validation completed"
```

### Performance Validation

```bash
# Check Core Web Vitals
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://agency.com" \
  | jq '.lighthouseResult.categories.performance.score'

# Should be > 0.85 (85/100)

# Check response times
time curl -s https://agency.com/api/health
# Should be < 2 seconds
```

## 🆘 Emergency Contacts

### Internal Escalation

**Primary On-Call:**

- Name: [Name]
- Phone: +1-555-ONCALL
- Email: oncall@agency.com

**Secondary On-Call:**

- Name: [Name]
- Phone: +1-555-BACKUP
- Email: oncall-backup@agency.com

**Engineering Leadership:**

- CTO: +1-555-CTO
- VP Engineering: +1-555-VPE

### Vendor Support

**Vercel Support:**

- Email: support@vercel.com
- Phone: +1-555-VERCEL (Enterprise)
- Documentation: https://vercel.com/docs

**Supabase Support:**

- Email: support@supabase.com
- Phone: +1-555-SUPABASE (Enterprise)
- Documentation: https://supabase.com/docs

**Stripe Support:**

- Email: support@stripe.com
- Phone: +1-555-STRIPE (24/7)
- Documentation: https://stripe.com/docs

## 📋 Rollback Decision Tree

```
Start: Issue detected in production
│
├── Is it a deployment issue?
│   ├── Yes → Use Vercel rollback
│   └── No → Continue
│
├── Is it a database migration issue?
│   ├── Yes → Check migration phase
│   │   ├── Phase 1/2 → Cannot rollback, continue with fix
│   │   └── Phase 3 → Use migration rollback
│   └── No → Continue
│
├── Is it a feature flag issue?
│   ├── Yes → Disable feature flag instantly
│   └── No → Continue
│
├── Is it a configuration issue?
│   ├── Yes → Rollback environment variables
│   └── No → Continue with incident response
│
└── Escalate to incident response team
```

## 📊 Rollback Metrics

### Time Targets

| Operation                   | Target Time | Maximum Time |
| --------------------------- | ----------- | ------------ |
| Vercel rollback             | 2 minutes   | 3 minutes    |
| Feature flag disable        | 30 seconds  | 1 minute     |
| Environment variable update | 1 minute    | 2 minutes    |
| Database rollback           | 5 minutes   | 10 minutes   |
| Full validation             | 3 minutes   | 5 minutes    |

### Success Criteria

- [ ] Production traffic restored
- [ ] Error rates < 1%
- [ ] Core functionality working
- [ ] Performance metrics acceptable
- [ ] Customer impact minimized

## 🔄 Post-Rollback Procedures

### Immediate Actions (0-30 minutes)

1. **Communicate Status**
   - Update incident channel
   - Notify stakeholders
   - Post status page update

2. **Monitor System**
   - Watch error rates
   - Check performance metrics
   - Monitor customer feedback

3. **Preserve Evidence**
   - Save logs from bad deployment
   - Document rollback actions
   - Record timeline

### Follow-up Actions (30 minutes - 2 hours)

1. **Root Cause Analysis**
   - Investigate what went wrong
   - Review deployment process
   - Analyze failure patterns

2. **Preventive Measures**
   - Update deployment procedures
   - Add additional tests
   - Improve monitoring

3. **Documentation Updates**
   - Update runbook
   - Record lessons learned
   - Share with team

### Long-term Actions (2 hours - 1 week)

1. **Process Improvements**
   - Review deployment pipeline
   - Add rollback automation
   - Improve testing coverage

2. **Team Training**
   - Conduct rollback drills
   - Review procedures with team
   - Update on-call training

3. **Monitoring Enhancements**
   - Add deployment health checks
   - Improve alerting
   - Create rollback dashboards

---

**Remember: Speed is critical in rollback situations. Have all commands and contact information readily available before an incident occurs.**
