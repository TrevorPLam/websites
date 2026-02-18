// File: packages/infra/composition/hocs.ts  [TRACE:FILE=packages.infra.composition.hocs]
// Purpose: Higher-order component (HOC) utilities for cross-cutting concerns.
//          Provides withDisplayName, withErrorBoundary, and withConditionalRender.
//
// System role: Client-safe — React.
// Assumptions: React 19.
//
// Exports: withDisplayName, withConditionalRender, withDefaultProps
//
// Invariants:
// - HOCs preserve the wrapped component's displayName for DevTools
// - withConditionalRender renders null (not a placeholder) when condition is false
// - No HOC introduces global state
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Higher-order component utilities

'use client';

import * as React from 'react';

/**
 * Set a React displayName on any component — useful when displayName inference
 * is lost after minification or when wrapping anonymous components.
 *
 * @example
 * const MyList = withDisplayName(memo(({ items }) => <ul>…</ul>), 'MyList');
 */
export function withDisplayName<P>(
  component: React.ComponentType<P>,
  name: string
): React.ComponentType<P> {
  component.displayName = name;
  return component;
}

/**
 * Wrap a component so it renders only when `condition(props)` is true.
 * When false, renders null.
 *
 * @example
 * const AuthenticatedMenu = withConditionalRender(Menu, (props) => props.isLoggedIn);
 *
 * // Usage:
 * <AuthenticatedMenu isLoggedIn={user !== null} />
 * // → renders Menu when isLoggedIn=true; null otherwise
 */
export function withConditionalRender<P extends object>(
  Component: React.ComponentType<P>,
  condition: (props: P) => boolean
): React.ComponentType<P> {
  function ConditionalComponent(props: P) {
    if (!condition(props)) return null;
    return React.createElement(Component, props);
  }
  ConditionalComponent.displayName = `ConditionalRender(${Component.displayName ?? Component.name ?? 'Component'})`;
  return ConditionalComponent;
}

/**
 * Merge default props into a component, overridable by consumers.
 * Prefer TypeScript default parameter values in functional components;
 * use this only when you need to inject defaults into a third-party component.
 *
 * @example
 * const PrimaryButton = withDefaultProps(Button, { variant: 'primary', size: 'md' });
 */
export function withDefaultProps<P extends object>(
  Component: React.ComponentType<P>,
  defaults: Partial<P>
): React.ComponentType<P> {
  function WithDefaultProps(props: P) {
    return React.createElement(Component, { ...defaults, ...props });
  }
  WithDefaultProps.displayName = `WithDefaultProps(${Component.displayName ?? Component.name ?? 'Component'})`;
  return WithDefaultProps;
}
