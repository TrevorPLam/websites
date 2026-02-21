/**
 * @file packages/integrations/supabase/types.ts
 * Purpose: Supabase lead and client type definitions (SupabaseLeadRow, SupabaseClientConfig, etc.).
 * Relationship: Used by client.ts and leads.ts; consumed by template actions.
 */
/**
 * Complete Supabase lead record structure.
 * Represents a lead stored in the Supabase database.
 */
export interface SupabaseLeadRow {
  /** Primary key - UUID string */
  id: string;

  /** Creation timestamp - ISO string */
  created_at?: string;

  /** Contact name - string */
  name?: string;

  /** Contact email - string */
  email?: string;

  /** Contact phone - string */
  phone?: string;

  /** Contact message - string */
  message?: string;

  /** Suspicion flag - boolean */
  is_suspicious?: boolean;

  /** Reason for suspicion - string or null */
  suspicion_reason?: string | null;

  /** HubSpot sync status - string */
  hubspot_sync_status?: string;

  /** Last HubSpot sync attempt - ISO string */
  hubspot_last_sync_attempt?: string;

  /** HubSpot retry count - number */
  hubspot_retry_count?: number;

  /** HubSpot contact ID - string */
  hubspot_contact_id?: string;

  /** HubSpot idempotency key - string */
  hubspot_idempotency_key?: string;
}

/**
 * Supabase client configuration interface.
 * Used for type-safe client initialization.
 */
export interface SupabaseClientConfig {
  /** Supabase project URL */
  url: string;

  /** Supabase service role key */
  serviceRoleKey: string;

  /** HTTP headers for API requests */
  headers: Record<string, string>;
}

/**
 * Lead insertion payload interface.
 * Data required for creating a new lead.
 */
export interface SupabaseLeadInsert {
  /** Contact name - required */
  name: string;

  /** Contact email - required */
  email: string;

  /** Contact phone - optional */
  phone?: string;

  /** Contact message - optional */
  message?: string;

  /** Suspicion flag - optional */
  is_suspicious?: boolean;

  /** Reason for suspicion - optional */
  suspicion_reason?: string | null;

  /** HubSpot sync status - optional */
  hubspot_sync_status?: string;

  /** HubSpot retry count - optional */
  hubspot_retry_count?: number;

  /** HubSpot idempotency key - optional */
  hubspot_idempotency_key?: string | null;
}

/**
 * Lead update payload interface.
 * Data for updating an existing lead.
 */
export interface SupabaseLeadUpdate {
  /** HubSpot sync status - optional */
  hubspot_sync_status?: string;

  /** Last HubSpot sync attempt - optional */
  hubspot_last_sync_attempt?: string;

  /** HubSpot retry count - optional */
  hubspot_retry_count?: number;

  /** HubSpot contact ID - optional */
  hubspot_contact_id?: string;

  /** HubSpot idempotency key - optional */
  hubspot_idempotency_key?: string;
}

/**
 * Supabase API response interface.
 * Standard response structure from Supabase REST API.
 */
// [Task 0.24] Replaced `any` with `unknown` for type safety
export interface SupabaseApiResponse<T = unknown> {
  /** Response data */
  data?: T;

  /** Error information */
  error?: {
    /** Error message */
    message: string;

    /** Error details */
    // [Task 0.24] Replaced `any` with `unknown` for type safety
    details?: unknown;
  };

  /** Response metadata */
  metadata?: {
    /** Total count */
    total?: number;

    /** Page size */
    size?: number;

    /** Current page */
    page?: number;
  };
}
