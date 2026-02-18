/**
 * @file packages/marketing-components/src/contact/ContactFormStandard.tsx
 * @role component
 * @summary Standard contact form wrapper (display variant)
 *
 * Wraps @repo/features ContactForm for consistent layout. For full validation and submission,
 * use ContactForm from @repo/features/contact directly.
 */

import { ContactForm } from '@repo/features/contact';
import type { ContactFormProps } from '@repo/features/contact';
import { Container, Section } from '@repo/ui';

export interface ContactFormStandardProps extends ContactFormProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Standard contact form section variant.
 * Delegates to @repo/features ContactForm.
 *
 * @param props - ContactFormStandardProps
 * @returns Contact form section
 */
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
