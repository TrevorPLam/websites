/**
 * @file apps/web/src/entities/payment/model/payment.schema.ts
 * @summary payment entity schema definition.
 * @description Zod schema for payment data validation.
 */

import { z } from 'zod'

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type Payment = z.infer<typeof PaymentSchema>

export const createPayment = (data: Partial<Payment>): Payment => {
  return PaymentSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}