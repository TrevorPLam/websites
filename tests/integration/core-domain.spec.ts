/**
 * @file tests/integration/core-domain.spec.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { describe, expect, it } from 'vitest';

import { Email } from '../../packages/core/value-objects/Email';
import { createTenantId } from '../../packages/core/value-objects/TenantId';
import { Lead } from '../../packages/core/entities/lead/Lead';

describe('core domain entities', () => {
  it('normalizes emails', () => {
    const email = Email.create('  SALES@Example.com ');
    expect(email.ok && email.value.value).toBe('sales@example.com');
  });

  it('enforces lead qualification before conversion', () => {
    const tenantId = createTenantId('6af30f12-a0f5-4ce8-b8bc-f236f0dd3719');
    if (!tenantId.ok) throw new Error('unexpected tenant id parse failure');

    const email = Email.create('lead@example.com');
    if (!email.ok) throw new Error('unexpected email parse failure');

    const lead = Lead.capture({
      id: 'lead-1',
      tenantId: tenantId.value,
      email: email.value,
      name: 'ACME Lead',
    });

    expect(() => lead.convert()).toThrow();
    lead.qualify(84);
    lead.convert();
    expect(lead.toJSON().status).toBe('converted');
  });
});
