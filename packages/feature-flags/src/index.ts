/**
 * @file packages/feature-flags/src/index.ts
 * @summary Public barrel for the @repo/feature-flags package.
 * @security Exports contain server-side Redis/Edge-Config logic; import only server-side unless using client-safe hooks/provider.
 * @adr none
 * @requirements TASK-011
 */
export * from './feature-flags';
export * from './types';
export * from './evaluate';
export * from './analytics';
export * from './site-config';
export * from './config';
export * from './flags';
export {
  FeatureFlagProvider,
  useFeatureFlags,
  useFlag,
  readFeatureFlagsFromHeaders,
} from './provider';
export type { ResolvedFlags, FeatureFlagProviderProps } from './provider';
