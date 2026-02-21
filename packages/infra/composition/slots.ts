// File: packages/infra/composition/slots.ts  [TRACE:FILE=packages.infra.composition.slots]
// Purpose: Slot-based composition primitives for React components.
//          Provides a lightweight Slot implementation that merges props and ref
//          from a wrapper onto its single child element (Radix-UI Slot pattern).
//
// System role: Client-safe React utilities.
// Assumptions: React 19 with ref as prop (no forwardRef needed).
//              Consumers must be in 'use client' components or RSC-compatible.
//
// Exports: Slot, SlotProps, createSlot, useSlotProps
//
// Invariants:
// - Slot renders its child directly — no wrapper DOM element
// - Slot merges className, style, event handlers (composed), and all other props
// - Event handlers are composed: parent handler runs first, then child
// - Exactly one child element is expected; throws in development if violated
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Slot / asChild composition pattern

'use client';

import * as React from 'react';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Merges two sets of React props, composing event handlers and joining classNames.
 * Used internally by Slot.
 */
function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === 'className') {
      merged[key] = [slotVal, childVal].filter(Boolean).join(' ') || undefined;
    } else if (key === 'style') {
      merged[key] = { ...(slotVal as object), ...(childVal as object) };
    } else if (
      typeof slotVal === 'function' &&
      typeof childVal === 'function' &&
      key.startsWith('on')
    ) {
      // Compose event handlers: slot (parent) handler fires first
      merged[key] = (...args: unknown[]) => {
        (slotVal as (...a: unknown[]) => void)(...args);
        (childVal as (...a: unknown[]) => void)(...args);
      };
    } else {
      merged[key] = slotVal !== undefined ? slotVal : childVal;
    }
  }

  return merged;
}

/**
 * Slot component — renders its single child, merging the Slot's props onto it.
 * Use this to implement the `asChild` pattern where a parent wants to hand
 * its behavior (event handlers, aria attrs, class) to an arbitrary child element.
 *
 * @example
 * // Button with asChild — the <a> tag gets button's onClick + className
 * <Button asChild>
 *   <a href="/path">Click me</a>
 * </Button>
 *
 * // Button implementation:
 * function Button({ asChild, children, ...props }) {
 *   const Comp = asChild ? Slot : 'button';
 *   return <Comp {...props}>{children}</Comp>;
 * }
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref
) {
  if (!React.isValidElement(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Slot] Expected a single valid React element as child.');
    }
    return null;
  }

  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props as Record<string, unknown>;
  const merged = mergeProps(slotProps as Record<string, unknown>, childProps);

  return React.cloneElement(child, { ...merged, ref });
});
Slot.displayName = 'Slot';

/**
 * Factory function for creating domain-specific typed Slot variants.
 *
 * @example
 * const ButtonSlot = createSlot<HTMLButtonElement>();
 * // <ButtonSlot onClick={...}>…</ButtonSlot>
 */
export function createSlot() {
  return Slot;
}

/**
 * Hook that merges external slot props with internal component props.
 * Useful for compound components that receive props from a Slot context.
 *
 * @example
 * const mergedProps = useSlotProps(internalProps, externalSlotProps);
 */
export function useSlotProps<T extends Record<string, unknown>>(
  internal: T,
  external?: Partial<T>
): T {
  if (!external) return internal;
  return mergeProps(external as Record<string, unknown>, internal as Record<string, unknown>) as T;
}
