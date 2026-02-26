/**
 * @file apps/web/src/entities/contact/model/contact.schema.ts
 * @summary contact entity schema definition.
 * @description Zod schema for contact data validation.
 */

import { z } from 'zod'

export const ContactSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Contact = z.infer<typeof ContactSchema>

export const createContact = (data: Partial<Contact>): Contact => {
  return ContactSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}