'use client';

// File: packages/infra/composition/render-props.ts  [TRACE:FILE=packages.infra.composition.render-props]
// Purpose: Render prop utilities for flexible component composition.
//          Provides helpers for implementing the render prop pattern where a
//          parent passes state down to children via a function.
//
// System role: Client-safe — React.
// Assumptions: React 19. No external dependencies.
//
// Exports: renderProp, useRenderProp, RenderPropFn
//
// Invariants:
// - renderProp is a pure function with no side effects
// - Returns null (not undefined) when render prop is absent, for safe JSX embedding
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Render prop composition utilities

import * as React from 'react';

/**
 * A render prop function — receives state and returns React nodes.
 * The generic `T` represents the state/data passed into the render function.
 */
export type RenderPropFn<T> = (props: T) => React.ReactNode;

/**
 * Resolve a render prop value safely.
 * - If `render` is a function, calls it with `props` and returns the result.
 * - If `render` is a ReactNode (non-function), returns it as-is.
 * - If `render` is undefined/null, returns `null`.
 *
 * @example
 * // In a component:
 * const content = renderProp(children, { isOpen, close });
 * return <div>{content}</div>;
 */
export function renderProp<T>(
  render: RenderPropFn<T> | React.ReactNode | undefined,
  props: T
): React.ReactNode {
  if (render === null || render === undefined) return null;
  if (typeof render === 'function') {
    return (render as RenderPropFn<T>)(props);
  }
  return render as React.ReactNode;
}

/**
 * Hook that memoizes a render prop callback to prevent unnecessary re-renders.
 * Wraps the provided function in useCallback so consumer components don't
 * re-render when the parent renders with a new inline function.
 *
 * @example
 * const renderItem = useRenderProp(
 *   (item: Item) => <ListItem key={item.id} {...item} />,
 *   []
 * );
 */
export function useRenderProp<T>(fn: RenderPropFn<T>, deps: React.DependencyList): RenderPropFn<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(fn, deps);
}
