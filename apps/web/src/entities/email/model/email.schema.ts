/**
 * @file apps/web/src/entities/email/model/email.schema.ts
 * @summary email entity schema definition.
 * @description Zod schema for email data validation.
 */

import { z } from 'zod'

export const EmailSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Email = z.infer<typeof EmailSchema>

export const createEmail = (data: Partial<Email>): Email => {
  return EmailSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}