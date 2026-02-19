-- Migration: Add tenant_id columns and enable RLS for multi-tenant isolation
-- Task: security-2-rls-multi-tenant
-- Purpose: Enforce tenant boundaries at database level using Row-Level Security
--
-- This migration:
-- 1. Adds tenant_id to tenant-scoped tables
-- 2. Creates auth.tenant_id() helper function
-- 3. Enables RLS on tenant-scoped tables
-- 4. Creates RLS policies for tenant isolation
--
-- Note: Existing data must be backfilled with tenant_id before enabling RLS

-- ============================================================================
-- 1. Create auth.tenant_id() helper function
-- ============================================================================
-- Extracts tenant_id from JWT app_metadata for use in RLS policies
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION auth.tenant_id() IS 'Extracts tenant_id from JWT app_metadata for RLS policies';

-- ============================================================================
-- 2. Add tenant_id to tenant-scoped tables
-- ============================================================================

-- Leads table
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS tenant_id UUID;
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id) WHERE tenant_id IS NOT NULL;

-- Bookings table (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tenant_id UUID;
    CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id) WHERE tenant_id IS NOT NULL;
  END IF;
END $$;

-- Sites table (if exists) - this is the tenant root
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sites') THEN
    ALTER TABLE sites ADD COLUMN IF NOT EXISTS tenant_id UUID;
    CREATE INDEX IF NOT EXISTS idx_sites_tenant_id ON sites(tenant_id) WHERE tenant_id IS NOT NULL;
    
    -- Sites table tenant_id should be unique (one tenant per site)
    CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_tenant_id_unique ON sites(tenant_id) WHERE tenant_id IS NOT NULL;
  END IF;
END $$;

-- Webhooks table (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'webhooks') THEN
    ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS tenant_id UUID;
    CREATE INDEX IF NOT EXISTS idx_webhooks_tenant_id ON webhooks(tenant_id) WHERE tenant_id IS NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- 3. Enable Row-Level Security
-- ============================================================================

ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sites') THEN
    ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'webhooks') THEN
    ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- 4. Create RLS Policies
-- ============================================================================

-- Leads table policies
DROP POLICY IF EXISTS "tenant_isolation_select_leads" ON leads;
CREATE POLICY "tenant_isolation_select_leads"
  ON leads
  FOR SELECT
  USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL); -- NULL allows unassigned (migration period)

DROP POLICY IF EXISTS "tenant_isolation_insert_leads" ON leads;
CREATE POLICY "tenant_isolation_insert_leads"
  ON leads
  FOR INSERT
  WITH CHECK (tenant_id = auth.tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_update_leads" ON leads;
CREATE POLICY "tenant_isolation_update_leads"
  ON leads
  FOR UPDATE
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_delete_leads" ON leads;
CREATE POLICY "tenant_isolation_delete_leads"
  ON leads
  FOR DELETE
  USING (tenant_id = auth.tenant_id());

-- Bookings table policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
    DROP POLICY IF EXISTS "tenant_isolation_select_bookings" ON bookings;
    CREATE POLICY "tenant_isolation_select_bookings"
      ON bookings
      FOR SELECT
      USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL);

    DROP POLICY IF EXISTS "tenant_isolation_insert_bookings" ON bookings;
    CREATE POLICY "tenant_isolation_insert_bookings"
      ON bookings
      FOR INSERT
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_update_bookings" ON bookings;
    CREATE POLICY "tenant_isolation_update_bookings"
      ON bookings
      FOR UPDATE
      USING (tenant_id = auth.tenant_id())
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_delete_bookings" ON bookings;
    CREATE POLICY "tenant_isolation_delete_delete_bookings"
      ON bookings
      FOR DELETE
      USING (tenant_id = auth.tenant_id());
  END IF;
END $$;

-- Sites table policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sites') THEN
    DROP POLICY IF EXISTS "tenant_isolation_select_sites" ON sites;
    CREATE POLICY "tenant_isolation_select_sites"
      ON sites
      FOR SELECT
      USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL);

    DROP POLICY IF EXISTS "tenant_isolation_insert_sites" ON sites;
    CREATE POLICY "tenant_isolation_insert_sites"
      ON sites
      FOR INSERT
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_update_sites" ON sites;
    CREATE POLICY "tenant_isolation_update_sites"
      ON sites
      FOR UPDATE
      USING (tenant_id = auth.tenant_id())
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_delete_sites" ON sites;
    CREATE POLICY "tenant_isolation_delete_sites"
      ON sites
      FOR DELETE
      USING (tenant_id = auth.tenant_id());
  END IF;
END $$;

-- Webhooks table policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'webhooks') THEN
    DROP POLICY IF EXISTS "tenant_isolation_select_webhooks" ON webhooks;
    CREATE POLICY "tenant_isolation_select_webhooks"
      ON webhooks
      FOR SELECT
      USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL);

    DROP POLICY IF EXISTS "tenant_isolation_insert_webhooks" ON webhooks;
    CREATE POLICY "tenant_isolation_insert_webhooks"
      ON webhooks
      FOR INSERT
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_update_webhooks" ON webhooks;
    CREATE POLICY "tenant_isolation_update_webhooks"
      ON webhooks
      FOR UPDATE
      USING (tenant_id = auth.tenant_id())
      WITH CHECK (tenant_id = auth.tenant_id());

    DROP POLICY IF EXISTS "tenant_isolation_delete_webhooks" ON webhooks;
    CREATE POLICY "tenant_isolation_delete_webhooks"
      ON webhooks
      FOR DELETE
      USING (tenant_id = auth.tenant_id());
  END IF;
END $$;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Backfill tenant_id for existing rows before enabling RLS in production
-- 2. JWT must include app_metadata.tenant_id for RLS to work
-- 3. Service role key bypasses RLS (use only for migrations/admin)
-- 4. Policies allow NULL tenant_id during migration period (remove after backfill)
