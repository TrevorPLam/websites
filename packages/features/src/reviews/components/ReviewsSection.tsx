/**
 * @file packages/features/src/reviews/components/ReviewsSection.tsx
 * Purpose: Reviews section using marketing-components TestimonialGrid/Carousel
 */

import { TestimonialGrid, TestimonialCarousel } from '@repo/marketing-components';
import type { Testimonial } from '@repo/marketing-components';
import type { ReviewsFeatureConfig } from '../lib/reviews-config';

export interface ReviewsSectionProps extends ReviewsFeatureConfig {
  /** Pre-loaded reviews (overrides config when provided) */
  reviews?: Testimonial[];
}

export function ReviewsSection({
  title,
  layout = 'grid',
  reviews: propsReviews,
  ...rest
}: ReviewsSectionProps) {
  const config = rest as ReviewsFeatureConfig;
  const reviews = propsReviews ?? config.reviews ?? [];

  if (reviews.length === 0) return null;

  if (layout === 'carousel') {
    return <TestimonialCarousel title={title} testimonials={reviews} />;
  }

  return <TestimonialGrid title={title} testimonials={reviews} />;
}
