import { z } from 'zod';

// ============================================================================
// IDENTITY & BRANDING
// ============================================================================

const identitySchema = z.object({
  tenantId: z.string().uuid(), // Unique tenant identifier (Supabase UUID)
  siteName: z.string().min(1).max(100),
  legalBusinessName: z.string().min(1).max(200),
  domain: z.object({
    primary: z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/, 'Invalid domain format'),
    subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Invalid subdomain'), // tenant.youragency.com
    customDomains: z.array(z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/)).optional(),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'E.164 format required'),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string().length(2), // US state code
      zip: z.string().regex(/^\d{5}(-\d{4})?$/),
      country: z.string().length(2).default('US'), // ISO 3166-1 alpha-2
    }),
  }),
});

// ============================================================================
// THEME & DESIGN
// ============================================================================

const themeSchema = z.object({
  colorPalette: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    neutral: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  typography: z.object({
    headingFont: z.string(), // e.g., "Inter", "Montserrat"
    bodyFont: z.string(),
    monoFont: z.string().optional(),
    fontScale: z.enum(['tight', 'normal', 'relaxed']).default('normal'),
  }),
  logo: z.object({
    light: z.string().url(), // Logo for light backgrounds
    dark: z.string().url(), // Logo for dark backgrounds
    favicon: z.string().url(),
    appleTouchIcon: z.string().url().optional(),
  }),
  customCSS: z.string().max(10000).optional(), // Escape hatch for advanced styling
});

// ============================================================================
// FEATURES
// ============================================================================

const featuresSchema = z.object({
  enableBlog: z.boolean().default(false),
  enableBooking: z.boolean().default(false),
  enableEcommerce: z.boolean().default(false),
  enableChat: z.boolean().default(false), // Live chat widget
  enableForms: z.object({
    contactForm: z.boolean().default(true),
    newsletterSignup: z.boolean().default(false),
    customForms: z.array(z.string()).optional(), // Form IDs
  }),
  enableMultiLocation: z.boolean().default(false), // Multiple physical locations
  enableI18n: z.object({
    enabled: z.boolean().default(false),
    defaultLocale: z.string().default('en-US'),
    locales: z.array(z.string()).default(['en-US']), // BCP 47 language tags
  }),
});

// ============================================================================
// BUSINESS INFO (Local SEO)
// ============================================================================

