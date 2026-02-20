/**
 * @file packages/page-templates/src/sections/contact/contact-form.tsx
 * Purpose: Contact form section adapter and registration.
 */
import { ContactForm, createContactConfig, type ContactSubmissionHandler } from '@repo/features';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

const defaultContactHandler: ContactSubmissionHandler = async (_data, _metadata) => ({
  success: true,
  message: 'Thank you for your message!',
});

function ContactFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactConfig = createContactConfig({
    successMessage: `Thank you for contacting ${config.name}! We'll be in touch soon.`,
  });
  return <ContactForm config={contactConfig} onSubmit={defaultContactHandler} />;
}

registerSection('contact-form', ContactFormAdapter);
