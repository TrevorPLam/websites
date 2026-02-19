/**
 * @file packages/infrastructure/ui/src/composition/provider.ts
 * Tasks: [f-1] Component Composition System, [f-35] Provider System
 *
 * Purpose: Provider composition utilities. Provides a way to stack multiple
 *          React context providers without deep nesting ("Provider Hell"),
 *          plus utilities for creating typed provider components.
 *
 * Exports / Entry: composeProviders, createProvider, ProviderStack
 * Used by: App roots, feature modules, @repo/ui ThemeProvider
 *
 * Invariants:
 *   - Standard React patterns only
 *   - Provider order is preserved (first in list = outermost in tree)
 *   - Each provider's props are individually typed
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnyProvider = React.ComponentType<{ children: React.ReactNode }>;

// ─── Provider composition ─────────────────────────────────────────────────────

/**
 * Compose multiple providers into a single component, avoiding deep nesting.
 * Providers are applied outermost-first (left-to-right).
 *
 * @example
 * const AppProviders = composeProviders(
 *   ThemeProvider,
 *   AuthProvider,
 *   QueryClientProvider,
 * );
 *
 * // Usage:
 * <AppProviders>
 *   <App />
 * </AppProviders>
 */
export function composeProviders(
  ...providers: AnyProvider[]
): React.ComponentType<{ children: React.ReactNode }> {
  function ComposedProviders({ children }: { children: React.ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => React.createElement(Provider, null, acc),
      children as React.ReactElement
    );
  }
  ComposedProviders.displayName = `ComposeProviders(${providers.map((p) => p.displayName ?? p.name).join(', ')})`;
  return ComposedProviders;
}

// ─── Provider stack component ─────────────────────────────────────────────────

export interface ProviderStackProps {
  /** Ordered list of provider components (outermost first) */
  providers: AnyProvider[];
  children: React.ReactNode;
}

/**
 * JSX-friendly alternative to composeProviders. Accepts providers as a prop
 * array rather than requiring a new component to be defined.
 *
 * @example
 * <ProviderStack providers={[ThemeProvider, AuthProvider]}>
 *   <App />
 * </ProviderStack>
 */
export function ProviderStack({ providers, children }: ProviderStackProps): React.ReactElement {
  const composed = providers.reduceRight(
    (acc, Provider) => React.createElement(Provider, null, acc),
    children as React.ReactElement
  );
  return composed;
}

// ─── Typed provider factory ───────────────────────────────────────────────────

/**
 * Create a typed provider component from a React context object.
 * The returned Provider accepts a `value` prop typed to the context's value type.
 *
 * @example
 * const ThemeContext = React.createContext<Theme>(defaultTheme);
 * const ThemeProvider = createProvider(ThemeContext);
 *
 * <ThemeProvider value={myTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function createProvider<T>(
  Context: React.Context<T>
): React.ComponentType<{ value: T; children: React.ReactNode }> {
  function TypedProvider({ value, children }: { value: T; children: React.ReactNode }) {
    return React.createElement(Context.Provider, { value }, children);
  }
  TypedProvider.displayName = `${Context.displayName ?? 'Context'}Provider`;
  return TypedProvider;
}

// ─── Lazy provider ────────────────────────────────────────────────────────────

/**
 * Lazily initialize a provider's value on first render, then memoize it.
 * Useful for providers whose initial value is expensive to compute.
 *
 * @example
 * const ThemeProvider = createLazyProvider(ThemeContext, () => buildTheme(config));
 */
export function createLazyProvider<T>(
  Context: React.Context<T>,
  initializer: () => T
): React.ComponentType<{ children: React.ReactNode }> {
  function LazyProvider({ children }: { children: React.ReactNode }) {
    const value = React.useMemo(initializer, []);
    return React.createElement(Context.Provider, { value }, children);
  }
  LazyProvider.displayName = `Lazy${Context.displayName ?? 'Context'}Provider`;
  return LazyProvider;
}

// ─── Conditional provider ─────────────────────────────────────────────────────

/**
 * Wrap a provider so it only applies when a condition is true.
 * When false, children are rendered without the provider.
 *
 * @example
 * const DevProvider = withConditionalProvider(DebugProvider, () => process.env.NODE_ENV === 'development');
 */
export function withConditionalProvider<P extends { children: React.ReactNode }>(
  Provider: React.ComponentType<P>,
  condition: (props: P) => boolean
): React.ComponentType<P> {
  function ConditionalProvider(props: P) {
    if (!condition(props)) return React.createElement(React.Fragment, null, props.children);
    return React.createElement(Provider, props);
  }
  ConditionalProvider.displayName = `Conditional(${Provider.displayName ?? Provider.name})`;
  return ConditionalProvider;
}
