/**
 * @file apps/web/src/features/lead-capture/__tests__/validation.test.ts
 * @summary Lead validation tests.
 * @description Test suite for lead validation functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateLeadData } from '../lib/validation';
import type { LeadData } from '../lib/validation';

// Mock the @x imports
vi.mock('@/entities/lead/@x/lead-capture', () => ({
  validateLeadData: vi.fn(),
  type: {
    Lead: {} as any,
  },
}));

describe('validateLeadData', () => {
  const tenantId = 'test-tenant-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates empty data', () => {
    const result = validateLeadData({}, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name', 'Name must be at least 2 characters long');
    expect(result.errors).toHaveProperty('email', 'Email is required');
  });

  it('validates name length', () => {
    const result = validateLeadData({
      name: 'A',
      email: 'test@example.com',
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name', 'Name must be at least 2 characters long');
  });

  it('validates email format', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'invalid-email',
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email', 'Please enter a valid email address');
  });

  it('validates phone format when provided', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
      phone: 'invalid-phone',
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('phone', 'Please enter a valid phone number');
  });

  it('accepts valid phone numbers', () => {
    const validPhones = [
      '+1234567890',
      '123-456-7890',
      '(123) 456-7890',
      '123 456 7890',
      '+1 (123) 456-7890',
    ];

    validPhones.forEach(phone => {
      const result = validateLeadData({
        name: 'John Doe',
        email: 'john@example.com',
        phone,
      }, tenantId);

      expect(result.errors).not.toHaveProperty('phone');
    });
  });

  it('validates message length when provided', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('message', 'Message must be at least 10 characters long');
  });

  it('passes validation with complete valid data', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      message: 'This is a valid message with enough characters',
    }, tenantId);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('passes validation with minimal required data', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
    }, tenantId);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('handles optional fields as undefined', () => {
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
      phone: undefined,
      company: undefined,
      message: undefined,
    }, tenantId);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('integrates with entity validation when tenantId provided', () => {
    const mockValidateLead = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLead.mockReturnValue({
      success: false,
      error: {
        issues: [
          { path: ['email'], message: 'Entity validation error' },
        ],
      },
    });

    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
    }, tenantId);

    expect(mockValidateLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        tenantId,
      })
    );
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email', 'Entity validation error');
  });

  it('does not call entity validation when no tenantId', () => {
    const mockValidateLead = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    const result = validateLeadData({
      name: 'John Doe',
      email: 'john@example.com',
    }, '');

    expect(mockValidateLead).not.toHaveBeenCalled();
    expect(result.isValid).toBe(true);
  });

  it('merges local and entity validation errors', () => {
    const mockValidateLead = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLead.mockReturnValue({
      success: false,
      error: {
        issues: [
          { path: ['company'], message: 'Entity company error' },
        ],
      },
    });

    const result = validateLeadData({
      name: 'A', // Too short - local validation error
      email: 'john@example.com',
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name', 'Name must be at least 2 characters long');
    expect(result.errors).toHaveProperty('company', 'Entity company error');
  });

  it('prioritizes local validation over entity validation for same field', () => {
    const mockValidateLead = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLead.mockReturnValue({
      success: false,
      error: {
        issues: [
          { path: ['email'], message: 'Entity email error' },
        ],
      },
    });

    const result = validateLeadData({
      name: 'John Doe',
      email: 'invalid-email', // Local validation error
    }, tenantId);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email', 'Please enter a valid email address');
    expect(result.errors).not.toHaveProperty('email', 'Entity email error');
  });
});
