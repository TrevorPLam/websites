// File: packages/infra/composition/provider.ts  [TRACE:FILE=packages.infra.composition.provider]
// Purpose: Provider composition utilities for wrapping multiple React context providers.
//          Eliminates deeply-nested "provider pyramids" by composing providers into one.
//
// System role: Client-safe — React.
// Assumptions: React 19.
//
// Exports: composeProviders, ProviderComposer
//
// Invariants:
// - Provider order matters — providers are applied outermost-first (left to right)
// - No props are injected into children; each provider wraps the next
// - Works with any Provider component that accepts a `children` prop
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Provider composition to eliminate nesting

'use client';

import * as React from 'react';

export type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>;

/**
 * Compose an array of Provider components into a single wrapper.
 * The first provider in the array is the outermost; the last is innermost.
 *
 * @example
 * const AppProviders = composeProviders([
 *   ThemeProvider,
 *   AuthProvider,
 *   ToastProvider,
 * ]);
 *
 * // Usage:
 * <AppProviders>
 *   <App />
 * </AppProviders>
 */
export function composeProviders(
  providers: ProviderComponent[]
): React.ComponentType<{ children: React.ReactNode }> {
  return function ComposedProviders({ children }) {
    return providers.reduceRight(
      (acc, Provider) => React.createElement(Provider, null, acc),
      children as React.ReactElement
    );
  };
}

/**
 * JSX-friendly provider composer. Pass providers as children using the `providers` prop.
 *
 * @example
 * <ProviderComposer providers={[ThemeProvider, AuthProvider]}>
 *   <App />
 * </ProviderComposer>
 */
export function ProviderComposer({
  providers,
  children,
}: {
  providers: ProviderComponent[];
  children: React.ReactNode;
}): React.ReactElement {
  const ComposedProviders = React.useMemo(
    () => composeProviders(providers),
    // Providers array is unlikely to change; memoize by identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providers]
  );
  return React.createElement(ComposedProviders, null, children);
}
