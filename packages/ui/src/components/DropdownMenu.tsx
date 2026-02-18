// File: packages/ui/src/components/DropdownMenu.tsx  [TRACE:FILE=packages.ui.components.DropdownMenu]
// Purpose: Accessible dropdown menu primitive with full keyboard semantics, nested submenus,
//          checkbox/radio items, icons, keyboard shortcuts display, and typeahead navigation.
//          Wraps Radix UI DropdownMenu with design-system styling.
//
// Relationship: Depends on radix-ui, @repo/utils (cn), lucide-react (ChevronRight, Check, Circle).
// System role: Navigation/action primitive (Layer L2 @repo/ui).
// Assumptions: Triggered by a focusable element. Radix handles portal, collision detection,
//              typeahead, and focus management.
//
// Exports / Entry: DropdownMenu + all sub-components (full Radix set) + types
// Used by: Header nav, action menus, context actions
//
// Invariants:
// - Radix manages focus trap, typeahead, and ARIA; only styling lives here
// - Sub-menu arrow uses ChevronRight from lucide-react
// - Keyboard shortcut text is decorative (not machine-executable)
//
// Status: @public
// Features:
// - [FEAT:UI] Compact | default | spacious size variants via className
// - [FEAT:UI] Checkbox items, radio items, sub-menus, groups, separators
// - [FEAT:UI] Keyboard shortcut display
// - [FEAT:ACCESSIBILITY] Full WAI-ARIA menubar / menu pattern via Radix
// - [FEAT:ANIMATION] Scale + fade open/close animations

import * as React from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { ChevronRight, Check, Circle } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Root / Trigger / Portal ─────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenu]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const DropdownMenu = DropdownMenuPrimitive.Root;

// [TRACE:FUNC=packages.ui.components.DropdownMenuTrigger]
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// [TRACE:FUNC=packages.ui.components.DropdownMenuGroup]
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// [TRACE:FUNC=packages.ui.components.DropdownMenuPortal]
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// [TRACE:FUNC=packages.ui.components.DropdownMenuSub]
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// [TRACE:FUNC=packages.ui.components.DropdownMenuRadioGroup]
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// ─── Sub-Trigger ─────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuSubTrigger]
// [FEAT:UI]
// NOTE: Renders a right-chevron icon to signal sub-menu expansion.
export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

// ─── Sub-Content ─────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuSubContent]
// [FEAT:UI] [FEAT:ANIMATION]
export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

// ─── Content ─────────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuContent]
// [FEAT:UI] [FEAT:ANIMATION]
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

// ─── Item ─────────────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuItem]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

// ─── Checkbox Item ───────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuCheckboxItem]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
// NOTE: Displays a Check icon in a reserved 16px slot to avoid layout shift on toggle.
export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

// ─── Radio Item ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuRadioItem]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

// ─── Label / Separator / Shortcut ────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DropdownMenuLabel]
// [FEAT:UI]
export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

// [TRACE:FUNC=packages.ui.components.DropdownMenuSeparator]
// [FEAT:UI]
export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// [TRACE:FUNC=packages.ui.components.DropdownMenuShortcut]
// [FEAT:UI]
// NOTE: Purely decorative. Displayed on the trailing end of a menu item.
//       Screen readers receive the item text only; shortcut is aria-hidden.
export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden="true"
    className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
