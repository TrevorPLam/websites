// File: packages/ui/src/components/Progress.tsx  [TRACE:FILE=packages.ui.components.Progress]
// Purpose: Progress indicator with determinate and indeterminate states.
//          Built on Radix UI Progress which provides correct role="progressbar",
//          aria-valuenow, aria-valuemin, and aria-valuemax attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Feedback primitive (Layer L2 @repo/ui).
// Assumptions: Used for loading states, file uploads, and progress tracking.
//
// Exports / Entry: Progress, ProgressProps
// Used by: Forms, uploads, data processing flows, loading indicators
//
// Invariants:
// - Radix manages role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
// - CSS-only animations (no JavaScript animation libraries)
// - Supports determinate (value) and indeterminate (no value) states
//
// Status: @public
// Features:
// - [FEAT:UI] Determinate and indeterminate states
// - [FEAT:UI] Multiple variants (default, success, warning, error)
// - [FEAT:UI] Size variants (sm, md, lg)
// - [FEAT:ACCESSIBILITY] WAI-ARIA progressbar pattern via Radix

import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size variant */
  size?: ProgressSize;
  /** Optional label text */
  label?: string;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantStyles: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-destructive',
};

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Progress]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, variant = 'default', size = 'md', label, value, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        {value !== undefined && <span className="text-muted-foreground">{value}%</span>}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          variantStyles[variant]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = 'Progress';
