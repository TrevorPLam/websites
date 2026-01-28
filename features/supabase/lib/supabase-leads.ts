/**
 * Supabase lead repository for contact submissions.
 *
 * @module lib/supabase-leads
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralize Supabase REST calls for lead inserts/updates so
 * server actions stay focused on orchestration.
 *
 * **ARCHITECTURE PATTERN**: Repository module (server-only utility)
 * - Called by lib/actions.ts
 * - Throws errors so callers can decide UX behavior
 *
 * **CURRENT STATE**: Uses the REST API with service role key for insert/update.
 *
 * **KEY DEPENDENCIES**:
 * - `./env.ts` — Validated server env vars
 * - `./logger.ts` — Sanitized logging
 *
 * **AI ITERATION HINTS**:
 * 1. Keep payloads opaque (Record<string, unknown>) to avoid coupling.
 * 2. Preserve Supabase REST "return=representation" behavior for inserts.
 * 3. Log only metadata (status codes) to avoid leaking PII.
 *
 * **SECURITY CHECKLIST**:
 * - [x] Uses server-only service role key
 * - [x] Avoids logging user PII in errors
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { logError } from './logger'
import { validatedEnv } from './env'

const SUPABASE_LEADS_PATH = '/rest/v1/leads'

export interface SupabaseLeadRow {
  id: string
}

export function buildSupabaseHeaders(): Record<string, string> {
  return {
    apikey: validatedEnv.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${validatedEnv.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  }
}

function getSupabaseLeadsUrl(): string {
  return `${validatedEnv.SUPABASE_URL}${SUPABASE_LEADS_PATH}`
}

function createSupabaseInsertError(status: number, errorText: string): Error {
  return new Error(`Supabase insert failed with status ${status}: ${errorText}`)
}

function createSupabaseUpdateError(status: number): Error {
  return new Error(`Supabase update failed with status ${status}`)
}

export async function insertSupabaseLead(
  payload: Record<string, unknown>,
): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseLeadsUrl(), {
    method: 'POST',
    headers: {
      ...buildSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    // WHY: Supabase REST inserts expect an array payload for bulk-safe APIs.
    body: JSON.stringify([payload]),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logError('Supabase lead insert failed', undefined, { status: response.status })
    throw createSupabaseInsertError(response.status, errorText)
  }

  const data = (await response.json()) as SupabaseLeadRow[]
  const lead = Array.isArray(data) ? data[0] : undefined
  if (!lead || typeof lead.id !== 'string' || lead.id.trim() === '') {
    // WHY: Downstream CRM sync relies on a stable lead ID for idempotency.
    logError('Supabase insert returned invalid lead ID')
    throw new Error('Supabase insert returned invalid lead ID')
  }

  return lead
}

export async function updateSupabaseLead(
  leadId: string,
  updates: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(`${getSupabaseLeadsUrl()}?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: buildSupabaseHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    logError('Supabase lead update failed', undefined, { status: response.status })
    throw createSupabaseUpdateError(response.status)
  }
}
