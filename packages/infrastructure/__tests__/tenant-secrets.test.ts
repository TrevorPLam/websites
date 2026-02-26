import { TenantSecretsManager } from '../security/tenant-secrets';

describe('TenantSecretsManager', () => {
  it('seals and reveals secret for same tenant context', async () => {
    const manager = new TenantSecretsManager('rsa');

    const envelope = await manager.sealSecret({
      tenantId: 'tenant_alpha',
      key: 'STRIPE_SECRET',
      value: 'sk_test_123',
    });

    const revealed = await manager.revealSecret(envelope);
    expect(revealed).toBe('sk_test_123');
    expect(envelope.algorithm).toContain('AES-256-GCM');
  });

  it('fails integrity check when tenant context is changed', async () => {
    const manager = new TenantSecretsManager('rsa');
    const envelope = await manager.sealSecret({
      tenantId: 'tenant_alpha',
      key: 'SUPABASE_SERVICE_KEY',
      value: 'super-secret',
    });

    const tamperedEnvelope = { ...envelope, tenantId: 'tenant_beta' };

    await expect(manager.revealSecret(tamperedEnvelope)).rejects.toThrow();
  });

  it('supports all migration phases through common interface', async () => {
    const phases = ['rsa', 'hybrid', 'pqc'] as const;

    for (const phase of phases) {
      const manager = new TenantSecretsManager(phase);
      const envelope = await manager.sealSecret({
        tenantId: 'tenant_phase',
        key: `KEY_${phase}`,
        value: `value_${phase}`,
      });

      const value = await manager.revealSecret(envelope);
      expect(value).toBe(`value_${phase}`);
    }
  });
});
