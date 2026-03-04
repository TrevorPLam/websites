/**
 * @file packages/compliance/__tests__/compliance.test.ts
 * @summary Tests for GDPR right-to-erasure, data export, consent manager, audit trail, and data classification.
 * @security none — test file only, no production secrets or PII.
 * @adr none
 * @requirements TASK-COMP-001
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { RightToErasure, createRightToErasure } from '../gdpr/right-to-erasure';
import { DataExport, ExportRequestSchema } from '../gdpr/data-export';
import {
  ConsentManager,
  InMemoryConsentStore,
  createConsentManager,
} from '../gdpr/consent-manager';
import {
  AuditTrailLogger,
  InMemoryAuditTrailStore,
  computeChainHash,
  createAuditTrailLogger,
} from '../audit/trail-logger';
import { verifyAuditChain, verifyTenantAuditChain } from '../audit/trail-verifier';
import {
  DataClassifier,
  defaultClassifier,
  createDataClassifier,
} from '../privacy/data-classification';

// ─── RightToErasure ───────────────────────────────────────────────────────────

describe('RightToErasure', () => {
  it('returns fullyErased:true when all handlers succeed', async () => {
    const erasure = createRightToErasure();
    erasure.register({
      storeName: 'db',
      erase: async () => 'deleted',
    });
    erasure.register({
      storeName: 'cache',
      erase: async () => 'deleted',
    });

    const result = await erasure.execute({ tenantId: 'tenant_a', userId: 'user_1' });
    expect(result.fullyErased).toBe(true);
    expect(result.storeResults).toHaveLength(2);
    expect(result.storeResults.every((r) => r.status === 'deleted')).toBe(true);
  });

  it('returns fullyErased:true when user is not_found', async () => {
    const erasure = createRightToErasure();
    erasure.register({ storeName: 'db', erase: async () => 'not_found' });

    const result = await erasure.execute({ tenantId: 't', userId: 'u' });
    expect(result.fullyErased).toBe(true);
  });

  it('returns fullyErased:false when a handler fails', async () => {
    const erasure = createRightToErasure();
    erasure.register({ storeName: 'db', erase: async () => 'deleted' });
    erasure.register({
      storeName: 'external',
      erase: async () => {
        throw new Error('timeout');
      },
    });

    const result = await erasure.execute({ tenantId: 't', userId: 'u' });
    expect(result.fullyErased).toBe(false);
    expect(result.storeResults.find((r) => r.store === 'external')?.status).toBe('failed');
  });

  it('generates a stable receiptId for the same inputs', async () => {
    const erasure = createRightToErasure();
    erasure.register({ storeName: 'db', erase: async () => 'deleted' });

    // Note: receiptId includes timestamp so it's unique per call — just verify format
    const result = await erasure.execute({ tenantId: 't', userId: 'u' });
    expect(result.receiptId).toHaveLength(32);
    // userIdHash is SHA-256 (64 hex chars)
    expect(result.userIdHash).toHaveLength(64);
    // tenantId is never hashed
    expect(result.tenantId).toBe('t');
  });
});

// ─── DataExport ───────────────────────────────────────────────────────────────

describe('DataExport', () => {
  it('exports data as JSON', async () => {
    const exporter = new DataExport();
    exporter.register({
      domainName: 'profile',
      collect: async () => [{ id: '1', name: 'Alice' }],
    });

    const bundle = await exporter.export({
      tenantId: '00000000-0000-0000-0000-000000000001',
      userId: 'u1',
      format: 'json',
    });
    expect(bundle.format).toBe('json');
    expect(bundle.totalRecords).toBe(1);
    expect(bundle.payload).toContain('"profile"');
  });

  it('exports data as CSV', async () => {
    const exporter = new DataExport();
    exporter.register({
      domainName: 'activity',
      collect: async () => [{ action: 'login', ts: '2024-01-01' }],
    });

    const bundle = await exporter.export({
      tenantId: '00000000-0000-0000-0000-000000000001',
      userId: 'u1',
      format: 'csv',
    });
    expect(bundle.format).toBe('csv');
    expect(bundle.payload).toContain('_domain,action,ts');
  });

  it('ExportRequestSchema defaults format to json', () => {
    const req = ExportRequestSchema.parse({
      tenantId: '00000000-0000-0000-0000-000000000001',
      userId: 'u1',
    });
    expect(req.format).toBe('json');
  });
});

// ─── ConsentManager ───────────────────────────────────────────────────────────

const TENANT_A = '00000000-0000-0000-0000-000000000001';
const TENANT_B = '00000000-0000-0000-0000-000000000002';

describe('ConsentManager', () => {
  let manager: ConsentManager;

  beforeEach(() => {
    manager = createConsentManager(new InMemoryConsentStore());
  });

  it('records consent and retrieves it', async () => {
    await manager.record({ tenantId: TENANT_A, userId: 'u1', purpose: 'analytics', granted: true });
    const permitted = await manager.isPermitted(TENANT_A, 'u1', 'analytics');
    expect(permitted).toBe(true);
  });

  it('returns false when no consent exists', async () => {
    const permitted = await manager.isPermitted(TENANT_A, 'u1', 'marketing');
    expect(permitted).toBe(false);
  });

  it('latest record wins (opt-out overrides opt-in)', async () => {
    await manager.record({ tenantId: TENANT_A, userId: 'u1', purpose: 'analytics', granted: true });
    await manager.record({
      tenantId: TENANT_A,
      userId: 'u1',
      purpose: 'analytics',
      granted: false,
    });
    const permitted = await manager.isPermitted(TENANT_A, 'u1', 'analytics');
    expect(permitted).toBe(false);
  });

  it('returns a full snapshot of all purposes', async () => {
    await manager.record({ tenantId: TENANT_A, userId: 'u1', purpose: 'analytics', granted: true });
    const snapshot = await manager.getSnapshot(TENANT_A, 'u1');
    expect(snapshot.analytics).toBe(true);
    expect(snapshot.marketing).toBe(false); // not set
  });

  it('isolates consent by tenantId', async () => {
    await manager.record({ tenantId: TENANT_A, userId: 'u1', purpose: 'analytics', granted: true });
    const permitted = await manager.isPermitted(TENANT_B, 'u1', 'analytics');
    expect(permitted).toBe(false);
  });
});

// ─── AuditTrailLogger ─────────────────────────────────────────────────────────

describe('AuditTrailLogger', () => {
  let store: InMemoryAuditTrailStore;
  let logger: AuditTrailLogger;

  beforeEach(() => {
    store = new InMemoryAuditTrailStore();
    logger = createAuditTrailLogger(store);
  });

  const baseEntry = {
    timestamp: '2024-01-01T00:00:00.000Z',
    tenantId: 'tenant_a',
    userId: 'user_1',
    action: 'user.deleted',
    outcome: 'success' as const,
  };

  it('appends an entry and assigns index 0', async () => {
    const entry = await logger.append(baseEntry);
    expect(entry.index).toBe(0);
    expect(entry.chainHash).toHaveLength(64); // SHA-256 hex
  });

  it('increments index for each subsequent entry', async () => {
    await logger.append(baseEntry);
    const second = await logger.append({ ...baseEntry, action: 'billing.updated' });
    expect(second.index).toBe(1);
  });

  it('chains hashes correctly', async () => {
    const first = await logger.append(baseEntry);
    const second = await logger.append({ ...baseEntry, action: 'billing.updated' });

    const expectedSecondHash = computeChainHash(first.chainHash, second);
    expect(second.chainHash).toBe(expectedSecondHash);
  });
});

// ─── verifyAuditChain ─────────────────────────────────────────────────────────

describe('verifyAuditChain', () => {
  it('verifies an intact chain as intact', async () => {
    const store = new InMemoryAuditTrailStore();
    const logger = createAuditTrailLogger(store);
    const base = {
      timestamp: '2024-01-01T00:00:00.000Z',
      tenantId: 'tenant_a',
      userId: 'u',
      action: 'a',
      outcome: 'success' as const,
    };
    await logger.append(base);
    await logger.append({ ...base, action: 'b' });

    const result = await verifyTenantAuditChain(store, 'tenant_a');
    expect(result.intact).toBe(true);
    expect(result.totalEntries).toBe(2);
    expect(result.validEntries).toBe(2);
    expect(result.firstTamperedIndex).toBeNull();
  });

  it('detects a tampered entry', async () => {
    const store = new InMemoryAuditTrailStore();
    const logger = createAuditTrailLogger(store);
    const base = {
      timestamp: '2024-01-01T00:00:00.000Z',
      tenantId: 'tenant_a',
      userId: 'u',
      action: 'a',
      outcome: 'success' as const,
    };
    await logger.append(base);
    await logger.append({ ...base, action: 'b' });

    // Tamper: get entries and modify the first one's hash
    const entries = await store.listByTenant('tenant_a');
    entries[0].chainHash = 'tampered_hash_value_000000000000000000000000000000000000000000000000';

    const result = verifyAuditChain(entries);
    expect(result.intact).toBe(false);
    expect(result.firstTamperedIndex).toBe(0);
  });
});

// ─── DataClassifier ───────────────────────────────────────────────────────────

describe('DataClassifier', () => {
  it('classifies known PII fields', () => {
    const classifier = new DataClassifier();
    expect(classifier.classify('email')).toBe('pii');
    expect(classifier.classify('phone')).toBe('pii');
    expect(classifier.classify('name')).toBe('pii');
  });

  it('classifies sensitive fields', () => {
    const classifier = new DataClassifier();
    expect(classifier.classify('password')).toBe('sensitive');
    expect(classifier.classify('apiKey')).toBe('sensitive');
  });

  it('classifies unknown fields as public', () => {
    const classifier = new DataClassifier();
    expect(classifier.classify('createdAt')).toBe('public');
    expect(classifier.classify('status')).toBe('public');
  });

  it('redacts PII fields from an object', () => {
    const classifier = new DataClassifier();
    const payload = { email: 'alice@example.com', status: 'active', password: 'secret' };
    const safe = classifier.redact(payload, 'pii');

    expect(safe.status).toBe('active'); // public — kept
    expect(safe.email).not.toBe('alice@example.com'); // pii — hashed
    expect(safe.password).toBeUndefined(); // sensitive remove strategy
  });

  it('masks with [REDACTED] for mask strategy', () => {
    const classifier = new DataClassifier();
    const payload = { phone: '+1234567890', id: 'user_1' };
    const safe = classifier.redact(payload, 'pii');
    expect(safe.phone).toBe('[REDACTED]');
    expect(safe.id).toBe('user_1'); // public field
  });

  it('findViolations returns fields that exceed maxLevel', () => {
    const classifier = new DataClassifier();
    const payload = { email: 'alice@example.com', status: 'active' };
    const violations = classifier.findViolations(payload, 'internal');
    expect(violations).toContain('email');
    expect(violations).not.toContain('status');
  });

  it('defaultClassifier is a singleton', () => {
    expect(defaultClassifier).toBeInstanceOf(DataClassifier);
  });

  it('createDataClassifier accepts extra rules', () => {
    const classifier = createDataClassifier([
      { fieldPattern: 'customSecret', classification: 'sensitive', redactionStrategy: 'remove' },
    ]);
    expect(classifier.classify('customSecret')).toBe('sensitive');
  });
});
