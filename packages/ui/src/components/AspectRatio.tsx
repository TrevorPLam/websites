// File: packages/ui/src/components/AspectRatio.tsx  [TRACE:FILE=packages.ui.components.AspectRatio]
// Purpose: Container component that maintains a specific aspect ratio for its content.
//          Built on Radix UI AspectRatio which uses CSS aspect-ratio property with
//          fallback padding technique for older browsers.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Layout primitive (Layer L2 @repo/ui).
// Assumptions: Used to maintain consistent aspect ratios for images, videos, and other media.
//
// Exports / Entry: AspectRatio, AspectRatioProps
// Used by: Image galleries, video players, media containers
//
// Invariants:
// - Aspect ratio is maintained regardless of content size
// - Responsive by default
// - Uses CSS aspect-ratio with padding fallback
//
// Status: @public
// Features:
// - [FEAT:UI] Maintains aspect ratio for any content
// - [FEAT:RESPONSIVE] Responsive by default
// - [FEAT:PERFORMANCE] CSS-only solution, no JavaScript overhead

import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  /** Aspect ratio (width / height), e.g., 16/9, 4/3, 1/1 */
  ratio?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.AspectRatio]
// [FEAT:UI] [FEAT:RESPONSIVE]
export const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, ratio = 16 / 9, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    ratio={ratio}
    className={cn('relative w-full overflow-hidden', className)}
    {...props}
  />
));
AspectRatio.displayName = 'AspectRatio';
