# Database Migration Runbook

> **Production Migration Procedures** | Zero-Downtime Operations · Safety Checks  
> **Version**: 1.0 | **Last Updated**: 2026-02-26 | **Owner**: Database Team

## Overview

This runbook provides step-by-step procedures for safely executing database migrations in production. It ensures zero-downtime deployments with proper validation, rollback capabilities, and comprehensive monitoring.

## 🚨 Critical Safety Rules

1. **NEVER run migrations during peak hours** (9 AM - 6 PM in primary timezone)
2. **ALWAYS create a backup before any migration**
3. **VALIDATE in staging first** for any non-trivial migration
4. **MONITOR throughout the process** - never walk away
5. **HAVE rollback plan ready** before starting

---

## 📋 Pre-Migration Checklist

### Environment Validation

- [ ] **Staging Validation Complete**
  - Migration tested on staging with production-like data
  - All smoke tests pass
  - Performance impact measured (< 5% degradation)

- [ ] **Team Notification Sent**
  - Posted in #deployments Slack channel
  - Key stakeholders aware of maintenance window
  - On-call engineer notified and available

- [ ] **Backup Strategy Confirmed**
  - Automated backup scheduled
  - Manual backup verified
  - Restore procedure tested (quarterly)

- [ ] **Rollback Plan Ready**
  - Rollback SQL reviewed and tested
  - Rollback script validated
  - Rollback time estimate documented

### System Health Checks

- [ ] **Database Health**

  ```bash
  # Check connection count
  pnpm db:health-checks

  # Verify no long-running queries
  pnpm db:check-long-queries

  # Check replication lag (if applicable)
  pnpm db:replication-lag
  ```

- [ ] **Application Health**

  ```bash
  # Check error rates
  # Sentry dashboard: error rate < 0.1%

  # Check response times
  # Vercel Speed Insights: p95 < 500ms

  # Check active users
  # Analytics: < 100 active users
  ```

- [ ] **Infrastructure Health**

  ```bash
  # Check CPU/memory usage
  # Supabase dashboard: CPU < 70%, Memory < 80%

  # Check disk space
  # > 20% free space required

  # Check network latency
  # < 50ms to database
  ```

---

## 🚀 Migration Execution

### Phase 1: Preparation (T-15 minutes)

1. **Final Health Check**

   ```bash
   # Run comprehensive health check
   ./scripts/migrate-production.sh status

   # Verify all systems green
   ```

2. **Create Backup**

   ```bash
   # Manual backup (additional to automated)
   ./scripts/migrate-production.sh backup

   # Verify backup created
   ls -la backups/
   ```

3. **Prepare Rollback**

   ```bash
   # Test rollback script syntax
   ./scripts/migrate-production.sh rollback --dry-run

   # Verify rollback SQL exists
   cat database/migrations/rollback-plans.md
   ```

### Phase 2: Execution (T-5 minutes)

1. **Start Migration**

   ```bash
   # Dry run first
   ./scripts/migrate-production.sh migrate --dry-run

   # Execute migration
   ./scripts/migrate-production.sh migrate

   # Monitor progress
   tail -f logs/migrations.log
   ```

2. **Real-time Monitoring**
   - **Database Connections**: Watch for connection spikes
   - **Error Rates**: Monitor Sentry for any errors
   - **Response Times**: Check Vercel analytics
   - **Lock Monitoring**: Watch for blocking locks

3. **Validation Checks**

   ```bash
   # Post-migration validation
   psql $DATABASE_URL -f database/migrations/validation.sql

   # Application smoke tests
   ./scripts/smoke-test.sh

   # Manual verification
   curl -f https://your-app.com/api/health
   ```

### Phase 3: Verification (T+15 minutes)

1. **Comprehensive Validation**

   ```bash
   # Run full validation suite
   ./scripts/migrate-production.sh validate

   # Check data integrity
   ./scripts/verify-data-integrity.sh

   # Performance verification
   ./scripts/performance-smoke-test.sh
   ```

2. **Application Testing**
   - **User Registration**: Test new user signup
   - **Lead Capture**: Test lead form submission
   - **Tenant Operations**: Test tenant creation/updates
   - **Authentication**: Test login/logout flow

3. **Monitoring Verification**
   - **Error Rates**: Should be < 0.1%
   - **Response Times**: Should be within 5% of baseline
   - **Database Performance**: No slow queries
   - **User Activity**: Normal patterns resumed

---

## 🔄 Rollback Procedures

### Immediate Rollback (T+0 to T+5 minutes)

**Trigger**: Any of the following conditions

- Error rate > 1%
- Response time degradation > 20%
- Database errors in application logs
- Migration script failure

**Steps**:

1. **Stop Migration** (if still running)

   ```bash
   # Kill migration process
   pkill -f "migration-runner"

   # Check for partial completion
   ./scripts/migrate-production.sh status
   ```

2. **Execute Rollback**

   ```bash
   # Rollback last migration
   ./scripts/migrate-production.sh rollback --force

   # Verify rollback success
   ./scripts/migrate-production.sh status
   ```

3. **Validate Recovery**

   ```bash
   # Run validation
   psql $DATABASE_URL -f database/migrations/validation.sql

   # Test application
   ./scripts/smoke-test.sh

   # Monitor recovery
   tail -f logs/application.log
   ```

### Extended Rollback (T+5 to T+30 minutes)

**Trigger**: Issues discovered after initial deployment

**Steps**:

