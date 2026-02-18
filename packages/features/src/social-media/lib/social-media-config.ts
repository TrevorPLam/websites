/**
 * @file packages/features/src/social-media/lib/social-media-config.ts
 * Purpose: Social media feature configuration — uses @repo/types SocialLink
 */

import type { SocialLink } from '@repo/types';

export interface SocialMediaFeatureConfig {
  /** Section title */
  title?: string;
  /** Social links (platform + url) */
  links?: SocialLink[];
}

export function createSocialMediaConfig(
  overrides: Partial<SocialMediaFeatureConfig> = {}
): SocialMediaFeatureConfig {
  return {
    title: 'Follow us',
    ...overrides,
  };
}
