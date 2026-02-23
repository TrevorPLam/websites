import { validateSiteConfigSafe } from '../src/schema';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const baseConfig = {
  identity: {
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    siteName: 'Test Site',
    legalBusinessName: 'Test Site LLC',
    domain: { primary: 'example.com', subdomain: 'example' },
    contact: {
      email: 'ops@example.com',
      phone: '+14155552671',
      address: { street: '1 Main St', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
    },
  },
  theme: {
    colorPalette: {
      primary: '#112233',
      secondary: '#223344',
      accent: '#334455',
      neutral: '#445566',
      background: '#ffffff',
      foreground: '#111111',
    },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', fontScale: 'normal' },
    logo: {
      light: 'https://example.com/light.png',
      dark: 'https://example.com/dark.png',
      favicon: 'https://example.com/favicon.ico',
    },
  },
  features: {
    enableBlog: false,
    enableBooking: true,
    enableEcommerce: false,
    enableChat: false,
    enableForms: { contactForm: true, newsletterSignup: false },
    enableMultiLocation: false,
    enableI18n: { enabled: false, defaultLocale: 'en-US', locales: ['en-US'] },
  },
  businessInfo: { type: 'LocalBusiness', category: 'Consulting', description: 'A'.repeat(60) },
  seo: {
    title: 'A valid SEO title for testing schema handling',
    description: 'B'.repeat(80),
    structuredData: {
      enableLocalBusiness: true,
      enableBreadcrumbs: true,
      enableFAQPage: false,
      enableArticle: false,
    },
    aiControlPreferences: { allowCrawling: true, llmsTxt: true, aiContextJson: true },
  },
  cms: { provider: 'none' },
  billing: { tier: 'starter', status: 'active', monthlyPageViews: 0 },
  notifications: {
    email: {
      enabled: true,
      newLeadNotification: true,
      qualifiedLeadNotification: true,
      bookingConfirmation: true,
      recipients: ['ops@example.com'],
    },
  },
  abTesting: { enabled: false },
  cookieConsent: {
    mode: 'native',
    enableGoogleConsentModeV2: true,
    defaultConsent: {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  },
  compliance: {
    gdpr: { enabled: true, dataRetentionDays: 365, dpaAccepted: false },
    wcag: { targetLevel: 'AA', enableAccessibilityStatement: true },
    pqc: { enablePostQuantumCrypto: false, migrationPhase: 'rsa' },
  },
};

assert(validateSiteConfigSafe(baseConfig).success === true, 'expected valid config to pass');
assert(
  validateSiteConfigSafe({
    ...baseConfig,
    identity: { ...baseConfig.identity, contact: { ...baseConfig.identity.contact, phone: 'abc' } },
  }).success === false,
  'expected invalid phone to fail'
);

console.log('config-schema smoke test passed');