1. **Assess Impact**

   ```bash
   # Check data consistency
   ./scripts/verify-data-consistency.sh

   # Check application functionality
   ./scripts/comprehensive-smoke-test.sh
   ```

2. **Restore from Backup** (if needed)

   ```bash
   # Identify appropriate backup
   ls -la backups/backup-*

   # Restore database
   pg_restore $DATABASE_URL --clean --if-exists backups/backup-YYYYMMDDHHMMSS.sql.gz

   # Verify restoration
   ./scripts/post-restore-validation.sh
   ```

3. **Communication**
   - Post update in #deployments
   - Notify stakeholders of resolution
   - Document lessons learned

---

## 📊 Monitoring During Migration

### Key Metrics to Watch

| Metric         | Tool             | Threshold     | Action            |
| -------------- | ---------------- | ------------- | ----------------- |
| Error Rate     | Sentry           | > 0.5%        | Consider rollback |
| Response Time  | Vercel           | > 2x baseline | Investigate       |
| DB Connections | Supabase         | > 80% max     | Monitor closely   |
| Long Queries   | pg_stat_activity | > 30 seconds  | Investigate       |
| Lock Waits     | pg_locks         | > 5           | Monitor           |

### Monitoring Commands

```bash
# Database connections
watch "psql $DATABASE_URL -c 'SELECT count(*) FROM pg_stat_activity WHERE state != \"idle\"'"

# Long-running queries
watch "psql $DATABASE_URL -c 'SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval \"30 seconds\"'"

# Lock monitoring
watch "psql $DATABASE_URL -c 'SELECT blocked_locks.pid AS blocked_pid, blocked_activity.usename AS blocked_user, blocking_locks.pid AS blocking_pid, blocking_activity.usename AS blocking_user, blocked_activity.query AS blocked_statement FROM pg_catalog.pg_locks blocked_locks JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid WHERE NOT blocked_locks.GRANTED;'"
```

---

## 🚨 Emergency Procedures

### Complete Database Outage

**Symptoms**:

- All database connections fail
- "Connection refused" errors
- Application shows "Database unavailable"

**Actions**:

1. **Check Supabase Status**

   ```bash
   curl -s https://status.supabase.com/api/v2/status.json | jq
   ```

2. **Verify Network Connectivity**

   ```bash
   nslookup db.$SUPABASE_PROJECT_ID.supabase.co
   telnet db.$SUPABASE_PROJECT_ID.supabase.co 5432
   ```

3. **Contact Support**
   - Supabase Support (if platform issue)
   - Database Team (if configuration issue)

### Data Corruption Detected

**Symptoms**:

- Inconsistent query results
- Constraint violations
- Application logic errors

**Actions**:

1. **Stop Application**

   ```bash
   # Scale down to zero
   kubectl scale deployment --replicas=0
   # Or disable in Vercel
   vercel projects ls
   ```

2. **Assess Damage**

   ```bash
   # Check data consistency
   ./scripts/data-consistency-check.sh

   # Identify affected tables
   ./scripts/identify-corruption.sh
   ```

3. **Restore Strategy**
   - **Option A**: Point-in-time recovery (if available)
   - **Option B**: Restore from recent backup
   - **Option C**: Manual data repair (last resort)

---

## 📋 Post-Migration Procedures

### Validation Checklist

- [ ] **All Smoke Tests Pass**

  ```bash
  ./scripts/smoke-test.sh
  ./scripts/user-journey-tests.sh
  ```

- [ ] **Performance Baseline Met**

  ```bash
  # Response times within 5% of baseline
  # Error rates < 0.1%
  # Database performance normal
  ```

- [ ] **Data Integrity Verified**

  ```bash
  # No orphaned records
  # All constraints satisfied
  # RLS policies working
  ```

- [ ] **Monitoring Stable**
  ```bash
  # No error spikes
  # Normal traffic patterns
  # All alerts cleared
  ```

### Documentation Updates

- [ ] **Migration Record Updated**

  ```bash
  # Update migration tracking
  echo "$(date): Migration VERSION completed successfully" >> migration-history.log
  ```

- [ ] **Runbook Updated**
  - Add lessons learned
  - Update procedures if needed
  - Document any issues

- [ ] **Team Debrief**
  - Post in #deployments
  - Schedule retrospective if issues
  - Update training materials

---

## 📞 Contact Information

| Situation          | Contact          | Method                    | Escalation |
| ------------------ | ---------------- | ------------------------- | ---------- |
| Database Emergency | Database Team    | Slack #database-emergency | PagerDuty  |
| Application Issues | Tech Lead        | Slack #deployments        | Phone      |
| Platform Issues    | Supabase Support | Support Portal            | Email      |
| Security Incident  | Security Team    | Slack #security           | PagerDuty  |

---

## 📚 References

- [Database Recovery Procedures](database-recovery.md)
- [Schema Migration Safety Guide](../docs/guides/backend-data/databases/schema-migration-safety.md)
- [Supabase Migration Documentation](https://supabase.com/docs/guides/database/migrations)
- [Zero-Downtime Deployment Guide](../docs/guides/operations/zero-downtime-deployments.md)

---

## 📝 Maintenance Notes

- **Review this runbook monthly**
- **Update after each major migration**
- **Test rollback procedures quarterly**
- **Train new team members on procedures**
- **Archive old migration plans after 6 months**

---

## 🔄 Version History

| Version | Date       | Changes          | Author        |
| ------- | ---------- | ---------------- | ------------- |
| 1.0     | 2026-02-26 | Initial creation | Database Team |
|         |            |                  |               |
