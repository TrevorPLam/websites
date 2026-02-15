import * as React from 'react';
import { cn } from '@repo/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'testimonial' | 'service';
}

const variantStyles: Record<string, string> = {
  default: 'bg-card text-card-foreground rounded-xl border border-border shadow-xs',
  testimonial: 'bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6',
  service:
    'bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6 hover:shadow-md transition-shadow',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return <div ref={ref} className={cn(variantStyles[variant], className)} {...props} />;
  }
);
Card.displayName = 'Card';
