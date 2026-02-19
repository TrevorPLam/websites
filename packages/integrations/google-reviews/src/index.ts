/**
 * @file packages/integrations/google-reviews/src/index.ts
 * Task: [4.4] Google reviews aggregation (read-only display)
 */

import type { ReviewAdapter, ReviewItem } from '../../reviews/contract';

/**
 * Google reviews adapter. Read-only; no review response.
 */
export class GoogleReviewsAdapter implements ReviewAdapter {
  id = 'google';
  name = 'Google Reviews';

  constructor(private _placeId?: string) {}

  async getReviews(): Promise<ReviewItem[]> {
    // Placeholder: real implementation would use Google Places API or similar.
    return [];
  }
}
