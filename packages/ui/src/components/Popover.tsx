// File: packages/ui/src/components/Popover.tsx  [TRACE:FILE=packages.ui.components.Popover]
// Purpose: Rich interactive overlay for click-triggered floating content. Supports modal and
//          non-modal modes, all 12 side/align positions with collision detection, and optional
//          header/body/footer composition slots. Escape and click-outside dismiss.
//
// Relationship: Depends on radix-ui, @repo/utils (cn), lucide-react (X for close button).
// System role: Interactive overlay primitive (Layer L2 @repo/ui).
// Assumptions: Radix handles portal, collision detection, focus management, and click-outside.
//              For forms requiring full focus trapping use Dialog instead.
//
// Exports / Entry: Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose,
//                  PopoverHeader, PopoverBody, PopoverFooter
// Used by: Color pickers, date pickers, inline forms, user profile cards
//
// Invariants:
// - Click-outside and Escape always close the popover
// - Focus returns to trigger on close
// - PopoverHeader/Body/Footer are purely layout helpers; they do not add ARIA roles
//
// Status: @public
// Features:
// - [FEAT:UI] All 12 side/align position combinations via Radix props
// - [FEAT:UI] Composition slots: PopoverHeader, PopoverBody, PopoverFooter
// - [FEAT:UI] Optional close button in header via PopoverClose
// - [FEAT:ACCESSIBILITY] WAI-ARIA dialog pattern; focus returns on close
// - [FEAT:ANIMATION] Scale + fade open/close with collision-adjusted slide direction

import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Root / Trigger / Anchor / Close ─────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Popover]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Popover = PopoverPrimitive.Root;

// [TRACE:FUNC=packages.ui.components.PopoverTrigger]
export const PopoverTrigger = PopoverPrimitive.Trigger;

// [TRACE:FUNC=packages.ui.components.PopoverAnchor]
export const PopoverAnchor = PopoverPrimitive.Anchor;

// [TRACE:FUNC=packages.ui.components.PopoverClose]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
// NOTE: Raw primitive — style it per context. Use inside PopoverHeader for a top-right ×.
export const PopoverClose = PopoverPrimitive.Close;

// ─── Content ─────────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.PopoverContent]
// [FEAT:UI] [FEAT:ANIMATION] [FEAT:ACCESSIBILITY]
// NOTE: align defaults to "center". sideOffset provides gap between trigger and popover.
export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = 'PopoverContent';

// ─── Composition Slots ────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.PopoverHeader]
// [FEAT:UI]
// NOTE: Provides top spacing and an optional close button. Pass showClose for a × button.
export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

export const PopoverHeader = ({ className, showClose, children, ...props }: PopoverHeaderProps) => (
  <div className={cn('flex items-center justify-between pb-2', className)} {...props}>
    <div className="flex-1">{children}</div>
    {showClose && (
      <PopoverClose
        className={cn(
          'rounded-sm opacity-70 ring-offset-background transition-opacity',
          'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:pointer-events-none'
        )}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </PopoverClose>
    )}
  </div>
);
PopoverHeader.displayName = 'PopoverHeader';

// [TRACE:FUNC=packages.ui.components.PopoverBody]
// [FEAT:UI]
export const PopoverBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('py-1', className)} {...props} />
);
PopoverBody.displayName = 'PopoverBody';

// [TRACE:FUNC=packages.ui.components.PopoverFooter]
// [FEAT:UI]
export const PopoverFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-2 pt-2 border-t border-border mt-2',
        className
      )}
      {...props}
    />
  )
);
PopoverFooter.displayName = 'PopoverFooter';
