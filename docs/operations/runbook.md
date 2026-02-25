# Production Readiness Runbook - Day 2 Operations

> **Critical Incident Response Documentation**  
> **Version**: 1.0  
> **Last Updated**: 2026-02-25  
> **Review Cadence**: Quarterly  
> **Owner**: Operations Team

## Overview

This runbook provides tactical, step-by-step instructions for handling production incidents when paying customers are affected. It addresses the critical gap between architectural completeness and operational survival.

### Incident Severity Levels

| Severity | Definition                                    | Response Time | Rollback Threshold |
| -------- | --------------------------------------------- | ------------- | ------------------ |
| SEV-0    | Complete outage, data loss, security breach   | 5 minutes     | Immediate          |
| SEV-1    | Production down, core features broken         | 15 minutes    | Within 30 minutes  |
| SEV-2    | Core feature degraded (payments, auth)        | 1 hour        | Next business day  |
| SEV-3    | Non-core feature degraded (emails, analytics) | 4 hours       | Next sprint        |

### Communication Channels

- **Incident Command**: `#incidents` Slack channel
- **Customer Communication**: `@customer-success` team
- **Executive Updates**: `@leadership` team (SEV-0/1 only)
- **External Status**: status.agency.com (if available)

---

## 🚨 CRITICAL INCIDENT PROCEDURES

### Database Failure (Supabase)

#### Symptoms

- Database connection errors
- Timeouts on API endpoints
- "Database unavailable" messages

#### Immediate Actions (First 5 minutes)

1. **Verify Supabase Status**

   ```bash
   # Check Supabase status page
   curl -s https://status.supabase.com/api/v2/status.json | jq

   # Check project-specific status
   curl -s "https://api.supabase.io/v1/projects/$SUPABASE_PROJECT_ID/status" \
     -H "Authorization: Bearer $SUPABASE_API_KEY"
   ```

2. **Check Database Connectivity**

   ```bash
   # Test direct database connection
   psql "$DATABASE_URL" -c "SELECT 1;"

   # Check connection pool status
   psql "$DATABASE_URL" -c "SELECT count(*) FROM pg_stat_activity;"
   ```

3. **Review Recent Changes**

   ```bash
   # Check recent migrations
   supabase db list --local

   # Review recent deployments
   vercel ls --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
   ```

#### Escalation Procedures

**If database is down:**

1. Contact Supabase Support: support@supabase.com
2. Enable Point-in-Time Recovery (PITR) if data corruption suspected
3. Initiate failover to read replica if available

**If connection pool exhausted:**

1. Restart application servers: `vercel restart --prod`
2. Increase connection pool size in Supabase dashboard
3. Implement rate limiting if traffic spike

#### Recovery Procedures

**Point-in-Time Recovery (Nuclear Option):**

```bash
# WARNING: All data after recovery point will be LOST
# Only use for data corruption or accidental mass deletion

# 1. Navigate to Supabase Dashboard
# 2. Project Settings → Database → PITR
# 3. Select timestamp BEFORE incident
# 4. Initiate recovery
# 5. Verify data integrity post-recovery
```

**Connection Pool Recovery:**

```sql
-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < now() - interval '30 minutes';
```

---

### Webhook Failures (Stripe, Cal.com)

#### Symptoms

- Payment processing failures
- Booking synchronization issues
- "Webhook timeout" errors
- Customer reports of paid services not activated

#### Immediate Actions

1. **Check Webhook Status**

   ```bash
   # Stripe webhook status
   curl -X GET "https://api.stripe.com/v1/webhook_endpoints" \
     -u "sk_test_...:$STRIPE_SECRET_KEY"

   # Check webhook delivery logs
   curl -X GET "https://api.stripe.com/v1/events" \
     -u "sk_test_...:$STRIPE_SECRET_KEY" \
     -d "limit=10" \
     -d "type=payment_intent.succeeded"
   ```

