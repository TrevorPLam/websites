// File: packages/infra/variants/compose.ts  [TRACE:FILE=packages.infra.variants.compose]
// Purpose: Utilities for composing multiple cva() variant functions.
//          Provides composeVariants (merge two cva outputs) and extendVariants
//          (create a new cva with overridden/extended config).
//
// System role: Client-safe — pure TypeScript.
// Assumptions: Consumers use the cva() function from ./cva.ts.
//
// Exports: composeVariants, extendVariants
//
// Invariants:
// - composeVariants output is a new function — original functions are not mutated
// - extendVariants deep-merges variant maps; later values override earlier ones
// - class strings are concatenated, not merged — Tailwind conflicts may occur
//   (use cn from @repo/utils at the component level if deduplication is needed)
//
// Status: @public
// Features:
// - [FEAT:VARIANTS] Variant composition and extension utilities

import type { ClassValue, VariantConfig, CVAFunction } from './types';
import { cva } from './cva';
import { cx } from './utils';

/**
 * Compose two or more cva functions into one.
 * The returned function calls each input function in order and joins their outputs.
 *
 * Use when you want to layer variant systems (e.g., combine a base button variant
 * with an icon-button extension variant).
 *
 * @example
 * const base = cva({ base: 'rounded font-medium', variants: { size: { sm: 'h-8', md: 'h-10' } } });
 * const icon = cva({ base: 'flex items-center justify-center', variants: { size: { sm: 'w-8', md: 'w-10' } } });
 * const iconButton = composeVariants(base, icon);
 * iconButton({ size: 'sm' }); // → 'rounded font-medium h-8 flex items-center justify-center w-8'
 */
export function composeVariants<T extends Record<string, string>>(
  ...fns: CVAFunction<T>[]
): CVAFunction<T> {
  return (props?: Partial<T> & { class?: ClassValue; className?: ClassValue }) => {
    return cx(...fns.map((fn) => fn(props)));
  };
}

/**
 * Extend an existing VariantConfig with additional / overriding options.
 * Returns a new cva function — the original is not modified.
 *
 * Useful for creating themed or context-specific variants without duplicating base config.
 *
 * @example
 * const baseButton = cva({
 *   base: 'rounded font-medium',
 *   variants: { size: { sm: 'h-8', md: 'h-10' } },
 *   defaultVariants: { size: 'md' },
 * });
 *
 * // Ghost variant — inherits size from base, adds intent-specific classes
 * const ghostButton = extendVariants(baseButton, {
 *   base: 'bg-transparent hover:bg-accent',
 *   variants: { size: { lg: 'h-12' } }, // adds lg, keeps sm + md
 * });
 */
export function extendVariants<T extends Record<string, string>>(
  _baseFn: CVAFunction<T>,
  extension: VariantConfig<Partial<T> & Record<string, string>>
): CVAFunction<T & Record<string, string>> {
  // We can't recover the original config from a CVAFunction, so we treat
  // the extension as a standalone config and compose both functions.
  const extFn = cva(extension) as CVAFunction<T>;
  return composeVariants(_baseFn, extFn);
}
