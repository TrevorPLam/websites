/**
 * @file packages/compliance/privacy/index.ts
 * @summary Public barrel for privacy utilities.
 * @security Re-exports data classification utilities — use redact() before logging or sending to clients.
 * @adr none
 * @requirements TASK-COMP-001
 */

export * from './data-classification';