2. **Verify Webhook Endpoint**

   ```bash
   # Test webhook endpoint health
   curl -X POST "https://agency.com/api/webhooks/stripe" \
     -H "Content-Type: application/json" \
     -d '{"test": "health_check"}'

   # Check Cal.com webhook status
   curl -X GET "https://api.cal.com/v1/webhooks" \
     -H "Authorization: Bearer $CALCOM_API_KEY"
   ```

3. **Review Recent Changes**

   ```bash
   # Check recent deployments that might affect webhooks
   git log --oneline -10 --grep="webhook\|stripe\|calcom"

   # Check environment variables
   vercel env ls --scope=$VERCEL_ORG_ID
   ```

#### Troubleshooting Steps

**Stripe Webhook Issues:**

1. Verify webhook signature validation
2. Check webhook secret configuration
3. Review recent Stripe API changes
4. Test with Stripe CLI webhook forwarding

**Cal.com Webhook Issues:**

1. Verify API key validity
2. Check booking event mappings
3. Review Cal.com service status
4. Test webhook payload format

#### Recovery Procedures

**Manual Webhook Replay:**

```bash
# Replay failed Stripe webhook
curl -X POST "https://api.stripe.com/v1/events/{event_id}/replay" \
  -u "sk_test_...:$STRIPE_SECRET_KEY"

# Manual Cal.com booking sync
curl -X POST "https://api.cal.com/v1/bookings/{booking_id}/resync" \
  -H "Authorization: Bearer $CALCOM_API_KEY"
```

**Webhook Endpoint Recovery:**

```bash
# Redeploy webhook handlers
vercel deploy --prebuilt --prod

# Clear webhook queue (if corrupted)
redis-cli FLUSHDB  # WARNING: Clears all cache
```

---

### Authentication Failures (Clerk/Supabase Auth)

#### Symptoms

- Users unable to log in
- "Invalid session" errors
- Authentication loops
- SSO failures

#### Immediate Actions

1. **Check Auth Service Status**

   ```bash
   # Clerk status
   curl -s https://status.clerk.com/api/v2/status.json | jq

   # Supabase auth status
   curl -s "https://api.supabase.io/v1/projects/$SUPABASE_PROJECT_ID/auth/status" \
     -H "Authorization: Bearer $SUPABASE_API_KEY"
   ```

2. **Verify Auth Configuration**

   ```bash
   # Check JWT signing keys
   curl -X GET "https://api.clerk.dev/v1/jwks" \
     -H "Authorization: Bearer $CLERK_API_KEY"

   # Test auth endpoints
   curl -X POST "https://agency.com/api/auth/test" \
     -H "Content-Type: application/json"
   ```

3. **Review Recent Changes**

   ```bash
   # Check auth-related deployments
   git log --oneline -10 --grep="auth\|clerk\|jwt"

   # Check environment variables
   vercel env ls .env.production --scope=$VERCEL_ORG_ID | grep -E "CLERK|AUTH"
   ```

#### Recovery Procedures

**JWT Key Rotation Issues:**

```bash
# Update JWT keys in environment
vercel env add CLERK_JWT_PUBLIC_KEY .env.production

# Restart application to pick up new keys
vercel restart --prod
```

**Session Recovery:**

```bash
# Clear invalid sessions (affects all users)
psql "$DATABASE_URL" -c "DELETE FROM user_sessions WHERE expires_at < now();"

# Reset specific user sessions
psql "$DATABASE_URL" -c "DELETE FROM user_sessions WHERE user_id = 'USER_ID';"
```

---

## 🔄 DEPLOYMENT ROLLBACK PROCEDURES

### Emergency Rollback (≤ 3 minutes)

```bash
# STEP 1: Identify last good deployment (30 seconds)
vercel ls --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
# Note the deployment ID of the last known-good deployment

# STEP 2: Promote last good deployment (10 seconds)
vercel promote <LAST_GOOD_DEPLOYMENT_ID> \
  --token=$VERCEL_TOKEN \
  --scope=$VERCEL_ORG_ID

# STEP 3: Verify rollback (30 seconds)
curl -sI https://agency.com | grep x-vercel-id
# Confirm deployment ID matches promoted one

# STEP 4: Test critical functionality
curl -s https://agency.com/api/health
curl -s https://agency.com/api/auth/test
```

