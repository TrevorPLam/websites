import { describe, expect, it } from 'vitest';
import { QueueObservability, createQueueObservability } from '../ops/observability';
import { QueueHealthChecker } from '../ops/health-check';

describe('QueueObservability', () => {
  it('tracks enqueued events', async () => {
    const obs = createQueueObservability();
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'enqueued', attempt: 1 });
    const m = obs.getMetricsForType('email')!;
    expect(m.enqueued).toBe(1);
  });

  it('tracks completed events and computes avgDurationMs', async () => {
    const obs = createQueueObservability();
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'running', attempt: 1 });
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1, durationMs: 100 });
    const m = obs.getMetricsForType('email')!;
    expect(m.completed).toBe(1);
    expect(m.avgDurationMs).toBe(100);
  });

  it('computes failure rate', async () => {
    const obs = createQueueObservability();
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1 });
    await obs.record({ jobId: 'j2', tenantId: 't1', jobType: 'email', status: 'failed', attempt: 3 });
    const m = obs.getMetricsForType('email')!;
    expect(m.failureRate).toBe(0.5);
  });

  it('fires alert on high failure rate', async () => {
    const alerts: string[] = [];
    const obs = createQueueObservability({
      thresholds: { failureRate: 0.1, minJobsForRateAlert: 2, deadLetterCount: 100 },
      onAlert: (a) => { alerts.push(a.kind); },
    });
    // 2 completed + 1 failed = 33% failure rate
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'crm', status: 'completed', attempt: 1 });
    await obs.record({ jobId: 'j2', tenantId: 't1', jobType: 'crm', status: 'completed', attempt: 1 });
    await obs.record({ jobId: 'j3', tenantId: 't1', jobType: 'crm', status: 'failed', attempt: 3 });
    expect(alerts).toContain('high_failure_rate');
  });

  it('tracks dead-lettered jobs', async () => {
    const obs = createQueueObservability();
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'dead_lettered', attempt: 5 });
    const m = obs.getMetricsForType('email')!;
    expect(m.deadLettered).toBe(1);
  });

  it('resets metrics', async () => {
    const obs = createQueueObservability();
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1 });
    obs.resetMetrics();
    const m = obs.getMetricsForType('email')!;
    expect(m.completed).toBe(0);
  });
});

describe('QueueHealthChecker', () => {
  it('reports healthy when all metrics are within bounds', async () => {
    const obs = createQueueObservability();
    const checker = new QueueHealthChecker(obs);
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1 });
    const report = checker.check();
    expect(report.status).toBe('healthy');
  });

  it('reports degraded when failure rate exceeds degraded threshold', async () => {
    const obs = createQueueObservability({
      thresholds: { failureRate: 0.05, minJobsForRateAlert: 1, deadLetterCount: 100 },
    });
    const checker = new QueueHealthChecker(obs, { degradedFailureRate: 0.1, unhealthyFailureRate: 0.5 });
    // 1 completed, 1 failed = 50% -> unhealthy threshold
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1 });
    await obs.record({ jobId: 'j2', tenantId: 't1', jobType: 'email', status: 'failed', attempt: 3 });
    const report = checker.check();
    expect(['degraded', 'unhealthy']).toContain(report.status);
  });

  it('toHttpResponse returns 200 for healthy', async () => {
    const obs = createQueueObservability();
    const checker = new QueueHealthChecker(obs);
    await obs.record({ jobId: 'j1', tenantId: 't1', jobType: 'email', status: 'completed', attempt: 1 });
    const { statusCode } = checker.toHttpResponse();
    expect(statusCode).toBe(200);
  });
});
