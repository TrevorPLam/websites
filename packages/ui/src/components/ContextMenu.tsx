// File: packages/ui/src/components/ContextMenu.tsx  [TRACE:FILE=packages.ui.components.ContextMenu]
// Purpose: Right-click context menu with nested submenus.
//          Built on Radix UI Context Menu which provides accessible context menus
//          with keyboard support and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn), lucide-react.
// System role: Overlay primitive (Layer L2 @repo/ui).
// Assumptions: Used for right-click interactions, not hover-triggered menus.
//
// Exports / Entry: ContextMenu component and sub-components, ContextMenuProps interfaces
// Used by: Table interactions, file managers, admin interfaces
//
// Invariants:
// - Radix manages focus trap, keyboard navigation, ARIA attributes
// - Supports nested submenus
// - Right-click trigger only
//
// Status: @public
// Features:
// - [FEAT:UI] Right-click context menu
// - [FEAT:UI] Nested submenus support
// - [FEAT:ACCESSIBILITY] Full WAI-ARIA compliance with keyboard navigation

import * as React from 'react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ContextMenuProps {
  children: React.ReactNode;
}

export interface ContextMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger> {}
export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {}
export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  inset?: boolean;
}
export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> {}
export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> {}
export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
  inset?: boolean;
}
export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}
export interface ContextMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface ContextMenuSubProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub> {}
export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {}
export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

// ─── Components ──────────────────────────────────────────────────────────────

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export interface ContextMenuSubTriggerPropsWithInset
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

export const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerPropsWithInset
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = 'ContextMenuSubContent';

export const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)}
    {...props}
  />
));
ContextMenuLabel.displayName = 'ContextMenuLabel';

export const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';
