import { describe, expect, it } from 'vitest';
import {
  AuditTrailLogger,
  GENESIS_HASH,
  canonicalize,
  computeHash,
} from '../audit/trail-logger';
import { verifyAuditChain } from '../audit/trail-verifier';
import { detectTampering } from '../audit/tamper-detection';
import type { AuditEntry } from '../audit/trail-logger';

const SIGNING_KEY = 'test-signing-key-that-is-at-least-32-chars!!';

function makeInMemoryStore() {
  const entries: AuditEntry[] = [];
  return {
    entries,
    persist: async (entry: AuditEntry) => { entries.push(entry); },
    getLastHash: async (tenantId: string) => {
      const tenantEntries = entries.filter((e) => e.tenantId === tenantId);
      return tenantEntries.at(-1)?.hash;
    },
  };
}

describe('AuditTrailLogger', () => {
  it('rejects signing keys shorter than 32 chars', () => {
    expect(() => new AuditTrailLogger({
      signingKey: 'short',
      persist: async () => {},
      getLastHash: async () => undefined,
    })).toThrow('at least 32 characters');
  });

  it('creates first entry with GENESIS previousHash', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    const entry = await logger.log({
      tenantId: 'tenant-1',
      action: 'data.create',
      actorId: 'user-1',
      resourceType: 'lead',
      resourceId: 'lead-1',
    });
    expect(entry.previousHash).toBe(GENESIS_HASH);
    expect(entry.hash).toHaveLength(64);
  });

  it('chains subsequent entries', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    const e1 = await logger.log({ tenantId: 't1', action: 'data.create', actorId: 'u1', resourceType: 'lead', resourceId: 'l1' });
    const e2 = await logger.log({ tenantId: 't1', action: 'data.update', actorId: 'u1', resourceType: 'lead', resourceId: 'l1' });
    expect(e2.previousHash).toBe(e1.hash);
  });

  it('isolates chains per tenant', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    const a = await logger.log({ tenantId: 'tenant-a', action: 'data.create', actorId: 'u', resourceType: 'r', resourceId: 'x' });
    const b = await logger.log({ tenantId: 'tenant-b', action: 'data.create', actorId: 'u', resourceType: 'r', resourceId: 'x' });
    expect(a.previousHash).toBe(GENESIS_HASH);
    expect(b.previousHash).toBe(GENESIS_HASH);
  });
});

describe('verifyAuditChain', () => {
  it('returns intact:true for a valid chain', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    for (let i = 0; i < 3; i++) {
      await logger.log({ tenantId: 't1', action: 'data.access', actorId: 'u', resourceType: 'r', resourceId: String(i) });
    }
    const report = verifyAuditChain(SIGNING_KEY, store.entries);
    expect(report.intact).toBe(true);
    expect(report.failedEntries).toBe(0);
  });

  it('detects a tampered hash', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    await logger.log({ tenantId: 't1', action: 'data.create', actorId: 'u', resourceType: 'r', resourceId: '1' });
    await logger.log({ tenantId: 't1', action: 'data.update', actorId: 'u', resourceType: 'r', resourceId: '1' });
    // Tamper with first entry's hash
    store.entries[0]!.hash = 'aabbcc';
    const report = verifyAuditChain(SIGNING_KEY, store.entries);
    expect(report.intact).toBe(false);
    expect(report.failedEntries).toBeGreaterThan(0);
  });
});

describe('detectTampering', () => {
  it('reports clean for an untouched chain', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    await logger.log({ tenantId: 't1', action: 'data.create', actorId: 'u', resourceType: 'r', resourceId: '1' });
    const result = detectTampering(SIGNING_KEY, store.entries, 1);
    expect(result.clean).toBe(true);
  });

  it('flags entry count mismatch', async () => {
    const store = makeInMemoryStore();
    const logger = new AuditTrailLogger({ signingKey: SIGNING_KEY, ...store });
    await logger.log({ tenantId: 't1', action: 'data.create', actorId: 'u', resourceType: 'r', resourceId: '1' });
    // expectedCount of 5 but only 1 entry
    const result = detectTampering(SIGNING_KEY, store.entries, 5);
    expect(result.clean).toBe(false);
    expect(result.issues.some((i) => i.kind === 'entry_count_mismatch')).toBe(true);
  });
});

describe('canonicalize / computeHash', () => {
  it('is deterministic', () => {
    const entry = {
      id: 'x',
      tenantId: 't',
      action: 'data.create' as const,
      actorId: 'a',
      resourceType: 'r',
      resourceId: '1',
      occurredAt: '2026-01-01T00:00:00.000Z',
      previousHash: GENESIS_HASH,
    };
    expect(canonicalize(entry)).toBe(canonicalize(entry));
    const h1 = computeHash(SIGNING_KEY, GENESIS_HASH, canonicalize(entry));
    const h2 = computeHash(SIGNING_KEY, GENESIS_HASH, canonicalize(entry));
    expect(h1).toBe(h2);
  });
});
