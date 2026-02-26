/**
 * @file admin/src/entities/user/model/user.schema.ts
 * @summary user entity definitions and schemas.
 * @description Core data structures and validation for user management.
 * @security none
 * @requirements none
 */
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['super_admin', 'tenant_admin', 'billing_admin', 'analytics_viewer']),
  tenantId: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  lastLogin: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  mfaEnabled: z.boolean().default(false),
  permissions: z.array(z.string()),
});

export type User = z.infer<typeof UserSchema>;

export const UserSessionSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  role: z.enum(['super_admin', 'tenant_admin', 'billing_admin', 'analytics_viewer']),
  permissions: z.array(z.string()),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;
