// File: packages/ui/src/components/Switch.tsx  [TRACE:FILE=packages.ui.components.Switch]
// Purpose: Accessible toggle switch for boolean settings. Built on Radix UI Switch
//          which provides correct role="switch", aria-checked, and keyboard activation
//          (Space to toggle). Supports size and variant styling.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Compose with Label component for accessible labelling. Controlled via
//              checked/onCheckedChange or uncontrolled via defaultChecked.
//
// Exports / Entry: Switch, SwitchProps
// Used by: Settings forms, feature toggles, preference controls
//
// Invariants:
// - Radix manages role="switch", aria-checked, keyboard activation (Space)
// - Thumb translates via CSS transform; track color transitions on state change
//
// Status: @public
// Features:
// - [FEAT:UI] 3 sizes: sm | md | lg
// - [FEAT:UI] 2 variants: default | destructive
// - [FEAT:ACCESSIBILITY] WAI-ARIA switch pattern via Radix

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchVariant = 'default' | 'destructive';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: SwitchSize;
  variant?: SwitchVariant;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Switch.trackSizeStyles]
const trackSizeStyles: Record<SwitchSize, string> = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
};

// [TRACE:CONST=packages.ui.components.Switch.thumbSizeStyles]
const thumbSizeStyles: Record<SwitchSize, string> = {
  sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
  md: 'h-4 w-4 data-[state=checked]:translate-x-4',
  lg: 'h-5 w-5 data-[state=checked]:translate-x-5',
};

// [TRACE:CONST=packages.ui.components.Switch.variantStyles]
const variantStyles: Record<SwitchVariant, string> = {
  default:
    'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  destructive:
    'data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input',
};

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Switch]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = 'md', variant = 'default', ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
      'shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variantStyles[variant],
      trackSizeStyles[size],
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block rounded-full bg-background shadow-lg',
        'ring-0 transition-transform',
        'data-[state=unchecked]:translate-x-0',
        thumbSizeStyles[size]
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';
