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

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function hashForAnonymization(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

export function buildAnonymizedEmail(email: string): string {
  return `deleted+${hashForAnonymization(normalizeEmail(email))}@gdpr-erased.local`;
}

export async function processErasureRequest(request: ErasureRequest): Promise<ErasureResult> {
  const _normalizedEmail = normalizeEmail(request.subjectEmail);

  return {
    requestId: request.requestId,
    deletedLeads: 0,
    deletedBookings: 0,
    anonymizedLeads: 0,
    deletedFiles: 0,
    completedAt: new Date().toISOString(),
  };
}
