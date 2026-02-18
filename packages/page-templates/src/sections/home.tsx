/**
 * @file packages/page-templates/src/sections/home.tsx
 * Task: [3.2] Home page section adapters and registration
 *
 * Purpose: Register section components for home page. Adapters map SiteConfig
 * to marketing-component props. Content derived from name/tagline/description and
 * conversionFlow.serviceCategories (minimal Service[]).
 */

import type { SiteConfig } from '@repo/types';
import {
  HeroSplit,
  HeroCentered,
  HeroVideo,
  HeroCarousel,
  ServiceGrid,
  CTASection,
  TestimonialCarousel,
  PricingCards,
} from '@repo/marketing-components';

/** Minimal service shape for config-derived services (matches ServiceGridProps.services). */
interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
}
import { TeamSection } from '@repo/features';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

/** Derive minimal Service[] from conversionFlow.serviceCategories. */
function getServicesFromConfig(config: SiteConfig): ServiceItem[] {
  const flow = config.conversionFlow;
  if (flow.type === 'booking' && flow.serviceCategories?.length) {
    return flow.serviceCategories.map((name, i) => ({
      id: `svc-${i}`,
      name,
      description: '',
      category: name,
    }));
  }
  if (flow.type === 'quote' && flow.serviceCategories?.length) {
    return flow.serviceCategories.map((name, i) => ({
      id: `svc-${i}`,
      name,
      description: '',
      category: name,
    }));
  }
  return [];
}

function HeroSplitAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroSplit
      title={config.name}
      subtitle={config.tagline}
      description={config.description}
      cta={
        config.navLinks?.[0]
          ? { label: config.navLinks[0].label, href: config.navLinks[0].href }
          : undefined
      }
    />
  );
}

function HeroCenteredAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroCentered
      title={config.name}
      subtitle={config.tagline}
      description={config.description}
      cta={
        config.navLinks?.[0]
          ? { label: config.navLinks[0].label, href: config.navLinks[0].href }
          : undefined
      }
    />
  );
}

function HeroVideoAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroVideo
      title={config.name}
      subtitle={config.tagline}
      description={config.description}
    />
  );
}

function HeroCarouselAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroCarousel
      slides={[
        {
          title: config.name,
          subtitle: config.tagline,
          description: config.description,
        },
      ]}
    />
  );
}

function ServicesPreviewAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const services = getServicesFromConfig(config);
  if (services.length === 0) return null;
  return (
    <ServiceGrid
      services={services}
      title="Our Services"
      description={config.description}
      columns={3}
    />
  );
}

function TeamAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <TeamSection
      title="Our Team"
      description={config.description}
      layout={config.features.team ?? 'grid'}
      members={[]}
    />
  );
}

function TestimonialsAdapter(_props: SectionProps) {
  return (
    <TestimonialCarousel
      title="What Our Clients Say"
      testimonials={[]}
      autoPlay={0}
    />
  );
}

function PricingAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <PricingCards
      title="Pricing"
      description={config.description ?? undefined}
      plans={[]}
    />
  );
}

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

/** Register all home page sections. Call once when module loads. */
export function registerHomeSections(): void {
  registerSection('hero-split', HeroSplitAdapter);
  registerSection('hero-centered', HeroCenteredAdapter);
  registerSection('hero-video', HeroVideoAdapter);
  registerSection('hero-carousel', HeroCarouselAdapter);
  registerSection('services-preview', ServicesPreviewAdapter);
  registerSection('team', TeamAdapter);
  registerSection('testimonials', TestimonialsAdapter);
  registerSection('pricing', PricingAdapter);
  registerSection('cta', CTAAdapter);
}

// Side-effect: register on module load so HomePageTemplate can use composePage
registerHomeSections();
