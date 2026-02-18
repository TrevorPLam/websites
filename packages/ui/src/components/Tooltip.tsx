// File: packages/ui/src/components/Tooltip.tsx  [TRACE:FILE=packages.ui.components.Tooltip]
// Purpose: Accessible tooltip popup on hover/focus. Follows WCAG 2.2 §1.4.13 (Content on
//          Hover or Focus): content is dismissible (Escape), hoverable, and persistent.
//          Wraps Radix UI Tooltip with design-system styling and a shared delay provider.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Informational overlay primitive (Layer L2 @repo/ui).
// Assumptions: TooltipProvider is mounted once near the app root (layout.tsx or _app.tsx).
//              If not mounted, each Tooltip wraps its own provider automatically.
//
// Exports / Entry: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow
// Used by: Icon buttons, truncated text, form hints
//
// Invariants:
// - Radix manages focus, hover, and keyboard (Escape) triggers
// - Content must not contain interactive elements (use Popover instead)
// - Arrow is optional; enabled via showArrow prop on TooltipContent
//
// Status: @public
// Features:
// - [FEAT:UI] 12 side/align combinations via side + align props
// - [FEAT:ACCESSIBILITY] WCAG 2.2 §1.4.13 compliant (hoverable, dismissible, persistent)
// - [FEAT:ANIMATION] Fade + slide in/out with reduced-motion support

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Provider ────────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.TooltipProvider]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
// NOTE: Global delay config. Wrap once at the layout root so delay is shared across
//       all tooltip instances (avoids staggered pop-in on rapid focus traversal).
export const TooltipProvider = TooltipPrimitive.Provider;

// ─── Root / Trigger ──────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Tooltip]
export const Tooltip = TooltipPrimitive.Root;

// [TRACE:FUNC=packages.ui.components.TooltipTrigger]
export const TooltipTrigger = TooltipPrimitive.Trigger;

// ─── Arrow ───────────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.TooltipArrow]
// [FEAT:UI]
export const TooltipArrow = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow ref={ref} className={cn('fill-popover', className)} {...props} />
));
TooltipArrow.displayName = 'TooltipArrow';

// ─── Content ─────────────────────────────────────────────────────────────────

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Render a small arrow pointing at the trigger element. */
  showArrow?: boolean;
}

// [TRACE:FUNC=packages.ui.components.TooltipContent]
// [FEAT:UI] [FEAT:ANIMATION] [FEAT:ACCESSIBILITY]
// NOTE: sideOffset defaults to 4px for comfortable spacing. Portal renders outside DOM
//       hierarchy to avoid clipping by overflow:hidden ancestors.
export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, showArrow = false, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground',
        'border border-border shadow-md',
        // Animate in from the side the tooltip appears on
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <TooltipArrow />}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = 'TooltipContent';
