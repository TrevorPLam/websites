/**
 * @file packages/marketing-components/src/location/types.ts
 * @role types
 * @summary Location display types for maps, contact, hours
 */

export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  hours?: Record<string, string>;
  mapUrl?: string;
  directionsUrl?: string;
}
