/**
 * @file packages/compliance/audit/index.ts
 * @summary Public barrel for audit trail utilities.
 * @security Re-exports hash-chained trail utilities — see individual files for security notes.
 * @adr none
 * @requirements TASK-COMP-001
 */

export * from './trail-logger';
export * from './trail-verifier';
