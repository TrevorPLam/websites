/**
 * Supabase-related functions for contact form actions.
 *
 * @module lib/actions/supabase
 */

import { logWarn, logInfo, logError } from '../logger'
import { withServerSpan } from '../sentry-server'
import { insertSupabaseLead, updateSupabaseLead, type SupabaseLeadRow } from '../supabase-leads'
import type { SanitizedContactData } from './types'
import { buildLeadSpanAttributes, buildHubSpotIdempotencyKey, normalizeError } from './helpers'
import { retryHubSpotUpsert, buildHubSpotProperties } from './hubspot'

export async function insertLeadWithSpan(
  sanitized: SanitizedContactData,
  isSuspicious: boolean,
): Promise<SupabaseLeadRow> {
  const lead = await withServerSpan(
    {
      name: 'supabase.insert',
      op: 'db.supabase',
      attributes: {
        ...sanitized.contactSpanAttributes,
        is_suspicious: isSuspicious,
      },
    },
    () =>
      insertSupabaseLead({
        name: sanitized.safeName,
        email: sanitized.safeEmail,
        phone: sanitized.safePhone,
        message: sanitized.safeMessage,
        is_suspicious: isSuspicious,
        suspicion_reason: isSuspicious ? 'rate_limit' : null,
        hubspot_sync_status: 'pending',
        hubspot_retry_count: 0,
        hubspot_idempotency_key: null,
      }),
  )

  if (isSuspicious) {
    logWarn('Rate limit exceeded for contact form', {
      emailHash: sanitized.emailHash,
      ip: sanitized.hashedIp,
    })
  }

  return lead
}

export async function updateLeadWithSpan(leadId: string, emailHash: string, updates: Record<string, unknown>) {
  return withServerSpan(
    {
      name: 'supabase.update',
      op: 'db.supabase',
      attributes: buildLeadSpanAttributes(leadId, emailHash),
    },
    () => updateSupabaseLead(leadId, updates),
  )
}

export async function syncHubSpotLead(leadId: string, sanitized: SanitizedContactData) {
  const hubspotProperties = buildHubSpotProperties(sanitized)
  const syncAttemptedAt = new Date().toISOString()
  const idempotencyKey = buildHubSpotIdempotencyKey(leadId, sanitized.emailHash)
  const retryResult = await retryHubSpotUpsert(hubspotProperties, idempotencyKey, sanitized.emailHash)

  if (retryResult.contact) {
    try {
      await updateLeadWithSpan(leadId, sanitized.emailHash, {
        hubspot_contact_id: retryResult.contact.id,
        hubspot_sync_status: 'synced',
        hubspot_last_sync_attempt: syncAttemptedAt,
        hubspot_retry_count: retryResult.attempts,
        hubspot_idempotency_key: idempotencyKey,
      })
      logInfo('HubSpot contact synced', { leadId, emailHash: sanitized.emailHash })
    } catch (updateError) {
      logError('Failed to update HubSpot sync status', updateError)
    }
    return
  }

  logError('HubSpot sync failed', normalizeError(retryResult.error))
  try {
    await updateLeadWithSpan(leadId, sanitized.emailHash, {
      hubspot_sync_status: 'needs_sync',
      hubspot_last_sync_attempt: syncAttemptedAt,
      hubspot_retry_count: retryResult.attempts,
      hubspot_idempotency_key: idempotencyKey,
    })
  } catch (updateError) {
    logError('Failed to update HubSpot sync status', updateError)
  }
}
