/**
 * @file apps/web/src/entities/role/model/role.schema.ts
 * @summary role entity schema definition.
 * @description Zod schema for role data validation.
 */

import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Role = z.infer<typeof RoleSchema>

export const createRole = (data: Partial<Role>): Role => {
  return RoleSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}