// packages/ui/src/a11y/SkipToContent.tsx
import React from 'react';

export interface SkipToContentProps {
  mainId?: string;
  children?: React.ReactNode;
}

export function SkipToContent({
  mainId = 'main-content',
  children = 'Skip to main content',
}: SkipToContentProps) {
  return (
    <a
      href={`#${mainId}`}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        focus:z-[9999] focus:bg-white focus:text-primary focus:border-2
        focus:border-primary focus:px-4 focus:py-2 focus:rounded-lg
        focus:font-semibold focus:shadow-lg
        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50
      "
    >
      {children}
    </a>
  );
}
