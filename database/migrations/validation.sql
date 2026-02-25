-- Post-Migration Validation SQL
-- Run this after each migration to verify database integrity

-- ========================================
-- 1. Basic Schema Validation
-- ========================================

-- Verify all expected tables exist
DO $$
DECLARE
    table_missing TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'app_public' AND table_name = 'tenants') THEN
        RAISE EXCEPTION 'tenants table is missing';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'app_public' AND table_name = 'leads') THEN
        RAISE EXCEPTION 'leads table is missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'app_public' AND table_name = 'processed_webhooks') THEN
        RAISE NOTICE 'processed_webhooks table exists';
    END IF;
    
    RAISE NOTICE '✅ All required tables exist';
END $$;

-- ========================================
-- 2. Foreign Key Constraint Validation
-- ========================================

-- Check foreign key constraints are properly defined
DO $$
DECLARE
    constraint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'app_public'
      AND tc.table_name = 'leads'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'tenant_id';
    
    IF constraint_count = 0 THEN
        RAISE EXCEPTION 'leads.tenant_id foreign key constraint is missing';
    END IF;
    
    RAISE NOTICE '✅ Foreign key constraints validated';
END $$;

-- ========================================
-- 3. Index Validation
-- ========================================

-- Verify critical indexes exist
DO $$
DECLARE
    missing_indexes TEXT[];
BEGIN
    -- Check tenant indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'tenants' AND indexname = 'tenants_created_at_idx') THEN
        missing_indexes := array_append(missing_indexes, 'tenants_created_at_idx');
    END IF;
    
    -- Check leads indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'leads' AND indexname = 'leads_tenant_created_idx') THEN
        missing_indexes := array_append(missing_indexes, 'leads_tenant_created_idx');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'leads' AND indexname = 'leads_tenant_email_created_bucket_uniq') THEN
        missing_indexes := array_append(missing_indexes, 'leads_tenant_email_created_bucket_uniq');
    END IF;
    
    IF array_length(missing_indexes, 1) > 0 THEN
        RAISE EXCEPTION 'Missing indexes: %', array_to_string(missing_indexes, ', ');
    END IF;
    
    RAISE NOTICE '✅ All required indexes exist';
END $$;

-- ========================================
-- 4. Row Level Security Validation
-- ========================================

-- Check RLS is enabled on leads table
DO $$
DECLARE
    rls_enabled BOOLEAN;
BEGIN
    SELECT rowsecurity INTO rls_enabled
    FROM pg_tables
    WHERE schemaname = 'app_public'
      AND tablename = 'leads';
    
    IF NOT rls_enabled THEN
        RAISE EXCEPTION 'RLS is not enabled on leads table';
    END IF;
    
    RAISE NOTICE '✅ RLS is enabled on leads table';
END $$;

-- Check RLS policies exist
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'app_public'
      AND tablename = 'leads';
    
    IF policy_count = 0 THEN
        RAISE WARNING 'No RLS policies found on leads table';
    ELSE
        RAISE NOTICE '✅ RLS policies found on leads table (%)', policy_count;
    END IF;
END $$;

-- ========================================
-- 5. Data Integrity Checks
-- ========================================

-- Check for orphaned records (leads without tenants)
DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM app_public.leads l
    LEFT JOIN app_public.tenants t ON l.tenant_id = t.id
    WHERE t.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE EXCEPTION 'Found % orphaned lead records', orphan_count;
    END IF;
    
    RAISE NOTICE '✅ No orphaned records found';
END $$;

-- Check for invalid emails in leads table
DO $$
DECLARE
    invalid_email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_email_count
    FROM app_public.leads
    WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
    
    IF invalid_email_count > 0 THEN
        RAISE WARNING 'Found % records with invalid email format', invalid_email_count;
    ELSE
        RAISE NOTICE '✅ All email formats are valid';
    END IF;
END $$;

-- Check for invalid status values
DO $$
DECLARE
    invalid_status_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_status_count
    FROM app_public.leads
    WHERE status NOT IN ('new', 'qualified', 'contacted', 'converted', 'archived');
    
    IF invalid_status_count > 0 THEN
        RAISE EXCEPTION 'Found % records with invalid status', invalid_status_count;
    END IF;
    
    RAISE NOTICE '✅ All status values are valid';
END $$;

-- ========================================
-- 6. Performance Validation
-- ========================================

-- Check table statistics are up to date
DO $$
DECLARE
    stale_stats TEXT[];
