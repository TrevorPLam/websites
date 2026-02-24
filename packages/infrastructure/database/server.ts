/**
 * @file packages/infrastructure/database/server.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { resolveTenantId } from '../src/auth/tenant-context';
import type { Database } from './types';

interface CreateTenantDbClientOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
  tenantId?: string;
}

/**
 * export function createTenantDatabaseClient(.
 */
export function createTenantDatabaseClient({
  supabaseUrl,
  supabaseAnonKey,
  tenantId,
}: CreateTenantDbClientOptions): SupabaseClient<Database> {
  const resolvedTenantId = resolveTenantId(tenantId);

  if (!resolvedTenantId) {
    throw new Error('Tenant context is required to create a tenant database client.');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-app-current-tenant': resolvedTenantId,
      },
    },
  });
}

/**
 * export async function withTenantRlsContext<T>(.
 */
export async function withTenantRlsContext<T>(
  client: SupabaseClient<Database>,
  tenantId: string,
  query: (client: SupabaseClient<Database>) => Promise<T>
): Promise<T> {
  const { error } = await (client.rpc as any)('set_config', {
    setting_name: 'app.current_tenant',
    setting_value: tenantId,
    is_local: true,
  });

  if (error) {
    throw new Error(`Failed to set tenant RLS context: ${error.message}`);
  }

  return query(client);
}
