<!--
/**
 * @file docs/operations/runbooks.md
 * @role docs
 * @summary Operational runbooks for common scenarios and incidents.
 *
 * @entrypoints
 * - Operations documentation for common tasks
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - CI/CD workflows
 * - Deployment processes
 * - Monitoring setup
 *
 * @used_by
 * - Operations team
 * - On-call engineers
 * - DevOps engineers
 *
 * @runtime
 * - environment: production, staging, development
 * - side_effects: Various operational actions
 *
 * @data_flow
 * - inputs: Incident reports, monitoring alerts
 * - outputs: Resolved incidents, operational changes
 *
 * @invariants
 * - Runbooks must be kept up-to-date
 * - All steps must be tested in staging
 * - Document all manual interventions
 *
 * @status
 * - confidence: medium
 * - last_audited: 2026-02-19
 */
-->

# Operational Runbooks

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [CI/CD Workflows](../../.github/workflows), [Deployment Process](./deployment.md)

---

## Overview

Operational runbooks provide step-by-step procedures for common scenarios, incidents, and maintenance tasks. These runbooks ensure consistent, reliable operations across environments.

## Table of Contents

1. [Deployment](#deployment)
2. [Rollback](#rollback)
3. [Database Migrations](#database-migrations)
4. [Performance Issues](#performance-issues)
5. [Security Incidents](#security-incidents)
6. [Monitoring & Alerts](#monitoring--alerts)

---

## Deployment

### Prerequisites

- [ ] All CI checks passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations tested

### Standard Deployment

1. **Verify CI Status**
   ```bash
   # Check GitHub Actions for latest run
   # Ensure quality-gates job passed
   ```

2. **Create Release**
   ```bash
   # Create changeset (if needed)
   pnpm changeset

   # Version packages
   pnpm version-packages

   # Publish (if applicable)
   pnpm release
   ```

3. **Deploy to Staging**
   ```bash
   # Vercel: Auto-deploys from main branch
   # Or manual: vercel --prod --yes
   ```

4. **Verify Staging**
   - [ ] Smoke tests pass
   - [ ] Performance budgets met
   - [ ] Accessibility checks pass
   - [ ] No console errors

5. **Deploy to Production**
   ```bash
   # Vercel: Promote staging deployment
   # Or: vercel --prod --yes
   ```

6. **Post-Deployment**
   - [ ] Monitor error rates (Sentry)
   - [ ] Check performance metrics (Lighthouse)
   - [ ] Verify critical user flows

---

## Rollback

### When to Rollback

- Critical bugs affecting users
- Performance degradation
- Security vulnerabilities
- Data integrity issues

### Rollback Procedure

1. **Identify Deployment**
   ```bash
   # Vercel: Check deployment history
   # Identify last known good deployment
   ```

2. **Rollback Deployment**
   ```bash
   # Vercel: Promote previous deployment
   # Or: vercel rollback [deployment-url]
   ```

3. **Verify Rollback**
   - [ ] Site loads correctly
   - [ ] Critical features work
   - [ ] Error rates return to normal

4. **Document Incident**
   - [ ] Create incident report
   - [ ] Document root cause
   - [ ] Plan fix for next deployment

---

## Database Migrations

### Running Migrations

1. **Review Migration**
   ```bash
   # Check migration file
   cat supabase/migrations/[timestamp]_migration_name.sql
   ```

2. **Test Locally**
   ```bash
   # Run migration against local Supabase
   supabase migration up
   ```

3. **Deploy to Staging**
   ```bash
   # Apply migration to staging database
   supabase db push --db-url [staging-url]
   ```

4. **Verify Migration**
   - [ ] Check migration logs
   - [ ] Verify schema changes
   - [ ] Test affected queries

5. **Deploy to Production**
   ```bash
   # Apply migration to production
   supabase db push --db-url [production-url]
   ```

### Rollback Migration

```bash
# Revert migration
supabase migration down

# Or manually revert SQL
# Restore from backup if needed
```

---

## Performance Issues

### Symptoms

- Slow page loads
- High server response times
- Increased error rates
- User complaints

### Investigation Steps

1. **Check Monitoring**
   - [ ] Review Sentry performance data
   - [ ] Check Vercel analytics
   - [ ] Review Lighthouse reports

2. **Identify Bottlenecks**
   ```bash
   # Run bundle analysis
   ANALYZE=true pnpm --filter @clients/starter-template build

   # Check performance budgets
   pnpm validate:budgets
   ```

3. **Common Fixes**

   **Bundle Size**
   ```bash
   # Identify large dependencies
   ANALYZE=true pnpm build

   # Code split heavy components
   # Lazy load non-critical routes
   ```

   **Database Queries**
   ```sql
   -- Check slow queries
   SELECT * FROM pg_stat_statements 
   ORDER BY total_exec_time DESC 
   LIMIT 10;
   ```

   **Caching**
   ```typescript
   // Add revalidation
   export const revalidate = 3600; // 1 hour
   ```

4. **Verify Fix**
   - [ ] Re-run performance tests
   - [ ] Monitor metrics
   - [ ] Confirm improvement

---

## Security Incidents

### Types of Incidents

- Unauthorized access
- Data breaches
- DDoS attacks
- Malicious code injection

### Response Procedure

1. **Immediate Actions**
   - [ ] Isolate affected systems
   - [ ] Preserve logs and evidence
   - [ ] Notify security team

2. **Investigation**
   ```bash
   # Check access logs
   # Review Sentry error reports
   # Check database audit logs
   ```

3. **Containment**
   - [ ] Revoke compromised credentials
   - [ ] Block malicious IPs
   - [ ] Disable affected features

4. **Remediation**
   - [ ] Patch vulnerabilities
   - [ ] Update dependencies
   - [ ] Rotate secrets

5. **Post-Incident**
   - [ ] Document incident
   - [ ] Update security procedures
   - [ ] Conduct post-mortem

---

## Monitoring & Alerts

### Key Metrics

- **Error Rate** - Tracked in Sentry
- **Response Time** - Vercel Analytics
- **Uptime** - Vercel Status Page
- **Performance** - Lighthouse CI

### Setting Up Alerts

1. **Sentry Alerts**
   - Error rate thresholds
   - Performance degradation
   - New error types

2. **Vercel Alerts**
   - Deployment failures
   - Function timeouts
   - Bandwidth limits

3. **Custom Alerts**
   ```typescript
   // Example: Rate limit alert
   if (rateLimitExceeded) {
     await sendAlert('Rate limit exceeded');
   }
   ```

### Alert Response

1. **Acknowledge Alert**
2. **Investigate Root Cause**
3. **Apply Fix** (use relevant runbook)
4. **Verify Resolution**
5. **Document Incident**

---

## Maintenance Tasks

### Weekly

- [ ] Review error logs
- [ ] Check dependency updates
- [ ] Review performance metrics

### Monthly

- [ ] Security audit
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Documentation review

### Quarterly

- [ ] Full security review
- [ ] Infrastructure audit
- [ ] Disaster recovery test
- [ ] Capacity planning

---

## Emergency Contacts

- **On-Call Engineer:** [Contact Info]
- **Security Team:** [Contact Info]
- **DevOps Team:** [Contact Info]

---

## Related Documentation

- [Deployment Process](./deployment.md)
- [Security Procedures](../security/)
- [Monitoring Setup](./monitoring.md)
