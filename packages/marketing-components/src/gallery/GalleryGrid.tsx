/**
 * @file packages/marketing-components/src/gallery/GalleryGrid.tsx
 * @role component
 * @summary Image gallery grid layout
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  href?: string;
}

export interface GalleryGridProps {
  /** Section title */
  title?: string;
  /** Gallery items */
  items: GalleryItem[];
  /** Columns */
  columns?: 2 | 3 | 4;
  /** Custom CSS class name */
  className?: string;
}

export function GalleryGrid({
  title,
  items,
  columns = 3,
  className,
}: GalleryGridProps) {
  const gridClasses = cn(
    'grid gap-4',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className={gridClasses}>
          {items.map((item) => {
            const content = (
              <figure>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                {item.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
            return item.href ? (
              <a key={item.id} href={item.href} className="block">
                {content}
              </a>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
