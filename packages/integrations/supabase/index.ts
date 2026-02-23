/**
 * @file packages/integrations/supabase/index.ts
 * Purpose: Supabase integration barrel — client, insertLead/updateLead, leads helpers, types, pooling.
 * SECURITY (2026-02-21): Separated client/server configurations. Client uses anon key with RLS.
 * Relationship: Depends on @repo/infra, @repo/utils. Consumed by template lib/actions/supabase.
 * System role: createSupabaseClient, insertLead, updateLead, getSupabaseClient; server functions for admin.
 * Assumptions: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY for client; SUPABASE_URL/SERVICE_ROLE_KEY for server.
 */
// Client exports (secure - uses anon key with RLS)
export { insertLead, updateLead, getSupabaseClient, supabaseClient } from './client';
export { createSupabaseClient } from './client';

// Server exports (admin only - uses service role key)
export { createSupabaseServerClient, getSupabaseServerClient, insertLeadServer } from './client';

// Connection pooling exports (DOMAIN-6-001)
export {
  getAdminClient,
  getReplicaClient,
  getSessionClient,
  getPoolHealth,
  isPoolHealthy,
  createRLSClient,
  executeQuery,
  getQueryTimeout,
  getTierTimeout,
  resetClients,
  getConnectionStats,
} from './pooling';

// Type exports
export type { SupabaseClientConfig, SupabaseServerConfig } from './types';

// Pooling type exports
export type { PoolHealth, QueryOptions, RLSClientOptions, TenantTier } from './pooling';

// Lead management exports (backward compatibility — deprecated, use client.ts insertLead/updateLead)
// Audit complete: no callers found. Kept for external/legacy consumers. Prefer createSupabaseClient + insertLead/updateLead.
export {
  insertSupabaseLead,
  updateSupabaseLead,
  buildSupabaseHeaders,
  getSupabaseLeadsUrl,
  createSupabaseInsertError,
  createSupabaseUpdateError,
} from './leads';

// Additional type exports
export type {
  SupabaseLeadRow,
  SupabaseLeadInsert,
  SupabaseLeadUpdate,
  SupabaseApiResponse,
} from './types';
