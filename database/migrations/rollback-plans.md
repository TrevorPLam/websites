# Database Migration Rollback Plans

> **Critical Rollback Documentation** | Zero-Downtime Recovery · Emergency Procedures  
> **Version**: 1.0 | **Last Updated**: 2026-02-26 | **Owner**: Database Team

## Overview

This document contains rollback procedures for all database migrations. Each migration includes specific rollback SQL and verification steps to ensure safe recovery in production.

## 🚨 Emergency Rollback Procedures

### Immediate Response (First 5 Minutes)

1. **Stop Application Deployment**

   ```bash
   # Stop any ongoing deployments
   vercel list --prod
   # Scale down if using containers
   kubectl scale deployment --replicas=0
   ```

2. **Identify Failed Migration**

   ```bash
   # Check last applied migration
   pnpm db:status

   # Review migration logs
   grep "ERROR" /var/log/migrations.log
   ```

3. **Assess Impact**
   - Check application error rate in Sentry
   - Monitor database connections
   - Verify data integrity

---

## Migration-Specific Rollback Plans

### 20240101000000_tenants.sql

**Migration Purpose**: Create tenants table with basic structure

**Rollback SQL**:

```sql
-- Phase 1: Verify no data dependencies
SELECT COUNT(*) as tenant_count FROM app_public.tenants;
SELECT COUNT(*) as leads_count FROM app_public.leads;

-- Phase 2: If no tenants exist, safe to drop
-- WARNING: Only run if tenant_count = 0
DROP TABLE IF EXISTS app_public.tenants CASCADE;

-- Phase 3: If tenants exist, archive first
CREATE TABLE tenants_archive_$(date +%Y%m%d) AS
SELECT * FROM app_public.tenants;

DROP TABLE app_public.tenants CASCADE;
```

**Verification Steps**:

1. Confirm table no longer exists: `\dt app_public.tenants`
2. Verify application handles missing table gracefully
3. Check that no foreign key constraints remain

**Risk Level**: HIGH if data exists, LOW if table is empty

---

### 20240103000000_leads.sql

**Migration Purpose**: Create leads table with tenant isolation and RLS

**Rollback SQL**:

```sql
-- Phase 1: Archive existing data (if any)
CREATE TABLE leads_archive_$(date +%Y%m%d) AS
SELECT * FROM app_public.leads;

-- Phase 2: Drop RLS policies
DROP POLICY IF EXISTS "tenants_can_read_own_leads" ON app_public.leads;
DROP POLICY IF EXISTS "tenants_can_insert_own_leads" ON app_public.leads;
DROP POLICY IF EXISTS "tenants_can_update_own_leads" ON app_public.leads;

-- Phase 3: Drop indexes
DROP INDEX IF EXISTS leads_tenant_email_created_bucket_uniq;
DROP INDEX IF EXISTS leads_tenant_created_idx;

-- Phase 4: Drop table
DROP TABLE IF EXISTS app_public.leads;

-- Phase 5: Verify tenant table still exists
SELECT COUNT(*) FROM app_public.tenants;
```

**Verification Steps**:

1. Confirm leads table is removed: `\dt app_public.leads`
2. Verify tenant table unaffected
3. Check application handles missing leads table
4. Confirm no orphaned foreign key constraints

**Risk Level**: MEDIUM (data loss possible but archive created)

---

### 20240113000000_rls_policies.sql

**Migration Purpose**: Implement Row Level Security policies

**Rollback SQL**:

```sql
-- Phase 1: Drop all RLS policies (safe operation)
DROP POLICY IF EXISTS "tenants_can_read_own_leads" ON app_public.leads;
DROP POLICY IF EXISTS "tenants_can_insert_own_leads" ON app_public.leads;
DROP POLICY IF EXISTS "tenants_can_update_own_leads" ON app_public.leads;
DROP POLICY IF EXISTS "tenants_can_delete_own_leads" ON app_public.leads;

-- Phase 2: Disable RLS on leads table (if needed)
ALTER TABLE app_public.leads DISABLE ROW LEVEL SECURITY;

-- Phase 3: Verify table still exists and is accessible
SELECT COUNT(*) FROM app_public.leads;

-- Phase 4: Test that reads work without RLS
SELECT COUNT(*) FROM app_public.leads LIMIT 1;
```

