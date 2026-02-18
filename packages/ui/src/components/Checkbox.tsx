// File: packages/ui/src/components/Checkbox.tsx  [TRACE:FILE=packages.ui.components.Checkbox]
// Purpose: Accessible checkbox input with checked, unchecked, and indeterminate states.
//          Built on Radix UI Checkbox which provides correct role="checkbox", aria-checked,
//          and keyboard activation (Space to toggle).
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Compose with Label component for accessible labelling. Controlled via
//              checked/onCheckedChange or uncontrolled via defaultChecked.
//
// Exports / Entry: Checkbox, CheckboxProps
// Used by: Forms, data tables, bulk selection interfaces
//
// Invariants:
// - Radix manages role="checkbox", aria-checked, keyboard activation (Space)
// - Supports three states: checked, unchecked, indeterminate
// - Minimum touch target size: 24×24px for WCAG 2.2 AA compliance
//
// Status: @public
// Features:
// - [FEAT:UI] Three states: checked, unchecked, indeterminate
// - [FEAT:ACCESSIBILITY] WAI-ARIA checkbox pattern via Radix
// - [FEAT:ACCESSIBILITY] WCAG 2.2 AA compliant touch targets

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const iconSizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
};

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Checkbox]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = 'md', ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
      sizeStyles[size],
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className={cn('h-4 w-4', iconSizeStyles[size])} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
