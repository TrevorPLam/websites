/**
 * @file packages/integrations/supabase/client.ts
 * Purpose: Supabase client and lead operations — createSupabaseClient, insertLead, updateLead, getSupabaseClient.
 * Relationship: Depends on @repo/infra (logError, logInfo). Uses types.ts for config and row types.
 * System role: REST API to /rest/v1/leads; config from env or partial config; lazy singleton getSupabaseClient.
 * Assumptions: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required; server-only.
 */
import { logError, logInfo } from '@repo/infra';
// [Task 0.24] Import SupabaseClientConfig from types.ts (removed duplicate from this file)
import type { SupabaseClientConfig, SupabaseLeadRow } from './types';

/**
 * Creates a configured Supabase client.
 * Returns client configuration for API operations.
 *
 * @param config - Optional client configuration (defaults to environment variables)
 * @returns Configured Supabase client
 * @throws {Error} When required environment variables are missing
 *
 * @example
 * ```typescript
 * import { validatedEnv } from '@/lib/env';
 *
 * const client = createSupabaseClient({
 *   url: validatedEnv.SUPABASE_URL,
 *   serviceRoleKey: validatedEnv.SUPABASE_SERVICE_ROLE_KEY
 * });
 * ```
 */
export function createSupabaseClient(config?: Partial<SupabaseClientConfig>): SupabaseClientConfig {
  // Get environment variables from process.env
  const url = config?.url || process.env.SUPABASE_URL;
  const serviceRoleKey = config?.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL is required for Supabase client');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for Supabase client');
  }

  const headers: Record<string, string> = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  return {
    url,
    serviceRoleKey,
    headers,
  };
}

/**
 * Inserts a lead into Supabase database.
 * Performs lead creation with proper error handling and logging.
 *
 * @param client - Configured Supabase client
 * @param leadData - Lead data to insert
 * @returns Created lead record
 * @throws {Error} When insertion fails
 *
 * @example
 * ```typescript
 * const client = createSupabaseClient();
 * const lead = await insertLead(client, {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+1-555-0123',
 *   message: 'Interested in services'
 * });
 * ```
 */
export async function insertLead(
  client: SupabaseClientConfig,
  leadData: Omit<SupabaseLeadRow, 'id' | 'created_at'>
): Promise<SupabaseLeadRow> {
  const SUPABASE_LEADS_PATH = '/rest/v1/leads';
  const url = `${client.url}${SUPABASE_LEADS_PATH}`;

  logInfo('Inserting Supabase lead', { email: leadData.email });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: client.headers,
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`);
    }

    const lead = (await response.json()) as SupabaseLeadRow;

    logInfo('Supabase lead inserted successfully', {
      leadId: lead.id,
      email: leadData.email,
    });

    return lead;
  } catch (error) {
    logError('Failed to insert Supabase lead', error, {
      email: leadData.email,
      url: client.url,
    });
    throw error;
  }
}

/** UUID v4 format regex for leadId validation */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Updates a lead in Supabase database.
 * Performs lead update with proper error handling and logging.
 *
 * @param client - Configured Supabase client
 * @param leadId - ID of lead to update (must be valid UUID format)
 * @param updates - Lead data to update
 * @returns Updated lead record
 * @throws {Error} When update fails or leadId is invalid
 *
 * @example
 * ```typescript
 * const client = createSupabaseClient();
 * const updated = await updateLead(client, 'lead-123', {
 *   hubspot_sync_status: 'synced'
 * });
 * ```
 */
export async function updateLead(
  client: SupabaseClientConfig,
  leadId: string,
  updates: Partial<SupabaseLeadRow>
): Promise<SupabaseLeadRow> {
  if (!UUID_REGEX.test(leadId)) {
    throw new Error('Invalid leadId: must be a valid UUID format');
  }
  const SUPABASE_LEADS_PATH = `/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`;
  const url = `${client.url}${SUPABASE_LEADS_PATH}`;

  logInfo('Updating Supabase lead', { leadId });

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: client.headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Supabase update failed with status ${response.status}`);
    }

    const lead = (await response.json()) as SupabaseLeadRow;

    logInfo('Supabase lead updated successfully', {
      leadId,
      updates: Object.keys(updates),
    });

    return lead;
  } catch (error) {
    logError('Failed to update Supabase lead', error, { leadId });
    throw error;
  }
}

// [Task 0.24] Replaced eager initialization with lazy singleton
// Rationale: Prevents crash in environments without Supabase env vars
let _instance: ReturnType<typeof createSupabaseClient> | null = null;
export const getSupabaseClient = () => {
  if (!_instance) {
    _instance = createSupabaseClient();
  }
  return _instance;
};

/** @deprecated Use getSupabaseClient() instead — eager init crashes without env vars */
export const supabaseClient = undefined as unknown as ReturnType<typeof createSupabaseClient>;
