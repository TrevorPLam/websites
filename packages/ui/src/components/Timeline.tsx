// File: packages/ui/src/components/Timeline.tsx  [TRACE:FILE=packages.ui.components.Timeline]
// Purpose: Timeline display with events and milestones.
//          Provides visual timeline for chronological events.
//
// Relationship: Depends on @repo/utils (cn), lucide-react.
// System role: Display primitive (Layer L2 @repo/ui).
// Assumptions: Used for displaying chronological events and milestones.
//
// Exports / Entry: Timeline component and sub-components, TimelineProps
// Used by: Activity feeds, history displays, event timelines
//
// Invariants:
// - Connector lines between items
// - Variant styles available
//
// Status: @public
// Features:
// - [FEAT:UI] Timeline item rendering
// - [FEAT:UI] Connector lines
// - [FEAT:UI] Variant styles

import * as React from 'react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimelineItem {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of timeline items */
  items: TimelineItem[];
  /** Variant style */
  variant?: 'default' | 'compact';
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, variant = 'default', ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {items.map((item, index) => (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector line */}
            {index < items.length - 1 && (
              <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
            )}
            {/* Icon/Indicator */}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
              {item.icon || <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium text-foreground">{item.title}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground">{item.description}</div>
              )}
              {item.timestamp && (
                <div className="text-xs text-muted-foreground">{item.timestamp}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
Timeline.displayName = 'Timeline';
