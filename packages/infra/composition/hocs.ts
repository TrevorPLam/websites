// File: packages/infra/composition/hocs.ts  [TRACE:FILE=packages.infra.composition.hocs]
// Purpose: Higher-order component (HOC) utilities for cross-cutting concerns.
//          Provides withDisplayName, withErrorBoundary, withConditionalRender, withDefaultProps.
//
// System role: Client-safe — React.
// Assumptions: React 19.
//
// Exports: withDisplayName, withErrorBoundary, withConditionalRender, withDefaultProps
//
// Invariants:
// - HOCs preserve the wrapped component's displayName for DevTools
// - withErrorBoundary uses class ErrorBoundary; componentDidCatch calls logError from @repo/infra/client
// - withConditionalRender renders null (not a placeholder) when condition is false
// - No HOC introduces global state
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Higher-order component utilities

'use client';

import * as React from 'react';
import { logError } from '../logger/client';

export type ErrorBoundaryFallback =
  | React.ReactNode
  | ((error: Error, reset: () => void) => React.ReactNode);

interface ErrorBoundaryState {
  error: Error | null;
}

interface ErrorBoundaryProps {
  fallback?: ErrorBoundaryFallback;
  children: React.ReactNode;
}

/**
 * Inner class component for error boundary — required for componentDidCatch.
 * Logs errors via logError (Sentry) and renders fallback or default message.
 */
class ErrorBoundaryInner extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logError('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      if (fallback !== undefined && fallback !== null) {
        return fallback;
      }
      return React.createElement(
        'div',
        { role: 'alert' },
        'Something went wrong. ',
        React.createElement('button', { onClick: this.reset }, 'Try again')
      );
    }
    return children;
  }
}

/**
 * Wrap a component in an error boundary. On error, logs via logError (Sentry)
 * and renders an optional fallback or a default "Something went wrong" message with reset.
 *
 * @example
 * const SafeWidget = withErrorBoundary(Widget);
 * const SafeWidgetWithFallback = withErrorBoundary(Widget, (err, reset) => <div>Error: {err.message} <button onClick={reset}>Retry</button></div>);
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ErrorBoundaryFallback
): React.ComponentType<P> {
  function WithErrorBoundary(props: P) {
    return React.createElement(ErrorBoundaryInner, {
      fallback,
      children: React.createElement(Component, props),
    });
  }
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName ?? Component.name ?? 'Component'})`;
  return WithErrorBoundary;
}

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
