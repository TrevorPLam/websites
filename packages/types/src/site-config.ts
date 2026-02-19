/**
 * @file packages/types/src/site-config.ts
 * [TRACE:FILE=packages.types.site-config]
 *
 * Purpose: Defines SiteConfig interface and Zod schema as the single source of truth for
 * every marketing site. Each template implements one of these in site.config.ts.
 *
 * Relationship: Exported via packages/types/src/index.ts. Consumed by templates for
 * typing site.config and by @repo/features for conversion flow and theme.
 *
 * System role: Central type definitions for nav, footer, theme, SEO, conversion flow
 * (booking/contact/quote/dispatch), features, and integrations.
 *
 * Assumptions: Theme color values are HSL strings without hsl() wrapper; conversionFlow
 * is a discriminated union by type; schema validates at build or bootstrap.
 */

import { z } from 'zod';

// ---- Conversion Flow (Task 4) ----

/** Supported conversion flow types across all templates. */
export type ConversionFlowType = 'booking' | 'contact' | 'quote' | 'dispatch';

/** Fields that can appear on a booking form. */
export interface BookingFlowConfig {
  type: 'booking';
  /** Service categories offered for booking */
  serviceCategories: string[];
  /** Available time slots */
  timeSlots: { value: string; label: string }[];
  /** Max days in advance a booking can be made */
  maxAdvanceDays: number;
}

/** Simple contact-form flow. */
export interface ContactFlowConfig {
  type: 'contact';
  /** Subject line presets (optional) */
  subjects?: string[];
}

/** Quote / estimate request flow. */
export interface QuoteFlowConfig {
  type: 'quote';
  /** Service categories for the dropdown */
  serviceCategories: string[];
  /** Whether to collect photos/attachments */
  allowAttachments?: boolean;
}

/** Emergency / dispatch flow. */
export interface DispatchFlowConfig {
  type: 'dispatch';
  /** Urgency levels */
  urgencyLevels: { value: string; label: string }[];
}

/** Discriminated union — pick the right config shape per flow type. */
export type ConversionFlowConfig =
  | BookingFlowConfig
  | ContactFlowConfig
  | QuoteFlowConfig
  | DispatchFlowConfig;

// ---- Nav / Footer / Social ----

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';
  url: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface FooterConfig {
  columns: FooterColumn[];
  legalLinks: NavLink[];
  /** e.g. "© {year} Acme Inc. All rights reserved." — `{year}` is replaced at render time. */
  copyrightTemplate: string;
}

// ---- Contact ----

export interface BusinessHours {
  label: string; // e.g. "Tue – Fri"
  hours: string; // e.g. "10 am – 7 pm"
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  hours?: BusinessHours[];
}

// ---- SEO ----

export interface SeoDefaults {
  titleTemplate: string; // e.g. "%s | Acme Plumbing"
  defaultDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  /** JSON-LD organization type (e.g. "HairSalon", "Plumber") */
  schemaType?: string;
}

// ---- Theme ----

/** HSL values as strings, e.g. "174 85% 33%" (no `hsl()` wrapper). */
export interface ThemeColors {
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  card: string;
  'card-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  border: string;
  input: string;
  ring: string;
}

/** Font families used by the theme. */
export interface ThemeFonts {
  /** Primary heading font family, e.g., "Inter, sans-serif" */
  heading: string;
  /** Body copy font family */
  body: string;
  /** Optional accent font for callouts or highlights */
  accent?: string;
}

// ---- Top-level SiteConfig ----

