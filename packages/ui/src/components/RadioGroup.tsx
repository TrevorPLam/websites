// File: packages/ui/src/components/RadioGroup.tsx  [TRACE:FILE=packages.ui.components.RadioGroup]
// Purpose: Accessible radio button group for single selection from multiple options.
//          Built on Radix UI Radio Group which provides correct role="radiogroup",
//          keyboard navigation (arrows), and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Compose with Label component for accessible labelling. Controlled via
//              value/onValueChange or uncontrolled via defaultValue.
//
// Exports / Entry: RadioGroup, RadioGroupItem, RadioGroupProps
// Used by: Forms, settings panels, surveys
//
// Invariants:
// - Radix manages role="radiogroup", keyboard navigation (arrows), ARIA attributes
// - Only one option can be selected at a time
// - Minimum touch target size: 24×24px for WCAG 2.2 AA compliance
//
// Status: @public
// Features:
// - [FEAT:UI] Horizontal and vertical orientations
// - [FEAT:UI] Card variant for rich content
// - [FEAT:ACCESSIBILITY] WAI-ARIA radio group pattern via Radix
// - [FEAT:ACCESSIBILITY] WCAG 2.2 AA compliant touch targets

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { Circle } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Orientation of the radio group */
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const dotSizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.RadioGroup]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn(
      'grid gap-2',
      orientation === 'horizontal' ? 'grid-cols-[repeat(auto-fit,minmax(0,1fr))]' : 'grid-cols-1',
      className
    )}
    orientation={orientation}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

// [TRACE:FUNC=packages.ui.components.RadioGroupItem]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size = 'md', ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-5 w-5 rounded-full border border-primary text-primary ring-offset-background',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary',
      sizeStyles[size],
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className={cn('fill-current text-current', dotSizeStyles[size])} />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
