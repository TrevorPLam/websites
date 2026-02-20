/**
 * @file packages/page-templates/src/sections/about/about-cta.tsx
 * Purpose: About CTA section adapter and registration.
 */
import { CTASection } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function AboutCTAAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactLink = config.navLinks?.find((l) => l.href === '/contact' || l.label === 'Contact');
  const primaryHref = contactLink?.href ?? '/contact';
  const primaryLabel = contactLink?.label ?? 'Get in Touch';
  return (
    <CTASection
      title={`Ready to work with ${config.name}?`}
      description={config.tagline ?? undefined}
      primaryCta={{ label: primaryLabel, href: primaryHref }}
    />
  );
}

registerSection('about-cta', AboutCTAAdapter);
