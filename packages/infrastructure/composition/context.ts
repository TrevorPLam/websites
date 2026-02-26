'use client';

// File: packages/infra/composition/context.ts  [TRACE:FILE=packages.infra.composition.context]
// Purpose: Typed React context factory with required-context safety.
//          Provides createSafeContext() which throws a descriptive error when
//          a consumer is used outside its provider rather than silently returning undefined.
//
// System role: Client-safe — React context utilities.
// Assumptions: React 19.
//
// Exports: createSafeContext, createOptionalContext, useContextSelector
//
// Invariants:
// - createSafeContext throws if consumer used without provider (development safety)
// - Context display names are set for React DevTools
// - No global state — each call creates an isolated context
//
// Status: @public
// Features:
// - [FEAT:COMPOSITION] Type-safe React context factory

'use client';

import * as React from 'react';

/**
 * Return type of createSafeContext — a tuple of [Provider, useContext hook].
 */
export type SafeContextReturn<T> = [React.Provider<T | null>, () => T];

/**
 * Create a typed React context where consuming the hook outside the provider
 * throws a descriptive error. Prevents silent `undefined` bugs.
 *
 * @param displayName - Name shown in React DevTools and error messages
 * @returns [Provider, useSafeHook] tuple
 *
 * @example
 * const [ThemeProvider, useTheme] = createSafeContext<ThemeValue>('Theme');
 *
 * // Provider
 * <ThemeProvider value={theme}><App /></ThemeProvider>
 *
 * // Consumer (throws if outside ThemeProvider)
 * const theme = useTheme();
 */
export function createSafeContext<T>(displayName: string): SafeContextReturn<T> {
  const Context = React.createContext<T | null>(null);
  Context.displayName = displayName;

  function useSafeContext(): T {
    const value = React.useContext(Context);
    if (value === null) {
      throw new Error(`use${displayName} must be used within a <${displayName}Provider>.`);
    }
    return value;
  }

  return [Context.Provider as React.Provider<T | null>, useSafeContext];
}

/**
 * Create a typed React context where the value may be undefined outside a provider.
 * Use when the context value is genuinely optional.
 *
 * @example
 * const [TooltipProvider, useTooltipContext] = createOptionalContext<TooltipValue>('Tooltip');
 * const ctx = useTooltipContext(); // T | undefined
 */
export function createOptionalContext<T>(
  displayName: string
): [React.Provider<T | undefined>, () => T | undefined] {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = displayName;
  return [Context.Provider, () => React.useContext(Context)];
}

/**
 * Read a single field from a context without subscribing to the full context value.
 * This is a lightweight selector — it still re-renders on every context change
 * unless memoized externally. For true value-level memoization, use a state
 * manager or React's upcoming `use(Context)` selector API.
 *
 * @example
 * const isOpen = useContextSelector(MenuContext, (ctx) => ctx?.isOpen);
 */
export function useContextSelector<T, S>(context: React.Context<T>, selector: (value: T) => S): S {
  const value = React.useContext(context);
  return selector(value);
}
