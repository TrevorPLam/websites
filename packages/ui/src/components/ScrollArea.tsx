// File: packages/ui/src/components/ScrollArea.tsx  [TRACE:FILE=packages.ui.components.ScrollArea]
// Purpose: Custom scrollable area with styled scrollbars.
//          Built on Radix UI ScrollArea which provides cross-browser compatible
//          custom scrollbars with proper accessibility.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Layout primitive (Layer L2 @repo/ui).
// Assumptions: Used for custom scrollbar styling and consistent scrolling behavior.
//
// Exports / Entry: ScrollArea, ScrollBar, ScrollAreaProps
// Used by: Custom scrollable containers, sidebars, content areas
//
// Invariants:
// - Cross-browser compatible scrollbars
// - Custom styling via CSS
// - No custom scrollbar animations
//
// Status: @public
// Features:
// - [FEAT:UI] Custom styled scrollbars
// - [FEAT:PERFORMANCE] Cross-browser compatibility
// - [FEAT:ACCESSIBILITY] Proper scroll behavior

import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> {}

export interface ScrollBarProps extends React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> {
  /** Orientation of the scrollbar */
  orientation?: 'vertical' | 'horizontal';
}

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.ScrollArea]
// [FEAT:UI] [FEAT:PERFORMANCE]
export const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = 'ScrollArea';

export const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = 'ScrollBar';
