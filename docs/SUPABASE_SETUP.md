# Supabase Setup Guide

**Task**: T-054
**Date**: 2026-01-21
**Status**: ✅ Complete

## Project Details

- **Project URL**: https://dusuzajdqwyhelwnyzbh.supabase.co
- **Region**: Configured in Supabase dashboard
- **Purpose**: Store contact form leads with HubSpot sync metadata

## Database Schema

### Leads Table

Run this SQL in the Supabase SQL Editor to create the `leads` table:

```sql
-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  is_suspicious BOOLEAN DEFAULT false,
  suspicion_reason TEXT,
  hubspot_contact_id TEXT,
  hubspot_sync_status TEXT DEFAULT 'pending',
  hubspot_last_sync_attempt TIMESTAMPTZ,
  hubspot_retry_count INTEGER DEFAULT 0,
  hubspot_idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups (used for HubSpot sync and deduplication)
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Index for sync status queries (used for retry logic)
CREATE INDEX IF NOT EXISTS idx_leads_sync_status ON leads(hubspot_sync_status);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Field Descriptions

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Submitter's full name |
| `email` | TEXT | Submitter's email (indexed) |
| `phone` | TEXT | Submitter's phone number |
| `message` | TEXT | Optional message from form |
| `is_suspicious` | BOOLEAN | True if flagged by rate limiter |
| `suspicion_reason` | TEXT | Why it was flagged (e.g., "rate_limit") |
| `hubspot_contact_id` | TEXT | HubSpot CRM contact ID after sync |
| `hubspot_sync_status` | TEXT | Status: pending, synced, failed, needs_sync |
| `hubspot_last_sync_attempt` | TIMESTAMPTZ | Last HubSpot sync attempt timestamp |
| `hubspot_retry_count` | INTEGER | Number of HubSpot sync attempts for the lead |
| `hubspot_idempotency_key` | TEXT | Idempotency key reused across HubSpot retry attempts |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Record update timestamp (auto-updated) |

## Environment Variables

### Development (.env.local)
Already configured in `/workspaces/your-dedicated-marketer/.env.local`

### Production (Cloudflare Pages)
Set these in Cloudflare Pages dashboard:
```
SUPABASE_URL=https://dusuzajdqwyhelwnyzbh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_here>
```

## Security Notes

- ✅ Service role key is server-only (never exposed to browser)
- ✅ Row Level Security (RLS) not required (server-only access)
- ✅ Keys stored in environment variables (not in code)
- ⚠️ Rotate service role key if compromised

## Next Steps

- [x] T-054: Provision Supabase and provide credentials
- [ ] T-080: Implement lead storage in `lib/actions.ts`
- [ ] T-081: Implement HubSpot sync after lead storage
- [ ] T-082: Remove old email pipeline
