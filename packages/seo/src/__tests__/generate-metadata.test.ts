import { describe, it, expect } from 'vitest';
import { generateTenantMetadata, validateTenantMetadata } from '../generate-metadata';

describe('SEO Metadata Factory', () => {
  const mockTenantConfig = {
    identity: {
      siteName: 'Test Site',
      siteUrl: 'https://example.com',
      description: 'Test description',
      contact: {
        email: 'test@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          country: 'US',
        },
      },
    },
    branding: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      theme: 'light' as const,
    },
    seo: {
      titleTemplate: '%s | Test Site',
      description: 'SEO description',
      keywords: ['test', 'seo'],
      ogImage: 'https://example.com/og.jpg',
      twitterCard: 'summary_large_image' as const,
      favicon: 'https://example.com/favicon.ico',
    },
  };

  it('should generate basic metadata for home page', () => {
    const metadata = generateTenantMetadata({
      tenantConfig: mockTenantConfig,
      page: 'home',
    });

    expect(metadata.title).toBe('Home | Test Site');
    expect(metadata.description).toBe('SEO description');
    expect(metadata.metadataBase?.href).toBe('https://example.com');
    expect(metadata.openGraph?.title).toBe('Home | Test Site');
    expect(metadata.twitter?.card).toBe('summary_large_image');
  });

  it('should validate tenant configuration', () => {
    const validConfig = validateTenantMetadata(mockTenantConfig);
    expect(validConfig).toEqual(mockTenantConfig);

    expect(() => {
      validateTenantMetadata({ invalid: 'config' } as any);
    }).toThrow();
  });

  it('should handle page overrides', () => {
    const metadata = generateTenantMetadata({
      tenantConfig: mockTenantConfig,
      page: 'about',
      overrides: {
        title: 'Custom About Title',
        description: 'Custom description',
      },
    });

    expect(metadata.title).toBe('Custom About Title');
    expect(metadata.description).toBe('Custom description');
  });
});
