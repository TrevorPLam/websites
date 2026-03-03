/**
 * @file packages/services/src/email/adapters/tests/resend.contract.spec.ts
 * @summary Contract test suite for {@link ResendAdapter}.
 * @description Runs the shared {@link EmailPort} contract against a mocked
 *   Resend client to verify that ResendAdapter satisfies the port interface
 *   without making real API calls.
 * @requirements TASK-SVC-002-REV
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResendAdapter, EmailSendError } from '../resend.adapter';
import { runEmailPortContract, buildSendRequest } from '../../../tests/contracts/email-service.contract';

// ─── Mock the resend dynamic import ──────────────────────────────────────────

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

// ─── Contract test ────────────────────────────────────────────────────────────

runEmailPortContract(() => {
  mockSend.mockResolvedValue({ data: { id: `resend-${Math.random()}` }, error: null });
  return new ResendAdapter({ apiKey: 'test-key', defaultFromAddress: 'test@example.com' });
});

// ─── ResendAdapter-specific tests ────────────────────────────────────────────

describe('ResendAdapter (specific behaviour)', () => {
  let adapter: ResendAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: 'resend-msg-001' }, error: null });
    adapter = new ResendAdapter({ apiKey: 'test-key', defaultFromAddress: 'sender@example.com' });
  });

  it('throws EmailSendError when the provider returns an error', async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: 'Invalid API key' },
    });

    await expect(adapter.send(buildSendRequest())).rejects.toThrow(
      EmailSendError,
    );
  });

  it('throws EmailSendError when the provider returns null data', async () => {
    mockSend.mockResolvedValue({ data: null, error: null });

    await expect(adapter.send(buildSendRequest())).rejects.toThrow(
      EmailSendError,
    );
  });

  it('constructs the adapter with a resolveApiKey function', async () => {
    const resolveApiKey = vi.fn().mockResolvedValue('resolved-key');
    const adapterWithResolver = new ResendAdapter({
      resolveApiKey,
      defaultFromAddress: 'sender@example.com',
    });

    const result = await adapterWithResolver.send(buildSendRequest());

    expect(resolveApiKey).toHaveBeenCalledWith('tenant-test-123');
    expect(result.status).toBe('sent');
  });

  it('throws if neither apiKey nor resolveApiKey is provided', () => {
    expect(() => new ResendAdapter({})).toThrow(
      'ResendAdapter requires either `apiKey` or `resolveApiKey`',
    );
  });

  it('throws EmailSendError when no from-address is configured', async () => {
    const adapterNoFrom = new ResendAdapter({ apiKey: 'test-key' });
    await expect(adapterNoFrom.send(buildSendRequest())).rejects.toThrow(
      EmailSendError,
    );
  });

  it('includes tenant_id tag in the Resend payload', async () => {
    await adapter.send(buildSendRequest({ tenantId: 'acme-corp' }));

    const payload = mockSend.mock.calls[0]?.[0] as { tags?: Array<{ name: string; value: string }> };
    const tenantTag = payload.tags?.find((t) => t.name === 'tenant_id');
    expect(tenantTag?.value).toBe('acme-corp');
  });

  it('includes idempotency_key in the Resend payload when provided', async () => {
    await adapter.send(buildSendRequest({ idempotencyKey: 'idem-001' }));

    const payload = mockSend.mock.calls[0]?.[0] as { idempotency_key?: string };
    expect(payload.idempotency_key).toBe('idem-001');
  });
});
