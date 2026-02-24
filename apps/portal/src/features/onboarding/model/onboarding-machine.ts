import { z } from 'zod';

// ============================================================================
// STEP DEFINITIONS
// ============================================================================

export const ONBOARDING_STEPS = [
  'business-info',
  'branding',
  'contact-hours',
  'services',
  'domain',
  'integrations',
  'review',
  'complete',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

// ── Step Schemas (validated on both client and server) ─────────────────────

export const BusinessInfoSchema = z.object({
  businessName: z.string().min(2).max(100),
  tagline: z.string().min(5).max(160),
  industry: z.enum([
    'law',
    'hvac',
    'plumbing',
    'electrical',
    'dental',
    'medical',
    'realEstate',
    'accounting',
    'restaurant',
    'salon',
    'general',
  ]),
  description: z.string().min(20).max(500),
});

export const BrandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fontFamily: z.enum(['inter', 'merriweather', 'playfair', 'roboto', 'poppins', 'montserrat']),
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
});

export const ContactHoursSchema = z.object({
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().min(2),
    state: z.string().length(2),
    zip: z
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .optional(),
  }),
  hours: z
    .array(
      z.object({
        days: z.array(z.string()),
        opens: z.string().regex(/^\d{2}:\d{2}$/),
        closes: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .optional(),
  serviceAreas: z.array(z.string()).max(10).optional(),
});

export const ServicesSchema = z.object({
  services: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        description: z.string().min(10).max(300),
        slug: z.string().regex(/^[a-z0-9-]+$/),
        priceDisplay: z.string().optional(),
      })
    )
    .min(1)
    .max(20),
});

export const DomainSchema = z
  .object({
    subdomain: z
      .string()
      .min(3)
      .max(63)
      .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, 'Lowercase letters, numbers, hyphens only')
      .optional(),
    customDomain: z
      .string()
      .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, 'Enter a valid domain name')
      .optional(),
  })
  .refine((data) => data.subdomain || data.customDomain, {
    message: 'Either subdomain or custom domain is required',
  });

export const IntegrationsSchema = z.object({
  googleAnalyticsId: z
    .string()
    .regex(/^G-[A-Z0-9]+$/)
    .optional()
    .or(z.literal('')),
  googleTagManagerId: z
    .string()
    .regex(/^GTM-[A-Z0-9]+$/)
    .optional()
    .or(z.literal('')),
  facebookPixelId: z.string().regex(/^\d+$/).optional().or(z.literal('')),
  crmType: z.enum(['none', 'hubspot', 'zapier', 'gohighlevel']).default('none'),
  zapierWebhookUrl: z.string().url().optional().or(z.literal('')),
  hubspotToken: z.string().optional().or(z.literal('')),
  recaptchaSiteKey: z.string().optional().or(z.literal('')),
  calComUsername: z.string().optional().or(z.literal('')),
});

export type OnboardingData = {
  'business-info'?: z.infer<typeof BusinessInfoSchema>;
  branding?: z.infer<typeof BrandingSchema>;
  'contact-hours'?: z.infer<typeof ContactHoursSchema>;
  services?: z.infer<typeof ServicesSchema>;
  domain?: z.infer<typeof DomainSchema>;
  integrations?: z.infer<typeof IntegrationsSchema>;
};

// ── Step metadata ─────────────────────────────────────────────────────────────

export const STEP_META: Record<
  OnboardingStep,
  {
    title: string;
    description: string;
    schema?: z.ZodTypeAny;
    dataKey?: keyof OnboardingData;
    optional?: boolean;
  }
> = {
  'business-info': {
    title: 'Tell us about your business',
    description: 'This information powers your SEO, structured data, and AI citations.',
    schema: BusinessInfoSchema,
    dataKey: 'business-info',
  },
  branding: {
    title: 'Your brand identity',
    description:
      "Upload your logo and set your colors. We'll generate your full design system from these.",
    schema: BrandingSchema,
    dataKey: 'branding',
  },
  'contact-hours': {
    title: 'How customers reach you',
    description:
      'Phone, email, address, and hours appear in Google My Business, schema markup, and your site.',
    schema: ContactHoursSchema,
    dataKey: 'contact-hours',
  },
  services: {
    title: 'What you offer',
    description: 'Add your main services. Each gets its own SEO-optimized page.',
    schema: ServicesSchema,
    dataKey: 'services',
  },
  domain: {
    title: 'Choose your domain',
    description:
      'Your site goes live on your chosen subdomain immediately. Add a custom domain anytime.',
    schema: DomainSchema,
    dataKey: 'domain',
  },
  integrations: {
    title: 'Connect your tools',
    description: 'All optional — connect analytics, CRM, and booking tools. Skippable.',
    schema: IntegrationsSchema,
    dataKey: 'integrations',
    optional: true,
  },
  review: {
    title: 'Review your site',
    description: 'Everything looks good? Hit launch and your site goes live in under 60 seconds.',
  },
  complete: {
    title: "You're live! 🎉",
    description: 'Your site is live. Here are your next steps.',
  },
};

// ── State Machine Utilities ───────────────────────────────────────────────────

export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const nextIndex = currentIndex + 1;
  return nextIndex < ONBOARDING_STEPS.length ? ONBOARDING_STEPS[nextIndex] : null;
}

export function getPreviousStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? ONBOARDING_STEPS[prevIndex] : null;
}

export function getStepProgress(currentStep: OnboardingStep): number {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const totalDataSteps = 6; // Exclude 'review' and 'complete'
  return Math.min((currentIndex / totalDataSteps) * 100, 100);
}

export function isStepComplete(step: OnboardingStep, data: Partial<OnboardingData>): boolean {
  if (step === 'review' || step === 'complete') return false;

  const dataKey = STEP_META[step].dataKey;
  if (!dataKey) return false;

  return !!data[dataKey];
}

export function getRequiredStepsCompleted(data: Partial<OnboardingData>): number {
  const requiredSteps = ONBOARDING_STEPS.filter(
    (step) => !STEP_META[step].optional && step !== 'review' && step !== 'complete'
  );
  return requiredSteps.filter((step) => isStepComplete(step, data)).length;
}

export function canProceedToStep(
  targetStep: OnboardingStep,
  data: Partial<OnboardingData>
): boolean {
  const targetIndex = ONBOARDING_STEPS.indexOf(targetStep);

  // Can always go back to completed steps
  for (let i = 0; i < targetIndex; i++) {
    const step = ONBOARDING_STEPS[i];
    if (!isStepComplete(step, data)) {
      return false;
    }
  }

  return true;
}
