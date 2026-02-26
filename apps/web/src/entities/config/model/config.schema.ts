/**
 * @file apps/web/src/entities/config/model/config.schema.ts
 * @summary config entity schema definition.
 * @description Zod schema for config data validation.
 */

import { z } from 'zod'

export const ConfigSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Config = z.infer<typeof ConfigSchema>

export const createConfig = (data: Partial<Config>): Config => {
  return ConfigSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}