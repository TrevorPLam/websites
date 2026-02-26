/**
 * @file apps/web/src/entities/style/model/style.schema.ts
 * @summary style entity schema definition.
 * @description Zod schema for style data validation.
 */

import { z } from 'zod'

export const StyleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Style = z.infer<typeof StyleSchema>

export const createStyle = (data: Partial<Style>): Style => {
  return StyleSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}