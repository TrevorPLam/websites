/**
 * @file apps/web/src/entities/component/model/component.schema.ts
 * @summary component entity schema definition.
 * @description Zod schema for component data validation.
 */

import { z } from 'zod'

export const ComponentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Component = z.infer<typeof ComponentSchema>

export const createComponent = (data: Partial<Component>): Component => {
  return ComponentSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}