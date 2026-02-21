/**
 * @file packages/integrations/supabase/client.ts
 * Purpose: Supabase client and lead operations — createSupabaseClient, insertLead, updateLead, getSupabaseClient.
 * Relationship: Depends on @repo/infra (logError, logInfo). Uses types.ts for config and row types.
 * System role: REST API to /rest/v1/leads; config from env or partial config; lazy singleton getSupabaseClient.
 * SECURITY (2026-02-21): Fixed service role key client-side usage. Now uses anon key with RLS.
 * Assumptions: SUPABASE_URL and SUPABASE_ANON_KEY required for client-side; service role for server-only.
 */
import { logError, logInfo } from '@repo/infra';
// [Task 0.24] Import SupabaseClientConfig from types.ts (removed duplicate from this file)
import type { SupabaseClientConfig, SupabaseLeadRow } from './types';

/**
 * Client-side Supabase configuration using anon key with RLS protection
 * Following 2026 security standards for tenant isolation
 */
export interface SupabaseClientConfigExtended extends SupabaseClientConfig {
  url: string;
  anonKey: string;
  headers: Record<string, string>;
}

/**
 * Server-side Supabase configuration with service role key
 * For administrative operations only (never exposed to client)
 */
export interface SupabaseServerConfig extends Omit<SupabaseClientConfig, 'anonKey'> {
  serviceRoleKey: string;
  headers: Record<string, string>;
}

/**
 * Creates a secure client-side Supabase configuration.
 * Uses anon key with Row-Level Security (RLS) protection.
 * Following 2026 multi-tenant security standards.
 *
 * @param config - Optional client configuration (defaults to environment variables)
 * @returns Configured Supabase client with RLS enforcement
 * @throws {Error} When required environment variables are missing
 *
 * @example
 * ```typescript
 * // Client-side usage with RLS protection
 * const client = createSupabaseClient({
 *   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
 *   anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 * });
 * ```
 */
export function createSupabaseClient(config?: Partial<SupabaseClientConfig>): SupabaseClientConfig {
  // Get environment variables from process.env (client-safe)
  const url = config?.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = config?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required for Supabase client');
  }

  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required for Supabase client');
  }

  const headers: Record<string, string> = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  return {
    url,
    anonKey,
    headers,
  };
}

/**
 * Creates a server-side Supabase configuration with service role key.
 * For administrative operations only - never exposed to client.
 * Bypasses RLS for admin tasks like schema management.
 *
 * @param config - Optional server configuration
 * @returns Configured Supabase server client
 * @throws {Error} When required environment variables are missing
 *
 * @example
 * ```typescript
 * // Server-side usage for admin operations
 * const serverClient = createSupabaseServerClient({
 *   url: process.env.SUPABASE_URL,
 *   serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
 * });
 * ```
 */
export function createSupabaseServerClient(
  config?: Partial<SupabaseServerConfig>
): SupabaseServerConfig {
  // Get server-side environment variables
  const url = config?.url || process.env.SUPABASE_URL;
  const serviceRoleKey = config?.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL is required for Supabase server client');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for Supabase server client');
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
 * Inserts a lead into Supabase database with RLS protection.
 * Uses client-side configuration with tenant isolation.
 *
 * @param client - Configured Supabase client (with anon key and RLS)
 * @param leadData - Lead data to insert
 * @returns Created lead record
 * @throws {Error} When insertion fails
 *
 * @example
 * ```typescript
 * const client = createSupabaseClient(); // Uses anon key with RLS
 * const lead = await insertLead(client, {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+1-555-0123',
 *   message: 'Interested in services',
 *   tenant_id: 'tenant-uuid' // Required for RLS
 * });
 * ```
 */
