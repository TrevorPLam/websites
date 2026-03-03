/**
 * @file packages/services/src/tests/contracts/email-service.contract.ts
 * @summary Shared contract specification for {@link EmailPort} adapters.
 * @description Defines a reusable test suite (via Vitest's `describe`) that
 *   every adapter implementation MUST pass. Import this file in adapter-specific
 *   spec files and call `runEmailPortContract(factory)` with a factory that
 *   returns the adapter under test.
 *
 *   This is the "consumer-driven contract" pattern: the contract is defined
 *   once here and each adapter must satisfy it independently of the provider.
 *
 * @example
 * ```ts
 * // packages/services/src/email/adapters/tests/native.contract.spec.ts
 * import { runEmailPortContract } from '../../tests/contracts/email-service.contract';
 * import { NativeAdapter } from '../native.adapter';
 *
 * runEmailPortContract(() =>
 *   new NativeAdapter({ dryRun: true })
 * );
 * ```
 * @requirements TASK-SVC-002-REV
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { EmailPort, SendEmailRequest } from '@repo/service-ports/email';

// ─── Fixture helpers ─────────────────────────────────────────────────────────

/** Minimal valid send request for contract tests. */
export function buildSendRequest(
  overrides: Partial<SendEmailRequest> = {},
): SendEmailRequest {
  return {
    tenantId: 'tenant-test-123',
    to: 'recipient@example.com',
    subject: 'Contract test subject',
    html: '<p>Contract test body</p>',
    emailType: 'contract_test',
    ...overrides,
  };
}

// ─── Contract suite ──────────────────────────────────────────────────────────

/**
 * Runs the shared {@link EmailPort} behavioural contract against any adapter.
 *
 * @param factory - A zero-argument function that returns a fresh adapter
 *   instance before each test.
 */
export function runEmailPortContract(
  factory: () => EmailPort,
): void {
  describe('EmailPort contract', () => {
    let adapter: EmailPort;

    beforeEach(() => {
      adapter = factory();
    });

    // ── send ──────────────────────────────────────────────────────────────

    describe('send()', () => {
      it('returns a result with a non-empty id', async () => {
        const result = await adapter.send(buildSendRequest());

        expect(result.id).toBeTruthy();
        expect(typeof result.id).toBe('string');
      });

      it('returns a recognised status value', async () => {
        const result = await adapter.send(buildSendRequest());

        expect(['sent', 'queued', 'failed']).toContain(result.status);
      });

      it('accepts an array of recipients', async () => {
        const result = await adapter.send(
          buildSendRequest({ to: ['a@example.com', 'b@example.com'] }),
        );

        expect(result.id).toBeTruthy();
      });

      it('accepts optional fields without throwing', async () => {
        const result = await adapter.send(
          buildSendRequest({
            text: 'Plain text fallback',
            replyTo: 'reply@example.com',
            cc: ['cc@example.com'],
            bcc: ['bcc@example.com'],
            idempotencyKey: 'idem-key-001',
          }),
        );

        expect(result.id).toBeTruthy();
      });

      it('returns unique IDs for distinct sends', async () => {
        const [a, b] = await Promise.all([
          adapter.send(buildSendRequest()),
          adapter.send(buildSendRequest({ subject: 'Different subject' })),
        ]);

        expect(a.id).not.toBe(b.id);
      });
    });

    // ── sendBatch ─────────────────────────────────────────────────────────

    describe('sendBatch()', () => {
      it('returns one result per request', async () => {
        const requests = [
          buildSendRequest({ to: 'first@example.com' }),
          buildSendRequest({ to: 'second@example.com' }),
          buildSendRequest({ to: 'third@example.com' }),
        ];

        const results = await adapter.sendBatch(requests);

        expect(results).toHaveLength(requests.length);
        results.forEach((r) => {
          expect(r.id).toBeTruthy();
          expect(['sent', 'queued', 'failed']).toContain(r.status);
        });
      });

      it('handles an empty array without throwing', async () => {
        const results = await adapter.sendBatch([]);

        expect(results).toEqual([]);
      });
    });
  });
}
