/**
 * @file apps/web/src/entities/message/model/message.schema.ts
 * @summary message entity schema definition.
 * @description Zod schema for message data validation.
 */

import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Message = z.infer<typeof MessageSchema>

export const createMessage = (data: Partial<Message>): Message => {
  return MessageSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}