/**
 * @file packages/infrastructure/experiments/index.ts
 * @summary Public barrel for the experiments sub-package.
 * @security All experiment operations are tenant-scoped; never share locks or data across tenants.
 * @adr none
 * @requirements TASK-AI-004-REV, TASK-011
 */
export * from './ab-testing.ts';
export * from './experiment-mutex.ts';
export * from './feature-flags.ts';
export * from './guardrails.ts';
export * from './component-overlap-checks';
export * from './traffic-split';