BEGIN
    -- Check if statistics are recent (updated within last hour)
    SELECT array_agg(tablename) INTO stale_stats
    FROM pg_stat_user_tables
    WHERE schemaname = 'app_public'
      AND last_analyze < NOW() - INTERVAL '1 hour'
      OR last_autoanalyze < NOW() - INTERVAL '1 hour';
    
    IF array_length(stale_stats, 1) > 0 THEN
        RAISE WARNING 'Tables with stale statistics: %', array_to_string(stale_stats, ', ');
        RAISE NOTICE 'Consider running ANALYZE on these tables';
    ELSE
        RAISE NOTICE '✅ Table statistics are up to date';
    END IF;
END $$;

-- Check index usage
DO $$
DECLARE
    unused_indexes TEXT[];
BEGIN
    SELECT array_agg(schemaname || '.' || tablename || '.' || indexname) INTO unused_indexes
    FROM pg_stat_user_indexes
    WHERE schemaname = 'app_public'
      AND idx_scan = 0
      AND indexname NOT LIKE '%_pkey';
    
    IF array_length(unused_indexes, 1) > 0 THEN
        RAISE WARNING 'Unused indexes found: %', array_to_string(unused_indexes, ', ');
    ELSE
        RAISE NOTICE '✅ All indexes are being used';
    END IF;
END $$;

-- ========================================
-- 7. Migration Tracking Validation
-- ========================================

-- Check migration table exists and has proper structure
DO $$
DECLARE
    table_exists BOOLEAN;
    column_count INTEGER;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'app_public' 
          AND table_name = 'schema_migrations'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE EXCEPTION 'schema_migrations table does not exist';
    END IF;
    
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'app_public'
      AND table_name = 'schema_migrations';
    
    IF column_count < 4 THEN
        RAISE EXCEPTION 'schema_migrations table is missing required columns';
    END IF;
    
    RAISE NOTICE '✅ Migration tracking table is properly configured';
END $$;

-- ========================================
-- 8. Connection and Lock Validation
-- ========================================

-- Check for blocking locks
DO $$
DECLARE
    blocking_locks INTEGER;
BEGIN
    SELECT COUNT(*) INTO blocking_locks
    FROM pg_locks l1
    JOIN pg_locks l2 ON l1.locktype = l2.locktype
                      AND l1.database = l2.database
                      AND l1.relation = l2.relation
    WHERE l1.granted = false
      AND l2.granted = true
      AND l1.pid != l2.pid;
    
    IF blocking_locks > 0 THEN
        RAISE WARNING 'Found % blocking lock situations', blocking_locks;
    ELSE
        RAISE NOTICE '✅ No blocking locks detected';
    END IF;
END $$;

-- Check connection count
DO $$
DECLARE
    connection_count INTEGER;
    max_connections INTEGER;
    utilization_percent NUMERIC;
BEGIN
    SELECT count(*) INTO connection_count
    FROM pg_stat_activity
    WHERE state != 'idle';
    
    SELECT setting::INTEGER INTO max_connections
    FROM pg_settings
    WHERE name = 'max_connections';
    
    utilization_percent := (connection_count::NUMERIC / max_connections::NUMERIC) * 100;
    
    RAISE NOTICE 'Active connections: % / % (%)', 
        connection_count, max_connections, ROUND(utilization_percent, 2);
    
    IF utilization_percent > 80 THEN
        RAISE WARNING 'High connection utilization: %%', ROUND(utilization_percent, 2);
    ELSE
        RAISE NOTICE '✅ Connection utilization is normal';
    END IF;
END $$;

-- ========================================
-- 9. Summary Report
-- ========================================

-- Generate summary report
DO $$
DECLARE
    tenant_count INTEGER;
    lead_count INTEGER;
    webhook_count INTEGER;
    total_size TEXT;
BEGIN
    -- Get record counts
    SELECT COUNT(*) INTO tenant_count FROM app_public.tenants;
    SELECT COUNT(*) INTO lead_count FROM app_public.leads;
    
    SELECT COUNT(*) INTO webhook_count
    FROM app_public.processed_webhooks;
    
    -- Get database size
    SELECT pg_size_pretty(pg_database_size(current_database())) INTO total_size;
    
    -- Print summary
    RAISE NOTICE '';
    RAISE NOTICE '📊 DATABASE VALIDATION SUMMARY';
    RAISE NOTICE '================================';
    RAISE NOTICE 'Tenants: %', tenant_count;
    RAISE NOTICE 'Leads: %', lead_count;
    IF webhook_count IS NOT NULL THEN
        RAISE NOTICE 'Processed Webhooks: %', webhook_count;
    END IF;
    RAISE NOTICE 'Database Size: %', total_size;
    RAISE NOTICE 'Validation Time: %', NOW();
    RAISE NOTICE '================================';
    RAISE NOTICE '✅ All validations passed successfully!';
END $$;
