/**
 * @file packages/core-engine/src/index.ts
 * @summary Public API for the core-engine package.
 * @description Exports Puck editor configuration, component registry, theme bridge,
 *   PPR cache utilities, and shared type definitions for the JSON-driven page builder.
 * @requirements TASK-PUCK-001, TASK-PPR-001
 */

export * from './puck';

// PPR cache utilities (TASK-PPR-001)
export { CacheComponent, fetchWithCache, CACHE_LIFE_SECONDS } from './renderer';
export type { CacheComponentProps, CacheLifePreset } from './renderer';

// Re-export core types
export type { PageData, ComponentData } from './types';
