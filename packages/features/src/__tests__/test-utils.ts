/**
 * @file packages/features/src/__tests__/test-utils.ts
 * @summary Test utilities for features package with mocks and fixtures.
 * @description Provides mock server actions, adapters, and test fixtures for unit testing.
 * @security Mock implementations only, no real data access or authentication.
 * @adr none
 * @requirements none
 */

import { vi } from 'vitest';

/**
 * Mock server action result
 */
export function createMockActionResult<T>(data: T, error?: string) {
  return {
    success: !error,
    data: error ? undefined : data,
    error,
  };
}

/**
 * Mock adapter factory
 */
export function createMockAdapter<T>(mockData: T) {
  return {
    fetch: vi.fn().mockResolvedValue(mockData),
    create: vi.fn().mockResolvedValue(mockData),
    update: vi.fn().mockResolvedValue(mockData),
    delete: vi.fn().mockResolvedValue(true),
  };
}

/**
 * Common test fixtures for features
 */
export const featureFixtures = {
  team: {
    id: '1',
    name: 'John Doe',
    role: 'CEO',
    department: 'Executive',
    bio: 'John is the CEO.',
    avatar: '/avatars/john.jpg',
  },
  testimonial: {
    id: '1',
    name: 'Jane Smith',
    role: 'Customer',
    content: 'Great product!',
    rating: 5,
  },
  blogPost: {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    content: 'Test content',
    excerpt: 'Test excerpt',
    publishedAt: new Date().toISOString(),
  },
};
