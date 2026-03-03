/**
 * @file packages/core-engine/src/renderer/CacheComponent.tsx
 * @summary Next.js 16 PPR-aware cache wrapper component.
 * @description Provides component-level caching via the "use cache" directive and
 *   Suspense-based streaming for Partial Pre-rendering (PPR). Static shells are
 *   pre-rendered at build/request time; dynamic holes are streamed via Suspense.
 * @security Tags MUST include tenant_id to prevent cross-tenant cache pollution,
 *   e.g. `tenant:${tenantId}:page:${slug}`. Tags without tenant scoping are rejected
 *   by convention — callers are responsible for correct tag construction.
 * @requirements TASK-PPR-001
 */

import { Suspense, type ReactElement, type ReactNode } from 'react';
import { cacheTag, cacheLife } from 'next/cache';

// ─── Types ─────────────────────────────────────────────────────────────────

/**
 * Cache lifetime presets for common use cases.
 * Values are in seconds.
 */
export type CacheLifePreset = 'static' | 'hourly' | 'daily' | 'realtime';

/** Revalidation seconds for each cache life preset. */
export const CACHE_LIFE_SECONDS: Record<CacheLifePreset, number> = {
  static: 31_536_000, // 1 year
  hourly: 3_600, // 1 hour
  daily: 86_400, // 24 hours
  realtime: 0, // No caching
};

export interface CacheComponentProps {
  /** Content to render inside the Suspense streaming boundary. */
  children: ReactNode;
  /** Fallback shown during streaming hydration. Defaults to null. */
  fallback?: ReactNode;
}

// ─── Cached Data Helper ─────────────────────────────────────────────────────

/**
 * Fetches and caches data using the "use cache" directive.
 *
 * @param tag    - Cache tag for targeted invalidation (e.g. `tenant:${tenantId}:page:${slug}`).
 * @param fetcher - Async function that fetches the data to cache.
 * @param life   - Cache lifetime preset. Defaults to `'hourly'`.
 * @returns The cached (or freshly fetched) data.
 *
 * @example
 * ```ts
 * const pageData = await fetchWithCache(
 *   `tenant:${tenantId}:page:${slug}`,
 *   () => db.pages.findBySlug(slug),
 *   'hourly',
 * );
 * ```
 */
export async function fetchWithCache<T>(
  tag: string,
  fetcher: () => Promise<T>,
  life: CacheLifePreset = 'hourly',
): Promise<T> {
  'use cache';

  cacheTag(tag);
  const revalidate = CACHE_LIFE_SECONDS[life];
  // Always call cacheLife so Next.js knows the intended behaviour.
  // revalidate: 0 tells Next.js not to cache (realtime preset).
  cacheLife({ revalidate });

  return fetcher();
}

// ─── CacheComponent ─────────────────────────────────────────────────────────

/**
 * PPR-aware Suspense boundary for streaming dynamic content.
 *
 * Wraps `children` in a React `<Suspense>` boundary so that Next.js PPR can
 * stream dynamic holes into the pre-rendered static shell. Use `fetchWithCache`
 * inside the children to cache expensive data fetching with tagged invalidation.
 *
 * @example
 * ```tsx
 * // In a PPR-enabled Server Component page:
 * export default function Page() {
 *   return (
 *     <>
 *       <StaticHero />  {/* pre-rendered at build time */}
 *       <CacheComponent fallback={<Skeleton />}>
 *         <DynamicFeed tenantId={tenantId} />
 *       </CacheComponent>
 *     </>
 *   );
 * }
 * ```
 */
export function CacheComponent({
  children,
  fallback = null,
}: CacheComponentProps): ReactElement {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
