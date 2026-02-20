'use client';

/**
 * @file packages/infrastructure/ui/src/composition/context.ts
 * Tasks: [f-1] Component Composition System, [f-34] Context System
 *
 * Purpose: Type-safe React Context factory utilities. Provides createStrictContext
 *          (throws when used outside provider) and createOptionalContext (returns
 *          undefined when outside provider). Eliminates boilerplate and enforces
 *          consistent context usage patterns.
 *
 * Exports / Entry: createStrictContext, createOptionalContext, createContextWithDefault
 * Used by: All @repo packages that need shared state, @repo/ui component primitives
 *
 * Invariants:
 *   - Standard React Context only; no third-party state library
 *   - Strict contexts always throw a clear error when misused
 *   - Context display names are always set for DevTools
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Strict context (throws if no provider) ───────────────────────────────────

/**
 * Create a strictly-typed React context that throws a clear error when consumed
 * outside its provider. This is the preferred pattern for required context.
 *
 * Returns [Provider, useContext] tuple.
 *
 * @example
 * const [ThemeProvider, useTheme] = createStrictContext<Theme>('ThemeContext');
 *
 * function ThemeProvider({ value, children }) {
 *   return <ThemeProvider value={value}>{children}</ThemeProvider>;
 * }
 *
 * function MyComponent() {
 *   const theme = useTheme(); // throws if not inside <ThemeProvider>
 * }
 */
export function createStrictContext<T>(displayName: string): [React.Context<T | null>, () => T] {
  const Ctx = React.createContext<T | null>(null);
  Ctx.displayName = displayName;

  function useStrictContext(): T {
    const value = React.useContext(Ctx);
    if (value === null) {
      throw new Error(
        `[${displayName}] useContext must be called within a matching Provider. ` +
          `Did you forget to wrap your component tree?`
      );
    }
    return value;
  }

  return [Ctx, useStrictContext];
}

// ─── Optional context (returns undefined if no provider) ─────────────────────

/**
 * Create an optional React context that returns undefined when consumed outside
 * its provider. Use for optional feature contexts (e.g. animation preferences).
 *
 * Returns [Provider, useContext] tuple.
 *
 * @example
 * const [AnimationProvider, useAnimation] = createOptionalContext<AnimationConfig>('AnimationContext');
 * const config = useAnimation(); // undefined if no provider
 */
export function createOptionalContext<T>(
  displayName: string
): [React.Context<T | undefined>, () => T | undefined] {
  const Ctx = React.createContext<T | undefined>(undefined);
  Ctx.displayName = displayName;

  function useOptionalContext(): T | undefined {
    return React.useContext(Ctx);
  }

  return [Ctx, useOptionalContext];
}

// ─── Context with default value ───────────────────────────────────────────────

/**
 * Create a React context with a default value. The default is used when no
 * provider is present — suitable for progressive enhancement contexts.
 *
 * Returns [Provider, useContext] tuple.
 *
 * @example
 * const [SizeProvider, useSize] = createContextWithDefault<'sm' | 'md' | 'lg'>('SizeContext', 'md');
 */
export function createContextWithDefault<T>(
  displayName: string,
  defaultValue: T
): [React.Context<T>, () => T] {
  const Ctx = React.createContext<T>(defaultValue);
  Ctx.displayName = displayName;

  function useContextWithDefault(): T {
    return React.useContext(Ctx);
  }

  return [Ctx, useContextWithDefault];
}

// ─── Selector hook factory ────────────────────────────────────────────────────

/**
 * Create a selector hook for a context. The selector runs only when the selected
 * slice changes (reference equality), reducing unnecessary re-renders.
 *
 * @example
 * const [ThemeCtx, useTheme] = createStrictContext<Theme>('ThemeContext');
 * const useThemeColor = createContextSelector(useTheme, (theme) => theme.colors.primary);
 */
export function createContextSelector<T, S>(useCtx: () => T, selector: (value: T) => S): () => S {
  return function useContextSelector(): S {
    const value = useCtx();
    return React.useMemo(() => selector(value), [value]);
  };
}

// ─── Compound context helper ──────────────────────────────────────────────────

/**
 * Merge multiple contexts into a single compound context value.
 * Useful for components that need to access several related contexts at once.
 *
 * @example
 * const useFormContext = createCompoundContext(useFormState, useFormActions);
 * const { values, submit } = useFormContext();
 */
export function createCompoundContext<T extends object[]>(
  ...hooks: { [K in keyof T]: () => T[K] }
): () => { [K in keyof T]: T[K] } {
  return function useCompoundContext() {
    return hooks.map((hook) => hook()) as unknown as { [K in keyof T]: T[K] };
  };
}
