/**
 * @file packages/page-templates/src/sections/contact.tsx
 * Task: [3.5] Contact page section adapters and registration
 *
 * Purpose: Register section components for contact page. Adapters map SiteConfig
 * to feature/component props. Sections: contact-form, contact-info.
 */

import type { SiteConfig } from '@repo/types';
import { ContactForm, createContactConfig } from '@repo/features';
import type { ContactSubmissionHandler } from '@repo/features';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

/** Placeholder submission handler — clients override with real server action. */
const defaultContactHandler: ContactSubmissionHandler = async (_data, _metadata) => ({
  success: true,
  message: 'Thank you for your message!',
});

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function ContactFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactConfig = createContactConfig({
    successMessage: `Thank you for contacting ${config.name}! We'll be in touch soon.`,
  });
  return ContactForm({
    config: contactConfig,
    onSubmit: defaultContactHandler,
  });
}

function ContactInfoAdapter(_props: SectionProps) {
  // ContactForm handles all business info display via config
  return null;
}

/** Register all contact page sections. Called once on module load. */
export function registerContactSections(): void {
  registerSection('contact-form', ContactFormAdapter);
  registerSection('contact-info', ContactInfoAdapter);
}

// Side-effect: register on module load so ContactPageTemplate can use composePage
registerContactSections();
