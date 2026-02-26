/**
 * @file apps/web/src/entities/group/model/group.schema.ts
 * @summary group entity schema definition.
 * @description Zod schema for group data validation.
 */

import { z } from 'zod'

export const GroupSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Group = z.infer<typeof GroupSchema>

export const createGroup = (data: Partial<Group>): Group => {
  return GroupSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}