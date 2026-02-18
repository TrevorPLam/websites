/**
 * @file packages/features/src/__tests__/test-utils.ts
 * @role test
 * @summary Test utilities for feature module tests
 *
 * Provides common test helpers for testing feature modules including
 * mock adapters, server action mocks, and test fixtures.
 */

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
    fetch: jest.fn().mockResolvedValue(mockData),
    create: jest.fn().mockResolvedValue(mockData),
    update: jest.fn().mockResolvedValue(mockData),
    delete: jest.fn().mockResolvedValue(true),
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
