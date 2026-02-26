/**
 * @file apps/web/src/entities/notification/model/notification.schema.ts
 * @summary notification entity schema definition.
 * @description Zod schema for notification data validation.
 */

import { z } from 'zod'

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Notification = z.infer<typeof NotificationSchema>

export const createNotification = (data: Partial<Notification>): Notification => {
  return NotificationSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}