'use client';

/**
 * @file packages/marketing-components/src/interactive/AccordionContent.tsx
 * @role component
 * @summary Accordion wrapper using @repo/ui primitives
 */

import { Accordion } from '@repo/ui';
import { cn } from '@repo/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

export interface AccordionContentProps {
  items: AccordionItemData[];
  multiple?: boolean;
  className?: string;
}

export function AccordionContent({ items, multiple = false, className }: AccordionContentProps) {
  const accordionItems = items.map(({ title, content }) => ({ question: title, answer: content }));
  return (
    <Accordion items={accordionItems} multiple={multiple} className={cn('w-full', className)} />
  );
}
