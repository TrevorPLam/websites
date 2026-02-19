/**
 * @file packages/integrations/reviews/index.ts
 * Task: [4.4] Export review integration adapters
 */
export * from './contract';
export { GoogleReviewsAdapter } from '../google-reviews/src';
export { YelpAdapter } from '../yelp/src';
export { TrustpilotAdapter } from '../trustpilot/src';
