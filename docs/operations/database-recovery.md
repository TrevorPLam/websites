# Database Recovery Procedures

> **Critical Database Operations Guide**  
> **Version**: 1.0  
> **Last Updated**: 2026-02-25  
> **Owner**: Database Team

## Overview

This document provides detailed procedures for recovering from database failures, data corruption, and performance issues in the Supabase PostgreSQL environment.

## 🚨 Emergency Procedures

### Complete Database Outage

#### Symptoms

- All database connections fail
- "Connection refused" errors
- Application shows "Database unavailable"
- Supabase dashboard shows project as unhealthy

#### Immediate Actions (First 5 minutes)

1. **Check Supabase Status**

   ```bash
   # Supabase platform status
   curl -s https://status.supabase.com/api/v2/status.json | jq

   # Project-specific health
   curl -s "https://api.supabase.io/v1/projects/$SUPABASE_PROJECT_ID/health" \
     -H "Authorization: Bearer $SUPABASE_API_KEY"
   ```

2. **Verify Network Connectivity**

   ```bash
   # Test DNS resolution
   nslookup db.$SUPABASE_PROJECT_ID.supabase.co

   # Test network connectivity
   telnet db.$SUPABASE_PROJECT_ID.supabase.co 5432
   ```

3. **Check Recent Changes**

   ```bash
   # Recent deployments
   vercel ls --prod --limit=5

   # Recent migrations
   supabase db list --local
   git log --oneline -5 --grep="migration\|database"
   ```

#### Escalation Procedures

**If Supabase platform is down:**

1. Contact Supabase Support immediately
2. Monitor status page for updates
3. Prepare customer communication template
4. Consider read-only mode if available

**If project-specific issue:**

1. Check Supabase dashboard for project alerts
2. Review recent database operations
3. Check connection pool settings
4. Consider restarting connection pool

### Data Corruption Detection

#### Symptoms

- Inconsistent query results
- "Data corruption" error messages
- Application reports invalid data
- Backup restoration failures

#### Detection Procedures

1. **Run Data Integrity Checks**

   ```sql
   -- Check for corrupted tables
   SELECT schemaname, tablename, attname, n_distinct, correlation
   FROM pg_stats
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema');

   -- Check for orphaned rows
   SELECT COUNT(*) FROM leads WHERE tenant_id NOT IN (SELECT id FROM tenants);

   -- Check constraint violations
   SELECT conname, conrelid::regclass, confrelid::regclass
   FROM pg_constraint
   WHERE convalidated = false;
   ```

2. **Verify Backup Integrity**

   ```bash
   # Test latest backup
   supabase db restore --backup-id latest --dry-run

   # Check backup logs
   supabase db list --backup
   ```

#### Recovery Procedures

**Point-in-Time Recovery (PITR):**

```bash
# WARNING: This will lose all data after the recovery point
# Use only for severe corruption cases

# 1. Navigate to Supabase Dashboard
# 2. Project Settings → Database → Point-in-Time Recovery
# 3. Select recovery timestamp (before corruption occurred)
# 4. Confirm recovery operation
# 5. Wait for recovery completion
# 6. Verify data integrity post-recovery
```

**Selective Data Recovery:**

```sql
-- Restore specific table from backup
CREATE TABLE leads_backup AS
SELECT * FROM leads
WHERE created_at < '2026-02-25 10:00:00';

-- Merge with current data (if safe)
INSERT INTO leads
SELECT * FROM leads_backup
WHERE id NOT IN (SELECT id FROM leads);
```

## 🔄 Performance Recovery

### Connection Pool Exhaustion

#### Symptoms

- "Too many connections" errors
- Slow query response times
- Application timeouts
- High database CPU usage

#### Diagnosis

```sql
-- Check active connections
SELECT count(*) as total_connections,
       count(*) FILTER (WHERE state = 'active') as active_connections,
       count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;

-- Check connection usage by user
SELECT usename, count(*) as connection_count
FROM pg_stat_activity
GROUP BY usename
ORDER BY connection_count DESC;

-- Check long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

#### Recovery Actions

**Immediate Relief:**

```sql
-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < now() - interval '30 minutes';

-- Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE (now() - query_start) > interval '10 minutes'
AND query NOT LIKE '%pg_stat_activity%';
```

**Connection Pool Optimization:**

```sql
-- Adjust connection pool settings in Supabase Dashboard
-- Recommended settings for high traffic:
-- - Pool size: 20-50
-- - Connection timeout: 30 seconds
-- - Idle timeout: 10 minutes
```

### Query Performance Degradation

#### Symptoms

- Slow page loads
- Database query timeouts
- High CPU usage
- Application performance alerts

#### Diagnosis

```sql
-- Find slow queries
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- > 1 second
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n_distinct DESC;

-- Analyze table statistics
ANALYZE leads;
ANALYZE tenants;
ANALYZE users;
```

#### Recovery Actions

**Index Optimization:**

```sql
-- Create missing indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_tenant_created
ON leads(tenant_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_email
ON leads(email);

-- Rebuild fragmented indexes
REINDEX INDEX CONCURRENTLY idx_leads_tenant_created;
```

**Query Optimization:**

```sql
-- Update table statistics
ANALYZE;

-- Vacuum and reindex
VACUUM ANALYZE leads;
VACUUM ANALYZE tenants;
```

## 📊 Monitoring & Prevention

### Health Monitoring Queries

```sql
-- Database health dashboard
SELECT
  'Active Connections' as metric,
  count(*) FILTER (WHERE state = 'active') as value
FROM pg_stat_activity
UNION ALL
SELECT
  'Idle Connections' as metric,
  count(*) FILTER (WHERE state = 'idle') as value
FROM pg_stat_activity
UNION ALL
SELECT
  'Database Size (MB)' as metric,
  pg_database_size(current_database()) / 1024 / 1024 as value
UNION ALL
SELECT
  'Long Running Queries' as metric,
  count(*) FILTER (WHERE (now() - query_start) > interval '5 minutes') as value
FROM pg_stat_activity;
```

### Automated Health Checks

```bash
#!/bin/bash
# database_health_check.sh

echo "🔍 Running database health checks..."

# 1. Check connection
if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "❌ Database connection failed"
  exit 1
fi

# 2. Check connection count
CONNECTION_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM pg_stat_activity;")
if [ "$CONNECTION_COUNT" -gt 80 ]; then
  echo "⚠️ High connection count: $CONNECTION_COUNT"
fi

# 3. Check slow queries
SLOW_QUERIES=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000;")
if [ "$SLOW_QUERIES" -gt 0 ]; then
  echo "⚠️ Found $SLOW_QUERIES slow queries"
fi

# 4. Check database size
DB_SIZE=$(psql "$DATABASE_URL" -t -c "SELECT pg_database_size(current_database()) / 1024 / 1024;")
if [ "$DB_SIZE" -gt 10240 ]; then  # > 10GB
  echo "⚠️ Large database size: ${DB_SIZE}MB"
fi

echo "✅ Database health check completed"
```

## 🆘 Emergency Contacts

### Supabase Support

- **Email**: support@supabase.com
- **Documentation**: https://supabase.com/docs/guides/platform/troubleshooting
- **Status Page**: https://status.supabase.com

### Internal Contacts

- **Primary DBA**: dba@agency.com, +1-555-DBA-HELP
- **Backup DBA**: dba-backup@agency.com, +1-555-DBA-BACKUP
- **On-Call Engineer**: oncall@agency.com, +1-555-ONCALL

## 📋 Recovery Checklist

### Pre-Recovery Preparation

- [ ] Identify affected systems and users
- [ ] Communicate with stakeholders
- [ ] Create recovery timeline
- [ ] Prepare rollback plan
- [ ] Document current state

### During Recovery

- [ ] Execute recovery procedures
- [ ] Monitor progress continuously
- [ ] Update stakeholders regularly
- [ ] Validate each recovery step
- [ ] Record all actions taken

### Post-Recovery Validation

- [ ] Verify data integrity
- [ ] Test application functionality
- [ ] Check performance metrics
- [ ] Run smoke tests
- [ ] Update documentation

### Post-Incident Review

- [ ] Conduct root cause analysis
- [ ] Document lessons learned
- [ ] Update procedures
- [ ] Implement preventive measures
- [ ] Schedule follow-up review

---

**Remember: Always test recovery procedures in a non-production environment before using them in production.**
