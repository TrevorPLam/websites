/**
 * @file packages/integrations/reviews/contract.ts
 * Task: [4.4] Review platform integration contract
 *
 * Purpose: Read-only adapter for aggregating reviews from Google, Yelp, Trustpilot.
 * Display only; no review response (per task constraint).
 */

/** Single review item for display (read-only; no response posting). */
export interface ReviewItem {
  /** Reviewer display name */
  author?: string;
  /** Numeric rating (e.g. 1–5) */
  rating?: number;
  /** Review body text */
  text?: string;
  /** Publication or display date (ISO or display string) */
  date?: string;
  /** Source identifier (e.g. 'google', 'yelp', 'trustpilot') */
  source: string;
  /** Link to original review if available */
  url?: string;
}

export interface ReviewAdapter {
  id: string;
  name: string;

  /**
   * Returns reviews for display. Read-only; no response posting.
   */
  getReviews(): Promise<ReviewItem[]>;
}