**Verification Steps**:

1. Confirm RLS policies are removed
2. Test basic table operations
3. Verify application can read/write without RLS restrictions
4. Check that no policy-related errors occur

**Risk Level**: LOW (RLS changes are non-destructive)

---

### 20260224000001_add_missing_tenant_columns.sql

**Migration Purpose**: Add missing columns to tenants table

**Rollback SQL**:

```sql
-- Phase 1: Check if columns have data
SELECT
  COUNT(CASE WHEN billing_status IS NOT NULL THEN 1 END) as billing_status_count,
  COUNT(CASE WHEN subscription_tier IS NOT NULL THEN 1 END) as subscription_tier_count,
  COUNT(CASE WHEN webhook_secret IS NOT NULL THEN 1 END) as webhook_secret_count
FROM app_public.tenants;

-- Phase 2: If no data in new columns, safe to drop
ALTER TABLE app_public.tenants
  DROP COLUMN IF EXISTS billing_status,
  DROP COLUMN IF EXISTS subscription_tier,
  DROP COLUMN IF EXISTS webhook_secret,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS trial_ends_at;

-- Phase 3: If data exists, archive first
CREATE TABLE tenants_columns_archive_$(date +%Y%m%d) AS
SELECT id, billing_status, subscription_tier, webhook_secret,
       stripe_customer_id, trial_ends_at
FROM app_public.tenants
WHERE billing_status IS NOT NULL
   OR subscription_tier IS NOT NULL
   OR webhook_secret IS NOT NULL;

-- Then drop columns
ALTER TABLE app_public.tenants
  DROP COLUMN billing_status,
  DROP COLUMN subscription_tier,
  DROP COLUMN webhook_secret,
  DROP COLUMN stripe_customer_id,
  DROP COLUMN trial_ends_at;
```

**Verification Steps**:

1. Confirm columns are removed: `\d app_public.tenants`
2. Verify tenant table still functions
3. Check application handles missing columns gracefully
4. Test tenant creation/update operations

**Risk Level**: MEDIUM (potential data loss if columns contain data)

---

### 20260224000002_add_missing_leads_columns.sql

**Migration Purpose**: Add missing columns to leads table

**Rollback SQL**:

```sql
-- Phase 1: Check data in new columns
SELECT
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as phone_count,
  COUNT(CASE WHEN company IS NOT NULL THEN 1 END) as company_count,
  COUNT(CASE WHEN score IS NOT NULL THEN 1 END) as score_count
FROM app_public.leads;

-- Phase 2: Drop new columns (safe if no data)
ALTER TABLE app_public.leads
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS company,
  DROP COLUMN IF EXISTS score,
  DROP COLUMN IF EXISTS source_campaign,
  DROP COLUMN IF EXISTS assigned_to;

-- Phase 3: Archive if data exists
CREATE TABLE leads_columns_archive_$(date +%Y%m%d) AS
SELECT id, phone, company, score, source_campaign, assigned_to
FROM app_public.leads
WHERE phone IS NOT NULL
   OR company IS NOT NULL
   OR score IS NOT NULL;

-- Then drop columns
ALTER TABLE app_public.leads
  DROP COLUMN phone,
  DROP COLUMN company,
  DROP COLUMN score,
  DROP COLUMN source_campaign,
  DROP COLUMN assigned_to;
```

**Verification Steps**:

1. Confirm columns removed: `\d app_public.leads`
2. Verify leads table still functions
3. Test lead creation/update operations
4. Check RLS policies still work

**Risk Level**: MEDIUM (potential data loss if columns contain data)

---

### 20260224000003_processed_webhooks_table.sql

**Migration Purpose**: Create processed_webhooks table for tracking

**Rollback SQL**:

