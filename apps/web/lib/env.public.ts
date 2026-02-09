/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Public Environment Variables (Browser-Safe)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Validate and expose NEXT_PUBLIC_* env vars for client-side use
 * - Provide type-safe access to browser-safe configuration
 * - Serve as counterpart to lib/env.ts (server-only secrets)
 *
 * Responsibilities:
 * - Owns: Validation of public env vars (NEXT_PUBLIC_* only)
 * - Owns: Exposing site URL, site name, analytics ID to client
 * - Does NOT own: Server-only secrets (use lib/env.ts)
 *
 * Key Flows:
 * - Module load → validates public env vars → exports validated object
 * - Client components import → use validatedPublicEnv → type-safe access
 *
 * Inputs/Outputs:
 * - Input: process.env (NEXT_PUBLIC_* variables)
 * - Output: validatedPublicEnv object with type safety
 * - Side effects: Throws error if validation fails (fail-fast)
 *
 * Dependencies:
 * - External: zod (runtime validation)
 * - Internal: None (standalone module)
 *
 * State & Invariants:
 * - Invariant: Only NEXT_PUBLIC_* vars allowed (browser-safe)
 * - Invariant: Validation happens at module load (fail-fast)
 * - Assumption: Next.js injects NEXT_PUBLIC_* into client bundle
 *
 * Error Handling:
 * - Invalid URL: Throws error with Zod validation details
 * - Missing required vars: Uses defaults (site URL, site name)
 * - Optional vars: Undefined if not set (analytics ID)
 *
 * Performance Notes:
 * - Validation runs once at module load (no runtime cost)
 * - Accessing validated vars is instant (object property access)
 *
 * Security Notes:
 * - CRITICAL: Never add non-PUBLIC secrets to this file
 * - Only NEXT_PUBLIC_* vars are safe for client-side
 * - All exports are visible in client JavaScript bundle
 *
 * Testing Notes:
 * - Test: Verify validation rejects invalid URLs
 * - Test: Verify defaults applied when vars missing
 * - Mock: Mock process.env in tests
 *
 * Change Risks:
 * - Adding server-only vars exposes secrets to client (CRITICAL)
 * - Changing defaults may break client-side features
 * - Invalid validation schema breaks all client imports
 *
 * Owner Boundaries:
 * - Server-side env: lib/env.ts
 * - Usage: Client components, metadata, analytics
 *
 * AI Navigation Tags:
 * #env #config #client #public #browser-safe
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Public (browser-safe) environment helpers.
 *
 * IMPORTANT:
 * - This module must never reference server-only env vars.
 * - Only NEXT_PUBLIC_* vars are allowed here.
 */

import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Hair Salon Template'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

const publicEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
})

if (!publicEnv.success) {
  console.error('❌ Invalid public environment variables:', publicEnv.error.flatten().fieldErrors)
  throw new Error('Invalid public environment variables')
}

export const validatedPublicEnv = publicEnv.data

// Base URL helper for metadata/routes; stays public-only to avoid leaking secrets into client bundles
export const getPublicBaseUrl = () => validatedPublicEnv.NEXT_PUBLIC_SITE_URL
