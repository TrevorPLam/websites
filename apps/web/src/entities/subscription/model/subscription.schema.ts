/**
 * @file apps/web/src/entities/subscription/model/subscription.schema.ts
 * @summary subscription entity schema definition.
 * @description Zod schema for subscription data validation.
 */

import { z } from 'zod'

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Subscription = z.infer<typeof SubscriptionSchema>

export const createSubscription = (data: Partial<Subscription>): Subscription => {
  return SubscriptionSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}