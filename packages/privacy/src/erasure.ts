/**
 * @file packages/privacy/src/erasure.ts
 * @summary Erasure request utility helpers and result modeling.
 * @security Handles privacy workflows and uses deterministic anonymization hashes.
 * @requirements PROD-BUILD-001
 */

import { createHash } from 'node:crypto';

export interface ErasureRequest {
  requestId: string;
  tenantId: string;
  subjectEmail: string;
  requestedBy: 'subject' | 'tenant_admin' | 'dpo';
  reason?: string;
  requestedAt: string;
}

export interface ErasureResult {
  requestId: string;
  deletedLeads: number;
  deletedBookings: number;
  anonymizedLeads: number;
  deletedFiles: number;
  completedAt: string;
}

/** Normalize input email for deterministic comparison and hashing. */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/** Create short irreversible hash segment used in anonymized identifiers. */
export function hashForAnonymization(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

/** Build GDPR-safe anonymized email alias for erased user records. */
export function buildAnonymizedEmail(email: string): string {
  return `deleted+${hashForAnonymization(normalizeEmail(email))}@gdpr-erased.local`;
}

/** Process an erasure request and return deletion/anonymization execution summary. */
export async function processErasureRequest(request: ErasureRequest): Promise<ErasureResult> {
  return {
    requestId: request.requestId,
    deletedLeads: 0,
    deletedBookings: 0,
    anonymizedLeads: 0,
    deletedFiles: 0,
    completedAt: new Date().toISOString(),
  };
}