export async function insertLead(
  client: SupabaseClientConfig,
  leadData: Omit<SupabaseLeadRow, 'id' | 'created_at'>
): Promise<SupabaseLeadRow> {
  const SUPABASE_LEADS_PATH = '/rest/v1/leads';
  const url = `${client.url}${SUPABASE_LEADS_PATH}`;

  // Validate tenant_id for RLS compliance
  if (!leadData.tenant_id) {
    throw new Error('tenant_id is required for lead creation (RLS enforcement)');
  }

  // Validate UUID format for tenant_id
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(leadData.tenant_id)) {
    throw new Error('tenant_id must be a valid UUID format');
  }

  logInfo('Inserting Supabase lead with RLS protection', {
    email: leadData.email,
    tenant_id: leadData.tenant_id,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: client.headers,
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Log RLS-specific errors for security monitoring
      if (response.status === 403) {
        logError('RLS policy violation - insufficient permissions', new Error(errorText), {
          email: leadData.email,
          tenant_id: leadData.tenant_id,
          status: response.status,
        });
      }

      throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`);
    }

    const lead = (await response.json()) as SupabaseLeadRow;

    logInfo('Supabase lead inserted successfully with RLS protection', {
      leadId: lead.id,
      email: leadData.email,
      tenant_id: leadData.tenant_id,
    });

    return lead;
  } catch (error) {
    logError('Failed to insert Supabase lead', error, {
      email: leadData.email,
      tenant_id: leadData.tenant_id,
      url: client.url,
    });
    throw error;
  }
}

/** UUID v4 format regex for leadId validation */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Updates a lead in Supabase database with RLS protection.
 * Performs lead update with tenant isolation and proper error handling.
 *
 * @param client - Configured Supabase client (with anon key and RLS)
 * @param leadId - ID of lead to update (must be valid UUID format)
 * @param updates - Lead data to update
 * @returns Updated lead record
 * @throws {Error} When update fails or leadId is invalid
 *
 * @example
 * ```typescript
 * const client = createSupabaseClient(); // Uses anon key with RLS
 * const updated = await updateLead(client, 'lead-123', {
 *   hubspot_sync_status: 'synced',
 *   tenant_id: 'tenant-uuid' // Required for RLS
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

  // Ensure tenant_id is provided for RLS compliance
  if (!updates.tenant_id) {
    throw new Error('tenant_id is required for lead updates (RLS enforcement)');
  }

  // Validate UUID format for tenant_id
  if (!UUID_REGEX.test(updates.tenant_id)) {
    throw new Error('tenant_id must be a valid UUID format');
  }

  const SUPABASE_LEADS_PATH = `/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}&tenant_id=eq.${encodeURIComponent(updates.tenant_id)}`;
  const url = `${client.url}${SUPABASE_LEADS_PATH}`;

  logInfo('Updating Supabase lead with RLS protection', {
    leadId,
    tenant_id: updates.tenant_id,
  });

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: client.headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      // Log RLS-specific errors for security monitoring
      if (response.status === 403) {
        logError(
          'RLS policy violation - insufficient permissions for update',
          new Error(`Status ${response.status}`),
          {
            leadId,
            tenant_id: updates.tenant_id,
            status: response.status,
          }
        );
      }

      throw new Error(`Supabase update failed with status ${response.status}`);
    }

    const lead = (await response.json()) as SupabaseLeadRow;

    logInfo('Supabase lead updated successfully with RLS protection', {
      leadId,
      tenant_id: updates.tenant_id,
      updates: Object.keys(updates),
    });

    return lead;
  } catch (error) {
    logError('Failed to update Supabase lead', error, {
      leadId,
      tenant_id: updates.tenant_id,
    });
    throw error;
  }
}

// [Task 0.24] Replaced eager initialization with lazy singleton
// Rationale: Prevents crash in environments without Supabase env vars
let _instance: ReturnType<typeof createSupabaseClient> | null = null;
export const getSupabaseClient = () => {
  if (!_instance) {
    _instance = createSupabaseClient(); // Uses anon key with RLS protection
  }
  return _instance;
};

/**
 * Server-side Supabase client for administrative operations
 * Uses service role key - never exposed to client
 */
let _serverInstance: ReturnType<typeof createSupabaseServerClient> | null = null;
export const getSupabaseServerClient = () => {
  if (!_serverInstance) {
    _serverInstance = createSupabaseServerClient(); // Uses service role key
  }
  return _serverInstance;
};

/** @deprecated Use getSupabaseClient() instead — eager init crashes without env vars */
export const supabaseClient = undefined as unknown as ReturnType<typeof createSupabaseClient>;

/**
 * Server-side lead insertion for administrative operations
 * Bypasses RLS for system-level tasks (e.g., data migration)
 *
 * @param client - Server-side Supabase client (with service role)
 * @param leadData - Lead data to insert
 * @returns Created lead record
 */
export async function insertLeadServer(
  client: SupabaseServerConfig,
  leadData: Omit<SupabaseLeadRow, 'id' | 'created_at'>
): Promise<SupabaseLeadRow> {
  const SUPABASE_LEADS_PATH = '/rest/v1/leads';
  const url = `${client.url}${SUPABASE_LEADS_PATH}`;

  logInfo('Inserting Supabase lead (server-side admin)', { email: leadData.email });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: client.headers,
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase server insert failed with status ${response.status}: ${errorText}`);
    }

    const lead = (await response.json()) as SupabaseLeadRow;

    logInfo('Supabase lead inserted successfully (server-side admin)', {
      leadId: lead.id,
      email: leadData.email,
    });

    return lead;
  } catch (error) {
    logError('Failed to insert Supabase lead (server-side admin)', error, {
      email: leadData.email,
      url: client.url,
    });
    throw error;
  }
}
