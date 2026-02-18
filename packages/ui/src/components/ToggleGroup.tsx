// File: packages/ui/src/components/ToggleGroup.tsx  [TRACE:FILE=packages.ui.components.ToggleGroup]
// Purpose: Group of toggle buttons with single or multiple selection modes.
//          Built on Radix UI Toggle Group which provides proper ARIA attributes
//          and keyboard navigation for grouped toggles.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for grouped toggle actions. Single mode allows one selection,
//              multiple mode allows multiple selections.
//
// Exports / Entry: ToggleGroup, ToggleGroupItem, ToggleGroupProps
// Used by: Toolbars, filter groups, option groups
//
// Invariants:
// - Radix manages ARIA attributes and keyboard navigation
// - Single mode: only one item can be pressed at a time
// - Multiple mode: multiple items can be pressed simultaneously
//
// Status: @public
// Features:
// - [FEAT:UI] Single and multiple selection modes
// - [FEAT:UI] Size variants (sm, md, lg)
// - [FEAT:UI] Variant styles (default, outline, ghost, destructive)
// - [FEAT:ACCESSIBILITY] WAI-ARIA toggle group pattern via Radix

import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';
import { Toggle, type ToggleVariant, type ToggleSize } from './Toggle';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ToggleGroupProps {
  /** Visual variant */
  variant?: ToggleVariant;
  /** Size variant */
  size?: ToggleSize;
  /** Selection mode */
  type?: 'single' | 'multiple';
  className?: string;
  /** Children */
  children?: React.ReactNode;
  /** Value for single mode */
  value?: string;
  /** Default value for single mode */
  defaultValue?: string;
  /** Callback when value changes (single mode) */
  onValueChange?: (value: string) => void;
  /** Value for multiple mode */
  valueMultiple?: string[];
  /** Default value for multiple mode */
  defaultValueMultiple?: string[];
  /** Callback when value changes (multiple mode) */
  onValueChangeMultiple?: (value: string[]) => void;
  /** Whether disabled */
  disabled?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Loop navigation */
  loop?: boolean;
}

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  /** Visual variant */
  variant?: ToggleVariant;
  /** Size variant */
  size?: ToggleSize;
}

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.ToggleGroup]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant = 'default', size = 'md', type = 'single', ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    type={type}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  />
));
ToggleGroup.displayName = 'ToggleGroup';

export const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    asChild
    {...props}
  >
    <Toggle variant={variant} size={size} className={className} />
  </ToggleGroupPrimitive.Item>
));
ToggleGroupItem.displayName = 'ToggleGroupItem';
