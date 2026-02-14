// File: lib/env.public.ts  [TRACE:FILE=lib.env.public]
// Purpose: Public environment variable validation and type safety for client-side access.
//          Provides validated environment variables with proper defaults and error handling
//          for public configuration like site URL and analytics ID.
//
// Exports / Entry: validatedPublicEnv, getPublicBaseUrl function
// Used by: Client components, metadata generation, and any public environment access
//
// Invariants:
// - All public variables must be safe for client-side exposure
// - Validation must fail fast with clear error messages
// - Default values must provide reasonable fallbacks for development
// - Base URL helper must prevent trailing slash issues
// - Schema validation must catch configuration errors early
//
// Status: @public
// Features:
// - [FEAT:CONFIGURATION] Public environment variable management
// - [FEAT:VALIDATION] Environment variable validation and type safety
// - [FEAT:SECURITY] Safe client-side environment access
// - [FEAT:DEVELOPMENT] Development-friendly defaults and error handling

import { z } from 'zod';

// [TRACE:SCHEMA=lib.env.public.publicEnvSchema]
// [FEAT:CONFIGURATION] [FEAT:VALIDATION] [FEAT:SECURITY]
// NOTE: Public environment validation - defines safe client-side environment variables with proper validation.
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Hair Salon Template'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});

// [TRACE:BLOCK=lib.env.public.validation]
// [FEAT:CONFIGURATION] [FEAT:VALIDATION] [FEAT:DEVELOPMENT]
// NOTE: Environment validation - validates and parses public environment with comprehensive error handling.
const publicEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
});

if (!publicEnv.success) {
  console.error('❌ Invalid public environment variables:', publicEnv.error.flatten().fieldErrors);
  throw new Error('Invalid public environment variables');
}

// [TRACE:FUNC=lib.env.public.validatedPublicEnv]
// [FEAT:CONFIGURATION] [FEAT:SECURITY]
// NOTE: Public environment export - provides type-safe access to validated public environment variables.
export const validatedPublicEnv = publicEnv.data;

// [TRACE:FUNC=lib.env.public.getPublicBaseUrl]
// [FEAT:CONFIGURATION] [FEAT:SECURITY]
// NOTE: Base URL helper - provides consistent base URL for metadata and client-side use.
// Base URL helper for metadata/routes; stays public-only to avoid leaking secrets into client bundles
export const getPublicBaseUrl = () => validatedPublicEnv.NEXT_PUBLIC_SITE_URL;
