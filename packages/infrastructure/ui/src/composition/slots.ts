'use client';

/**
 * @file packages/infrastructure/ui/src/composition/slots.ts
 * Tasks: [f-1] Component Composition System, [f-31] Slot System
 *
 * Purpose: Slot-based composition pattern enabling child-component injection
 *          into named slots. Allows parent components to define "holes" that
 *          consumers can fill with any React content.
 *
 * Exports / Entry: Slot, SlotProvider, useSlot, hasSlot
 * Used by: @repo/ui components, @repo/marketing-components, client apps
 *
 * Invariants:
 *   - Standard React patterns only (no custom runtime)
 *   - Slot content is always type-safe via generic constraints
 *   - Missing slots render nothing (not an error)
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlotName = string;

export interface SlotContextValue {
  slots: Map<SlotName, React.ReactNode>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SlotContext = React.createContext<SlotContextValue>({ slots: new Map() });

// ─── Slot definition (consumer side) ─────────────────────────────────────────

export interface SlotProps {
  /** The slot name this content should fill */
  name: SlotName;
  children: React.ReactNode;
}

/**
 * Define content for a named slot. Must be a direct child of a SlotProvider.
 *
 * @example
 * <Card>
 *   <Slot name="header"><h2>My Title</h2></Slot>
 *   <Slot name="body"><p>Content here</p></Slot>
 * </Card>
 */
export function Slot({ name: _name, children }: SlotProps): React.ReactElement | null {
  // Slot itself renders its children; SlotProvider intercepts them.
  // When rendered outside a SlotProvider, Slot just passes through.
  return React.createElement(React.Fragment, null, children);
}

// ─── SlotProvider (host side) ─────────────────────────────────────────────────

export interface SlotProviderProps {
  children: React.ReactNode;
}

/**
 * Intercepts Slot children and distributes them into named buckets.
 * The host component wraps its children in SlotProvider and calls useSlot()
 * to render each slot's content in the right place.
 *
 * @example
 * function Card({ children }: { children: React.ReactNode }) {
 *   return (
 *     <SlotProvider>
 *       {children}
 *       <CardContent />
 *     </SlotProvider>
 *   );
 * }
 *
 * function CardContent() {
 *   const header = useSlot('header');
 *   const body = useSlot('body');
 *   return (
 *     <div>
 *       <div className="card-header">{header}</div>
 *       <div className="card-body">{body}</div>
 *     </div>
 *   );
 * }
 */
export function SlotProvider({ children }: SlotProviderProps): React.ReactElement {
  const slots = React.useMemo(() => {
    const map = new Map<SlotName, React.ReactNode>();
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      // Check if this child is a Slot by looking for the 'name' prop
      const props = child.props as Record<string, unknown>;
      if (typeof props['name'] === 'string' && child.type === Slot) {
        map.set(props['name'], props['children'] as React.ReactNode);
      }
    });
    return map;
  }, [children]);

  return React.createElement(SlotContext.Provider, { value: { slots } }, children);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Retrieve content for a named slot.
 * Returns undefined if the slot was not provided.
 */
export function useSlot(name: SlotName): React.ReactNode {
  const { slots } = React.useContext(SlotContext);
  return slots.get(name);
}

/**
 * Check whether a named slot has been provided.
 * Useful for conditional rendering based on slot presence.
 */
export function hasSlot(name: SlotName, slots: Map<SlotName, React.ReactNode>): boolean {
  return slots.has(name);
}

/**
 * Access the full slots map from the current SlotProvider context.
 */
export function useSlots(): Map<SlotName, React.ReactNode> {
  return React.useContext(SlotContext).slots;
}
