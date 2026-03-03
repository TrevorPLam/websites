/**
 * @file packages/config/ports/src/crm.port.ts
 * @summary Hexagonal architecture Port interface for CRM integrations.
 * @description Defines the inward-facing contract for CRM operations.
 *   Concrete adapters (HubSpot, native/DB, etc.) implement this interface
 *   and live in `packages/services/crm/adapters/`.
 * @security All operations are scoped by `tenantId` to enforce tenant isolation.
 * @requirements TASK-SVC-001
 */

// ─── Domain objects ──────────────────────────────────────────────────────────

/** A CRM contact record. */
export interface CrmContact {
  /** Provider-assigned or internal UUID. */
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  /** Arbitrary key-value metadata. */
  properties: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Input for creating a new contact. */
export interface CreateContactRequest {
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  properties?: Record<string, unknown>;
}

/** Fields that can be updated on an existing contact. */
export type UpdateContactRequest = Partial<
  Omit<CreateContactRequest, 'tenantId' | 'email'>
> & {
  properties?: Record<string, unknown>;
};

// ─── Port interface ──────────────────────────────────────────────────────────

/**
 * Port interface for CRM contact management.
 *
 * Adapters must implement all methods so they are interchangeable via the
 * CRM adapter factory.
 */
export interface CrmPort {
  /**
   * Creates a new contact in the CRM.
   *
   * @param data - Contact creation payload.
   * @returns The newly created contact record.
   */
  createContact(data: CreateContactRequest): Promise<CrmContact>;

  /**
   * Updates an existing contact by ID.
   *
   * @param id        - The provider-assigned contact ID.
   * @param tenantId  - The owning tenant (used for RLS enforcement in adapters).
   * @param data      - Partial update payload.
   * @returns The updated contact record.
   */
  updateContact(
    id: string,
    tenantId: string,
    data: UpdateContactRequest,
  ): Promise<CrmContact>;

  /**
   * Looks up a contact by email address within a tenant's scope.
   *
   * @param email    - The contact's email address.
   * @param tenantId - The owning tenant.
   * @returns The matching contact, or `null` if not found.
   */
  findContactByEmail(
    email: string,
    tenantId: string,
  ): Promise<CrmContact | null>;

  /**
   * Deletes a contact by ID (supports GDPR right-to-erasure workflows).
   *
   * @param id       - The provider-assigned contact ID.
   * @param tenantId - The owning tenant.
   */
  deleteContact(id: string, tenantId: string): Promise<void>;
}
