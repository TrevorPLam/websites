/**
 * @file apps/web/src/features/lead-capture/__tests__/submit-lead.test.ts
 * @summary Lead submission API tests.
 * @description Test suite for submitLead API function.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitLead } from '../api/submit-lead';
import type { LeadData } from '../api/submit-lead';

// Mock fetch
global.fetch = vi.fn();

describe('submitLead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required name field', async () => {
    const result = await submitLead({
      name: '',
      email: 'test@example.com',
    }, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Name must be at least 2 characters long');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates name length', async () => {
    const result = await submitLead({
      name: 'A',
      email: 'test@example.com',
    }, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Name must be at least 2 characters long');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates required email field', async () => {
    const result = await submitLead({
      name: 'John Doe',
      email: '',
    }, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const result = await submitLead({
      name: 'John Doe',
      email: 'invalid-email',
    }, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits valid lead data successfully', async () => {
    const mockResponse = { id: 'lead-123' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      message: 'I am interested in your services',
    };

    const result = await submitLead(leadData, 'tenant-123');

    expect(result.success).toBe(true);
    expect(result.id).toBe('lead-123');
    expect(fetch).toHaveBeenCalledWith('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'tenant-123',
      },
      body: expect.stringContaining('"name":"John Doe"'),
    });
  });

  it('handles API error response', async () => {
    const mockErrorResponse = { message: 'Server error' };
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const result = await submitLead(leadData, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Server error');
  });

  it('handles network error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const result = await submitLead(leadData, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('handles JSON parsing error', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const result = await submitLead(leadData, 'tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to submit lead');
  });

  it('sends tenant ID in headers', async () => {
    const mockResponse = { id: 'lead-123' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    await submitLead(leadData, 'tenant-456');

    expect(fetch).toHaveBeenCalledWith('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'tenant-456',
      },
      body: expect.any(String),
    });
  });

  it('includes all optional fields when provided', async () => {
    const mockResponse = { id: 'lead-123' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const leadData: LeadData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      message: 'I am interested in your services',
    };

    await submitLead(leadData, 'tenant-123');

    const requestBody = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(requestBody).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      message: 'I am interested in your services',
      tenantId: 'tenant-123',
      status: 'new',
      source: 'web-form',
    });
    expect(requestBody).toHaveProperty('id');
    expect(requestBody).toHaveProperty('createdAt');
    expect(requestBody).toHaveProperty('updatedAt');
  });
});