const businessInfoSchema = z.object({
  type: z.enum([
    'LocalBusiness',
    'Restaurant',
    'LegalService',
    'MedicalBusiness',
    'HomeAndConstructionBusiness',
    'ProfessionalService',
    'Store',
  ]),
  category: z.string(), // e.g., "Family Law Attorney", "Italian Restaurant"
  description: z.string().min(50).max(500),
  yearEstablished: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  hoursOfOperation: z
    .array(
      z.object({
        dayOfWeek: z.enum([
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ]),
        opens: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM (24-hour)
        closes: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  acceptedPaymentMethods: z
    .array(z.enum(['Cash', 'Credit Card', 'Debit Card', 'Check', 'PayPal', 'Venmo']))
    .optional(),
  serviceArea: z
    .object({
      type: z.enum(['City', 'State', 'Country', 'Radius']),
      value: z.string(), // e.g., "Dallas, TX" or "50 miles"
    })
    .optional(),
  multiLocation: z
    .array(
      z.object({
        name: z.string(),
        address: identitySchema.shape.contact.shape.address,
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
        hours: z
          .array(
            z.object({
              dayOfWeek: z.enum([
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ]),
              opens: z.string().regex(/^\d{2}:\d{2}$/),
              closes: z.string().regex(/^\d{2}:\d{2}$/),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

// ============================================================================
// SEO CONFIGURATION
// ============================================================================

const seoSchema = z.object({
  title: z.string().min(10).max(60), // Optimal: 50-60 chars
  description: z.string().min(50).max(160), // Optimal: 150-160 chars
  keywords: z.array(z.string()).max(10).optional(), // Deprecated but some clients want it
  ogImage: z.string().url().optional(), // Default OG image
  twitterHandle: z
    .string()
    .regex(/^@\w{1,15}$/)
    .optional(),
  canonical: z.string().url().optional(), // Override canonical URL
  noindex: z.boolean().default(false), // Prevent indexing (staging sites)
  googleSiteVerification: z.string().optional(),
  bingSiteVerification: z.string().optional(),
  structuredData: z.object({
    enableLocalBusiness: z.boolean().default(true),
    enableBreadcrumbs: z.boolean().default(true),
    enableFAQPage: z.boolean().default(false),
    enableArticle: z.boolean().default(false), // Blog posts
  }),
  hreflang: z
    .array(
      z.object({
        locale: z.string(), // BCP 47
        url: z.string().url(),
      })
    )
    .optional(),
  aiControlPreferences: z.object({
    allowCrawling: z.boolean().default(true), // GPTBot, Claude-Web, Bard
    llmsTxt: z.boolean().default(true), // Generate /.well-known/llms.txt
    aiContextJson: z.boolean().default(true), // GEO optimization
  }),
});

// ============================================================================
// INTEGRATIONS
// ============================================================================

const integrationsSchema = z.object({
  analytics: z.object({
    googleAnalytics4: z.object({
      enabled: z.boolean().default(false),
      measurementId: z
        .string()
        .regex(/^G-[A-Z0-9]+$/)
        .optional(),
    }),
    googleTagManager: z.object({
      enabled: z.boolean().default(false),
      containerId: z
        .string()
        .regex(/^GTM-[A-Z0-9]+$/)
        .optional(),
    }),
    facebookPixel: z.object({
      enabled: z.boolean().default(false),
      pixelId: z.string().regex(/^\d+$/).optional(),
    }),
    tinybird: z.object({
      enabled: z.boolean().default(true), // Core Web Vitals tracking
      token: z.string().optional(),
    }),
  }),
  crm: z.object({
    provider: z.enum(['hubspot', 'salesforce', 'pipedrive', 'webhook', 'none']).default('none'),
    hubspot: z
      .object({
        portalId: z.string().optional(),
        formGuid: z.string().optional(),
      })
      .optional(),
    webhook: z
      .object({
        url: z.string().url().optional(),
        headers: z.record(z.string()).optional(),
      })
      .optional(),
  }),
  booking: z.object({
    provider: z.enum(['calendly', 'acuity', 'custom', 'none']).default('none'),
    calendly: z
      .object({
        username: z.string().optional(),
      })
      .optional(),
  }),
  payments: z.object({
    stripe: z.object({
      enabled: z.boolean().default(false),
      publicKey: z.string().startsWith('pk_').optional(),
    }),
  }),
  chat: z.object({
    provider: z.enum(['intercom', 'drift', 'crisp', 'none']).default('none'),
    intercom: z
      .object({
        appId: z.string().optional(),
      })
      .optional(),
  }),
  email: z.object({
    provider: z.enum(['postmark', 'resend', 'sendgrid']).default('postmark'),
    fromAddress: z.string().email(),
    replyToAddress: z.string().email().optional(),
  }),
});

// ============================================================================
// CMS SELECTION
// ============================================================================

const cmsSchema = z.object({
  provider: z.enum(['sanity', 'storyblok', 'none']).default('sanity'),
  sanity: z
    .object({
      projectId: z.string().optional(),
      dataset: z.string().default('production'),
      apiVersion: z.string().default('2024-01-01'),
    })
    .optional(),
  storyblok: z
    .object({
      accessToken: z.string().optional(),
      region: z.enum(['eu', 'us', 'ap', 'ca']).default('us'),
    })
    .optional(),
});

// ============================================================================
// BILLING & TIER
// ============================================================================

const billingSchema = z.object({
  tier: z.enum(['starter', 'professional', 'enterprise']).default('starter'),
  stripeCustomerId: z.string().startsWith('cus_').optional(),
  stripeSubscriptionId: z.string().startsWith('sub_').optional(),
  status: z.enum(['active', 'suspended', 'cancelled', 'trial']).default('trial'),
  trialEndsAt: z.string().datetime().optional(),
  nextBillingDate: z.string().datetime().optional(),
  monthlyPageViews: z.number().int().min(0).default(0), // For usage-based billing
});

// ============================================================================
// LEAD SCORING
// ============================================================================

const leadScoringSchema = z.object({
  enabled: z.boolean().default(true),
  weights: z.object({
    formSubmission: z.number().int().min(0).max(100).default(20),
    phoneClick: z.number().int().min(0).max(100).default(30),
    chatInitiated: z.number().int().min(0).max(100).default(25),
    bookingScheduled: z.number().int().min(0).max(100).default(50),
    pageViewsThreshold: z.number().int().min(1).default(5), // 5+ pages = +10 points
    timeOnSiteThreshold: z.number().int().min(30).default(120), // 2+ minutes = +15 points
  }),
  qualificationThreshold: z.number().int().min(0).max(100).default(50), // 50+ = qualified lead
  routing: z.object({
    autoAssign: z.boolean().default(false),
    ownerEmail: z.string().email().optional(),
    notifyOnQualified: z.boolean().default(true),
  }),
});

// ============================================================================
// NOTIFICATION ROUTING
// ============================================================================

const notificationsSchema = z.object({
  email: z.object({
    enabled: z.boolean().default(true),
    newLeadNotification: z.boolean().default(true),
    qualifiedLeadNotification: z.boolean().default(true),
    bookingConfirmation: z.boolean().default(true),
    recipients: z.array(z.string().email()).min(1),
  }),
  slack: z
    .object({
      enabled: z.boolean().default(false),
      webhookUrl: z.string().url().optional(),
      channels: z.array(z.string()).optional(), // ['#leads', '#sales']
    })
    .optional(),
  sms: z
    .object({
      enabled: z.boolean().default(false),
      twilioPhoneNumber: z.string().optional(),
      recipients: z.array(z.string().regex(/^\+?[1-9]\d{1,14}$/)).optional(),
    })
    .optional(),
});

// ============================================================================
// A/B TESTING
// ============================================================================

const abTestingSchema = z.object({
  enabled: z.boolean().default(false),
  experiments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        variants: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              weight: z.number().min(0).max(100), // Traffic allocation %
            })
          )
          .min(2)
          .max(5), // 2-5 variants
        active: z.boolean().default(false),
      })
    )
    .optional(),
});

// ============================================================================
// COOKIE CONSENT
// ============================================================================

const cookieConsentSchema = z.object({
  mode: z.enum(['native', 'overlay']).default('native'), // Native = no overlay (better UX)
  enableGoogleConsentModeV2: z.boolean().default(true),
  defaultConsent: z.object({
    analytics_storage: z.enum(['granted', 'denied']).default('denied'),
    ad_storage: z.enum(['granted', 'denied']).default('denied'),
    ad_user_data: z.enum(['granted', 'denied']).default('denied'),
    ad_personalization: z.enum(['granted', 'denied']).default('denied'),
  }),
});

// ============================================================================
// COMPLIANCE FLAGS
// ============================================================================

const complianceSchema = z.object({
  gdpr: z.object({
    enabled: z.boolean().default(true),
    dataRetentionDays: z.number().int().min(1).max(2555).default(730), // 2 years
    dpaAccepted: z.boolean().default(false),
    dpaAcceptedAt: z.string().datetime().optional(),
  }),
  wcag: z.object({
    targetLevel: z.enum(['A', 'AA', 'AAA']).default('AA'),
    enableAccessibilityStatement: z.boolean().default(true),
  }),
  pqc: z.object({
    enablePostQuantumCrypto: z.boolean().default(false), // Future-ready flag
    migrationPhase: z.enum(['rsa', 'hybrid', 'pqc']).default('rsa'),
  }),
});


// ============================================================================
// WHITE-LABEL PORTAL
// ============================================================================

const whiteLabelSchema = z
  .object({
    enabled: z.boolean().default(false),
    portalName: z.string().min(2).max(100),
    portalLogoUrl: z.string().url().optional(),
    portalFaviconUrl: z.string().url().optional(),
    portalPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#2563eb'),
    portalDomain: z.string().min(3).max(253).optional(),
    hideAgencyBranding: z.boolean().default(false),
    hideSupportLink: z.boolean().default(false),
    privacyPolicyUrl: z.string().url().optional(),
    termsOfServiceUrl: z.string().url().optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().min(7).max(30).optional(),
  })
  .optional();

// ============================================================================
// MAIN SITE CONFIG SCHEMA
// ============================================================================

export const SiteConfigSchema = z.object({
  identity: identitySchema,
  theme: themeSchema,
  features: featuresSchema,
  businessInfo: businessInfoSchema,
  seo: seoSchema,
  integrations: integrationsSchema.optional(),
  cms: cmsSchema,
  billing: billingSchema,
  leadScoring: leadScoringSchema.optional(),
  notifications: notificationsSchema,
  abTesting: abTestingSchema,
  cookieConsent: cookieConsentSchema,
  compliance: complianceSchema,
  whiteLabel: whiteLabelSchema,
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateSiteConfig(config: unknown): SiteConfig {
  return SiteConfigSchema.parse(config);
}

export function validateSiteConfigSafe(config: unknown) {
  return SiteConfigSchema.safeParse(config);
}
