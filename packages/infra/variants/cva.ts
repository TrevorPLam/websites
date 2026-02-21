// File: packages/infra/variants/cva.ts  [TRACE:FILE=packages.infra.variants.cva]
// Purpose: Core `cva()` (class-variance-authority-compatible) function.
//          Produces a typed variant resolver that merges base + variant + compound
//          classes into a single CSS class string.
//
// System role: Client-safe — pure TypeScript, no DOM or React imports.
// Assumptions: Callers use Tailwind CSS; class strings are space-separated.
//
// Exports: cva
//
// Invariants:
// - cva() is pure — no side effects, no global state
// - Compound variants are evaluated after individual variants
// - `class` and `className` props are appended last (caller overrides win)
// - undefined / null / false class values are ignored
//
// Status: @public
// Features:
// - [FEAT:VARIANTS] CVA-compatible variant resolver

import type { ClassValue, VariantConfig, CVAFunction } from './types';
import { cx } from './utils';

/**
 * Create a type-safe variant resolver.
 *
 * Mirrors the `class-variance-authority` (CVA) API so this implementation
 * is a drop-in replacement when CVA is not available in the project.
 *
 * @example
 * const button = cva({
 *   base: 'inline-flex items-center rounded font-semibold transition-colors',
 *   variants: {
 *     intent: {
 *       primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
 *       secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
 *       outline: 'border border-border bg-transparent hover:bg-accent',
 *     },
 *     size: {
 *       sm: 'h-8 px-3 text-sm',
 *       md: 'h-10 px-4 text-base',
 *       lg: 'h-12 px-6 text-lg',
 *     },
 *   },
 *   compoundVariants: [
 *     { intent: 'outline', size: 'lg', class: 'border-2' },
 *   ],
 *   defaultVariants: { intent: 'primary', size: 'md' },
 * });
 *
 * button({ intent: 'outline', size: 'sm' });
 * // → 'inline-flex items-center … border border-border bg-transparent … h-8 px-3 text-sm'
 */
export function cva<T extends Record<string, string>>(config: VariantConfig<T>): CVAFunction<T> {
  const { base, variants = {}, compoundVariants = [], defaultVariants = {} } = config;

  return function resolveVariants(
    props?: Partial<T> & { class?: ClassValue; className?: ClassValue }
  ): string {
    const classes: ClassValue[] = [base];

    // Merge defaultVariants with caller props
    const resolved = { ...defaultVariants, ...props } as Partial<T>;

    // Individual variant classes
    for (const [variantKey, optionMap] of Object.entries(variants)) {
      const selectedOption = resolved[variantKey as keyof T];
      if (selectedOption !== undefined && optionMap) {
        const cls = (optionMap as Record<string, ClassValue>)[selectedOption as string];
        classes.push(cls);
      }
    }

    // Compound variant classes
    for (const compound of compoundVariants) {
      const { class: compoundClass, ...conditions } = compound as {
        class: ClassValue;
      } & Partial<T>;
      const matches = Object.entries(conditions).every(([k, v]) => resolved[k as keyof T] === v);
      if (matches) classes.push(compoundClass);
    }

    // Caller className / class overrides (appended last — highest specificity intent)
    if (props?.class) classes.push(props.class);
    if (props?.className) classes.push(props.className);

    return cx(...classes);
  };
}
