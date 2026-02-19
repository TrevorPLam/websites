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
});
