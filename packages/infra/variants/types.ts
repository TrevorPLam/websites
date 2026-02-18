// File: packages/infra/variants/types.ts  [TRACE:FILE=packages.infra.variants.types]
// Purpose: TypeScript type definitions for the variant system.
//          Provides types for variant configurations, composed variants,
//          and the return type of the cva() function.
//
// System role: Type-level contracts — no runtime code.
// Assumptions: Types are consumed by cva.ts, compose.ts, and all call sites.
//
// Exports: VariantProps, VariantConfig, VariantSchema, ClassValue,
//          ComposedVariant, CVAReturn
//
// Invariants:
// - No runtime values exported from this file
// - All generics default to `Record<string, unknown>` for safe inference
//
// Status: @public
// Features:
// - [FEAT:VARIANTS] Type-safe variant system types

/** A single CSS class value — string, undefined, or null (all safely handled). */
export type ClassValue = string | undefined | null | false;

/**
 * A schema entry maps variant option names to their CSS class strings.
 *
 * @example
 * const sizeSchema: VariantSchema = {
 *   sm: 'text-sm px-2 py-1',
 *   md: 'text-base px-4 py-2',
 *   lg: 'text-lg px-6 py-3',
 * };
 */
export type VariantSchema = Record<string, ClassValue>;

/**
 * Full variant configuration object passed to `cva()`.
 *
 * @example
 * const config: VariantConfig<{ size: 'sm' | 'md'; intent: 'primary' | 'danger' }> = {
 *   base: 'rounded font-medium',
 *   variants: {
 *     size: { sm: 'text-sm', md: 'text-base' },
 *     intent: { primary: 'bg-blue-500', danger: 'bg-red-500' },
 *   },
 *   defaultVariants: { size: 'md', intent: 'primary' },
 * };
 */
export interface VariantConfig<T extends Record<string, string>> {
  /** Base CSS classes always applied regardless of variants */
  base?: ClassValue;
  /** Variant name → option name → CSS classes */
  variants?: { [K in keyof T]?: Record<T[K], ClassValue> };
  /**
   * Compound variant overrides — additional classes applied when a specific
   * combination of variants is active.
   */
  compoundVariants?: Array<
    Partial<T> & { class: ClassValue }
  >;
  /** Default variant values used when a variant is not specified by the caller */
  defaultVariants?: Partial<T>;
}

/**
 * The props type inferred from a cva() call.
 * Extracts the variant keys as optional props for a React component.
 *
 * @example
 * const button = cva({ variants: { size: { sm: '...', md: '...' } } });
 * type ButtonVariantProps = VariantProps<typeof button>;
 * // → { size?: 'sm' | 'md' | undefined }
 */
export type VariantProps<T extends (...args: never[]) => string> =
  Parameters<T>[0] extends undefined
    ? Record<string, never>
    : NonNullable<Parameters<T>[0]>;

/**
 * Return type of `cva()` — a function that accepts variant props and returns
 * a merged CSS class string.
 */
export type CVAFunction<T extends Record<string, string>> = (
  props?: Partial<T> & { class?: ClassValue; className?: ClassValue }
) => string;

/**
 * A composed variant created by `composeVariants()`.
 * Applies multiple cva functions in order, last-writer-wins for conflicts.
 */
export type ComposedVariant<T extends Record<string, string>> = CVAFunction<T>;