```sql
-- Phase 1: Archive webhook data (important for debugging)
CREATE TABLE processed_webhooks_archive_$(date +%Y%m%d) AS
SELECT * FROM app_public.processed_webhooks;

-- Phase 2: Drop indexes
DROP INDEX IF EXISTS processed_webhooks_tenant_id_idx;
DROP INDEX IF EXISTS processed_webhooks_event_type_idx;
DROP INDEX IF EXISTS processed_webhooks_created_at_idx;
DROP INDEX IF EXISTS processed_webhooks_status_idx;

-- Phase 3: Drop RLS policies
DROP POLICY IF EXISTS "tenants_can_read_own_webhooks" ON app_public.processed_webhooks;
DROP POLICY IF EXISTS "webhooks_insert_policy" ON app_public.processed_webhooks;

-- Phase 4: Drop table
DROP TABLE IF EXISTS app_public.processed_webhooks;

-- Phase 5: Verify other tables unaffected
SELECT COUNT(*) FROM app_public.leads;
SELECT COUNT(*) FROM app_public.tenants;
```

**Verification Steps**:

1. Confirm table removed: `\dt app_public.processed_webhooks`
2. Verify webhook processing fails gracefully
3. Check that webhook logs go to alternative logging
4. Test application handles missing webhook table

**Risk Level**: LOW (webhook tracking is auxiliary)

---

## 🔄 General Rollback Procedures

### Pre-Rollback Checklist

- [ ] Identify migration to rollback
- [ ] Review rollback SQL for safety
- [ ] Create data archive if needed
- [ ] Schedule during low-traffic window
- [ ] Notify team of rollback
- [ ] Prepare verification tests

### Rollback Execution Steps

1. **Create Backup**

   ```bash
   # Timestamped backup
   pg_dump $DATABASE_URL --schema-only --no-owner \
     > rollback-backup-$(date +%Y%m%d%H%M%S).sql
   ```

2. **Execute Rollback SQL**
   - Use migration runner with rollback command
   - Or execute SQL manually via psql
   - Monitor for errors during execution

3. **Verify Rollback**
   - Check table structures match pre-migration state
   - Test application functionality
   - Verify data integrity
   - Monitor error rates

4. **Update Migration Tracking**
   ```sql
   -- Mark migration as rolled back
   UPDATE schema_migrations
   SET rollback_available = false,
       metadata = jsonb_set(
         metadata,
         '{rolled_back_at}',
         to_jsonb(now())
       )
   WHERE version = 'MIGRATION_VERSION';
   ```

### Post-Rollback Verification

- [ ] Application starts successfully
- [ ] Database operations work normally
- [ ] No error spikes in monitoring
- [ ] Data integrity confirmed
- [ ] Performance baseline restored

---

## 🚨 Emergency Contacts

| Situation           | Contact       | Method                    |
| ------------------- | ------------- | ------------------------- |
| Database Emergency  | Database Team | Slack #database-emergency |
| Application Issues  | Tech Lead     | Slack #deployments        |
| Production Incident | Ops Team      | PagerDuty                 |

---

## 📋 Testing Rollback Procedures

### Staging Environment Testing

Before any production rollback:

1. **Test rollback on staging**

   ```bash
   # Apply migration to staging
   pnpm db:migrate --env=staging

   # Verify migration works
   pnpm test:integration

   # Test rollback
   pnpm db:rollback --env=staging

   # Verify rollback works
   pnpm test:integration
   ```

2. **Validate data integrity**
   - Compare table structures
   - Verify data consistency
   - Test application functionality

### Rollback Drill Schedule

- **Monthly**: Test rollback of most recent migration
- **Quarterly**: Full rollback drill with multiple migrations
- **Annually**: Complete rollback procedure review

---

## 📚 References

- [PostgreSQL ALTER TABLE Documentation](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Supabase Migration Guide](https://supabase.com/docs/guides/database/migrations)
- [Zero-Downtime Schema Changes](https://xata.io/blog/zero-downtime-schema-migrations-postgresql)
- [Database Rollback Best Practices](https://www.postgresql.org/docs/current/ddl-alter.html)

---

## 📝 Maintenance Notes

- Review rollback plans monthly
- Update after each new migration
- Test rollback procedures regularly
- Archive old rollback plans after 6 months
- Maintain rollback SQL in version control
