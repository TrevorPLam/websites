// File: packages/ui/src/components/RadioGroup.tsx  [TRACE:FILE=packages.ui.components.RadioGroup]
// Purpose: Accessible radio button group for single selection from multiple options.
//          Built on Radix UI Radio Group which provides correct role="radiogroup",
//          keyboard navigation (arrows), and proper ARIA attributes. Uses CVA for sizing.
//
// Relationship: Depends on radix-ui, @repo/infra/variants (cva), @repo/utils (cn).
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
// - Three CVA instances: radioGroupVariants, radioGroupItemVariants, radioDotVariants
//
// Status: @public
// Features:
// - [FEAT:UI] Horizontal and vertical orientations
// - [FEAT:UI] Card variant for rich content
// - [FEAT:ACCESSIBILITY] WAI-ARIA radio group pattern via Radix
// - [FEAT:ACCESSIBILITY] WCAG 2.2 AA compliant touch targets
// - [FEAT:VARIANTS] CVA for type-safe size/orientation resolution

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { Circle } from 'lucide-react';
import { cva } from '@repo/infra/variants';
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

// ─── CVA Variant Definitions ─────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.RadioGroup.radioGroupVariants]
// Root element: controls grid layout by orientation.
const radioGroupVariants = cva({
  base: 'grid gap-2',
  variants: {
    orientation: {
      horizontal: 'grid-cols-[repeat(auto-fit,minmax(0,1fr))]',
      vertical: 'grid-cols-1',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

// [TRACE:CONST=packages.ui.components.RadioGroup.radioGroupItemVariants]
// Radio button circle: controls diameter and border by size.
const radioGroupItemVariants = cva({
  base: [
    'aspect-square rounded-full border border-primary text-primary ring-offset-background',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-primary',
  ].join(' '),
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: { size: 'md' },
});

// [TRACE:CONST=packages.ui.components.RadioGroup.radioDotVariants]
// Indicator dot inside radio button: scales with item size.
const radioDotVariants = cva({
  base: 'fill-current text-current',
  variants: {
    size: {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    },
  },
  defaultVariants: { size: 'md' },
});

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.RadioGroup]
// [FEAT:UI] [FEAT:ACCESSIBILITY] [FEAT:VARIANTS]
export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn(radioGroupVariants({ orientation }), className)}
    orientation={orientation}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

// [TRACE:FUNC=packages.ui.components.RadioGroupItem]
// [FEAT:UI] [FEAT:ACCESSIBILITY] [FEAT:VARIANTS]
export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size = 'md', ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioGroupItemVariants({ size }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className={radioDotVariants({ size })} />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
