/**
 * @file apps/web/src/entities/order/model/order.schema.ts
 * @summary order entity schema definition.
 * @description Zod schema for order data validation.
 */

import { z } from 'zod'

export const OrderSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Order = z.infer<typeof OrderSchema>

export const createOrder = (data: Partial<Order>): Order => {
  return OrderSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}