### Database Rollback (Only for Phase 3 Contract Migrations)

```bash
# WARNING: Only safe if no data written to new schema
supabase db push \
  --db-url=$PROD_DATABASE_URL \
  --target-version <PREVIOUS_MIGRATION_VERSION>

# Verify rollback success
supabase db diff --schema public
```

### Feature Flag Rollback

```bash
# Disable problematic feature flag instantly
# Navigate to: LaunchDarkly Dashboard → [Flag] → 0% rollout
# Or use API:
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/{project_key}/{feature_key}" \
  -H "Authorization: Bearer $LD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"on": false, "variations": [{"variation": false, "weight": 100}]}'
```

---

## 📊 MONITORING & ALERTING

### Critical Metrics to Monitor

**Application Performance:**

- Error rate > 1% (SEV-1)
- Response time > 2s (SEV-2)
- 95th percentile latency > 5s (SEV-2)

**Database Performance:**

- Connection pool > 80% utilization (SEV-1)
- Query time > 1s (SEV-2)
- Database CPU > 80% (SEV-1)

**Business Metrics:**

- Payment success rate < 95% (SEV-1)
- Lead form submissions < 80% of baseline (SEV-2)
- User login success rate < 90% (SEV-1)

### Alert Configuration

**Sentry Alerts:**

```typescript
// Critical error alerts
{
  "name": "Critical Production Errors",
  "query": "is:unresolved environment:production level:error",
  "alertType": "critical",
  "threshold": 5,  // 5 errors in 5 minutes
  "timeWindow": 300, // 5 minutes
  "actions": ["slack", "email", "sms"]
}

// Performance alerts
{
  "name": "High Error Rate",
  "query": "transaction.duration:>2000ms",
  "alertType": "warning",
  "threshold": 10, // 10 slow transactions in 5 minutes
  "timeWindow": 300
}
```

**Tinybird Analytics:**

```sql
-- Error rate monitoring
SELECT
  timestamp,
  count_if(error) as errors,
  count() as total_requests,
  errors / total_requests as error_rate
FROM web_requests
WHERE timestamp > now() - interval '5 minutes'
GROUP BY timestamp
HAVING error_rate > 0.01;

-- Performance monitoring
SELECT
  timestamp,
  avg(response_time) as avg_response,
  quantile(0.95, response_time) as p95_response
FROM web_requests
WHERE timestamp > now() - interval '5 minutes'
GROUP BY timestamp
HAVING avg_response > 2000;
```

---

## 🆘 ESCALATION PROCEDURES

### Escalation Matrix

| Issue Type      | Primary Contact                    | Backup                       | Escalation Time |
| --------------- | ---------------------------------- | ---------------------------- | --------------- |
| Database Issues | DBA team: dba@agency.com           | Senior Engineer: +1-555-0123 | 15 minutes      |
| Payment Issues  | Payments team: payments@agency.com | CTO: +1-555-0124             | 30 minutes      |
| Security Issues | Security team: security@agency.com | CISO: +1-555-0125            | 5 minutes       |
| Infrastructure  | DevOps team: devops@agency.com     | VP Engineering: +1-555-0126  | 30 minutes      |

### Vendor Emergency Contacts

**Supabase Support:**

- Email: support@supabase.com
- Phone: +1-555-SUPABASE (Enterprise only)
- Documentation: https://supabase.com/docs

**Vercel Support:**

- Email: support@vercel.com
- Phone: +1-555-VERCEL (Enterprise only)
- Documentation: https://vercel.com/docs

**Stripe Support:**

- Email: support@stripe.com
- Phone: +1-555-STRIPE (Available 24/7)
- Documentation: https://stripe.com/docs

**Clerk Support:**

- Email: support@clerk.com
- Documentation: https://clerk.com/docs

---

## 🧪 TESTING & VALIDATION

### Smoke Test Suite

Run after every incident resolution:

