// File: packages/ui/src/components/Badge.tsx  [TRACE:FILE=packages.ui.components.Badge]
// Purpose: Small status/label indicator with semantic color variants and optional dot.
//          Pure CSS component — no runtime state, no Radix dependency.
//
// Relationship: Depends on @repo/utils (cn). No external primitive needed.
// System role: Display primitive (Layer L2 @repo/ui).
// Assumptions: Consumers supply text content. For interactive badges (dismissible tags)
//              compose with a Button's ghost variant instead.
//
// Exports / Entry: Badge, BadgeProps
// Used by: Status displays, tag lists, notification counts, category labels
//
// Invariants:
// - No animations; purely decorative/informational
// - dot prop adds a colored circle before the text
//
// Status: @public
// Features:
// - [FEAT:UI] 5 variants: default | secondary | destructive | outline | ghost
// - [FEAT:UI] 3 sizes: sm | md | lg
// - [FEAT:UI] Optional leading dot indicator

import * as React from 'react';
import { cva } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show a small filled circle before the label text. */
  dot?: boolean;
}

const badgeVariants = cva({
  base: 'inline-flex items-center gap-1 rounded-full border font-semibold transition-colors',
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'border-border text-foreground',
      ghost: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
    },
    size: {
      sm: 'px-1.5 py-0.5 text-[10px]',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Badge]
// [FEAT:UI]
export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
    {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
    {children}
  </span>
);

Badge.displayName = 'Badge';
