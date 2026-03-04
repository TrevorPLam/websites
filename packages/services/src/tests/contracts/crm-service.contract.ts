/**
 * @file packages/services/src/tests/contracts/crm-service.contract.ts
 * @summary Shared contract specification for {@link CrmPort} adapters.
 * @description Defines a reusable test suite (via Vitest's `describe`) that
 *   every CRM adapter implementation MUST pass. Import this file in
 *   adapter-specific spec files and call `runCrmPortContract(factory)` with
 *   a factory that returns the adapter under test.
 *
 *   This is the "consumer-driven contract" pattern: the contract is defined
 *   once here and each adapter must satisfy it independently of the provider.
 *
 * @example
 * ```ts
 * // packages/services/src/crm/adapters/tests/in-memory.contract.spec.ts
 * import { runCrmPortContract } from '../../../tests/contracts/crm-service.contract';
 * import { InMemoryCrmAdapter } from '../in-memory.adapter';
 *
 * runCrmPortContract(() => new InMemoryCrmAdapter());
 * ```
 * @security Test-only file; no production credentials or real CRM data used.
 * @adr none
 * @requirements TASK-SVC-002-REV
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { CrmPort, CreateContactRequest } from '@repo/service-ports/crm';

// ─── Fixture helpers ─────────────────────────────────────────────────────────

/** Minimal valid contact creation request for contract tests. */
export function buildCreateRequest(
  overrides: Partial<CreateContactRequest> = {}
): CreateContactRequest {
  return {
    tenantId: 'tenant-contract-test',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Test',
    ...overrides,
  };
}

// ─── Contract suite ──────────────────────────────────────────────────────────

/**
 * Runs the shared {@link CrmPort} behavioural contract against any adapter.
 *
 * @param factory - A zero-argument function that returns a fresh adapter
 *   instance before each test.
 */
export function runCrmPortContract(factory: () => CrmPort): void {
  describe('CrmPort contract', () => {
    let adapter: CrmPort;

    beforeEach(() => {
      adapter = factory();
    });

    // ── createContact ─────────────────────────────────────────────────────

    describe('createContact()', () => {
      it('returns a contact with a non-empty id', async () => {
        const contact = await adapter.createContact(buildCreateRequest());

        expect(contact.id).toBeTruthy();
      });

      it('persists tenantId on the returned record', async () => {
        const contact = await adapter.createContact(buildCreateRequest({ tenantId: 'my-tenant' }));

        expect(contact.tenantId).toBe('my-tenant');
      });

      it('persists the email address', async () => {
        const contact = await adapter.createContact(
          buildCreateRequest({ email: 'bob@example.com' })
        );

        expect(contact.email).toBe('bob@example.com');
      });

      it('sets createdAt and updatedAt on creation', async () => {
        const contact = await adapter.createContact(buildCreateRequest());

        expect(contact.createdAt).toBeInstanceOf(Date);
        expect(contact.updatedAt).toBeInstanceOf(Date);
      });

      it('generates distinct IDs for separate contacts', async () => {
        const [a, b] = await Promise.all([
          adapter.createContact(buildCreateRequest({ email: 'a@example.com' })),
          adapter.createContact(buildCreateRequest({ email: 'b@example.com' })),
        ]);

        expect(a.id).not.toBe(b.id);
      });
    });

    // ── findContactByEmail ─────────────────────────────────────────────────

    describe('findContactByEmail()', () => {
      it('returns null when no contact matches', async () => {
        const result = await adapter.findContactByEmail(
          'unknown@example.com',
          'tenant-contract-test'
        );

        expect(result).toBeNull();
      });

      it('returns the contact after creation', async () => {
        const tenantId = 'tenant-contract-test';
        const email = 'alice@example.com';
        await adapter.createContact(buildCreateRequest({ tenantId, email }));

        const found = await adapter.findContactByEmail(email, tenantId);

        expect(found).not.toBeNull();
        expect(found?.email).toBe(email);
      });

      it('does not return contacts from a different tenant', async () => {
        const email = 'shared@example.com';
        await adapter.createContact(buildCreateRequest({ tenantId: 'tenant-a', email }));

        const result = await adapter.findContactByEmail(email, 'tenant-b');

        expect(result).toBeNull();
      });
    });

    // ── updateContact ─────────────────────────────────────────────────────

    describe('updateContact()', () => {
      it('updates the firstName field', async () => {
        const tenantId = 'tenant-contract-test';
        const contact = await adapter.createContact(buildCreateRequest({ tenantId }));

        const updated = await adapter.updateContact(contact.id, tenantId, {
          firstName: 'Updated',
        });

        expect(updated.firstName).toBe('Updated');
      });

      it('merges properties instead of replacing them', async () => {
        const tenantId = 'tenant-contract-test';
        const contact = await adapter.createContact(
          buildCreateRequest({ tenantId, properties: { score: 10 } })
        );

        const updated = await adapter.updateContact(contact.id, tenantId, {
          properties: { plan: 'pro' },
        });

        expect(updated.properties['score']).toBe(10);
        expect(updated.properties['plan']).toBe('pro');
      });

      it('throws when the contact does not exist', async () => {
        await expect(
          adapter.updateContact('nonexistent-id', 'tenant-contract-test', {
            firstName: 'Ghost',
          })
        ).rejects.toThrow();
      });
    });

    // ── deleteContact ─────────────────────────────────────────────────────

    describe('deleteContact()', () => {
      it('removes the contact so findContactByEmail returns null', async () => {
        const tenantId = 'tenant-contract-test';
        const email = 'delete-me@example.com';
        const contact = await adapter.createContact(buildCreateRequest({ tenantId, email }));

        await adapter.deleteContact(contact.id, tenantId);

        const found = await adapter.findContactByEmail(email, tenantId);
        expect(found).toBeNull();
      });

      it('throws when the contact does not exist', async () => {
        await expect(
          adapter.deleteContact('nonexistent-id', 'tenant-contract-test')
        ).rejects.toThrow();
      });
    });
  });
}
