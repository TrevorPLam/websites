/**
 * @file packages/infrastructure/layout/src/flexbox.ts
 * Task: [F.4] Layout system — Flexbox layout components
 *
 * Purpose: Type-safe Flex and Stack components built on CSS Flexbox.
 *          Uses Tailwind CSS classes — no custom CSS required.
 *          Stack is an opinionated single-axis Flex (column by default).
 *
 * Exports: Flex, Stack, FlexProps, StackProps
 *
 * Invariants:
 * - No inline styles — Tailwind classes only
 * - Both are polymorphic (as prop for element override)
 * - `Stack` always defaults to flex-col direction
 */

'use client';

import * as React from 'react';
import { cn } from '@repo/utils';
import { alignClass, justifyClass, gapClass } from './utils';
import type { AlignItems, JustifyContent, GapSize } from './utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

const DIRECTION_MAP: Record<FlexDirection, string> = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const WRAP_MAP: Record<FlexWrap, string> = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

// ─── Flex ─────────────────────────────────────────────────────────────────────

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  /** flex-direction (default: 'row') */
  direction?: FlexDirection;
  /** flex-wrap */
  wrap?: FlexWrap;
  /** align-items */
  align?: AlignItems;
  /** justify-content */
  justify?: JustifyContent;
  /** Gap between children */
  gap?: GapSize;
  /** Whether children should grow to fill (flex: 1 on children) */
  fill?: boolean;
  /** Render as a different element */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * A flexible flexbox container with typed alignment props.
 *
 * @example
 * <Flex direction="row" justify="between" align="center" gap="md">
 *   <span>Left</span>
 *   <span>Right</span>
 * </Flex>
 */
export function Flex({
  direction = 'row',
  wrap,
  align,
  justify,
  gap,
  fill = false,
  as: As = 'div',
  className,
  children,
  ...rest
}: FlexProps) {
  return (
    <As
      className={cn(
        'flex',
        DIRECTION_MAP[direction],
        wrap ? WRAP_MAP[wrap] : '',
        alignClass(align),
        justifyClass(justify),
        gapClass(gap),
        fill ? '[&>*]:flex-1' : '',
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Stack direction (default: 'col' for vertical stacking) */
  direction?: 'col' | 'row';
  /** align-items */
  align?: AlignItems;
  /** justify-content */
  justify?: JustifyContent;
  /** Gap between stacked children */
  gap?: GapSize;
  /** Render as a different element */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * An opinionated single-axis flex container (defaults to column).
 * Ideal for vertical/horizontal stacking with consistent spacing.
 *
 * @example
 * <Stack gap="md">
 *   <Card />
 *   <Card />
 * </Stack>
 */
export function Stack({
  direction = 'col',
  align,
  justify,
  gap = 'md',
  as: As = 'div',
  className,
  children,
  ...rest
}: StackProps) {
  return (
    <As
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        alignClass(align),
        justifyClass(justify),
        gapClass(gap),
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

// ─── Spacer ───────────────────────────────────────────────────────────────────

/**
 * A flexible spacer that fills available space inside a Flex/Stack.
 * Drop it between children to push siblings apart.
 *
 * @example
 * <Flex>
 *   <Logo />
 *   <Spacer />
 *   <NavLinks />
 * </Flex>
 */
export function Spacer({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1', className)} aria-hidden="true" {...rest} />;
}
