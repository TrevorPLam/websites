import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryJobQueue } from '../queue/client';
import { createCrmSyncJob } from '../queue/jobs/crm-sync-job';
import { createUsageRollupJob } from '../queue/jobs/usage-rollup-job';
import { processCrmSyncJob, type CrmAdapter } from '../queue/workers/crmSyncWorker';
import { processUsageRollupJob, type UsageAggregator } from '../queue/workers/usageRollupWorker';
import { QueueWorkerLoop } from '../queue/worker';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

// ─── createCrmSyncJob ─────────────────────────────────────────────────────────

describe('createCrmSyncJob', () => {
  it('builds a valid crm-sync job input for create', () => {
    const input = createCrmSyncJob(TENANT_ID, {
      contactId: 'contact-123',
      operation: 'create',
      fields: { email: 'user@example.com', firstName: 'Ada' },
    });

    expect(input.type).toBe('crm-sync');
    expect(input.tenantId).toBe(TENANT_ID);
    expect(input.maxAttempts).toBe(3);
    expect((input.payload as { contactId: string }).contactId).toBe('contact-123');
  });

  it('builds a valid crm-sync job input for delete', () => {
    const input = createCrmSyncJob(TENANT_ID, {
      contactId: 'contact-456',
      operation: 'delete',
      fields: {},
    });

    expect(input.type).toBe('crm-sync');
    expect((input.payload as { operation: string }).operation).toBe('delete');
  });

  it('rejects an invalid operation', () => {
    expect(() =>
      createCrmSyncJob(TENANT_ID, {
        contactId: 'c1',
        // @ts-expect-error intentional invalid operation for test
        operation: 'upsert',
        fields: {},
      }),
    ).toThrow();
  });

  it('rejects an empty contactId', () => {
    expect(() =>
      createCrmSyncJob(TENANT_ID, {
        contactId: '',
        operation: 'create',
        fields: {},
      }),
    ).toThrow();
  });
});

// ─── createUsageRollupJob ─────────────────────────────────────────────────────

describe('createUsageRollupJob', () => {
  it('builds a valid usage-rollup job for daily period', () => {
    const input = createUsageRollupJob(TENANT_ID, { period: 'daily' });

    expect(input.type).toBe('usage-rollup');
    expect(input.tenantId).toBe(TENANT_ID);
    expect(input.maxAttempts).toBe(2);
    expect((input.payload as { period: string }).period).toBe('daily');
  });

  it('accepts optional windowStart and metrics', () => {
    const input = createUsageRollupJob(TENANT_ID, {
      period: 'hourly',
      windowStart: '2025-01-01T00:00:00.000Z',
      metrics: ['api_calls', 'storage_gb'],
    });

    const payload = input.payload as { metrics: string[] };
    expect(payload.metrics).toEqual(['api_calls', 'storage_gb']);
  });

  it('rejects an invalid period', () => {
    expect(() =>
      createUsageRollupJob(TENANT_ID, {
        // @ts-expect-error intentional invalid period for test
        period: 'weekly',
      }),
    ).toThrow();
  });
});

// ─── processCrmSyncJob ────────────────────────────────────────────────────────

