'use client';

/**
 * @file packages/features/src/contact/components/ContactFormStandard.tsx
 * Purpose: Standard contact form section with title/description layout
 */

import ContactForm from './ContactForm';
import type { ContactFormProps } from './ContactForm';
import { Container, Section } from '@repo/ui';

export interface ContactFormStandardProps extends ContactFormProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Custom CSS class name */
  className?: string;
}

export function ContactFormStandard({
  title,
  description,
  className,
  ...formProps
}: ContactFormStandardProps) {
  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <ContactForm {...formProps} />
      </Container>
    </Section>
  );
}
