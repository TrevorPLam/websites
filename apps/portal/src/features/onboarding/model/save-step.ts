'use server';

import { z } from 'zod';
import { createServerAction } from '@repo/auth/server-action-wrapper';
import { db } from '@repo/db';
import { enqueue } from '@repo/jobs/client';
import { setTenantSecret } from '@repo/security/secrets-manager';
import {
  BusinessInfoSchema,
  BrandingSchema,
  ContactHoursSchema,
  ServicesSchema,
  DomainSchema,
  IntegrationsSchema,
  type OnboardingStep,
} from './onboarding-machine';
import { addCustomDomainForTenant } from '@repo/multi-tenant/vercel-domains';

// Unified step-save action (dispatches to per-step handlers)
const SaveStepInputSchema = z.object({
  step: z.enum([
    'business-info',
    'branding',
    'contact-hours',
    'services',
    'domain',
    'integrations',
  ]),
  data: z.record(z.unknown()),
});

export const saveOnboardingStep = createServerAction(SaveStepInputSchema, async (input, ctx) => {
  const { tenantId } = ctx;
  const { step, data } = input;

  // Per-step validation and save
  switch (step) {
    case 'business-info': {
      const parsed = BusinessInfoSchema.parse(data);
      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: parsed, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      // Update tenant config immediately (used for live preview)
      await db
        .from('tenants')
        .update({
          config: db.raw(`config || ?::jsonb`, [
            JSON.stringify({
              identity: {
                siteName: parsed.businessName,
                tagline: parsed.tagline,
                industry: parsed.industry,
              },
            }),
          ]),
        })
        .eq('id', tenantId);
      break;
    }

    case 'branding': {
      const parsed = BrandingSchema.parse(data);
      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: parsed, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      break;
    }

    case 'contact-hours': {
      const parsed = ContactHoursSchema.parse(data);
      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: parsed, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      break;
    }

    case 'services': {
      const parsed = ServicesSchema.parse(data);
      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: parsed, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      break;
    }

    case 'domain': {
      const parsed = DomainSchema.parse(data);

      // Check subdomain availability
      if (parsed.subdomain) {
        const { data: existing } = await db
          .from('tenants')
          .select('id')
          .eq('subdomain', parsed.subdomain)
          .neq('id', tenantId)
          .maybeSingle();

        if (existing) {
          return { error: `The subdomain "${parsed.subdomain}" is already taken.` };
        }

        await db
          .from('tenants')
          .update({
            subdomain: parsed.subdomain,
          })
          .eq('id', tenantId);
      }

      if (parsed.customDomain) {
        // Register domain with Vercel (immediate provisioning)
        try {
          await addCustomDomainForTenant(tenantId, parsed.customDomain);
        } catch (err: any) {
          return { error: `Domain registration failed: ${err.message}` };
        }

        await db
          .from('tenants')
          .update({
            custom_domain: parsed.customDomain,
            domain_verified: false, // Will be verified by Vercel webhook
          })
          .eq('id', tenantId);
      }

      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: parsed, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      break;
    }

    case 'integrations': {
      const parsed = IntegrationsSchema.parse(data);

      // Store sensitive API keys in encrypted secrets, not in config
      if (parsed.hubspotToken) {
        await setTenantSecret(tenantId, 'HUBSPOT_PRIVATE_APP_TOKEN', parsed.hubspotToken);
      }
      if (parsed.zapierWebhookUrl) {
        await setTenantSecret(tenantId, 'ZAPIER_WEBHOOK_URL', parsed.zapierWebhookUrl);
      }

      // Store non-sensitive integration config in tenant config
      const safeConfig = {
        googleAnalyticsId: parsed.googleAnalyticsId,
        googleTagManagerId: parsed.googleTagManagerId,
        facebookPixelId: parsed.facebookPixelId,
        crmType: parsed.crmType,
        calComUsername: parsed.calComUsername,
      };

      await db
        .from('onboarding_progress')
        .upsert(
          { tenant_id: tenantId, step, data: safeConfig, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id,step' }
        );
      break;
    }
  }

  return { success: true };
});

// ─────────────────────────────────────────────────────────────────────────────

const CompleteOnboardingSchema = z.object({});

export const completeOnboarding = createServerAction(
  CompleteOnboardingSchema,
  async (_input, ctx) => {
    const { tenantId } = ctx;

    // Fetch all onboarding progress
    const { data: steps } = await db
      .from('onboarding_progress')
      .select('step, data')
      .eq('tenant_id', tenantId);

    // Check for specific required steps, not just count
    const REQUIRED_STEPS = ['business-info', 'branding', 'contact-hours', 'services', 'domain'] as const;
    const stepKeys = steps.map(s => s.step);
    const missing = REQUIRED_STEPS.filter(requiredStep => !stepKeys.includes(requiredStep));

    if (missing.length > 0) {
      return { error: `Missing required steps: ${missing.join(', ')}. Please complete all steps before launching.` };
    }

    // Validate and merge all step data into a unified site.config
    const stepMap = Object.fromEntries(steps.map((s) => [s.step, s.data]));

    // Re-validate each step's data with its schema before merging
    const businessInfo = BusinessInfoSchema.parse(stepMap['business-info']);
    const branding = BrandingSchema.parse(stepMap['branding']);
    const contactHours = ContactHoursSchema.parse(stepMap['contact-hours']);
    const services = ServicesSchema.parse(stepMap['services']);
    const integrations = IntegrationsSchema.parse(stepMap['integrations'] ?? {});

    const config = {
      identity: {
        siteName: businessInfo.businessName,
        tagline: businessInfo.tagline,
        industry: businessInfo.industry,
        description: businessInfo.description,
        contact: { phone: contactHours.phone, email: contactHours.email },
        address: contactHours.address,
        hours: contactHours.hours,
        serviceAreas: contactHours.serviceAreas,
        services: services.services,
      },
      theme: {
        colors: {
          primary: branding.primaryColor,
          accent: branding.accentColor,
        },
        fontFamily: branding.fontFamily,
      },
      assets: {
        logo: branding.logoUrl,
        favicon: branding.faviconUrl,
      },
      analytics: {
        googleAnalyticsId: integrations.googleAnalyticsId,
        googleTagManagerId: integrations.googleTagManagerId,
        facebookPixelId: integrations.facebookPixelId,
      },
      integrations: {
        crmType: integrations.crmType,
        calComUsername: integrations.calComUsername,
      },
    };

    // Write merged config + activate tenant
    await db
      .from('tenants')
      .update({
        config,
        status: 'active',
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    // Queue sitemap rebuild
    await enqueue('sitemap.rebuild', { tenantId });

    // Send welcome email (not lead digest)
    await enqueue('email.welcome', {
      tenantId,
      siteName: businessInfo.businessName,
    });

    return { success: true, redirectTo: '/dashboard?onboarded=1' };
  }
);
