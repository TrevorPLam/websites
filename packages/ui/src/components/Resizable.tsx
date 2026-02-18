// File: packages/ui/src/components/Resizable.tsx  [TRACE:FILE=packages.ui.components.Resizable]
// Purpose: Resizable panels with drag handles for adjustable layouts.
//          Built on Radix UI Resizable which provides accessible resizing
//          with keyboard support and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Layout primitive (Layer L2 @repo/ui).
// Assumptions: Used for split panes, adjustable sidebars, and resizable content areas.
//
// Exports / Entry: ResizablePanelGroup, ResizablePanel, ResizableHandle, ResizableProps
// Used by: Split panes, adjustable layouts, resizable sidebars
//
// Invariants:
// - Radix manages keyboard navigation and ARIA attributes
// - No custom handle styling beyond Radix defaults
// - Supports horizontal and vertical orientations
//
// Status: @public
// Features:
// - [FEAT:UI] Resizable panels with drag handles
// - [FEAT:UI] Horizontal and vertical orientations
// - [FEAT:ACCESSIBILITY] Keyboard accessible resizing
// - [FEAT:PERFORMANCE] Efficient resize handling

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the panel group */
  direction?: 'horizontal' | 'vertical';
}

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show grip icon */
  withHandle?: boolean;
}

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.ResizablePanelGroup]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, direction = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    data-panel-group-direction={direction}
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className
    )}
    {...props}
  />
));
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative', className)}
    {...props}
  />
));
ResizablePanel.displayName = 'ResizablePanel';

export const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(({ className, withHandle, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
));
ResizableHandle.displayName = 'ResizableHandle';