export interface SiteConfig {
  /** Short machine-readable id, e.g. "hair-salon", "plumber" */
  id: string;
  /** Display name shown in nav, footer, meta tags */
  name: string;
  /** One-liner under the logo / in meta descriptions */
  tagline: string;
  /** Longer description for SEO / about pages */
  description: string;
  /** Canonical production URL (no trailing slash) */
  url: string;
  /** Industry classification for schema.org and defaults */
  industry:
    | 'salon'
    | 'restaurant'
    | 'law-firm'
    | 'dental'
    | 'medical'
    | 'fitness'
    | 'retail'
    | 'consulting'
    | 'realestate'
    | 'construction'
    | 'automotive'
    | 'general';
  /** Feature flags and layout variants for major sections */
  features: {
    hero: 'centered' | 'split' | 'video' | 'carousel' | null;
    services: 'grid' | 'list' | 'tabs' | 'accordion' | null;
    team: 'grid' | 'carousel' | 'detailed' | null;
    testimonials: 'carousel' | 'grid' | 'marquee' | null;
    pricing: 'table' | 'cards' | 'calculator' | null;
    contact: 'simple' | 'multi-step' | 'with-booking' | null;
    gallery: 'grid' | 'carousel' | 'lightbox' | null;
    blog: boolean;
    booking: boolean;
    faq: boolean;
    // industry features
    location?: boolean;
    menu?: boolean;
    portfolio?: boolean;
    caseStudy?: boolean;
    jobListing?: boolean;
    course?: boolean;
    resource?: boolean;
    comparison?: boolean;
    filter?: boolean;
    search?: boolean;
    socialProof?: boolean;
    video?: boolean;
    audio?: boolean;
    interactive?: boolean;
    widget?: boolean;
  };
  /** Third-party and internal integration settings */
  integrations: {
    analytics?: {
      provider: 'google' | 'plausible' | 'none';
      trackingId?: string;
      config?: {
        eventTracking?: boolean;
        anonymizeIp?: boolean;
      };
    };
    crm?: {
      provider: 'hubspot' | 'none';
      portalId?: string;
    };
    booking?: {
      provider: 'internal' | 'calendly' | 'acuity' | 'none';
      config?: Record<string, any>;
    };
    email?: {
      provider: 'mailchimp' | 'sendgrid' | 'none';
      config?: Record<string, any>;
    };
    chat?: {
      provider: 'intercom' | 'crisp' | 'tidio' | 'none';
      config?: {
        websiteId?: string;
        theme?: string;
      };
    };
    reviews?: {
      provider: 'google' | 'yelp' | 'trustpilot' | 'none';
      config?: Record<string, unknown>;
    };
    maps?: {
      provider: 'google' | 'none';
      config?: {
        static?: boolean;
        interactive?: boolean;
        apiKey?: string;
      };
    };
    abTesting?: {
      provider: 'none';
      config?: Record<string, any>;
    };
  };
  /** Primary navigation links */
  navLinks: NavLink[];
  /** Social media profiles */
  socialLinks: SocialLink[];
  /** Footer layout */
  footer: FooterConfig;
  /** Contact information */
  contact: ContactInfo;
  /** SEO defaults */
  seo: SeoDefaults;
  /** Theme configuration */
  theme: {
    /** Theme colors (HSL strings) */
    colors: ThemeColors;
    /** Theme font families */
    fonts?: ThemeFonts;
    /** Border radius scale for components */
    borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    /** Shadow depth scale for components */
    shadows?: 'none' | 'small' | 'medium' | 'large';
  };
  /** Conversion flow config */
  conversionFlow: ConversionFlowConfig;
}

// ---------------------- Zod Schemas ----------------------
// Built from smaller schemas for reuse and consistent validation at template bootstrap.

const navLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

const socialLinkSchema = z.object({
  platform: z.enum(['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok']),
  url: z.string().url(),
});

const footerConfigSchema = z.object({
  columns: z.array(
    z.object({
      heading: z.string().min(1),
      links: z.array(navLinkSchema),
    })
  ),
  legalLinks: z.array(navLinkSchema),
  copyrightTemplate: z.string().min(1),
});

const businessHoursSchema = z.object({
  label: z.string().min(1),
  hours: z.string().min(1),
});

const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    })
    .optional(),
  hours: z.array(businessHoursSchema).optional(),
});

const seoDefaultsSchema = z.object({
  titleTemplate: z.string().min(1),
  defaultDescription: z.string().min(1),
  ogImage: z.string().url().optional(),
  twitterHandle: z.string().optional(),
  schemaType: z.string().optional(),
});

const themeColorsSchema = z.object({
  primary: z.string(),
  'primary-foreground': z.string(),
  secondary: z.string(),
  'secondary-foreground': z.string(),
  accent: z.string(),
  'accent-foreground': z.string(),
  background: z.string(),
  foreground: z.string(),
  muted: z.string(),
  'muted-foreground': z.string(),
  card: z.string(),
  'card-foreground': z.string(),
  destructive: z.string(),
  'destructive-foreground': z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
});

const themeFontsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  accent: z.string().min(1).optional(),
});

const conversionFlowSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('booking'),
    serviceCategories: z.array(z.string()),
    timeSlots: z.array(z.object({ value: z.string(), label: z.string() })),
    maxAdvanceDays: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('contact'),
    subjects: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal('quote'),
    serviceCategories: z.array(z.string()),
    allowAttachments: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('dispatch'),
    urgencyLevels: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
]);

/** Full Zod schema for SiteConfig; use to validate template site.config at runtime or build. */
export const siteConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  industry: z.enum([
    'salon',
    'restaurant',
    'law-firm',
    'dental',
    'medical',
    'fitness',
    'retail',
    'consulting',
    'realestate',
    'construction',
    'automotive',
    'general',
  ]),
  features: z.object({
    hero: z.enum(['centered', 'split', 'video', 'carousel']).nullable(),
    services: z.enum(['grid', 'list', 'tabs', 'accordion']).nullable(),
    team: z.enum(['grid', 'carousel', 'detailed']).nullable(),
    testimonials: z.enum(['carousel', 'grid', 'marquee']).nullable(),
    pricing: z.enum(['table', 'cards', 'calculator']).nullable(),
    contact: z.enum(['simple', 'multi-step', 'with-booking']).nullable(),
    gallery: z.enum(['grid', 'carousel', 'lightbox']).nullable(),
    blog: z.boolean(),
    booking: z.boolean(),
    faq: z.boolean(),
    location: z.boolean().optional(),
    menu: z.boolean().optional(),
    portfolio: z.boolean().optional(),
    caseStudy: z.boolean().optional(),
    jobListing: z.boolean().optional(),
    course: z.boolean().optional(),
    resource: z.boolean().optional(),
    comparison: z.boolean().optional(),
    filter: z.boolean().optional(),
    search: z.boolean().optional(),
    socialProof: z.boolean().optional(),
    video: z.boolean().optional(),
    audio: z.boolean().optional(),
    interactive: z.boolean().optional(),
    widget: z.boolean().optional(),
  }),
  integrations: z.object({
    analytics: z
      .object({
        provider: z.enum(['google', 'plausible', 'none']),
        trackingId: z.string().optional(),
        config: z.object({
          eventTracking: z.boolean().optional(),
          anonymizeIp: z.boolean().optional(),
        }).optional(),
      })
      .optional(),
    crm: z
      .object({
        provider: z.enum(['hubspot', 'none']),
        portalId: z.string().optional(),
      })
      .optional(),
    booking: z
      .object({
        provider: z.enum(['internal', 'calendly', 'acuity', 'none']),
        config: z.record(z.any()).optional(),
      })
      .optional(),
    email: z
      .object({
        provider: z.enum(['mailchimp', 'sendgrid', 'none']),
        config: z.record(z.any()).optional(),
      })
      .optional(),
    chat: z
      .object({
        provider: z.enum(['intercom', 'crisp', 'tidio', 'none']),
        config: z.object({
          websiteId: z.string().optional(),
          theme: z.string().optional(),
        }).optional(),
      })
      .optional(),
    reviews: z
      .object({
        provider: z.enum(['google', 'yelp', 'trustpilot', 'none']),
        config: z.record(z.unknown()).optional(),
      })
      .optional(),
    maps: z
      .object({
        provider: z.enum(['google', 'none']),
        config: z
          .object({
            static: z.boolean().optional(),
            interactive: z.boolean().optional(),
            apiKey: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    abTesting: z
      .object({
        provider: z.enum(['none']),
        config: z.record(z.any()).optional(),
      })
      .optional(),
  }),
  navLinks: z.array(navLinkSchema),
  socialLinks: z.array(socialLinkSchema),
  footer: footerConfigSchema,
  contact: contactInfoSchema,
  seo: seoDefaultsSchema,
  theme: z.object({
    colors: themeColorsSchema,
    fonts: themeFontsSchema.optional(),
    borderRadius: z.enum(['none', 'small', 'medium', 'large', 'full']).optional(),
    shadows: z.enum(['none', 'small', 'medium', 'large']).optional(),
  }),
  conversionFlow: conversionFlowSchema,
});
