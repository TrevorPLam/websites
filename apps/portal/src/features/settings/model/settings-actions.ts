'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { createServerAction } from '@repo/auth/server-action-wrapper';
import { db } from '@repo/db';
import { invalidateTenantServiceAreas } from '@repo/multi-tenant';

const TIME_24H_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const IdentitySchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: z.string().max(160).optional(),
  description: z.string().max(500).optional(),
  industry: z.enum([
    'hvac',
    'plumbing',
    'electrical',
    'dental',
    'medical',
    'law',
    'realEstate',
    'accounting',
    'restaurant',
    'salon',
    'general',
  ]),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  yearEstablished: z.number().min(1800).max(new Date().getFullYear()).optional(),
});

const ContactSchema = z.object({
  phone: z.string().regex(/^[\+]?[\d\s\-()]{7,20}$/, 'Invalid phone number').optional(),
  email: z.string().email().optional(),
  address: z
    .object({
      street: z.string().max(100).optional(),
      city: z.string().max(80),
      state: z.string().length(2).transform((value) => value.toUpperCase()),
      zip: z.string().regex(/^\d{5}(-\d{4})?$/).optional(),
    })
    .optional(),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

const ServiceAreasSchema = z.object({
  serviceAreas: z.array(z.string().min(2).max(60)).min(1).max(50),
});

const HoursSchema = z.object({
  hours: z
    .array(
      z
        .object({
          days: z.array(z.enum(WEEK_DAYS)).min(1).max(WEEK_DAYS.length),
          opens: z.string().regex(TIME_24H_REGEX, 'Use HH:MM format'),
          closes: z.string().regex(TIME_24H_REGEX, 'Use HH:MM format'),
        })
        .refine((value) => value.opens < value.closes, {
          message: 'Closing time must be after opening time',
          path: ['closes'],
        })
    )
    .max(7),
});

const NotificationsSchema = z.object({
  leadEmailAlerts: z.boolean().optional(),
  leadSmsAlerts: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  missedCallAlerts: z.boolean().optional(),
});



const WhiteLabelSettingsSchema = z.object({
  enabled: z.boolean(),
  portalName: z.string().min(2).max(100),
  portalLogoUrl: z.string().url().optional().or(z.literal('')),
  portalFaviconUrl: z.string().url().optional().or(z.literal('')),
  portalPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  portalDomain: z.string().min(3).max(253).optional(),
  hideAgencyBranding: z.boolean(),
  hideSupportLink: z.boolean(),
  privacyPolicyUrl: z.string().url().optional().or(z.literal('')),
  termsOfServiceUrl: z.string().url().optional().or(z.literal('')),
  supportEmail: z.string().email().optional().or(z.literal('')),
  supportPhone: z.string().min(7).max(30).optional().or(z.literal('')),
});

type TenantConfigIdentityProjection = {
  identity?: {
    serviceAreas?: string[];
  };
};

function slugifyArea(area: string): string {
  return area
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const updateIdentitySettings = createServerAction(IdentitySchema, async (input, ctx) => {
  await db.rpc('deep_merge_config', {
    p_tenant_id: ctx.tenantId,
    p_path: '{identity}',
    p_value: input,
  });

  revalidateTag(`tenant:${ctx.tenantId}`);
  revalidateTag(`tenant:${ctx.tenantId}:sitemap`);

  return { success: true };
});

export const updateContactSettings = createServerAction(ContactSchema, async (input, ctx) => {
  const contactPayload = {
    ...(input.phone || input.email
      ? {
          contact: {
            ...(input.phone ? { phone: input.phone } : {}),
            ...(input.email ? { email: input.email } : {}),
          },
        }
      : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.coordinates ? { coordinates: input.coordinates } : {}),
  };

  await db.rpc('deep_merge_config', {
    p_tenant_id: ctx.tenantId,
    p_path: '{identity}',
    p_value: contactPayload,
  });

  revalidateTag(`tenant:${ctx.tenantId}`);

  return { success: true };
});

export const updateServiceAreasSettings = createServerAction(
  ServiceAreasSchema,
  async (input, ctx) => {
    const { data: currentConfig } = await db
      .from('tenants')
      .select('config')
      .eq('id', ctx.tenantId)
      .single<TenantConfigIdentityProjection>();

    const previousAreas = currentConfig?.identity?.serviceAreas ?? [];

    await db.rpc('deep_merge_config', {
      p_tenant_id: ctx.tenantId,
      p_path: '{identity}',
      p_value: { serviceAreas: input.serviceAreas },
    });

    const removedAreas = previousAreas.filter((area) => !input.serviceAreas.includes(area));

    await invalidateTenantServiceAreas(
      ctx.tenantId,
      removedAreas.map((area) => slugifyArea(area))
    );

    revalidateTag(`tenant:${ctx.tenantId}:sitemap`);

    return { success: true };
  }
);

export const updateHoursSettings = createServerAction(HoursSchema, async (input, ctx) => {
  await db.rpc('deep_merge_config', {
    p_tenant_id: ctx.tenantId,
    p_path: '{identity}',
    p_value: { hours: input.hours },
  });

  revalidateTag(`tenant:${ctx.tenantId}`);
  revalidateTag(`tenant:${ctx.tenantId}:sitemap`);

  return { success: true };
});

export const updateNotificationSettings = createServerAction(
  NotificationsSchema,
  async (input, ctx) => {
    await db.rpc('deep_merge_config', {
      p_tenant_id: ctx.tenantId,
      p_path: '{notifications}',
      p_value: input,
    });

    revalidateTag(`tenant:${ctx.tenantId}`);

    return { success: true };
  }
);


export const updateWhiteLabelSettings = createServerAction(
  WhiteLabelSettingsSchema,
  async (input, ctx) => {
    const { data: tenant } = await db.from('tenants').select('plan').eq('id', ctx.tenantId).single();

    if (tenant?.plan !== 'enterprise') {
      throw new Error('White-label settings are only available on the Enterprise plan.');
    }

    const normalized = {
      ...input,
      portalLogoUrl: input.portalLogoUrl || undefined,
      portalFaviconUrl: input.portalFaviconUrl || undefined,
      privacyPolicyUrl: input.privacyPolicyUrl || undefined,
      termsOfServiceUrl: input.termsOfServiceUrl || undefined,
      supportEmail: input.supportEmail || undefined,
      supportPhone: input.supportPhone || undefined,
    };

    await db.rpc('deep_merge_config', {
      p_tenant_id: ctx.tenantId,
      p_path: '{whiteLabel}',
      p_value: normalized,
    });

    revalidateTag(`tenant:${ctx.tenantId}`);

    return { success: true };
  }
);
