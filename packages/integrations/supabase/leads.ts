/**
 * @file packages/integrations/supabase/leads.ts
 * Purpose: Legacy Supabase lead helpers (insertSupabaseLead, updateSupabaseLead, buildSupabaseHeaders, etc.).
 * Relationship: Uses @repo/infra/logger. Re-exported from index for backward compat; new code uses client.ts.
 * System role: REST calls with Prefer: return=representation; parse data[0]; deprecated in favor of client.
 * Assumptions: @deprecated — use client.ts insertLead/updateLead for new implementations.
 */
import { logError, logInfo } from '@repo/infra/logger';
import type { SupabaseLeadRow } from './types';

const SUPABASE_LEADS_PATH = '/rest/v1/leads';

/**
 * @deprecated Use supabaseClient from client.ts
 */
export function buildSupabaseHeaders(): Record<string, string> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

/**
 * @deprecated Use supabaseClient.url from client.ts
 */
export function getSupabaseLeadsUrl(): string {
  const url = process.env.SUPABASE_URL || '';
  return `${url}${SUPABASE_LEADS_PATH}`;
}

/**
 * @deprecated Use insertLead from client.ts
 */
export function createSupabaseInsertError(status: number, errorText: string): Error {
  return new Error(`Supabase insert failed with status ${status}: ${errorText}`);
}

/**
 * @deprecated Use updateLead from client.ts
 */
export function createSupabaseUpdateError(status: number): Error {
  return new Error(`Supabase update failed with status ${status}`);
}

/**
 * Inserts a lead into Supabase.
 * Uses Supabase REST API with Prefer: return=representation for array response.
 * API-compatible with template consumers (lib/actions/supabase.ts).
 *
 * @param payload - Lead data to insert
 * @returns Created lead record
 * @throws {Error} When SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing or insertion fails
 */
export async function insertSupabaseLead(
  payload: Record<string, unknown>
): Promise<SupabaseLeadRow> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required for Supabase operations');
  }
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for Supabase operations');
  }

  const url = `${supabaseUrl}${SUPABASE_LEADS_PATH}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError('Supabase lead insert failed', undefined, { status: response.status });
    throw createSupabaseInsertError(response.status, errorText);
  }

  const data = (await response.json()) as SupabaseLeadRow[];
  const lead = Array.isArray(data) ? data[0] : undefined;
  if (!lead || typeof lead.id !== 'string' || lead.id.trim() === '') {
    logError('Supabase insert returned invalid lead ID');
    throw new Error('Supabase insert returned invalid lead ID');
  }

  logInfo('Supabase lead inserted successfully', {
    leadId: lead.id,
    email: payload.email,
  });
  return lead;
}

/**
 * Updates a lead in Supabase.
 * API-compatible with template consumers (lib/actions/supabase.ts).
 *
 * @param leadId - ID of lead to update
 * @param updates - Lead data to update
 * @returns Promise that resolves when update is complete
 * @throws {Error} When env missing or update fails
 */
export async function updateSupabaseLead(
  leadId: string,
  updates: Record<string, unknown>
): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase operations'
    );
  }

  const url = `${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    logError('Supabase lead update failed', undefined, { status: response.status });
    throw createSupabaseUpdateError(response.status);
  }

  logInfo('Supabase lead updated successfully', {
    leadId,
    updates: Object.keys(updates),
  });
}
