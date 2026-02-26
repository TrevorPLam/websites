/**
 * @file apps/web/src/entities/setting/model/setting.schema.ts
 * @summary setting entity schema definition.
 * @description Zod schema for setting data validation.
 */

import { z } from 'zod'

export const SettingSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Setting = z.infer<typeof SettingSchema>

export const createSetting = (data: Partial<Setting>): Setting => {
  return SettingSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}