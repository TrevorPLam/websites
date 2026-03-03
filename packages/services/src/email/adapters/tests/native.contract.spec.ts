/**
 * @file packages/services/src/email/adapters/tests/native.contract.spec.ts
 * @summary Contract test suite for {@link NativeAdapter}.
 * @description Runs the shared {@link EmailPort} contract against the native
 *   dry-run adapter to verify interface compliance without any I/O.
 * @requirements TASK-SVC-002-REV
 */

import { describe, it, expect, vi } from 'vitest';
import { NativeAdapter } from '../native.adapter';
import { runEmailPortContract, buildSendRequest } from '../../../tests/contracts/email-service.contract';

// ─── Contract test ────────────────────────────────────────────────────────────

// Run the shared port contract in dry-run mode (no actual sending).
runEmailPortContract(() => new NativeAdapter({ dryRun: true }));

// ─── NativeAdapter-specific tests ────────────────────────────────────────────

describe('NativeAdapter (specific behaviour)', () => {
  it('invokes onSend hook after each send', async () => {
    const onSend = vi.fn();
    const adapter = new NativeAdapter({ dryRun: true, onSend });

    const request = buildSendRequest();
    const result = await adapter.send(request);

    expect(onSend).toHaveBeenCalledOnce();
    expect(onSend).toHaveBeenCalledWith(request, result);
  });

  it('invokes onSend for every item in sendBatch', async () => {
    const onSend = vi.fn();
    const adapter = new NativeAdapter({ dryRun: true, onSend });

    await adapter.sendBatch([
      buildSendRequest({ to: 'a@example.com' }),
      buildSendRequest({ to: 'b@example.com' }),
    ]);

    expect(onSend).toHaveBeenCalledTimes(2);
  });

  it('returns status "sent" in dry-run mode', async () => {
    const adapter = new NativeAdapter({ dryRun: true });
    const result = await adapter.send(buildSendRequest());
    expect(result.status).toBe('sent');
  });

  it('returns status "queued" in production mode without SMTP transport', async () => {
    const adapter = new NativeAdapter({ dryRun: false });
    const result = await adapter.send(buildSendRequest());
    expect(result.status).toBe('queued');
  });
});
