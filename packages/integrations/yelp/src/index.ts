/**
 * @file packages/integrations/yelp/src/index.ts
 * Task: [4.4] Yelp reviews aggregation (read-only display)
 */

import type { ReviewAdapter, ReviewItem } from '../../reviews/contract';

/**
 * Yelp adapter. Read-only; no review response.
 */
export class YelpAdapter implements ReviewAdapter {
  id = 'yelp';
  name = 'Yelp';

  constructor(private _businessId?: string) {}

  async getReviews(): Promise<ReviewItem[]> {
    // Placeholder: real implementation would use Yelp Fusion API.
    return [];
  }
}
