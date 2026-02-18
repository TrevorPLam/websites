/**
 * @file packages/integrations/supabase/index.ts
 * Purpose: Supabase integration barrel — client, insertLead/updateLead, leads helpers, types.
 * Relationship: Depends on @repo/infra, @repo/utils. Consumed by template lib/actions/supabase.
 * System role: createSupabaseClient, insertLead, updateLead, getSupabaseClient; leads module for legacy compat.
 * Assumptions: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required for client; server-only usage.
 */
// Client exports
// [Task 0.24] Added getSupabaseClient; supabaseClient kept for backward compat (deprecated)
export { insertLead, updateLead, getSupabaseClient, supabaseClient } from './client';
// [Task 0.24] SupabaseClientConfig now re-exported from types.ts (removed duplicate from client.ts)
export type { SupabaseClientConfig } from './types';

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

// Type exports
export type {
  SupabaseLeadRow,
  SupabaseLeadInsert,
  SupabaseLeadUpdate,
  SupabaseApiResponse,
} from './types';