```typescript
// Critical functionality tests
const smokeTests = [
  // Homepage loads
  { url: '/', expectedStatus: 200, expectedTitle: /[A-Z].*|Your Business/ },

  // Contact form works
  { url: '/contact', expectedStatus: 200, hasForm: true },

  // Portal login accessible
  { url: 'https://portal.localhost:3001/login', expectedStatus: 200 },

  // API health check
  { url: '/api/health', expectedStatus: 200, expectedBody: { status: 'ok' } },

  // Auth endpoint works
  { url: '/api/auth/test', expectedStatus: 200 },

  // Stripe webhook accessible
  { url: '/api/webhooks/stripe', method: 'POST', expectedStatus: 200 },

  // Cal.com webhook accessible
  { url: '/api/webhooks/cal', method: 'POST', expectedStatus: 200 },
];
```

### Post-Incident Validation Checklist

- [ ] Homepage loads correctly (LCP < 2.5s)
- [ ] Contact form submissions create leads
- [ ] User authentication works
- [ ] Payment processing functions
- [ ] Booking system operational
- [ ] Dashboard loads with data
- [ ] Error rates back to baseline
- [ ] Performance metrics within SLA
- [ ] All automated tests pass
- [ ] Customer impact resolved

---

## 📋 PREVENTIVE MEASURES

### Daily Health Checks

```bash
#!/bin/bash
# daily_health_check.sh

echo "🔍 Running daily health checks..."

# 1. Check application uptime
curl -f https://agency.com/api/health || exit 1

# 2. Check database connectivity
psql "$DATABASE_URL" -c "SELECT 1;" || exit 1

# 3. Check error rates
ERROR_COUNT=$(curl -s "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/events/" \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" | jq '. | length')

if [ "$ERROR_COUNT" -gt 10 ]; then
  echo "⚠️ High error count: $ERROR_COUNT"
  exit 1
fi

# 4. Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
  echo "⚠️ High disk usage: $DISK_USAGE%"
  exit 1
fi

echo "✅ All health checks passed"
```

### Weekly Maintenance Tasks

- [ ] Review and rotate secrets
- [ ] Update security patches
- [ ] Verify backup integrity
- [ ] Test disaster recovery procedures
- [ ] Review performance metrics
- [ ] Update documentation

### Monthly Reviews

- [ ] Conduct incident post-mortems
- [ ] Review runbook effectiveness
- [ ] Update escalation contacts
- [ ] Test vendor communication channels
- [ ] Review and update monitoring thresholds

---

## 📚 REFERENCE MATERIALS

### Internal Documentation

- [Deployment Runbook](../guides/infrastructure-devops/deployment-runbook.md)
- [Architecture Documentation](../guides/)
- [Security Procedures](../security/)
- [API Documentation](../api/)

### External Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Sentry Documentation](https://docs.sentry.io)

### Tools & Commands Reference

```bash
# Essential commands for incident response
vercel --help                    # Vercel CLI commands
supabase --help                  # Supabase CLI commands
psql --help                      # PostgreSQL commands
redis-cli --help                 # Redis commands
kubectl --help                   # Kubernetes (if applicable)
```

---

## 🔄 CHANGE LOG

| Version | Date       | Changes                                 | Author          |
| ------- | ---------- | --------------------------------------- | --------------- |
| 1.0     | 2026-02-25 | Initial runbook creation                | Operations Team |
|         |            | Added comprehensive incident procedures |                 |
|         |            | Integrated with existing infrastructure |                 |

---

## 📞 EMERGENCY CONTACTS

**Primary On-Call Engineer:**

- Name: [Name]
- Phone: +1-555-XXXX
- Email: oncall@agency.com

**Secondary On-Call Engineer:**

- Name: [Name]
- Phone: +1-555-XXXX
- Email: oncall-backup@agency.com

**Executive Contacts (SEV-0/1 only):**

- CTO: +1-555-XXXX
- CEO: +1-555-XXXX

---

**Remember: This runbook is a living document. Update it after every incident, change in infrastructure, or procedure refinement.**
