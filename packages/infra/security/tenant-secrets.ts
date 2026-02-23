/**
 * @file packages/infra/security/tenant-secrets.ts
 * @summary Per-tenant secret manager with envelope metadata and tenant-bound authenticated encryption.
 * @exports TenantSecretEnvelope, TenantSecretsManager
 * @invariants Secrets are encrypted with tenantId as AAD so ciphertext cannot be decrypted under another tenant context.
 * @gotchas Tenant IDs are part of integrity checks; changing tenant ID invalidates prior ciphertext by design.
 */

import { createCryptoProvider, type MigrationPhase } from './crypto-provider';

export interface TenantSecretEnvelope {
  tenantId: string;
  key: string;
  cipherText: string;
  algorithm: string;
  rotationVersion: number;
}

export class TenantSecretsManager {
  constructor(private readonly migrationPhase: MigrationPhase = 'rsa') {}

  async sealSecret(params: {
    tenantId: string;
    key: string;
    value: string;
    rotationVersion?: number;
  }): Promise<TenantSecretEnvelope> {
    const provider = createCryptoProvider(this.migrationPhase);
    const aad = `${params.tenantId}:${params.key}`;

    const cipherText = await provider.encrypt(params.value, aad);

    return {
      tenantId: params.tenantId,
      key: params.key,
      cipherText,
      algorithm: provider.algorithmName,
      rotationVersion: params.rotationVersion ?? 1,
    };
  }

  async revealSecret(envelope: TenantSecretEnvelope): Promise<string> {
    const provider = createCryptoProvider(this.migrationPhase);
    const aad = `${envelope.tenantId}:${envelope.key}`;
    return provider.decrypt(envelope.cipherText, aad);
  }
}
