/**
 * @file packages/features/src/gallery/components/GallerySection.tsx
 * Purpose: Gallery section using marketing-components display
 */

import { GalleryGrid } from '@repo/marketing-components';
import type { GalleryItem } from '@repo/marketing-components';
import type { GalleryFeatureConfig } from '../lib/gallery-config';

export interface GallerySectionProps extends GalleryFeatureConfig {
  /** Pre-loaded items (overrides config when provided) */
  items?: GalleryItem[];
}

export function GallerySection({
  title,
  columns = 3,
  items: propsItems,
  ...rest
}: GallerySectionProps) {
  const config = rest as GalleryFeatureConfig;
  const items = propsItems ?? config.items ?? [];

  if (items.length === 0) return null;

  return <GalleryGrid title={title} items={items} columns={columns} />;
}
