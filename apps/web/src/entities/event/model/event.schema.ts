/**
 * @file apps/web/src/entities/event/model/event.schema.ts
 * @summary event entity schema definition.
 * @description Zod schema for event data validation.
 */

import { z } from 'zod'

export const EventSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Event = z.infer<typeof EventSchema>

export const createEvent = (data: Partial<Event>): Event => {
  return EventSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}