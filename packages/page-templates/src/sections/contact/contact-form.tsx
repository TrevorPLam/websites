/**
 * @file packages/page-templates/src/sections/contact/contact-form.tsx
 * Purpose: Contact form section adapter and registration.
 * Note: Server Component adapter — ContactForm uses its built-in default handler.
 *       Provide a Server Action via onSubmit from a client wrapper for production CRM integration.
 */
import { ContactForm, createContactConfig } from '@repo/features';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function ContactFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactConfig = createContactConfig({
    successMessage: `Thank you for contacting ${config.name}! We'll be in touch soon.`,
  });
  return <ContactForm config={contactConfig} />;
}

registerSection('contact-form', ContactFormAdapter);
