/**
 * @file packages/integrations/maps/index.ts
 * Task: [4.5] Export maps integration adapters
 */
export * from './contract';
export { getMapsConsent, hasMapsConsent, setMapsConsent } from './consent';
export type { MapsConsentState } from './consent';
export { GoogleMapsAdapter } from '../google-maps/src';
