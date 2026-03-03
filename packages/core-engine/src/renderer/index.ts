/**
 * @file packages/core-engine/src/renderer/index.ts
 * @summary Public barrel export for the renderer module.
 * @description Aggregates PPR cache utilities and streaming boundary helpers
 *   for the JSON-driven page rendering pipeline.
 * @requirements TASK-PPR-001
 */

export {
  CacheComponent,
  fetchWithCache,
  CACHE_LIFE_SECONDS,
} from './CacheComponent';

export type { CacheComponentProps, CacheLifePreset } from './CacheComponent';
