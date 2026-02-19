/**
 * @file packages/infrastructure/layout/src/utils.ts
 * Task: [F.4] Layout system — shared layout utilities
 *
 * Purpose: Utility functions for layout class generation, gap/padding helpers,
 *          and alignment mappings used by Grid and Flex components.
 *
 * Exports: alignClass, justifyClass, gapClass, paddingClass, colsClass
 *
 * Invariants:
 * - All functions are pure (no side effects)
 * - Returns valid Tailwind CSS class strings
 * - Unknown values fall back to empty string (no class added)
 */

// ─── Alignment types ──────────────────────────────────────────────────────────

export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';
export type JustifyItems = 'start' | 'center' | 'end' | 'stretch';

export type GapSize =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | number;

// ─── Class maps ───────────────────────────────────────────────────────────────

const ALIGN_ITEMS_MAP: Record<AlignItems, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_CONTENT_MAP: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  stretch: 'justify-stretch',
};

const JUSTIFY_ITEMS_MAP: Record<JustifyItems, string> = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
};

/** Semantic gap sizes → Tailwind gap classes */
const GAP_MAP: Record<string, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve an `AlignItems` value to a Tailwind class */
export function alignClass(align?: AlignItems): string {
  return align ? (ALIGN_ITEMS_MAP[align] ?? '') : '';
}

/** Resolve a `JustifyContent` value to a Tailwind class */
export function justifyClass(justify?: JustifyContent): string {
  return justify ? (JUSTIFY_CONTENT_MAP[justify] ?? '') : '';
}

/** Resolve a `JustifyItems` value to a Tailwind class */
export function justifyItemsClass(justify?: JustifyItems): string {
  return justify ? (JUSTIFY_ITEMS_MAP[justify] ?? '') : '';
}

/**
 * Resolve a gap size to a Tailwind gap class.
 * Accepts semantic keys ('sm', 'md', etc.) or arbitrary numbers (→ `gap-{n}`).
 */
export function gapClass(gap?: GapSize): string {
  if (gap === undefined) return '';
  if (typeof gap === 'number') return `gap-${gap}`;
  return GAP_MAP[gap] ?? '';
}

/**
 * Build `gap-x-*` and `gap-y-*` classes from separate horizontal/vertical gaps.
 */
export function gapXYClass(gapX?: GapSize, gapY?: GapSize): string {
  const parts: string[] = [];
  if (gapX !== undefined) {
    parts.push(typeof gapX === 'number' ? `gap-x-${gapX}` : (GAP_MAP[gapX]?.replace('gap-', 'gap-x-') ?? ''));
  }
  if (gapY !== undefined) {
    parts.push(typeof gapY === 'number' ? `gap-y-${gapY}` : (GAP_MAP[gapY]?.replace('gap-', 'gap-y-') ?? ''));
  }
  return parts.filter(Boolean).join(' ');
}

/**
 * Resolve a column count to a Tailwind `grid-cols-*` class.
 * Supports 1–12.
 */
export function colsClass(cols?: number): string {
  if (cols === undefined) return '';
  if (cols === 0) return 'grid-cols-none';
  return `grid-cols-${cols}`;
}

/**
 * Resolve a row count to a Tailwind `grid-rows-*` class.
 */
export function rowsClass(rows?: number): string {
  if (!rows) return '';
  return `grid-rows-${rows}`;
}
