/**
 * @file packages/ui/src/components/Accordion.tsx
 * [TRACE:FILE=packages.ui.components.Accordion]
 *
 * Purpose: Client-side accordion: list of question/answer items with expand/collapse. Single
 *          or multiple panels open; ARIA expanded/controls for accessibility.
 *
 * Relationship: Used by @repo/features (ServiceDetailLayout, etc.) and template pricing/FAQ.
 * System role: Disclosure component; uses theme border/muted colors.
 * Assumptions: items array is stable; key by index is acceptable (no reorder).
 */

'use client';

import * as React from 'react';
import { cn } from '@repo/utils';

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  /** Allow multiple items open at once */
  multiple?: boolean;
}

/**
 * Renders an accordion: each item is a button (question) and collapsible region (answer).
 * Toggle state is local; single-open mode clears others when one opens.
 *
 * @param props - AccordionProps (items, multiple, className, and div attributes)
 * @returns No ref; root is a div
 */
export function Accordion({ items, multiple = false, className, ...props }: AccordionProps) {
  const [openIndices, setOpenIndices] = React.useState<Set<number>>(new Set());

  /** Toggle item at index: in single mode replace state with only this index; in multiple add/remove. */
  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div
      className={cn('divide-y divide-border rounded-lg border border-border', className)}
      {...props}
    >
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);
        const id = `accordion-${index}`;
        return (
          <div key={index}>
            <button
              type="button"
              id={`${id}-trigger`}
              aria-expanded={isOpen}
              aria-controls={`${id}-content`}
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <span>{item.question}</span>
              <svg
                aria-hidden
                className={cn(
                  'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id={`${id}-content`}
              role="region"
              aria-labelledby={`${id}-trigger`}
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-96 pb-4' : 'max-h-0'
              )}
            >
              <div className="px-6 text-muted-foreground leading-relaxed">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
