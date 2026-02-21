/**
 * @file packages/page-templates/src/__tests__/registry.test.ts
 * Tests for section registry: evol-3 capability metadata (resolveForSite, isFeatureEnabled)
 * and existing composePage + registerSection behaviour.
 */

import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import {
  sectionRegistry,
  registerSection,
  resolveForSite,
  isFeatureEnabled,
  getSectionsForPage,
  composePage,
} from '../registry';
import type { SectionProps } from '../types';

// ─── Minimal SiteConfig factory ──────────────────────────────────────────────

function makeSiteConfig(overrides: Partial<SiteConfig['features']> = {}): SiteConfig {
  const defaultFeatures: SiteConfig['features'] = {
    hero: 'split',
    services: 'grid',
    team: null,
    testimonials: null,
    pricing: null,
    contact: 'simple',
    gallery: null,
    blog: false,
    booking: false,
    faq: false,
  };
  return {
    id: 'test-site',
    name: 'Test Site',
    tagline: '',
    description: '',
    industry: 'general',
    contact: {
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    },
    navLinks: [],
    footer: { columns: [], legal: [] },
    theme: {
      colors: {
        primary: '0 0% 0%',
        secondary: '0 0% 50%',
        accent: '0 0% 80%',
        background: '0 0% 100%',
        text: '0 0% 0%',
      },
      fonts: { heading: 'Inter', body: 'Inter' },
      borderRadius: '0.5rem',
    },
    seo: { titleTemplate: '%s | Test', defaultTitle: 'Test', description: '' },
    features: { ...defaultFeatures, ...overrides },
    integrations: {},
  } as unknown as SiteConfig;
}

const NoopSection = (_props: SectionProps): React.ReactElement => React.createElement('div');

// ─── isFeatureEnabled ────────────────────────────────────────────────────────

describe('isFeatureEnabled', () => {
  it('returns true for truthy string feature values', () => {
    const features = makeSiteConfig({ hero: 'split' }).features;
    expect(isFeatureEnabled('hero', features)).toBe(true);
  });

  it('returns false for null feature values', () => {
    const features = makeSiteConfig({ team: null }).features;
    expect(isFeatureEnabled('team', features)).toBe(false);
  });

  it('returns false for false boolean feature values', () => {
    const features = makeSiteConfig({ booking: false }).features;
    expect(isFeatureEnabled('booking', features)).toBe(false);
  });

  it('returns true for true boolean feature values', () => {
    const features = makeSiteConfig({ booking: true }).features;
    expect(isFeatureEnabled('booking', features)).toBe(true);
  });
});

// ─── resolveForSite (evol-3) ─────────────────────────────────────────────────

describe('resolveForSite', () => {
  beforeEach(() => {
    sectionRegistry.clear();
  });

  it('includes sections with no requiredFeatures', () => {
    registerSection('cta', NoopSection);
    const siteConfig = makeSiteConfig();
    const result = resolveForSite(siteConfig);
    expect(result.map(([id]) => id)).toContain('cta');
  });

  it('includes sections whose requiredFeatures are all enabled', () => {
    registerSection('booking-form', NoopSection, { requiredFeatures: ['booking'] });
    const siteConfig = makeSiteConfig({ booking: true });
    const result = resolveForSite(siteConfig);
    expect(result.map(([id]) => id)).toContain('booking-form');
  });

  it('excludes sections whose requiredFeatures are disabled', () => {
    registerSection('booking-form', NoopSection, { requiredFeatures: ['booking'] });
    const siteConfig = makeSiteConfig({ booking: false });
    const result = resolveForSite(siteConfig);
    expect(result.map(([id]) => id)).not.toContain('booking-form');
  });

  it('excludes sections with multiple requiredFeatures if any is disabled', () => {
    registerSection('staff-booking', NoopSection, {
      requiredFeatures: ['booking', 'team'],
    });
    // booking enabled, team disabled (null)
    const siteConfig = makeSiteConfig({ booking: true, team: null });
    const result = resolveForSite(siteConfig);
    expect(result.map(([id]) => id)).not.toContain('staff-booking');
  });

  it('includes sections with multiple requiredFeatures when all enabled', () => {
    registerSection('staff-booking', NoopSection, {
      requiredFeatures: ['booking', 'team'],
    });
    const siteConfig = makeSiteConfig({ booking: true, team: 'grid' });
    const result = resolveForSite(siteConfig);
    expect(result.map(([id]) => id)).toContain('staff-booking');
  });

  it('returns entries as [id, definition] tuples', () => {
    registerSection('cta', NoopSection, { estimatedBundleSize: 5 });
    const siteConfig = makeSiteConfig();
    const result = resolveForSite(siteConfig);
    const [id, definition] = result[0] ?? ['', {}];
    expect(id).toBe('cta');
    expect(definition.component).toBe(NoopSection);
    expect((definition as { estimatedBundleSize?: number }).estimatedBundleSize).toBe(5);
  });
});

