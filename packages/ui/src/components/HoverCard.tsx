// File: packages/ui/src/components/HoverCard.tsx  [TRACE:FILE=packages.ui.components.HoverCard]
// Purpose: Card that appears on hover with rich content.
//          Built on Radix UI Hover Card which provides accessible hover cards
//          with configurable delays and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Overlay primitive (Layer L2 @repo/ui).
// Assumptions: Used for hover-triggered content, not click-triggered.
//
// Exports / Entry: HoverCard component and sub-components, HoverCardProps interfaces
// Used by: User profiles, product previews, help tooltips
//
// Invariants:
// - Radix manages hover timing, positioning, ARIA attributes
// - Configurable open delay
//
// Status: @public
// Features:
// - [FEAT:UI] Hover-triggered card overlay
// - [FEAT:ACCESSIBILITY] Proper ARIA attributes and keyboard support

import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactNode;
}

export interface HoverCardTriggerProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Trigger
> {}
export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
> {}

// ─── Components ──────────────────────────────────────────────────────────────

export function HoverCard({
  open,
  defaultOpen,
  onOpenChange,
  openDelay,
  closeDelay,
  children,
}: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      {children}
    </HoverCardPrimitive.Root>
  );
}

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = 'HoverCardContent';
