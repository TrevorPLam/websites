/**
 * @file apps/web/src/entities/template/model/template.schema.ts
 * @summary template entity schema definition.
 * @description Zod schema for template data validation.
 */

import { z } from 'zod'

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Template = z.infer<typeof TemplateSchema>

export const createTemplate = (data: Partial<Template>): Template => {
  return TemplateSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}