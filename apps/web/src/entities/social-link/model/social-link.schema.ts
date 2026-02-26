/**
 * @file apps/web/src/entities/social-link/model/social-link.schema.ts
 * @summary social-link entity schema definition.
 * @description Zod schema for social-link data validation.
 */

import { z } from 'zod'

export const Social-linkSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Social-link = z.infer<typeof Social-linkSchema>

export const createSocial-link = (data: Partial<Social-link>): Social-link => {
  return Social-linkSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}