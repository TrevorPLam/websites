export type Industry =
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

export type FeatureVariant =
  | 'centered'
  | 'split'
  | 'video'
  | 'carousel'
  | 'grid'
  | 'list'
  | 'tabs'
  | 'accordion'
  | 'detailed'
  | 'marquee'
  | 'table'
  | 'cards'
  | 'calculator'
  | 'simple'
  | 'multi-step'
  | 'with-booking'
  | 'lightbox';

export interface IndustryConfig {
  schemaType: string;
  defaultFeatures: Partial<{
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
  }>;
  requiredFields?: string[];
  defaultIntegrations?: Partial<{
    analytics: { provider: 'google' | 'plausible' | 'none'; trackingId?: string };
    crm: { provider: 'hubspot' | 'none'; portalId?: string };
    booking: { provider: 'internal' | 'calendly' | 'acuity' | 'none' };
    email: { provider: 'mailchimp' | 'sendgrid' | 'none' };
    chat: { provider: 'intercom' | 'crisp' | 'none' };
  }>;
}
