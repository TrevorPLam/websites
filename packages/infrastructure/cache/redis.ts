/**
 * @file packages/infrastructure/cache/redis.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { Redis } from '@upstash/redis';
import { getTenantContext } from '../context/tenant-context';

const redis = Redis.fromEnv();

function buildTenantKey(key: string, tenantId?: string): string {
  const activeTenantId = tenantId ?? getTenantContext()?.tenantId;
  if (!activeTenantId) {
    throw new Error('Tenant context is required for Redis operations.');
  }

  return `tenant:${activeTenantId}:${key}`;
}

/**
 * export async function tenantCacheSet(key: string, value: unknown, ttlSeconds?: number): Promise<void>.
 */
export async function tenantCacheSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const namespacedKey = buildTenantKey(key);
  if (ttlSeconds) {
    await redis.setex(namespacedKey, ttlSeconds, value);
    return;
  }

  await redis.set(namespacedKey, value);
}

/**
 * export async function tenantCacheGet<T>(key: string): Promise<T | null>.
 */
export async function tenantCacheGet<T>(key: string): Promise<T | null> {
  return redis.get<T>(buildTenantKey(key));
}

/**
 * export async function tenantCacheDelete(key: string): Promise<number>.
 */
export async function tenantCacheDelete(key: string): Promise<number> {
  return redis.del(buildTenantKey(key));
}
