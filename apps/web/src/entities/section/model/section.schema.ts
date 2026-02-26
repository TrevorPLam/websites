/**
 * @file apps/web/src/entities/section/model/section.schema.ts
 * @summary section entity schema definition.
 * @description Zod schema for section data validation.
 */

import { z } from 'zod'

export const SectionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Section = z.infer<typeof SectionSchema>

export const createSection = (data: Partial<Section>): Section => {
  return SectionSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}