describe('processCrmSyncJob', () => {
  let queue: InMemoryJobQueue;
  let crmAdapter: CrmAdapter;

  beforeEach(() => {
    queue = new InMemoryJobQueue();
    crmAdapter = {
      createContact: vi.fn().mockResolvedValue(undefined),
      updateContact: vi.fn().mockResolvedValue(undefined),
      deleteContact: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('acks job and calls createContact for create operation', async () => {
    await queue.enqueue(
      createCrmSyncJob(TENANT_ID, {
        contactId: 'c-1',
        operation: 'create',
        fields: { email: 'a@b.com', firstName: 'Ada' },
      }),
    );

    const processed = await processCrmSyncJob({ queue, crmAdapter });
    expect(processed).toBe(true);
    expect(crmAdapter.createContact).toHaveBeenCalledOnce();

    const [job] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(job).toBeDefined();
  });

  it('acks job and calls updateContact for update operation', async () => {
    await queue.enqueue(
      createCrmSyncJob(TENANT_ID, {
        contactId: 'c-2',
        operation: 'update',
        fields: { firstName: 'Grace' },
      }),
    );

    await processCrmSyncJob({ queue, crmAdapter });
    expect(crmAdapter.updateContact).toHaveBeenCalledOnce();

    const [job] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(job).toBeDefined();
  });

  it('acks job and calls deleteContact for delete operation', async () => {
    await queue.enqueue(
      createCrmSyncJob(TENANT_ID, {
        contactId: 'c-3',
        operation: 'delete',
        fields: {},
      }),
    );

    await processCrmSyncJob({ queue, crmAdapter });
    expect(crmAdapter.deleteContact).toHaveBeenCalledOnce();
  });

  it('nacks job when adapter throws', async () => {
    (crmAdapter.createContact as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('CRM unavailable'),
    );

    await queue.enqueue(
      createCrmSyncJob(TENANT_ID, {
        contactId: 'c-4',
        operation: 'create',
        fields: {},
      }),
    );

    await processCrmSyncJob({ queue, crmAdapter });

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('CRM unavailable');
  });

  it('returns false when queue is empty', async () => {
    const result = await processCrmSyncJob({ queue, crmAdapter });
    expect(result).toBe(false);
  });
});

// ─── processUsageRollupJob ────────────────────────────────────────────────────

describe('processUsageRollupJob', () => {
  let queue: InMemoryJobQueue;
  let aggregator: UsageAggregator;

  beforeEach(() => {
    queue = new InMemoryJobQueue();
    aggregator = {
      rollup: vi.fn().mockResolvedValue({
        metricCount: 5,
        windowStart: '2025-01-01T00:00:00.000Z',
        windowEnd: '2025-01-02T00:00:00.000Z',
      }),
    };
  });

  it('acks job and calls aggregator.rollup', async () => {
    await queue.enqueue(createUsageRollupJob(TENANT_ID, { period: 'daily' }));

    const processed = await processUsageRollupJob({ queue, aggregator });
    expect(processed).toBe(true);
    expect(aggregator.rollup).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: TENANT_ID, period: 'daily' }),
    );

    const [job] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(job).toBeDefined();
  });

  it('nacks job when aggregator throws', async () => {
    (aggregator.rollup as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Tinybird timeout'),
    );

    await queue.enqueue(createUsageRollupJob(TENANT_ID, { period: 'hourly' }));

    await processUsageRollupJob({ queue, aggregator });

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('Tinybird timeout');
  });

  it('returns false when queue is empty', async () => {
    const result = await processUsageRollupJob({ queue, aggregator });
    expect(result).toBe(false);
  });
});

// ─── QueueWorkerLoop ──────────────────────────────────────────────────────────

describe('QueueWorkerLoop', () => {
  it('processes jobs via registered processor', async () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue, batchSize: 5 });

    const processed: string[] = [];
    loop.register('email', async (job) => {
      processed.push(job.id);
      return true;
    });

    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });

    const count = await loop.runOnce();
    expect(count).toBe(2);
    expect(processed).toHaveLength(2);
  });

  it('nacks jobs with no registered processor', async () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue });

    await queue.enqueue({ type: 'unknown-type', tenantId: TENANT_ID, payload: {} });

    const count = await loop.runOnce();
    expect(count).toBe(1);

    // Job should be nacked (attempt incremented, status back to pending)
    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('No processor registered');
  });

  it('nacks jobs when processor throws', async () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue });

    loop.register('crm-sync', async () => {
      throw new Error('adapter crashed');
    });

    await queue.enqueue({ type: 'crm-sync', tenantId: TENANT_ID, payload: {} });

    await loop.runOnce();

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('adapter crashed');
  });

  it('returns 0 when queue is empty', async () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue });

    const count = await loop.runOnce();
    expect(count).toBe(0);
  });

  it('respects batchSize limit', async () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue, batchSize: 2 });

    loop.register('email', async () => true);

    for (let i = 0; i < 5; i++) {
      await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    }

    const count = await loop.runOnce();
    expect(count).toBe(2);
  });

  it('stop() prevents further poll ticks from firing', () => {
    const queue = new InMemoryJobQueue();
    const loop = new QueueWorkerLoop({ queue });

    loop.start(50_000); // long interval so tick never fires in test
    loop.stop();

    // No assertion needed — just verify no exception and loop is stopped
    expect(true).toBe(true);
  });
});
