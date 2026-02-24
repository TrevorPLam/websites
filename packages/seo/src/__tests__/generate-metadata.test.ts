import { describe, expect, it } from 'vitest';
import type { SiteConfig } from '@repo/types';
import { buildHomepageMetadata, buildMetadata } from '../metadata-factory';
import { buildLocalBusinessSchema } from '../structured-data';
import { buildRobots, buildSitemap } from '../crawl-directives';

const config: SiteConfig = {
  id: 'tenant-1',
  name: 'Acme Plumbing',
  tagline: 'Fast local plumbing repairs',
  description: 'Trusted local plumbing team for residential and commercial service.',
  url: 'https://acme.example.com',
  industry: 'construction',
  features: {
    hero: 'split',
    services: 'grid',
    team: 'grid',
    testimonials: 'grid',
    pricing: 'cards',
    contact: 'simple',
    gallery: 'grid',
    blog: true,
    booking: true,
    faq: true,
  },
  integrations: {},
  navLinks: [],
  socialLinks: [{ platform: 'facebook', url: 'https://facebook.com/acme' }],
  footer: { columns: [], legalLinks: [], copyrightTemplate: '© {year} Acme' },
  contact: {
    email: 'hello@acme.example.com',
    phone: '+15555551234',
    address: {
      street: '100 Main',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'US',
    },
  },
  seo: {
    titleTemplate: '%s | Acme Plumbing',
    defaultDescription: 'Emergency plumbing service in Austin.',
    twitterHandle: '@acme',
  },
  theme: { colors: { primary: '174 85% 33%' } },
  conversionFlow: { type: 'contact' },
};

describe('domain-23 seo utilities', () => {
  it('builds page metadata with canonical and robots', () => {
    const metadata = buildMetadata({ config, path: '/services/drain-cleaning' });
    expect(metadata.alternates?.canonical).toBe('https://acme.example.com/services/drain-cleaning');
    expect(metadata.robots).toBeTruthy();
  });

  it('builds homepage metadata', () => {
    const metadata = buildHomepageMetadata(config);
    expect(metadata.openGraph?.siteName).toBe('Acme Plumbing');
  });

  it('builds json-ld schema', () => {
    const schema = buildLocalBusinessSchema(config);
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.address?.addressLocality).toBe('Austin');
  });

  it('builds sitemap and robots directives', () => {
    expect(buildSitemap(config)).toHaveLength(4);
    expect(buildRobots(config).sitemap).toBe('https://acme.example.com/sitemap.xml');
  });
});
