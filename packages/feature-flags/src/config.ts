/**
 * @file packages/feature-flags/src/config.ts
 * @summary Zod configuration schema for the feature-flag system.
 * @description Provides a validated, typed configuration object that governs how
 *   feature flags are resolved at runtime. The schema is consumed by the
 *   {@link FeatureFlagProvider} and by server-side flag resolvers (Edge Config,
 *   Redis, tier defaults).
 *
 *   `FeatureFlagConfig` is intentionally separate from individual flag rules so
 *   that configuration (storage provider, TTL, log level) can evolve without
 *   touching the per-flag schema in `types.ts`.
 *
 * @security Configuration values never contain secrets; flag resolution uses Edge Config and Redis credentials from environment variables only.
 * @adr none
 * @requirements TASK-011
 */

import { z } from 'zod';
import { tierSchema } from './types';

// ─── Schemas ──────────────────────────────────────────────────────────────────

/**
 * Storage provider for flag data.
 * - `edge-config` — Vercel Edge Config (fastest; globally distributed).
 * - `redis` — Upstash Redis (tenant overrides; ~1-5ms extra latency).
 * - `memory` — In-process Map; for tests and local development only.
 */
export const StorageProviderSchema = z.enum(['edge-config', 'redis', 'memory']);
export type StorageProvider = z.infer<typeof StorageProviderSchema>;

/**
 * Tier-based default flag values.
 * The key is a tier name; the value is a map of flag name → boolean default.
 */
export const TierDefaultsSchema = z.record(z.string(), z.record(z.string(), z.boolean()));
export type TierDefaults = z.infer<typeof TierDefaultsSchema>;

/**
 * Top-level configuration for the feature-flag runtime.
 */
export const FeatureFlagConfigSchema = z.object({
  /**
   * Primary storage provider for flag rules.
   * @default 'edge-config'
   */
  storageProvider: StorageProviderSchema.default('edge-config'),
  /**
   * Enable tenant-level Redis overrides on top of tier defaults.
   * Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
   * @default true
   */
  tenantOverridesEnabled: z.boolean().default(true),
  /**
   * Cache TTL for resolved flag bundles (milliseconds).
   * Set to 0 to disable caching (useful in development).
   * @default 60000 (1 minute)
   */
  cacheTtlMs: z.number().int().min(0).default(60_000),
  /**
   * Tier used when no billing tier can be resolved for a tenant.
   * @default 'starter'
   */
  fallbackTier: tierSchema.default('starter'),
  /**
   * Whether to emit structured log lines when flags are resolved.
   * @default false
   */
  debugLogging: z.boolean().default(false),
  /**
   * Tier-based default flag values. Overrides the hardcoded defaults built
   * into {@link TIER_DEFAULTS} when provided.
   */
  tierDefaults: TierDefaultsSchema.optional(),
});

export type FeatureFlagConfig = z.infer<typeof FeatureFlagConfigSchema>;

// ─── Parsed defaults ──────────────────────────────────────────────────────────

/**
 * Default configuration used when no explicit config is passed to the provider.
 */
export const DEFAULT_FEATURE_FLAG_CONFIG: FeatureFlagConfig = FeatureFlagConfigSchema.parse({});

/**
 * Parse and validate a partial configuration object.
 * Missing fields are filled from schema defaults.
 *
 * @throws {ZodError} When the provided object fails schema validation.
 */
export function parseFeatureFlagConfig(partial: Partial<FeatureFlagConfig>): FeatureFlagConfig {
  return FeatureFlagConfigSchema.parse(partial);
}
