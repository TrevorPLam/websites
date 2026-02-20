'use client';

/**
 * @file packages/infrastructure/ui/src/composition/render-props.ts
 * Tasks: [f-1] Component Composition System, [f-32] Render Prop System
 *
 * Purpose: Render-prop utilities for inversion-of-control composition.
 *          Allows parent components to delegate rendering to consumers
 *          while retaining state/logic ownership.
 *
 * Exports / Entry: RenderProp type, callRenderProp, mergeRenderProps
 * Used by: @repo/ui components with complex internal state, feature components
 *
 * Invariants:
 *   - Standard React patterns only
 *   - Render props are always optional — provide fallback content
 *   - Works with both ReactNode and render-function signatures
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A render prop: either a static node or a function returning a node */
export type RenderProp<TArg = void> = TArg extends void
  ? React.ReactNode | (() => React.ReactNode)
  : React.ReactNode | ((arg: TArg) => React.ReactNode);

/** Extract the argument type from a RenderProp */
export type RenderPropArg<T> = T extends RenderProp<infer A> ? A : never;

// ─── Core utilities ───────────────────────────────────────────────────────────

/**
 * Resolve a render prop — handles both static ReactNode and render-function forms.
 *
 * @example
 * // Static node
 * callRenderProp(<span>Hello</span>);
 *
 * // Render function with args
 * callRenderProp((isOpen) => isOpen ? <Open /> : <Closed />, isOpen);
 */
export function callRenderProp<T>(renderProp: RenderProp<T> | undefined, arg: T): React.ReactNode {
  if (renderProp === undefined || renderProp === null) return null;
  if (typeof renderProp === 'function') {
    return (renderProp as (arg: T) => React.ReactNode)(arg);
  }
  return renderProp;
}

/**
 * Resolve a no-argument render prop.
 */
export function callRenderPropVoid(
  renderProp: React.ReactNode | (() => React.ReactNode) | undefined
): React.ReactNode {
  if (renderProp === undefined || renderProp === null) return null;
  if (typeof renderProp === 'function') return renderProp();
  return renderProp;
}

/**
 * Merge two render props: if the override is provided, use it; otherwise fall back.
 * This enables "slot override" patterns where consumers can optionally replace
 * a default rendering.
 *
 * @example
 * const renderTrigger = mergeRenderProps(
 *   (isOpen) => <DefaultTrigger open={isOpen} />,   // fallback
 *   props.renderTrigger                             // consumer override
 * );
 */
export function mergeRenderProps<T>(
  fallback: RenderProp<T>,
  override: RenderProp<T> | undefined
): RenderProp<T> {
  return override !== undefined ? override : fallback;
}

// ─── Higher-level patterns ────────────────────────────────────────────────────

/**
 * A component that resolves a render prop in JSX.
 * Useful for render-prop APIs that need to be consumed as components.
 *
 * @example
 * <RenderPropResolver renderProp={props.renderHeader} arg={headerData} />
 */
export function RenderPropResolver<T>({
  renderProp,
  arg,
  fallback,
}: {
  renderProp: RenderProp<T> | undefined;
  arg: T;
  fallback?: React.ReactNode;
}): React.ReactElement | null {
  const resolved = callRenderProp(renderProp, arg) ?? fallback ?? null;
  return resolved as React.ReactElement | null;
}

/**
 * Create a typed render-prop component factory.
 * Returns a component whose `children` prop is a render function.
 *
 * @example
 * const MouseTracker = createRenderPropComponent<{ x: number; y: number }>((props, render) => {
 *   const [pos, setPos] = useState({ x: 0, y: 0 });
 *   return <div onMouseMove={...}>{render(pos)}</div>;
 * });
 *
 * // Usage:
 * <MouseTracker>{({ x, y }) => <p>{x}, {y}</p>}</MouseTracker>
 */
export function createRenderPropComponent<TState>(
  implementation: (
    props: Record<string, unknown>,
    render: (state: TState) => React.ReactNode
  ) => React.ReactElement
) {
  return function RenderPropComponent({
    children,
    ...props
  }: { children: (state: TState) => React.ReactNode } & Record<string, unknown>) {
    return implementation(props, children);
  };
}
