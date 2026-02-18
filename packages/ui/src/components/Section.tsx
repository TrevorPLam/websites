/**
 * @file packages/ui/src/components/Section.tsx
 * [TRACE:FILE=packages.ui.components.Section]
 *
 * Purpose: Vertical section wrapper with consistent padding. Polymorphic (section/div/aside)
 *          for semantic layout in landing and content pages.
 *
 * Relationship: Wraps content inside Container on pages. Depends on @repo/utils (cn).
 * System role: Layout primitive; vertical rhythm only.
 * Assumptions: Tag accepts ref and className; ref cast to HTMLDivElement for polymorphic use.
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML element to render as */
  as?: 'section' | 'div' | 'aside';
}

/**
 * Renders a section with vertical padding. Default element is <section> for semantics.
 *
 * @param props - SectionProps (as, className, and HTML attributes for the chosen element)
 * @returns Forwarded ref to the root element (Tag)
 */
export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, as: Tag = 'section', ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn('py-16 md:py-20', className)}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';
