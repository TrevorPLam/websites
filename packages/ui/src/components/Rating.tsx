'use client';

// File: packages/ui/src/components/Rating.tsx  [TRACE:FILE=packages.ui.components.Rating]
// Purpose: Star rating component with read-only and interactive modes.
//          Provides accessible star rating with half-star support.
//
// Relationship: Depends on @repo/utils (cn), lucide-react.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for ratings and reviews.
//
// Exports / Entry: Rating, RatingProps
// Used by: Reviews, feedback forms, product ratings
//
// Invariants:
// - Minimum touch target size: 24×24px for WCAG 2.2 AA compliance
// - Keyboard accessible
//
// Status: @public
// Features:
// - [FEAT:UI] Interactive and read-only modes
// - [FEAT:UI] Half-star support
// - [FEAT:ACCESSIBILITY] Keyboard navigation and ARIA attributes

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current rating value (0-5) */
  value?: number;
  /** Callback when rating changes */
  onValueChange?: (value: number) => void;
  /** Maximum rating (default: 5) */
  max?: number;
  /** Whether rating is read-only */
  readOnly?: boolean;
  /** Whether to allow half stars */
  allowHalf?: boolean;
  /** Size of stars */
  size?: 'sm' | 'md' | 'lg';
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value = 0,
      onValueChange,
      max = 5,
      readOnly = false,
      allowHalf = false,
      _size = 'md',
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const [isHovering, setIsHovering] = React.useState(false);

    const displayValue = isHovering && hoverValue !== null ? hoverValue : value;

    const handleClick = (newValue: number) => {
      if (!readOnly && onValueChange) {
        onValueChange(newValue);
      }
    };

    const handleMouseEnter = (starValue: number) => {
      if (!readOnly) {
        setHoverValue(starValue);
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      if (!readOnly) {
        setHoverValue(null);
        setIsHovering(false);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-0.5', className)}
        onMouseLeave={handleMouseLeave}
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label={readOnly ? `Rating: ${value} out of ${max}` : 'Rating'}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const isFilled = displayValue >= starValue;
          const isHalfFilled =
            allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              className={cn(
                'cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
                readOnly && 'cursor-default',
                sizeStyles[size],
                'min-w-[24px] min-h-[24px]'
              )}
              disabled={readOnly}
              aria-label={`Rate ${starValue} out of ${max}`}
            >
              <Star
                className={cn(
                  sizeStyles[size],
                  isFilled || isHalfFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }
);
Rating.displayName = 'Rating';
