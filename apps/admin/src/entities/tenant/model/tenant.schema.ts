/**
 * @file admin/src/entities/tenant/model/tenant.schema.ts
 * @summary tenant entity definitions and schemas.
 * @description Core data structures and validation for tenant management.
 * @security none
 * @requirements none
 */
import { z } from 'zod';

export const TenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(63),
  name: z.string().min(1).max(100),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'suspended', 'deleted', 'trial']),
  customDomain: z.string().url().optional(),
  features: z.array(z.string()),
  billingStatus: z.enum(['current', 'past_due', 'canceled']),
  createdAt: z.date(),
  updatedAt: z.date(),
  onboardingCompletedAt: z.date().optional(),
  billingTier: z.string().optional(),
  maxUsers: z.number().default(5),
  maxSites: z.number().default(1),
});

export type Tenant = z.infer<typeof TenantSchema>;

export const TenantMetricsSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  activeUsers: z.number().default(0),
  totalLeads: z.number().default(0),
  totalSites: z.number().default(0),
  bandwidthUsage: z.number().default(0),
  storageUsage: z.number().default(0),
  lastActivity: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TenantMetrics = z.infer<typeof TenantMetricsSchema>;
