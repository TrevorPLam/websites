/**
 * @file apps/web/src/entities/typography/model/typography.schema.ts
 * @summary typography entity schema definition.
 * @description Zod schema for typography data validation.
 */

import { z } from 'zod'

export const TypographySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Typography = z.infer<typeof TypographySchema>

export const createTypography = (data: Partial<Typography>): Typography => {
  return TypographySchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}