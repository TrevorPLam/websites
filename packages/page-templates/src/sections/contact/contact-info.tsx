/**
 * @file packages/page-templates/src/sections/contact/contact-info.tsx
 * Purpose: Contact info section adapter and registration.
 */
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function ContactInfoAdapter(_props: SectionProps) {
  return null;
}

registerSection('contact-info', ContactInfoAdapter);
