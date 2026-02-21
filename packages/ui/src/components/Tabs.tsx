'use client';

// File: packages/ui/src/components/Tabs.tsx  [TRACE:FILE=packages.ui.components.Tabs]
// Purpose: Accessible tabbed-content primitive with multiple visual variants, sizes,
//          and orientations. Built on Radix UI Tabs for correct keyboard navigation and
//          ARIA roles (tablist / tab / tabpanel).
//
// Relationship: Depends on radix-ui, @repo/infra/variants (cva), @repo/utils (cn).
// System role: Disclosure primitive (Layer L2 @repo/ui).
// Assumptions: Consumers control active tab via value/onValueChange or use defaultValue
//              for uncontrolled usage.
//
// Exports / Entry: Tabs, TabsList, TabsTrigger, TabsContent + types
// Used by: @repo/features, marketing-components, client pages
//
// Invariants:
// - Radix manages roving focus and ARIA; only style overrides live here
// - variant and size apply only to TabsList / TabsTrigger, not TabsContent
// - CVA resolves all variant/size combinations at call-site with full type safety
//
// Status: @public
// Features:
// - [FEAT:UI] 5 visual variants: default | underline | pills | enclosed | soft
// - [FEAT:UI] 4 sizes: sm | md | lg | xl
// - [FEAT:UI] horizontal | vertical orientations via Radix orientation prop
// - [FEAT:ACCESSIBILITY] Full keyboard navigation, WAI-ARIA tablist pattern

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cva } from '@repo/infra/variants';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TabsVariant = 'default' | 'underline' | 'pills' | 'enclosed' | 'soft';
export type TabsSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: TabsVariant;
  size?: TabsSize;
}

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
  size?: TabsSize;
}

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  variant?: TabsVariant;
  size?: TabsSize;
}

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

// ─── CVA Variant Definitions ──────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Tabs.tabsListVariants]
const tabsListVariants = cva({
  base: 'inline-flex items-center',
  variants: {
    variant: {
      default: 'justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      underline: 'justify-start border-b border-border gap-0 bg-transparent',
      pills: 'justify-start gap-1 bg-transparent',
      enclosed:
        'justify-start rounded-t-lg border border-b-0 border-border bg-muted/40 px-1 pt-1 gap-0',
      soft: 'justify-start gap-1 bg-muted/30 rounded-lg p-1',
    },
  },
  defaultVariants: { variant: 'default' },
});

// [TRACE:CONST=packages.ui.components.Tabs.tabsTriggerVariants]
// Combined variant + size resolver for TabsTrigger.
const tabsTriggerVariants = cva({
  base: [
    'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  variants: {
    variant: {
      default: [
        'rounded-md ring-offset-background',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      ].join(' '),
      underline: [
        'border-b-2 border-transparent -mb-px',
        'data-[state=active]:border-primary data-[state=active]:text-foreground',
        'hover:text-foreground text-muted-foreground',
      ].join(' '),
      pills: [
        'rounded-full',
        'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        'hover:bg-muted text-muted-foreground',
      ].join(' '),
      enclosed: [
        'rounded-t-md border border-b-0',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border',
        'data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground',
        'hover:text-foreground',
      ].join(' '),
      soft: [
        'rounded-md',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        'hover:bg-muted/60 text-muted-foreground',
      ].join(' '),
    },
    size: {
      sm: 'h-7 px-2.5 text-xs',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4 text-sm',
      xl: 'h-11 px-5 text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

// ─── Context ─────────────────────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Tabs.TabsContext]
// NOTE: Passes variant/size down to TabsList and TabsTrigger without prop-drilling.
const TabsContext = React.createContext<{ variant: TabsVariant; size: TabsSize }>({
  variant: 'default',
  size: 'md',
});

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Tabs]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Tabs = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <TabsContext.Provider value={{ variant, size }}>
      <TabsPrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
    </TabsContext.Provider>
  )
);
Tabs.displayName = 'Tabs';

// [TRACE:FUNC=packages.ui.components.TabsList]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant: variantProp, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant: variantProp ?? ctx.variant }), className)}
      {...props}
    />
  );
});
TabsList.displayName = 'TabsList';

// [TRACE:FUNC=packages.ui.components.TabsTrigger]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant: variantProp, size: sizeProp, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsTriggerVariants({ variant: variantProp ?? ctx.variant, size: sizeProp ?? ctx.size }),
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

// [TRACE:FUNC=packages.ui.components.TabsContent]
// [FEAT:UI]
export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
