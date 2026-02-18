/**
 * @file jest.config.js
 * @role test
 * @summary Root Jest configuration for monorepo test runs.
 *
 * @entrypoints
 * - pnpm test / pnpm test:coverage
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - External: jest, ts-jest
 * - Internal: jest.setup.js
 *
 * @used_by
 * - Root test scripts in package.json
 *
 * @runtime
 * - environment: test
 * - side_effects: loads setup files and coverage settings
 *
 * @data_flow
 * - inputs: test files under __tests__ and *.(spec|test).ts(x)
 * - outputs: test results and coverage reports
 *
 * @invariants
 * - moduleNameMapper aliases must match workspace paths
 *
 * @gotchas
 * - Projects feature requires separate test environments
 * - Component tests must use jsdom, server tests use node
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Consider Vitest migration for faster ESM support (future)
 *
 * @verification
 * - Run: pnpm test and confirm tests resolve @repo/* aliases
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-17
 * - updated: Added projects feature for multiple test environments
 */

/**
 * Root Jest configuration for monorepo using projects feature.
 *
 * Uses Jest projects to support multiple test environments:
 * - Node environment: Server code, utilities, infra, server actions
 * - jsdom environment: React components, UI library, feature components
 *
 * Handles testing across all packages:
 * - packages/ui (React components) → jsdom
 * - packages/features (Mixed) → jsdom for components, node for actions
 * - packages/utils (Pure utilities) → node
 * - packages/infra (Server code) → node
 * - packages/utils, packages/infra, packages/features (Mixed) → node for lib, jsdom for components
 */

const sharedConfig = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@repo/ui$': '<rootDir>/packages/ui/src/index.ts',
    '^@repo/utils$': '<rootDir>/packages/utils/src/index.ts',
    '^@repo/infra$': '<rootDir>/packages/infra/index.ts',
    '^@repo/infra/client$': '<rootDir>/packages/infra/index.client.ts',
    '^@repo/infra/(.*)$': '<rootDir>/packages/infra/$1',
    '^@repo/types$': '<rootDir>/packages/types/src/index.ts',
    '^@repo/types/(.*)$': '<rootDir>/packages/types/src/$1',
    '^@repo/features$': '<rootDir>/packages/features/src/index.ts',
    '^@repo/features/(.*)$': '<rootDir>/packages/features/src/$1',
    '^@repo/marketing-components$': '<rootDir>/packages/marketing-components/src/index.ts',
    '^@repo/page-templates$': '<rootDir>/packages/page-templates/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '.next', 'dist'],
  modulePathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/.*/\\.next'],
};

module.exports = {
  projects: [
    // Node environment: Server code, utilities, infra
    {
      ...sharedConfig,
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/packages/utils/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/types/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/infra/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/lib/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/lib/**/*.test.{ts,tsx}',
      ],
      collectCoverageFrom: [
        'packages/utils/src/**/*.{ts,tsx}',
        'packages/types/src/**/*.{ts,tsx}',
        'packages/infra/**/*.{ts,tsx}',
        'packages/features/**/lib/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/index.ts',
        '!**/index.tsx',
      ],
    },
    // jsdom environment: React components, UI library
    {
      ...sharedConfig,
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/packages/ui/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/ui/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/components/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/components/**/*.test.{ts,tsx}',
        '<rootDir>/packages/marketing-components/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/marketing-components/**/*.test.{ts,tsx}',
      ],
      collectCoverageFrom: [
        'packages/ui/src/**/*.{ts,tsx}',
        'packages/features/**/components/**/*.{ts,tsx}',
        'packages/marketing-components/src/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/index.ts',
        '!**/index.tsx',
      ],
    },
  ],
  collectCoverageFrom: [
    // UI library
    'packages/ui/src/**/*.{ts,tsx}',
    // Utils library
    'packages/utils/src/**/*.{ts,tsx}',
    // Types
    'packages/types/src/**/*.{ts,tsx}',
    // Features
    'packages/features/src/**/*.{ts,tsx}',
    // Infra
    'packages/infra/**/*.{ts,tsx}',
    // Exclude
    '!**/*.d.ts',
    '!**/index.ts', // Re-exports
    '!**/index.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.next', 'dist', '__tests__'],
  coverageThreshold: {
    // Phase 1 target: 50% (docs/testing-strategy.md). Start at current baseline; raise as tests are added.
    global: {
      branches: 20,
      functions: 10,
      lines: 14,
      statements: 14,
    },
  },
};
