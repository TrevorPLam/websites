/**
 * @file packages/infrastructure/queue/index.ts
 * @summary Public exports for the background job queue subsystem.
 * @description Re-exports all queue primitives, job factories, and worker
 *   helpers. Import from `@repo/infrastructure/queue` to access the full
 *   surface.
 * @requirements PROD-004, TASK-012
 */

export * from './client';
export * from './jobs/email-job';
export * from './jobs/webhook-job';
export * from './workers/emailWorker';
export * from './workers/webhookWorker';
