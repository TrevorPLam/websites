

import { logError } from '@repo/infra';
import { validatedEnv } from '@/lib/env';

const SUPABASE_LEADS_PATH = '/rest/v1/leads';

export interface SupabaseLeadRow {
  id: string;
}

export function buildSupabaseHeaders(): Record<string, string> {
  const supabaseKey = validatedEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for Supabase operations');
  }

  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };
}

function getSupabaseLeadsUrl(): string {
  const supabaseUrl = validatedEnv.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required for Supabase operations');
  }

  return `${supabaseUrl}${SUPABASE_LEADS_PATH}`;
}

function createSupabaseInsertError(status: number, errorText: string): Error {
  return new Error(`Supabase insert failed with status ${status}: ${errorText}`);
}

function createSupabaseUpdateError(status: number): Error {
  return new Error(`Supabase update failed with status ${status}`);
}

export async function insertSupabaseLead(
  payload: Record<string, unknown>
): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseLeadsUrl(), {
    method: 'POST',
    headers: {
      ...buildSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    // WHY: Supabase REST inserts expect an array payload for bulk-safe APIs.
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
    // WHY: Downstream CRM sync relies on a stable lead ID for idempotency.
    logError('Supabase insert returned invalid lead ID');
    throw new Error('Supabase insert returned invalid lead ID');
  }

  return lead;
}

export async function updateSupabaseLead(
  leadId: string,
  updates: Record<string, unknown>
): Promise<void> {
  const response = await fetch(`${getSupabaseLeadsUrl()}?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: buildSupabaseHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    logError('Supabase lead update failed', undefined, { status: response.status });
    throw createSupabaseUpdateError(response.status);
  }
}
