/**
 * @file apps/web/src/entities/theme/model/theme.schema.ts
 * @summary theme entity schema definition.
 * @description Zod schema for theme data validation.
 */

import { z } from 'zod'

export const ThemeSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Theme = z.infer<typeof ThemeSchema>

export const createTheme = (data: Partial<Theme>): Theme => {
  return ThemeSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}