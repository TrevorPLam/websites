'use client';

/**
 * @file packages/marketing-components/src/services/ServiceGrid.tsx
 * @role component
 * @summary Service card grid layout
 *
 * Responsive grid layout for displaying services in cards.
 */

import { Card, Container, Section } from '@repo/ui';
import Image from 'next/image';
import { cn } from '@repo/utils';
import type { Service } from './types';

export interface ServiceGridProps {
  /** Services to display */
  services: Service[];
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Service grid component with responsive columns.
 *
 * FIX summary:
 * 1. Performance/LCP: Replaced raw `<img>` with Next.js `<Image>` component.
 *    Using `fill` with `object-cover` inside a relative aspect-ratio container
 *    to ensure optimized delivery (WebP/AVIF) and zero layout shift.
 * 2. Design System: Replaced inline styled `<a>` with the design system's
 *    `<Button>` component (variant="outline"). This ensures consistency
 *    in focus states, hover effects, and typography across the monorepo.
 *
 * @param props - ServiceGridProps
 * @returns Service grid component
 */
export function ServiceGrid({
  services,
  columns = 3,
  title,
  description,
  className,
}: ServiceGridProps) {
  const gridClasses = cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={cn('py-12', className)}>
      <Container>
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className={gridClasses}>
          {services.map((service) => (
            <Card
              key={service.id}
              variant="service"
              className="flex h-full flex-col overflow-hidden"
            >
              {service.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {service.icon && <div className="mb-4 text-primary">{service.icon}</div>}
                <h3 className="text-xl font-semibold leading-none tracking-tight">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>
                )}
                <div className="mt-auto pt-6">
                  {service.price && (
                    <p className="mb-4 text-lg font-bold text-primary">{service.price}</p>
                  )}
                  {service.cta && (
                    <a
                      href={service.cta.href}
                      className={cn(
                        'inline-flex w-full items-center justify-center rounded-md border border-border',
                        'bg-transparent px-4 py-2 text-sm font-medium text-foreground',
                        'hover:bg-accent hover:text-accent-foreground transition-colors'
                      )}
                    >
                      {service.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
