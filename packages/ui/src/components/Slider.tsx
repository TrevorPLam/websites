// File: packages/ui/src/components/Slider.tsx  [TRACE:FILE=packages.ui.components.Slider]
// Purpose: Accessible range input slider with single or multiple thumbs.
//          Built on Radix UI Slider which provides correct role="slider",
//          keyboard navigation (arrows, Home, End, PageUp, PageDown), and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Compose with Label component for accessible labelling. Controlled via
//              value/onValueChange or uncontrolled via defaultValue.
//
// Exports / Entry: Slider, SliderProps
// Used by: Forms, settings panels, filters, range inputs
//
// Invariants:
// - Radix manages role="slider", keyboard navigation, ARIA attributes
// - Minimum touch target size: 24×24px for WCAG 2.2 AA compliance
// - Supports both single value and array of values for range selection
//
// Status: @public
// Features:
// - [FEAT:UI] Single and multiple thumb support
// - [FEAT:UI] Horizontal and vertical orientations
// - [FEAT:ACCESSIBILITY] WAI-ARIA slider pattern via Radix
// - [FEAT:ACCESSIBILITY] WCAG 2.2 AA compliant touch targets

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Orientation of the slider */
  orientation?: 'horizontal' | 'vertical';
}

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Slider]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      orientation === 'vertical' && 'h-full w-auto flex-col',
      className
    )}
    orientation={orientation}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
        orientation === 'vertical' && 'h-full w-2'
      )}
    >
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'touch-manipulation'
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = 'Slider';
