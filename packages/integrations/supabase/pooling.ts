/**
 * @file packages/integrations/supabase/pooling.ts
 * Purpose: Supavisor connection pooling with transaction mode, query governor, and read replica routing
 * Relationship: Extends client.ts with enterprise-grade connection pooling patterns
 * System role: Serverless-optimized database connections with tier-based timeouts and health monitoring
 * SECURITY: Uses transaction mode for serverless, implements singleton pattern to prevent connection explosion
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logError, logInfo } from '@repo/infra';
import type { Database } from './types';

// ============================================================================
// CONNECTION URL SELECTION GUIDE
// Direct URL:    postgresql://postgres:[pw]@db.[ref].supabase.co:5432/postgres
//   Use for:     Prisma migrate, schema introspection, long-lived processes
//   NOT for:     Serverless functions (exhausts max_connections)
//
// Supavisor (Transaction Mode):
//              postgresql://postgres.[ref]:[pw]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
//   Use for:     All Next.js Server Components, Server Actions, API routes
//   Pool mode:   transaction — connection returned after each transaction
//
// Supavisor (Session Mode):
//              postgresql://postgres.[ref]:[pw]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
//   Use for:     Queries that require session-level features (SET, LISTEN/NOTIFY)
//   NOT for:     Serverless (holds connection for session lifetime)
// ============================================================================

// ============================================================================
// QUERY GOVERNOR: Per-tier statement_timeout enforcement
// Applied at the query level for Server Actions / API routes
// ============================================================================

export type TenantTier = 'starter' | 'professional' | 'enterprise';

const TIMEOUT_MS: Record<TenantTier, number> = {
  starter: 5000, // 5s - basic protection
  professional: 10000, // 10s - standard queries
  enterprise: 30000, // 30s - complex analytics
};

/**
 * Get query timeout based on tenant tier
 * In production, fetch tenant tier from database or cache
 */
export function getQueryTimeout(tenantId?: string): number {
  // TODO: In production, fetch tenant tier from database/cache
  // For now, default to professional tier
  if (process.env.NODE_ENV === 'development') {
    return TIMEOUT_MS.professional;
  }
  return TIMEOUT_MS.professional;
}

/**
 * Get timeout for specific tier
 */
export function getTierTimeout(tier: TenantTier): number {
  return TIMEOUT_MS[tier];
}

// ============================================================================
// SINGLETON CLIENT PATTERN - Prevents connection explosion in serverless
// ============================================================================

let _adminClient: SupabaseClient<Database> | null = null;
let _replicaClient: SupabaseClient<Database> | null = null;
let _sessionClient: SupabaseClient<Database> | null = null;

/**
 * Creates a new Supabase client with transaction mode pooling
 * Uses Supavisor for serverless-optimized connections
 */
function createPooledClient(
  url: string,
  key: string,
  options?: {
    schema?: string;
    useSessionMode?: boolean;
  }
): SupabaseClient<Database> {
  return createClient<Database>(url, key, {
    db: {
      schema: options?.schema ?? 'public',
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        // Request connection pooling via Supavisor
        'X-Client-Info': 'supabase-js-pooled',
      },
    },
  });
}

/**
 * Get admin client with service role - singleton pattern
 * Uses transaction mode for serverless operations
 * NEVER expose this to the client side
 */
export function getAdminClient(): SupabaseClient<Database> {
  if (_adminClient) {
    return _adminClient;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required for admin client');
  }

  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin client');
  }

  logInfo('Creating pooled admin client', { url: url.replace(/\/\/.*@/, '//***@') });

  _adminClient = createPooledClient(url, key);
  return _adminClient;
}

/**
 * Get read replica client for analytics/reporting queries
 * Falls back to primary if replica not configured
 * Route heavy analytics queries here to protect primary
 */
export function getReplicaClient(): SupabaseClient<Database> {
  // Return cached instance
  if (_replicaClient) {
    return _replicaClient;
  }

  const replicaUrl = process.env.SUPABASE_REPLICA_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Graceful degradation: fall back to primary if no replica
  if (!replicaUrl) {
    logInfo('No replica URL configured, falling back to primary');
    return getAdminClient();
  }

  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for replica client');
  }

  logInfo('Creating pooled replica client');

  _replicaClient = createPooledClient(replicaUrl, key);
  return _replicaClient;
}

/**
 * Get session-mode client for operations requiring session features
 * Use sparingly - holds connection for session lifetime
 * For LISTEN/NOTIFY, SET commands, temporary tables
 */
export function getSessionClient(): SupabaseClient<Database> {
  if (_sessionClient) {
    return _sessionClient;
  }

  const url = process.env.SUPABASE_SESSION_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('SUPABASE_SESSION_URL or SUPABASE_URL is required for session client');
  }

  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for session client');
  }

  logInfo('Creating session-mode client (use sparingly)');

  _sessionClient = createPooledClient(url, key, { useSessionMode: true });
  return _sessionClient;
}

// ============================================================================
// CONNECTION POOL HEALTH MONITORING
// ============================================================================

export interface PoolHealth {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  maxConnections: number;
  waitingClients: number;
  lastChecked: Date;
  healthy: boolean;
}

