/**
 * @file packages/compliance/src/index.ts
 * @summary Public root barrel for the @repo/compliance package.
 * @security All exports require server-side tenantId resolution before use.
 * @adr none
 * @requirements TASK-COMP-001
 */

export * from '../gdpr';
export * from '../audit';
export * from '../privacy';
