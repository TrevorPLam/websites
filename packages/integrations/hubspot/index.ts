/**
 * @file packages/integrations/hubspot/index.ts
 * Purpose: HubSpot integration barrel — contact search and upsert via HubSpot CRM API.
 * Relationship: Depends on @repo/infra (logError). Consumed by template lib/actions/hubspot.
 * System role: searchHubSpotContact(email), upsertHubSpotContact(properties, idempotencyKey?, existingId?).
 * Assumptions: HUBSPOT_PRIVATE_APP_TOKEN set; API base https://api.hubapi.com.
 */
export { searchHubSpotContact, upsertHubSpotContact } from './client';
export type { HubSpotContactResponse } from './types';
