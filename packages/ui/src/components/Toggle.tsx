// File: packages/ui/src/components/Toggle.tsx  [TRACE:FILE=packages.ui.components.Toggle]
// Purpose: Toggle button with pressed state for on/off actions.
//          Built on Radix UI Toggle which provides correct role="button",
//          aria-pressed, and keyboard activation (Space/Enter).
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for toggle actions, not form submissions. Compose with Label for accessibility.
//
// Exports / Entry: Toggle, ToggleProps
// Used by: Toolbars, action buttons, toggle controls
//
// Invariants:
// - Radix manages role="button", aria-pressed, keyboard activation
// - Minimum touch target size: 24×24px for WCAG 2.2 AA compliance
//
// Status: @public
// Features:
// - [FEAT:UI] Pressed/unpressed states
// - [FEAT:UI] Size variants (sm, md, lg)
// - [FEAT:UI] Variant styles (default, outline, ghost, destructive)
// - [FEAT:ACCESSIBILITY] WAI-ARIA toggle button pattern via Radix

import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cva } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToggleVariant = 'default' | 'outline' | 'ghost' | 'destructive';
export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  /** Visual variant */
  variant?: ToggleVariant;
  /** Size variant */
  size?: ToggleSize;
}

const toggleVariants = cva({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  variants: {
    variant: {
      default: 'bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      outline:
        'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      ghost:
        'hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      destructive:
        'hover:bg-destructive hover:text-destructive-foreground data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground',
    },
    size: {
      sm: 'h-9 px-2.5',
      md: 'h-10 px-3',
      lg: 'h-11 px-5',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Toggle]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));
Toggle.displayName = 'Toggle';
