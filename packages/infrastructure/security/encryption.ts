/**
 * @file packages/infrastructure/security/encryption.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export interface EncryptedPayload {
  iv: string;
  authTag: string;
  ciphertext: string;
}

function deriveTenantKey(masterKey: string, tenantId: string): Buffer {
  return createHash('sha256').update(`${masterKey}:${tenantId}`).digest();
}

/**
 * export function encryptForTenant(value: string, tenantId: string, masterKey: string): EncryptedPayload.
 */
export function encryptForTenant(
  value: string,
  tenantId: string,
  masterKey: string
): EncryptedPayload {
  const iv = randomBytes(IV_LENGTH);
  const key = deriveTenantKey(masterKey, tenantId);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from(tenantId, 'utf8'));

  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);

  return {
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
    ciphertext: encrypted.toString('base64'),
  };
}

/**
 * export function decryptForTenant(.
 */
export function decryptForTenant(
  payload: EncryptedPayload,
  tenantId: string,
  masterKey: string
): string {
  const key = deriveTenantKey(masterKey, tenantId);
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, 'base64'));
  decipher.setAAD(Buffer.from(tenantId, 'utf8'));
  decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
