'use client';

/**
 * @file packages/infrastructure/ui/src/customization/hooks.ts
 * Task: [f-3] Customization Hook System
 *
 * Purpose: React hooks for runtime component customization. Enables consumers to
 *          override component styles, props, and behavior without forking.
 *          Uses standard React hooks only — no custom hook engine.
 *
 * Exports / Entry: useCustomization, useStyleOverride, useComponentConfig
 * Used by: @repo/ui component internals, @repo/marketing-components, client apps
 *
 * Invariants:
 *   - Standard React hooks only; no custom hook engine
 *   - Overrides are applied on top of defaults, never replacing them entirely
 *   - All hooks are pure and stable (memoized correctly)
 *
 * Status: @public
 */

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A map of class name additions/overrides keyed by component slot name */
export type ClassNameOverrides = Record<string, string>;

/** A map of CSS custom property values keyed by var name (without "--") */
export type CSSVariableOverrides = Record<string, string>;

/** A map of arbitrary prop overrides keyed by component name */
export type PropOverrides<P = Record<string, unknown>> = Partial<P>;

export interface ComponentCustomization<P = Record<string, unknown>> {
  /** Override CSS class names for specific component slots */
  classNames?: ClassNameOverrides;
  /** Override CSS custom properties */
  cssVars?: CSSVariableOverrides;
  /** Override specific props */
  props?: PropOverrides<P>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CustomizationContext = React.createContext<Map<string, ComponentCustomization>>(new Map());
CustomizationContext.displayName = 'CustomizationContext';

export interface CustomizationProviderProps {
  /** Map of component name → customization overrides */
  customizations: Record<string, ComponentCustomization>;
  children: React.ReactNode;
}

/**
 * Provide customization overrides to a subtree.
 * Override maps are merged (consumer overrides win on conflict).
 *
 * @example
 * <CustomizationProvider customizations={{
 *   Button: { classNames: { root: 'my-btn' }, props: { variant: 'outline' } },
 *   Hero: { cssVars: { 'hero-bg': '220 14% 96%' } },
 * }}>
 *   <App />
 * </CustomizationProvider>
 */
export function CustomizationProvider({
  customizations,
  children,
}: CustomizationProviderProps): React.ReactElement {
  const map = React.useMemo(() => new Map(Object.entries(customizations)), [customizations]);
  return React.createElement(CustomizationContext.Provider, { value: map }, children);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Retrieve customization overrides for a specific component.
 * Returns an empty object if no customizations are provided.
 *
 * @param componentName - The component's identifier (e.g. 'Button', 'HeroSplit')
 *
 * @example
 * function Button({ variant, className, ...props }: ButtonProps) {
 *   const custom = useCustomization('Button');
 *   const mergedVariant = custom.props?.variant ?? variant;
 *   const mergedClass = cn(className, custom.classNames?.root);
 * }
 */
export function useCustomization<P = Record<string, unknown>>(
  componentName: string
): ComponentCustomization<P> {
  const map = React.useContext(CustomizationContext);
  return (map.get(componentName) ?? {}) as ComponentCustomization<P>;
}

/**
 * Get merged className for a specific component slot.
 * The consumer's className override is appended to the base class.
 *
 * @param componentName - Component identifier
 * @param slot - Slot name within the component (e.g. 'root', 'label', 'icon')
 * @param baseClass - The component's own class (from Tailwind/CVA)
 *
 * @example
 * const rootClass = useStyleOverride('Button', 'root', 'btn btn-primary');
 * // Returns "btn btn-primary" + consumer's override if any
 */
export function useStyleOverride(componentName: string, slot: string, baseClass?: string): string {
  const { classNames } = useCustomization(componentName);
  const override = classNames?.[slot];
  if (!override) return baseClass ?? '';
  return [baseClass, override].filter(Boolean).join(' ');
}

/**
 * Get merged prop overrides for a component.
 * Consumer overrides win over component defaults, but explicit props win over both.
 *
 * @param componentName - Component identifier
 * @param defaults - Component's own default prop values
 *
 * @example
 * const { variant, size } = useComponentConfig('Button', { variant: 'primary', size: 'md' });
 */
export function useComponentConfig<P extends object>(
  componentName: string,
  defaults: Partial<P>
): Partial<P> {
  const { props } = useCustomization<P>(componentName);
  return React.useMemo(() => ({ ...defaults, ...props }), [defaults, props]);
}

/**
 * Get CSS variable overrides as a style object.
 * Useful for injecting CSS custom properties onto a root element.
 *
 * @example
 * const style = useCSSVarOverrides('HeroSection');
 * // { '--hero-bg': '220 14% 96%', '--hero-height': '80vh' }
 * return <section style={style} />;
 */
export function useCSSVarOverrides(componentName: string): React.CSSProperties {
  const { cssVars } = useCustomization(componentName);
  return React.useMemo(() => {
    if (!cssVars) return {};
    return Object.fromEntries(
      Object.entries(cssVars).map(([key, value]) => [`--${key}`, value])
    ) as React.CSSProperties;
  }, [cssVars]);
}
