// File: packages/ui/src/components/Collapsible.tsx  [TRACE:FILE=packages.ui.components.Collapsible]
// Purpose: Collapsible content component with smooth expand/collapse animations.
//          Built on Radix UI Collapsible which provides proper ARIA attributes and
//          keyboard navigation support.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Disclosure primitive (Layer L2 @repo/ui).
// Assumptions: Used for expandable sections, accordions, and collapsible content areas.
//
// Exports / Entry: Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleProps
// Used by: Accordions, expandable sections, disclosure widgets
//
// Invariants:
// - Radix manages ARIA expanded state and keyboard navigation
// - CSS transitions handle animations (no JavaScript animation libraries)
// - Respects prefers-reduced-motion for accessibility
//
// Status: @public
// Features:
// - [FEAT:UI] Smooth expand/collapse animations
// - [FEAT:ACCESSIBILITY] WAI-ARIA disclosure pattern via Radix
// - [FEAT:ACCESSIBILITY] Respects prefers-reduced-motion
// - [FEAT:PERFORMANCE] CSS-only animations

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CollapsibleProps extends React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Root
> {}

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Trigger
> {
  /** Show chevron icon */
  showChevron?: boolean;
}

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Collapsible]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Collapsible = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
));
Collapsible.displayName = 'Collapsible';

export const CollapsibleTrigger = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ className, showChevron = true, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&[data-state=open]>svg]:rotate-180',
      className
    )}
    {...props}
  >
    {children}
    {showChevron && (
      <ChevronDown className="h-4 w-4 transition-transform duration-200" aria-hidden="true" />
    )}
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      className
    )}
    {...props}
  />
));
CollapsibleContent.displayName = 'CollapsibleContent';
