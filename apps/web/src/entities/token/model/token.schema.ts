/**
 * @file apps/web/src/entities/token/model/token.schema.ts
 * @summary token entity schema definition.
 * @description Zod schema for token data validation.
 */

import { z } from 'zod'

export const TokenSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Token = z.infer<typeof TokenSchema>

export const createToken = (data: Partial<Token>): Token => {
  return TokenSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}