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
 * - testEnvironment is node; browser APIs require jsdom mocks
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Consider jsdom for UI tests if needed
 *
 * @verification
 * - Run: pnpm test and confirm tests resolve @repo/* aliases
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

/**
 * Root Jest configuration for monorepo.
 *
 * Handles testing across all packages:
 * - apps/web (Next.js app)
 * - packages/ui (React components)
 * - packages/utils (Pure utilities)
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],
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
  collectCoverageFrom: [
    // Hair salon template
    'templates/hair-salon/lib/**/*.{ts,tsx}',
    'templates/hair-salon/components/**/*.{ts,tsx}',
    'templates/hair-salon/features/**/*.{ts,tsx}',
    // UI library
    'packages/ui/src/**/*.{ts,tsx}',
    // Utils library
    'packages/utils/src/**/*.{ts,tsx}',
    // Exclude
    '!**/*.d.ts',
    '!**/index.ts', // Re-exports
    '!**/index.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.next', 'dist'],
  moduleNameMapper: {
    '^@repo/ui$': '<rootDir>/packages/ui/src/index.ts',
    '^@repo/utils$': '<rootDir>/packages/utils/src/index.ts',
    '^@repo/infra$': '<rootDir>/packages/infra/index.ts',
    '^@repo/infra/(.*)$': '<rootDir>/packages/infra/$1',
    '^@repo/shared/(.*)$': '<rootDir>/templates/shared/$1',
    '^@/(.*)$': '<rootDir>/templates/hair-salon/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '.next', 'dist'],
  // Exclude Next.js standalone output from module resolution (avoids duplicate @repo/* collisions)
  modulePathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/.*/\\.next'],
};
