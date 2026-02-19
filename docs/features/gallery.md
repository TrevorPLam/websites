<!--
/**
 * @file docs/features/gallery.md
 * @role docs
 * @summary Developer guide for the gallery feature: components, props, site.config integration.
 *
 * @invariants
 * - Gallery components are display-only; they accept items as props.
 * - features.gallery in site.config.ts controls which variant renders.
 *
 * @verification
 * - Verified props against packages/marketing-components/src/gallery/GalleryGrid.tsx
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Gallery Feature

**Package:** `@repo/marketing-components/gallery`
**Config key:** `features.gallery`
**Last Updated:** 2026-02-19

---

## Overview

The gallery feature renders a visual grid of images. It is display-only: components accept image data as props and have no CMS or API integration. Data sourcing (static arrays, CMS fetch, or filesystem scan) is the responsibility of the consuming page.

---

## Enabling the Gallery

In `site.config.ts`, set `features.gallery` to one of the available variants or `null` to disable:

```typescript
features: {
  gallery: 'grid' | 'carousel' | 'lightbox' | null,
}
```

Currently implemented: **`grid`**. (`carousel` and `lightbox` are planned variants.)

---

## Component: `GalleryGrid`

```typescript
import { GalleryGrid } from '@repo/marketing-components';
```

### Props

```typescript
interface GalleryItem {
  id: string;
  src: string;        // Image URL
  alt: string;        // Alt text (required for a11y)
  caption?: string;   // Optional figure caption
  href?: string;      // Optional link URL (wraps image in <a>)
}

interface GalleryGridProps {
  title?: string;           // Optional section heading
  items: GalleryItem[];     // Array of gallery images
  columns?: 2 | 3 | 4;     // Grid columns (default: 3)
  className?: string;
}
```

### Usage Example

```typescript
import { GalleryGrid } from '@repo/marketing-components';

const galleryItems = [
  { id: '1', src: '/images/gallery/cut-1.jpg', alt: 'Precision haircut', caption: 'Bob cut' },
  { id: '2', src: '/images/gallery/color-1.jpg', alt: 'Balayage coloring' },
  { id: '3', src: '/images/gallery/style-1.jpg', alt: 'Updo style', href: '/gallery/style-1' },
];

export default function GalleryPage() {
  return (
    <GalleryGrid
      title="Our Work"
      items={galleryItems}
      columns={3}
    />
  );
}
```

### Grid Layout

The `columns` prop controls the responsive grid:

| `columns` | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| `2` | 1 col | 2 cols | 2 cols |
| `3` (default) | 1 col | 2 cols | 3 cols |
| `4` | 1 col | 2 cols | 4 cols |

---

## Accessibility

- Always provide meaningful `alt` text for every image
- Use empty `alt=""` only for decorative images
- When `href` is set, the link is keyboard accessible
- Captions render in `<figcaption>` with semantic association to the image

---

## Adding Static Gallery Images

```typescript
// lib/gallery-data.ts
import type { GalleryItem } from '@repo/marketing-components';

export const galleryItems: GalleryItem[] = [
  { id: '1', src: '/images/gallery/work-1.jpg', alt: 'Project 1' },
  { id: '2', src: '/images/gallery/work-2.jpg', alt: 'Project 2' },
];
```

For production, use Next.js `<Image>` by wrapping data in a server component that provides optimized image URLs.

---

## Planned Variants

| Variant | Status | Description |
|---------|--------|-------------|
| `grid` | Implemented | Responsive image grid |
| `carousel` | Planned | Auto-advancing slideshow |
| `lightbox` | Planned | Click-to-expand full-screen view |

---

## See Also

- [`packages/marketing-components/src/gallery/`](../../packages/marketing-components/src/gallery/) — Source code
- [`docs/configuration/site-config-reference.md`](../configuration/site-config-reference.md) — Feature flags reference
