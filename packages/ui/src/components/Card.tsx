/**
 * @file packages/ui/src/components/Card.tsx
 * [TRACE:FILE=packages.ui.components.Card]
 *
 * Purpose: Card container with theme-aware background, border, and shadow. Variants for
 *          default content, testimonials (with padding), and service cards (hover effect).
 *
 * Relationship: Used by feature components (ServicesOverview, etc.) and template sections.
 * System role: Presentational block; uses theme tokens (bg-card, border-border).
 * Assumptions: variant must exist in variantStyles; default is 'default'.
 */

import * as React from 'react';
import { cva } from '@repo/infrastructure/variants';
import { cn } from '@repo/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'testimonial' | 'service';
}

const cardVariants = cva({
  base: 'bg-card text-card-foreground rounded-xl border border-border shadow-xs',
  variants: {
    variant: {
      default: '',
      testimonial: 'p-6',
      service: 'p-6 hover:shadow-md transition-shadow',
    },
  },
  defaultVariants: { variant: 'default' },
});

/**
 * Renders a card div with optional variant styling. Forwards ref and div attributes.
 *
 * @param props - CardProps (_variant, className, and HTMLDivElement props)
 * @returns Forwarded ref to the root div
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />;
  }
);
Card.displayName = 'Card';
