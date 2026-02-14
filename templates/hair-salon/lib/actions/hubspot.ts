

import { logWarn, withServerSpan } from '@repo/infra';
import {
  searchHubSpotContact,
  upsertHubSpotContact,
  type HubSpotContactResponse,
} from '@/features/hubspot/lib/hubspot-client';
import { HUBSPOT } from '../constants';
import type { SanitizedContactData } from './types';
import { hashSpanValue, splitName, normalizeError } from './helpers';

const HUBSPOT_MAX_RETRIES = HUBSPOT.MAX_RETRIES;
const HUBSPOT_RETRY_BASE_DELAY_MS = HUBSPOT.RETRY_BASE_DELAY_MS;
const HUBSPOT_RETRY_MAX_DELAY_MS = HUBSPOT.RETRY_MAX_DELAY_MS;

export function getRetryDelayMs(attempt: number) {
  return Math.min(HUBSPOT_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1), HUBSPOT_RETRY_MAX_DELAY_MS);
}

export function waitForRetry(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export function buildHubSpotProperties(sanitized: SanitizedContactData): Record<string, string> {
  const { firstName, lastName } = splitName(sanitized.safeName);
  const hubspotProperties: Record<string, string> = {
    email: sanitized.safeEmail,
    firstname: firstName,
  };

  if (lastName) {
    hubspotProperties.lastname = lastName;
  }

  if (sanitized.safePhone) {
    hubspotProperties.phone = sanitized.safePhone;
  }

  return hubspotProperties;
}

export async function searchHubSpotContactId(
  email: string,
  emailHash: string
): Promise<string | undefined> {
  // WHY: Keep spans in the action layer so adapters stay fetch-focused and reusable.
  return withServerSpan(
    {
      name: 'hubspot.search',
      op: 'http.client',
      attributes: { email_hash: emailHash },
    },
    () => searchHubSpotContact(email)
  );
}

export async function upsertHubSpotContactWithSpan(
  properties: Record<string, string>,
  idempotencyKey: string,
  emailHash: string
): Promise<HubSpotContactResponse> {
  const existingId = await searchHubSpotContactId(properties.email || '', emailHash);
  const existingIdHash = existingId ? hashSpanValue(existingId) : undefined;

  // WHY: Search + upsert share hashed context for traceability without exposing PII.
  return withServerSpan(
    {
      name: 'hubspot.upsert',
      op: 'http.client',
      attributes: {
        email_hash: emailHash,
        hubspot_contact_id_hash: existingIdHash,
      },
    },
    () =>
      upsertHubSpotContact({
        properties,
        idempotencyKey,
        existingId,
      })
  );
}

export async function retryHubSpotUpsert(
  properties: Record<string, string>,
  idempotencyKey: string,
  emailHash: string
) {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= HUBSPOT_MAX_RETRIES; attempt++) {
    try {
      const contact = await upsertHubSpotContactWithSpan(properties, idempotencyKey, emailHash);
      return { contact, attempts: attempt };
    } catch (error) {
      lastError = normalizeError(error);
      if (attempt < HUBSPOT_MAX_RETRIES) {
        logWarn('HubSpot sync retry scheduled', { attempt, emailHash });
        await waitForRetry(getRetryDelayMs(attempt));
      }
    }
  }

  return { attempts: HUBSPOT_MAX_RETRIES, error: lastError };
}
