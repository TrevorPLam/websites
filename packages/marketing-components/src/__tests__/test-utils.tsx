/**
 * @file packages/marketing-components/src/__tests__/test-utils.tsx
 * @role test
 * @summary Test utilities for marketing component tests
 *
 * Provides common test helpers and utilities for testing marketing components.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { axe, JestAxeOptions } from 'jest-axe';

/**
 * Custom render function that wraps components with providers if needed
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * Test accessibility violations using jest-axe
 */
export async function testA11y(
  container: HTMLElement,
  options?: JestAxeOptions
) {
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Common test data fixtures
 */
export const testFixtures = {
  hero: {
    title: 'Test Hero Title',
    subtitle: 'Test Hero Subtitle',
    cta: {
      label: 'Get Started',
      href: '/signup',
    },
  },
  teamMember: {
    id: '1',
    name: 'John Doe',
    role: 'CEO',
    department: 'Executive',
    bio: 'John is the CEO of the company.',
    avatar: '/avatars/john.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
    },
  },
  testimonial: {
    id: '1',
    name: 'Jane Smith',
    role: 'Customer',
    content: 'This is a great product!',
    rating: 5,
    avatar: '/avatars/jane.jpg',
  },
  service: {
    id: '1',
    title: 'Service Title',
    description: 'Service description',
    icon: 'service-icon',
  },
  pricing: {
    id: '1',
    name: 'Basic Plan',
    price: 29,
    period: 'month',
    features: ['Feature 1', 'Feature 2'],
  },
  location: {
    id: '1',
    name: 'Main Office',
    address: '123 Main St',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-1234',
    directionsUrl: 'https://maps.google.com',
  },
  menuCategory: {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal',
    items: [
      { id: 'a1', name: 'Soup', price: 600, description: 'Daily soup' },
      { id: 'a2', name: 'Salad', price: 800, dietaryTags: ['V', 'GF'] },
    ],
  },
};