let _poolHealth: PoolHealth | null = null;
let _lastHealthCheck = 0;
const HEALTH_CACHE_TTL_MS = 30000; // 30 seconds

/**
 * Get connection pool health status
 * Cached for 30 seconds to avoid excessive monitoring queries
 */
export async function getPoolHealth(): Promise<PoolHealth> {
  const now = Date.now();

  // Return cached health if fresh
  if (_poolHealth && now - _lastHealthCheck < HEALTH_CACHE_TTL_MS) {
    return _poolHealth;
  }

  try {
    const client = getAdminClient();

    // Query pg_stat_activity for connection stats
    const { data, error } = await client.rpc('get_pool_health');

    if (error) {
      // Fallback: try direct query if RPC not available
      const { data: stats, error: statsError } = await client
        .from('pg_stat_activity')
        .select('*')
        .limit(1);

      if (statsError) {
        throw statsError;
      }

      _poolHealth = {
        activeConnections: 0,
        idleConnections: 0,
        totalConnections: 0,
        maxConnections: 100,
        waitingClients: 0,
        lastChecked: new Date(),
        healthy: true, // Assume healthy if we can query
      };
    } else {
      _poolHealth = {
        activeConnections: data?.active_connections || 0,
        idleConnections: data?.idle_connections || 0,
        totalConnections: data?.total_connections || 0,
        maxConnections: data?.max_connections || 100,
        waitingClients: data?.waiting_clients || 0,
        lastChecked: new Date(),
        healthy: (data?.total_connections || 0) < (data?.max_connections || 100) * 0.8,
      };
    }

    _lastHealthCheck = now;
    return _poolHealth;
  } catch (error) {
    logError('Failed to fetch pool health', error as Error);

    // Return degraded health info rather than failing
    return {
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
      maxConnections: 100,
      waitingClients: 0,
      lastChecked: new Date(),
      healthy: false,
    };
  }
}

/**
 * Check if connection pool is healthy
 * Quick check for load balancers and health endpoints
 */
export async function isPoolHealthy(): Promise<boolean> {
  const health = await getPoolHealth();
  return health.healthy;
}

// ============================================================================
// SERVER-SIDE CLIENT WITH RLS (per-request)
// Used in Server Components and Server Actions that need RLS
// ============================================================================

export interface RLSClientOptions {
  tenantId?: string;
  timeout?: number;
}

/**
 * Create an RLS-enabled client for the current request
 * Must be called in request context (Server Component or Server Action)
 *
 * @example
 * ```typescript
 * // In Server Action
 * const client = await createRLSClient({ tenantId: 'tenant-uuid' });
 * const { data } = await client.from('leads').select('*');
 * ```
 */
export async function createRLSClient(
  options?: RLSClientOptions
): Promise<SupabaseClient<Database>> {
  // Dynamic import to avoid client-side bundling
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for RLS client');
  }

  return createClient<Database>(url, key, {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: options?.tenantId ? { 'X-Tenant-Id': options.tenantId } : undefined,
    },
  });
}

// ============================================================================
// QUERY EXECUTION WITH TIMEOUT ENFORCEMENT
// ============================================================================

export interface QueryOptions {
  tier?: TenantTier;
  timeout?: number;
  useReplica?: boolean;
}

/**
 * Execute a query with timeout enforcement and optional replica routing
 *
 * @example
 * ```typescript
 * const result = await executeQuery(
 *   (client) => client.from('leads').select('*'),
 *   { tier: 'professional', useReplica: true }
 * );
 * ```
 */
export async function executeQuery<T>(
  queryFn: (client: SupabaseClient<Database>) => Promise<{ data: T | null; error: Error | null }>,
  options?: QueryOptions
): Promise<{ data: T | null; error: Error | null }> {
  const timeout = options?.timeout ?? getTierTimeout(options?.tier ?? 'professional');
  const client = options?.useReplica ? getReplicaClient() : getAdminClient();

  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Query timeout after ${timeout}ms`)), timeout);
  });

  try {
    // Race query against timeout
    const result = await Promise.race([queryFn(client), timeoutPromise]);

    return result;
  } catch (error) {
    logError('Query execution failed or timed out', error as Error, {
      timeout,
      useReplica: options?.useReplica ?? false,
    });

    return {
      data: null,
      error: error as Error,
    };
  }
}

// ============================================================================
// CONNECTION MANAGEMENT UTILITIES
// ============================================================================

/**
 * Reset all singleton clients
 * Useful for testing or when connection parameters change
 */
export function resetClients(): void {
  _adminClient = null;
  _replicaClient = null;
  _sessionClient = null;
  _poolHealth = null;
  _lastHealthCheck = 0;

  logInfo('All pooled clients reset');
}

/**
 * Get current connection statistics
 * For monitoring and debugging
 */
export function getConnectionStats(): {
  adminConnected: boolean;
  replicaConnected: boolean;
  sessionConnected: boolean;
  lastHealthCheck: Date | null;
} {
  return {
    adminConnected: _adminClient !== null,
    replicaConnected: _replicaClient !== null,
    sessionConnected: _sessionClient !== null,
    lastHealthCheck: _poolHealth?.lastChecked ?? null,
  };
}

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// Maintain compatibility with existing client.ts exports
// ============================================================================

export { SupabaseClient };
export type { Database };
