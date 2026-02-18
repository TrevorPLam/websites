/**
 * @file packages/features/src/reviews/lib/reviews-config.ts
 * Purpose: Reviews feature configuration — uses Testimonial shape from marketing-components
 */

import type { Testimonial } from '@repo/marketing-components';

export interface ReviewsFeatureConfig {
  /** Section title */
  title?: string;
  /** Layout variant */
  layout?: 'grid' | 'carousel';
  /** Reviews (same shape as Testimonial — quote/content, author, rating) */
  reviews?: Testimonial[];
}

export function createReviewsConfig(
  overrides: Partial<ReviewsFeatureConfig> = {}
): ReviewsFeatureConfig {
  return {
    layout: 'grid',
    ...overrides,
  };
}
