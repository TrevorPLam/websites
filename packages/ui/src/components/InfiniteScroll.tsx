// File: packages/ui/src/components/InfiniteScroll.tsx  [TRACE:FILE=packages.ui.components.InfiniteScroll]
// Purpose: Infinite scroll trigger with loading states.
//          Provides intersection observer-based infinite scroll functionality.
//
// Relationship: Depends on @repo/utils (cn).
// System role: Performance primitive (Layer L2 @repo/ui).
// Assumptions: Used for infinite scroll patterns. Uses Intersection Observer API.
//
// Exports / Entry: InfiniteScroll, InfiniteScrollProps
// Used by: Long lists, feeds, search results
//
// Invariants:
// - Uses Intersection Observer only
// - Loading state display
//
// Status: @public
// Features:
// - [FEAT:UI] Infinite scroll trigger
// - [FEAT:UI] Loading state
// - [FEAT:PERFORMANCE] Intersection Observer based

import * as React from 'react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback when scroll reaches threshold */
  onLoadMore: () => void | Promise<void>;
  /** Whether more data is available */
  hasMore: boolean;
  /** Whether data is currently loading */
  isLoading?: boolean;
  /** Loading component */
  loader?: React.ReactNode;
  /** End message when no more data */
  endMessage?: React.ReactNode;
  /** Threshold for triggering load (0-1) */
  threshold?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      className,
      onLoadMore,
      hasMore,
      isLoading = false,
      loader,
      endMessage,
      threshold = 0.1,
      children,
      ...props
    },
    ref
  ) => {
    const observerTarget = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        },
        { threshold }
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) {
        observer.observe(currentTarget);
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget);
        }
      };
    }, [hasMore, isLoading, onLoadMore, threshold]);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
        {hasMore ? (
          <div ref={observerTarget} className="flex justify-center py-4">
            {isLoading && (loader || <div className="text-sm text-muted-foreground">Loading...</div>)}
          </div>
        ) : (
          endMessage && <div className="flex justify-center py-4 text-sm text-muted-foreground">{endMessage}</div>
        )}
      </div>
    );
  }
);
InfiniteScroll.displayName = 'InfiniteScroll';
