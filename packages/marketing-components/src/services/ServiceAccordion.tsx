// File: packages/marketing-components/src/services/ServiceAccordion.tsx
// Purpose: Expandable service sections using Accordion
// Task: 2.2
// Status: Scaffolded - TODO: Implement

import { Accordion } from '@repo/ui';
import type { Service } from './ServiceGrid';

export interface ServiceAccordionProps {
  services: Service[];
  className?: string;
}

export function ServiceAccordion({ services, className }: ServiceAccordionProps) {
  const items = services.map((s) => ({
    question: s.name,
    answer: s.description ?? '',
  }));
  return (
    <div className={className}>
      <Accordion items={items} />
    </div>
  );
}
