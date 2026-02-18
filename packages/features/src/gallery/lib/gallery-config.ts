/**
 * @file packages/features/src/gallery/lib/gallery-config.ts
 * Purpose: Gallery feature configuration
 */

import type { GalleryItem } from '@repo/marketing-components';

export interface GalleryFeatureConfig {
  /** Section title */
  title?: string;
  /** Layout variant */
  layout?: 'grid';
  /** Columns for grid */
  columns?: 2 | 3 | 4;
  /** Gallery items (config-based source) */
  items?: GalleryItem[];
}

export function createGalleryConfig(
  overrides: Partial<GalleryFeatureConfig> = {}
): GalleryFeatureConfig {
  return {
    layout: 'grid',
    columns: 3,
    ...overrides,
  };
}
