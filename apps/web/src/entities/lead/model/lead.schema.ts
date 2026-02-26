/**
 * @file apps/web/src/entities/lead/model/lead.schema.ts
 * @summary lead entity schema definition.
 * @description Zod schema for lead data validation.
 */

import { z } from 'zod'

export const LeadSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Lead = z.infer<typeof LeadSchema>

export const createLead = (data: Partial<Lead>): Lead => {
  return LeadSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}