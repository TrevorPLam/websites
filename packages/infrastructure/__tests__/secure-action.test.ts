/**
 * @file packages/infra/__tests__/secure-action.test.ts
 * Tests for secureAction wrapper (security-1)
 */

import { z } from 'zod';
import { secureAction } from '../security/secure-action';
import { auditLogger } from '../security/audit-logger';

const testSchema = z.object({ value: z.string().min(1) });

describe('secureAction', () => {
  beforeEach(() => {
    auditLogger.clear();
  });

  it('returns success with validated data', async () => {
    const result = await secureAction(
      { value: 'hello' },
      testSchema,
      async (_ctx, data) => ({ echo: data.value }),
      { actionName: 'test-action' }
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ echo: 'hello' });
    }
  });

  it('returns VALIDATION_ERROR for invalid input', async () => {
    const result = await secureAction(
      { value: '' },
      testSchema,
      async () => ({ never: 'called' }),
      { actionName: 'test-action' }
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('returns VALIDATION_ERROR for completely invalid input type', async () => {
    const result = await secureAction(null, testSchema, async () => ({ never: 'called' }), {
      actionName: 'test-action',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('returns INTERNAL_ERROR when handler throws', async () => {
    const result = await secureAction(
      { value: 'ok' },
      testSchema,
      async () => {
        throw new Error('Something went wrong');
      },
      { actionName: 'test-action' }
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INTERNAL_ERROR');
    }
  });

  it('returns UNAUTHORIZED when requireAuth is true and user is anonymous', async () => {
    const result = await secureAction(
      { value: 'ok' },
      testSchema,
      async () => ({ authorized: true }),
      { actionName: 'protected-action', requireAuth: true }
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNAUTHORIZED');
    }
  });

  it('writes audit log entries', async () => {
    await secureAction({ value: 'ok' }, testSchema, async (_ctx, data) => data, {
      actionName: 'audit-test',
    });

    const entries = auditLogger.getEntries();
    expect(entries.length).toBeGreaterThanOrEqual(1);
    const successEntry = entries.find((e) => e.status === 'success');
    expect(successEntry).toBeDefined();
    expect(successEntry?.action).toBe('audit-test');
  });

  it('includes correlationId in context', async () => {
    let capturedCorrelationId: string | undefined;

    await secureAction(
      { value: 'test' },
      testSchema,
      async (ctx) => {
        capturedCorrelationId = ctx.correlationId;
        return {};
      },
      { actionName: 'correlation-test' }
    );

    expect(capturedCorrelationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });
});
