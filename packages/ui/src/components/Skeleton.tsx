// File: packages/ui/src/components/Skeleton.tsx  [TRACE:FILE=packages.ui.components.Skeleton]
// Purpose: Loading placeholder with shimmer animation. Signals to users that content is
//          in-flight, reducing perceived load time. CSS-only — no JS state or Radix.
//
// Relationship: Depends on @repo/utils (cn). No external primitive.
// System role: Loading state primitive (Layer L2 @repo/ui).
// Assumptions: Width and height must be supplied by the consumer (either via className,
//              style, or the width/height props) to match the target content shape.
//
// Exports / Entry: Skeleton, SkeletonProps
// Used by: Any component that fetches remote data (cards, avatars, text blocks)
//
// Invariants:
// - Animation runs continuously while rendered; unmount to stop
// - prefers-reduced-motion disables the shimmer (component remains as static block)
// - variant='circular' implies rounded-full; variant='rectangular' removes rounding
//
// Status: @public
// Features:
// - [FEAT:UI] 3 variants: text | circular | rectangular
// - [FEAT:UI] Configurable width/height via props or className
// - [FEAT:ANIMATION] CSS shimmer; disabled when prefers-reduced-motion is set

import * as React from 'react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  /** Explicit width (CSS value or number → px). Overridden by className w-* if both set. */
  width?: string | number;
  /** Explicit height (CSS value or number → px). Overridden by className h-* if both set. */
  height?: string | number;
  /** Set to false to render a static (non-animated) placeholder. */
  animate?: boolean;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Skeleton.variantStyles]
const variantStyles: Record<SkeletonVariant, string> = {
  text: 'rounded-md h-4',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
};

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Skeleton]
// [FEAT:UI] [FEAT:ANIMATION]
export const Skeleton = ({
  className,
  variant = 'text',
  width,
  height,
  animate = true,
  style,
  ...props
}: SkeletonProps) => {
  const hasWidthClass = typeof className === 'string' && /\bw-/.test(className);
  const hasHeightClass = typeof className === 'string' && /\bh-/.test(className);

  const inlineStyle: React.CSSProperties = {
    ...(width !== undefined && !hasWidthClass
      ? { width: typeof width === 'number' ? `${width}px` : width }
      : {}),
    ...(height !== undefined && !hasHeightClass
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : {}),
    ...style,
  };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      style={inlineStyle}
      className={cn(
        'bg-muted',
        variantStyles[variant],
        // Shimmer animation — suppressed when prefers-reduced-motion is active
        animate && 'motion-safe:animate-pulse',
        className
      )}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';
