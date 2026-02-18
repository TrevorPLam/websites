// File: packages/ui/src/components/Command.tsx  [TRACE:FILE=packages.ui.components.Command]
// Purpose: Command palette with search, keyboard navigation, and actions.
//          Built on cmdk library which provides accessible command palette
//          with keyboard navigation and proper ARIA attributes.
//
// Relationship: Depends on cmdk, @repo/utils (cn), lucide-react.
// System role: Overlay primitive (Layer L2 @repo/ui).
// Assumptions: Used for command interfaces, search, and power user workflows.
//
// Exports / Entry: Command component and sub-components, CommandProps interfaces
// Used by: Admin interfaces, developer tools, search features
//
// Invariants:
// - cmdk manages keyboard navigation, ARIA attributes
// - Basic string matching search (no fuzzy search)
//
// Status: @public
// Features:
// - [FEAT:UI] Command palette with search
// - [FEAT:UI] Keyboard navigation (arrows, enter, escape)
// - [FEAT:ACCESSIBILITY] Full keyboard navigation and ARIA support

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  className?: string;
}
export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}
export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  className?: string;
}
export interface CommandListProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  className?: string;
}
export interface CommandEmptyProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> {
  className?: string;
}
export interface CommandGroupProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {
  className?: string;
}
export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  className?: string;
}
export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface CommandSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> {
  className?: string;
}

// ─── Components ──────────────────────────────────────────────────────────────

export const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

export const CommandDialog = ({ children, open, onOpenChange }: CommandDialogProps) => {
  return (
    <CommandPrimitive.Dialog open={open} onOpenChange={onOpenChange}>
      <div className="overflow-hidden p-0">
        {children}
      </div>
    </CommandPrimitive.Dialog>
  );
};

export const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

export const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

export const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';
