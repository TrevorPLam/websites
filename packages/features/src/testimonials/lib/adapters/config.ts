/**
 * @file packages/features/src/testimonials/lib/adapters/config.ts
 * Purpose: Config-based testimonials adapter
 */

import type { Testimonial } from '@repo/marketing-components';
import type { TestimonialsFeatureConfig } from '../testimonials-config';

export async function getTestimonialsFromConfig(
  config: TestimonialsFeatureConfig
): Promise<Testimonial[]> {
  return config.testimonials ?? [];
}
