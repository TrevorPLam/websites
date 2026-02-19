import { generateOrganizationJsonLd } from '../src/index';
import type { SiteConfig } from '@repo/types';

function minimalSiteConfig(overrides: Partial<SiteConfig> = {}): SiteConfig {
  return {
    id: 'test',
    name: 'Test Business',
    tagline: 'Tagline',
    description: 'Test description',
    url: 'https://example.com',
    industry: 'general',
    features: {
      hero: 'centered',
      services: 'grid',
      team: null,
      testimonials: null,
      pricing: null,
      contact: null,
      gallery: null,
      blog: false,
      booking: false,
      faq: true,
    },
    integrations: {},
    navLinks: [],
    socialLinks: [],
    footer: { columns: [], legalLinks: [], copyrightTemplate: '' },
    contact: { email: 'hello@example.com' },
    seo: { titleTemplate: '%s', defaultDescription: '' },
    theme: {
      colors: {
        primary: '',
        'primary-foreground': '',
        secondary: '',
        'secondary-foreground': '',
        accent: '',
        'accent-foreground': '',
        background: '',
        foreground: '',
        muted: '',
        'muted-foreground': '',
        card: '',
        'card-foreground': '',
        destructive: '',
        'destructive-foreground': '',
        border: '',
        input: '',
        ring: '',
      },
    },
    conversionFlow: { type: 'contact' },
    ...overrides,
  };
}

describe('Industry Schemas (4.6)', () => {
  it('should produce valid parseable JSON', () => {
    const config = minimalSiteConfig();
    const jsonLd = generateOrganizationJsonLd(config);
    expect(() => JSON.parse(jsonLd)).not.toThrow();
    const schema = JSON.parse(jsonLd);
    expect(schema).toBeDefined();
    expect(typeof schema).toBe('object');
  });

  it('should generate valid JSON-LD with @context and @type', () => {
    const config = minimalSiteConfig({ industry: 'salon' });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBeDefined();
    expect(typeof schema['@type']).toBe('string');
    expect(schema.name).toBe('Test Business');
    expect(schema.url).toBe('https://example.com');
  });

  it('should use industry schemaType for general', () => {
    const config = minimalSiteConfig({ industry: 'general' });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema['@type']).toBe('LocalBusiness');
  });

  it('should use industry schemaType for salon', () => {
    const config = minimalSiteConfig({ industry: 'salon' });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema['@type']).toBe('HairSalon');
  });

  it('should include address when contact.address is set', () => {
    const config = minimalSiteConfig({
      contact: {
        email: 'a@b.com',
        address: {
          street: '123 Main St',
          city: 'City',
          state: 'ST',
          zip: '12345',
          country: 'US',
        },
      },
    });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema.address).toBeDefined();
    expect(schema.address['@type']).toBe('PostalAddress');
    expect(schema.address.streetAddress).toBe('123 Main St');
  });

  it('should include contactPoint when contact has email or phone', () => {
    const config = minimalSiteConfig({
      contact: { email: 'hello@example.com', phone: '+15551234567' },
    });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema.contactPoint).toBeDefined();
    expect(schema.contactPoint.email).toBe('hello@example.com');
    expect(schema.contactPoint.telephone).toBe('+15551234567');
  });

  it('should use seo.schemaType override when set', () => {
    const config = minimalSiteConfig({
      industry: 'salon',
      seo: {
        titleTemplate: '%s',
        defaultDescription: '',
        schemaType: 'Plumber',
      },
    });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema['@type']).toBe('Plumber');
  });

  it('should include image when seo.ogImage is set', () => {
    const config = minimalSiteConfig({
      seo: {
        titleTemplate: '%s',
        defaultDescription: '',
        ogImage: 'https://example.com/og.png',
      },
    });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema.image).toBe('https://example.com/og.png');
  });

  it('should include openingHoursSpecification when contact.hours is set', () => {
    const config = minimalSiteConfig({
      contact: {
        email: 'a@b.com',
        hours: [
          { label: 'Mon–Fri', hours: '9 am – 5 pm' },
          { label: 'Sat', hours: '10 am – 2 pm' },
        ],
      },
    });
    const jsonLd = generateOrganizationJsonLd(config);
    const schema = JSON.parse(jsonLd);
    expect(schema.openingHoursSpecification).toBeDefined();
    expect(Array.isArray(schema.openingHoursSpecification)).toBe(true);
    expect(schema.openingHoursSpecification).toHaveLength(2);
    expect(schema.openingHoursSpecification[0]['@type']).toBe('OpeningHoursSpecification');
    expect(schema.openingHoursSpecification[0].dayOfWeek).toBe('Mon–Fri');
  });

  it('should use industryConfig when passed explicitly', () => {
    const config = minimalSiteConfig({ industry: 'general' });
    const customConfig = {
      schemaType: 'CustomBusiness',
      defaultFeatures: {},
    };
    const jsonLd = generateOrganizationJsonLd(config, customConfig);
    const schema = JSON.parse(jsonLd);
    expect(schema['@type']).toBe('CustomBusiness');
  });
});
