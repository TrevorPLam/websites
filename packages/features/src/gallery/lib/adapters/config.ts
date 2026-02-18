/**
 * @file packages/features/src/gallery/lib/adapters/config.ts
 * Purpose: Config-based gallery adapter
 */

import type { GalleryItem } from '@repo/marketing-components';
import type { GalleryFeatureConfig } from '../gallery-config';

export async function getGalleryFromConfig(
  config: GalleryFeatureConfig
): Promise<GalleryItem[]> {
  return config.items ?? [];
}
