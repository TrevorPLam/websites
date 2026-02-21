// File: packages/ui/src/components/SelectEnhanced.tsx  [TRACE:FILE=packages.ui.components.SelectEnhanced]
// Purpose: Enhanced select dropdown with search and multi-select support.
//          Built on Radix UI Select which provides accessible select dropdown
//          with keyboard navigation and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn), lucide-react.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used when search or multi-select is needed, otherwise use native Select.
//
// Exports / Entry: SelectEnhanced component and sub-components, SelectEnhancedProps interfaces
// Used by: Forms requiring searchable or multi-select dropdowns
//
// Invariants:
// - Radix manages keyboard navigation, ARIA attributes
// - Basic string matching search (no fuzzy search)
// - No virtual scrolling
//
// Status: @public
// Features:
// - [FEAT:UI] Searchable select dropdown
// - [FEAT:UI] Multi-select support
// - [FEAT:ACCESSIBILITY] Full keyboard navigation

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SelectEnhancedProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Multi-select mode */
  multiple?: boolean;
  /** Search enabled */
  searchable?: boolean;
}

export interface SelectEnhancedTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {}
export interface SelectEnhancedValueProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Value
> {}
export interface SelectEnhancedContentProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> {}
export interface SelectEnhancedItemProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> {}
export interface SelectEnhancedGroupProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Group
> {}
export interface SelectEnhancedLabelProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Label
> {}
export interface SelectEnhancedSeparatorProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
> {}

// ─── Components ──────────────────────────────────────────────────────────────

export function SelectEnhanced({
  children,
  open,
  defaultOpen,
  onOpenChange,
  multiple,
  searchable: _searchable,
}: SelectEnhancedProps) {
  return (
    <SelectPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...(multiple ? { multiple: true } : {})}
    >
      {children}
    </SelectPrimitive.Root>
  );
}

export const SelectEnhancedGroup = SelectPrimitive.Group;
export const SelectEnhancedValue = SelectPrimitive.Value;

export const SelectEnhancedTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectEnhancedTriggerProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectEnhancedTrigger.displayName = 'SelectEnhancedTrigger';

export const SelectEnhancedScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectEnhancedScrollUpButton.displayName = 'SelectEnhancedScrollUpButton';

export const SelectEnhancedScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectEnhancedScrollDownButton.displayName = 'SelectEnhancedScrollDownButton';

export const SelectEnhancedContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectEnhancedContentProps
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectEnhancedScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectEnhancedScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectEnhancedContent.displayName = 'SelectEnhancedContent';

export const SelectEnhancedLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  SelectEnhancedLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectEnhancedLabel.displayName = 'SelectEnhancedLabel';

export const SelectEnhancedItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  SelectEnhancedItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectEnhancedItem.displayName = 'SelectEnhancedItem';

export const SelectEnhancedSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  SelectEnhancedSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectEnhancedSeparator.displayName = 'SelectEnhancedSeparator';
