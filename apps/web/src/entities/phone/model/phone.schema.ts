/**
 * @file apps/web/src/entities/phone/model/phone.schema.ts
 * @summary phone entity schema definition.
 * @description Zod schema for phone data validation.
 */

import { z } from 'zod'

export const PhoneSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Phone = z.infer<typeof PhoneSchema>

export const createPhone = (data: Partial<Phone>): Phone => {
  return PhoneSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}