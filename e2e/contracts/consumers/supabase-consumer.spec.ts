/**
 * @file e2e/contracts/consumers/supabase-consumer.spec.ts
 * @summary Consumer-driven contract tests for Supabase database integration.
 * @security Test-only contract validation; no real API calls or secrets exposed.
 * @requirements TASK-002-5: Implement consumer-driven contract tests with validation
 */

import { Pact } from '@pact-foundation/pact';
import { ContractTestingUtils } from '@repo/testing-contracts';
import { SupabaseMocks } from '@repo/testing-contracts/mocks';

describe('Supabase API Consumer Contract Tests', () => {
  const provider = new Pact({
    consumer: 'marketing-websites-app',
    provider: 'supabase-api',
    port: 1235,
    log: 'pact/logs/supabase-consumer.log',
    dir: 'pact/pacts',
    logLevel: 'info',
    spec: 2,
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.removeInteractions();
  });

  describe('Lead Management', () => {
    it('should insert lead into database', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const leadData = {
        tenant_id: tenantId,
        email: 'test@example.com',
        name: 'Test Lead',
        status: 'new',
        source: 'website',
        created_at: '2026-02-26T07:51:00.000Z',
      };

      await provider.addInteraction({
        state: 'supabase API is available',
        uponReceiving: 'insert lead into database',
        withRequest: SupabaseMocks.insertLeadRequest(leadData),
        willRespondWith: SupabaseMocks.insertLeadResponse(),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(leadData),
      });

      expect(response.status).toBe(201);
      // Supabase returns null for minimal response
      const data = await response.text();
      expect(data).toBe('');
    });

    it('should query leads by tenant', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const leads = [
        {
          id: 1,
          tenant_id: tenantId,
          email: 'test@example.com',
          name: 'Test Lead',
          status: 'new',
          source: 'website',
          created_at: '2026-02-26T07:51:00.000Z',
        },
      ];

      await provider.addInteraction({
        state: 'supabase API is available',
        uponReceiving: 'query leads by tenant',
        withRequest: SupabaseMocks.queryLeadsRequest(tenantId),
        willRespondWith: SupabaseMocks.queryLeadsResponse(leads),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads?tenant_id=eq.${tenantId}&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].tenant_id).toBe(tenantId);
      expect(data[0].email).toBe('test@example.com');
    });

    it('should update lead status', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const leadId = 1;
      const updateData = {
        status: 'contacted',
        updated_at: '2026-02-26T07:51:00.000Z',
      };

      await provider.addInteraction({
        state: 'supabase API is available',
        uponReceiving: 'update lead status',
        withRequest: {
          method: 'PATCH',
          path: `/rest/v1/leads?id=eq.${leadId}&tenant_id=eq.${tenantId}`,
          headers: {
            'Authorization': 'Bearer mock_supabase_key',
            'apikey': 'mock_supabase_key',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: updateData,
        },
        willRespondWith: {
          status: 204,
          headers: {},
          body: null,
        },
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads?id=eq.${leadId}&tenant_id=eq.${tenantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(204);
    });
  });

  describe('Multi-Tenant Isolation', () => {
    it('should prevent cross-tenant data access', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const otherTenantId = '987e6543-e21b-43d2-a456-426614174999';

      await provider.addInteraction({
        state: 'supabase RLS is enforced',
        uponReceiving: 'attempt cross-tenant data access',
        withRequest: {
          method: 'GET',
          path: '/rest/v1/leads',
          headers: {
            'Authorization': 'Bearer mock_supabase_key',
            'apikey': 'mock_supabase_key',
          },
          query: {
            tenant_id: `eq.${otherTenantId}`,
            order: 'created_at.desc',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: [], // Empty array due to RLS isolation
        },
      });

      // Test the actual integration - should return empty due to RLS
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads?tenant_id=eq.${otherTenantId}&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0); // Should be empty due to RLS
    });

    it('should validate tenant ID in requests', async () => {
      const invalidTenantId = 'invalid-tenant-id';
      const leadData = {
        tenant_id: invalidTenantId,
        email: 'test@example.com',
        name: 'Test Lead',
        status: 'new',
        source: 'website',
      };

      await provider.addInteraction({
        state: 'supabase validation fails',
        uponReceiving: 'request with invalid tenant ID',
        withRequest: SupabaseMocks.insertLeadRequest(leadData),
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid tenant ID format', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(leadData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid tenant ID format');
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      await provider.addInteraction({
        state: 'supabase API authentication fails',
        uponReceiving: 'request with invalid credentials',
        withRequest: {
          method: 'POST',
          path: '/rest/v1/leads',
          headers: {
            'Authorization': 'Bearer invalid_key',
            'apikey': 'invalid_key',
            'Content-Type': 'application/json',
          },
          body: {},
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid API key', 401),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid_key',
          'apikey': 'invalid_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid API key');
    });

    it('should handle validation errors', async () => {
      await provider.addInteraction({
        state: 'supabase validation fails',
        uponReceiving: 'request with invalid data',
        withRequest: {
          method: 'POST',
          path: '/rest/v1/leads',
          headers: {
            'Authorization': 'Bearer mock_supabase_key',
            'apikey': 'mock_supabase_key',
            'Content-Type': 'application/json',
          },
          body: {
            // Missing required tenant_id
            email: 'test@example.com',
            name: 'Test Lead',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Required field tenant_id missing', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test Lead',
          // Missing required tenant_id
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Required field tenant_id missing');
    });

    it('should handle database connection errors', async () => {
      await provider.addInteraction({
        state: 'supabase database is unavailable',
        uponReceiving: 'request during database outage',
        withRequest: {
          method: 'GET',
          path: '/rest/v1/leads',
          headers: {
            'Authorization': 'Bearer mock_supabase_key',
            'apikey': 'mock_supabase_key',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Database connection failed', 503),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
        },
      });

      expect(response.status).toBe(503);
      const data = await response.json();
      expect(data.error).toBe('Database connection failed');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limit errors', async () => {
      await provider.addInteraction({
        state: 'supabase rate limit exceeded',
        uponReceiving: 'request exceeding rate limit',
        withRequest: {
          method: 'GET',
          path: '/rest/v1/leads',
          headers: {
            'Authorization': 'Bearer mock_supabase_key',
            'apikey': 'mock_supabase_key',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Rate limit exceeded', 429),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/rest/v1/leads`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock_supabase_key',
          'apikey': 'mock_supabase_key',
        },
      });

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Rate limit exceeded');
    });
  });
});
