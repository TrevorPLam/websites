/**
 * Test Setup Configuration
 *
 * Configures the testing environment for the admin application.
 * Sets up test utilities and mock configurations.
 *
 * @feature Testing Infrastructure
 * @layer __tests__
 * @priority medium
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

import '@testing-library/jest-dom';
import { ReactNode } from 'react';

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Global test utilities
export const createMockTenant = (overrides = {}) => ({
  id: '1',
  slug: 'test-tenant',
  name: 'Test Tenant',
  plan: 'free',
  status: 'active',
  features: [],
  billingStatus: 'current',
  createdAt: new Date(),
  updatedAt: new Date(),
  maxUsers: 5,
  maxSites: 1,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'tenant_admin',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  mfaEnabled: false,
  permissions: ['tenant_management'],
  ...overrides,
});

export const createMockSystemMetrics = (overrides = {}) => ({
  id: '1',
  metricType: 'cpu',
  value: 50,
  unit: '%',
  timestamp: new Date(),
  source: 'server-1',
  ...overrides,
});
