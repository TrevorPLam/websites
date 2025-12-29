import { z } from 'zod'

const envSchema = z.object({
  // Public variables
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Your Dedicated Marketer'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  // Server-only variables
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().default('contact@yourdedicatedmarketer.com'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
const env = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  NODE_ENV: process.env.NODE_ENV,
})

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const validatedEnv = env.data

// Helper to check if we're in production
export const isProduction = validatedEnv.NODE_ENV === 'production'
export const isDevelopment = validatedEnv.NODE_ENV === 'development'
