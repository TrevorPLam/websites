/**
 * @file packages/services/src/crm/adapters/tests/in-memory.contract.spec.ts
 * @summary Contract test suite for {@link InMemoryCrmAdapter}.
 * @description Runs the shared {@link CrmPort} contract against the in-memory
 *   adapter to verify that it satisfies the port interface.
 * @security Test-only file; no secrets or production data are used.
 * @adr none
 * @requirements TASK-SVC-002-REV
 */

import { describe, it, expect, vi } from 'vitest';
import { InMemoryCrmAdapter } from '../in-memory.adapter';
import {
  runCrmPortContract,
  buildCreateRequest,
} from '../../../tests/contracts/crm-service.contract';

// ─── Contract test ────────────────────────────────────────────────────────────

runCrmPortContract(() => new InMemoryCrmAdapter());

// ─── InMemoryCrmAdapter-specific tests ───────────────────────────────────────

describe('InMemoryCrmAdapter (specific behaviour)', () => {
  it('invokes onWrite hook after createContact', async () => {
    const onWrite = vi.fn();
    const adapter = new InMemoryCrmAdapter({ onWrite });

    const contact = await adapter.createContact(buildCreateRequest());

    expect(onWrite).toHaveBeenCalledOnce();
    expect(onWrite).toHaveBeenCalledWith(contact);
  });

  it('invokes onWrite hook after updateContact', async () => {
    const onWrite = vi.fn();
    const adapter = new InMemoryCrmAdapter({ onWrite });

    const contact = await adapter.createContact(buildCreateRequest({ tenantId: 'acme' }));
    onWrite.mockClear();

    await adapter.updateContact(contact.id, 'acme', { firstName: 'Bob' });

    expect(onWrite).toHaveBeenCalledOnce();
  });

  it('does not expose contacts across tenant boundaries', async () => {
    const adapter = new InMemoryCrmAdapter();

    await adapter.createContact(
      buildCreateRequest({ tenantId: 'tenant-a', email: 'shared@example.com' })
    );

    const result = await adapter.findContactByEmail('shared@example.com', 'tenant-b');

    expect(result).toBeNull();
  });
});