// ─── registerSection — capability metadata fields stored ─────────────────────

describe('registerSection with capability metadata', () => {
  beforeEach(() => {
    sectionRegistry.clear();
  });

  it('stores requiredFeatures on the definition', () => {
    registerSection('my-section', NoopSection, { requiredFeatures: ['booking'] });
    const def = sectionRegistry.get('my-section');
    expect(def?.requiredFeatures).toEqual(['booking']);
  });

  it('stores requiredData on the definition', () => {
    registerSection('my-section', NoopSection, { requiredData: ['bookings', 'staff'] });
    const def = sectionRegistry.get('my-section');
    expect(def?.requiredData).toEqual(['bookings', 'staff']);
  });

  it('stores estimatedBundleSize on the definition', () => {
    registerSection('my-section', NoopSection, { estimatedBundleSize: 12.5 });
    const def = sectionRegistry.get('my-section');
    expect(def?.estimatedBundleSize).toBe(12.5);
  });

  it('stores validateConfig on the definition', () => {
    const validator = (cfg: unknown): boolean => typeof cfg === 'object';
    registerSection('my-section', NoopSection, { validateConfig: validator });
    const def = sectionRegistry.get('my-section');
    expect(def?.validateConfig).toBe(validator);
  });
});

// ─── getSectionsForPage ───────────────────────────────────────────────────────

describe('getSectionsForPage', () => {
  it('returns home sections based on enabled features', () => {
    const features = makeSiteConfig({
      hero: 'split',
      services: 'grid',
      testimonials: 'carousel',
    }).features;
    const sections = getSectionsForPage('home', features);
    expect(sections).toContain('hero-split');
    expect(sections).toContain('services-preview');
    expect(sections).toContain('testimonials');
    expect(sections).toContain('cta');
  });

  it('always includes cta on home page', () => {
    const features = makeSiteConfig().features;
    expect(getSectionsForPage('home', features)).toContain('cta');
  });

  it('returns empty array for unknown page', () => {
    const features = makeSiteConfig().features;
    expect(getSectionsForPage('unknown-page', features)).toEqual([]);
  });

  it('returns booking-form for booking page', () => {
    const features = makeSiteConfig().features;
    expect(getSectionsForPage('booking', features)).toEqual(['booking-form']);
  });
});

// ─── composePage — validateConfig integration (evol-3) ───────────────────────

describe('composePage with validateConfig', () => {
  beforeEach(() => {
    sectionRegistry.clear();
  });

  it('renders section when validateConfig returns true', () => {
    registerSection('valid-section', NoopSection, {
      validateConfig: () => true,
    });
    const siteConfig = makeSiteConfig();
    const result = composePage({ sections: ['valid-section'] }, siteConfig);
    expect(result).not.toBeNull();
  });

  it('skips section when validateConfig returns false', () => {
    registerSection('invalid-section', NoopSection, {
      validateConfig: () => false,
    });
    const siteConfig = makeSiteConfig();
    const result = composePage({ sections: ['invalid-section'] }, siteConfig);
    // All sections skipped → null
    expect(result).toBeNull();
  });

  it('skips section when validateConfig throws', () => {
    registerSection('throwing-section', NoopSection, {
      validateConfig: () => {
        throw new Error('validation error');
      },
    });
    const siteConfig = makeSiteConfig();
    const result = composePage({ sections: ['throwing-section'] }, siteConfig);
    expect(result).toBeNull();
  });
});

// ─── composePage — config-driven sections (inf-1) ───────────────────────────────

describe('composePage config-driven sections (inf-1)', () => {
  beforeEach(() => {
    sectionRegistry.clear();
  });

  it('uses config.sections when provided instead of getSectionsForPage', () => {
    registerSection('custom-hero', NoopSection);
    registerSection('cta', NoopSection);
    const siteConfig = makeSiteConfig();
    const result = composePage({ sections: ['custom-hero', 'cta'] }, siteConfig);
    expect(result).not.toBeNull();
  });

  it('skips unknown section IDs and renders only registered ones', () => {
    registerSection('known-a', NoopSection);
    registerSection('known-b', NoopSection);
    const siteConfig = makeSiteConfig();
    const result = composePage({ sections: ['known-a', 'unknown-id', 'known-b'] }, siteConfig);
    expect(result).not.toBeNull();
    // Fragment has two Suspense children (known-a, known-b); unknown-id is skipped
    const element = result as React.ReactElement<{ children?: React.ReactNode }>;
    const children = element?.props?.children;
    expect(Array.isArray(children)).toBe(true);
    expect((children as React.ReactNode[]).length).toBe(2);
  });
});
