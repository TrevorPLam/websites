/**
 * @file apps/web/src/entities/user/model/user.schema.ts
 * @summary user entity schema definition.
 * @description Zod schema for user data validation.
 */

import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type User = z.infer<typeof UserSchema>

export const createUser = (data: Partial<User>): User => {
  return UserSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}