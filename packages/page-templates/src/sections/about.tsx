/**
 * @file packages/page-templates/src/sections/about.tsx
 * Task: [3.4] About page section adapters and registration
 *
 * Purpose: Register section components for about page. Adapters map SiteConfig
 * to marketing-component props. Sections: story (hero-centered), team, testimonials, cta.
 */

import type { SiteConfig } from '@repo/types';
import {
  HeroCentered,
  CTASection,
  TestimonialCarousel,
} from '@repo/marketing-components';
import { TeamSection } from '@repo/features';
import { registerSection, getSectionsForPage } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function StoryAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    HeroCentered({
      headline: `About ${config.name}`,
      subheadline: config.tagline ?? config.description,
      theme: 'light',
    })
  );
}

function AboutTeamAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return TeamSection({ siteConfig: config });
}

function AboutTestimonialsAdapter(_props: SectionProps) {
  return TestimonialCarousel({ testimonials: [] });
}

function AboutCTAAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const contactLink = config.navLinks?.find(
    (l) => l.href === '/contact' || l.label === 'Contact'
  );
  const primaryHref = contactLink?.href ?? '/contact';
  const primaryLabel = contactLink?.label ?? 'Get in Touch';
  return CTASection({
    headline: `Ready to work with ${config.name}?`,
    subheadline: config.tagline,
    primaryCta: { label: primaryLabel, href: primaryHref },
  });
}

/** Register sections for about page derivation. */
export function getSectionsForAboutPage(
  features: SiteConfig['features']
): string[] {
  const sections: string[] = ['about-story'];
  if (features.team) sections.push('about-team');
  if (features.testimonials) sections.push('about-testimonials');
  sections.push('about-cta');
  return sections;
}

/** Register all about page sections. Called once on module load. */
export function registerAboutSections(): void {
  registerSection('about-story', StoryAdapter);
  registerSection('about-team', AboutTeamAdapter);
  registerSection('about-testimonials', AboutTestimonialsAdapter);
  registerSection('about-cta', AboutCTAAdapter);
}

// Side-effect: register on module load so AboutPageTemplate can use composePage
registerAboutSections();

// Extend getSectionsForPage to handle 'about' — patch registry
import { getSectionsForPage as _base } from '../registry';
// Note: registry getSectionsForPage is extended in registry.ts update (task 3.9)
