/**
 * HubSpot CRM adapter for contact upserts and searches.
 *
 * @module lib/hubspot-client
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Encapsulate HubSpot REST requests so server actions don't
 * call fetch directly.
 *
 * **ARCHITECTURE PATTERN**: Adapter module (server-only utility)
 * - Called by lib/actions.ts
 * - Returns parsed responses or throws on invalid states
 *
 * **CURRENT STATE**: Supports contact search by email and upsert via POST/PATCH.
 *
 * **KEY DEPENDENCIES**:
 * - `./env.ts` — HubSpot credentials
 * - `./logger.ts` — Sanitized logging
 *
 * **AI ITERATION HINTS**:
 * 1. Keep request payloads explicit to avoid accidental schema drift.
 * 2. Preserve idempotency key support for retries.
 * 3. Validate array responses before indexing.
 *
 * **SECURITY CHECKLIST**:
 * - [x] Uses private app token (server-only)
 * - [x] Avoids logging PII in error contexts
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { logError } from './logger'
import { validatedEnv } from './env'

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com'

export interface HubSpotContactResponse {
  id: string
}

type HubSpotSearchResponse = {
  total: number
  results: Array<{ id: string }>
}

type HubSpotUpsertTarget = {
  url: string
  method: 'PATCH' | 'POST'
}

function buildHubSpotHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

function buildHubSpotHeadersWithIdempotency(
  idempotencyKey: string | undefined,
): Record<string, string> {
  if (!idempotencyKey) {
    return buildHubSpotHeaders()
  }

  return {
    ...buildHubSpotHeaders(),
    'Idempotency-Key': idempotencyKey,
  }
}

function buildHubSpotSearchPayload(email: string) {
  return {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          },
        ],
      },
    ],
    properties: ['email'],
    limit: 1,
  }
}

function getHubSpotUpsertTarget(existingId?: string): HubSpotUpsertTarget {
  if (existingId) {
    return {
      url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`,
      method: 'PATCH',
    }
  }

  return {
    url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`,
    method: 'POST',
  }
}

export async function searchHubSpotContact(email: string): Promise<string | undefined> {
  const response = await fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: buildHubSpotHeaders(),
    body: JSON.stringify(buildHubSpotSearchPayload(email)),
  })

  if (!response.ok) {
    logError('HubSpot search request failed', undefined, { status: response.status })
    throw new Error(`HubSpot search failed with status ${response.status}`)
  }

  const searchData = (await response.json()) as HubSpotSearchResponse
  if (!Array.isArray(searchData.results)) {
    // WHY: Guard against malformed HubSpot responses before indexing.
    logError('HubSpot search response missing results array')
    throw new Error('HubSpot search response missing results array')
  }

  return searchData.results[0]?.id
}

export async function upsertHubSpotContact(params: {
  properties: Record<string, string>
  idempotencyKey?: string
  existingId?: string
}): Promise<HubSpotContactResponse> {
  const { properties, idempotencyKey, existingId } = params
  const { url, method } = getHubSpotUpsertTarget(existingId)

  const response = await fetch(url, {
    method,
    headers: buildHubSpotHeadersWithIdempotency(idempotencyKey),
    body: JSON.stringify({ properties }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logError('HubSpot upsert request failed', undefined, { status: response.status })
    throw new Error(`HubSpot upsert failed with status ${response.status}: ${errorText}`)
  }

  return (await response.json()) as HubSpotContactResponse
}
