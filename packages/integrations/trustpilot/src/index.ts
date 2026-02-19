/**
 * @file packages/integrations/trustpilot/src/index.ts
 * Task: [4.4] Trustpilot reviews aggregation (read-only display)
 */

import type { ReviewAdapter, ReviewItem } from '../../reviews/contract';

/**
 * Trustpilot adapter. Read-only; no review response.
 */
export class TrustpilotAdapter implements ReviewAdapter {
  id = 'trustpilot';
  name = 'Trustpilot';

  constructor(private _businessUnitId?: string) {}

  async getReviews(): Promise<ReviewItem[]> {
    // Placeholder: real implementation would use Trustpilot API.
    return [];
  }
}
