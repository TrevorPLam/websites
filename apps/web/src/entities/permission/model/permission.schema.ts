/**
 * @file apps/web/src/entities/permission/model/permission.schema.ts
 * @summary permission entity schema definition.
 * @description Zod schema for permission data validation.
 */

import { z } from 'zod'

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Permission = z.infer<typeof PermissionSchema>

export const createPermission = (data: Partial<Permission>): Permission => {
  return PermissionSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}