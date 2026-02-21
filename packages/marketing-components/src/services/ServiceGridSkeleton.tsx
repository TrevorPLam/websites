'use client';

/**
 * @file packages/marketing-components/src/services/ServiceGridSkeleton.tsx
 * @role component
 * @summary Loading skeleton for service grid
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';

export interface ServiceGridSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  /** Section title */
  title?: string;
  /** Additional className */
  className?: string;
}

/**
 * Service grid loading skeleton with animated placeholders.
 * Provides perceived performance improvement during content loading.
 */
export function ServiceGridSkeleton({
  count = 6,
  columns = 3,
  title,
  className,
}: ServiceGridSkeletonProps) {
  const gridClasses = cn(
    'grid gap-8',
    columns === 2 && 'grid-cols-1 md:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={cn('py-16 lg:py-24', className)}>
      <Container>
        {title && (
          <div className="text-center mb-16">
            <div className="h-10 bg-muted animate-pulse rounded-lg w-48 mx-auto mb-4" />
            <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
          </div>
        )}

        <div className={gridClasses}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-lg border">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="flex-1 p-6 space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
                <div className="h-6 bg-muted animate-pulse rounded w-24 mt-4" />
                <div className="h-10 bg-muted animate-pulse rounded-lg w-32 mt-6" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
