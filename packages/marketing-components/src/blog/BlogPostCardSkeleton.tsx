'use client';

/**
 * @file packages/marketing-components/src/blog/BlogPostCardSkeleton.tsx
 * @role component
 * @summary Loading skeleton for blog post cards
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';

export interface BlogPostCardSkeletonProps {
  /** Card variant */
  variant?: 'card' | 'list';
  /** Additional className */
  className?: string;
}

/**
 * Blog post card loading skeleton with animated placeholders.
 * Provides perceived performance improvement during content loading.
 */
export function BlogPostCardSkeleton({ variant = 'card', className }: BlogPostCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow hover:shadow-md',
        variant === 'list' && 'flex flex-row',
        className
      )}
    >
      <div className={cn('block', variant === 'list' && 'flex flex-1 gap-4')}>
        <div
          className={cn(
            'relative overflow-hidden bg-muted animate-pulse',
            variant === 'list' ? 'aspect-square w-40 shrink-0' : 'aspect-video w-full'
          )}
        />
        <div className={cn('p-4', variant === 'list' && 'flex flex-1 flex-col')}>
          <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 bg-muted animate-pulse rounded w-16" />
            <div className="h-3 bg-muted animate-pulse rounded w-20" />
            <div className="h-3 bg-muted animate-pulse rounded w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}
