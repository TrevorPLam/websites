import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryJobQueue } from '../queue/client';
import { createEmailJob } from '../queue/jobs/email-job';
import { createWebhookJob } from '../queue/jobs/webhook-job';
import { processEmailJob, type EmailAdapter } from '../queue/workers/emailWorker';
import { processWebhookJob } from '../queue/workers/webhookWorker';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

describe('InMemoryJobQueue', () => {
  let queue: InMemoryJobQueue;

  beforeEach(() => {
    queue = new InMemoryJobQueue();
  });

  it('enqueues a job with pending status', async () => {
    const job = await queue.enqueue({
      type: 'email',
      tenantId: TENANT_ID,
      payload: { to: 'a@b.com', subject: 'Hi', text: 'Hello' },
    });

    expect(job.status).toBe('pending');
    expect(job.type).toBe('email');
    expect(job.tenantId).toBe(TENANT_ID);
    expect(job.attempt).toBe(1);
  });

  it('dequeues the next pending job', async () => {
    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    const job = await queue.dequeue('email');

    expect(job).not.toBeNull();
    expect(job?.status).toBe('running');
  });

  it('returns null when queue is empty', async () => {
    const job = await queue.dequeue('email');
    expect(job).toBeNull();
  });

  it('acks a job to completed', async () => {
    const enqueued = await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    await queue.dequeue('email');
    await queue.ack(enqueued.id);

    const [completed] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(completed?.status).toBe('completed');
  });

  it('nacks a job back to pending on first failure', async () => {
    const enqueued = await queue.enqueue({
      type: 'email',
      tenantId: TENANT_ID,
      payload: {},
      maxAttempts: 3,
    });
    await queue.dequeue('email');
    await queue.nack(enqueued.id, 'SMTP error');

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.attempt).toBe(2);
    expect(job?.lastError).toBe('SMTP error');
  });

  it('dead-letters a job after maxAttempts is exhausted', async () => {
    const enqueued = await queue.enqueue({
      type: 'email',
      tenantId: TENANT_ID,
      payload: {},
      maxAttempts: 2,
    });

    for (let i = 0; i < 2; i++) {
      await queue.dequeue('email');
      await queue.nack(enqueued.id, 'persistent error');
    }

    const [dead] = await queue.listByTenant(TENANT_ID, 'dead_lettered');
    expect(dead).toBeDefined();
  });

  it('enforces tenant isolation in listByTenant', async () => {
    const OTHER_TENANT = '00000000-0000-0000-0000-000000000002';
    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    await queue.enqueue({ type: 'email', tenantId: OTHER_TENANT, payload: {} });

    const jobs = await queue.listByTenant(TENANT_ID);
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.tenantId).toBe(TENANT_ID);
  });

  it('returns correct queue depths', async () => {
    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    await queue.enqueue({ type: 'email', tenantId: TENANT_ID, payload: {} });
    await queue.enqueue({ type: 'webhook-retry', tenantId: TENANT_ID, payload: {} });

    const depths = queue.getDepths();
    expect(depths.get('email')).toBe(2);
    expect(depths.get('webhook-retry')).toBe(1);
  });
});

describe('createEmailJob', () => {
  it('builds valid email job input', () => {
    const input = createEmailJob(TENANT_ID, {
      to: 'user@example.com',
      subject: 'Welcome',
      text: 'Hello there',
    });

    expect(input.type).toBe('email');
    expect(input.tenantId).toBe(TENANT_ID);
    expect(input.maxAttempts).toBe(5);
    expect((input.payload as { to: string }).to).toBe('user@example.com');
  });

  it('rejects invalid email address', () => {
    expect(() =>
      createEmailJob(TENANT_ID, {
        to: 'not-an-email',
        subject: 'Hi',
        text: 'Hello',
      }),
    ).toThrow();
  });
});

describe('createWebhookJob', () => {
  it('builds valid webhook job input', () => {
    const input = createWebhookJob(TENANT_ID, {
      url: 'https://example.com/webhook',
      body: { event: 'lead.created' },
      eventType: 'lead.created',
    });

    expect(input.type).toBe('webhook-retry');
    expect(input.tenantId).toBe(TENANT_ID);
    expect(input.maxAttempts).toBe(5);
  });

  it('rejects invalid URL', () => {
    expect(() =>
      createWebhookJob(TENANT_ID, {
        url: 'not-a-url',
        body: {},
        eventType: 'test',
      }),
    ).toThrow();
  });
});

describe('processEmailJob (worker)', () => {
  it('acks job on successful send', async () => {
    const queue = new InMemoryJobQueue();
    const emailAdapter: EmailAdapter = { send: async () => undefined };

    await queue.enqueue(
      createEmailJob(TENANT_ID, {
        to: 'user@example.com',
        subject: 'Hello',
        text: 'Body',
      }),
    );

    const processed = await processEmailJob({ queue, emailAdapter });
    expect(processed).toBe(true);

    const [job] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(job).toBeDefined();
  });

  it('nacks job when adapter throws', async () => {
    const queue = new InMemoryJobQueue();
    const emailAdapter: EmailAdapter = {
      send: async () => {
        throw new Error('SMTP unavailable');
      },
    };

    await queue.enqueue(
      createEmailJob(TENANT_ID, {
        to: 'user@example.com',
        subject: 'Hello',
        text: 'Body',
      }),
    );

    await processEmailJob({ queue, emailAdapter });

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('SMTP unavailable');
  });

  it('returns false when queue is empty', async () => {
    const queue = new InMemoryJobQueue();
    const emailAdapter: EmailAdapter = { send: async () => undefined };

    const processed = await processEmailJob({ queue, emailAdapter });
    expect(processed).toBe(false);
  });
});

describe('processWebhookJob (worker)', () => {
  it('acks job on successful delivery', async () => {
    const queue = new InMemoryJobQueue();
    const fakeFetch = async (_url: string): Promise<Response> =>
      new Response('ok', { status: 200 });

    await queue.enqueue(
      createWebhookJob(TENANT_ID, {
        url: 'https://example.com/webhook',
        body: { event: 'test' },
        eventType: 'test',
      }),
    );

    const processed = await processWebhookJob({ queue, fetchImpl: fakeFetch });
    expect(processed).toBe(true);

    const [job] = await queue.listByTenant(TENANT_ID, 'completed');
    expect(job).toBeDefined();
  });

  it('nacks job on non-OK HTTP response', async () => {
    const queue = new InMemoryJobQueue();
    const fakeFetch = async (_url: string): Promise<Response> =>
      new Response('Bad Gateway', { status: 502, statusText: 'Bad Gateway' });

    await queue.enqueue(
      createWebhookJob(TENANT_ID, {
        url: 'https://example.com/webhook',
        body: { event: 'test' },
        eventType: 'test',
      }),
    );

    await processWebhookJob({ queue, fetchImpl: fakeFetch });

    const [job] = await queue.listByTenant(TENANT_ID, 'pending');
    expect(job?.lastError).toContain('502');
  });
});
