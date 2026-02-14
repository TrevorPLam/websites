/**
 * HubSpot CRM API client.
 * Search and upsert contacts with idempotency support.
 */

import { logError } from '@repo/infra';
import type { HubSpotContactResponse } from './types';

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com';

function getToken(): string {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    throw new Error('HUBSPOT_PRIVATE_APP_TOKEN is required for HubSpot operations');
  }
  return token;
}

function buildHeaders(idempotencyKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  return headers;
}

type HubSpotSearchResponse = {
  total: number;
  results: Array<{ id: string }>;
};

type HubSpotUpsertTarget = {
  url: string;
  method: 'PATCH' | 'POST';
};

function getUpsertTarget(existingId?: string): HubSpotUpsertTarget {
  if (existingId) {
    return {
      url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`,
      method: 'PATCH',
    };
  }
  return {
    url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`,
    method: 'POST',
  };
}

export async function searchHubSpotContact(email: string): Promise<string | undefined> {
  const response = await fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email'],
      limit: 1,
    }),
  });

  if (!response.ok) {
    logError('HubSpot search request failed', undefined, { status: response.status });
    throw new Error(`HubSpot search failed with status ${response.status}`);
  }

  const data = (await response.json()) as HubSpotSearchResponse;
  if (!Array.isArray(data.results)) {
    logError('HubSpot search response missing results array');
    throw new Error('HubSpot search response missing results array');
  }

  return data.results[0]?.id;
}

export async function upsertHubSpotContact(params: {
  properties: Record<string, string>;
  idempotencyKey?: string;
  existingId?: string;
}): Promise<HubSpotContactResponse> {
  const { properties, idempotencyKey, existingId } = params;
  const { url, method } = getUpsertTarget(existingId);

  const response = await fetch(url, {
    method,
    headers: buildHeaders(idempotencyKey),
    body: JSON.stringify({ properties }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError('HubSpot upsert request failed', undefined, { status: response.status });
    throw new Error(`HubSpot upsert failed with status ${response.status}: ${errorText}`);
  }

  return (await response.json()) as HubSpotContactResponse;
}
