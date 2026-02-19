/**
 * @file packages/infrastructure/layout/src/grid.ts
 * Task: [F.4] Layout system — CSS Grid utilities and React Grid component
 *
 * Purpose: Type-safe CSS Grid layout component and utility functions.
 *          Uses Tailwind CSS classes — no custom CSS required.
 *          Supports responsive column counts via ResponsiveValue.
 *
 * Exports: Grid, GridItem, GridProps, GridItemProps
 *
 * Invariants:
 * - No inline styles — Tailwind classes only
 * - Grid is a polymorphic component (renders as `div` by default)
 * - Column/row values map to Tailwind grid-cols-* and grid-rows-*
 */

'use client';

import * as React from 'react';
import { cn } from '@repo/utils';
import { colsClass, rowsClass, gapClass, alignClass, justifyItemsClass } from './utils';
import type { AlignItems, GapSize, JustifyItems } from './utils';
import { useResponsiveValue } from './responsive';
import type { ResponsiveValue } from './responsive';

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of columns. Supports responsive values. */
  cols?: ResponsiveValue<number>;
  /** Number of rows. Use for explicitly sized grid templates. */
  rows?: number;
  /** Gap between cells. Semantic or numeric Tailwind value. */
  gap?: GapSize;
  /** Horizontal gap only */
  gapX?: GapSize;
  /** Vertical gap only */
  gapY?: GapSize;
  /** align-items */
  align?: AlignItems;
  /** justify-items */
  justify?: JustifyItems;
  /** Render as a different element */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * A responsive CSS Grid container.
 *
 * @example
 * <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
 *   <GridItem>...</GridItem>
 *   <GridItem>...</GridItem>
 * </Grid>
 */
export function Grid({
  cols,
  rows,
  gap,
  gapX,
  gapY,
  align,
  justify,
  as: As = 'div',
  className,
  children,
  ...rest
}: GridProps) {
  const resolvedCols = useResponsiveValue(cols ?? 1);

  // Build gap classes — gap wins over gapX/gapY if set
  let gapClasses = '';
  if (gap !== undefined) {
    gapClasses = gapClass(gap);
  } else if (gapX !== undefined || gapY !== undefined) {
    const parts: string[] = [];
    if (gapX !== undefined) parts.push(gapClass(gapX).replace('gap-', 'gap-x-'));
    if (gapY !== undefined) parts.push(gapClass(gapY).replace('gap-', 'gap-y-'));
    gapClasses = parts.join(' ');
  }

  return (
    <As
      className={cn(
        'grid',
        colsClass(resolvedCols),
        rows ? rowsClass(rows) : '',
        gapClasses,
        alignClass(align),
        justifyItemsClass(justify),
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

// ─── GridItem ─────────────────────────────────────────────────────────────────

export interface GridItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of columns to span (col-span-*) */
  colSpan?: number | 'full';
  /** Number of rows to span (row-span-*) */
  rowSpan?: number;
  /** Column start position */
  colStart?: number;
  /** Row start position */
  rowStart?: number;
  /** Render as a different element */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * A grid item with optional span and placement props.
 *
 * @example
 * <GridItem colSpan={2}>Wide item</GridItem>
 */
export function GridItem({
  colSpan,
  rowSpan,
  colStart,
  rowStart,
  as: As = 'div',
  className,
  children,
  ...rest
}: GridItemProps) {
  return (
    <As
      className={cn(
        colSpan === 'full'
          ? 'col-span-full'
          : colSpan
            ? `col-span-${colSpan}`
            : '',
        rowSpan ? `row-span-${rowSpan}` : '',
        colStart ? `col-start-${colStart}` : '',
        rowStart ? `row-start-${rowStart}` : '',
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
