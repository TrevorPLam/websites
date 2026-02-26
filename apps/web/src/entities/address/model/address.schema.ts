/**
 * @file apps/web/src/entities/address/model/address.schema.ts
 * @summary address entity schema definition.
 * @description Zod schema for address data validation.
 */

import { z } from 'zod'

export const AddressSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Address = z.infer<typeof AddressSchema>

export const createAddress = (data: Partial<Address>): Address => {
  return AddressSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}