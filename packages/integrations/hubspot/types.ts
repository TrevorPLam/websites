/**
 * @file packages/integrations/hubspot/types.ts
 * Purpose: HubSpot API response type for contact upsert.
 * Relationship: Used by client.ts and consumers of upsertHubSpotContact.
 */
export interface HubSpotContactResponse {
  id: string;
}
