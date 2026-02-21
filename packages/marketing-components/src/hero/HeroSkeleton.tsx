'use client';

/**
 * @file packages/marketing-components/src/hero/HeroSkeleton.tsx
 * @role component
 * @summary Loading skeleton for hero sections
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';

export interface HeroSkeletonProps {
  /** Additional className */
  className?: string;
  /** Skeleton variant */
  variant?: 'split' | 'overlay' | 'carousel';
}

/**
 * Hero section loading skeleton with animated placeholders.
 * Provides perceived performance improvement during content loading.
 */
export function HeroSkeleton({ variant = 'split', className }: HeroSkeletonProps) {
  return (
    <Section className={cn('py-20 lg:py-32', className)}>
      <Container>
        {variant === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-12 bg-muted animate-pulse rounded-lg" />
              <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4" />
              <div className="space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
              </div>
              <div className="h-12 bg-muted animate-pulse rounded-lg w-32" />
            </div>
            <div className="aspect-16/9 bg-muted animate-pulse rounded-lg" />
          </div>
        )}

        {variant === 'overlay' && (
          <div className="relative text-center">
            <div className="aspect-video bg-muted animate-pulse rounded-lg mb-8" />
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="h-12 bg-muted animate-pulse rounded-lg mx-auto" />
              <div className="h-6 bg-muted animate-pulse rounded-lg mx-auto w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-4 bg-muted animate-pulse rounded mx-auto w-5/6" />
              </div>
              <div className="h-12 bg-muted animate-pulse rounded-lg w-32 mx-auto mt-6" />
            </div>
          </div>
        )}

        {variant === 'carousel' && (
          <div className="relative">
            <div className="aspect-video bg-muted animate-pulse rounded-lg" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-8 h-2 bg-muted animate-pulse rounded" />
              <div className="w-8 h-2 bg-muted animate-pulse rounded" />
              <div className="w-8 h-2 bg-muted animate-pulse rounded" />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
