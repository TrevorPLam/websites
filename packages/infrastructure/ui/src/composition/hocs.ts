/**
 * @file packages/infrastructure/ui/src/composition/hocs.ts
 * Tasks: [f-1] Component Composition System, [f-33] Higher-Order Component System
 *
 * Purpose: Higher-order component (HOC) utilities for cross-cutting concerns.
 *          Provides well-typed HOC factories for common patterns: display-name
 *          preservation, ref forwarding, prop injection, and composition.
 *
 * Exports / Entry: withDisplayName, withForwardRef, withDefaults, composeHOCs
 * Used by: @repo/ui components, feature wrappers, layout components
 *
 * Invariants:
 *   - Standard React patterns only; no monkey-patching
 *   - All HOCs preserve the wrapped component's ref and prop types
 *   - HOC display names follow "HOCName(WrappedName)" convention
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type HOC<TIn extends object, TOut extends object = TIn> = (
  Component: React.ComponentType<TIn>
) => React.ComponentType<TOut>;

// ─── Display name utilities ───────────────────────────────────────────────────

/** Get a component's display name for debugging */
export function getDisplayName<P = unknown>(Component: React.ComponentType<P>): string {
  return (Component as { displayName?: string; name?: string }).displayName ?? 
         (Component as { displayName?: string; name?: string }).name ?? 
         'Component';
}

/** Set a display name on a HOC-wrapped component */
export function withDisplayName<P extends object>(
  Component: React.ComponentType<P>,
  hocName: string
): React.ComponentType<P> {
  const Wrapped = Component as React.ComponentType<P> & { displayName?: string };
  Wrapped.displayName = `${hocName}(${getDisplayName(Component)})`;
  return Wrapped;
}

// ─── Default props HOC ────────────────────────────────────────────────────────

/**
 * HOC: inject default prop values. Consumers can still override them.
 * Prefer React default parameters for simple cases; use this for cross-cutting defaults.
 *
 * @example
 * const Button = withDefaults(BaseButton, { variant: 'primary', size: 'medium' });
 */
export function withDefaults<P extends object>(
  Component: React.ComponentType<P>,
  defaults: Partial<P>
): React.ComponentType<P> {
  function WithDefaults(props: P) {
    const merged = { ...defaults, ...props } as P;
    return React.createElement(Component, merged);
  }
  WithDefaults.displayName = `WithDefaults(${getDisplayName(Component)})`;
  return WithDefaults;
}

// ─── Prop injector HOC ────────────────────────────────────────────────────────

/**
 * HOC: inject additional props from outside (e.g. from a context or config).
 * Injected props are merged with consumer props; consumer props win on conflict.
 *
 * @example
 * const TrackingButton = withInjectedProps(Button, { 'data-track': 'click' });
 */
export function withInjectedProps<P extends object, TExtra extends Partial<P>>(
  Component: React.ComponentType<P>,
  injectedProps: TExtra
): React.ComponentType<P> {
  function WithInjectedProps(props: P) {
    const merged = { ...injectedProps, ...props } as P;
    return React.createElement(Component, merged);
  }
  WithInjectedProps.displayName = `WithInjectedProps(${getDisplayName(Component)})`;
  return WithInjectedProps;
}

// ─── Conditional render HOC ───────────────────────────────────────────────────

/**
 * HOC: conditionally render a component based on a predicate.
 * When the predicate returns false, renders null.
 *
 * @example
 * const AdminPanel = withCondition(Panel, () => user.role === 'admin');
 * const FeatureFlag = withCondition(Feature, () => flags.newDashboard);
 */
export function withCondition<P extends object>(
  Component: React.ComponentType<P>,
  predicate: (props: P) => boolean
): React.ComponentType<P> {
  function WithCondition(props: P) {
    if (!predicate(props)) return null;
    return React.createElement(Component, props);
  }
  WithCondition.displayName = `WithCondition(${getDisplayName(Component)})`;
  return WithCondition;
}

// ─── HOC composition ─────────────────────────────────────────────────────────

/**
 * Compose multiple HOCs left-to-right (outermost first).
 * `composeHOCs(withA, withB, withC)(Component)` ≡ `withA(withB(withC(Component)))`
 *
 * @example
 * const EnhancedButton = composeHOCs(
 *   withDefaults({ variant: 'primary' }),
 *   withCondition((p) => !p.hidden),
 * )(Button);
 */
export function composeHOCs<P extends object>(
  ...hocs: Array<(c: React.ComponentType<P>) => React.ComponentType<P>>
): (Component: React.ComponentType<P>) => React.ComponentType<P> {
  return (Component) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), Component);
}

// ─── Ref forwarding HOC ───────────────────────────────────────────────────────

/**
 * HOC: wrap a component that doesn't forward refs so it does.
 * Useful when integrating third-party components that don't use forwardRef.
 *
 * @example
 * const RefForwardingInput = withForwardRef(ThirdPartyInput);
 * <RefForwardingInput ref={myRef} />
 */
export function withForwardRef<P extends object, TRef = HTMLElement>(
  Component: React.ComponentType<P & { innerRef?: React.Ref<TRef> }>
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<TRef>> {
  const WithForwardRef = React.forwardRef<TRef, P>((props, ref) => {
    const componentProps = { ...props, innerRef: ref } as P & { innerRef?: React.Ref<TRef> };
    return React.createElement(Component, componentProps);
  });
  WithForwardRef.displayName = `WithForwardRef(${getDisplayName(Component as React.ComponentType<unknown>)})`;
  return WithForwardRef;
}
