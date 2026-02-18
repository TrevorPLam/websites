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
import { cn } from '@repo/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'testimonial' | 'service';
}

/** Theme-based styles per variant; service adds hover shadow transition. */
const variantStyles: Record<string, string> = {
  default: 'bg-card text-card-foreground rounded-xl border border-border shadow-xs',
  testimonial: 'bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6',
  service:
    'bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6 hover:shadow-md transition-shadow',
};

/**
 * Renders a card div with optional variant styling. Forwards ref and div attributes.
 *
 * @param props - CardProps (variant, className, and HTMLDivElement props)
 * @returns Forwarded ref to the root div
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return <div ref={ref} className={cn(variantStyles[variant], className)} {...props} />;
  }
);
Card.displayName = 'Card';
