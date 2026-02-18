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
 * - templates/hair-salon (Mixed) → jsdom for components, node for lib
 */

const sharedConfig = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
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
    '^@repo/infra/(.*)$': '<rootDir>/packages/infra/$1',
    '^@repo/types$': '<rootDir>/packages/types/src/index.ts',
    '^@repo/types/(.*)$': '<rootDir>/packages/types/src/$1',
    '^@repo/features$': '<rootDir>/packages/features/src/index.ts',
    '^@repo/features/(.*)$': '<rootDir>/packages/features/src/$1',
    '^@/(.*)$': '<rootDir>/templates/hair-salon/$1',
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
        '<rootDir>/packages/infra/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/lib/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/packages/features/**/lib/**/*.test.{ts,tsx}',
        '<rootDir>/templates/**/lib/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/templates/**/lib/**/*.test.{ts,tsx}',
        '<rootDir>/templates/**/__tests__/**/*.test.{ts,tsx}',
      ],
      collectCoverageFrom: [
        'packages/utils/src/**/*.{ts,tsx}',
        'packages/infra/**/*.{ts,tsx}',
        'packages/features/**/lib/**/*.{ts,tsx}',
        'templates/**/lib/**/*.{ts,tsx}',
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
        '<rootDir>/templates/**/components/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/templates/**/components/**/*.test.{ts,tsx}',
        '<rootDir>/templates/**/features/**/components/**/__tests__/**/*.test.{ts,tsx}',
      ],
      collectCoverageFrom: [
        'packages/ui/src/**/*.{ts,tsx}',
        'packages/features/**/components/**/*.{ts,tsx}',
        'templates/**/components/**/*.{ts,tsx}',
        'templates/**/features/**/components/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/index.ts',
        '!**/index.tsx',
      ],
    },
  ],
  collectCoverageFrom: [
    // Hair salon template
    'templates/hair-salon/lib/**/*.{ts,tsx}',
    'templates/hair-salon/components/**/*.{ts,tsx}',
    'templates/hair-salon/features/**/*.{ts,tsx}',
    // UI library
    'packages/ui/src/**/*.{ts,tsx}',
    // Utils library
    'packages/utils/src/**/*.{ts,tsx}',
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
};
