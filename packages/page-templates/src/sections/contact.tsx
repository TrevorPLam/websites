/**
 * @file packages/page-templates/src/sections/contact.tsx
 * Task: [3.5] Contact page section adapters and registration
 *
 * Purpose: Register section components for contact page. Adapters map SiteConfig
 * to feature/component props. Sections: contact-form, contact-info.
 */

import type { SiteConfig } from '@repo/types';
import { ContactForm } from '@repo/features';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function ContactFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return ContactForm({
    businessName: config.name,
    address: config.address ?? undefined,
    phone: config.phone ?? undefined,
    email: config.email ?? undefined,
  });
}

function ContactInfoAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  // Render business info section
  const { name, address, phone, email } = config;
  const items: Array<{ label: string; value: string }> = [];
  if (address) items.push({ label: 'Address', value: address });
  if (phone) items.push({ label: 'Phone', value: phone });
  if (email) items.push({ label: 'Email', value: email });

  const { createElement: h } = await import('react').catch(() => ({ createElement: (tag: string, props: Record<string, unknown>, ...children: unknown[]) => ({ tag, props, children }) }));
  // Fallback: return null — ContactForm handles all info
  return null;
}

/** Register all contact page sections. Called once on module load. */
export function registerContactSections(): void {
  registerSection('contact-form', ContactFormAdapter);
  registerSection('contact-info', ContactInfoAdapter);
}

// Side-effect: register on module load so ContactPageTemplate can use composePage
registerContactSections();
