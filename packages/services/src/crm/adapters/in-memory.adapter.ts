/**
 * @file packages/services/src/crm/adapters/in-memory.adapter.ts
 * @summary In-memory adapter implementing {@link CrmPort}.
 * @description Provides a zero-dependency CRM implementation backed by a
 *   `Map` for use in development, test, and staging environments. All
 *   data is scoped by `tenantId` to mirror the RLS isolation enforced by
 *   production adapters.
 * @security Tenant isolation is enforced at the adapter level: operations that
 *   receive a `tenantId` parameter only return or mutate records belonging to
 *   that tenant. No data crosses tenant boundaries.
 * @adr none
 * @requirements TASK-SVC-001, TASK-SVC-002-REV
 */

import type {
  CrmPort,
  CrmContact,
  CreateContactRequest,
  UpdateContactRequest,
} from '@repo/service-ports/crm';

// ─── Options ─────────────────────────────────────────────────────────────────

export interface InMemoryCrmAdapterOptions {
  /**
   * Optional hook called after a contact is written (created or updated).
   * Useful for assertions in tests.
   */
  onWrite?: (contact: CrmContact) => void;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

/**
 * In-memory CRM adapter.
 *
 * Each adapter instance owns its own isolated `Map`. For shared state in tests,
 * pass the same instance to all collaborators.
 *
 * @example
 * ```ts
 * const crm = new InMemoryCrmAdapter();
 * const contact = await crm.createContact({
 *   tenantId: 'acme',
 *   email: 'alice@acme.com',
 * });
 * ```
 */
export class InMemoryCrmAdapter implements CrmPort {
  /** Primary store keyed by `<tenantId>:<contactId>`. */
  private readonly store = new Map<string, CrmContact>();
  private readonly onWrite?: InMemoryCrmAdapterOptions['onWrite'];

  constructor(options: InMemoryCrmAdapterOptions = {}) {
    this.onWrite = options.onWrite;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private key(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  private now(): Date {
    return new Date();
  }

  // ─── CrmPort.createContact ────────────────────────────────────────────────

  async createContact(data: CreateContactRequest): Promise<CrmContact> {
    const id = `crm-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const now = this.now();

    const contact: CrmContact = {
      id,
      tenantId: data.tenantId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      properties: data.properties ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.store.set(this.key(data.tenantId, id), contact);
    this.onWrite?.(contact);
    return contact;
  }

  // ─── CrmPort.updateContact ────────────────────────────────────────────────

  async updateContact(
    id: string,
    tenantId: string,
    data: UpdateContactRequest
  ): Promise<CrmContact> {
    const existing = this.store.get(this.key(tenantId, id));

    if (!existing) {
      throw new Error(`[InMemoryCrmAdapter] Contact "${id}" not found for tenant "${tenantId}".`);
    }

    const updated: CrmContact = {
      ...existing,
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      phone: data.phone ?? existing.phone,
      company: data.company ?? existing.company,
      properties: data.properties
        ? { ...existing.properties, ...data.properties }
        : existing.properties,
      updatedAt: this.now(),
    };

    this.store.set(this.key(tenantId, id), updated);
    this.onWrite?.(updated);
    return updated;
  }

  // ─── CrmPort.findContactByEmail ───────────────────────────────────────────

  async findContactByEmail(email: string, tenantId: string): Promise<CrmContact | null> {
    for (const contact of this.store.values()) {
      if (contact.tenantId === tenantId && contact.email === email) {
        return contact;
      }
    }
    return null;
  }

  // ─── CrmPort.deleteContact ────────────────────────────────────────────────

  async deleteContact(id: string, tenantId: string): Promise<void> {
    const key = this.key(tenantId, id);

    if (!this.store.has(key)) {
      throw new Error(`[InMemoryCrmAdapter] Contact "${id}" not found for tenant "${tenantId}".`);
    }

    this.store.delete(key);
  }
}
