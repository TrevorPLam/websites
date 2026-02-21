// File: packages/ui/src/components/NavigationMenu.tsx  [TRACE:FILE=packages.ui.components.NavigationMenu]
// Purpose: Accessible navigation menu with mega menu support.
//          Built on Radix UI Navigation Menu which provides accessible navigation
//          patterns with keyboard support and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn), lucide-react.
// System role: Navigation primitive (Layer L2 @repo/ui).
// Assumptions: Used for site navigation, mega menus, and complex navigation patterns.
//
// Exports / Entry: NavigationMenu component and sub-components, NavigationMenuProps interfaces
// Used by: Site layouts, header components, mega menus
//
// Invariants:
// - Radix manages keyboard navigation, ARIA attributes
// - Supports mega menu patterns
//
// Status: @public
// Features:
// - [FEAT:UI] Accessible navigation menu
// - [FEAT:UI] Mega menu support
// - [FEAT:ACCESSIBILITY] Full keyboard navigation

import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavigationMenuProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Root
> {}
export interface NavigationMenuListProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.List
> {}
export interface NavigationMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Item
> {}
export interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Trigger
> {}
export interface NavigationMenuContentProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Content
> {}
export interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> {}

// ─── Components ──────────────────────────────────────────────────────────────

export const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';
