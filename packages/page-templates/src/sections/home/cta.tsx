/**
 * @file packages/page-templates/src/sections/home/cta.tsx
 * Purpose: CTA section adapter and registration.
 */
import { CTASection } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function CTAAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactLink = config.navLinks?.find((l) => l.href === '/contact' || l.label === 'Contact');
  const primaryHref = contactLink?.href ?? '/contact';
  const primaryLabel = contactLink?.label ?? 'Get in Touch';
  return (
    <CTASection
      title={config.name}
      description={config.tagline}
      primaryCta={{ label: primaryLabel, href: primaryHref }}
    />
  );
}

registerSection('cta', CTAAdapter);
