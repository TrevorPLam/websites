/**
 * @file packages/marketing-components/src/faq/FAQSection.tsx
 * @role component
 * @summary FAQ accordion section
 */

import { Accordion, Container, Section } from '@repo/ui';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** FAQ items */
  items: FAQItem[];
  /** Allow multiple open */
  multiple?: boolean;
  /** Custom CSS class name */
  className?: string;
}

export function FAQSection({
  title,
  description,
  items,
  multiple = false,
  className,
}: FAQSectionProps) {
  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <Accordion items={items} multiple={multiple} />
      </Container>
    </Section>
  );
}
