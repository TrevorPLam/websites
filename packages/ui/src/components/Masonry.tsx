// File: packages/ui/src/components/Masonry.tsx  [TRACE:FILE=packages.ui.components.Masonry]
// Purpose: Masonry layout for variable-height items.
//          Provides CSS-based masonry layout for variable-height content.
//
// Relationship: Depends on @repo/utils (cn).
// System role: Layout primitive (Layer L2 @repo/ui).
// Assumptions: Used for displaying variable-height items in a masonry grid.
//
// Exports / Entry: Masonry, MasonryProps
// Used by: Image galleries, card grids, content displays
//
// Invariants:
// - No virtual scrolling (all items rendered)
// - Responsive column layout
//
// Status: @public
// Features:
// - [FEAT:UI] Column layout
// - [FEAT:UI] Responsive columns
// - [FEAT:PERFORMANCE] CSS-based layout

import * as React from 'react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: number;
  /** Gap between items */
  gap?: number;
  /** Children to render */
  children: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, columns = 3, gap = 16, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn('grid w-full', className)}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          gridAutoRows: 'masonry',
        }}
        {...props}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="break-inside-avoid">
            {child}
          </div>
        ))}
      </div>
    );
  }
);
Masonry.displayName = 'Masonry';
