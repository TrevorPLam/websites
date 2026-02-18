/**
 * @file packages/ui/src/components/Container.tsx
 * [TRACE:FILE=packages.ui.components.Container]
 *
 * Purpose: Layout wrapper that constrains content width and horizontal padding. Used for
 *          page-level and section-level content alignment across templates.
 *
 * Relationship: Used by Section, pages, and feature components. Depends on @repo/utils (cn).
 * System role: Layout primitive; no theme tokens beyond spacing/width.
 * Assumptions: size key must exist in sizeStyles; default is 'default'.
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max-width variant */
  size?: 'default' | 'narrow' | 'wide';
}

/** Max-width Tailwind classes per size; centered with responsive padding. */
const sizeStyles: Record<string, string> = {
  default: 'max-w-7xl',
  narrow: 'max-w-4xl',
  wide: 'max-w-screen-2xl',
};

/**
 * Renders a centered, width-constrained div. Forwards ref and spreads HTML div attributes.
 *
 * @param props - ContainerProps (size, className, and HTMLDivElement props)
 * @returns Forwarded ref to the root div
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';
