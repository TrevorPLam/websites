/**
 * @file packages/core-engine/src/index.ts
 * @summary Public API for the core-engine package.
 * @description Exports Puck editor configuration, component registry, theme bridge,
 *   and shared type definitions for the JSON-driven page builder.
 * @requirements TASK-PUCK-001
 */

export * from './puck';

// Re-export core types
export type { PageData, ComponentData } from './types';
export type { PuckConfig } from './puck/config';
