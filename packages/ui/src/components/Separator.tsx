// File: packages/ui/src/components/Separator.tsx  [TRACE:FILE=packages.ui.components.Separator]
// Purpose: Semantic visual divider between content sections, with horizontal and vertical
//          orientations. Built on Radix UI Separator for correct ARIA role management
//          (role="separator" for functional, role="none" for decorative).
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Layout primitive (Layer L2 @repo/ui).
// Assumptions: Default orientation is horizontal. decorative=true (default) omits the
//              separator from the accessibility tree.
//
// Exports / Entry: Separator, SeparatorProps
// Used by: Card sections, form groups, navigation lists, page sections
//
// Invariants:
// - decorative prop is passed directly to Radix; set to false only when the separator
//   carries semantic meaning (e.g. separating nav regions)
//
// Status: @public
// Features:
// - [FEAT:UI] horizontal | vertical orientation
// - [FEAT:ACCESSIBILITY] Radix manages role="separator" / role="none"

import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Separator]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';
