/**
 * @file packages/integrations/supabase/__tests__/supabase-security.test.ts
 * Purpose: Comprehensive security tests for Supabase integration following 2026 standards.
 * Tests client/server separation, RLS enforcement, and tenant isolation.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createSupabaseClient,
  createSupabaseServerClient,
  insertLead,
  updateLead,
  insertLeadServer,
  getSupabaseClient,
  getSupabaseServerClient,
} from '../client';
import type { SupabaseClientConfig, SupabaseServerConfig, SupabaseLeadRow } from '../types';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('Supabase Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  describe('Client Configuration Security', () => {
    it('should use anon key for client configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const client = createSupabaseClient();

      expect(client.url).toBe('https://test.supabase.co');
      expect(client.anonKey).toBe('test-anon-key');
      expect(client.headers['apikey']).toBe('test-anon-key');
      expect(client.headers['Authorization']).toBe('Bearer test-anon-key');
      expect(client.headers['Content-Type']).toBe('application/json');
    });

    it('should reject client configuration with service role key', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';

      expect(() => createSupabaseClient()).toThrow(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY is required for Supabase client'
      );
    });

    it('should require NEXT_PUBLIC_ prefix for client environment variables', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';

      expect(() => createSupabaseClient()).toThrow(
        'NEXT_PUBLIC_SUPABASE_URL is required for Supabase client'
      );
    });
  });

  describe('Server Configuration Security', () => {
    it('should use service role key for server configuration', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

      const serverClient = createSupabaseServerClient();

      expect(serverClient.url).toBe('https://test.supabase.co');
      expect(serverClient.serviceRoleKey).toBe('test-service-key');
      expect(serverClient.headers['apikey']).toBe('test-service-key');
      expect(serverClient.headers['Authorization']).toBe('Bearer test-service-key');
    });

    it('should reject server configuration without service role key', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = '';

      expect(() => createSupabaseServerClient()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is required for Supabase server client'
      );
    });

    it('should not use NEXT_PUBLIC_ prefix for server environment variables', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

      expect(() => createSupabaseServerClient()).toThrow(
        'SUPABASE_URL is required for Supabase server client'
      );
    });
  });

  describe('Row-Level Security (RLS) Enforcement', () => {
    let client: SupabaseClientConfig;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
      client = createSupabaseClient();
    });

    it('should require tenant_id for lead insertion', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        // tenant_id missing intentionally
      };

      await expect(insertLead(client, leadData)).rejects.toThrow(
        'tenant_id is required for lead creation (RLS enforcement)'
      );
    });

    it('should validate tenant_id UUID format for lead insertion', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        tenant_id: 'invalid-uuid-format',
      };

      await expect(insertLead(client, leadData)).rejects.toThrow(
        'tenant_id must be a valid UUID format'
      );
    });

    it('should require tenant_id for lead updates', async () => {
      const validLeadId = '123e4567-e89b-12d3-a456-426614174002';
      const updates = {
        hubspot_sync_status: 'synced',
        // tenant_id missing intentionally
      };

      await expect(updateLead(client, validLeadId, updates)).rejects.toThrow(
        'tenant_id is required for lead updates (RLS enforcement)'
      );
    });

    it('should validate tenant_id UUID format for lead updates', async () => {
      const validLeadId = '123e4567-e89b-12d3-a456-426614174002';
      const updates = {
        hubspot_sync_status: 'synced',
        tenant_id: 'invalid-uuid-format',
      };

      await expect(updateLead(client, validLeadId, updates)).rejects.toThrow(
        'tenant_id must be a valid UUID format'
      );
    });

    it('should include tenant_id in update query for RLS', async () => {
      const updates = {
        hubspot_sync_status: 'synced',
        tenant_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'lead-123', ...updates }),
      });

      await updateLead(client, '123e4567-e89b-12d3-a456-426614174001', updates);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('tenant_id=eq.123e4567-e89b-12d3-a456-426614174000'),
        expect.objectContaining({
          method: 'PATCH',
          headers: client.headers,
        })
      );
    });

    it('should handle RLS violations gracefully', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        tenant_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'RLS policy violation',
      });

      // Should throw error with RLS information
      await expect(insertLead(client, leadData)).rejects.toThrow(
        'Supabase insert failed with status 403: RLS policy violation'
      );
    });
  });

  describe('Tenant Isolation', () => {
    let client: SupabaseClientConfig;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
      client = createSupabaseClient();
    });

    it('should prevent cross-tenant data access', async () => {
      const tenant1Id = '123e4567-e89b-12d3-a456-426614174000';
      const tenant2Id = '123e4567-e89b-12d3-a456-426614174001';
      const validLeadId = '123e4567-e89b-12d3-a456-426614174002';

      // Attempt to update lead with different tenant_id
      const updates = {
        hubspot_sync_status: 'synced',
        tenant_id: tenant2Id, // Different tenant
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'RLS policy violation: tenant mismatch',
      });

      await expect(updateLead(client, validLeadId, updates)).rejects.toThrow(
        'Supabase update failed with status 403'
      );

      // Verify the query included tenant isolation
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`tenant_id=eq.${tenant2Id}`),
        expect.any(Object)
      );
    });

    it('should validate UUID format to prevent injection attacks', async () => {
      const maliciousTenantId = "123'; DROP TABLE leads; --";
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        tenant_id: maliciousTenantId,
      };

      await expect(insertLead(client, leadData)).rejects.toThrow(
        'tenant_id must be a valid UUID format'
      );

      // Verify malicious input was not passed to database
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Server-Side Administrative Operations', () => {
    let serverClient: SupabaseServerConfig;

    beforeEach(() => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      serverClient = createSupabaseServerClient();
    });

    it('should allow server-side lead insertion without tenant_id requirement', async () => {
      const leadData = {
        name: 'Admin User',
        email: 'admin@example.com',
        // No tenant_id required for server operations
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'lead-456', ...leadData }),
      });

      const result = await insertLeadServer(serverClient, leadData);

      expect(result.id).toBe('lead-456');
      expect(result.name).toBe('Admin User');
      expect(result.email).toBe('admin@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.supabase.co/rest/v1/leads',
        expect.objectContaining({
          method: 'POST',
          headers: {
            apikey: 'test-service-key',
            Authorization: 'Bearer test-service-key',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        })
      );
    });

    it('should use service role key for server operations', async () => {
      const leadData = {
        name: 'Admin User',
        email: 'admin@example.com',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'lead-456', ...leadData }),
      });

      await insertLeadServer(serverClient, leadData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            apikey: 'test-service-key',
            Authorization: 'Bearer test-service-key',
          }),
        })
      );
    });
  });

  describe('Singleton Pattern Security', () => {
    it('should maintain separate instances for client and server', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

      const client1 = getSupabaseClient();
      const client2 = getSupabaseClient();
      const server1 = getSupabaseServerClient();
      const server2 = getSupabaseServerClient();

      // Verify singleton behavior
      expect(client1).toBe(client2);
      expect(server1).toBe(server2);

      // Verify client/server separation
      expect(client1).not.toBe(server1);
      expect('anonKey' in client1).toBe(true);
      expect('serviceRoleKey' in server1).toBe(true);
    });

    it('should prevent cross-contamination between client and server configs', () => {
      // Reset singletons to test fresh initialization
      (getSupabaseClient as any) = () => {
        const client = createSupabaseClient();
        (getSupabaseClient as any) = () => client;
        return client;
      };
      (getSupabaseServerClient as any) = () => {
        const server = createSupabaseServerClient();
        (getSupabaseServerClient as any) = () => server;
        return server;
      };

      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://client.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'client-anon-key';
      process.env.SUPABASE_URL = 'https://server.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-service-key';

      const client = getSupabaseClient();
      const server = getSupabaseServerClient();

      expect(client.url).toBe('https://client.supabase.co');
      expect((client as any).anonKey).toBe('client-anon-key');
      expect(server.url).toBe('https://server.supabase.co');
      expect(server.serviceRoleKey).toBe('server-service-key');
    });
  });

  describe('Error Handling and Logging', () => {
    let client: SupabaseClientConfig;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
      client = createSupabaseClient();
    });

    it('should handle database errors gracefully', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        tenant_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Database error',
      });

      // Should throw error with database information
      await expect(insertLead(client, leadData)).rejects.toThrow(
        'Supabase insert failed with status 500: Database error'
      );
    });

    it('should validate lead ID format to prevent injection', async () => {
      const maliciousLeadId = "123'; DROP TABLE leads; --";
      const updates = {
        hubspot_sync_status: 'synced',
        tenant_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(updateLead(client, maliciousLeadId, updates)).rejects.toThrow(
        'Invalid leadId: must be a valid UUID format'
      );

      // Verify malicious input was not passed to database
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
