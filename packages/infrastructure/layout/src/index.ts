/**
 * @file packages/infrastructure/layout/src/index.ts
 * Task: [F.4] Layout system — barrel export
 *
 * Purpose: Public API for @repo/infrastructure-layout.
 *          Re-exports Grid, Flex, Stack, responsive utilities, and layout helpers.
 *
 * Usage:
 *   import { Grid, Flex, Stack, useBreakpoint } from '@repo/infrastructure-layout';
 */

export * from './grid';
export * from './flexbox';
export * from './responsive';
export * from './utils';
